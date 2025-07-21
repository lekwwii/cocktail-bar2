from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List
import uuid
from datetime import datetime
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import asyncio
import io
import csv
import json


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Email configuration
email_conf = ConnectionConfig(
    MAIL_USERNAME=os.environ['MAIL_USERNAME'],
    MAIL_PASSWORD=os.environ['MAIL_PASSWORD'],
    MAIL_FROM=os.environ['MAIL_FROM'],
    MAIL_PORT=int(os.environ['MAIL_PORT']),
    MAIL_SERVER=os.environ['MAIL_SERVER'],
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

# Google Sheets configuration
def get_google_sheet():
    scope = ['https://spreadsheets.google.com/feeds',
             'https://www.googleapis.com/auth/spreadsheets',
             'https://www.googleapis.com/auth/drive']
    creds_path = ROOT_DIR / os.environ['GOOGLE_CREDENTIALS_PATH']
    creds = ServiceAccountCredentials.from_json_keyfile_name(str(creds_path), scope)
    client = gspread.authorize(creds)
    sheet = client.open(os.environ['GOOGLE_SHEET_NAME']).sheet1
    return sheet

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Contact Form Models
class ContactFormSubmission(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    service: str
    message: str
    submission_date: datetime = Field(default_factory=datetime.utcnow)

class ContactFormCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    service: str
    message: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Contact Form Endpoints
@api_router.post("/contact-form", response_model=ContactFormSubmission)
async def submit_contact_form(form_data: ContactFormCreate):
    """Submit contact form with email and Google Sheets integration"""
    try:
        # Create submission object
        submission_dict = form_data.dict()
        submission_obj = ContactFormSubmission(**submission_dict)
        
        # Save to MongoDB
        await db.contact_submissions.insert_one(submission_obj.dict())
        logger.info(f"Contact form saved to database: {submission_obj.id}")
        
        # Send email notification (async)
        asyncio.create_task(send_email_notification(submission_obj))
        
        # Add to Google Sheets (async)
        asyncio.create_task(add_to_google_sheets(submission_obj))
        
        return submission_obj
        
    except Exception as e:
        logger.error(f"Error processing contact form submission: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process form submission")

@api_router.get("/contact-submissions", response_model=List[ContactFormSubmission])
async def get_contact_submissions():
    """Get all contact form submissions for admin dashboard"""
    try:
        submissions = await db.contact_submissions.find().sort("submission_date", -1).to_list(1000)
        return [ContactFormSubmission(**submission) for submission in submissions]
    except Exception as e:
        logger.error(f"Error fetching contact submissions: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch submissions")

@api_router.get("/export-submissions-csv")
async def export_submissions_csv():
    """Export contact submissions to CSV"""
    try:
        # Create CSV content
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow(['Name', 'Email', 'Phone', 'Service', 'Message', 'Submission Date'])
        
        # Write data
        async for submission in db.contact_submissions.find().sort("submission_date", -1):
            writer.writerow([
                submission['name'],
                submission['email'],
                submission['phone'],
                submission['service'],
                submission['message'],
                submission['submission_date'].isoformat() if 'submission_date' in submission else ''
            ])
        
        # Create response
        output.seek(0)
        response = StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=contact_submissions.csv"}
        )
        return response
        
    except Exception as e:
        logger.error(f"Error exporting submissions: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to export submissions")

# Helper functions
async def send_email_notification(submission: ContactFormSubmission):
    """Send email notification for new contact form submission"""
    try:
        html_content = f"""
        <html>
        <body>
            <h2>🎯 Nový kontakt z webu THE BAR.</h2>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>📝 Jméno:</strong> {submission.name}</p>
                <p><strong>📧 Email:</strong> {submission.email}</p>
                <p><strong>📱 Telefon:</strong> {submission.phone}</p>
                <p><strong>🎪 Služba:</strong> {submission.service}</p>
                <p><strong>💬 Zpráva:</strong></p>
                <div style="background-color: white; padding: 15px; border-left: 4px solid #d4af37;">
                    {submission.message}
                </div>
                <p><strong>🕒 Datum odeslání:</strong> {submission.submission_date.strftime("%d.%m.%Y %H:%M")}</p>
            </div>
            <p style="color: #666; font-size: 12px;">Tato zpráva byla automaticky odeslána z kontaktního formuláře na webu THE BAR.</p>
        </body>
        </html>
        """
        
        message = MessageSchema(
            subject=f"🍸 Nový kontakt: {submission.name} - {submission.service}",
            recipients=["thebar.event@gmail.com"],
            body=html_content,
            subtype="html"
        )
        
        fm = FastMail(email_conf)
        await fm.send_message(message)
        logger.info(f"Email notification sent for submission: {submission.id}")
        
    except Exception as e:
        logger.error(f"Error sending email notification: {str(e)}")

async def add_to_google_sheets(submission: ContactFormSubmission):
    """Add submission to Google Sheets"""
    try:
        def sync_add_to_sheets():
            sheet = get_google_sheet()
            row = [
                submission.name,
                submission.email,
                submission.phone,
                submission.service,
                submission.message,
                submission.submission_date.strftime("%d.%m.%Y %H:%M")
            ]
            sheet.append_row(row)
            
        # Run Google Sheets operation in thread pool to avoid blocking
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, sync_add_to_sheets)
        logger.info(f"Added submission to Google Sheets: {submission.id}")
        
    except Exception as e:
        logger.error(f"Error adding to Google Sheets: {str(e)}")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

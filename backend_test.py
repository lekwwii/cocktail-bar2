#!/usr/bin/env python3
"""
Backend API Testing Suite for THE BAR. Luxury Cocktail Catering Website
Tests all backend endpoints to verify no regressions after frontend bug fixes.
"""

import requests
import json
import sys
from datetime import datetime
import uuid

# Load backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    base_url = line.split('=', 1)[1].strip()
                    return f"{base_url}/api"
        raise ValueError("REACT_APP_BACKEND_URL not found in frontend/.env")
    except Exception as e:
        print(f"Error reading backend URL: {e}")
        return None

class BackendTester:
    def __init__(self):
        self.base_url = get_backend_url()
        self.session = requests.Session()
        self.test_results = []
        
    def log_test(self, test_name, success, message, response_data=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        
        self.test_results.append({
            'test': test_name,
            'success': success,
            'message': message,
            'response_data': response_data
        })
        
    def test_server_connectivity(self):
        """Test if backend server is running and responsive"""
        try:
            response = self.session.get(f"{self.base_url}/", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get('message') == 'Hello World':
                    self.log_test("Server Connectivity", True, "Backend server is running and responsive", data)
                    return True
                else:
                    self.log_test("Server Connectivity", False, f"Unexpected response: {data}")
                    return False
            else:
                self.log_test("Server Connectivity", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except requests.exceptions.RequestException as e:
            self.log_test("Server Connectivity", False, f"Connection error: {str(e)}")
            return False
    
    def test_create_status_check(self):
        """Test POST /api/status endpoint"""
        try:
            # Test data with realistic cocktail catering context
            test_data = {
                "client_name": "Prague Corporate Event - Luxury Cocktail Service"
            }
            
            response = self.session.post(
                f"{self.base_url}/status",
                json=test_data,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                # Verify response structure
                required_fields = ['id', 'client_name', 'timestamp']
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_test("Create Status Check", False, f"Missing fields: {missing_fields}")
                    return False, None
                
                # Verify data integrity
                if data['client_name'] != test_data['client_name']:
                    self.log_test("Create Status Check", False, "Client name mismatch in response")
                    return False, None
                
                # Verify UUID format
                try:
                    uuid.UUID(data['id'])
                except ValueError:
                    self.log_test("Create Status Check", False, "Invalid UUID format in response")
                    return False, None
                
                # Verify timestamp format
                try:
                    datetime.fromisoformat(data['timestamp'].replace('Z', '+00:00'))
                except ValueError:
                    self.log_test("Create Status Check", False, "Invalid timestamp format in response")
                    return False, None
                
                self.log_test("Create Status Check", True, "Status check created successfully", data)
                return True, data['id']
            else:
                self.log_test("Create Status Check", False, f"HTTP {response.status_code}: {response.text}")
                return False, None
                
        except requests.exceptions.RequestException as e:
            self.log_test("Create Status Check", False, f"Request error: {str(e)}")
            return False, None
    
    def test_get_status_checks(self):
        """Test GET /api/status endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/status", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                # Verify response is a list
                if not isinstance(data, list):
                    self.log_test("Get Status Checks", False, "Response is not a list")
                    return False
                
                # If there are items, verify structure
                if data:
                    first_item = data[0]
                    required_fields = ['id', 'client_name', 'timestamp']
                    missing_fields = [field for field in required_fields if field not in first_item]
                    
                    if missing_fields:
                        self.log_test("Get Status Checks", False, f"Missing fields in response items: {missing_fields}")
                        return False
                
                self.log_test("Get Status Checks", True, f"Retrieved {len(data)} status checks", {'count': len(data)})
                return True
            else:
                self.log_test("Get Status Checks", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Get Status Checks", False, f"Request error: {str(e)}")
            return False
    
    def test_cors_headers(self):
        """Test CORS configuration"""
        try:
            # Test preflight request
            response = self.session.options(
                f"{self.base_url}/status",
                headers={
                    'Origin': 'https://example.com',
                    'Access-Control-Request-Method': 'POST',
                    'Access-Control-Request-Headers': 'Content-Type'
                },
                timeout=10
            )
            
            cors_headers = {
                'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
                'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
                'access-control-allow-headers': response.headers.get('access-control-allow-headers')
            }
            
            if cors_headers['access-control-allow-origin'] == '*':
                self.log_test("CORS Configuration", True, "CORS headers properly configured", cors_headers)
                return True
            else:
                self.log_test("CORS Configuration", False, f"CORS not properly configured: {cors_headers}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("CORS Configuration", False, f"Request error: {str(e)}")
            return False
    
    def test_error_handling(self):
        """Test error handling for invalid requests"""
        try:
            # Test invalid JSON
            response = self.session.post(
                f"{self.base_url}/status",
                data="invalid json",
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code in [400, 422]:  # FastAPI returns 422 for validation errors
                self.log_test("Error Handling", True, f"Properly handles invalid JSON (HTTP {response.status_code})")
                return True
            else:
                self.log_test("Error Handling", False, f"Unexpected response to invalid JSON: HTTP {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Error Handling", False, f"Request error: {str(e)}")
            return False
    
    def test_multilingual_contact_forms(self):
        """Test backend handling of contact form data from different language interfaces"""
        languages = {
            'cs': 'Luxusní koktejlová služba pro firemní akci v Praze',
            'en': 'Luxury cocktail service for corporate event in Prague', 
            'ru': 'Роскошный коктейльный сервис для корпоративного мероприятия в Праге',
            'uk': 'Розкішний коктейльний сервіс для корпоративної події в Празі'
        }
        
        try:
            for lang_code, client_name in languages.items():
                test_data = {
                    "client_name": f"[{lang_code.upper()}] {client_name}"
                }
                
                response = self.session.post(
                    f"{self.base_url}/status",
                    json=test_data,
                    headers={
                        'Content-Type': 'application/json',
                        'Accept-Language': lang_code
                    },
                    timeout=10
                )
                
                if response.status_code != 200:
                    self.log_test("Multilingual Contact Forms", False, f"Failed for {lang_code}: HTTP {response.status_code}")
                    return False
                
                data = response.json()
                if data['client_name'] != test_data['client_name']:
                    self.log_test("Multilingual Contact Forms", False, f"Data corruption for {lang_code}")
                    return False
            
            self.log_test("Multilingual Contact Forms", True, "Backend properly handles contact forms from all 4 language interfaces")
            return True
            
        except requests.exceptions.RequestException as e:
            self.log_test("Multilingual Contact Forms", False, f"Request error: {str(e)}")
            return False
    
    def test_rapid_language_switching_performance(self):
        """Test backend performance during rapid language switching scenarios"""
        try:
            import time
            
            # Simulate rapid requests with different language headers
            languages = ['cs', 'en', 'ru', 'uk']
            start_time = time.time()
            successful_requests = 0
            
            for i in range(20):  # 20 rapid requests
                lang = languages[i % 4]
                test_data = {
                    "client_name": f"Performance Test {i+1} - Language {lang.upper()}"
                }
                
                response = self.session.post(
                    f"{self.base_url}/status",
                    json=test_data,
                    headers={
                        'Content-Type': 'application/json',
                        'Accept-Language': lang
                    },
                    timeout=5
                )
                
                if response.status_code == 200:
                    successful_requests += 1
            
            end_time = time.time()
            duration = end_time - start_time
            
            if successful_requests == 20 and duration < 10:  # All requests successful within 10 seconds
                self.log_test("Rapid Language Switching Performance", True, 
                            f"Backend handled 20 rapid multilingual requests in {duration:.2f}s")
                return True
            else:
                self.log_test("Rapid Language Switching Performance", False, 
                            f"Performance issue: {successful_requests}/20 successful in {duration:.2f}s")
                return False
                
        except Exception as e:
            self.log_test("Rapid Language Switching Performance", False, f"Performance test error: {str(e)}")
            return False
    
    def test_multilingual_cors_headers(self):
        """Test CORS configuration works properly for multilingual frontend requests"""
        try:
            # Test CORS with different language origins
            multilingual_origins = [
                'https://thebar.cz',
                'https://thebar.com', 
                'https://thebar.ru',
                'https://thebar.ua'
            ]
            
            for origin in multilingual_origins:
                response = self.session.options(
                    f"{self.base_url}/status",
                    headers={
                        'Origin': origin,
                        'Access-Control-Request-Method': 'POST',
                        'Access-Control-Request-Headers': 'Content-Type, Accept-Language'
                    },
                    timeout=10
                )
                
                cors_origin = response.headers.get('access-control-allow-origin')
                if cors_origin != '*':
                    self.log_test("Multilingual CORS Headers", False, 
                                f"CORS failed for {origin}: {cors_origin}")
                    return False
            
            self.log_test("Multilingual CORS Headers", True, 
                        "CORS properly configured for multilingual frontend requests")
            return True
            
        except requests.exceptions.RequestException as e:
            self.log_test("Multilingual CORS Headers", False, f"CORS test error: {str(e)}")
            return False
    
    def test_database_operations_multilingual(self):
        """Test database operations work correctly with multilingual data"""
        try:
            # Create records with multilingual content
            multilingual_data = [
                {"client_name": "Svatební koktejly - Zámek Troja"},
                {"client_name": "Wedding Cocktails - Troja Castle"},
                {"client_name": "Свадебные коктейли - Замок Троя"},
                {"client_name": "Весільні коктейлі - Замок Троя"}
            ]
            
            created_ids = []
            
            # Create multilingual records
            for data in multilingual_data:
                response = self.session.post(
                    f"{self.base_url}/status",
                    json=data,
                    headers={'Content-Type': 'application/json'},
                    timeout=10
                )
                
                if response.status_code != 200:
                    self.log_test("Database Operations Multilingual", False, 
                                f"Failed to create record: {data['client_name']}")
                    return False
                
                created_ids.append(response.json()['id'])
            
            # Retrieve and verify multilingual records
            response = self.session.get(f"{self.base_url}/status", timeout=10)
            if response.status_code != 200:
                self.log_test("Database Operations Multilingual", False, "Failed to retrieve records")
                return False
            
            records = response.json()
            
            # Verify all multilingual records exist
            created_names = [data['client_name'] for data in multilingual_data]
            retrieved_names = [record['client_name'] for record in records]
            
            missing_records = [name for name in created_names if name not in retrieved_names]
            if missing_records:
                self.log_test("Database Operations Multilingual", False, 
                            f"Missing multilingual records: {missing_records}")
                return False
            
            self.log_test("Database Operations Multilingual", True, 
                        "Database properly stores and retrieves multilingual data")
            return True
            
        except Exception as e:
            self.log_test("Database Operations Multilingual", False, f"Database test error: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("=" * 60)
        print("BACKEND API TESTING SUITE - THE BAR. LUXURY COCKTAIL CATERING")
        print("=" * 60)
        print(f"Testing backend at: {self.base_url}")
        print()
        
        if not self.base_url:
            print("❌ CRITICAL: Could not determine backend URL")
            return False
        
        # Test sequence
        tests = [
            self.test_server_connectivity,
            self.test_create_status_check,
            self.test_get_status_checks,
            self.test_cors_headers,
            self.test_error_handling
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            try:
                if test == self.test_create_status_check:
                    success, _ = test()
                else:
                    success = test()
                if success:
                    passed += 1
            except Exception as e:
                print(f"❌ FAIL {test.__name__}: Unexpected error: {str(e)}")
        
        print()
        print("=" * 60)
        print(f"BACKEND TEST RESULTS: {passed}/{total} tests passed")
        print("=" * 60)
        
        # Summary
        if passed == total:
            print("✅ ALL BACKEND TESTS PASSED - No regressions detected")
            return True
        else:
            print(f"❌ {total - passed} BACKEND TESTS FAILED - Issues detected")
            return False

def main():
    """Main test execution"""
    tester = BackendTester()
    success = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
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
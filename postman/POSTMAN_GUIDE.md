# Employee Management System - Postman Documentation

This document provides comprehensive instructions for testing the Employee Management System API using Postman.

## 📦 Files Included

1. **Employee_Management_API.postman_collection.json** - Complete API collection
2. **Employee_Management.postman_environment.json** - Environment variables
3. **POSTMAN_GUIDE.md** - This documentation file

## 🚀 Quick Setup

### 1. Import Collection and Environment

1. Open Postman
2. Click **Import** button
3. Drag and drop both JSON files:
   - `Employee_Management_API.postman_collection.json`
   - `Employee_Management.postman_environment.json`
4. Select the **Employee Management Environment** from the environment dropdown

### 2. Start the Server

Ensure your Node.js server is running:
```bash
npm run dev
```

### 3. Create Default Users

Run the seed script to create default test users:
```bash
npm run seed-users
```

## 🔐 Authentication Flow

### Default Test Accounts

| Role | Username | Email | Password |
|------|----------|-------|----------|
| Admin | admin | admin@company.com | admin123 |
| HR Manager | hr_manager | hr@company.com | hr123456 |
| IT Manager | it_manager | manager@company.com | manager123 |
| Employee | john_employee | john.employee@company.com | employee123 |

### Authentication Steps

1. **Login** using any of the login requests in the "Authentication" folder
2. The access token will be **automatically saved** to the `accessToken` variable
3. All subsequent requests will use this token automatically

## 📁 Collection Structure

### 🔑 Authentication Folder
- **Register User** - Create new user account
- **Login** - Get access token (multiple role examples)
- **Get Profile** - View current user profile
- **Update Profile** - Modify user information
- **Change Password** - Update user password
- **Verify Token** - Check token validity
- **Logout** - Invalidate refresh token

### 👥 Employee Management Folder
- **Create Employee** - Add new employee (HR/Admin only)
- **Get All Employees** - List with pagination (Manager+ only)
- **Get Employee by ID** - Individual employee details
- **Update Employee** - Modify employee data (HR/Admin only)
- **Delete Employee** - Soft delete employee (HR/Admin only)
- **Search Employees** - Search by name (Manager+ only)
- **Get by Department** - Department-specific listing (Manager+ only)
- **Get Statistics** - Employee analytics (HR/Admin only)
- **Get by Employee ID** - Find by auto-generated ID

### 🏥 System Folder
- **Health Check** - API status check
- **API Information** - Available endpoints info

### 🧪 Testing Scenarios Folder
- **Test Employee Access** - Permission testing
- **Test Invalid Token** - Error handling
- **Test No Token** - Authentication verification

## 🎯 Testing Workflows

### Workflow 1: Admin Full Access
1. Login as **Admin** (`admin` / `admin123`)
2. Create a new employee
3. View all employees
4. Update employee data
5. View statistics
6. Delete employee

### Workflow 2: HR Operations
1. Login as **HR Manager** (`hr_manager` / `hr123456`)
2. Create employees
3. View employee statistics
4. Update employee information
5. Search employees

### Workflow 3: Manager Limited Access
1. Login as **Manager** (`it_manager` / `manager123`)
2. View department employees
3. Search employees
4. Try to create employee (should fail - 403 Forbidden)

### Workflow 4: Employee Restricted Access
1. Login as **Employee** (`john_employee` / `employee123`)
2. View own profile
3. Update own profile
4. Try to view all employees (should fail - 403 Forbidden)

## 🔧 Environment Variables

The collection uses these variables (automatically managed):

- `baseUrl` - API base URL (http://localhost:5000/api)
- `accessToken` - JWT access token (auto-saved after login)
- `userId` - Current user ID (auto-saved after login)
- `employeeId` - Last created employee ID (auto-saved after creation)

## 📊 Expected Response Codes

### Success Responses
- **200 OK** - Successful GET, PUT, DELETE operations
- **201 Created** - Successful POST operations (user/employee creation)

### Error Responses
- **400 Bad Request** - Validation errors, malformed data
- **401 Unauthorized** - Missing or invalid token
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **429 Too Many Requests** - Rate limit exceeded
- **500 Internal Server Error** - Server errors

## 🧪 Testing Different Roles

### Admin Role Testing
```json
POST {{baseUrl}}/auth/login
{
  "identifier": "admin",
  "password": "admin123"
}
```
**Can access:** All endpoints

### HR Role Testing
```json
POST {{baseUrl}}/auth/login
{
  "identifier": "hr_manager", 
  "password": "hr123456"
}
```
**Can access:** Employee CRUD, statistics, search

### Manager Role Testing
```json
POST {{baseUrl}}/auth/login
{
  "identifier": "it_manager",
  "password": "manager123"
}
```
**Can access:** View employees, search, department data

### Employee Role Testing
```json
POST {{baseUrl}}/auth/login
{
  "identifier": "john_employee",
  "password": "employee123"
}
```
**Can access:** Own profile and data only

## 🛡️ Security Features Testing

### Rate Limiting Test
1. Try login with wrong password 5+ times
2. Should return 429 Too Many Requests

### Token Expiration Test
1. Login and save token
2. Wait for token expiration (24 hours by default)
3. Try accessing protected endpoint
4. Should return 401 Unauthorized

### Permission Boundary Test
1. Login as Employee
2. Try accessing admin/HR endpoints
3. Should return 403 Forbidden

## 📝 Sample Request Bodies

### Create Employee
```json
{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john.doe@company.com",
  "phone": "+1234567890",
  "department": "IT",
  "position": "Software Developer",
  "salary": 75000,
  "address": {
    "street": "123 Main St",
    "city": "New York", 
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```

### Register User
```json
{
  "username": "new_user",
  "email": "newuser@company.com",
  "password": "password123",
  "firstName": "New",
  "lastName": "User",
  "role": "employee",
  "department": "IT"
}
```

### Update Employee
```json
{
  "position": "Senior Software Developer",
  "salary": 85000,
  "department": "IT"
}
```

## 🔍 Query Parameters

### Pagination
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - Sort direction: asc/desc (default: desc)

### Filtering
- `department` - Filter by department
- `isActive` - Filter by active status
- `q` - Search term (for search endpoints)

### Example with Query Parameters
```
GET {{baseUrl}}/employees?page=1&limit=5&sortBy=firstName&sortOrder=asc&department=IT
```

## 🚨 Common Issues & Solutions

### Issue: 401 Unauthorized
**Solution:** 
1. Check if you're logged in
2. Verify the accessToken variable is set
3. Login again if token expired

### Issue: 403 Forbidden  
**Solution:**
1. Check your user role
2. Verify endpoint permissions
3. Login with appropriate role

### Issue: 404 Not Found
**Solution:**
1. Check the URL path
2. Verify resource exists
3. Check if server is running

### Issue: 500 Internal Server Error
**Solution:**
1. Check server logs
2. Verify MongoDB is running
3. Check environment variables

## 📋 Testing Checklist

- [ ] Import collection and environment
- [ ] Start the server (`npm run dev`)
- [ ] Create default users (`npm run seed-users`)
- [ ] Test health check endpoint
- [ ] Login as Admin and test full access
- [ ] Login as HR and test employee management
- [ ] Login as Manager and test view permissions
- [ ] Login as Employee and test restricted access
- [ ] Test permission boundaries (403 errors)
- [ ] Test invalid token scenarios (401 errors)
- [ ] Test rate limiting
- [ ] Test pagination and filtering
- [ ] Test search functionality
- [ ] Test employee CRUD operations

## 🎉 Success Criteria

Your API testing is successful when:
1. All role-based permissions work correctly
2. Authentication flows work smoothly
3. CRUD operations function as expected
4. Error handling returns appropriate status codes
5. Rate limiting protects sensitive endpoints
6. Search and pagination work correctly

---

**Happy Testing! 🚀**

For issues or questions, check the server logs or API documentation in the README.md file.

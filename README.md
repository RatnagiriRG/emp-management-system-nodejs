# Employee Management System API

A comprehensive employee management system built with Node.js, Express, MongoDB, and the Repository pattern.

## Features

- **Complete CRUD Operations**: Create, Read, Update, Delete employees
- **JWT Authentication**: Secure authentication with access and refresh tokens
- **Role-Based Authorization**: Admin, HR, Manager, and Employee roles with different permissions
- **Repository Pattern**: Clean architecture with separation of concerns
- **Advanced Search**: Search employees by name, department, and other criteria
- **Pagination**: Efficient data retrieval with pagination support
- **Employee Statistics**: Get insights about employee distribution and salary data
- **Data Validation**: Comprehensive input validation and error handling
- **Auto-Generated Employee IDs**: Automatic generation of unique employee identifiers
- **Soft Delete**: Safe deletion with the ability to restore employees
- **Password Security**: Bcrypt hashing for secure password storage
- **Rate Limiting**: Protection against brute force attacks
- **RESTful API**: Well-structured API endpoints following REST conventions

## Project Structure

```
src/
├── config/
│   └── database.js          # MongoDB connection configuration
├── models/
│   ├── Employee.js          # Employee data model and schema
│   └── User.js              # User data model for authentication
├── repositories/
│   ├── EmployeeRepository.js # Employee data access layer
│   └── UserRepository.js    # User data access layer
├── services/
│   ├── EmployeeService.js   # Employee business logic layer
│   └── AuthService.js       # Authentication business logic
├── controllers/
│   ├── EmployeeController.js # Employee request handling
│   └── AuthController.js    # Authentication request handling
├── routes/
│   ├── index.js             # Main route configuration
│   ├── employeeRoutes.js    # Employee-specific routes
│   └── authRoutes.js        # Authentication routes
└── middleware/
    ├── errorHandler.js      # Global error handling
    ├── middleware.js        # Custom middleware functions
    └── auth.js              # Authentication and authorization middleware
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your MongoDB connection string and other configurations.

4. Start MongoDB service on your system

5. Create default users (admin, HR, manager, employee):
   ```bash
   npm run seed-users
   ```

6. Optionally seed sample employee data:
   ```bash
   npm run seed
   ```

7. Run the application:
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 🚀 Deploy to Render PostgreSQL (FREE)

### Quick Deploy in 10 Minutes

1. **Create PostgreSQL database** on Render (FREE for 90 days)
2. **Deploy web service** from GitHub  
3. **Set environment variables**
4. **Your API is live!**

📖 **Deployment guide**: See [DEPLOY_NOW.md](./DEPLOY_NOW.md) for quick setup or [RENDER_POSTGRESQL_GUIDE.md](./RENDER_POSTGRESQL_GUIDE.md) for detailed instructions.

### Environment Variables for Render
```env
NODE_ENV=production
PORT=10000
DB_TYPE=postgres
DATABASE_URL=postgresql://admin:password@dpg-xxx.render.com/employee_management
JWT_SECRET=your-strong-production-secret
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| POST | `/api/auth/logout` | Logout user | Authenticated |
| POST | `/api/auth/refresh-token` | Refresh access token | Public |
| POST | `/api/auth/change-password` | Change password | Authenticated |
| GET | `/api/auth/profile` | Get user profile | Authenticated |
| PUT | `/api/auth/profile` | Update user profile | Authenticated |
| GET | `/api/auth/verify` | Verify token | Authenticated |

### Employee Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/employees` | Create a new employee | HR/Admin |
| GET | `/api/employees` | Get all employees (with pagination) | Manager+ |
| GET | `/api/employees/:id` | Get employee by ID | Own data/Manager+ |
| GET | `/api/employees/employee-id/:employeeId` | Get employee by employee ID | Own data/Manager+ |
| PUT | `/api/employees/:id` | Update employee | HR/Admin |
| DELETE | `/api/employees/:id` | Delete employee (soft delete) | HR/Admin |
| GET | `/api/employees/department/:department` | Get employees by department | Manager+ |
| GET | `/api/employees/search?q=searchTerm` | Search employees by name | Manager+ |
| GET | `/api/employees/statistics` | Get employee statistics | HR/Admin |

### System

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/health` | Health check | Public |
| GET | `/api` | API information | Public |

## Authentication & Authorization

### User Roles
- **Admin**: Full system access, can manage all users and employees
- **HR**: Can manage employees, view statistics, but limited user management
- **Manager**: Can view employees in their department, limited employee management
- **Employee**: Can only view their own profile and data

### JWT Token Usage
All protected endpoints require an Authorization header:
```
Authorization: Bearer <access_token>
```

Refresh tokens are automatically managed via secure HTTP-only cookies.

## Request/Response Examples

### Register User
```json
POST /api/auth/register
{
  "username": "john_doe",
  "email": "john.doe@company.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "employee",
  "department": "IT"
}
```

### Login
```json
POST /api/auth/login
{
  "identifier": "john_doe", // username or email
  "password": "securepassword123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {...},
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Create Employee (Requires HR/Admin role)
```json
POST /api/employees
Authorization: Bearer <access_token>
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

### Get All Employees (with pagination) (Requires Manager+ role)
```json
GET /api/employees?page=1&limit=10&sortBy=firstName&sortOrder=asc&department=IT
Authorization: Bearer <access_token>

Response:
{
  "success": true,
  "message": "Employees retrieved successfully",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

## User Schema

```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  firstName: String (required),
  lastName: String (required),
  role: String (enum: ['admin', 'hr', 'manager', 'employee']),
  employeeId: String (optional, unique),
  department: String (optional),
  isActive: Boolean (default: true),
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Employee Schema

```javascript
{
  employeeId: String (auto-generated, unique),
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  phone: String (required),
  department: String (required, enum: ['HR', 'IT', 'Finance', 'Marketing', 'Operations', 'Sales']),
  position: String (required),
  salary: Number (required),
  dateOfJoining: Date (default: now),
  isActive: Boolean (default: true),
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String (default: 'India')
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Environment Variables

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/employee_management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=24h
REFRESH_TOKEN_EXPIRE=7d
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

## Repository Pattern

This project implements the Repository pattern for clean architecture:

- **Models**: Define data structure and validation (Employee, User)
- **Repositories**: Handle data access and database operations
- **Services**: Contain business logic and validation (EmployeeService, AuthService)
- **Controllers**: Handle HTTP requests and responses (EmployeeController, AuthController)
- **Routes**: Define API endpoints and middleware
- **Middleware**: Authentication, authorization, and cross-cutting concerns

## Features in Detail

### Authentication Features
- JWT-based authentication with access and refresh tokens
- Secure password hashing with bcrypt
- Role-based access control (RBAC)
- Rate limiting for sensitive operations
- Secure HTTP-only cookies for refresh tokens
- Token verification and refresh mechanism

### Authorization Levels
- **Public**: Registration, login, token refresh
- **Authenticated**: Profile management, own data access
- **Employee**: View own employee data
- **Manager**: View department employees
- **HR**: Manage employees, view statistics
- **Admin**: Full system access

### Security Features
- Password hashing with bcrypt (12 rounds)
- JWT tokens with configurable expiration
- Rate limiting for login attempts
- Input validation and sanitization
- Secure cookie handling
- CORS protection
- Format: `EMP{YEAR}{SEQUENCE}` (e.g., EMP20250001)
- Automatically increments for each new employee
- Year-based sequencing

### Auto-Generated Employee IDs
- Configurable page size
- Sort by any field in ascending/descending order
- Returns pagination metadata

### Search Functionality
- Search by first name or last name
- Case-insensitive search
- Supports partial matches

### Statistics
- Total active employees
- Employee count by department
- Average salary calculation

### Error Handling
- Comprehensive error messages
- Validation error details
- HTTP status code mapping
- Global error handler

## Development

### Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run seed-users # Create default users (admin, hr, manager, employee)
npm run seed       # Seed sample employee data
npm test           # Run tests (if configured)
```

### Default Users
After running `npm run seed-users`, you'll have these default accounts:

| Username | Email | Password | Role |
|----------|-------|----------|------|
| admin | admin@company.com | admin123 | admin |
| hr_manager | hr@company.com | hr123456 | hr |
| it_manager | manager@company.com | manager123 | manager |
| john_employee | john.employee@company.com | employee123 | employee |

### Dependencies
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT token handling
- **cookie-parser**: Cookie parsing middleware
- **nodemon**: Development auto-restart (dev dependency)

## License

This project is licensed under the ISC License.

## 📮 Postman Documentation

Complete Postman collection and documentation are available in the `/postman` folder:

- **Employee_Management_API.postman_collection.json** - Full API collection with automated token management
- **Employee_Management.postman_environment.json** - Environment variables and test credentials
- **POSTMAN_GUIDE.md** - Comprehensive testing guide and workflows

### Quick Postman Setup:
1. Import both JSON files into Postman
2. Select "Employee Management Environment"
3. Start with the "Login" requests to get access tokens
4. Test different user roles and permissions

The collection includes:
- ✅ Automated token management
- ✅ Role-based testing scenarios (Admin, HR, Manager, Employee)
- ✅ Error case testing
- ✅ Permission boundary testing
- ✅ Sample data for all endpoints
# emp-management-system-nodejs

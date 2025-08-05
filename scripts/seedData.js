const EmployeeService = require('../src/services/EmployeeService');
const connectDB = require('../src/config/database');

const employeeService = new EmployeeService();

const sampleEmployees = [
  {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    phone: "+1234567890",
    department: "IT",
    position: "Software Developer",
    salary: 75000,
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA"
    }
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@company.com",
    phone: "+1234567891",
    department: "HR",
    position: "HR Manager",
    salary: 85000,
    address: {
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
      country: "USA"
    }
  },
  {
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike.johnson@company.com",
    phone: "+1234567892",
    department: "Finance",
    position: "Financial Analyst",
    salary: 65000,
    address: {
      street: "789 Pine Rd",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "USA"
    }
  },
  {
    firstName: "Sarah",
    lastName: "Williams",
    email: "sarah.williams@company.com",
    phone: "+1234567893",
    department: "Marketing",
    position: "Marketing Specialist",
    salary: 55000,
    address: {
      street: "321 Elm St",
      city: "Miami",
      state: "FL",
      zipCode: "33101",
      country: "USA"
    }
  },
  {
    firstName: "David",
    lastName: "Brown",
    email: "david.brown@company.com",
    phone: "+1234567894",
    department: "IT",
    position: "DevOps Engineer",
    salary: 80000,
    address: {
      street: "654 Maple Dr",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      country: "USA"
    }
  }
];

async function seedData() {
  try {
    // Connect to database
    await connectDB();
    
    console.log('🌱 Starting data seeding...');
    
    for (const employeeData of sampleEmployees) {
      try {
        const employee = await employeeService.createEmployee(employeeData);
        console.log(`✅ Created employee: ${employee.firstName} ${employee.lastName} (${employee.employeeId})`);
      } catch (error) {
        console.log(`⚠️  Skipped ${employeeData.firstName} ${employeeData.lastName}: ${error.message}`);
      }
    }
    
    console.log('🎉 Data seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedData();
}

module.exports = { sampleEmployees, seedData };

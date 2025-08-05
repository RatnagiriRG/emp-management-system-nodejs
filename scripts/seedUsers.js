const AuthService = require('../src/services/AuthService');
const connectDB = require('../src/config/database');

const authService = new AuthService();

const adminUser = {
  username: 'admin',
  email: 'admin@company.com',
  password: 'admin123',
  firstName: 'System',
  lastName: 'Administrator',
  role: 'admin',
  department: 'IT'
};

const hrUser = {
  username: 'hr_manager',
  email: 'hr@company.com',
  password: 'hr123456',
  firstName: 'HR',
  lastName: 'Manager',
  role: 'hr',
  department: 'HR'
};

const managerUser = {
  username: 'it_manager',
  email: 'manager@company.com',
  password: 'manager123',
  firstName: 'IT',
  lastName: 'Manager',
  role: 'manager',
  department: 'IT'
};

const employeeUser = {
  username: 'john_employee',
  email: 'john.employee@company.com',
  password: 'employee123',
  firstName: 'John',
  lastName: 'Employee',
  role: 'employee',
  department: 'IT'
};

async function seedUsers() {
  try {
    // Connect to database
    await connectDB();
    
    console.log('🌱 Starting user seeding...');
    
    const users = [adminUser, hrUser, managerUser, employeeUser];
    
    for (const userData of users) {
      try {
        const result = await authService.register(userData);
        console.log(`✅ Created user: ${result.user.username} (${result.user.role}) - ${result.user.email}`);
      } catch (error) {
        console.log(`⚠️  Skipped ${userData.username}: ${error.message}`);
      }
    }
    
    console.log('\n🎉 User seeding completed!');
    console.log('\n📋 Default Users Created:');
    console.log('┌─────────────┬─────────────────────┬─────────────┬──────────┐');
    console.log('│ Username    │ Email               │ Password    │ Role     │');
    console.log('├─────────────┼─────────────────────┼─────────────┼──────────┤');
    console.log('│ admin       │ admin@company.com   │ admin123    │ admin    │');
    console.log('│ hr_manager  │ hr@company.com      │ hr123456    │ hr       │');
    console.log('│ it_manager  │ manager@company.com │ manager123  │ manager  │');
    console.log('│ john_employee│ john.employee@...   │ employee123 │ employee │');
    console.log('└─────────────┴─────────────────────┴─────────────┴──────────┘');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedUsers();
}

module.exports = { seedUsers, adminUser, hrUser, managerUser, employeeUser };

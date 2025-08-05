const { Sequelize } = require('sequelize');

let sequelize;
let User, Employee;

const connectDB = async () => {
  try {
    // Use environment variable or default to local PostgreSQL
    const databaseUrl = process.env.DATABASE_URL || 'postgresql://localhost:5432/employee_management';
    
    sequelize = new Sequelize(databaseUrl, {
      dialect: 'postgres',
      dialectOptions: process.env.NODE_ENV === 'production' ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      } : {},
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
    });

    await sequelize.authenticate();
    console.log('PostgreSQL Connected successfully');

    // Initialize models
    User = require('../models/UserPostgres')(sequelize);
    Employee = require('../models/EmployeePostgres')(sequelize);

    // Sync models in development (create tables)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database synchronized');
    } else {
      // In production, just sync without altering existing tables
      await sequelize.sync();
      console.log('Database models synchronized');
    }

  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

const getSequelize = () => {
  if (!sequelize) {
    throw new Error('Database not initialized. Call connectDB() first.');
  }
  return sequelize;
};

const getModels = () => {
  if (!User || !Employee) {
    throw new Error('Models not initialized. Call connectDB() first.');
  }
  return { User, Employee };
};

module.exports = { connectDB, getSequelize, getModels };

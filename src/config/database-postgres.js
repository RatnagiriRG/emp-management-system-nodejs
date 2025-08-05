const { Sequelize } = require('sequelize');

let sequelize;

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

    // Sync models in development (create tables)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database synchronized');
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

module.exports = { connectDB, getSequelize };

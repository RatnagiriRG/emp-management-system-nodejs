const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Employee = sequelize.define('Employee', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    employeeId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    department: {
      type: DataTypes.ENUM('HR', 'IT', 'Finance', 'Marketing', 'Operations', 'Sales'),
      allowNull: false
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false
    },
    salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    dateOfJoining: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    address: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  }, {
    tableName: 'Employees',
    timestamps: true
  });

  // Virtual for full name
  Employee.prototype.getFullName = function() {
    return `${this.firstName} ${this.lastName}`;
  };

  return Employee;
};

const EmployeeRepository = require('../repositories/EmployeeRepository');
const EmployeeRepositoryPostgres = require('../repositories/EmployeeRepositoryPostgres');

class EmployeeService {
  constructor() {
    // Choose repository based on database type
    const dbType = process.env.DB_TYPE || 'mongodb';
    if (dbType === 'postgres') {
      this.employeeRepository = new EmployeeRepositoryPostgres();
    } else {
      this.employeeRepository = new EmployeeRepository();
    }
  }

  // Create a new employee
  async createEmployee(employeeData) {
    try {
      // Validate required fields
      const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'department', 'position', 'salary'];
      for (const field of requiredFields) {
        if (!employeeData[field]) {
          throw new Error(`${field} is required`);
        }
      }

      // Check if employee with this email already exists
      try {
        await this.employeeRepository.findByEmail(employeeData.email);
        throw new Error('Employee with this email already exists');
      } catch (error) {
        // If "not found" error, that's good - employee doesn't exist
        if (!error.message.includes('not found')) {
          throw error; // Re-throw if it's a different error
        }
      }

      // Generate employee ID if not provided
      if (!employeeData.employeeId) {
        employeeData.employeeId = await this.generateEmployeeId();
      } else {
        // Check if provided employeeId already exists
        try {
          await this.employeeRepository.findByEmployeeId(employeeData.employeeId);
          throw new Error('Employee with this employee ID already exists');
        } catch (error) {
          // If "not found" error, that's good - employee ID doesn't exist
          if (!error.message.includes('not found')) {
            throw error; // Re-throw if it's a different error
          }
        }
      }

      return await this.employeeRepository.create(employeeData);
    } catch (error) {
      throw error;
    }
  }

  // Get all employees with pagination and filtering
  async getAllEmployees(filters = {}, options = {}) {
    try {
      // Only show active employees by default
      if (!filters.hasOwnProperty('isActive')) {
        filters.isActive = true;
      }
      
      return await this.employeeRepository.findAll(filters, options);
    } catch (error) {
      throw error;
    }
  }

  // Get employee by ID
  async getEmployeeById(id) {
    try {
      return await this.employeeRepository.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Get employee by employee ID
  async getEmployeeByEmployeeId(employeeId) {
    try {
      return await this.employeeRepository.findByEmployeeId(employeeId);
    } catch (error) {
      throw error;
    }
  }

  // Update employee
  async updateEmployee(id, updateData) {
    try {
      // Remove fields that shouldn't be updated directly
      delete updateData.employeeId;
      delete updateData.createdAt;
      delete updateData.updatedAt;

      return await this.employeeRepository.updateById(id, updateData);
    } catch (error) {
      throw error;
    }
  }

  // Delete employee (soft delete)
  async deleteEmployee(id) {
    try {
      return await this.employeeRepository.deleteById(id);
    } catch (error) {
      throw error;
    }
  }

  // Get employees by department
  async getEmployeesByDepartment(department, options = {}) {
    try {
      return await this.employeeRepository.findByDepartment(department, options);
    } catch (error) {
      throw error;
    }
  }

  // Search employees by name
  async searchEmployees(searchTerm, options = {}) {
    try {
      if (!searchTerm || searchTerm.trim() === '') {
        throw new Error('Search term is required');
      }
      return await this.employeeRepository.searchByName(searchTerm, options);
    } catch (error) {
      throw error;
    }
  }

  // Get employee statistics
  async getEmployeeStatistics() {
    try {
      return await this.employeeRepository.getStatistics();
    } catch (error) {
      throw error;
    }
  }

  // Generate unique employee ID
  async generateEmployeeId() {
    try {
      // Use the repository's method instead of direct MongoDB syntax
      return await this.employeeRepository.generateNextEmployeeId();
    } catch (error) {
      throw new Error(`Error generating employee ID: ${error.message}`);
    }
  }

  // Validate employee data
  validateEmployeeData(data, isUpdate = false) {
    const errors = [];

    if (!isUpdate || data.firstName !== undefined) {
      if (!data.firstName || data.firstName.trim() === '') {
        errors.push('First name is required');
      }
    }

    if (!isUpdate || data.lastName !== undefined) {
      if (!data.lastName || data.lastName.trim() === '') {
        errors.push('Last name is required');
      }
    }

    if (!isUpdate || data.email !== undefined) {
      if (!data.email || data.email.trim() === '') {
        errors.push('Email is required');
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          errors.push('Invalid email format');
        }
      }
    }

    if (!isUpdate || data.phone !== undefined) {
      if (!data.phone || data.phone.trim() === '') {
        errors.push('Phone number is required');
      }
    }

    if (!isUpdate || data.department !== undefined) {
      const validDepartments = ['HR', 'IT', 'Finance', 'Marketing', 'Operations', 'Sales'];
      if (!data.department || !validDepartments.includes(data.department)) {
        errors.push('Valid department is required');
      }
    }

    if (!isUpdate || data.salary !== undefined) {
      if (data.salary === undefined || data.salary === null || data.salary < 0) {
        errors.push('Valid salary is required');
      }
    }

    return errors;
  }
}

module.exports = EmployeeService;

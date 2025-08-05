const EmployeeRepository = require('../repositories/EmployeeRepository');

class EmployeeService {
  constructor() {
    this.employeeRepository = new EmployeeRepository();
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

      // Generate employee ID if not provided
      if (!employeeData.employeeId) {
        employeeData.employeeId = await this.generateEmployeeId();
      }

      // Check if employee already exists
      const exists = await this.employeeRepository.exists(employeeData.email, employeeData.employeeId);
      if (exists) {
        throw new Error('Employee with this email or employee ID already exists');
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
      const currentYear = new Date().getFullYear();
      const prefix = `EMP${currentYear}`;
      
      // Find the last employee ID for current year
      const lastEmployee = await this.employeeRepository.findAll(
        { employeeId: { $regex: `^${prefix}` } },
        { sortBy: 'employeeId', sortOrder: 'desc', limit: 1 }
      );

      let sequence = 1;
      if (lastEmployee.employees.length > 0) {
        const lastId = lastEmployee.employees[0].employeeId;
        const lastSequence = parseInt(lastId.substring(prefix.length));
        sequence = lastSequence + 1;
      }

      return `${prefix}${sequence.toString().padStart(4, '0')}`;
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

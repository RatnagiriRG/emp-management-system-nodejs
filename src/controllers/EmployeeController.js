const EmployeeService = require('../services/EmployeeService');

class EmployeeController {
  constructor() {
    this.employeeService = new EmployeeService();
  }

  // Create a new employee
  createEmployee = async (req, res) => {
    try {
      const employeeData = req.body;
      
      // Validate input data
      const validationErrors = this.employeeService.validateEmployeeData(employeeData);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors
        });
      }

      const employee = await this.employeeService.createEmployee(employeeData);
      
      res.status(201).json({
        success: true,
        message: 'Employee created successfully',
        data: employee
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  // Get all employees
  getAllEmployees = async (req, res) => {
    try {
      const { 
        page = 1, 
        limit = 10, 
        sortBy = 'createdAt', 
        sortOrder = 'desc',
        department,
        isActive 
      } = req.query;

      const filters = {};
      if (department) filters.department = department;
      if (isActive !== undefined) filters.isActive = isActive === 'true';

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder
      };

      const result = await this.employeeService.getAllEmployees(filters, options);
      
      res.status(200).json({
        success: true,
        message: 'Employees retrieved successfully',
        data: result.employees,
        pagination: result.pagination
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

  // Get employee by ID
  getEmployeeById = async (req, res) => {
    try {
      const { id } = req.params;
      const employee = await this.employeeService.getEmployeeById(id);
      
      res.status(200).json({
        success: true,
        message: 'Employee retrieved successfully',
        data: employee
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  };

  // Get employee by employee ID
  getEmployeeByEmployeeId = async (req, res) => {
    try {
      const { employeeId } = req.params;
      const employee = await this.employeeService.getEmployeeByEmployeeId(employeeId);
      
      res.status(200).json({
        success: true,
        message: 'Employee retrieved successfully',
        data: employee
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  };

  // Update employee
  updateEmployee = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Validate input data for update
      const validationErrors = this.employeeService.validateEmployeeData(updateData, true);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors
        });
      }

      const employee = await this.employeeService.updateEmployee(id, updateData);
      
      res.status(200).json({
        success: true,
        message: 'Employee updated successfully',
        data: employee
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  // Delete employee
  deleteEmployee = async (req, res) => {
    try {
      const { id } = req.params;
      const employee = await this.employeeService.deleteEmployee(id);
      
      res.status(200).json({
        success: true,
        message: 'Employee deleted successfully',
        data: employee
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  };

  // Get employees by department
  getEmployeesByDepartment = async (req, res) => {
    try {
      const { department } = req.params;
      const { page = 1, limit = 10, sortBy = 'firstName', sortOrder = 'asc' } = req.query;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder
      };

      const result = await this.employeeService.getEmployeesByDepartment(department, options);
      
      res.status(200).json({
        success: true,
        message: `Employees from ${department} department retrieved successfully`,
        data: result.employees,
        pagination: result.pagination
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

  // Search employees
  searchEmployees = async (req, res) => {
    try {
      const { q: searchTerm } = req.query;
      const { page = 1, limit = 10, sortBy = 'firstName', sortOrder = 'asc' } = req.query;

      if (!searchTerm) {
        return res.status(400).json({
          success: false,
          message: 'Search term is required'
        });
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder
      };

      const result = await this.employeeService.searchEmployees(searchTerm, options);
      
      res.status(200).json({
        success: true,
        message: 'Search completed successfully',
        data: result.employees,
        pagination: result.pagination
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  // Get employee statistics
  getEmployeeStatistics = async (req, res) => {
    try {
      const stats = await this.employeeService.getEmployeeStatistics();
      
      res.status(200).json({
        success: true,
        message: 'Statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
}

module.exports = EmployeeController;

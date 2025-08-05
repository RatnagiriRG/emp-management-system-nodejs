const Employee = require('../models/Employee');

class EmployeeRepository {
  // Create a new employee
  async create(employeeData) {
    try {
      const employee = new Employee(employeeData);
      return await employee.save();
    } catch (error) {
      throw new Error(`Error creating employee: ${error.message}`);
    }
  }

  // Find all employees with optional filters
  async findAll(filters = {}, options = {}) {
    try {
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
      const skip = (page - 1) * limit;
      
      const query = Employee.find(filters);
      
      if (sortBy) {
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        query.sort(sort);
      }
      
      const employees = await query.skip(skip).limit(limit);
      const total = await Employee.countDocuments(filters);
      
      return {
        employees,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Error fetching employees: ${error.message}`);
    }
  }

  // Find employee by ID
  async findById(id) {
    try {
      const employee = await Employee.findById(id);
      if (!employee) {
        throw new Error('Employee not found');
      }
      return employee;
    } catch (error) {
      throw new Error(`Error finding employee: ${error.message}`);
    }
  }

  // Find employee by employee ID
  async findByEmployeeId(employeeId) {
    try {
      const employee = await Employee.findOne({ employeeId });
      if (!employee) {
        throw new Error('Employee not found');
      }
      return employee;
    } catch (error) {
      throw new Error(`Error finding employee: ${error.message}`);
    }
  }

  // Find employee by email
  async findByEmail(email) {
    try {
      const employee = await Employee.findOne({ email });
      if (!employee) {
        throw new Error('Employee not found');
      }
      return employee;
    } catch (error) {
      throw new Error(`Error finding employee: ${error.message}`);
    }
  }

  // Update employee by ID
  async updateById(id, updateData) {
    try {
      const employee = await Employee.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      if (!employee) {
        throw new Error('Employee not found');
      }
      return employee;
    } catch (error) {
      throw new Error(`Error updating employee: ${error.message}`);
    }
  }

  // Delete employee by ID (soft delete)
  async deleteById(id) {
    try {
      const employee = await Employee.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );
      if (!employee) {
        throw new Error('Employee not found');
      }
      return employee;
    } catch (error) {
      throw new Error(`Error deleting employee: ${error.message}`);
    }
  }

  // Hard delete employee by ID
  async hardDeleteById(id) {
    try {
      const employee = await Employee.findByIdAndDelete(id);
      if (!employee) {
        throw new Error('Employee not found');
      }
      return employee;
    } catch (error) {
      throw new Error(`Error deleting employee: ${error.message}`);
    }
  }

  // Find employees by department
  async findByDepartment(department, options = {}) {
    try {
      return await this.findAll({ department, isActive: true }, options);
    } catch (error) {
      throw new Error(`Error finding employees by department: ${error.message}`);
    }
  }

  // Search employees by name
  async searchByName(searchTerm, options = {}) {
    try {
      const regex = new RegExp(searchTerm, 'i');
      const filters = {
        $or: [
          { firstName: regex },
          { lastName: regex }
        ],
        isActive: true
      };
      return await this.findAll(filters, options);
    } catch (error) {
      throw new Error(`Error searching employees: ${error.message}`);
    }
  }

  // Get employee statistics
  async getStatistics() {
    try {
      const totalEmployees = await Employee.countDocuments({ isActive: true });
      const departmentStats = await Employee.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$department', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
      
      const avgSalary = await Employee.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, avgSalary: { $avg: '$salary' } } }
      ]);

      return {
        totalEmployees,
        departmentStats,
        averageSalary: avgSalary[0]?.avgSalary || 0
      };
    } catch (error) {
      throw new Error(`Error getting statistics: ${error.message}`);
    }
  }

  // Check if employee exists by email or employee ID
  async exists(email, employeeId) {
    try {
      const employee = await Employee.findOne({
        $or: [
          { email },
          { employeeId }
        ]
      });
      return !!employee;
    } catch (error) {
      throw new Error(`Error checking employee existence: ${error.message}`);
    }
  }
}

module.exports = EmployeeRepository;

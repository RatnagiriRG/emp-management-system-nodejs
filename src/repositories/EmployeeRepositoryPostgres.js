const { getModels } = require('../config/database-postgres');

class EmployeeRepositoryPostgres {
  constructor() {
    this.Employee = null;
  }

  // Initialize models (called after database connection)
  initialize() {
    const { Employee } = getModels();
    this.Employee = Employee;
  }

  // Create a new employee
  async create(employeeData) {
    try {
      if (!this.Employee) this.initialize();
      
      const employee = await this.Employee.create(employeeData);
      return employee;
    } catch (error) {
      throw new Error(`Error creating employee: ${error.message}`);
    }
  }

  // Find employee by ID
  async findById(id) {
    try {
      if (!this.Employee) this.initialize();
      
      const employee = await this.Employee.findByPk(id);
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
      if (!this.Employee) this.initialize();
      
      const employee = await this.Employee.findOne({ where: { employeeId } });
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
      if (!this.Employee) this.initialize();
      
      const employee = await this.Employee.findOne({ where: { email } });
      if (!employee) {
        throw new Error('Employee not found');
      }
      return employee;
    } catch (error) {
      throw new Error(`Error finding employee: ${error.message}`);
    }
  }

  // Check if employee exists by email or employeeId
  async exists(email, employeeId = null) {
    try {
      if (!this.Employee) this.initialize();
      
      const whereClause = { email };
      if (employeeId) {
        whereClause[this.Employee.sequelize.Sequelize.Op.or] = [
          { email },
          { employeeId }
        ];
        delete whereClause.email;
      }
      
      const employee = await this.Employee.findOne({ where: whereClause });
      return !!employee;
    } catch (error) {
      throw new Error(`Error checking employee existence: ${error.message}`);
    }
  }

  // Update employee
  async update(id, updateData) {
    try {
      if (!this.Employee) this.initialize();
      
      const [affectedRows] = await this.Employee.update(updateData, {
        where: { id },
        returning: true
      });
      
      if (affectedRows === 0) {
        throw new Error('Employee not found');
      }
      
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Error updating employee: ${error.message}`);
    }
  }

  // Delete employee (soft delete)
  async delete(id) {
    try {
      if (!this.Employee) this.initialize();
      
      const result = await this.Employee.update(
        { isActive: false },
        { where: { id } }
      );
      
      if (result[0] === 0) {
        throw new Error('Employee not found');
      }
      
      return { message: 'Employee deactivated successfully' };
    } catch (error) {
      throw new Error(`Error deleting employee: ${error.message}`);
    }
  }

  // Get all employees with pagination
  async findAll(options = {}) {
    try {
      if (!this.Employee) this.initialize();
      
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
        where = {},
        isActive = true
      } = options;

      const offset = (page - 1) * limit;

      // Add isActive filter if specified
      if (isActive !== undefined) {
        where.isActive = isActive;
      }

      const result = await this.Employee.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sortBy, sortOrder.toUpperCase()]]
      });

      return {
        employees: result.rows,
        total: result.count,
        pages: Math.ceil(result.count / limit),
        currentPage: parseInt(page)
      };
    } catch (error) {
      throw new Error(`Error finding employees: ${error.message}`);
    }
  }

  // Search employees by name
  async searchByName(searchTerm, options = {}) {
    try {
      if (!this.Employee) this.initialize();
      
      const {
        page = 1,
        limit = 10,
        sortBy = 'firstName',
        sortOrder = 'ASC'
      } = options;

      const offset = (page - 1) * limit;

      const result = await this.Employee.findAndCountAll({
        where: {
          [this.Employee.sequelize.Sequelize.Op.and]: [
            { isActive: true },
            {
              [this.Employee.sequelize.Sequelize.Op.or]: [
                {
                  firstName: {
                    [this.Employee.sequelize.Sequelize.Op.iLike]: `%${searchTerm}%`
                  }
                },
                {
                  lastName: {
                    [this.Employee.sequelize.Sequelize.Op.iLike]: `%${searchTerm}%`
                  }
                }
              ]
            }
          ]
        },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sortBy, sortOrder.toUpperCase()]]
      });

      return {
        employees: result.rows,
        total: result.count,
        pages: Math.ceil(result.count / limit),
        currentPage: parseInt(page)
      };
    } catch (error) {
      throw new Error(`Error searching employees: ${error.message}`);
    }
  }

  // Find employees by department
  async findByDepartment(department, options = {}) {
    try {
      if (!this.Employee) this.initialize();
      
      const {
        page = 1,
        limit = 10,
        sortBy = 'firstName',
        sortOrder = 'ASC'
      } = options;

      const offset = (page - 1) * limit;

      const result = await this.Employee.findAndCountAll({
        where: {
          department,
          isActive: true
        },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sortBy, sortOrder.toUpperCase()]]
      });

      return {
        employees: result.rows,
        total: result.count,
        pages: Math.ceil(result.count / limit),
        currentPage: parseInt(page)
      };
    } catch (error) {
      throw new Error(`Error finding employees by department: ${error.message}`);
    }
  }

  // Get employee statistics
  async getStatistics() {
    try {
      if (!this.Employee) this.initialize();
      
      const totalEmployees = await this.Employee.count({
        where: { isActive: true }
      });

      const departmentStats = await this.Employee.findAll({
        attributes: [
          'department',
          [this.Employee.sequelize.fn('COUNT', this.Employee.sequelize.col('id')), 'count']
        ],
        where: { isActive: true },
        group: ['department'],
        raw: true
      });

      const salaryStats = await this.Employee.findAll({
        attributes: [
          [this.Employee.sequelize.fn('AVG', this.Employee.sequelize.col('salary')), 'averageSalary'],
          [this.Employee.sequelize.fn('MIN', this.Employee.sequelize.col('salary')), 'minSalary'],
          [this.Employee.sequelize.fn('MAX', this.Employee.sequelize.col('salary')), 'maxSalary']
        ],
        where: { isActive: true },
        raw: true
      });

      return {
        totalEmployees,
        departmentDistribution: departmentStats,
        salaryStatistics: salaryStats[0] || {
          averageSalary: 0,
          minSalary: 0,
          maxSalary: 0
        }
      };
    } catch (error) {
      throw new Error(`Error getting employee statistics: ${error.message}`);
    }
  }

  // Generate next employee ID
  async generateNextEmployeeId() {
    try {
      if (!this.Employee) this.initialize();
      
      const currentYear = new Date().getFullYear();
      const yearPrefix = `EMP${currentYear}`;
      
      const lastEmployee = await this.Employee.findOne({
        where: {
          employeeId: {
            [this.Employee.sequelize.Sequelize.Op.like]: `${yearPrefix}%`
          }
        },
        order: [['employeeId', 'DESC']]
      });

      let nextSequence = 1;
      if (lastEmployee) {
        const lastSequence = parseInt(lastEmployee.employeeId.replace(yearPrefix, ''));
        nextSequence = lastSequence + 1;
      }

      return `${yearPrefix}${nextSequence.toString().padStart(4, '0')}`;
    } catch (error) {
      throw new Error(`Error generating employee ID: ${error.message}`);
    }
  }
}

module.exports = EmployeeRepositoryPostgres;

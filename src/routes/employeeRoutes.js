const express = require('express');
const EmployeeController = require('../controllers/EmployeeController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const employeeController = new EmployeeController();

// All employee routes require authentication
router.use(authMiddleware.authenticate);

// Employee routes with role-based authorization
router.post('/', authMiddleware.isHROrAdmin, employeeController.createEmployee);
router.get('/', authMiddleware.isManagerOrAbove, employeeController.getAllEmployees);
router.get('/search', authMiddleware.isManagerOrAbove, employeeController.searchEmployees);
router.get('/statistics', authMiddleware.isHROrAdmin, employeeController.getEmployeeStatistics);
router.get('/department/:department', authMiddleware.isManagerOrAbove, employeeController.getEmployeesByDepartment);
router.get('/employee-id/:employeeId', authMiddleware.canAccessEmployee, employeeController.getEmployeeByEmployeeId);
router.get('/:id', authMiddleware.canAccessEmployee, employeeController.getEmployeeById);
router.put('/:id', authMiddleware.isHROrAdmin, employeeController.updateEmployee);
router.delete('/:id', authMiddleware.isHROrAdmin, employeeController.deleteEmployee);

module.exports = router;

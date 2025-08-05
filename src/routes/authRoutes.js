const express = require('express');
const AuthController = require('../controllers/AuthController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const authController = new AuthController();

// Public routes (no authentication required)
router.post('/register', authMiddleware.rateLimitAuth(5, 15 * 60 * 1000), authController.register);
router.post('/login', authMiddleware.rateLimitAuth(5, 15 * 60 * 1000), authController.login);
router.post('/refresh-token', authController.refreshToken);

// Protected routes (authentication required)
router.use(authMiddleware.authenticate); // All routes below require authentication

router.post('/logout', authController.logout);
router.post('/change-password', authMiddleware.rateLimitAuth(3, 60 * 60 * 1000), authController.changePassword);
router.get('/profile', authController.getProfile);
router.put('/profile', authController.updateProfile);
router.get('/verify', authController.verifyToken);

module.exports = router;

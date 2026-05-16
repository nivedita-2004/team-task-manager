const { Router } = require('express');
const authController = require('./auth.controller');
const { authenticate } = require('../../middleware/authMiddleware');

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/users', authenticate, authController.getAllUsers);

module.exports = router;

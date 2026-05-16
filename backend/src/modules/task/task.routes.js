const { Router } = require('express');
const { authenticate, authorizeAdmin } = require('../../middleware/authMiddleware');
const taskController = require('./task.controller');

const router = Router();

router.get('/', authenticate, taskController.getAllTasks);
router.post('/', authenticate, authorizeAdmin, taskController.createTask);
router.put('/:id', authenticate, taskController.updateTask);
router.delete('/:id', authenticate, authorizeAdmin, taskController.deleteTask);

module.exports = router;

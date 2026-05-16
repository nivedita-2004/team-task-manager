const { Router } = require('express');
const { authenticate, authorizeAdmin } = require('../../middleware/authMiddleware');
const projectController = require('./project.controller');

const router = Router();

router.get('/', authenticate, projectController.getAllProjects);
router.post('/', authenticate, authorizeAdmin, projectController.createProject);
router.get('/:id', authenticate, projectController.getProjectById);

module.exports = router;

const crypto = require('crypto');
const projectQueries = require('./project.queries');

const getAllProjects = async (req, res) => {
  try {
    const projects = await projectQueries.getAllProjects();
    const taskCountMap = await projectQueries.getProjectTasksCount();

    const result = projects.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      owner: { id: p.ownerId, name: p.ownerName, email: p.ownerEmail },
      tasks: new Array(taskCountMap[p.id] || 0).fill({})
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const projectId = crypto.randomUUID();
    
    await projectQueries.createProject(projectId, name, description, req.user.id);

    res.status(201).json({ id: projectId, name, description, ownerId: req.user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await projectQueries.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const tasks = await projectQueries.getTasksByProjectId(req.params.id);

    project.tasks = tasks.map(t => ({
      ...t,
      assignee: t.assigneeId ? { id: t.assigneeId, name: t.assigneeName } : null
    }));

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllProjects,
  createProject,
  getProjectById
};

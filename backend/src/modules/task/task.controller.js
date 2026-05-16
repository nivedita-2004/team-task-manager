const crypto = require('crypto');
const taskQueries = require('./task.queries');

const getAllTasks = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'ADMIN';
    const tasks = await taskQueries.getAllTasks(isAdmin, req.user.id);
    
    const result = tasks.map(t => ({
      ...t,
      project: { id: t.projectId, name: t.projectName },
      assignee: t.assigneeId ? { id: t.assigneeId, name: t.assigneeName } : null
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assigneeId, dueDate } = req.body;
    const taskId = crypto.randomUUID();
    const formattedDueDate = dueDate ? new Date(dueDate).toISOString().slice(0, 19).replace('T', ' ') : null;

    await taskQueries.createTask(taskId, title, description, projectId, assigneeId, formattedDueDate);

    res.status(201).json({ id: taskId, title, description, projectId, assigneeId, dueDate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, title, description, assigneeId, dueDate } = req.body;

    const task = await taskQueries.getTaskById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role !== 'ADMIN') {
      if (task.assigneeId !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      await taskQueries.updateTaskStatus(id, status);
      return res.json({ ...task, status });
    }

    const formattedDueDate = dueDate ? new Date(dueDate).toISOString().slice(0, 19).replace('T', ' ') : null;
    
    await taskQueries.updateTaskDetails(id, title, description, status, assigneeId, formattedDueDate);

    res.json({ ...task, title, description, status, assigneeId, dueDate: formattedDueDate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    await taskQueries.deleteTask(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask
};

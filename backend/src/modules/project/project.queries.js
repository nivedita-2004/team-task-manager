const pool = require('../../db');

const getAllProjects = async () => {
  const [projects] = await pool.query(`
    SELECT p.*, u.name as ownerName, u.email as ownerEmail 
    FROM Project p 
    JOIN User u ON p.ownerId = u.id
  `);
  return projects;
};

const getProjectTasksCount = async () => {
  const [tasks] = await pool.query('SELECT projectId, COUNT(*) as count FROM Task GROUP BY projectId');
  const taskCountMap = {};
  tasks.forEach(t => taskCountMap[t.projectId] = t.count);
  return taskCountMap;
};

const getProjectById = async (id) => {
  const [projects] = await pool.query('SELECT * FROM Project WHERE id = ?', [id]);
  return projects[0];
};

const getTasksByProjectId = async (projectId) => {
  const [tasks] = await pool.query(`
    SELECT t.*, u.name as assigneeName 
    FROM Task t 
    LEFT JOIN User u ON t.assigneeId = u.id 
    WHERE t.projectId = ?
  `, [projectId]);
  return tasks;
};

const createProject = async (id, name, description, ownerId) => {
  await pool.query(
    'INSERT INTO Project (id, name, description, ownerId) VALUES (?, ?, ?, ?)',
    [id, name, description, ownerId]
  );
};

module.exports = {
  getAllProjects,
  getProjectTasksCount,
  getProjectById,
  getTasksByProjectId,
  createProject
};

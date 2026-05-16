const pool = require('../../db');

const getAllTasks = async (isAdmin, userId) => {
  let query = `
    SELECT t.*, p.name as projectName, u.name as assigneeName
    FROM Task t
    JOIN Project p ON t.projectId = p.id
    LEFT JOIN User u ON t.assigneeId = u.id
  `;
  const params = [];

  if (!isAdmin) {
    query += ' WHERE t.assigneeId = ?';
    params.push(userId);
  }

  const [tasks] = await pool.query(query, params);
  return tasks;
};

const getTaskById = async (id) => {
  const [tasks] = await pool.query('SELECT * FROM Task WHERE id = ?', [id]);
  return tasks[0];
};

const createTask = async (id, title, description, projectId, assigneeId, dueDate) => {
  await pool.query(
    'INSERT INTO Task (id, title, description, projectId, assigneeId, dueDate) VALUES (?, ?, ?, ?, ?, ?)',
    [id, title, description, projectId, assigneeId || null, dueDate]
  );
};

const updateTaskStatus = async (id, status) => {
  await pool.query('UPDATE Task SET status = ? WHERE id = ?', [status, id]);
};

const updateTaskDetails = async (id, title, description, status, assigneeId, dueDate) => {
  await pool.query(
    'UPDATE Task SET title = ?, description = ?, status = ?, assigneeId = ?, dueDate = ? WHERE id = ?',
    [title, description, status, assigneeId || null, dueDate, id]
  );
};

const deleteTask = async (id) => {
  await pool.query('DELETE FROM Task WHERE id = ?', [id]);
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTaskStatus,
  updateTaskDetails,
  deleteTask
};

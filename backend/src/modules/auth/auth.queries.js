const pool = require('../../db');

const getUserByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM User WHERE email = ?', [email]);
  return rows[0];
};

const createUser = async (id, name, email, hashedPassword, role) => {
  await pool.query(
    'INSERT INTO User (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
    [id, name, email, hashedPassword, role]
  );
};

const getAllUsers = async () => {
  const [rows] = await pool.query('SELECT id, name, email, role FROM User');
  return rows;
};

module.exports = {
  getUserByEmail,
  createUser,
  getAllUsers
};

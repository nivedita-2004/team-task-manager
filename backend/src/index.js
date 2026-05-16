const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./modules/auth/auth.routes');
const projectRoutes = require('./modules/project/project.routes');
const taskRoutes = require('./modules/task/task.routes');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Serve static frontend in production (Railway)
const frontendPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendPath));

app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

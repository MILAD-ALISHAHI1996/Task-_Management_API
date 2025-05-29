const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Task Management API is running...');
});

module.exports = app;

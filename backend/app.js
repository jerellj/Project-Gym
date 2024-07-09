const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const logger = require('./logger');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/training-plans', require('./routes/trainingPlanRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/excercise', require('./routes/excerciseRoutes'));

// Foutafhandelingsmiddleware
app.use((err, req, res, next) => {
    logger.error('Global error handler:', err); // Log globale fouten
    res.status(500).json({ message: 'Er is iets misgegaan', error: err });
});

module.exports = app;
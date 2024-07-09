const express = require('express');
const router = express.Router();
const trainingPlanController = require('../controllers/trainingPlanController');

// Maak een nieuw trainingsschema
router.post('/', trainingPlanController.createTrainingPlan);

// Haal alle trainingsschema's op
router.get('/', trainingPlanController.getTrainingPlans);

module.exports = router;
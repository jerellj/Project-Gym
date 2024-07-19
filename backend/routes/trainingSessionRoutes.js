const express = require('express');
const router = express.Router();
const trainingSessionController = require('../controllers/trainingSesionController');

// Route voor het ophalen van de volgende trainingssessie
router.get('/next/:trainingPlanId/:userId', trainingSessionController.getNextTrainingSession);

router.get('/', trainingSessionController.getTrainingSession);

router.post('/', trainingSessionController.addTrainingSession);

module.exports = router;
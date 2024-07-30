const express = require('express');
const router = express.Router();
const trainingSessionController = require('../controllers/trainingSesionController');

// Route voor het ophalen van de volgende trainingssessie
router.get('/next/:userId/:trainingPlanId', trainingSessionController.getNextTrainingSession);

router.get('/:trainingSessionId', trainingSessionController.getTrainingSession);

router.get('/', trainingSessionController.getTrainingSessions);

router.post('/', trainingSessionController.addTrainingSession);

module.exports = router;

//getNextTrainingSession
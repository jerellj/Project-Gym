const express = require('express');
const router = express.Router();
const trainingSessionController = require('../controllers/trainingSesionController');

// Route voor het ophalen van de volgende trainingssessie
router.get('/next/:trainingPlanId/:userId', trainingSessionController.getNextTrainingSession);

router.post('/', trainingSessionController.addTrainingSession);

module.exports = router;
const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');

// Voeg voortgang toe
router.post('/', progressController.addProgress);

// Haal voortgang op voor een gebruiker
router.get('/:userId', progressController.getUserProgress);

// Haal voortgang op voor een specifieke sessie
router.get('/session/:userId/:sessionId', progressController.getUserSessionProgress);

module.exports = router;
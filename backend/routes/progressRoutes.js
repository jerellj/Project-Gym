const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');

// Voeg voortgang toe
router.post('/', progressController.addProgress);

// Haal voortgang op voor een gebruiker
router.get('/:userId', progressController.getUserProgress);

module.exports = router;
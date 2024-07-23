const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/userController');
const logger = require('../logger');

const validateUser = [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Please provide a valid email'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

router.post('/register', validateUser, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, userController.registerUser);

router.post('/login', [
    check('email').isEmail().withMessage('Please provide a valid email'),
    check('password').not().isEmpty().withMessage('Password is required')
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, userController.loginUser);

router.get('/', userController.getUsers);

router.get('/client',[
    check('email').isEmail().withMessage('Please provide a valid email'),
], (req, res, next) => {
    const errors = validationResult(req);
    logger.info(`het mail adres is: ${req.query.email}`);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, userController.getUser);

// Haal alle gebruikers op
  
  // Haal de huidige sessie voor een gebruiker op
  router.get('/:userId/currentSession', async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId).populate('trainingPlan');
      const trainingPlan = user.trainingPlan;
      const sessions = await TrainingSession.find({ trainingPlan: trainingPlan._id });
      
      // Logica om de huidige sessie te bepalen
      const today = new Date().getDay();
      const currentSession = sessions[today % sessions.length];
      
      res.json(currentSession);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching current session', error });
    }
  });
  
  // Haal de progressiegegevens voor een gebruiker op
  router.get('/:userId/progress', async (req, res) => {
    try {
      const userId = req.params.userId;
      const progress = await Progress.find({ user: userId }).populate('exercise');
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching progress', error });
    }
    });

  // Voeg een trainingsplan toe aan een gebruiker
  router.post('/addTrainingPlan', userController.addTrainingPlanToUser);

  router.get('/with-training-plans', userController.getUsersWithTrainingPlans);

module.exports = router;
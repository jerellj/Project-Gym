const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const exercisesController = require('../controllers/excerciseController');
const logger = require('../logger');

const validateExcercise = [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('category').isIn([  'cardio',
        'olympic weightlifting',
        'plyometrics',
        'powerlifting',
        'strength',
        'stretching',
        'strongman']).withMessage('Type must be one of the following: Compound, Isolatie, Conditie, Core, Mobiliteit')
];

router.post('/new', validateExcercise, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, exercisesController.registerExcercise);

/*
router.post('/update', validateExcercise, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, exercisesController.addExcercise);
*/

router.get('/excercises', exercisesController.getExcercises);

router.get('/CardioExcercises', exercisesController.getCardioExcercises);

router.get('/StrengthExcercises', exercisesController.getStrengthExcercises);

router.get('/PlyometricsExcercises', exercisesController.getPlyometricsExcercises);

router.get('/PowerliftingExcercises', exercisesController.getPowerliftingExcercises);

router.get('/StrongmanExcercises', exercisesController.getStrongmanExcercises);

router.get('/StretchingExcercises', exercisesController.getStretchingExcercises);

router.get('/OlympicWeightliftingExcercises', exercisesController.getOlympicWeightliftingExcercises);

router.get('/excercise',[
], (req, res, next) => {
    const errors = validationResult(req);
    logger.info(`de naam van de oefening is: ${req.query.name}`);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, exercisesController.getExcercise);

module.exports = router;
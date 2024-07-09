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

router.get('/clients', userController.getClients);

router.get('/client',[
    check('email').isEmail().withMessage('Please provide a valid email'),
], (req, res, next) => {
    const errors = validationResult(req);
    logger.info(`het mail adres is: ${req.query.email}`);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, userController.getClient);

module.exports = router;
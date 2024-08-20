const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const TrainingPlan = require('../models/TrainingPlan');
const logger = require('../logger');
const {
    registerUser,
    loginUser,
    getUsers,
    getUser,
    addTrainingPlanToUser,
    getUsersWithTrainingPlans
} = require('../controllers/userController');

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../models/User');
jest.mock('../models/TrainingPlan');
jest.mock('../logger');

describe('UserController Tests', () => {
    let req, res;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('registerUser', () => {
        beforeEach(() => {
            req.body = {
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                role: 'user'
            };
        });

        it('should register a user and return a token', async () => {
            bcrypt.genSalt.mockResolvedValue('salt');
            bcrypt.hash.mockResolvedValue('hashedPassword');
            User.prototype.save = jest.fn().mockResolvedValue();
            jwt.sign.mockReturnValue('token');

            await registerUser(req, res);

            expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'salt');
            expect(User.prototype.save).toHaveBeenCalled();
            expect(jwt.sign).toHaveBeenCalledWith(
                { id: expect.any(String), email: 'john.doe@example.com', role: 'user' },
                `${process.env.JWT_SECRET_KEY}`,
                { expiresIn: '1h' }
            );
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: 'Gebruiker succesvol geregistreerd', token: 'token' });
        });

        it('should handle errors during registration', async () => {
            const error = new Error('Registration failed');
            User.prototype.save = jest.fn().mockRejectedValue(error);

            await registerUser(req, res);

            expect(logger.error).toHaveBeenCalledWith('Error registering user:', error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Er is iets misgegaan bij het registreren van de gebruiker',
                error
            });
        });
    });

    describe('loginUser', () => {
        beforeEach(() => {
            req.body = {
                email: 'john.doe@example.com',
                password: 'password123'
            };
        });

        it('should log in a user and return a token', async () => {
            const user = { _id: 'userId', email: 'john.doe@example.com', password: 'hashedPassword', role: 'user' };
            User.findOne.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('token');

            await loginUser(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ email: 'john.doe@example.com' });
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
            expect(jwt.sign).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Succesvol ingelogd', token: 'token' });
        });

        it('should return 401 if credentials are invalid', async () => {
            User.findOne.mockResolvedValue(null);

            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Ongeldige inloggegevens' });
        });
    });

    describe('getUsers', () => {
        it('should return a list of clients', async () => {
            const clients = [{ name: 'Client 1', role: 'klant' }];
            User.find.mockResolvedValue(clients);

            await getUsers(req, res);

            expect(User.find).toHaveBeenCalledWith({ role: 'klant' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(clients);
        });
    });

    describe('getUser', () => {
        beforeEach(() => {
            req.query = { email: 'client@example.com' };
        });

        it('should return the client details', async () => {
            const client = { name: 'Client', email: 'client@example.com', role: 'klant' };
            User.findOne.mockResolvedValue(client);

            await getUser(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ email: 'client@example.com', role: 'klant' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(client);
        });
    });

    describe('addTrainingPlanToUser', () => {
        beforeEach(() => {
            req.body = {
                userId: 'userId',
                trainingPlanId: 'trainingPlanId'
            };
        });

        it('should add a training plan to a user', async () => {
            const user = { _id: 'userId', trainingPlans: [], save: jest.fn() };
            const trainingPlan = { _id: 'trainingPlanId' };
            User.findById.mockResolvedValue(user);
            TrainingPlan.findById.mockResolvedValue(trainingPlan);

            await addTrainingPlanToUser(req, res);

            expect(User.findById).toHaveBeenCalledWith('userId');
            expect(TrainingPlan.findById).toHaveBeenCalledWith('trainingPlanId');
            expect(user.trainingPlans).toContain('trainingPlanId');
            expect(user.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Trainingsplan succesvol toegevoegd aan gebruiker', user });
        });
    });

    describe('getUsersWithTrainingPlans', () => {
        it('should return users with training plans', async () => {
            const clients = [{ name: 'Client 1', trainingPlans: ['trainingPlanId'] }];
            User.find.mockResolvedValue(clients);

            await getUsersWithTrainingPlans(req, res);

            expect(User.find).toHaveBeenCalledWith({
                role: 'klant',
                trainingPlans: { $exists: true, $not: { $size: 0 } }
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(clients);
        });
    });
});
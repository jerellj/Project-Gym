const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const CustomerDetails = require('../models/CustomerDetails');
const TrainingPlan = require('../models/TrainingPlan');
const logger = require('../logger'); // Zorg ervoor dat je een logger gebruikt

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        `${process.env.JWT_SECRET_KEY}`, // Gebruik de geheime sleutel uit de omgevingsvariabelen
        { expiresIn: '1h' }
    );
};

// Registratie van een nieuwe gebruiker
exports.registerUser = async (req, res) => {
    const { name, email, password, role, notes, injury, weight, illness, goals } = req.body;
    logger.info(`Registering user: ${name}, ${email}, ${role}`); // Log registratiepoging
    console.log('Request body:', req.body); // Log de request body
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let customerDetails = null;
        if (role === 'klant') {
            customerDetails = new CustomerDetails({ notes, injury, weight, illness, goals });
            await customerDetails.save();
        }

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            customerDetails: customerDetails ? customerDetails._id : null
        });

        await newUser.save();
        const token = generateToken(newUser);
        res.status(201).json({ message: 'Gebruiker succesvol geregistreerd', token });
    } catch (error) {
        logger.error('Error registering user:', error); // Log foutmelding
        console.error('Error registering user:', error); // Log foutmelding naar console
        res.status(500).json({ message: 'Er is iets misgegaan bij het registreren van de gebruiker', error });
    }
};

// Inloggen van een gebruiker
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    logger.info(`Logging in user: ${email}`); // Log inlogpoging
    console.log('Request body:', req.body); // Log de request body
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Ongeldige inloggegevens' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Ongeldige inloggegevens' });
        }
        const token = generateToken(user);
        res.status(200).json({ message: 'Succesvol ingelogd', token });
    } catch (error) {
        logger.error('Error logging in user:', error); // Log foutmelding
        console.error('Error logging in user:', error); // Log foutmelding naar console
        res.status(500).json({ message: 'Er is iets misgegaan bij het inloggen', error });
    }
};

// Haal alle gebruikers met de rol 'klant' op
exports.getUsers = async (req, res) => {
    try {
        const clients = await User.find({ role: 'klant' })
            .select('-password')
            .populate('customerDetails') // Populate CustomerDetails
            .populate({
                path: 'trainingPlans',
                populate: {
                    path: 'trainings',
                    model: 'TrainingSession',
                    populate: {
                        path: 'exercises.exercise',
                        model: 'Exercise'
                    }
                }
            });
        res.status(200).json(clients);
    } catch (error) {
        logger.error('Error getting clients:', error);
        res.status(500).json({ message: 'Er is iets misgegaan bij het ophalen van de klanten', error });
    }
};

// Haal een specifieke gebruiker op basis van e-mail en rol
exports.getUserMail = async (req, res) => {
    const { email } = req.query;
    try {
        const client = await User.findOne({ email, role: "klant" })
            .select('-password')
            .populate('customerDetails') // Populate CustomerDetails
            .populate('trainingPlans');
        logger.info(`Getting client with email: ${email}`);
        res.status(200).json(client);
    } catch (error) {
        logger.error('Error getting clients:', error);
        res.status(500).json({ message: 'Er is iets misgegaan bij het ophalen van de klanten', error });
    }
};

// Haal een specifieke gebruiker op basis ID
exports.getUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const client = await User.findById(userId)
            .select('-password')
            .populate('customerDetails') // Populate CustomerDetails
            .populate('trainingPlans');
        res.status(200).json(client);
    } catch (error) {
        logger.error('Error getting clients:', error);
        res.status(500).json({ message: 'Er is iets misgegaan bij het ophalen van de klanten', error });
    }
};

// Voeg een trainingsplan toe aan een gebruiker
exports.addTrainingPlanToUser = async (req, res) => {
    const { userId, trainingPlanId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Gebruiker niet gevonden' });
        }

        const trainingPlan = await TrainingPlan.findById(trainingPlanId);
        if (!trainingPlan) {
            return res.status(404).json({ message: 'Trainingsplan niet gevonden' });
        }

        user.trainingPlans.push(trainingPlanId);
        await user.save();

        res.status(200).json({ message: 'Trainingsplan succesvol toegevoegd aan gebruiker', user });
    } catch (error) {
        res.status(500).json({ message: 'Er is iets misgegaan bij het toevoegen van het trainingsplan aan de gebruiker', error });
    }
};

// Haal alle gebruikers met de rol 'klant' op die trainingsplannen hebben
exports.getUsersWithTrainingPlans = async (req, res) => {
    try {
        const clients = await User.find({ role: 'klant', trainingPlans: { $exists: true, $not: { $size: 0 } } })
            .select('-password')
            .populate({
                path: 'trainingPlans',
                populate: {
                    path: 'trainings',
                    model: 'TrainingSession'
                }
            });
        res.status(200).json(clients);
    } catch (error) {
        logger.error('Error getting clients:', error);
        res.status(500).json({ message: 'Er is iets misgegaan bij het ophalen van de klanten', error });
    }
};

// Update CustomerDetails voor een klant
exports.updateCustomerDetails = async (req, res) => {
    const { userId } = req.params;
    const { notes, injury, weight, illness, goals } = req.body;

    try {
        const user = await User.findById(userId).populate('customerDetails');
        if (!user || user.role !== 'klant') {
            return res.status(404).json({ message: 'Klant niet gevonden' });
        }

        if (user.customerDetails) {
            // Update bestaande klantgegevens
            const customerDetails = await CustomerDetails.findById(user.customerDetails._id);
            customerDetails.notes = notes;
            customerDetails.injury = injury;
            customerDetails.weight = weight;
            customerDetails.illness = illness;
            customerDetails.goals = goals;
            await customerDetails.save();
        } else {
            // Maak nieuwe klantgegevens aan als deze nog niet bestaan
            const customerDetails = new CustomerDetails({ notes, injury, weight, illness, goals });
            await customerDetails.save();
            user.customerDetails = customerDetails._id;
            await user.save();
        }

        const updatedUser = await User.findById(userId).populate('customerDetails');
        res.status(200).json({ message: 'Klantdetails succesvol bijgewerkt', customerDetails: updatedUser.customerDetails });
    } catch (error) {
        console.error('Error updating customer details:', error);
        res.status(500).json({ message: 'Er is iets misgegaan bij het bijwerken van de klantdetails', error });
    }
};

// Haal CustomerDetails op voor een specifieke gebruiker
exports.getCustomerDetails = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId).populate('customerDetails');
        if (!user || user.role !== 'klant') {
            return res.status(404).json({ message: 'Klant niet gevonden' });
        }

        if (!user.customerDetails) {
            return res.status(404).json({ message: 'CustomerDetails niet gevonden voor deze klant' });
        }

        res.status(200).json(user.customerDetails);
    } catch (error) {
        console.error('Error getting customer details:', error);
        res.status(500).json({ message: 'Er is iets misgegaan bij het ophalen van de klantgegevens', error });
    }
};
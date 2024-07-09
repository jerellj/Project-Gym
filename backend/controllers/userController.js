const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../logger'); // Zorg ervoor dat je een logger gebruikt

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        `${process.env.JWT_SECRET_KEY}`, // Gebruik de geheime sleutel uit de omgevingsvariabelen
        { expiresIn: '1h' }
    );
};

exports.registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    logger.info(`Registering user: ${name}, ${email}, ${role}`); // Log registratiepoging
    console.log('Request body:', req.body); // Log de request body
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();
        const token = generateToken(newUser);
        res.status(201).json({ message: 'Gebruiker succesvol geregistreerd', token });
    } catch (error) {
        logger.error('Error registering user:', error); // Log foutmelding
        console.error('Error registering user:', error); // Log foutmelding naar console
        res.status(500).json({ message: 'Er is iets misgegaan bij het registreren van de gebruiker', error });
    }
};

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

exports.getClients = async (req, res) => {
    try {
        const clients = await User.find({ role: 'klant' }).select('-password'); // Selecteer alle klanten en sluit het wachtwoord uit
        res.status(200).json(clients);
    } catch (error) {
        logger.error('Error getting clients:', error);
        res.status(500).json({ message: 'Er is iets misgegaan bij het ophalen van de klanten', error });
    }
};

exports.getClient = async (req, res) => {
    const { email } = req.query;
    try {
        const client = await User.findOne({ email, role: "klant" }).select('-password'); // Selecteer alle klanten en sluit het wachtwoord uit
        logger.info(`Getting client with email: ${email}`); // Log inlogpoging
        res.status(200).json(client);
    } catch (error) {
        logger.error('Error getting clients:', error);
        res.status(500).json({ message: 'Er is iets misgegaan bij het ophalen van de klanten', error });
    }
};
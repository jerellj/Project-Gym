const TrainingPlan = require('../models/TrainingPlan');

// Maak een nieuw trainingsschema
exports.createTrainingPlan = async (req, res) => {
    const { name, description, userId, weeks, sessionsPerWeek, trainings } = req.body;
    try {
        const newTrainingPlan = new TrainingPlan({ name, description, user: userId, weeks, sessionsPerWeek, weeks, trainings });
        await newTrainingPlan.save();
        res.status(201).json({ message: 'Trainingsschema succesvol aangemaakt', trainingPlan: newTrainingPlan });
    } catch (error) {
        res.status(500).json({ message: 'Er is iets misgegaan bij het aanmaken van het Trainingsschema', error });
    }
};

// Haal alle trainingsschema's op
exports.getTrainingPlans = async (req, res) => {
    try {
        const trainingPlans = await TrainingPlan.find();
        res.status(200).json(trainingPlans);
    } catch (error) {
        res.status(500).json({ message: 'Er is iets misgegaan bij het ophalen van de trainingsschema\'s', error });
    }
};
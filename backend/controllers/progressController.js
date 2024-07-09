const Progress = require('../models/Progress');

// Voeg voortgang toe
exports.addProgress = async (req, res) => {
    const { userId, trainingPlanId, exercises, date } = req.body;
    try {
        const newProgress = new Progress({ userId, trainingPlanId, exercises, date });
        await newProgress.save();
        res.status(201).json({ message: 'Voortgang succesvol toegevoegd', progress: newProgress });
    } catch (error) {
        res.status(500).json({ message: 'Er is iets misgegaan bij het toevoegen van de voortgang', error });
    }
};

// Haal voortgang op voor een gebruiker
exports.getUserProgress = async (req, res) => {
    const { userId } = req.params;
    try {
        const progress = await Progress.find({ userId });
        res.status(200).json(progress);
    } catch (error) {
        res.status(500).json({ message: 'Er is iets misgegaan bij het ophalen van de voortgang', error });
    }
};
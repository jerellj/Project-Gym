const Progress = require('../models/Progress');

// Voeg voortgang toe
exports.addProgress = async (req, res) => {
    const { user, trainingSession, exerciseProgress, date } = req.body;
    try {
        const newProgress = new Progress({ user, trainingSession, exerciseProgress, date });
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
        const progress = await Progress.find({ user: userId }).populate('exerciseProgress.exercise');
        res.status(200).json(progress);
    } catch (error) {
        res.status(500).json({ message: 'Er is iets misgegaan bij het ophalen van de voortgang', error });
    }
};

exports.getUserProgress = async (req, res) => {
    const { userId } = req.params;
    try {
        const progress = await Progress.find({ user: userId }).populate('exerciseProgress.exercise');
        res.status(200).json(progress);
    } catch (error) {
        res.status(500).json({ message: 'Er is iets misgegaan bij het ophalen van de voortgang', error });
    }
};

// Haal de voortgang op voor een specifieke gebruiker en sessie
exports.getUserSessionProgress = async (req, res) => {
    const { userId, sessionId } = req.params;
    try {
        const progress = await Progress.findOne({ user: userId, trainingSession: sessionId })
            .sort({ date: -1 }) // Sorteer op datum in aflopende volgorde
            .populate('exerciseProgress.exercise');
        res.status(200).json(progress);
    } catch (error) {
        res.status(500).json({ message: 'Er is iets misgegaan bij het ophalen van de voortgang', error });
    }
};
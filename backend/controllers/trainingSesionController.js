const TrainingSession = require('../models/TrainingSession');

exports.addTrainingSession = async (req, res) => {
    const { trainingPlanId, exercises, sessionNumber } = req.body;
    try {
        const newTrainingSession = new TrainingSession({ trainingPlan: trainingPlanId, exercises, sessionNumber });
        await newTrainingSession.save();
        res.status(201).json({ message: 'TrainingSession succesvol toegevoegd', trainingSession: newTrainingSession });
    } catch (error) {
        res.status(500).json({ message: 'Er is iets misgegaan bij het toevoegen van de TrainingSession', error });
    }
};
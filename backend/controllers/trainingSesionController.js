const TrainingSession = require('../models/TrainingSession');
const TrainingPlan = require('../models/TrainingPlan');
const Progress = require('../models/Progress');

exports.addTrainingSession = async (req, res) => {
    const { name, trainingPlanId, exercises, sessionNumber } = req.body;
    try {
        const newTrainingSession = new TrainingSession({ name, exercises, sessionNumber });
        await newTrainingSession.save();

        await TrainingPlan.findByIdAndUpdate(trainingPlanId, { $push: { trainings: newTrainingSession._id } });

        res.status(201).json({ message: 'TrainingSession succesvol toegevoegd', trainingSession: newTrainingSession });
    } catch (error) {
        res.status(500).json({ message: 'Er is iets misgegaan bij het toevoegen van de TrainingSession', error });
    }
};

exports.getNextTrainingSession = async (req, res) => {
    const { userId, trainingPlanId } = req.params;
    try {
        // Haal het trainingsplan op en populate de trainingssessies
        const trainingPlan = await TrainingPlan.findById(trainingPlanId).populate('trainings');
        if (!trainingPlan) {
            return res.status(404).json({ message: 'TrainingPlan niet gevonden' });
        }

        // Haal de voortgang van de gebruiker op
        const userProgress = await Progress.find({ user: userId, trainingSession: { $in: trainingPlan.trainings } }).populate('trainingSession');

        // Bepaal de laatste voltooide sessie
        const lastCompletedSession = userProgress.length > 0 ? userProgress[userProgress.length - 1].trainingSession.sessionNumber : 0;

        // Bepaal het nummer van de volgende sessie
        const nextSessionNumber = (lastCompletedSession % trainingPlan.trainings.length) + 1;

        // Vind de volgende sessie op basis van het sessienummer
        const nextSession = trainingPlan.trainings.find(session => session.sessionNumber === nextSessionNumber);
        if (!nextSession) {
            return res.status(404).json({ message: 'Volgende trainingssessie niet gevonden' });
        }

        res.status(200).json({ nextSession });
    } catch (error) {
        res.status(500).json({ message: 'Er is iets misgegaan bij het ophalen van de volgende training', error });
    }
};
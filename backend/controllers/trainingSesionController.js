const TrainingSession = require('../models/TrainingSession');
const TrainingPlan = require('../models/TrainingPlan');
const Progress = require('../models/Progress');

// Haal alle trainingsschema's op
exports.getTrainingSessions = async (req, res) => {
    try {
        const trainingPlans = await TrainingSession.find().populate('exercises.exercise');
        res.status(200).json(trainingPlans);
    } catch (error) {
        res.status(500).json({ message: 'Er is iets misgegaan bij het ophalen van de trainingsschema\'s', error });
    }
};

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

exports.getTrainingSession = async (req, res) => {
    const { trainingSessionId } = req.params;
    try {
        const trainingSession = await TrainingSession.findById(trainingSessionId).populate('exercises.exercise');
        if (!trainingSession) {
            return res.status(404).json({ message: 'TrainingSession niet gevonden' });
        }
        res.status(200).json(trainingSession);
    } catch (error) {
        res.status(500).json({ message: 'Er is iets misgegaan bij het ophalen van de TrainingSession', error });
    }
};

exports.getNextTrainingSession = async (req, res) => {
    const { userId, trainingPlanId } = req.params;
    try {
        // Haal het trainingsplan op en populate de trainingssessies
        const trainingPlan = await TrainingPlan.findById(trainingPlanId).populate({
            path: 'trainings',
            populate: {
                path: 'exercises.exercise',
                model: 'Exercise'
            }
        });
        if (!trainingPlan) {
            return res.status(404).json({ message: 'TrainingPlan niet gevonden' });
        }

        // Haal de laatste voortgang van de gebruiker op
        const lastProgress = await Progress.findOne({ user: userId })
            .sort({ date: -1 }) // Sorteer op datum in aflopende volgorde
            .limit(1) // Limiteer het resultaat tot 1 document
            .populate('trainingSession');

        let nextSessionNumber;
        if (lastProgress && lastProgress.trainingSession) {
            // Bepaal het nummer van de volgende sessie
            nextSessionNumber = (lastProgress.trainingSession.sessionNumber % trainingPlan.trainings.length) + 1;
        } else {
            nextSessionNumber = 1; // Start bij sessie 1 als er geen voortgang is
        }

        // Controleer of het sessienummer groter is dan het hoogste sessienummer in het plan
        const highestSessionNumber = Math.max(...trainingPlan.trainings.map(session => session.sessionNumber));
        if (nextSessionNumber > highestSessionNumber) {
            nextSessionNumber = 1;
        }

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
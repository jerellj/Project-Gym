const mongoose = require('mongoose');

const trainingSessionSchema = new mongoose.Schema({
    trainingPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'TrainingPlan', required: true },
    exercises: [{ 
        exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
        sets: { type: Number, required: true },
        reps: { type: Number, required: true },
        weight: { type: Number }
    }],
    sessionNumber: { type: Number, required: true }, // Sessie nummer binnen het trainingsplan
    date: { type: Date, default: Date.now }
});

const TrainingSession = mongoose.model('TrainingSession', trainingSessionSchema);

module.exports = TrainingSession;
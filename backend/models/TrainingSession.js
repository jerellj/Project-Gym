const mongoose = require('mongoose');

const trainingSessionSchema = new mongoose.Schema({
    name: { type: String, required: false }, // Naam van de sessie
    trainingPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'TrainingPlan', required: false }, // Het trainingsschema waar deze sessie bij hoort
    exercises: [{  // Array met oefeningen
        exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
        sets: { type: Number, required: true },
        reps: { type: Number},
        weight: { type: Number },
        reprange: { // Herhalingen bereik
            start: { type: Number, required: true },
            end: { type: Number, required: true }
        },

    }],
    sessionNumber: { type: Number, required: true }, // Sessie nummer binnen het trainingsplan
    date: { type: Date, default: Date.now }
});

const TrainingSession = mongoose.model('TrainingSession', trainingSessionSchema);

module.exports = TrainingSession;
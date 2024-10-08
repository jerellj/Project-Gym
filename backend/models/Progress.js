const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
    trainingSession: { type: mongoose.Schema.Types.ObjectId, ref: 'TrainingSession', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    exerciseProgress: [{
        exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }, 
        sets: [{
            reps: { type: Number, required: true },
            weight: { type: Number }
        }]
    }],
    notes: { type: String }
});

const Progress = mongoose.model('Progress', ProgressSchema);
module.exports = Progress;

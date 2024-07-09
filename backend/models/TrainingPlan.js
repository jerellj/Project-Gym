const mongoose = require('mongoose');

const TrainingPlanSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    weeks: { type: Number, required: true }, // Duur van het programma in weken
    sessionsPerWeek: { type: Number, required: true }, // Aantal trainingen per week
    createdAt: { type: Date, default: Date.now }
});

const TrainingPlan = mongoose.model('TrainingPlan', TrainingPlanSchema);
module.exports = TrainingPlan;
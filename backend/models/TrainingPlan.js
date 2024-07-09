const mongoose = require('mongoose');

const TrainingPlanSchema = new mongoose.Schema({
    name: { type: String, required: true }, //Naam van het trainingsschema
    description: { type: String }, // Beschrijving van het trainingsschema
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // De gebruiker die het trainingsschema heeft aangemaakt
    weeks: { type: Number, required: true }, // Duur van het programma in weken
    sessionsPerWeek: { type: Number, required: true }, // Aantal trainingen per week
    trainings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TrainingSession' }], // Array met trainingssessies
    createdAt: { type: Date, default: Date.now } // Datum waarop het trainingsschema is aangemaakt
});

const TrainingPlan = mongoose.model('TrainingPlan', TrainingPlanSchema);
module.exports = TrainingPlan;
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['trainer', 'klant'], required: true },
    trainingPlans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TrainingPlan' }]
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
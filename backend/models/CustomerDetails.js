const mongoose = require('mongoose');

const CustomerDetailsSchema = new mongoose.Schema({
    notes: { type: String },
    injury: { type: String },
    weight: { type: Number },
    illness: { type: String },
    goals: { type: String },
});

const CustomerDetails = mongoose.model('CustomerDetails', CustomerDetailsSchema);
module.exports = CustomerDetails; 
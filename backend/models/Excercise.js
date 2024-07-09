const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String },
  force: { type: String },
  level: { type: String },
  mechanic: { type: String},
  equipment: { type: String },
  primaryMuscles: { type: [String] },
  secondaryMuscles: { type: [String] },
  instructions: { type: [String] },
  category: { type: [  'cardio',
    'olympic weightlifting',
    'plyometrics',
    'powerlifting',
    'strength',
    'stretching',
    'strongman'] },
  imageUrl: { type: String } // Voeg dit veld toe voor de foto-URL
});

const Exercise = mongoose.model('Exercise', exerciseSchema);
module.exports = Exercise;
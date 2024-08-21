const { name } = require('../app');
const consExcercise = require('../models/Excercise');
const logger = require('../logger');
const mongoose = require('mongoose');

exports.getExcercises = async (req, res) => {
    try {
        const excercises = await consExcercise.find(); 
        res.status(200).json(excercises);
    } catch (error) {
        logger.error('Error getting excersise:', error);
        res.status(500).json({ message: 'Er is iets misgegaan bij het ophalen van de oefening', error });
    }
};

exports.getCardioExcercises = async (req, res) => {
    try {
        const excercises = await consExcercise.find({category: 'cardio'}); // Selecteer alle klanten en sluit het wachtwoord uit
        res.status(200).json(excercises);
    } catch (error) {
        logger.error('Error getting excersise:', error);
        res.status(500).json({ message: 'Er is iets misgegaan bij het ophalen van de oefening', error });
    }
};

exports.getStrengthExcercises = async (req, res) => {
    try {
        const excercises = await consExcercise.find({category: 'strength'}); // Selecteer alle klanten en sluit het wachtwoord uit
        res.status(200).json(excercises);
    } catch (error) {
        logger.error('Error getting excersise:', error);
        res.status(500).json({ message: 'Er is iets misgegaan bij het ophalen van de oefening', error });
    }
};

exports.getPlyometricsExcercises = async (req, res) => {
    try {
        const excercises = await consExcercise.find({category: 'plyometrics'}); // Selecteer alle klanten en sluit het wachtwoord uit
        res.status(200).json(excercises);
    } catch (error) {
        logger.error('Error getting excersise:', error);
        res.status(500).json({ message: 'Er is iets misgegaan bij het ophalen van de oefening', error });
    }
};

exports.getPowerliftingExcercises = async (req, res) => {
    try {
        const excercises = await consExcercise.find({category: 'powerlifting'}); // Selecteer alle klanten en sluit het wachtwoord uit
        res.status(200).json(excercises);
    } catch (error) {
        logger.error('Error getting excersise:', error);
        res.status(500).json({ message: 'Er is iets misgegaan bij het ophalen van de oefening', error });
    }
};

exports.getStrongmanExcercises = async (req, res) => {
    try {
        const excercises = await consExcercise.find({category: 'strongman'}); // Selecteer alle klanten en sluit het wachtwoord uit
        res.status(200).json(excercises);
    } catch (error) {
        logger.error('Error getting excersise:', error);
        res.status(500).json({ message: 'Er is iets misgegaan bij het ophalen van de oefening', error });
    }
};

exports.getStretchingExcercises = async (req, res) => {
    try {
        const excercises = await consExcercise.find({category: 'stretching'}); // Selecteer alle klanten en sluit het wachtwoord uit
        res.status(200).json(excercises);
    } catch (error) {
        logger.error('Error getting excersise:', error);
        res.status(500).json({ message: 'Er is iets misgegaan bij het ophalen van de oefening', error });
    }
};

exports.getOlympicWeightliftingExcercises = async (req, res) => {
    try {
        const excercises = await consExcercise.find({category: 'OlympicWeightlifting'}); // Selecteer alle klanten en sluit het wachtwoord uit
        res.status(200).json(excercises);
    } catch (error) {
        logger.error('Error getting excersise:', error);
        res.status(500).json({ message: 'Er is iets misgegaan bij het ophalen van de oefening', error });
    }
};

exports.getExcercise = async (req, res) => {
    const { name } = req.query;
    try {
        const excercise = await consExcercise.findOne({name}); // Selecteer alle klanten en sluit het wachtwoord uit
        logger.info(`Getting excercise with name: ${name}`); // Log inlogpoging
        res.status(200).json(excercise);
    } catch (error) {
        logger.error('Error getting excersise:', error);
        res.status(500).json({ message: 'Er is iets misgegaan bij het ophalen van de oefening', error });
    }
};

exports.getExcerciseName = async (req, res) => {
    const { id } = req.query;
    try {
        const objectId = new mongoose.Types.ObjectId(id);
        const excercise = await consExcercise.findOne({_id: objectId }); // Selecteer alle klanten en sluit het wachtwoord uit
        logger.info(`Getting excercise with name: ${id}`); // Log inlogpoging
        res.status(200).json(excercise);
    } catch (error) {
        logger.error('Error getting excersise:', error);
        res.status(500).json({ message: 'Er is iets misgegaan bij het ophalen van de oefening', error });
    }
};

exports.registerExcercise = async (req, res) => {
    const { name, email, password, role } = req.body;
    logger.info(`creating new excersice: ${name}`); // Log registratiepoging
    console.log('Request body:', req.body); // Log de request body
    try {
        const newExercise = new consExcercise({ name, force, level, mechanic, equipment, primaryMuscles, secondaryMuscles, instructions, category });
        await newUser.save();
        const token = generateToken(newUser);
        res.status(201).json({ message: 'Gebruiker succesvol geregistreerd', token });
    } catch (error) {
        logger.error('Error registering user:', error); // Log foutmelding
        console.error('Error registering user:', error); // Log foutmelding naar console
        res.status(500).json({ message: 'Er is iets misgegaan bij het registreren van de gebruiker', error });
    }
};
/* 

  'cardio',
  'olympic weightlifting',
  'plyometrics',
  'powerlifting',
  'strength',
  'stretching',
  'strongman'

mongoose.Schema({
  name: { type: String },
  force: { type: String },
  level: { type: String },
  mechanic: { type: String},
  equipment: { type: String },
  primaryMuscles: { type: [String] },
  secondaryMuscles: { type: [String] },
  instructions: { type: [String] },
  category: { type: String },
  imageUrl: { type: String } // Voeg dit veld toe voor de foto-URL


registerExcercise

updateExcercise

getExcercises

getExcercise

*/
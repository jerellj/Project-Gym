const mongoose = require('mongoose');
const logger = require('../logger');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/training-app', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        logger.info('Verbonden met MongoDB');
    } catch (error) {
        logger.error('Fout bij verbinden met MongoDB:', error);
        process.exit(1); // Beëindig het proces als de verbinding faalt
    }
};

module.exports = connectDB;
const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');
const logger = require('./logger'); // Importeer de logger

const PORT = process.env.PORT || 5001;

// Verbind met de database en start de server
const startServer = async () => {
    try {
        await connectDB(); // Verbind met de database
        app.listen(PORT, () => {
            logger.info(`Server draait op poort ${PORT}`);
        });
    } catch (error) {
        logger.error('Server kon niet starten:', error);
        process.exit(1); // Beëindig het proces als de verbinding faalt
    }
};

startServer();
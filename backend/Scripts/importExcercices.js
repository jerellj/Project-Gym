const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Exercise = require('../models/Excercises'); // Corrigeer het pad en de bestandsnaam

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/training-app', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Verbonden met MongoDB');
  } catch (error) {
    console.error('Fout bij verbinden met MongoDB:', error);
    process.exit(1);
  }
};

const fetchDirectories = async () => {
  try {
    const response = await axios.get('https://api.github.com/repos/wrkout/exercises.json/contents/exercises', {
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
      }
    });
    const items = response.data;

    const urls = items.map(item => item.url);
    return urls
  } catch (error) {
    console.error('Fout bij het ophalen van de directorieslijst:', error);
    throw error;
  }
};


const fetchExercisesFromDirectory = async (directoryUrl) => {
  try {
    const response = await axios.get(directoryUrl, {
      headers: {
          'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
        }
      });
    const files = response.data;
    console.log(files[0]);
    // Zoek het JSON-bestand in de directory
    const jsonFile = files.find(file => file.name.endsWith('.json'));
    if (jsonFile) {
      const jsonResponse = await axios.get(jsonFile.download_url);
      return jsonResponse.data;
    }
  } catch (error) {
    console.error(`Fout bij het ophalen van oefeningen uit directory ${directoryUrl}:`, error);
    throw error;
  }
};

const fetchExercises = async () => {
  try {
    const directories = await fetchDirectories();

    for (const directoryUrl of directories) {
      const exercise = await fetchExercisesFromDirectory(directoryUrl);

      if (exercise) {
        const newExercise = new Exercise({
          name: exercise.name,
          force: exercise.force,
          level: exercise.level,
          mechanic: exercise.mechanic,
          equipment: exercise.equipment,
          primaryMuscles: exercise.primaryMuscles,
          secondaryMuscles: exercise.secondaryMuscles,
          instructions: exercise.instructions,
          category: exercise.category,
          imageUrl: exercise.imageUrl // Voeg dit veld toe voor de foto-URL
        });

        await newExercise.save();
      }
    }

    console.log('Oefeningen succesvol opgeslagen in de database');
  } catch (error) {
    console.error('Fout bij het ophalen van oefeningen:', error);
  }
};

const run = async () => {
  await connectDB();
  await fetchExercises();
  mongoose.connection.close();
};

run();
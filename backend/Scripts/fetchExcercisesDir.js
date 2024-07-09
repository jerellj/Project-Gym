const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Exercise = require('../models/Excercises'); // Corrigeer het pad en de bestandsnaam
const Url = 'https://api.github.com/repos/wrkout/exercises.json/contents/exercises/3_4_Sit-Up?ref=master';
dotenv.config();

console.log(`Bearer ${process.env.GITHUB_TOKEN}`);
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

  fetchExercisesFromDirectory(Url);
  
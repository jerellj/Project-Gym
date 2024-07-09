const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Exercise = require('../models/Excercises'); // Corrigeer het pad en de bestandsnaam

dotenv.config();

const fetchDirectories = async () => {
    try {
      const response = await axios.get('https://api.github.com/repos/wrkout/exercises.json/contents/exercises', {
        headers: {
          'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
        }
      });
      const items = response.data;
  
      const urls = items.map(item => item.html_url);
      console.log(items[0])
      return urls
    } catch (error) {
      console.error('Fout bij het ophalen van de directorieslijst:', error);
      throw error;
    }
  };
/*
const fetchDirectories = async () => {
  console.log(`${token}`);
  try {
    const response = await axios.get('https://api.github.com/repos/wrkout/exercises.json/contents/exercises', {
      headers: {
        'Authorization': `Bearer ${dotenv.GITHUB_TOKEN}`
      }
    });
    const items = response.data;

    const urls = items.map(item => item.html_url);
    console.log(urls)
    return urls
  } catch (error) {
    console.error('Fout bij het ophalen van de directorieslijst:', error);
    throw error;
  }
};
*/

fetchDirectories();


import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const SearchExercises = () => {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [category, setCategory] = useState('');
  const [primaryMuscles, setPrimaryMuscles] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  console.log('API Base URL:', apiBaseUrl); // Controleer de waarde van apiBaseUrl

  useEffect(() => {
    // Haal alle oefeningen op bij het laden van de component
    axios.get(`${apiBaseUrl}/Excercise/excercises`)
      .then(response => {
        console.log('Fetched exercises:', response.data); // Debugging line
        setExercises(response.data);
      })
      .catch(error => console.error('Error fetching exercises:', error));
  }, [apiBaseUrl]); // Correctie: 'apiBaseUrl' toegevoegd aan de afhankelijkheidsarray

  const handleSearch = useCallback(() => {
    let results = exercises;

    if (searchName.length >= 3) {
      results = results.filter(exercise => exercise.name.toLowerCase().includes(searchName.toLowerCase()));
    }

    if (category) {
      results = results.filter(exercise => exercise.category.includes(category));
    }

    if (primaryMuscles) {
      results = results.filter(exercise => exercise.primaryMuscles.includes(primaryMuscles));
    }

    console.log('Filtered results:', results); // Debugging line
    setFilteredExercises(results);
  }, [searchName, category, primaryMuscles, exercises]);

  useEffect(() => {
    handleSearch();
  }, [searchName, category, primaryMuscles, handleSearch]); // Voeg 'handleSearch' toe als dependency

  return (
    <div>
      <h1>Search Exercises</h1>
      <div>
        <label>Search by Name:</label>
        <input 
          type="text" 
          value={searchName} 
          onChange={(e) => setSearchName(e.target.value)} 
          placeholder="Type at least 3 characters" 
        />
      </div>
      <div>
        <label>Category:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          <option value="strength">Strength</option>
          <option value="cardio">Cardio</option>
          <option value="stretching">Stretching</option>
          <option value="plyometrics">Plyometrics</option>
          <option value="powerlifting">Powerlifting</option>
          <option value="strongman">Strongman</option>
          <option value="olympic weightlifting">Olympic Weightlifting</option>
        </select>
      </div>
      <div>
        <label>Primary Muscles:</label>
        <select value={primaryMuscles} onChange={(e) => setPrimaryMuscles(e.target.value)}>
          <option value="">Select Primary Muscle</option>
          <option value="abdominals">Abdominals</option>
          <option value="adductors">Adductors</option>
          <option value="calves">Calves</option>
          <option value="forearms">Forearms</option>
          <option value="hamstrings">Hamstrings</option>
          <option value="lower back">Lower back</option>
          <option value="neck">Neck</option>
          <option value="shoulders">Shoulders</option>
          <option value="triceps">Triceps</option>
          <option value="abductors">Abductors</option>
          <option value="biceps">Biceps</option>
          <option value="chest">Chest</option>
          <option value="glutes">Glutes</option>
          <option value="lats">Lats</option>
          <option value="middle back">Middle back</option>
          <option value="quadriceps">Quadriceps</option>
          <option value="traps">Traps</option>
        </select>
      </div>
      <ul>
        {filteredExercises.map(exercise => (
          <li key={exercise._id} onClick={() => setSelectedExercise(exercise)}>
            {exercise.name}
          </li>
        ))}
      </ul>
      {selectedExercise && (
        <div>
          <h2>Exercise Details</h2>
          <p><strong>Name:</strong> {selectedExercise.name}</p>
          <p><strong>Category:</strong> {selectedExercise.category}</p>
          <p><strong>Primary Muscles:</strong> {selectedExercise.primaryMuscles.join(', ')}</p>
          <p><strong>Secondary Muscles:</strong> {selectedExercise.secondaryMuscles.join(', ')}</p>
          <p><strong>Instructions:</strong></p>
          <ul>
            {selectedExercise.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchExercises;
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './CSS/SearchExercises.css';

const SearchExercises = () => {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [category, setCategory] = useState('');
  const [primaryMuscles, setPrimaryMuscles] = useState('');
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [primaryMuscleGroups, setPrimaryMuscleGroups] = useState([]);

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    axios.get(`${apiBaseUrl}/Excercise/excercises`)
      .then(response => {
        const exercisesData = response.data;
        setExercises(exercisesData);
        extractFilterData(exercisesData);
      })
      .catch(error => console.error('Error fetching exercises:', error));
  }, [apiBaseUrl]);

  const extractFilterData = (exercisesData) => {
    const uniqueCategories = Array.from(new Set(exercisesData.flatMap(exercise => exercise.category).filter(Boolean)));
    const uniquePrimaryMuscles = Array.from(new Set(exercisesData.flatMap(exercise => exercise.primaryMuscles).filter(Boolean)));

    setCategories(uniqueCategories);
    setPrimaryMuscleGroups(uniquePrimaryMuscles);
  };

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

    setFilteredExercises(results);
  }, [searchName, category, primaryMuscles, exercises]);

  useEffect(() => {
    handleSearch();
  }, [searchName, category, primaryMuscles, handleSearch]);

  const toggleExerciseDetails = (exerciseId) => {
    if (selectedExerciseId === exerciseId) {
      setSelectedExerciseId(null);
    } else {
      setSelectedExerciseId(exerciseId);
    }
  };

  return (
    <div className="search-exercises-container">
      <h1>Find Your Exercise</h1>
      <div className="search-bar">
        <label>Search:</label>
        <input 
          type="text" 
          value={searchName} 
          onChange={(e) => setSearchName(e.target.value)} 
          placeholder="Type at least 3 characters" 
        />
      </div>
      <div className="filters">
        <label>Category:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
        <label>Primary Muscles:</label>
        <select value={primaryMuscles} onChange={(e) => setPrimaryMuscles(e.target.value)}>
          <option value="">Select Primary Muscle</option>
          {primaryMuscleGroups.map((muscle, index) => (
            <option key={index} value={muscle}>{muscle}</option>
          ))}
        </select>
      </div>
      <div className="exercise-list">
        {filteredExercises.map(exercise => (
          <div 
            key={exercise._id} 
            className="exercise-card" 
            onClick={() => toggleExerciseDetails(exercise._id)}
          >
            <h2>{exercise.name}</h2>
            <p>Category: {exercise.category}</p>
            {selectedExerciseId === exercise._id && (
              <div className="exercise-details">
                <p>Primary Muscles: {exercise.primaryMuscles.join(', ')}</p>
                <p>Secondary Muscles: {exercise.secondaryMuscles.join(', ')}</p>
                <p>Instructions:</p>
                <ul>
                  {exercise.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchExercises;
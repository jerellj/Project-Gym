import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddTrainingSession = () => {
  const [trainingPlanId, setTrainingPlanId] = useState('');
  const [newTrainingPlanId, setNewTrainingPlanId] = useState('');
  const [trainingPlans, setTrainingPlans] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [exerciseList, setExerciseList] = useState([{ exerciseId: '', sets: '', start: '', end: '', weight: '' }]);
  const [sessionNumber, setSessionNumber] = useState('');
  const [name, setName] = useState('');

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    // Haal de lijst van oefeningen op vanuit de API
    axios.get(`${apiBaseUrl}/exercises`)
      .then(response => setExercises(response.data))
      .catch(error => console.error('Error fetching exercises:', error));
    
    // Haal de lijst van trainingsplannen op vanuit de API
    axios.get(`${apiBaseUrl}/trainingPlans`)
      .then(response => setTrainingPlans(response.data))
      .catch(error => console.error('Error fetching training plans:', error));
  }, [apiBaseUrl]);

  const handleTrainingPlanChange = (e) => {
    const value = e.target.value;
    if (value === 'new') {
      setTrainingPlanId('');
    } else {
      setTrainingPlanId(value);
      setNewTrainingPlanId('');
    }
  }

  const handleExerciseChange = (index, field, value) => {
    const updatedExerciseList = [...exerciseList];
    updatedExerciseList[index][field] = value;
    setExerciseList(updatedExerciseList);
  }

  const addExerciseField = () => {
    setExerciseList([...exerciseList, { exerciseId: '', sets: '', start: '', end: '', weight: '' }]);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // Log de exerciseList om te controleren of de velden correct zijn ingevuld
    console.log('Exercise List:', exerciseList);

    const exercisesData = exerciseList.map(exercise => ({
      exercise: exercise.exerciseId,
      sets: parseInt(exercise.sets),
      reprange: { start: parseInt(exercise.start), end: parseInt(exercise.end) },
      weight: parseInt(exercise.weight)
    }));

    // Log de data die naar de server wordt verzonden
    console.log('Exercises Data:', exercisesData);

    axios.post(`${apiBaseUrl}/trainingSessions`, {
      name: name,
      trainingPlanId: trainingPlanId || newTrainingPlanId,
      exercises: exercisesData,
      sessionNumber: parseInt(sessionNumber)
    })
    .then(response => {
      console.log('Training session created:', response.data);
    })
    .catch(error => {
      console.error('Error creating training session:', error.response ? error.response.data : error.message);
    });
  }

  return (
    <div>
      <h1>Add Training Session</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Enter session name" 
            required
          />
        </div>
        <div>
          <label>Training Plan ID:</label>
          <select value={trainingPlanId} onChange={handleTrainingPlanChange} required>
            <option value="">Select Existing Training Plan</option>
            {trainingPlans.map(plan => (
              <option key={plan._id} value={plan._id}>{plan.name}</option>
            ))}
            <option value="new">New Training Plan</option>
          </select>
          {trainingPlanId === '' && (
            <div>
              <label>New Training Plan ID:</label>
              <input type="text" value={newTrainingPlanId} onChange={(e) => setNewTrainingPlanId(e.target.value)} required />
            </div>
          )}
        </div>
        {exerciseList.map((exercise, index) => (
          <div key={index}>
            <div>
              <label>Exercise:</label>
              <select value={exercise.exerciseId} onChange={(e) => handleExerciseChange(index, 'exerciseId', e.target.value)} required>
                <option value="">Select Exercise</option>
                {exercises.map(exercise => (
                  <option key={exercise._id} value={exercise._id}>{exercise.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Sets:</label>
              <input type="number" value={exercise.sets} onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)} required />
            </div>
            <div>
              <label>Rep Range Start:</label>
              <input type="number" value={exercise.start} onChange={(e) => handleExerciseChange(index, 'start', e.target.value)} required />
            </div>
            <div>
              <label>Rep Range End:</label>
              <input type="number" value={exercise.end} onChange={(e) => handleExerciseChange(index, 'end', e.target.value)} required />
            </div>
            <div>
              <label>Weight:</label>
              <input type="number" value={exercise.weight} onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)} required />
            </div>
          </div>
        ))}
        <button type="button" onClick={addExerciseField}>Add Exercise</button>
        <div>
          <label>Session Number:</label>
          <input type="number" value={sessionNumber} onChange={(e) => setSessionNumber(e.target.value)} required />
        </div>
        <button type="submit">Add Training Session</button>
      </form>
    </div>
  );
}

export default AddTrainingSession;
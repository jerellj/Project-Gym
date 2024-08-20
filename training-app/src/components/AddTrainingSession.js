import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

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
    axios.get(`${apiBaseUrl}/excercise`)
      .then(response => {
        console.log('Exercises data:', response.data);
        setExercises(response.data);
      })
      .catch(error => console.error('Error fetching exercises:', error));
    
    axios.get(`${apiBaseUrl}/trainingPlans`)
      .then(response => {
        console.log('Training plans data:', response.data);
        setTrainingPlans(response.data);
      })
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

  const handleExerciseChange = (index, selectedOption) => {
    const updatedExerciseList = [...exerciseList];
    updatedExerciseList[index]['exerciseId'] = selectedOption.value;
    setExerciseList(updatedExerciseList);
  };

  const handleInputChange = (index, field, value) => {
    const updatedExerciseList = [...exerciseList];
    updatedExerciseList[index][field] = value;

    if (field === 'start') {
      updatedExerciseList[index]['end'] = value;  // Reset 'end' if 'start' changes
    }

    setExerciseList(updatedExerciseList);
  }

  const addExerciseField = () => {
    setExerciseList([...exerciseList, { exerciseId: '', sets: '', start: '', end: '', weight: '' }]);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const exercisesData = exerciseList.map(exercise => ({
      exercise: exercise.exerciseId,
      sets: parseInt(exercise.sets),
      reprange: { start: parseInt(exercise.start), end: parseInt(exercise.end) },
      weight: parseInt(exercise.weight)
    }));

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

  const exerciseOptions = exercises.map(exercise => ({
    value: exercise._id,
    label: exercise.name
  }));

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minWidth: '200px',
      maxWidth: '300px',
    }),
    menu: (provided) => ({
      ...provided,
      width: '200px',
    }),
    option: (provided) => ({
      ...provided,
      padding: '5px 10px',
    }),
  };

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
            {trainingPlans.length > 0 ? (
              trainingPlans.map(plan => (
                <option key={plan._id} value={plan._id}>{plan.name}</option>
              ))
            ) : (
              <option value="">No training plans available</option>
            )}
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
              <Select
                options={exerciseOptions}
                onChange={(selectedOption) => handleExerciseChange(index, selectedOption)}
                value={exerciseOptions.find(option => option.value === exercise.exerciseId)}
                placeholder="Type to search..."
                styles={customStyles}
                isClearable
              />
            </div>
            <div>
              <label>Sets:</label>
              <input
                type="number"
                value={exercise.sets}
                onChange={(e) => handleInputChange(index, 'sets', e.target.value)}
                required
              />
            </div>
            <div>
              <label>Rep Range Start:</label>
              <select value={exercise.start} onChange={(e) => handleInputChange(index, 'start', parseInt(e.target.value))} required>
                {[...Array(20).keys()].map(i => (
                  <option key={i+1} value={i+1}>{i+1}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Rep Range End:</label>
              <select value={exercise.end} onChange={(e) => handleInputChange(index, 'end', parseInt(e.target.value))} required>
                {exercise.start && [...Array(21 - parseInt(exercise.start)).keys()]
                  .filter(i => i + parseInt(exercise.start) <= 20)
                  .map(i => (
                    <option key={i + parseInt(exercise.start)} value={i + parseInt(exercise.start)}>{i + parseInt(exercise.start)}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Weight:</label>
              <input
                type="number"
                value={exercise.weight}
                onChange={(e) => handleInputChange(index, 'weight', e.target.value)}
                required
              />
            </div>
          </div>
        ))}
        <button type="button" onClick={addExerciseField}>Add Exercise</button>
        <div>
          <label>Session Number:</label>
          <input
            type="number"
            value={sessionNumber}
            onChange={(e) => setSessionNumber(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Training Session</button>
      </form>
    </div>
  );
}

export default AddTrainingSession;
import React, { useState } from 'react';
import axios from 'axios';

const AddTrainingPlan = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [weeks, setWeeks] = useState('');
  const [sessionsPerWeek, setSessionsPerWeek] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5001/api/trainingPlans', {
      name,
      description,
      weeks: parseInt(weeks),
      sessionsPerWeek: parseInt(sessionsPerWeek),
      userId: '1234567890abcdef12345678' // Vervang met de daadwerkelijke userId
    })
      .then(response => {
        console.log('Training plan created:', response.data);
      })
      .catch(error => console.error('Error creating training plan:', error));
  }

  return (
    <div>
      <h1>Add Training Plan</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Description:</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label>Weeks:</label>
          <input type="number" value={weeks} onChange={(e) => setWeeks(e.target.value)} required />
        </div>
        <div>
          <label>Sessions per Week:</label>
          <input type="number" value={sessionsPerWeek} onChange={(e) => setSessionsPerWeek(e.target.value)} required />
        </div>
        <button type="submit">Add Training Plan</button>
      </form>
    </div>
  );
}

export default AddTrainingPlan;
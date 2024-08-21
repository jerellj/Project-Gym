import React, { useState } from 'react';
import axios from 'axios';
import './CSS/AddTrainingPlan.css'; // Voeg een aangepast CSS-bestand toe

const AddTrainingPlan = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [weeks, setWeeks] = useState('');
  const [sessionsPerWeek, setSessionsPerWeek] = useState('');
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${apiBaseUrl}/trainingPlans`, {
      name,
      description,
      weeks: parseInt(weeks),
      sessionsPerWeek: parseInt(sessionsPerWeek),
      userId: '1234567890abcdef12345678' // Vervang met de daadwerkelijke userId
    })
      .then(response => {
        console.log('Training plan created:', response.data);
        // Optioneel: Reset het formulier na succesvolle inzending
        setName('');
        setDescription('');
        setWeeks('');
        setSessionsPerWeek('');
      })
      .catch(error => console.error('Error creating training plan:', error));
  }

  return (
    <div className="add-training-plan-container">
      <h1 className="title">Add Training Plan</h1>
      <form onSubmit={handleSubmit} className="training-plan-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="weeks">Weeks:</label>
          <input
            type="number"
            id="weeks"
            value={weeks}
            onChange={(e) => setWeeks(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="sessionsPerWeek">Sessions per Week:</label>
          <input
            type="number"
            id="sessionsPerWeek"
            value={sessionsPerWeek}
            onChange={(e) => setSessionsPerWeek(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">Add Training Plan</button>
      </form>
    </div>
  );
}

export default AddTrainingPlan;
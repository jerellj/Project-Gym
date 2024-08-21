import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CSS/TrainingPlans.css'; // Voeg een aangepast CSS-bestand toe

const TrainingPlans = () => {
  const [trainingPlans, setTrainingPlans] = useState([]);
  const [selectedTrainingPlan, setSelectedTrainingPlan] = useState(null);
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    axios.get(`${apiBaseUrl}/trainingPlans`)
      .then(response => setTrainingPlans(response.data))
      .catch(error => console.error('Error fetching training plans:', error));
  }, [apiBaseUrl]);

  return (
    <div className="training-plans-container">
      <h1 className="title">Training Plans</h1>
      <div className="plans-list">
        {trainingPlans.map(trainingPlan => (
          <div 
            key={trainingPlan._id} 
            className="plan-card"
            onClick={() => setSelectedTrainingPlan(trainingPlan)}
          >
            <h2>{trainingPlan.name}</h2>
            <p>Duration: {trainingPlan.weeks} weeks</p>
            <p>Sessions per week: {trainingPlan.sessionsPerWeek}</p>
          </div>
        ))}
      </div>
      {selectedTrainingPlan && (
        <div className="plan-details">
          <h2>Training Plan Details</h2>
          <p><strong>Name:</strong> {selectedTrainingPlan.name}</p>
          <p><strong>Duration:</strong> {selectedTrainingPlan.weeks}</p>
          <p><strong>Sessions per week:</strong> {selectedTrainingPlan.sessionsPerWeek}</p>
          <p><strong>Workouts:</strong></p>
          <ul>
            {selectedTrainingPlan.trainings.map((training, index) => (
              <li key={index}>
                <a href={`/trainingSessions/${training._id}`} target="_blank" rel="noreferrer">
                  {training.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TrainingPlans;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    <div>
      <h1>Training Plans</h1>
      {selectedTrainingPlan && (
        <div>
          <h2>Training Plan Details</h2>
          <p><strong>Name:</strong> {selectedTrainingPlan.name}</p>
          <p><strong>Duration:</strong> {selectedTrainingPlan.weeks}</p>
          <p><strong>Sessions per week:</strong> {selectedTrainingPlan.sessionsPerWeek}</p>
          <p><strong>Workouts:</strong></p>
          <ul>
            {selectedTrainingPlan.trainings.map((training, index) => (
              <li key={index}>
                <a href={`/trainingSessions/${training._id}`} target="_blank" rel="noreferrer">
                  <strong>Workout Name:</strong> {training.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <ul>
        {trainingPlans.map(trainingPlan => (
          <li key={trainingPlan._id} onClick={() => setSelectedTrainingPlan(trainingPlan)}>
            {trainingPlan.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TrainingPlans;
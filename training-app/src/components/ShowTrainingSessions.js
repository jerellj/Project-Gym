import React, { useState, useEffect } from "react";
import axios from "axios";
import './CSS/ShowTrainingSessions.css'; // Voeg een aangepast CSS-bestand toe

const ShowTrainingSessions = ({ onSelectTrainingsession }) => {
  const [trainingsessions, setTrainingsessions] = useState([]);
  const [selectedTrainingsession, setSelectedTrainingsession] = useState(null);

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    axios.get(`${apiBaseUrl}/trainingSessions`)
      .then(response => {
        setTrainingsessions(response.data);
      })
      .catch(error => console.error('Error fetching Trainingsessions:', error));
  }, [apiBaseUrl]);

  return (
    <div className="show-training-sessions-container">
      <h2 className="title">Select a Training Session</h2>
      <div className="training-sessions-list">
        <ul>
          {trainingsessions.map(trainingsession => (
            <li 
              key={trainingsession._id} 
              className="session-item"
              onClick={() => setSelectedTrainingsession(trainingsession)}
            >
              {trainingsession.name}
            </li>
          ))}
        </ul>
      </div>
      {selectedTrainingsession && (
        <div className="training-session-details">
          <h2 className="details-title">Training Session Details</h2>
          <p><strong>Name:</strong> {selectedTrainingsession.name}</p>
          <p><strong>Training Plan:</strong> {selectedTrainingsession.trainingPlan}</p>
          <p><strong>Session Number:</strong> {selectedTrainingsession.sessionNumber}</p>
          <p><strong>Exercises:</strong></p>
          <ul className="exercise-list">
            {selectedTrainingsession.exercises.map((exercise, index) => (
              <li key={index} className="exercise-item">
                <p><strong>Exercise Name:</strong> {exercise.exercise.name}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ShowTrainingSessions;
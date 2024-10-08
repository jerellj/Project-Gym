import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './CSS/TrainingSessionDetails.css'; // Voeg een aangepast CSS-bestand toe

const TrainingSessionDetails = () => {
  const { id } = useParams();
  const [trainingSession, setTrainingSession] = useState(null);
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    axios.get(`${apiBaseUrl}/trainingSessions/${id}`)
      .then(response => setTrainingSession(response.data))
      .catch(error => console.error('Error fetching training session:', error));
  }, [id, apiBaseUrl]);

  return (
    <div className="session-details-container">
      {trainingSession ? (
        <div className="session-details-card">
          <h2 className="session-title">Training Session Details</h2>
          <p><strong>Name:</strong> {trainingSession.name}</p>
          <p><strong>Session Number:</strong> {trainingSession.sessionNumber}</p>
          <p><strong>Exercises:</strong></p>
          <ul className="exercise-list">
            {trainingSession.exercises.map((exerciseDetail, index) => (
              <li key={index} className="exercise-item">
                <p><strong>Exercise Name:</strong> {exerciseDetail.exercise.name}</p>
                <p><strong>Sets:</strong> {exerciseDetail.sets}</p>
                <p><strong>Reps:</strong> {exerciseDetail.reps}</p>
                <p><strong>Weight:</strong> {exerciseDetail.weight} kg</p>
                <p><strong>Rep Range:</strong> {exerciseDetail.reprange.start} - {exerciseDetail.reprange.end}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default TrainingSessionDetails;
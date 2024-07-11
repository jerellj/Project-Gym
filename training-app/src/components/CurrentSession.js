import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CurrentSession = ({ userId }) => {
  const [session, setSession] = useState(null);

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    // Haal de sessie van vandaag op voor de geselecteerde gebruiker
    axios.get(`${apiBaseUrl}/users/${userId}/currentSession`)
      .then(response => {
        setSession(response.data);
      })
      .catch(error => console.error('Error fetching current session:', error));
  }, [userId, apiBaseUrl]);

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Today's Session</h2>
      <p>Session Number: {session.sessionNumber}</p>
      <p>Exercises:</p>
      <ul>
        {session.exercises.map((exercise, index) => (
          <li key={index}>{exercise.name} - Sets: {exercise.sets}, Reps: {exercise.repRange.start}-{exercise.repRange.end}, Weight: {exercise.weight}</li>
        ))}
      </ul>
    </div>
  );
};

export default CurrentSession;
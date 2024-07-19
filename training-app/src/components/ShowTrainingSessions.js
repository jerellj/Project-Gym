import React, { useState, useEffect } from "react";
import axios from "axios";

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
    <div>
      <h2>Select a Trainingssession</h2>
      {selectedTrainingsession && (
        <div>
          <h2>Training Session Details</h2>
          <p><strong>Name:</strong> {selectedTrainingsession.name}</p>
          <p><strong>Trainingsschema:</strong> {selectedTrainingsession.trainingPlan}</p>
          <p><strong>Sessie Nummer:</strong> {selectedTrainingsession.sessionNumber}</p>
          <p><strong>Excercise:</strong></p>
          <ul>
            {selectedTrainingsession.exercises.map((exercise, index) => (
              <li key={index}>
                <p><strong>Exercise Name:</strong> {exercise.exercise.name}</p>
              </li>
            ))}
          </ul> 
        </div>
      )}
      <ul>
        {trainingsessions.map(trainingsession => (
          <li key={trainingsession._id} onClick={() => setSelectedTrainingsession(trainingsession)}>
            {trainingsession.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShowTrainingSessions;
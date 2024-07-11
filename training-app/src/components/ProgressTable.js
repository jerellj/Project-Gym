import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProgressTable = ({ userId }) => {
  const [progress, setProgress] = useState([]);

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    // Haal de progressiegegevens op voor de geselecteerde gebruiker
    axios.get(`${apiBaseUrl}/users/${userId}/progress`)
      .then(response => {
        setProgress(response.data);
      })
      .catch(error => console.error('Error fetching progress:', error));
  }, [userId, apiBaseUrl]);

  return (
    <div>
      <h2>Progress Table</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Exercise</th>
            <th>Sets</th>
            <th>Rep Range</th>
            {Array.from({ length: 4 }, (_, i) => (
              <React.Fragment key={i}>
                <th>Set {i + 1} Reps</th>
                <th>Set {i + 1} Weight</th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {progress.map((session, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{session.exercise.name}</td>
              <td>{session.exercise.sets}</td>
              <td>{session.exercise.repRange.start}-{session.exercise.repRange.end}</td>
              {session.exercise.setsData.map((set, i) => (
                <React.Fragment key={i}>
                  <td>{set.reps}</td>
                  <td>{set.weight}</td>
                </React.Fragment>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProgressTable;
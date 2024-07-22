import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    // Haal de lijst van gebruikers op vanuit de API
    axios.get(`${apiBaseUrl}/users`)
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => console.error('Error fetching users:', error));
  }, [apiBaseUrl]);

  return (
    <div>
      <h2>Select a User</h2>
      <label>Select User:</label>
        <select onChange={(e) => setSelectedUser(users.find(user => user._id === e.target.value))}>
          <option value="">Select a user</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>{user.name}</option>
          ))}
        </select>
        {selectedUser && (
        <div>
          <h2>Training Plan Details</h2>
          <p><strong>Name:</strong> {selectedUser.name}</p>
          <p><strong>Duration:</strong> {selectedUser.weeks}</p>
          <p><strong>Sessions per week:</strong> {selectedUser.sessionsPerWeek}</p>
          <p><strong>Workouts:</strong></p>
          <ul>
            {selectedUser.trainings.map((training, index) => (
              <li key={index}>
                <a href={`/trainingSessions/${training._id}`} target="_blank" rel="noreferrer">
                  <strong>Workout Name:</strong> {training.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserList;
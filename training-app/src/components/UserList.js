import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);

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
      <ul>
        {users.map(user => (
          <li key={user._id} onClick={() => onSelectUser(user)}>
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
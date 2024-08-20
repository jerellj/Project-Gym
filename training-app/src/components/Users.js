import React, { useState } from 'react';
import axios from 'axios';

const CreateUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verstuur de gegevens naar de server om een nieuwe gebruiker aan te maken
    axios.post(`${apiBaseUrl}/users`, { name, email, password })
      .then(response => {
        setMessage('Gebruiker succesvol aangemaakt');
        setName('');
        setEmail('');
        setPassword('');
      })
      .catch(error => {
        console.error('Error creating user:', error.response ? error.response.data : error.message);
        setMessage('Er is iets misgegaan bij het aanmaken van de gebruiker');
      });
  };

  return (
    <div>
      <h1>Nieuwe Gebruiker Aanmaken</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Naam:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Voer naam in"
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Voer e-mail in"
            required
          />
        </div>
        <div>
          <label>Wachtwoord:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Voer wachtwoord in"
            required
          />
        </div>
        <button type="submit">Gebruiker Aanmaken</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateUser;

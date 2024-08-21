import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './CSS/UsersList.css'; // Voeg een aangepast CSS-bestand toe

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [trainingPlans, setTrainingPlans] = useState([]);
  const [selectedTrainingPlan, setSelectedTrainingPlan] = useState(null);
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    axios.get(`${apiBaseUrl}/users`)
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => console.error('Error fetching users:', error));

    axios.get(`${apiBaseUrl}/trainingPlans`)
      .then(response => {
        setTrainingPlans(response.data);
      })
      .catch(error => console.error('Error fetching training plans:', error));
  }, [apiBaseUrl]);

  const handleUserChange = (selectedOption) => {
    if (!selectedOption) return;
    const user = users.find(u => u._id === selectedOption.value);
    setSelectedUser(user);
    if (user && user.trainingPlans.length > 0) {
      setSelectedTrainingPlan(user.trainingPlans[0]);
    } else {
      setSelectedTrainingPlan(null);
    }
  };

  const handleTrainingPlanChange = (e) => {
    const trainingPlanId = e.target.value;
    const trainingPlan = trainingPlans.find(plan => plan._id === trainingPlanId);
    setSelectedTrainingPlan(trainingPlan);
  };

  const handleAddTrainingPlan = (e) => {
    e.preventDefault();
    axios.post(`${apiBaseUrl}/users/addTrainingPlan`, {
      userId: selectedUser._id,
      trainingPlanId: selectedTrainingPlan._id
    })
      .then(response => {
        setSelectedUser(response.data.user);
      })
      .catch(error => console.error('Error adding training plan to user:', error));
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    axios.post(`${apiBaseUrl}/users`, { name: newUserName, email: newUserEmail })
      .then(response => {
        setUsers([...users, response.data.user]);
        setNewUserName('');
        setNewUserEmail('');
        setShowCreateUserForm(false);
      })
      .catch(error => console.error('Error creating user:', error));
  };

  const userOptions = users.map(user => ({
    value: user._id,
    label: user.name
  }));

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minWidth: '200px',
      maxWidth: '300px',
    }),
    menu: (provided) => ({
      ...provided,
      width: '200px',
    }),
    option: (provided) => ({
      ...provided,
      padding: '5px 10px',
    }),
  };

  return (
    <div className="user-list-container">
      <h2 className="title">Create New User or Select User</h2>
      <button className="toggle-button" onClick={() => setShowCreateUserForm(!showCreateUserForm)}>
        {showCreateUserForm ? 'Cancel' : 'Create New User'}
      </button>

      {showCreateUserForm ? (
        <form onSubmit={handleCreateUser} className="create-user-form">
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="Enter name"
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
          </div>
          <button type="submit" className="submit-button">Create User</button>
        </form>
      ) : (
        <div className="select-user">
          <label>Search and Select User:</label>
          <Select
            options={userOptions}
            onChange={handleUserChange}
            isClearable
            placeholder="Type to search..."
            styles={customStyles}
          />
        </div>
      )}

      {selectedUser && (
        <div className="user-details">
          <h3>User: {selectedUser.name}</h3>
          {selectedUser.trainingPlans.length > 0 ? (
            <div className="current-plans">
              <h4>Current Training Plans</h4>
              <ul>
                {selectedUser.trainingPlans.map(plan => (
                  <li key={plan._id}>
                    <h5>{plan.name}</h5>
                    <ul>
                      {plan.trainings && plan.trainings.map(session => (
                        <li key={session._id}>{session.name}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="add-training-plan">
              <h4>No training plans found. Add a new one:</h4>
              <form onSubmit={handleAddTrainingPlan}>
                <div className="form-group">
                  <label>Select Training Plan:</label>
                  <select onChange={handleTrainingPlanChange} required>
                    <option value="">Select a training plan</option>
                    {trainingPlans.map(plan => (
                      <option key={plan._id} value={plan._id}>{plan.name}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="submit-button">Add Training Plan to User</button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserList;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [trainingPlans, setTrainingPlans] = useState([]);
  const [selectedTrainingPlan, setSelectedTrainingPlan] = useState(null);

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    // Haal alle gebruikers op met hun trainingsplannen
    axios.get(`${apiBaseUrl}/users`)
      .then(response => {
        setUsers(response.data);
        console.log('Fetched users:', response.data);
      })
      .catch(error => console.error('Error fetching users:', error));

    // Haal alle trainingsplannen op
    axios.get(`${apiBaseUrl}/trainingPlans`)
      .then(response => {
        setTrainingPlans(response.data);
        console.log('Fetched training plans:', response.data);
      })
      .catch(error => console.error('Error fetching training plans:', error));
  }, [apiBaseUrl]);

  const handleUserChange = (e) => {
    const userId = e.target.value;
    if (!userId) return;
    const user = users.find(u => u._id === userId);
    setSelectedUser(user);
    console.log('Selected user:', user);
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
        console.log('Training plan added to user:', response.data);
        setSelectedUser(response.data.user); // Update the selected user
      })
      .catch(error => console.error('Error adding training plan to user:', error));
  };

  return (
    <div>
      <h2>Select a User</h2>
      <label>Select User:</label>
      <select onChange={handleUserChange}>
        <option value="">Select a user</option>
        {users.map(user => (
          <option key={user._id} value={user._id}>{user.name}</option>
        ))}
      </select>

      {selectedUser && (
        <div>
          <h3>User: {selectedUser.name}</h3>
          {selectedUser.trainingPlans.length > 0 ? (
            <div>
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
            <div>
              <h4>No training plans found. Add a new one:</h4>
              <form onSubmit={handleAddTrainingPlan}>
                <div>
                  <label>Select Training Plan:</label>
                  <select onChange={handleTrainingPlanChange} required>
                    <option value="">Select a training plan</option>
                    {trainingPlans.map(plan => (
                      <option key={plan._id} value={plan._id}>{plan.name}</option>
                    ))}
                  </select>
                </div>
                <button type="submit">Add Training Plan to User</button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserList;
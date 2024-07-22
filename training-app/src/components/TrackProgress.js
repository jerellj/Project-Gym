import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProgressView = () => {
  const [users, setUsers] = useState([]);
  const [trainingPlans, setTrainingPlans] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTrainingPlan, setSelectedTrainingPlan] = useState(null);
  const [selectedTrainingSession, setSelectedTrainingSession] = useState(null);
  const [progress, setProgress] = useState([]);
  const [newProgress, setNewProgress] = useState({});
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    // Haal alle gebruikers op met hun trainingsplannen
    axios.get(`${apiBaseUrl}/users`)
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, [apiBaseUrl]);

  useEffect(() => {
    if (selectedUser) {
      // Haal de trainingsplannen op voor de geselecteerde gebruiker
      axios.get(`${apiBaseUrl}/trainingPlans/${selectedUser._id}`)
        .then(response => setTrainingPlans(response.data))
        .catch(error => console.error('Error fetching training plans:', error));
    }
  }, [selectedUser, apiBaseUrl]);

  useEffect(() => {
    if (selectedUser) {
      // Haal de voortgang op voor de geselecteerde gebruiker
      axios.get(`${apiBaseUrl}/progress/${selectedUser._id}`)
        .then(response => setProgress(response.data))
        .catch(error => console.error('Error fetching progress:', error));
    }
  }, [selectedUser, apiBaseUrl]);

  const handleProgressChange = (exerciseId, setIndex, field, value) => {
    const updatedProgress = { ...newProgress };
    if (!updatedProgress[exerciseId]) {
      updatedProgress[exerciseId] = [];
    }
    if (!updatedProgress[exerciseId][setIndex]) {
      updatedProgress[exerciseId][setIndex] = { reps: '', weight: '' };
    }
    updatedProgress[exerciseId][setIndex][field] = value;
    setNewProgress(updatedProgress);
  };

  const handleSubmit = () => {
    const exercises = Object.keys(newProgress).map(exerciseId => {
      return newProgress[exerciseId].map(set => ({
        exerciseId,
        sets: set.sets,
        reps: set.reps,
        weight: set.weight
      }));
    }).flat();

    axios.post(`${apiBaseUrl}/progress`, {
      userId: selectedUser._id,
      trainingPlanId: selectedTrainingPlan._id,
      exercises,
      date: new Date()
    })
      .then(response => {
        console.log('Progress added:', response.data);
        setProgress([...progress, response.data.progress]);
      })
      .catch(error => console.error('Error adding progress:', error));
  };

  return (
    <div>
      <h1>Track Progress</h1>
      <div>
        <label>Select User:</label>
        <select onChange={(e) => setSelectedUser(users.find(user => user._id === e.target.value))}>
          <option value="">Select a user</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>{user.name}</option>
          ))}
        </select>
      </div>
      {selectedUser && (
        <div>
          <label>Select Training Plan:</label>
          <select onChange={(e) => setSelectedTrainingPlan(trainingPlans.find(plan => plan._id === e.target.value))}>
            <option value="">Select a training plan</option>
            {trainingPlans.map(plan => (
              <option key={plan._id} value={plan._id}>{plan.name}</option>
            ))}
          </select>
        </div>
      )}
      {selectedTrainingPlan && (
        <div>
          <label>Select Training Session:</label>
          <select onChange={(e) => setSelectedTrainingSession(selectedTrainingPlan.trainings.find(session => session._id === e.target.value))}>
            <option value="">Select a training session</option>
            {selectedTrainingPlan.trainings.map(session => (
              <option key={session._id} value={session._id}>{session.name}</option>
            ))}
          </select>
        </div>
      )}
      {selectedTrainingSession && (
        <div>
          <h2>{selectedTrainingSession.name}</h2>
          <p><strong>Session Number:</strong> {selectedTrainingSession.sessionNumber}</p>
          <ul>
            {selectedTrainingSession.exercises.map((exerciseDetail, index) => (
              <li key={index}>
                <div>
                  <h3>{exerciseDetail.exercise.name}</h3>
                  <p>Sets: {exerciseDetail.sets}</p>
                  {[...Array(exerciseDetail.sets)].map((_, setIndex) => (
                    <div key={setIndex} className="set">
                      <input
                        type="number"
                        placeholder="Weight"
                        value={newProgress[exerciseDetail.exercise._id]?.[setIndex]?.weight || ''}
                        onChange={(e) => handleProgressChange(exerciseDetail.exercise._id, setIndex, 'weight', e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Reps"
                        value={newProgress[exerciseDetail.exercise._id]?.[setIndex]?.reps || ''}
                        onChange={(e) => handleProgressChange(exerciseDetail.exercise._id, setIndex, 'reps', e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          <button onClick={handleSubmit}>Save Progress</button>
          <h2>Previous Progress</h2>
          <ul>
            {progress.map((entry, index) => (
              <li key={index}>
                <p>Date: {new Date(entry.date).toLocaleDateString()}</p>
                {entry.exercises.map((exercise, i) => (
                  <div key={i}>
                    <p>Exercise: {exercise.exerciseId}</p>
                    <p>Weight: {exercise.weight}</p>
                    <p>Reps: {exercise.reps}</p>
                  </div>
                ))}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ProgressView;
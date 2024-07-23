import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProgressView = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTrainingPlan, setSelectedTrainingPlan] = useState(null);
  const [selectedTrainingSession, setSelectedTrainingSession] = useState(null);
  const [progress, setProgress] = useState(null); // Change to hold single progress object
  const [newProgress, setNewProgress] = useState({});
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    // Haal alle gebruikers op met hun trainingsplannen
    axios.get(`${apiBaseUrl}/users`)
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, [apiBaseUrl]);

  useEffect(() => {
    if (selectedUser && selectedTrainingSession) {
      // Haal de voortgang op voor de geselecteerde gebruiker en sessie
      axios.get(`${apiBaseUrl}/progress/session/${selectedUser._id}/${selectedTrainingSession._id}`)
        .then(response => setProgress(response.data)) // Set single progress object
        .catch(error => console.error('Error fetching progress:', error));
    }
  }, [selectedUser, selectedTrainingSession, apiBaseUrl]);

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
    const exercises = Object.keys(newProgress).map(exerciseId => ({
      exercise: exerciseId,
      sets: newProgress[exerciseId].map(set => ({
        reps: set.reps,
        weight: set.weight
      }))
    }));

    console.log('Submitting progress:', exercises);

    axios.post(`${apiBaseUrl}/progress`, {
      user: selectedUser._id,
      trainingSession: selectedTrainingSession._id,
      exerciseProgress: exercises,
      date: new Date()
    })
      .then(response => {
        console.log('Progress added:', response.data);
        setProgress(response.data.progress); // Set the latest progress
      })
      .catch(error => console.error('Error adding progress:', error));
  };

  const handleUserChange = (e) => {
    const userId = e.target.value;
    if (!userId) return;
    const user = users.find(u => u._id === userId);
    setSelectedUser(user);
    if (user.trainingPlans.length > 0) {
      setSelectedTrainingPlan(user.trainingPlans[0]);
    } else {
      setSelectedTrainingPlan(null);
    }
  };

  const handleTrainingPlanChange = (e) => {
    const trainingPlanId = e.target.value;
    const trainingPlan = selectedUser.trainingPlans.find(plan => plan._id === trainingPlanId);
    setSelectedTrainingPlan(trainingPlan);
  };

  const handleTrainingSessionChange = (e) => {
    const sessionId = e.target.value;
    const trainingSession = selectedTrainingPlan.trainings.find(session => session._id === sessionId);
    setSelectedTrainingSession(trainingSession);
  };

  return (
    <div>
      <h1>Track Progress</h1>
      <div>
        <label>Select User:</label>
        <select onChange={handleUserChange}>
          <option value="">Select a user</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>{user.name}</option>
          ))}
        </select>
      </div>
      {selectedUser && (
        <div>
          <label>Select Training Plan:</label>
          <select onChange={handleTrainingPlanChange}>
            <option value="">Select a training plan</option>
            {selectedUser.trainingPlans.map(plan => (
              <option key={plan._id} value={plan._id}>{plan.name}</option>
            ))}
          </select>
        </div>
      )}
      {selectedTrainingPlan && (
        <div>
          <label>Select Training Session:</label>
          <select onChange={handleTrainingSessionChange}>
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
          <h2>Latest Progress</h2>
          {progress && (
            <ul>
              <li>
                <p>Date: {new Date(progress.date).toLocaleDateString()}</p>
                {progress.exerciseProgress && Array.isArray(progress.exerciseProgress) && progress.exerciseProgress.map((exercise, i) => (
                  <div key={i}>
                    <p>Exercise: {exercise.exercise.name}</p>
                    {exercise.sets.map((set, setIndex) => (
                      <div key={setIndex}>
                        <p>Set {setIndex + 1}: {set.reps} reps at {set.weight} kg</p>
                      </div>
                    ))}
                  </div>
                ))}
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default ProgressView;
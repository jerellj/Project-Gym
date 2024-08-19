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
    axios.get(`${apiBaseUrl}/users/with-training-plans`)
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, [apiBaseUrl]);

  useEffect(() => {
    if (selectedUser && selectedTrainingPlan) {
      axios.get(`${apiBaseUrl}/trainingsessions/next/${selectedUser._id}/${selectedTrainingPlan._id}`)
        .then(response => setSelectedTrainingSession(response.data.nextSession))
        .catch(error => console.error('Error fetching next training session:', error));
    }
  }, [selectedUser, selectedTrainingPlan, apiBaseUrl]);

  useEffect(() => {
    if (selectedUser && selectedTrainingSession) {
      axios.get(`${apiBaseUrl}/progress/session/${selectedUser._id}/${selectedTrainingSession._id}`)
        .then(response => setProgress(response.data))
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

    axios.post(`${apiBaseUrl}/progress`, {
      user: selectedUser._id,
      trainingSession: selectedTrainingSession._id,
      exerciseProgress: exercises,
      date: new Date()
    })
      .then(response => {
        setProgress(response.data.progress);
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

  const handleTrainingSessionChange = (e) => {
    const sessionId = e.target.value;
    axios.get(`${apiBaseUrl}/trainingsessions/${sessionId}`)
      .then(response => setSelectedTrainingSession(response.data))
      .catch(error => console.error('Error fetching training session:', error));
  };

  return (
    <div className="w3-container w3-padding-32">
      <h1 className="w3-center w3-text-teal">Track Progress</h1>
      <div className="w3-margin-bottom">
        <label className="w3-text-teal"><strong>Select User:</strong></label>
        <select className="w3-select" onChange={handleUserChange}>
          <option value="">Select a user</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>{user.name}</option>
          ))}
        </select>
      </div>
      {selectedTrainingPlan && (
        <div className="w3-margin-bottom">
          <label className="w3-text-teal"><strong>Select Training Session:</strong></label>
          <select className="w3-select" onChange={handleTrainingSessionChange} value={selectedTrainingSession ? selectedTrainingSession._id : ''}>
            <option value="">Select a training session</option>
            {selectedTrainingPlan.trainings.map(session => (
              <option key={session._id} value={session._id}>{session.name}</option>
            ))}
          </select>
        </div>
      )}
      {selectedTrainingSession && selectedTrainingSession.exercises && (
        <div className="w3-card-4 w3-padding w3-margin-top">
          <h2 className="w3-center w3-text-teal"><strong>Session name:</strong> {selectedTrainingSession.name}</h2>
          <ul className="w3-ul">
            {selectedTrainingSession.exercises.map((exerciseDetail, index) => (
              <li key={index} className="w3-padding-16">
                <div>
                  <h3 className="w3-text-teal">{exerciseDetail.exercise.name}</h3>
                  <p>Sets: {exerciseDetail.sets}</p>
                  {[...Array(exerciseDetail.sets)].map((_, setIndex) => (
                    <div key={setIndex} className="w3-margin-bottom">
                      <input
                        className="w3-input w3-border w3-margin-bottom"
                        type="number"
                        placeholder="Weight"
                        value={newProgress[exerciseDetail.exercise._id]?.[setIndex]?.weight || ''}
                        onChange={(e) => handleProgressChange(exerciseDetail.exercise._id, setIndex, 'weight', e.target.value)}
                      />
                      <input
                        className="w3-input w3-border"
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
          <button className="w3-button w3-teal w3-margin-top" onClick={handleSubmit}>Save Progress</button>
          <h2 className="w3-text-teal w3-margin-top">Latest Progress</h2>
          {progress ? (
            <ul className="w3-ul w3-border">
              <li className="w3-padding-16">
                <p>Date: {new Date(progress.date).toLocaleDateString()}</p>
                {progress.exerciseProgress && Array.isArray(progress.exerciseProgress) && progress.exerciseProgress.map((exercise, i) => (
                  <div key={i} className="w3-margin-bottom">
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
          ) : (
            <p className="w3-text-teal">Nog geen eerdere progressie</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ProgressView;
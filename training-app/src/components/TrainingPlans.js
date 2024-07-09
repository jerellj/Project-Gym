import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TrainingPlans = () => {
  const [trainingPlans, setTrainingPlans] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/api/trainingPlans')
      .then(response => setTrainingPlans(response.data))
      .catch(error => console.error('Error fetching training plans:', error));
  }, []);

  return (
    <div>
      <h1>Training Plans</h1>
      <ul>
        {trainingPlans.map(plan => (
          <li key={plan._id}>{plan.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default TrainingPlans;
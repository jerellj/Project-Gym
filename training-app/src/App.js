import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import TrainingPlans from './components/TrainingPlans';
import AddTrainingPlan from './components/AddTrainingPlan';
import AddTrainingSession from './components/AddTrainingSession';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Training Plans</Link></li>
            <li><Link to="/add-training-plan">Add Training Plan</Link></li>
            <li><Link to="/add-training-session">Add Training Session</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<TrainingPlans />} />
          <Route path="/add-training-plan" element={<AddTrainingPlan />} />
          <Route path="/add-training-session" element={<AddTrainingSession />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
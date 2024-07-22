import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import TrainingPlans from './components/TrainingPlans';
import AddTrainingPlan from './components/AddTrainingPlan';
import AddTrainingSession from './components/AddTrainingSession';
import SearchExercises from './components/SearchExercises';
import TrackProgress from './components/TrackProgress';
import ListTrainingSession from './components/ShowTrainingSessions';
import TrainingSessionDetails from './components/TrainingSessionDetails';
import UserList from './components/UserList';


function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Users</Link></li>
            <li><Link to="/Search-Exercises">Search Exercises</Link></li>
            <li><Link to="/training-Plans">Training Plans</Link></li>
            <li><Link to="/add-training-plan">Add Training Plan</Link></li>
            <li><Link to="/add-training-session">Add Training Session</Link></li>
            <li><Link to="/track-progress">Track Progress</Link></li>
            <li><Link to="/list-trainingsessions">List Sessions</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<UserList />} />
          <Route path="/Search-Exercises" element={<SearchExercises />} />
          <Route path="/training-plans" element={<TrainingPlans />} />
          <Route path="/add-training-plan" element={<AddTrainingPlan />} />
          <Route path="/add-training-session" element={<AddTrainingSession />} />
          <Route path="/track-progress" element={<TrackProgress />} />
          <Route path="/list-trainingsessions" element={<ListTrainingSession />} />
          <Route path="/trainingSessions/:id" element={<TrainingSessionDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
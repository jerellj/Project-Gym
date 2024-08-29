import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import TrainingPlans from './components/TrainingPlans';
import AddTrainingPlan from './components/AddTrainingPlan';
import AddTrainingSession from './components/AddTrainingSession';
import SearchExercises from './components/SearchExercises';
import TrackProgress from './components/TrackProgress';
import ListTrainingSession from './components/ShowTrainingSessions';
import TrainingSessionDetails from './components/TrainingSessionDetails';
import UsersList from './components/UsersList';
import './CSS/NavBar.css'; // Voeg de CSS voor de navigatiebalk toe

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">MyLogo</div>
      <div className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
        <Link to="/" onClick={closeMenu}>Search Exercises</Link>
        <Link to="/training-plans" onClick={closeMenu}>Training Plans</Link>
        <Link to="/add-training-plan" onClick={closeMenu}>Add Training Plan</Link>
        <Link to="/add-training-session" onClick={closeMenu}>Add Training Session</Link>
        <Link to="/track-progress" onClick={closeMenu}>Track Progress</Link>
        <Link to="/list-trainingsessions" onClick={closeMenu}>List Sessions</Link>
        <Link to="/user" onClick={closeMenu}>Users</Link>
      </div>
      <div className="navbar-toggle" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={<SearchExercises />} />
          <Route path="/training-plans" element={<TrainingPlans />} />
          <Route path="/add-training-plan" element={<AddTrainingPlan />} />
          <Route path="/add-training-session" element={<AddTrainingSession />} />
          <Route path="/track-progress" element={<TrackProgress />} />
          <Route path="/list-trainingsessions" element={<ListTrainingSession />} />
          <Route path="/trainingSessions/:id" element={<TrainingSessionDetails />} />
          <Route path="/user" element={<UsersList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
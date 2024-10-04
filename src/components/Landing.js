import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <nav>
        <h2>Todo App</h2>
        <button onClick={() => navigate('/login')}>Sign In</button>
      </nav>
      <header>
        <h1>Welcome to Todo App</h1>
        <p>A simple and effective way to manage your tasks and projects.</p>
        <button onClick={() => navigate('/login')}>Get Started</button>
      </header>
    </div>
  );
};

export default LandingPage;

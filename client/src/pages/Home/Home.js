// src/pages/Home/Home.js
// src/pages/Home/Home.js

import React from 'react';
import './Home.css';
import homeImage from '../images/mom-and-son.png'; // Adjust the path as needed

const Home = () => {
  return (
    <div className="home" style={{ backgroundImage: `url(${homeImage})`, backgroundSize: 'cover' }}>
      <div className="home-text">
        <h1>Welcome to Quantum Vacations</h1>
        <p>A centralized solution for managing vacation requests.</p>
      </div>
    </div>
  );
}

export default Home;

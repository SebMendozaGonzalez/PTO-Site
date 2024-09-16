// src/components/Header/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <img 
        src="https://static.wixstatic.com/media/04c255_d994cd56e81741f2a4d7cc377a3713b1~mv2.png/v1/crop/x_55,y_64,w_1945,h_402/fill/w_264,h_55,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Quantum%20Outsourcing%20Group%20Logo.png" 
        alt="Company Logo" className="company-logo" />
      </div>
      <nav className="nav-options">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/employee-portal" className="nav-link">Employee Portal</Link>
        <Link to="/leader-portal" className="nav-link">Leader Portal</Link>
        <button className="btn-login">Login</button>
      </nav>
    </header>
  );
}

export default Header;

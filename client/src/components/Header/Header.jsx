// src/components/Header/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../../images/quantum-long-logo.png'

const Header = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <img src={logo} alt="Company Logo" className="company-logo" />
      </div>
      <nav className="nav-options">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/employee-portal" className="nav-link">Employee Portal</Link>
        <Link to="/leader-portal" className="nav-link">Leader Portal</Link>
        <button className="btn-login dark-button button">Login</button>
      </nav>
    </header>
  );
}

export default Header;

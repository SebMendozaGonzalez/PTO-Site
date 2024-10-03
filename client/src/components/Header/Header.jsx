import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../../images/quantum-long-logo.png';

const Header = () => {
  
  const handleLogin = () => {
    window.location.href = '/.auth/login/aad';  // Redirect to Microsoft Entra login
  };

  return (
    <header className="header">
      <div className="logo-container">
        <img src={logo} alt="Company Logo" className="company-logo" />
      </div>
      <nav className="nav-options">
        <Link to="/" className="nav-link">
          <span>Home</span>
        </Link>
        <Link to="/employee-portal" className="nav-link">
          <span>Employee Portal</span>
        </Link>
        <Link to="/leader-portal" className="nav-link">
          <span>Leader Portal</span>
        </Link>

        <div className='btn-login'>
          <button className="button" onClick={handleLogin}>Login</button>
        </div>
      </nav>
    </header>
  );
};

export default Header;

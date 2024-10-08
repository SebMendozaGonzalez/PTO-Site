// src/components/Header/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import './Header.css';
import logo from '../../images/quantum-long-logo.png';

const Header = () => {
  const { instance, accounts } = useMsal(); // Use useMsal to access instance and accounts

  // Debugging: Check the accounts state
  console.log('Accounts:', accounts);

  const handleLogin = () => {
    instance.loginRedirect({ scopes: ["openid", "profile"] }); // Pass scopes in the login method
  };
  
  const handleLogout = () => {
    instance.logoutRedirect(); // Use MSAL's logout method
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

        {accounts.length > 0 ? (
          <button className="button btn" onClick={handleLogout}>Logout</button> // Show Logout if logged in
        ) : (
          <button className="button btn" onClick={handleLogin}>Login</button> // Show Login if not logged in
        )}
      </nav>
    </header>
  );
};

export default Header;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import './Header.css';
import logo from '../../images/quantum-long-logo.png';

const Header = () => {
  const { instance, accounts } = useMsal();
  const [userName, setUserName] = useState('');

  // This useEffect will run when the component mounts, checking if user is logged in
  useEffect(() => {
    if (accounts && accounts.length > 0) {
      setUserName(accounts[0].name);  // Set the user's name
    }
  }, [accounts]);

  const handleLogin = () => {
    instance.loginRedirect();
  };

  const handleLogout = () => {
    instance.logoutRedirect();
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
          <>
            <span>Welcome, {userName}</span>
            <button className="button btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <button className="button btn" onClick={handleLogin}>Login</button>
        )}
      </nav>
    </header>
  );
};

export default Header;

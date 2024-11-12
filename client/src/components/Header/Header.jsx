import React from 'react';
import { NavLink } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import './Header.css';
import logo from '../../images/quantum-long-logo.png';
import { loginRequest } from '../../auth/authConfig';

const Header = () => {
  const { instance, accounts } = useMsal();

  // Login function
  const handleLogin = () => {
    instance.loginRedirect(loginRequest)
      .then(response => {
        console.log('Login response:', response);
      })
      .catch(error => {
        console.log('Login error:', error);
      });
  };

  // Logout function
  const handleLogout = () => {
    instance.logoutRedirect();
  };

  console.log('Completo: ', accounts[0]);
  console.log('Roles: ', accounts[0]?.idTokenClaims?.roles);
  console.log('lo contiene?', accounts[0]?.idTokenClaims?.roles?.includes('Leader'))

  return (
    <header className="header">
      <div className="logo-container">
        <img src={logo} alt="Company Logo" className="company-logo" />
      </div>
      <nav className="nav-options">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? 'nav-link active-link' : 'nav-link')}
          end
        >
          <span>Home</span>
        </NavLink>

        {accounts.length > 0 ? (
          <NavLink
            to="/employee-portal"
            className={({ isActive }) => (isActive ? 'nav-link active-link' : 'nav-link')}
          >
            <span>Employee Portal</span>
          </NavLink>
        ) : (<div></div>)}

        
        {accounts.length > 0 &&  accounts[0]?.roles?.includes('Leader') ? (
          <NavLink
            to="/leader-portal"
            className={({ isActive }) => (isActive ? 'nav-link active-link' : 'nav-link')}
          >
            <span>Manager Portal</span>
          </NavLink>

        ) : (<div></div>)}

        {accounts.length > 0 ? (
          <NavLink
            to="/hr-portal"
            className={({ isActive }) => (isActive ? 'nav-link active-link' : 'nav-link')}
          >
            <span>HR Portal</span>
          </NavLink>
        ) : (<div></div>)}


        {accounts.length > 0 ? (
          <div>

            <button className="button btn" onClick={handleLogout}>Logout</button>
          </div>

        ) : (
          <button className="button btn" onClick={handleLogin}>Login</button>
        )}
      </nav>
    </header>
  );
};

export default Header;

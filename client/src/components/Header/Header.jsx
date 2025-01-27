import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { EventType } from "@azure/msal-browser";
import "./Header.css";
import logo from "../../images/quantum-long-logo.png";
import { loginRequest } from "../../auth/authConfig";

const Header = () => {
  const { instance, accounts } = useMsal();
  const [isAuthenticated, setIsAuthenticated] = useState(accounts.length > 0);

  // Event listener for MSAL events
  useEffect(() => {
    const callbackId = instance.addEventCallback((event) => {
      if (event.eventType === EventType.LOGIN_SUCCESS) {
        console.log("Login successful:", event);
        setIsAuthenticated(instance.getAllAccounts().length > 0);
      } else if (event.eventType === EventType.LOGOUT_SUCCESS) {
        console.log("Logout successful");
        setIsAuthenticated(false);
      }
    });


    return () => {
      if (callbackId) {
        instance.removeEventCallback(callbackId);
      }
    };
  }, [instance]);

  // Login function
  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch((error) => {
      console.error("Login error:", error);
    });
  };

  // Logout function
  const handleLogout = () => {
    instance.logoutRedirect().catch((error) => {
      console.error("Logout error:", error);
    });
  };

  return (
    <header className="header">
      <div className="logo-container">
        <img src={logo} alt="Company Logo" className="company-logo" />
      </div>
      <nav className="nav-options">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}
          end
        >
          <span>Home</span>
        </NavLink>

        {isAuthenticated ? (
          <>
            <NavLink
              to="/employee-portal"
              className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}
            >
              <span>Employee Portal</span>
            </NavLink>

            {accounts[0]?.idTokenClaims?.roles?.includes("Leader") && (
              <NavLink
                to="/leader-portal"
                className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}
              >
                <span>Manager Portal</span>
              </NavLink>
            )}

            {accounts[0]?.idTokenClaims?.roles?.includes("HR_Manager") && (
              <NavLink
                to="/hr-portal"
                className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}
              >
                <span>HR Portal</span>
              </NavLink>
            )}

            <button className="button btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button className="button btn" onClick={handleLogin}>
            Login
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;

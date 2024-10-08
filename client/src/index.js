// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { MsalProvider } from '@azure/msal-react';
import msalInstance from './auth/authConfig'; // Import the msal instance
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';

const initializeApp = async () => {
  try {
    await msalInstance.initialize(); // Explicitly initialize MSAL before rendering the app

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <MsalProvider instance={msalInstance}>
          <Router>
            <App />
          </Router>
        </MsalProvider>
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Error initializing MSAL:", error);
  }
};

initializeApp();
reportWebVitals();

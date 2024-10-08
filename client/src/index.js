// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from './auth/authConfig'; // Ensure msalInstance is imported correctly
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';

// No need for initializeApp, just render directly
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

reportWebVitals();

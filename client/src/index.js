// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { MsalProvider } from '@azure/msal-react'; // Import MsalProvider
import msalInstance from './auth/authConfig'; // Import the msal instance
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}> {/* Wrap your App with MsalProvider */}
      <Router>
        <App />
      </Router>
    </MsalProvider>
  </React.StrictMode>
);

reportWebVitals();

// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { MsalProvider } from '@azure/msal-react'; // Import MsalProvider
import { PublicClientApplication } from '@azure/msal-browser'; // Import PublicClientApplication
import App from './App';
import './index.css';
import authConfig from './auth/authConfig'; // Adjust the path as necessary
import reportWebVitals from './reportWebVitals'; // Keep this import

const msalInstance = new PublicClientApplication(authConfig); // Create an instance of PublicClientApplication

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

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { MsalProvider, useMsal } from '@azure/msal-react'; // Import MsalProvider and useMsal
import msalInstance from './auth/authConfig'; // Import the msal instance
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';

// Create a component to handle the redirect promise
const AuthRedirectHandler = () => {
    const { instance } = useMsal(); // Get the MSAL instance

    useEffect(() => {
        instance.handleRedirectPromise()
            .then((authResult) => {
                if (authResult) {
                    console.log('Login successful:', authResult);
                } else {
                    console.log('No authentication result received.');
                }
            })
            .catch(error => {
                console.error('Error during redirect handling:', error);
            });
    }, [instance]);

    return null; // No UI to render
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <MsalProvider instance={msalInstance}> {/* Wrap your App with MsalProvider */}
            <Router>
                <AuthRedirectHandler /> {/* Add the AuthRedirectHandler */}
                <App />
            </Router>
        </MsalProvider>
    </React.StrictMode>
);

reportWebVitals();


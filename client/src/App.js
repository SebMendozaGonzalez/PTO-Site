// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import authConfig from './src/auth/authConfig'; // Adjust the path if necessary
import Home from './pages/Home/Home';
import EmployeePortal from './pages/EmployeePortal/EmployeePortal';
import LeaderPortal from './pages/LeaderPortal/LeaderPortal';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import RequestPortal from './pages/RequestPortal/RequestPortal';

import './App.css';

// Create an instance of PublicClientApplication
const msalInstance = new PublicClientApplication(authConfig);

const App = () => {
  return (
    <MsalProvider instance={msalInstance}>
      <div className="App">
        <Header />
        <main className='inside'> {/* Adjust padding to account for fixed header */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/employee-portal" element={<EmployeePortal />} />
            <Route path="/leader-portal" element={<LeaderPortal />} />
            <Route path="/request-portal" element={<RequestPortal />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </MsalProvider>
  );
}

export default App;

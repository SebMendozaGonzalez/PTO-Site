// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import EmployeePortal from './pages/EmployeePortal/EmployeePortal';
import LeaderPortal from './pages/LeaderPortal/LeaderPortal';
import HRPortal from './pages/HRPortal/HRPortal';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import RequestPortal from './pages/RequestPortal/RequestPortal';
import LiquidationRequestPortal from './pages/LiquidationRequestPortal/LiquidationRequestPortal';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <Header />
      <main className='inside'> {/* Adjust padding to account for fixed header */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/request-portal" element={<RequestPortal />} />
          <Route path="/liquidation-request-portal" element={<LiquidationRequestPortal />} />


          <Route path="/employee-portal"
            element={
              <ProtectedRoute requiredRole='Employee'>
                <EmployeePortal />
              </ProtectedRoute>
            }
          />
          <Route path="/hr-portal"
            element={<ProtectedRoute requiredRole="HR_Manager">
              <HRPortal />
            </ProtectedRoute>}
          />
          <Route
            path="/leader-portal"
            element={
              <ProtectedRoute requiredRole="Leader">
                <LeaderPortal />
              </ProtectedRoute>
            }
          />

        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

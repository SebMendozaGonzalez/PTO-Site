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
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

import './App.css';

const App = () => {
  return (
    <div className="App">
      <Header />
      <main className='inside'> {/* Adjust padding to account for fixed header */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/employee-portal" element={<EmployeePortal />} />
          <Route path="/request-portal" element={<RequestPortal />} />
          <Route
            path="/leader-portal"
            element={
              <ProtectedRoute requiredRole="Leader">
                <LeaderPortal />
              </ProtectedRoute>
            }
          />
          <Route path="/hr-portal" component={<HRPortal/>}></Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

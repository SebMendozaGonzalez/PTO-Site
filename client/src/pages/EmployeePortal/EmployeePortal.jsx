// src/pages/EmployeePortal/EmployeePortal.js
import React from 'react';
import './EmployeePortal.css';
import WelcomeEmployees from '../../components/WelcomeEmployees/WelcomeEmployees';
import DashboardEmployee from '../../components/DashboardEmployee/DashboardEmployee';

const EmployeePortal = () => {
  return (
    
    <div className="employee-portal">
      <WelcomeEmployees />
      <DashboardEmployee />
    </div>
  );
}

export default EmployeePortal;

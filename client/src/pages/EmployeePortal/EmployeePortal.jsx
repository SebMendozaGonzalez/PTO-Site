// src/pages/EmployeePortal/EmployeePortal.js
import React from 'react';
import './EmployeePortal.css';
import WelcomeEmployees from '../../components/WelcomeEmployees/WelcomeEmployees';
import DashboardEmployee from '../../components/DashboardEmployee/DashboardEmployee';
import RequestsEmployee from '../../components/RequestsEmployee/RequestsEmployee';

const EmployeePortal = () => {
  return (
    
    <div className="employee-portal">
      <WelcomeEmployees />
      <DashboardEmployee />
      <RequestsEmployee />
    </div>
  );
}

export default EmployeePortal;

// src/pages/EmployeePortal/EmployeePortal.js
import React, { useState } from 'react';
import './EmployeePortal.css';
import WelcomeEmployees from '../../components/WelcomeEmployees/WelcomeEmployees';
import DashboardEmployee from '../../components/DashboardEmployee/DashboardEmployee';
import RequestsEmployee from '../../components/RequestsEmployee/RequestsEmployee';
import RequestsList from '../../components/RequestsList/RequestsList';

function EmployeePortal() {
  const [filterEmployeeId, setFilterEmployeeId] = useState('');

  return (
    <div className="employee-portal">
      <div className='paddings'>
        <label htmlFor="EmployeeId" className='filter-label fonts-primary'>Employee Id: </label>
        <input
          id="EmployeeId"
          type="text"
          value={filterEmployeeId}
          onChange={(e) => setFilterEmployeeId(e.target.value)}
          placeholder="Enter Employee Id"
          className='filter-input'
        />
      </div>

      <WelcomeEmployees />
      <DashboardEmployee employee_id={filterEmployeeId} />
      <RequestsList employee_id={filterEmployeeId} />
      <RequestsEmployee employee_id={filterEmployeeId} />
    </div>
  );
}

export default EmployeePortal;

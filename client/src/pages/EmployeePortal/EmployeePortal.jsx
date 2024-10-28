import React, { useState } from 'react';
import './EmployeePortal.css';
import WelcomeEmployees from '../../components/WelcomeEmployees/WelcomeEmployees';
import DashboardEmployee from '../../components/DashboardEmployee/DashboardEmployee';
import RequestsEmployee from '../../components/RequestsEmployee/RequestsEmployee';
import RequestsList from '../../components/RequestsList/RequestsList';
import RequestView from '../../components/RequestView/RequestView';

function EmployeePortal() {
  const [filterEmployeeId, setFilterEmployeeId] = useState('');
  const [requestDetails, setRequestDetails] = useState(null);

  const closePopup = () => {
    setRequestDetails(null); // Close the popup
  };


  const handleClickRequest = (request) => {
    setRequestDetails(request); // Set the selected request details to display in the popup
  };

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
      <RequestsList employee_id={filterEmployeeId} onClickRequest={handleClickRequest} /> {/* Pass the click handler */}
      <RequestsEmployee employee_id={filterEmployeeId} />
      <RequestView requestDetails={requestDetails}
        onClose={closePopup}
        managerPermissions={false}
        employeePermissions={true} />
    </div>
  );
}

export default EmployeePortal;

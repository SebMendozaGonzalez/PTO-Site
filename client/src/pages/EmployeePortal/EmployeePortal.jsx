import React, { useState } from 'react';
import './EmployeePortal.css';
import WelcomeEmployees from '../../components/WelcomeEmployees/WelcomeEmployees';
import DashboardEmployee from '../../components/DashboardEmployee/DashboardEmployee';
import RequestsEmployee from '../../components/RequestsEmployee/RequestsEmployee';
import RequestsList from '../../components/RequestsList/RequestsList';

function EmployeePortal() {
  const [filterEmployeeId, setFilterEmployeeId] = useState('');

  // Define the function to handle the decision made in RequestView
  const handleSubmitDecision = async (request_id, accepted, rejection_reason) => {
    try {
      console.log('Trying to update: ', {
        accepted,
        request_id,
        rejection_reason
      });
      const response = await fetch('/decide-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ request_id, accepted, rejection_reason }),
      });
  
      if (!response.ok) {
        // Log the response body for more insight
        const errorDetails = await response.json();
        console.error('Response error details:', errorDetails);
        throw new Error('Failed to update the request.'); // You can include the error message in this throw if needed
      }
  
      const updatedRequest = await response.json();
      console.log('Updated request:', updatedRequest);
      closePopup(); // Close the popup after successful update
  
    } catch (error) {
      console.error('Error submitting decision:', error);
    }
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
      <RequestsList employee_id={filterEmployeeId} onSubmitDecision={handleSubmitDecision} />
      <RequestsEmployee employee_id={filterEmployeeId} />
    </div>
  );
}

export default EmployeePortal;


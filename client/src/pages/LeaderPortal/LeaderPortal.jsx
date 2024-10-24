import React, { useState } from 'react';
import LPTable from '../../components/LPTable/LPTable';
import WelcomeLeaders from '../../components/WelcomeLeaders/WelcomeLeaders';
import DashboardEmployee from '../../components/DashboardEmployee/DashboardEmployee';
import RequestsCalendar from '../../components/RequestsCalendar/RequestsCalendar';
import RequestView from '../../components/RequestView/RequestView';
import './LeaderPortal.css';

function LeaderPortal() {
  const [filterLeaderName, setFilterLeaderName] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [requestDetails, setRequestDetails] = useState(null); // State for the selected request

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployeeId(employee.employee_id);
  };

  const handleEventSelect = (details) => {
    setRequestDetails(details); // Set the selected request details
  };

  const closePopup = () => {
    setRequestDetails(null); // Close the popup
  };

  // Function to handle the decision made in RequestView
  const handleSubmitDecision = async (request_id, accepted, rejection_reason) => {
    try {
      console.log('Trying to update: ', {
        accepted,
        request_id,
        rejection_reason
      });
      const response = await fetch('https://quantumhr.azurewebsites.net/decide-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ request_id, accepted, rejection_reason }),
      });

      if (!response.ok) {
        throw new Error('Failed to update the request.');
      }

      const updatedRequest = await response.json();
      // You might want to update the state or notify the user about the successful operation
      console.log('Updated request:', updatedRequest);
      closePopup(); // Close the popup after successful update

    } catch (error) {
      console.error('Error submitting decision:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div className='flexColCenter leader-portal'>
      <div className='paddings'>
        <label htmlFor="leaderName" className='filter-label fonts-primary'>Manager Name: </label>
        <input
          id="leaderName"
          type="text"
          value={filterLeaderName}
          onChange={(e) => setFilterLeaderName(e.target.value)}
          placeholder="Enter Leader Name"
          className='filter-input'
        />
      </div>

      <div className='paddings'>
        <WelcomeLeaders />
        <LPTable filterLeaderName={filterLeaderName} onEmployeeSelect={handleEmployeeSelect} />

        <div style={{
          transform: 'scale(0.91)',
          transformOrigin: 'top left',
          marginLeft: "2rem",
          width: "100%"
        }}>
          {selectedEmployeeId && <DashboardEmployee employee_id={selectedEmployeeId} />}
        </div>

        {selectedEmployeeId && (
          <RequestsCalendar employee_id={selectedEmployeeId} onEventSelect={handleEventSelect} />
        )}

        <RequestView requestDetails={requestDetails} onClose={closePopup} onSubmitDecision={handleSubmitDecision} />
      </div>
    </div>
  );
}

export default LeaderPortal;

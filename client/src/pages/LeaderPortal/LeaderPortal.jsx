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

        <RequestView requestDetails={requestDetails} onClose={closePopup} />
      </div>
    </div>
  );
}

export default LeaderPortal;

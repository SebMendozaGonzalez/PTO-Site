// src/pages/HRPortal/HRPortal.jsx
import React, { useState } from 'react';
import LPTable from '../../components/LPTable/LPTable';
import WelcomeHRManagers from '../../components/WelcomeHRManagers/WelcomeHRManagers';
import DashboardEmployee from '../../components/DashboardEmployee/DashboardEmployee';
import RequestsCalendar from '../../components/RequestsCalendar/RequestsCalendar';
import RequestView from '../../components/RequestView/RequestView';
import RosterManager from '../../components/RosterManager/RosterManager';
import './HRPortal.css';


function HRPortal() {
  const [filterLeaderEmail, setFilterLeaderEmail] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [requestDetails, setRequestDetails] = useState(null);
  const [manageRequests, setManageRequests] = useState(false);
  const [manageRoster, setManageRoster] = useState(false);

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployeeId(employee.employee_id);
  };

  const handleEventSelect = (details) => {
    setRequestDetails(details);
  };

  const closePopup = () => {
    setRequestDetails(null);
  };

  const handleManageRequestsClick = () => {
    setManageRequests(true);
    setManageRoster(false)
  };

  const handleManageCollaboratorsClick = () => {
    setManageRoster(true)
    setManageRequests(false)
  }

  const requestsComponent = manageRequests && (
    <div className='manage-requests'>
      <div className='paddings innerWidth'>
        <LPTable filterLeaderEmail={filterLeaderEmail} onEmployeeSelect={handleEmployeeSelect} />

        <div
          style={{
            transform: 'scale(0.91)',
            transformOrigin: 'top left',
            marginLeft: '2rem',
            width: '100%',
          }}
        >
          {selectedEmployeeId && <DashboardEmployee employee_id={selectedEmployeeId} />}
        </div>

        {selectedEmployeeId && (
          <RequestsCalendar employee_id={selectedEmployeeId} onEventSelect={handleEventSelect} />
        )}

        <RequestView
          requestDetails={requestDetails}
          onClose={closePopup}
          managerPermissions={true}
          employeePermissions={false}
        />
      </div>
    </div>
  );

  const rosterComponent = manageRoster && (
    <RosterManager />
  );

  return (
    <div className='flexColCenter leader-portal'>
      <div className='paddings'>
        <label htmlFor="leaderEmail" className='filter-label fonts-primary'>Manager Email: </label>
        <input
          id="leaderEmail"
          type="text"
          value={filterLeaderEmail}
          onChange={(e) => setFilterLeaderEmail(e.target.value)}
          placeholder="Enter Leader Email"
          className='filter-input'
        />
      </div>

      {/* Pass handleManageRequestsClick to WelcomeHRManagers as a prop */}
      <WelcomeHRManagers onManageRequestsClick={handleManageRequestsClick} onManageCollaboratorsClick={handleManageCollaboratorsClick} />

      {requestsComponent}
      {rosterComponent}
    </div>
  );
}

export default HRPortal;

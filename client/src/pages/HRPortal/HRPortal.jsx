// src/pages/HRPortal/HRPortal.jsx
import React, { useState } from 'react';
import WelcomeHRManagers from '../../components/WelcomeHRManagers/WelcomeHRManagers';
import DashboardEmployee from '../../components/DashboardEmployee/DashboardEmployee';
import RequestsCalendar from '../../components/RequestsCalendar/RequestsCalendar';
import RequestView from '../../components/RequestView/RequestView';
import RosterManager from '../../components/RosterManager/RosterManager';
import './HRPortal.css';


function HRPortal() {
  const [filterLeaderEmail] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [requestDetails, setRequestDetails] = useState(null);


  const handleEmployeeSelect = (employee) => {
    setSelectedEmployeeId(employee.employee_id);
  };

  const handleEventSelect = (details) => {
    setRequestDetails(details);
  };

  const closePopup = () => {
    setRequestDetails(null);
  };


  const HRComponent = (
    <div className="manage-requests">
      <div className="innerWidth">

        <div style={{ paddingBottom: "3rem" }}>
          <RosterManager
            filterLeaderEmail={filterLeaderEmail}
            onEmployeeSelect={handleEmployeeSelect}
            hasPermissions={true}
          />
        </div>
        <div
          style={{
            transform: "scale(0.91)",
            transformOrigin: "top left",
            marginLeft: "2rem",
            width: "100%",
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

  return (
    <div className='flexColCenter leader-portal'>
      <WelcomeHRManagers />
      {HRComponent}
    </div>
  );
}

export default HRPortal;

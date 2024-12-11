// src/pages/HRPortal/HRPortal.jsx
import React, { useState } from 'react';
import WelcomeHRManagers from '../../components/WelcomeHRManagers/WelcomeHRManagers';
import DashboardEmployee from '../../components/DashboardEmployee/DashboardEmployee';
import RequestsCalendar from '../../components/RequestsCalendar/RequestsCalendar';
import RequestView from '../../components/RequestView/RequestView';
import RosterManager from '../../components/RosterManager/RosterManager';
import LiquidationRequestsList from '../../components/LiquidationRequestsList/LiquidationRequestsList';
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
      <div>

        <div style={{ paddingBottom: "3rem" }}>
          <RosterManager
            filterLeaderEmail={filterLeaderEmail}
            onEmployeeSelect={handleEmployeeSelect}
            hasPermissions={true}
          />
        </div>

        {selectedEmployeeId && <DashboardEmployee employee_id={selectedEmployeeId} />}
        <LiquidationRequestsList
          employee_id={selectedEmployeeId}
          fromEP={false} HRportal={true}
        /*onClickRequest={handleClickRequest} */
        />

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
    <div className='flexColCenter hr-portal'>
      <WelcomeHRManagers />
      {HRComponent}
    </div>
  );
}

export default HRPortal;

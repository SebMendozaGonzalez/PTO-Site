import React, { useState } from 'react';
import WelcomeHRManagers from '../../components/WelcomeHRManagers/WelcomeHRManagers';
import DashboardEmployee from '../../components/DashboardEmployee/DashboardEmployee';
import RequestsCalendar from '../../components/RequestsCalendar/RequestsCalendar';
import RequestView from '../../components/RequestView/RequestView';
import LiquidationRequestView from '../../components/LiquidationRequestView/LiquidationRequestView';
import RosterManager from '../../components/RosterManager/RosterManager';
import LiquidationRequestsList from '../../components/LiquidationRequestsListMP/LiquidationRequestsListMP';
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

  // New handler for Liquidation Request click
  const handleClickLiqRequest = (liqRequest) => {
    setRequestDetails(liqRequest); // Set liquidation request details
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
        
        {/* Render LiquidationRequestsList and pass the handler */}
        <LiquidationRequestsList
          employee_id={selectedEmployeeId}
          HRportal={true}
          onClickRequest={handleClickLiqRequest} // Handle liquidation request click
        />

        {selectedEmployeeId && (
          <RequestsCalendar employee_id={selectedEmployeeId} onEventSelect={handleEventSelect} />
        )}

        {/* Conditional rendering for regular request or liquidation request */}
        {requestDetails && requestDetails.type ? (
          <RequestView
            requestDetails={requestDetails}
            onClose={closePopup}
            managerPermissions={true}
            employeePermissions={false}
          />
        ) : (
          requestDetails && (
            <LiquidationRequestView
              requestDetails={requestDetails}
              onClose={closePopup}
              managerPermissions={true}
              employeePermissions={false}
            />
          )
        )}
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

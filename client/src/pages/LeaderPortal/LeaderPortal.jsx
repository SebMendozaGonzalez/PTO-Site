import React, { useState } from 'react';
import EmployeeList from '../../components/EmployeeList/EmployeeList';
import WelcomeLeaders from '../../components/WelcomeLeaders/WelcomeLeaders';
import DashboardEmployee from '../../components/DashboardEmployee/DashboardEmployee';
import RequestsCalendar from '../../components/RequestsCalendar/RequestsCalendar';
import RequestView from '../../components/RequestView/RequestView';
import EmployeeLicenseCard from '../../components/EmployeeLicenseCard/EmployeeLicenseCard';
import { useMsal } from '@azure/msal-react';
import './LeaderPortal.css';

function LeaderPortal() {
  const { accounts } = useMsal();
  const [filterLeaderEmail, setFilterLeaderEmail] = useState(() => accounts[0]?.username || '');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [requestDetails, setRequestDetails] = useState(null);
  const [isLicenseMode, setIsLicenseMode] = useState(false);

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleEventSelect = (details) => {
    setRequestDetails(details);
  };

  const closePopup = () => {
    setRequestDetails(null);
  };

  const handleLicenseClick = (employee) => {
    setSelectedEmployee(employee);
    setIsLicenseMode(true);
  };

  const handleClose = () => {
    setSelectedEmployee(null);
    setIsLicenseMode(false);
  };

  const isSearchEnabled = accounts[0]?.username === "dev1@surgicalcapital.com";

  return (
    <div className='flexColCenter leader-portal'>
      {isSearchEnabled && (
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
      )}

      <div className='paddings'>
        <WelcomeLeaders />

        <div className='innerWidth paddings'>
          <EmployeeList
            filterLeaderEmail={isSearchEnabled ? filterLeaderEmail : ''}
            onEmployeeSelect={handleEmployeeSelect}
            hasPermissions={false}
            onLicenseClick={handleLicenseClick} // Add license functionality
          />
        </div>

        <div style={{
          transform: 'scale(0.91)',
          transformOrigin: 'top left',
          marginLeft: "2rem",
          width: "100%"
        }}>
          {selectedEmployee && !isLicenseMode && (
            <DashboardEmployee employee_id={selectedEmployee.employee_id} />
          )}
        </div>

        {selectedEmployee && !isLicenseMode && (
          <RequestsCalendar
            employee_id={selectedEmployee.employee_id}
            onEventSelect={handleEventSelect}
            filterLeaderEmail={isSearchEnabled ? filterLeaderEmail : ''}
          />
        )}

        {requestDetails && (
          <RequestView
            requestDetails={requestDetails}
            onClose={closePopup}
            managerPermissions={true}
            employeePermissions={false}
          />
        )}

        {selectedEmployee && isLicenseMode && (
          <EmployeeLicenseCard
            employeeId={selectedEmployee.employee_id}
            onClose={handleClose}
          />
        )}
      </div>
    </div>
  );
}

export default LeaderPortal;

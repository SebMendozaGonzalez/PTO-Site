import React, { useState } from 'react';
import LPTable from '../../components/LPTable/LPTable';
import WelcomeLeaders from '../../components/WelcomeLeaders/WelcomeLeaders';
import DashboardEmployee from '../../components/DashboardEmployee/DashboardEmployee';
import RequestsCalendar from '../../components/RequestsCalendar/RequestsCalendar';
import RequestView from '../../components/RequestView/RequestView';
import { useMsal } from '@azure/msal-react';
import './LeaderPortal.css';

function LeaderPortal() {
  const { accounts } = useMsal();
  const [filterLeaderEmail, setFilterLeaderEmail] = useState(() => accounts[0]?.username || '');
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

      <div className='paddings'>
        <WelcomeLeaders />
        <LPTable filterLeaderEmail={filterLeaderEmail} onEmployeeSelect={handleEmployeeSelect} />

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

        <RequestView requestDetails={requestDetails}
          onClose={closePopup}
          managerPermissions={true}
          employeePermissions={false} />
      </div>
    </div>
  );
}

export default LeaderPortal;

import React, { useState } from 'react';
import LPTable from '../../components/LPTable/LPTable';
import WelcomeLeaders from '../../components/WelcomeLeaders/WelcomeLeaders';
import DashboardEmployee from '../../components/DashboardEmployee/DashboardEmployee';
import RequestsCalendar from '../../components/RequestsCalendar/RequestsCalendar';
import './LeaderPortal.css'

function LeaderPortal() {
  const [filterLeaderName, setFilterLeaderName] = useState(''); // State for leader name filter (if applicable)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null); // State for selected employee_id

  // Function to handle employee selection from LPTable
  const handleEmployeeSelect = (employee) => {
    setSelectedEmployeeId(employee.employee_id);
  };

  return (
    <div className='flexColCenter leader-portal'>
      <div className='paddings'>
        <label htmlFor="leaderName" className='filter-label fonts-primary'>Leader Name: </label>
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

        {selectedEmployeeId && <RequestsCalendar employee_id={selectedEmployeeId}/>}

      </div>
    </div>
  );
}

export default LeaderPortal;

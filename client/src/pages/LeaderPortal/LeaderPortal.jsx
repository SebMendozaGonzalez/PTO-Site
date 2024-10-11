import React, { useState } from 'react';
import LPTable from '../../components/LPTable/LPTable';
import WelcomeLeaders from '../../components/WelcomeLeaders/WelcomeLeaders';
import DashboardEmployee from '../../components/DashboardEmployee/DashboardEmployee';

function LeaderPortal() {
  const [filterLeaderName, setFilterLeaderName] = useState(''); // State for leader name filter (if applicable)
  const [selectedEmployee, setSelectedEmployee] = useState(null); // State for selected employee

  // Function to handle employee selection from LPTable
  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
  };

  return (
    <div className='flexColStart leader-portal'>

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
          transform: 'scale(0.8)',
          transformOrigin: 'top left',
          marginLeft: "2rem",
          width: "100%"
        }}>
          {selectedEmployee && <DashboardEmployee employee={selectedEmployee} />}
        </div>
      </div>

    </div>
  );
}

export default LeaderPortal;

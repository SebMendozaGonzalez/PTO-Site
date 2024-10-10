import React, { useState } from 'react';
import LPTable from '../../components/LPTable/LPTable';
import WelcomeLeaders from '../../components/WelcomeLeaders/WelcomeLeaders';

function LeaderPortal() {
  const [filterLeaderName, setFilterLeaderName] = useState(''); // State for leader name filter (if applicable)

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
        <WelcomeLeaders/>
        <LPTable filterLeaderName={filterLeaderName} />
      </div>
      
    </div>
  );
}

export default LeaderPortal;

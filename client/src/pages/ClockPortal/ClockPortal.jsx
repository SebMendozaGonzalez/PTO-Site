import React, { useState } from 'react';
import EmployeeHierarchy from '../../components/EmployeeHierarchy/EmployeeHierarchy';
import { useMsal } from '@azure/msal-react';

function TimeManagementPortal() {
  const { accounts } = useMsal();

  const [filterLeaderEmail, setFilterLeaderEmail] = useState(() => accounts[0]?.username || '');
  const isSearchEnabled = accounts[0]?.username === "dev1@surgicalcapital.com";

  return (
    <div>

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

      <EmployeeHierarchy filterLeaderEmail={filterLeaderEmail}/>
    </div>
  )
}

export default TimeManagementPortal
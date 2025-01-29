import React, { useState, useEffect } from 'react';
import EmployeeHierarchy from '../../components/EmployeeHierarchy/EmployeeHierarchy';
import { useMsal } from '@azure/msal-react';
import './ClockPortal.css'

function TimeManagementPortal() {
  const { accounts } = useMsal();
  const [inputValue, setInputValue] = useState(() => accounts[0]?.username || '');
  const [filterLeaderEmail, setFilterLeaderEmail] = useState(inputValue);
  const isSearchEnabled = accounts[0]?.username === "dev1@surgicalcapital.com";

  // Debounce effect to reduce API calls
  useEffect(() => {
    const delay = setTimeout(() => {
      setFilterLeaderEmail(inputValue);
    }, 500); // 500ms delay

    return () => clearTimeout(delay);
  }, [inputValue]);

  return (
    <div className='flexColCenter clock-portal'>
      {isSearchEnabled && (
        <div className='paddings'>
          <label htmlFor="leaderEmail" className='filter-label fonts-primary'>Manager Email: </label>
          <input
            id="leaderEmail"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter Leader Email"
            className='filter-input'
          />
        </div>
      )}

      <EmployeeHierarchy filterLeaderEmail={filterLeaderEmail} />
    </div>
  );
}

export default TimeManagementPortal;

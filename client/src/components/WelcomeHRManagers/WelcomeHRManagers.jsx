// src/pages/EmployeePortal/WelcomeEmployees.jsx
import React from 'react';
import { useMsal } from '@azure/msal-react';
import './WelcomeHRManagers.css';

function WelcomeHRManagers() {
  const { accounts } = useMsal();

  return (
      <div className='flexColStart paddings innerWidth welcomeEmployees'>
          <h1 className='fonts-secondary' style={{ fontWeight: "700" }}>
              Welcome, {accounts.length > 0 ? accounts[0].name : 'HR Manager'}!
          </h1>
          <div className="flexStart paragraph">
              <p className="fonts-regular" style={{ fontSize: "1.4rem" }}>
                  Here, you will be able to manage everyone's vacation requests, view their remaining days, upload their disabilities, add new collaborators, take old ones out of the roster, and more.
              </p>
          </div>
      </div>
  );
}

export default WelcomeHRManagers;
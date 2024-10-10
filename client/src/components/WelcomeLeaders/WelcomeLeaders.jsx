// src/pages/EmployeePortal/WelcomeEmployees.jsx
import React from 'react';
import { useMsal } from '@azure/msal-react';
import './WelcomeLeaders.css';

function WelcomeLeaders() {
  const { accounts } = useMsal();

  return (
      <div className='flexColStart paddings innerWidth welcomeEmployees'>
          <h1 className='fonts-secondary' style={{ fontWeight: "700" }}>
              Welcome, {accounts.length > 0 ? accounts[0].name : 'Leader'}!
          </h1>
          <div className="flexStart paragraph">
              <p className="fonts-regular" style={{ fontSize: "1.4rem" }}>
                  Here, you will be able to manage your team's vacation requests, view their remaining days, upload your team's disabilities, and a few more things.
              </p>
          </div>
      </div>
  );
}

export default WelcomeLeaders;
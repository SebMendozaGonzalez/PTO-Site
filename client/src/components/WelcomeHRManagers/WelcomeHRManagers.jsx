// src/pages/EmployeePortal/WelcomeEmployees.jsx
import React from 'react';
import { useMsal } from '@azure/msal-react';
import './WelcomeHRManagers.css';

function WelcomeHRManagers() {
    const { accounts } = useMsal();

    return (
        <div className='contain paddings innerWidth welcomeEmployees'>
            <div className='flexColStart left'>
                <h1 className='fonts-secondary' style={{ fontWeight: "700" }}>
                    Welcome, {accounts.length > 0 ? accounts[0].name : 'HR Manager'}!
                </h1>
                <div className="paragraph">
                    <p className="fonts-regular" style={{ fontSize: "1.4rem" }}>
                        Here, you will be able to manage everyone's vacation requests, view their remaining days, upload their disabilities, add new collaborators, take old ones out of the roster, and more.
                    </p>
                </div>
            </div>
            <div className='flexColStart right'>
                <h1 className='fonts-secondary' style={{ fontWeight: "700" }}>
                    Manage Collaborators
                </h1>
                <div className="paragraph">
                    <p className="fonts-regular" style={{ fontSize: "1.4rem" }}>
                        Here, you will be able to review, manage and update the company's roster. You could add new employees or remove the ones that are no longer with us.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default WelcomeHRManagers;
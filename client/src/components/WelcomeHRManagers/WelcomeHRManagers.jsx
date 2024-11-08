// src/pages/EmployeePortal/WelcomeEmployees.jsx
import React from 'react';
import { useMsal } from '@azure/msal-react';
import './WelcomeHRManagers.css';

function WelcomeHRManagers({ onManageRequestsClick, onManageCollaboratorsClick }) {
    const { accounts } = useMsal();

    return (
        <div className='flexColStart paddings innerWidth welcome-hr'>
            <div className='innerWidth paddings'>
                <div className='column left innerWidth'>
                    <h1 className='fonts-secondary' style={{ fontWeight: "700" }}>
                        Welcome, {accounts.length > 0 ? accounts[0].name : 'HR Manager'}!
                    </h1>
                    <div className="paragraph">
                        <p className="fonts-regular" style={{ fontSize: "1.4rem" }}>
                            The HR portal is a centralized tool for making typical HR tasks be easier and more intuitive. From here, you can:
                        </p>
                    </div>
                </div>
            </div>
            <div className='contain innerWidth paddings'>
                <div className='column flexColStart'>
                    <h1 className='fonts-secondary flexColStart' style={{ fontWeight: "700" }}>
                        Manage Time Off Requests
                    </h1>
                    <div className="paragraph">
                        <p className="fonts-regular" style={{ fontSize: "1.4rem" }}>
                            Review and decide upon the requests from everyone in the company.
                        </p>
                    </div>
                    {/* 
                    <div className='padding'>
                        <button className='button' onClick={onManageRequestsClick}>
                            Manage TO Requests
                        </button>
                    </div>
                    */}
                </div>

                <div className='column flexColStart'>
                    <h1 className='fonts-secondary flexColStart' style={{ fontWeight: "700" }}>
                        Manage Collaborators
                    </h1>
                    <div className="paragraph">
                        <p className="fonts-regular" style={{ fontSize: "1.4rem" }}>
                            Review, manage and update the company's roster.
                        </p>
                    </div>
                    {/*
                    <div className='padding'>
                        <button className='button' onClick={onManageCollaboratorsClick}>
                        Manage Collaborators
                        </button>
                    </div>
                    */}
                </div>
            </div>
        </div>
    );
}

export default WelcomeHRManagers;

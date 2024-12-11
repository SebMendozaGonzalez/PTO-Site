import React, { useState, useEffect } from 'react';
import './EmployeePortal.css';
import WelcomeEmployees from '../../components/WelcomeEmployees/WelcomeEmployees';
import DashboardEmployee from '../../components/DashboardEmployee/DashboardEmployee';
import RequestsEmployee from '../../components/RequestsEmployee/RequestsEmployee';
import RequestsList from '../../components/RequestsList/RequestsList';
import RequestView from '../../components/RequestView/RequestView';
import { useMsal } from '@azure/msal-react';
import axios from 'axios';
import LiquidationRequestsList from '../../components/LiquidationRequestsList/LiquidationRequestsList';

function EmployeePortal() {
  const { accounts } = useMsal();
  const [filterEmail, setFilterEmail] = useState(() => accounts[0]?.username || '');
  const [employeeId, setEmployeeId] = useState('');
  const [requestDetails, setRequestDetails] = useState(null);

  // Determine if the logged-in account is allowed to search
  const isSearchEnabled = accounts[0]?.username === "dev1@surgicalcapital.com";

  useEffect(() => {
    // Function to fetch the employee ID from the email
    const fetchEmployeeId = async (email) => {
      try {
        const response = await axios.get(`/email_id/${email}`);
        setEmployeeId(response.data.employee_id);
        console.log('Fetched employee ID:', response.data.employee_id);
      } catch (error) {
        console.error(`Error fetching employee ID for email ${email}:`, error);
        setEmployeeId('');
      }
    };

    if (filterEmail) {
      // Fetch employee ID for the current filter email
      fetchEmployeeId(filterEmail);
    }
  }, [filterEmail]);

  useEffect(() => {
    // Automatically set the filter email to the logged-in account's username
    if (!isSearchEnabled) {
      setFilterEmail(accounts[0]?.username || '');
    }
  }, [accounts, isSearchEnabled]);

  const closePopup = () => {
    setRequestDetails(null);
  };

  const handleClickRequest = (request) => {
    setRequestDetails(request);
  };

  console.log('Employee ID sent to child components:', employeeId);

  return (
    <div className="employee-portal">
      {isSearchEnabled && (
        <div className="paddings">
          <label htmlFor="EmployeeEmail" className="filter-label fonts-primary">
            Employee Email:
          </label>
          <input
            id="EmployeeEmail"
            type="text"
            value={filterEmail}
            onChange={(e) => setFilterEmail(e.target.value)}
            placeholder="Enter Employee Email"
            className="filter-input"
          />
        </div>
      )}

      <WelcomeEmployees />
      <DashboardEmployee employee_id={employeeId} />
      <RequestsList employee_id={employeeId} onClickRequest={handleClickRequest} />
      <LiquidationRequestsList
        employee_id={employeeId}
        fromEP={true}
        HRportal={false}
        /*onClickRequest={handleClickRequest} */
      />
      <RequestsEmployee employee_id={employeeId} />
      <RequestView
        requestDetails={requestDetails}
        onClose={closePopup}
        managerPermissions={false}
        employeePermissions={true}
      />
    </div>
  );
}

export default EmployeePortal;

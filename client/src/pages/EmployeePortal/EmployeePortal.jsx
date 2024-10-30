import React, { useState, useEffect } from 'react';
import './EmployeePortal.css';
import WelcomeEmployees from '../../components/WelcomeEmployees/WelcomeEmployees';
import DashboardEmployee from '../../components/DashboardEmployee/DashboardEmployee';
import RequestsEmployee from '../../components/RequestsEmployee/RequestsEmployee';
import RequestsList from '../../components/RequestsList/RequestsList';
import RequestView from '../../components/RequestView/RequestView';
import { useMsal } from '@azure/msal-react';
import axios from 'axios';

function EmployeePortal() {
  const { accounts } = useMsal();
  const [filterEmail, setFilterEmail] = useState(() => accounts[0]?.email || '');  
  const [employeeId, setEmployeeId] = useState('');
  const [requestDetails, setRequestDetails] = useState(null);
  

  useEffect(() => {
    if (filterEmail) {
      const fetchEmployeeId = async () => {
        try {
          const response = await axios.get(`/email_id/${filterEmail}`);
          setEmployeeId(response.data.employee_id);
        } catch (error) {
          console.error("Error fetching employee ID:", error);
          setEmployeeId(''); // Clear employee ID if not found or error occurs
        }
      };
      fetchEmployeeId();
    }
  }, [filterEmail]);

  const closePopup = () => {
    setRequestDetails(null);
  };

  const handleClickRequest = (request) => {
    setRequestDetails(request);
  };

  return (
    <div className="employee-portal">
      <div className='paddings'>
        <label htmlFor="EmployeeEmail" className='filter-label fonts-primary'>Employee Email: </label>
        <input
          id="EmployeeEmail"
          type="text"
          value={filterEmail}
          onChange={(e) => setFilterEmail(e.target.value)}
          placeholder="Enter Employee Email"
          className='filter-input'
        />
      </div>

      <WelcomeEmployees />
      <DashboardEmployee employee_id={employeeId} />
      <RequestsList employee_id={employeeId} onClickRequest={handleClickRequest} />
      <RequestsEmployee employee_id={employeeId} />
      <RequestView requestDetails={requestDetails}
        onClose={closePopup}
        managerPermissions={false}
        employeePermissions={true} />
    </div>
  );
}

export default EmployeePortal;

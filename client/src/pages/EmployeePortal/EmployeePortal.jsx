import React, { useState, useEffect } from 'react';
import './EmployeePortal.css';
import WelcomeEmployees from '../../components/WelcomeEmployees/WelcomeEmployees';
import DashboardEmployee from '../../components/DashboardEmployee/DashboardEmployee';
import RequestsEmployee from '../../components/RequestsEmployee/RequestsEmployee';
import RequestsList from '../../components/RequestsList/RequestsList';
import RequestView from '../../components/RequestView/RequestView';
import axios from 'axios';

function EmployeePortal() {
  const [email, setEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [requestDetails, setRequestDetails] = useState(null);

  const closePopup = () => {
    setRequestDetails(null);
  };

  const handleClickRequest = (request) => {
    setRequestDetails(request);
  };

  useEffect(() => {
    const fetchEmployeeId = async () => {
      if (email) {
        try {
          const response = await axios.get(`/email_id/${email}`);
          setEmployeeId(response.data.employee_id);
        } catch (error) {
          console.error('Error fetching employee ID:', error);
        }
      } else {
        setEmployeeId('');
      }
    };

    fetchEmployeeId();
  }, [email]);

  return (
    <div className="employee-portal">
      <div className='paddings'>
        <label htmlFor="EmployeeEmail" className='filter-label fonts-primary'>Employee Email: </label>
        <input
          id="EmployeeEmail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Employee Email"
          className='filter-input'
        />
      </div>

      <WelcomeEmployees />
      {employeeId && <DashboardEmployee employee_id={employeeId} />}
      <RequestsList employee_id={employeeId} onClickRequest={handleClickRequest} />
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


import React, { useState, useEffect } from 'react';
import LPTable from '../../components/LPTable/LPTable';
import WelcomeLeaders from '../../components/WelcomeLeaders/WelcomeLeaders';
import DashboardEmployee from '../../components/DashboardEmployee/DashboardEmployee';
import RequestsCalendar from '../../components/RequestsCalendar/RequestsCalendar';
import RequestView from '../../components/RequestView/RequestView';
import axios from 'axios';
import './LeaderPortal.css';

function LeaderPortal() {
  const [email, setEmail] = useState('');
  const [employeeId, setEmployeeId] = useState(null);
  const [requestDetails, setRequestDetails] = useState(null);

  const handleEventSelect = (details) => {
    setRequestDetails(details);
  };

  const closePopup = () => {
    setRequestDetails(null);
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
        setEmployeeId(null);
      }
    };

    fetchEmployeeId();
  }, [email]);

  return (
    <div className='flexColCenter leader-portal'>
      <div className='paddings'>
        <label htmlFor="LeaderEmail" className='filter-label fonts-primary'>Leader Email: </label>
        <input
          id="LeaderEmail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Leader Email"
          className='filter-input'
        />
      </div>

      <WelcomeLeaders />
      <LPTable onEmployeeSelect={setEmployeeId} />
      {employeeId && (
        <>
          <div style={{
            transform: 'scale(0.91)',
            transformOrigin: 'top left',
            marginLeft: "2rem",
            width: "100%"
          }}>
            <DashboardEmployee employee_id={employeeId} />
          </div>
          <RequestsCalendar employee_id={employeeId} onEventSelect={handleEventSelect} />
        </>
      )}
      <RequestView
        requestDetails={requestDetails}
        onClose={closePopup}
        managerPermissions={true}
        employeePermissions={false}
      />
    </div>
  );
}

export default LeaderPortal;

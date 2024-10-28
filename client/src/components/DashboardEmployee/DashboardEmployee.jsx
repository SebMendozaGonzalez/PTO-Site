import React, { useEffect, useState } from 'react';
import './DashboardEmployee.css';
import axios from 'axios';

function DashboardEmployee({ employee_id }) {
  const [vacationInfo, setVacationInfo] = useState(null); 
  const [photoUrl, setPhotoUrl] = useState(null); 
  const [error, setError] = useState(null); 


  const employeeId = employee_id || '123';

  useEffect(() => {
    // Reset states when employeeId changes to allow a fresh fetch
    setVacationInfo(null);
    setPhotoUrl(null);
    setError(null); 

    const fetchVacationInfo = async () => {
      try {
        const response = await axios.get(`/vacations-info/${employeeId}`);
        setVacationInfo(response.data);
      } catch (err) {
        console.error('Error fetching vacation info:', err);
        setError('Failed to fetch vacation info');
      }
    };
    fetchVacationInfo();

    const fetchPhotoUrl = async () => {
      try {
        await axios.get(`/employee-photos/${employeeId}.jpeg`);
        setPhotoUrl(`/employee-photos/${employeeId}.jpeg`);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // Set default photo if not found (404 error)
          setPhotoUrl(`/employee-photos/0.jpeg`);
        } else {
          console.error('Error fetching photo URL:', err);
        }
      }
    };
    fetchPhotoUrl();
  }, [employeeId]); // Effect runs whenever employeeId changes

  // Handle errors here
  if (error) return <div>{error}</div>;
  if (!vacationInfo) return <div>Loading vacation info...</div>;

  const accumulatedDays = vacationInfo.accued_days || 0;
  const usedDays = vacationInfo.used_days || 0;
  const availableDays = vacationInfo.remaining_days || 0;
  const daysInCompany = vacationInfo.total_days || 0;

  return (
    <div className='flexColStart paddings dashboard-employee'>
      <div className='flexCenter insideStuff'>
        <div className='paddings image-container' style={{ marginLeft: "3em" }}>
          {photoUrl ? (
            <img src={photoUrl} alt="Employee" />
          ) : (
            <div>Loading photo...</div>
          )}
        </div>

        <div className="dashboardText" style={{ marginLeft: "3em" }}>
          <div className='flexCenter'>
            <div className='flexColCenter paddings'>
              <h2>Accumulated days</h2>
              <h3>{accumulatedDays}</h3>
            </div>
            <div className='flexColCenter paddings'>
              <h2>Used days</h2>
              <h3>{usedDays}</h3>
            </div>
            <div className='flexColCenter paddings'>
              <h2>Available days</h2>
              <h3>{availableDays}</h3>
            </div>
          </div>
          <div className='flexCenter'>
            <div className='flexColCenter paddings'>
              <h2>Days in the company</h2>
              <h3>{daysInCompany}</h3>
            </div>
            <div className='flexColCenter paddings'>
              <h2>Liquidated days</h2>
              <h3>{vacationInfo.compensated_days || 0}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardEmployee;

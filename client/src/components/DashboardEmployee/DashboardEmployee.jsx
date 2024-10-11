import React, { useEffect, useState } from 'react';
import './DashboardEmployee.css';
import axios from 'axios';

function DashboardEmployee({ employee_id }) {
  const [vacationInfo, setVacationInfo] = useState(null); // State for vacation data
  const [photoUrl, setPhotoUrl] = useState(null); // State for employee photo URL
  const [error, setError] = useState(null); // State for error messages

  // Use the passed employee_id or default to '1007055144'
  const employeeId = employee_id || '1007055144';

  useEffect(() => {
    // Reset states when employeeId changes to allow a fresh fetch
    setVacationInfo(null);
    setPhotoUrl(null);
    setError(null); // Clear any previous errors

    // Fetch vacation info for the selected employee or default employee
    const fetchVacationInfo = async () => {
      try {
        const response = await axios.get(`https://quantumhr.azurewebsites.net/vacations-info/${employeeId}`);
        setVacationInfo(response.data);
      } catch (err) {
        console.error('Error fetching vacation info:', err);
        setError('Failed to fetch vacation info');
      }
    };
    fetchVacationInfo();

    // Fetch the employee photo URL
    const fetchPhotoUrl = async () => {
      try {
        await axios.get(`https://quantumhr.azurewebsites.net/employee-photos/${employeeId}.jpeg`);
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
  if (error) return <div>{error}</div>; // Show error message if it exists
  if (!vacationInfo) return <div>Loading vacation info...</div>; // Show loading while fetching

  const formatDecimal = (num) => Number(num).toFixed(2);

  const accumulatedDays = formatDecimal(vacationInfo.accued_days || 0);
  const usedDays = formatDecimal(vacationInfo.used_days || 0);
  const availableDays = formatDecimal(vacationInfo.remaining_days || 0);
  const daysInCompany = formatDecimal(vacationInfo.total_days || 0);

  return (
    <div className='flexColStart paddings dashboard-employee'>
      <div className='flexCenter insideStuff'>
        <div className='paddings image-container' style={{ marginLeft: "4em" }}>
          {photoUrl ? (
            <img src={photoUrl} alt="Employee" />
          ) : (
            <div>Loading photo...</div> // Optional loading state for photo
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

import React, { useEffect, useState } from 'react';
import './DashboardEmployee.css';
import axios from 'axios';

function DashboardEmployee({ employee }) {
  const [vacationInfo, setVacationInfo] = useState(null); // State for vacation data
  const [photoUrl, setPhotoUrl] = useState(null); // State for employee photo URL
  const [error, setError] = useState(null);

  useEffect(() => {
    if (employee) {
      // Fetch vacation info for the selected employee
      const fetchVacationInfo = async () => {
        try {
          const response = await axios.get(`https://quantumhr.azurewebsites.net/vacations-info/${employee.employee_id}`);
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
          await axios.get(`https://quantumhr.azurewebsites.net/employee-photos/${employee.employee_id}.jpeg`);
          setPhotoUrl(`/employee-photos/${employee.employee_id}.jpeg`);
        } catch (err) {
          console.error('Error fetching photo URL:', err);
        }
      };
      fetchPhotoUrl();
    } else {
      const fetchVacationInfo = async () => {
        try {
          const response = await axios.get(`https://quantumhr.azurewebsites.net/vacations-info/1007055144`);
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
          await axios.get(`https://quantumhr.azurewebsites.net/employee-photos/1007055144.jpeg`);
          setPhotoUrl(`/employee-photos/1007055144.jpeg`);
        } catch (err) {
          console.error('Error fetching photo URL:', err);
        }
      };
      fetchPhotoUrl();
    }
  }, [employee]);

  // Handle errors here
  if (error) return <div>{error}</div>; // Show error message if it exists
  if (!employee) return null;
  if (!vacationInfo) return <div>Loading vacation info...</div>;

  const formatDecimal = (num) => {
    return Number(num).toFixed(2);
  };

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

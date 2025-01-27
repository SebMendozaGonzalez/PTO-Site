import React, { useEffect, useState } from 'react';
import './DashboardEmployee.css';
import axios from 'axios';

function DashboardEmployee({ employee_id }) {
  const [vacationInfo, setVacationInfo] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [error, setError] = useState(null);

  const employeeId = employee_id;

  useEffect(() => {
    setVacationInfo(null);
    setPhotoUrl(null);
    setError(null);

    const fetchVacationInfo = async () => {
      try {
        const response = await axios.get(`/back/vacations-info/${employeeId}`); // Updated endpoint
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
          setPhotoUrl(`/employee-photos/0.jpeg`);
        } else {
          console.error('Error fetching photo URL:', err);
        }
      }
    };

    fetchPhotoUrl();
  }, [employeeId]);


  if (error) return <div>{error}</div>;
  if (!vacationInfo) return <div>Loading vacation info...</div>;

  const { accued_days, used_days, remaining_days, total_days, compensated_days } = vacationInfo;

  return (
    <div className="flexColStart paddings dashboard-employee">
      <div className="insideStuff">
        <div className="image-container">
          {photoUrl ? (
            <img src={photoUrl} alt="Employee" />
          ) : (
            <div>Loading photo...</div>
          )}
        </div>

        <div className="dashboardText">
          <div className="flexCenter">
            <div className="flexColCenter paddings">
              <h2>Accumulated days</h2>
              <h3>{accued_days || 0}</h3>
            </div>
            <div className="flexColCenter paddings">
              <h2>Used days</h2>
              <h3>{used_days || 0}</h3>
            </div>
            <div className="flexColCenter paddings">
              <h2>Available days</h2>
              <h3>{remaining_days || 0}</h3>
            </div>
          </div>
          <div className="flexCenter">
            <div className="flexColCenter paddings">
              <h2>Days in the company</h2>
              <h3>{total_days || 0}</h3>
            </div>
            <div className="flexColCenter paddings">
              <h2>Liquidated days</h2>
              <h3>{compensated_days || 0}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardEmployee;

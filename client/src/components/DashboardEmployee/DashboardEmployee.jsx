import React from 'react';
import './DashboardEmployee.css';
import Image from "../../images/yo.jpg";

function DashboardEmployee({ employee }) {
  if (!employee) return null;

  // Placeholder vacation data - replace with actual data when available
  const accumulatedDays = 43.13; // Replace with employee-specific data
  const usedDays = 13; // Replace with employee-specific data
  const availableDays = accumulatedDays - usedDays;
  const daysInCompany = 1035; // Example value, calculate based on employee start date

  return (
    <div className='flexColStart paddings dashboard-employee'>
      <div className='flexCenter insideStuff'>
        <div className='paddings image-container' style = {{marginLeft: "4em"}}>
          <img src={Image} alt="employee_img" />
        </div>
        
        <div className = "dashboardText" style = {{marginLeft: "3em"}}>
          <h2>{employee.name}'s Vacation Info</h2>
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
              <h3>0</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardEmployee;

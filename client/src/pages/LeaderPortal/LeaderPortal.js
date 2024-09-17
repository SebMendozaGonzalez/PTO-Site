import React, { useState, useEffect } from 'react';
import './LeaderPortal.css';

const LeaderPortal = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    // Fetch the employees from the backend
    fetch('/api/employees')
      .then(response => response.json())
      .then(data => setEmployees(data))
      .catch(error => console.error('Error fetching employees:', error));
  }, []);

  return (
    <div className="leader-portal">
      <h1>All Employees</h1>
      <table className="employee-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.department}</td>
              <td>{employee.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderPortal;

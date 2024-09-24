import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LeaderPortal.css';

const LeaderPortal = () => {
  const [employees, setEmployees] = useState([]); // Ensure this is initialized as an empty array
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data from the backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:5000/leader-portal');
        console.log('Response data:', response.data); // Log the response data for debugging
        if (Array.isArray(response.data)) { // Check if the response data is an array
          setEmployees(response.data);  // Set the employees' data to state
        } else {
          throw new Error('Expected an array but received: ' + JSON.stringify(response.data));
        }
        setLoading(false);  // Stop the loading state
      } catch (err) {
        setError('Failed to load employee data: ' + err.message);
        setLoading(false);  // Stop the loading state on error as well
      }
    };

    fetchEmployees();
  }, []);

  if (loading) {
    return <div>Loading...</div>;  // Display a loading message while fetching data
  }

  if (error) {
    return <div>Error: {error}</div>;  // Display an error message if something goes wrong
  }

  return (
    <div className='flexColCenter paddings leader-portal'>
      <h1>Employees</h1>
      <ul>
        {employees.map(employee => (
          <li key={employee.employee_id}>
            {employee.name} - {employee.position}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaderPortal;

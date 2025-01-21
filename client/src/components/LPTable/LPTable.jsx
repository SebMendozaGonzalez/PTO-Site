import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './LPTable.css';

const LPTable = ({ filterLeaderEmail, onEmployeeSelect }) => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('/api/employee');
        if (Array.isArray(response.data)) {
          const formattedEmployees = response.data.map(employee => ({
            ...employee,
            start_date: new Date(employee.start_date).toLocaleDateString('en-US'),
            date_of_birth: new Date(employee.date_of_birth).toLocaleDateString('en-US'),
          }));
          setEmployees(formattedEmployees);
        } else {
          throw new Error('Expected an array but received: ' + JSON.stringify(response.data));
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load employee data: ' + err.message);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const filteredEmployees = employees.filter(employee => {
    const matchesLeaderEmail = filterLeaderEmail
      ? employee.leader_email && employee.leader_email.toLowerCase().includes(filterLeaderEmail.toLowerCase())
      : true;

    return matchesLeaderEmail;
  });

  const columnDefs = [
    { field: 'employee_id', headerName: 'ID', width: 125 },
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'position', headerName: 'Position', width: 230 },
    { field: 'start_date', headerName: 'Start Date', width: 120 },
    { field: 'date_of_birth', headerName: 'Date of Birth', width: 150 },
    { field: 'email_surgical', headerName: 'Email', width: 220 },
    { field: 'emergency_contact', headerName: 'Emergency person', width: 160 },
    { field: 'emergency_phone', headerName: 'Emergency #', width: 160 },
  ];

  const onRowClicked = (event) => {
    onEmployeeSelect(event.data);
  };

  return (
    <div className='flexColStart'>
      <div>
        <p className='fonts-regular' style={{ fontSize: "2.5 rem", paddingLeft: "2rem" }}> The following are the members of your team: <br /></p>
      </div>
      <div className='table-container paddings'>
        <div className="ag-theme-alpine table">
          <AgGridReact
            rowData={filteredEmployees}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={5}
            domLayout="normal"
            enableCellTextSelection={true}
            suppressHorizontalScroll={false}
            alwaysShowHorizontalScroll={true}
            onRowClicked={onRowClicked}
          />
        </div>
      </div>
    </div>
  );
};

export default LPTable;

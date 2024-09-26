import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './LPTable.css';

const LPTable = ({ filterLeaderId, filterLeaderName }) => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:5000/vacationsXemployee-info');
        if (Array.isArray(response.data)) {
          const formattedEmployees = response.data.map(employee => ({
            ...employee,
            start_date: new Date(employee.start_date).toLocaleDateString('en-US'),
            end_date: new Date(employee.end_date).toLocaleDateString('en-US'),
            date_of_birth: new Date(employee.end_date).toLocaleDateString('en-US'),
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

  // Apply filter by leader ID and name
  const filteredEmployees = employees.filter(employee => {
    const matchesLeaderName = filterLeaderName
      ? employee.leader && employee.leader.toLowerCase().includes(filterLeaderName.toLowerCase())
      : true;

    return matchesLeaderName && employee.status === "ACTIVO";
  });

  const columnDefs = [
    { field: 'employee_id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'position', headerName: 'Position', width: 200 },
    { field: 'start_date', headerName: 'Start Date', width: 120 },
    { field: 'end_date', headerName: 'End Date', width: 120 },
    { field: 'total_days', headerName: 'Total Days', width: 140 },
    { field: 'accued_days', headerName: 'Accumulated', width: 140 },
    { field: 'used_days', headerName: 'Used Days', width: 140 },
    { field: 'remaining_days', headerName: 'Unused Days', width: 140 },
  ];

  return (
    <div className='table-container'>
      <div className="ag-theme-alpine table">
      <AgGridReact
          rowData={filteredEmployees}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={5}
          domLayout="normal" // Ensure the normal layout is used to keep header and footer fixed
          enableCellTextSelection={true} // Allows text selection
          suppressHorizontalScroll={false}
          alwaysShowHorizontalScroll={true} // Always show horizontal scrollbar
        />
      </div>
    </div>
  );
};

export default LPTable;

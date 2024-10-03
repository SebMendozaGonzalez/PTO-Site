import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { format } from 'date-fns';
import './LPTable1.css';

const LPTable1 = ({ filterLeaderId, filterLeaderName }) => {
  const [employees, setEmployees] = useState([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:5000/employees-info');
        if (Array.isArray(response.data)) {
          const formattedEmployees = response.data.map(employee => ({
            ...employee,
            start_date: format(new Date(employee.start_date), 'MM/dd/yyyy'),
            date_of_birth: format(new Date(employee.date_of_birth), 'MM/dd/yyyy')
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
    const matchesLeaderId = filterLeaderId ? employee.leader_id === filterLeaderId : true;
    const matchesLeaderName = filterLeaderName ? employee.name.toLowerCase().includes(filterLeaderName.toLowerCase()) : true;
    return matchesLeaderId && matchesLeaderName;
  });

  const columns = [
    { field: 'employee_id', headerName: 'ID', width: 105 },
    { field: 'name', headerName: 'Name', width: 160 },
    { field: 'department', headerName: 'Department', width: 150 },
    { field: 'position', headerName: 'Position', width: 220 },
    { field: 'date_of_birth', headerName: 'Date of Birth', width: 120 },
    { field: 'start_date', headerName: 'Start Date', width: 120 },
    { field: 'phone_number', headerName: 'PN', width: 130 },
    { field: 'emergency_name', headerName: 'Emergency Contact', width: 150 },
    { field: 'emergency_phone', headerName: 'Emergency Phone', width: 150 },
  ];

  return (
    <div className='table-leaders paddings flexColStart'>
      <div style={{ height: 400, width: '85rem' }}>
        <DataGrid
          rows={filteredEmployees}
          columns={columns}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={(newModel) => setPaginationModel(newModel)}
          pageSizeOptions={[5, 10]}
          getRowId={(row) => row.employee_id}
        />
      </div>
    </div>
  );
};

export default LPTable1;
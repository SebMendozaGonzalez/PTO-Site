import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { format } from 'date-fns'; // Import format from date-fns
import './LPTable2.css';

const LPTable2 = () => {
  const [employees, setEmployees] = useState([]);  
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:5000/vacations-info');
        if (Array.isArray(response.data)) {
          const formattedEmployees = response.data.map(employee => ({
            ...employee,
            start_date: format(new Date(employee.start_date), 'MM/dd/yyyy'),
            end_date: format(new Date(employee.end_date), 'MM/dd/yyyy'),
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



  const columns = [
    { field: 'employee_id', headerName: 'ID', width: 105 },
    { field: 'name', headerName: 'Name', width: 160 },
    { field: 'position', headerName: 'Position', width: 220 },
    { field: 'start_date', headerName: 'Start Date', width: 120 },
    { field: 'end_date', headerName: 'End Date', width: 120 },
  ];

  return (
    <div className='table-leaders paddings flexColStart'>
      
      <div style={{ height: 400, width: '85rem' }}>
        <DataGrid
          rows={employees} // Use filtered employees
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

export default LPTable2;

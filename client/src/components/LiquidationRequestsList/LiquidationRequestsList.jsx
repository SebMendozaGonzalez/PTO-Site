import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { ListItemIcon, Checkbox, FormGroup, MenuItem, Select, InputLabel } from '@mui/material';
import Dots from '../Dots/Dots';
import './LiquidationRequestsList.css';

function LiquidationRequestsList({ employee_id, onClickRequest, fromEP, HRportal, filterLeaderEmail }) {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState([]);
    const [employeeFilter, setEmployeeFilter] = useState('');
    const [employeeList, setEmployeeList] = useState([]);

    const departmentOptions = [
        'Management', 'Collections', 'QA', 'CSU', 'GP', 'Underwriting',
        'Marketing', 'Servicing', 'Payment', 'Odonaga', 'TBI', 'SCOF',
    ];

    useEffect(() => {
        const fetchRequests = async () => {
            setRequests([]);
            setError('');

            try {
                if (fromEP) {
                    // Case: fromEP is true
                    const response = await axios.get(`/liquidation-requests-info/${employee_id}`);
                    setRequests(response.data);
                } else {
                    if (HRportal) {
                        // Case: fromEP is false, HRportal is true
                        const response = await axios.get('/liquidation-requests-info');
                        setRequests(response.data);
                    } else {
                        // Case: fromEP is false, HRportal is false
                        const liquidationResponse = await axios.get('/liquidation-requests-info');
                        const liquidationRequests = liquidationResponse.data;

                        const employeesResponse = await axios.get(
                            `/employees-by-leader/${filterLeaderEmail}`
                        );
                        const employees = employeesResponse.data;
                        setEmployeeList(employees);

                        const filteredRequests = liquidationRequests.filter(request =>
                            employees.includes(request.employee_id)
                        );

                        setRequests(filteredRequests);
                    }
                }
            } catch (err) {
                setError("An error occurred while fetching the liquidation requests.");
                console.error(err);
            }
        };

        fetchRequests();
    }, [employee_id, fromEP, HRportal, filterLeaderEmail]);

    const handleDepartmentChange = (event) => {
        const value = event.target.value;
        setDepartmentFilter(typeof value === 'string' ? value.split(',') : value);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { timeZone: 'UTC' });
    };

    const filteredRequests = requests.filter(request => {
        if (departmentFilter.length > 0 && !departmentFilter.includes(request.department)) {
            return false;
        }
        if (employeeFilter && request.employee_id !== employeeFilter) {
            return false;
        }
        return true;
    });

    return (
        <div className="paddings innerWidth liquidation-requests-list">
            <h2 className='fonts-secondary'>
                Liquidation requests:
            </h2>
            <Box
                sx={{
                    width: '100%',
                    bgcolor: '#f8f9fe',
                    padding: 2,
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                }}
            >
                {error && <p style={{ color: '#1560f6' }}>{error}</p>}

                {!fromEP && !HRportal && (
                    <div>
                        <FormGroup>
                            <InputLabel id="department-filter-label">Filter by Department</InputLabel>
                            <Select
                                labelId="department-filter-label"
                                multiple
                                value={departmentFilter}
                                onChange={handleDepartmentChange}
                                renderValue={(selected) => selected.join(', ')}
                                style={{ marginBottom: '16px', width: '100%' }}
                            >
                                {departmentOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        <Checkbox checked={departmentFilter.includes(option)} />
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormGroup>

                        <FormGroup>
                            <InputLabel id="employee-filter-label">Filter by Employee</InputLabel>
                            <Select
                                labelId="employee-filter-label"
                                value={employeeFilter}
                                onChange={(event) => setEmployeeFilter(event.target.value)}
                                style={{ marginBottom: '16px', width: '100%' }}
                            >
                                {employeeList.map((employee) => (
                                    <MenuItem key={employee} value={employee}>
                                        {employee}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormGroup>
                    </div>
                )}

                <List dense>
                    {filteredRequests.length > 0 ? (
                        filteredRequests.map(request => (
                            <div key={request.request_id}>
                                <ListItem
                                    button
                                    /*onClick={() => onClickRequest(request)}*/
                                    secondaryAction={
                                        <ListItemIcon edge="end">
                                            <div>
                                                <Dots requestDetails={request} />
                                            </div>
                                        </ListItemIcon>
                                    }
                                >
                                    <ListItemText
                                        primary={
                                            <p className="fonts-primary">
                                                {request.name}
                                                {request.department || 'N/A'}
                                            </p>
                                        }
                                        secondary={
                                            <div className="flexColStart">
                                                <span className="textico-normal">
                                                    <strong className="fonts-secondary sub">Days:</strong> {request.days}
                                                </span>
                                                <span className="textico-normal">
                                                    <strong className="fonts-secondary sub">Request Date:</strong>{' '}
                                                    {formatDate(request.request_date)}
                                                </span>
                                                <span className="textico-normal">
                                                    <strong className="fonts-secondary sub">Decision Date:</strong>{' '}
                                                    {request.decision_date ? formatDate(request.decision_date) : 'Pending'}
                                                </span>
                                            </div>
                                        }
                                    />
                                </ListItem>
                                <Divider style={{ backgroundColor: '#444444' }} />
                            </div>
                        ))
                    ) : (
                        !error && <p style={{ color: '#b6b6b6' }}>Searching for requests...</p>
                    )}
                </List>
                <span>Not seeing a particular liquidation request in here? Refresh the page! They may take a little to appear.</span>
            </Box>
        </div>
    );
}

export default LiquidationRequestsList;
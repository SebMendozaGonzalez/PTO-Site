import React, { useEffect, useState } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import './CalendarFilter.css';

const typeMapping = {
  'Paid Time Off': 'PTO',
  'Maternity License': 'ML',
  'Paternity License': 'PL',
  'Domestic Calamity License': 'DCL',
  'Bereavement License': 'BL',
  'Unpaid Time Off': 'UTO',
  'Inability': 'Ina',
};

const requestTypes = Object.keys(typeMapping);

const filterOptions = [
  { label: 'Filter for Type', key: 'type' },
  { label: 'Filter for Decision', key: 'decided' },
  { label: 'Filter for Acceptance', key: 'accepted' },
  { label: 'Filter for Department', key: 'department' },
  { label: 'Filter for Employee', key: 'employee' },
];

const departmentOptions = [
  'Management', 'Collections', 'QA', 'CSU', 'GP', 'Underwriting',
  'Marketing', 'Servicing', 'Payment', 'Odonaga', 'TBI', 'SCOF',
];

function CalendarFilter({ onFilterChange, filterLeaderEmail }) {
  const [requests, setRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedDecisions, setSelectedDecisions] = useState([]);
  const [selectedAcceptances, setSelectedAcceptances] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  useEffect(() => {
    const fetchRequestsAndEmployees = async () => {
      try {
        const leaderResponse = filterLeaderEmail
          ? await fetch(`/employees-by-leader/${filterLeaderEmail}`)
          : await fetch('/employees-info');
        const leaderData = await leaderResponse.json();
        setEmployees(leaderData);

        const employeeIds = leaderData.map(row => row.employee_id);

        const requestsResponse = await fetch('/requests-info');
        const requestsData = await requestsResponse.json();

        const filteredRequests = requestsData.filter(request =>
          employeeIds.includes(request.employee_id)
        );

        const events = filteredRequests.map(request => ({
          name: request.name,
          type: typeMapping[request.type],
          start: new Date(request.start_date),
          end: new Date(request.end_date),
          employeeId: request.employee_id,
          accepted: request.accepted,
          decided: request.decided,
          cancelled: request.cancelled,
          taken: request.taken,
          requestId: request.request_id,
          details: request,
          department: request.department,
        }));

        setRequests(events);
        onFilterChange(events);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequestsAndEmployees();
  }, [filterLeaderEmail, onFilterChange]);

  const applyFilters = (types, decisions, acceptances, departments, employees) => {
    return requests.filter(request => {
      const typeMatch = !types.length || types.includes(request.type);
      const decisionMatch = !decisions.length || decisions.includes(request.decided);
      const acceptanceMatch = !acceptances.length || acceptances.includes(request.accepted);
      const departmentMatch = !departments.length || departments.includes(request.department);
      const employeeMatch = !employees.length || employees.includes(request.employeeId);
      return typeMatch && decisionMatch && acceptanceMatch && departmentMatch && employeeMatch;
    });
  };

  const handleFilterChange = (key, value) => {
    switch (key) {
      case 'type':
        setSelectedTypes(value);
        break;
      case 'decided':
        setSelectedDecisions(value);
        break;
      case 'accepted':
        setSelectedAcceptances(value);
        break;
      case 'department':
        setSelectedDepartments(value);
        break;
      case 'employee':
        setSelectedEmployees(value);
        break;
      default:
        break;
    }

    onFilterChange(
      applyFilters(
        key === 'type' ? value : selectedTypes,
        key === 'decided' ? value : selectedDecisions,
        key === 'accepted' ? value : selectedAcceptances,
        key === 'department' ? value : selectedDepartments,
        key === 'employee' ? value : selectedEmployees
      )
    );
  };

  return (
    <Box className="calendar-filter" display="flex" flexDirection="row" flexWrap="wrap" gap={2}>
      {filterOptions.map(({ label, key }) => {
        const value =
          key === 'type'
            ? selectedTypes
            : key === 'decided'
            ? selectedDecisions
            : key === 'accepted'
            ? selectedAcceptances
            : key === 'department'
            ? selectedDepartments
            : selectedEmployees;

        const options =
          key === 'employee'
            ? employees.map(emp => ({ label: emp.name, value: emp.employee_id }))
            : key === 'type'
            ? requestTypes.map(type => ({ label: type, value: typeMapping[type] }))
            : key === 'decided' || key === 'accepted'
            ? [
                { label: 'Yes', value: true },
                { label: 'No', value: false },
              ]
            : departmentOptions.map(department => ({ label: department, value: department }));

        return (
          <Box key={key} flex={1} minWidth="200px">
            <div className="filter-description">{label}</div>
            <Select
              multiple
              value={value}
              onChange={event => handleFilterChange(key, event.target.value)}
              renderValue={selected =>
                Array.isArray(selected) && selected.length
                  ? selected
                      .map(sel =>
                        options.find(option => option.value === sel)?.label || sel
                      )
                      .join(', ')
                  : `Select ${label}`
              }
              fullWidth
            >
              {options.map(({ label, value }) => (
                <MenuItem key={value} value={value}>
                  <Checkbox checked={Array.isArray(value) && value.includes(value)} />
                  <ListItemText primary={label} />
                </MenuItem>
              ))}
            </Select>
          </Box>
        );
      })}
    </Box>
  );
}

export default CalendarFilter;

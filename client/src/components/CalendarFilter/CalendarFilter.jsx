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
          allDay: true,
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

  const handleFilterChange = (key, value) => {
    const setters = {
      type: setSelectedTypes,
      decided: setSelectedDecisions,
      accepted: setSelectedAcceptances,
      department: setSelectedDepartments,
      employee: setSelectedEmployees,
    };
    setters[key](value);
    onFilterChange(applyFilters({ ...filters, [key]: value }));
  };

  const filters = {
    type: selectedTypes,
    decided: selectedDecisions,
    accepted: selectedAcceptances,
    department: selectedDepartments,
    employee: selectedEmployees,
  };

  const applyFilters = filters => {
    return requests.filter(request => {
      const typeMatch = !filters.type.length || filters.type.includes(request.type);
      const decisionMatch = !filters.decided.length || filters.decided.includes(request.decided);
      const acceptanceMatch = !filters.accepted.length || filters.accepted.includes(request.accepted);
      const departmentMatch = !filters.department.length || filters.department.includes(request.department);
      const employeeMatch =
        !filters.employee.length || filters.employee.some(emp => emp.employee_id === request.employeeId);
      return typeMatch && decisionMatch && acceptanceMatch && departmentMatch && employeeMatch;
    });
  };

  return (
    <Box className="calendar-filter" display="flex" flexDirection="row" flexWrap="wrap" gap={2}>
      {filterOptions.map(({ label, key }) => {
        const value = filters[key];
        const options =
          key === 'type'
            ? requestTypes.map(type => ({ label: type, value: typeMapping[type] }))
            : key === 'decided' || key === 'accepted'
            ? [false, true].map(val => ({
                label: val ? (key === 'decided' ? 'Decided' : 'Accepted') : (key === 'decided' ? 'Undecided' : 'Not Accepted'),
                value: val,
              }))
            : key === 'department'
            ? departmentOptions.map(dept => ({ label: dept, value: dept }))
            : employees.map(emp => ({ label: emp.name, value: emp }));

        return (
          <Box key={key} flex={1} minWidth="200px">
            <div className="filter-description">{label}</div>
            <Select
              multiple
              value={value}
              onChange={e => handleFilterChange(key, e.target.value)}
              renderValue={selected =>
                selected.map(opt => (opt.name ? opt.name : opt)).join(', ') || `Select ${label}`
              }
              fullWidth
            >
              {options.map(({ label, value }) => (
                <MenuItem key={label} value={value}>
                  <Checkbox checked={Array.isArray(value) ? value.includes(value) : value} />
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

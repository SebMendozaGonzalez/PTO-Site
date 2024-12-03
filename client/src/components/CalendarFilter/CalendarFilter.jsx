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
  { label: 'Filter for Employee', key: 'employee' }, // Added filter for employees
];

const departmentOptions = [
  'Management', 'Collections', 'QA', 'CSU', 'GP', 'Underwriting', 
  'Marketing', 'Servicing', 'Payment', 'Odonaga', 'TBI', 'SCOF',
];

function CalendarFilter({ onFilterChange, filterLeaderEmail }) {
  const [requests, setRequests] = useState([]);
  const [employees, setEmployees] = useState([]); // Store employees
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedDecisions, setSelectedDecisions] = useState([]);
  const [selectedAcceptances, setSelectedAcceptances] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]); // Track selected employees

  useEffect(() => {
    const fetchRequestsAndEmployees = async () => {
      try {
        // Step 1: Query /employees-by-leader or /employees-info
        const leaderResponse = filterLeaderEmail
          ? await fetch(`/employees-by-leader/${filterLeaderEmail}`)
          : await fetch('/employees-info');
        const leaderData = await leaderResponse.json();
        setEmployees(leaderData); // Save employees

        const employeeIds = leaderData.map(row => row.employee_id);

        // Step 2: Query /requests-info
        const requestsResponse = await fetch('/requests-info');
        const requestsData = await requestsResponse.json();

        // Step 3: Filter requests by employee_id in leaderData
        const filteredRequests = requestsData.filter(request =>
          employeeIds.includes(request.employee_id)
        );

        // Map filtered requests to calendar events
        const events = [];
        filteredRequests.forEach(request => {
          const startDate = new Date(request.start_date);
          const endDate = new Date(request.end_date);
          for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
            events.push({
              name: request.name,
              type: typeMapping[request.type],
              start: new Date(d),
              end: new Date(d),
              allDay: true,
              employeeId: request.employee_id,
              accepted: request.accepted,
              decided: request.decided,
              cancelled: request.cancelled,
              taken: request.taken,
              requestId: request.request_id,
              details: request,
              department: request.department,
            });
          }
        });

        setRequests(events);
        onFilterChange(events);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequestsAndEmployees();
  }, [filterLeaderEmail, onFilterChange]);

  const handleTypeChange = event => {
    const { value } = event.target;
    setSelectedTypes(value);
    onFilterChange(applyFilters(value, selectedDecisions, selectedAcceptances, selectedDepartments, selectedEmployees));
  };

  const handleDecisionChange = event => {
    const { value } = event.target;
    setSelectedDecisions(value);
    onFilterChange(applyFilters(selectedTypes, value, selectedAcceptances, selectedDepartments, selectedEmployees));
  };

  const handleAcceptanceChange = event => {
    const { value } = event.target;
    setSelectedAcceptances(value);
    onFilterChange(applyFilters(selectedTypes, selectedDecisions, value, selectedDepartments, selectedEmployees));
  };

  const handleDepartmentChange = event => {
    const { value } = event.target;
    setSelectedDepartments(value);
    onFilterChange(applyFilters(selectedTypes, selectedDecisions, selectedAcceptances, value, selectedEmployees));
  };

  const handleEmployeeChange = event => {
    const { value } = event.target;
    setSelectedEmployees(value);
    onFilterChange(applyFilters(selectedTypes, selectedDecisions, selectedAcceptances, selectedDepartments, value));
  };

  const applyFilters = (types, decisions, acceptances, departments, employees) => {
    return requests.filter(request => {
      const typeMatch = types.length ? types.includes(request.type) : true;
      const decisionMatch = decisions.length ? decisions.includes(request.decided) : true;
      const acceptanceMatch = acceptances.length ? acceptances.includes(request.accepted) : true;
      const departmentMatch = departments.length ? departments.includes(request.department) : true;
      const employeeMatch = employees.length
        ? employees.some(emp => emp.employee_id === request.employeeId)
        : true;
      return typeMatch && decisionMatch && acceptanceMatch && departmentMatch && employeeMatch;
    });
  };

  return (
    <Box className="calendar-filter" display="flex" flexDirection="row" flexWrap="wrap" gap={2}>
      {filterOptions.map(({ label, key }) => {
        const value = key === 'type' ? selectedTypes :
                      key === 'decided' ? selectedDecisions :
                      key === 'accepted' ? selectedAcceptances :
                      key === 'department' ? selectedDepartments :
                      selectedEmployees;

        const handleChange = key === 'type' ? handleTypeChange :
                            key === 'decided' ? handleDecisionChange :
                            key === 'accepted' ? handleAcceptanceChange :
                            key === 'department' ? handleDepartmentChange :
                            handleEmployeeChange;

        const options = key === 'employee' ? employees.map(emp => ({
          label: emp.name,
          value: emp,
        })) : key === 'type' ? requestTypes.map(type => ({
          label: type,
          value: typeMapping[type],
        })) : key === 'decided' || key === 'accepted' ? [false, true].map(val => ({
          label: val ? (key === 'decided' ? 'Decided' : 'Accepted') : (key === 'decided' ? 'Undecided' : 'Not Accepted'),
          value: val,
        })) : departmentOptions.map(department => ({
          label: department,
          value: department,
        }));

        return (
          <Box key={key} flex={1} minWidth="200px">
            <div className="filter-description">{label}</div>
            <Select
              multiple
              value={value}
              onChange={handleChange}
              renderValue={selected => selected.map(opt => opt.name || opt).join(', ') || `Select ${label}`}
              fullWidth
            >
              {options.map(({ label, value }) => (
                <MenuItem key={label} value={value}>
                  <Checkbox checked={value.includes(value)} />
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

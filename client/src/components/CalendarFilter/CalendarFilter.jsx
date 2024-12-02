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
  { label: 'Filter for Department', key: 'department' }, // New department filter
];

const departmentOptions = [
  'Management', 'Collections', 'QA', 'CSU', 'GP', 'Underwriting', 
  'Marketing', 'Servicing', 'Payment', 'Odonaga', 'TBI', 'SCOF'
];

function CalendarFilter({ employee_id, onFilterChange }) {
  const [requests, setRequests] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedDecisions, setSelectedDecisions] = useState([]);
  const [selectedAcceptances, setSelectedAcceptances] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]); // New department filter state

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('/requests-info');
        const data = await response.json();

        // Map requests to calendar events
        const events = [];
        data.forEach(request => {
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
              department: request.department, // Assuming 'department' is in the data
            });
          }
        });

        setRequests(events);
        onFilterChange(events);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, [employee_id, onFilterChange]);

  const handleTypeChange = event => {
    const { value } = event.target;
    setSelectedTypes(value);

    const filteredRequests = applyFilters(value, selectedDecisions, selectedAcceptances, selectedDepartments);
    onFilterChange(filteredRequests);
  };

  const handleDecisionChange = event => {
    const { value } = event.target;
    setSelectedDecisions(value);

    const filteredRequests = applyFilters(selectedTypes, value, selectedAcceptances, selectedDepartments);
    onFilterChange(filteredRequests);
  };

  const handleAcceptanceChange = event => {
    const { value } = event.target;
    setSelectedAcceptances(value);

    const filteredRequests = applyFilters(selectedTypes, selectedDecisions, value, selectedDepartments);
    onFilterChange(filteredRequests);
  };

  const handleDepartmentChange = event => {
    const { value } = event.target;
    setSelectedDepartments(value);

    const filteredRequests = applyFilters(selectedTypes, selectedDecisions, selectedAcceptances, value);
    onFilterChange(filteredRequests);
  };

  // Apply filters to the request list
  const applyFilters = (types, decisions, acceptances, departments) => {
    return requests.filter(request => {
      const typeMatch = types.length ? types.includes(request.type) : true;
      const decisionMatch = decisions.length ? decisions.includes(request.decided) : true;
      const acceptanceMatch = acceptances.length ? acceptances.includes(request.accepted) : true;
      const departmentMatch = departments.length ? departments.includes(request.department) : true;
      return typeMatch && decisionMatch && acceptanceMatch && departmentMatch;
    });
  };

  return (
    <Box className="calendar-filter" display="flex" flexDirection="row" flexWrap="wrap" gap={2}>
      {filterOptions.map(({ label, key }) => {
        const value = key === 'type' ? selectedTypes :
                      key === 'decided' ? selectedDecisions :
                      key === 'accepted' ? selectedAcceptances :
                      selectedDepartments; // For department filter

        const handleChange = key === 'type' ? handleTypeChange :
                            key === 'decided' ? handleDecisionChange :
                            key === 'accepted' ? handleAcceptanceChange :
                            handleDepartmentChange; // For department filter

        return (
          <Box key={key} flex={1} minWidth="200px">
            <div className="filter-description">{label}</div>
            <Select
              multiple
              value={value}
              onChange={handleChange}
              renderValue={selected => selected.join(', ') || `Select ${label}`}
              fullWidth
            >
              {key === 'type' ? requestTypes.map(type => (
                <MenuItem key={type} value={typeMapping[type]}>
                  <Checkbox checked={selectedTypes.includes(typeMapping[type])} />
                  <ListItemText primary={type} />
                </MenuItem>
              )) : 
              key === 'decided' || key === 'accepted' ? [false, true].map(val => (
                <MenuItem key={val} value={val}>
                  <Checkbox checked={value.includes(val)} />
                  <ListItemText primary={val === false ? (key === 'decided' ? 'Undecided' : 'Not Accepted') : (key === 'decided' ? 'Decided' : 'Accepted')} />
                </MenuItem>
              )) : 
              departmentOptions.map(department => (
                <MenuItem key={department} value={department}>
                  <Checkbox checked={value.includes(department)} />
                  <ListItemText primary={department} />
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

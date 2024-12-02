import React, { useEffect, useState } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
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

function CalendarFilter({ employee_id, onFilterChange }) {
  const [requests, setRequests] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

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

    const filteredRequests = value.length
      ? requests.filter(request => value.includes(request.type))
      : requests;

    onFilterChange(filteredRequests);
  };

  return (
    <div className="calendar-filter">
      <Select
        multiple
        value={selectedTypes}
        onChange={handleTypeChange}
        renderValue={selected => 
          selected.length > 0 ? selected.join(', ') : 'Filter by Type'
        }
      >
        {requestTypes.map(type => (
          <MenuItem key={type} value={typeMapping[type]}>
            <Checkbox checked={selectedTypes.includes(typeMapping[type])} />
            <ListItemText primary={type} />
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}

export default CalendarFilter;

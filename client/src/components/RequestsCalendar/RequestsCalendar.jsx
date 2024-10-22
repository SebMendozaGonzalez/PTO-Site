import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './RequestsCalendar.css';

const localizer = momentLocalizer(moment);

function RequestsCalendar({ employee_id }) {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Fetching vacation requests from your /requests-info route
    fetch('/requests-info')
      .then(response => response.json())
      .then(data => {
        const events = data.map(request => ({
          title: `${request.name} requested a ${request.type} from ${request.start_date} to ${request.end_date}`,
          start: new Date(request.start_date),
          end: new Date(request.end_date),
          allDay: true,
          employeeId: request.employee_id,
        }));
        setRequests(events);
      })
      .catch(err => console.error('Error fetching requests:', err));
  }, [employee_id]);

  // Function to style events based on employee_id
  const eventStyleGetter = (event) => {
    const backgroundColor = event.employeeId === employee_id ? '#050f38' : '#a4c3ff';
    const style = {
      backgroundColor,
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
      fontWeight: '200'
    };
    return { style };
  };

  return (
    <div className='request-calendar'>
      <Calendar
        localizer={localizer}
        events={requests}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        eventPropGetter={eventStyleGetter}
        views={['month']}
      />
    </div>
  );
}

export default RequestsCalendar;

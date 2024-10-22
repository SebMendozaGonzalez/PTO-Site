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
        const events = [];

        data.forEach(request => {
          const startDate = new Date(request.start_date);
          const endDate = new Date(request.end_date);
          // Create an event for each day in the range
          for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
            events.push({
              title: `${request.name} | ${request.type}`,
              start: new Date(d),
              end: new Date(d),
              allDay: true,
              employeeId: request.employee_id,
              accepted: request.accepted,
              taken: request.taken,
            });
          }
        });

        setRequests(events);
      })
      .catch(err => console.error('Error fetching requests:', err));
  }, [employee_id]);

  const eventStyleGetter = (event) => {
    const backgroundColor = event.employeeId === employee_id ? '#155ff4' : '#050f38';
    const style = {
      backgroundColor,
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '5px',
      fontWeight: '300',
      fontSize: '0.75em',
    };
    return { style };
  };

  // Custom event component
  const Event = ({ event }) => {
    return (
      <div className="event">
        <span className="event-title">{event.title}</span>
        <span className="event-type">{event.type}</span>
        <div className="dots">
          <div className={`dot ${event.accepted ? 'filled' : ''}`}></div>
          <div className={`dot ${event.taken ? 'filled' : ''}`}></div>
        </div>
      </div>
    );
  };

  return (
    <div className='request-calendar'>
      <Calendar
        localizer={localizer}
        events={requests}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, width: '1000px' }} // Set a fixed width
        eventPropGetter={eventStyleGetter}
        views={['month']}
        components={{
          event: Event, // Use custom event component
        }}
      />
    </div>
  );
}

export default RequestsCalendar;

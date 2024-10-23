import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './RequestsCalendar.css';

const localizer = momentLocalizer(moment);

function RequestsCalendar({ employee_id, onEventSelect }) {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch('/requests-info')
      .then(response => response.json())
      .then(data => {
        const events = [];

        data.forEach(request => {
          const startDate = new Date(request.start_date);
          const endDate = new Date(request.end_date);
          for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
            events.push({
              name: request.name,
              type: request.type,
              start: new Date(d),
              end: new Date(d),
              allDay: true,
              employeeId: request.employee_id,
              accepted: request.accepted,
              decided: request.decided,
              cancelled: request.cancelled,
              taken: request.taken,
              requestId: request.request_id, // Add request_id
              details: request, // Store the entire request for the popup
            });
          }
        });

        setRequests(events);
      })
      .catch(err => console.error('Error fetching requests:', err));
  }, [employee_id]);

  const eventStyleGetter = (event) => {
    const backgroundColor = event.employeeId === employee_id ? '#155ff4' : '#050f38';
    return {
      style: {
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
      },
    };
  };

  // Custom event component
  const Event = ({ event }) => {
    return (
      <div className="event">
        <span className="event-title">{event.name}</span>
        <span className="event-type">{event.type}</span>
        <div className="dots">
          <div className={`dot ${event.decided ? 'yellow' : 'grey'}`}></div>
          <div className={`dot ${event.decided ? (event.accepted ? 'green' : 'red') : 'grey'}`}></div>
          <div className={`dot ${event.taken ? 'green' : (event.cancelled ? 'red' : 'grey')}`}></div>
        </div>
      </div>
    );
  };


  return (
    <div className='paddings request-calendar'>
      <Calendar
        localizer={localizer}
        events={requests}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, width: '77rem' }}
        eventPropGetter={eventStyleGetter}
        views={['month', 'work_week']}
        components={{ event: Event }}
        onSelectEvent={(event) => onEventSelect(event.details)} // Pass the entire request to the handler
      />
    </div>
  );
}

export default RequestsCalendar;

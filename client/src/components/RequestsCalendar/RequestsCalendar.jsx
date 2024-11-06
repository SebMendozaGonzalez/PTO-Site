import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './RequestsCalendar.css';

const localizer = momentLocalizer(moment);

function RequestsCalendar({ employee_id, filterLeaderEmail, onEventSelect }) {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const url = `/requests-info${filterLeaderEmail ? `?leader_email=${encodeURIComponent(filterLeaderEmail)}` : ''}`;
        const response = await fetch(url);
        const data = await response.json();

        const events = data.map(request => {
          const startDate = new Date(request.start_date);
          const endDate = new Date(request.end_date);
          return {
            ...request,
            start: startDate,
            end: endDate,
            allDay: true,
            employeeId: request.employee_id,
            details: request,
          };
        });

        setRequests(events);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, [employee_id, filterLeaderEmail]);

  const eventStyleGetter = (event) => {
    const backgroundColor = event.employeeId === employee_id ? '#0b49c5' : '#050f38';
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

  const Event = ({ event }) => (
    <div className="event">
      <span className="event-title">{event.name}</span>
      <div className="right-side">
        <span className="event-type">{event.type}</span>
        <div className="dots">
          <div className={`dot ${event.decided ? (event.accepted ? 'green' : 'red') : 'grey'}`}></div>
          <div className={`dot ${event.taken ? 'green' : (event.cancelled ? 'red' : 'grey')}`}></div>
        </div>
      </div>
    </div>
  );

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
        onSelectEvent={(event) => onEventSelect(event.details)}
      />
    </div>
  );
}

export default RequestsCalendar;

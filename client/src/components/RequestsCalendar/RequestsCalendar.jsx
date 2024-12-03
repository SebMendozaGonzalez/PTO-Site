import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Dots from '../Dots/Dots';
import CalendarFilter from '../CalendarFilter/CalendarFilter';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './RequestsCalendar.css';

const localizer = momentLocalizer(moment);

const RequestsCalendar = ({ employee_id, onEventSelect, filterLeaderEmail }) => {
  const [filteredRequests, setFilteredRequests] = useState([]);

  const eventStyleGetter = event => {
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
        <div>
          <Dots requestDetails={event} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="paddings request-calendar">
      <CalendarFilter
        employee_id={employee_id}
        filterLeaderEmail={filterLeaderEmail}
        onFilterChange={setFilteredRequests}
      />
      <Calendar
        localizer={localizer}
        events={filteredRequests}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 700, width: '77rem' }}
        eventPropGetter={eventStyleGetter}
        views={['month', 'work_week']}
        components={{
          event: Event,
        }}
        showAllEvents={true}
        onSelectEvent={event => onEventSelect(event.details)}
      />
    </div>
  );
};

export default RequestsCalendar;

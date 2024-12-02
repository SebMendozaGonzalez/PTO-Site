import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Dots from '../Dots/Dots';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './RequestsCalendar.css';

const localizer = momentLocalizer(moment);

const typeMapping = {
  'Paid Time Off': 'PTO',
  'Maternity License': 'ML',
  'Paternity License': 'PL',
  'Domestic Calamity License': 'DCL',
  'Bereavement License': 'BL',
  'Unpaid Time Off': 'UTO',
  'Inability': 'Ina',
};

function RequestsCalendar({ employee_id, onEventSelect, filterLeaderEmail }) {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        let employeeIds = null;

        // Step 1: Fetch employees under the leader (if filterLeaderEmail is provided)
        if (filterLeaderEmail) {
          const employeeResponse = await fetch(`/employees-by-leader/${filterLeaderEmail}`);
          const employees = await employeeResponse.json();
          employeeIds = employees.map(emp => emp.employee_id);
        }

        // Step 2: Fetch all requests
        const requestsResponse = await fetch('/requests-info');
        const requestsData = await requestsResponse.json();

        // Step 3: Filter requests if employeeIds is available
        const filteredData = employeeIds
          ? requestsData.filter(request => employeeIds.includes(request.employee_id))
          : requestsData;

        // Step 4: Map requests to calendar events
        const events = [];
        filteredData.forEach(request => {
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
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, [employee_id, filterLeaderEmail]);

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
      <Calendar
        localizer={localizer}
        events={requests}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 700, width: '77rem' }}
        eventPropGetter={eventStyleGetter}
        views={['month', 'day']}
        components={{
          event: Event,
        }}
        showAllEvents={true}
        onSelectEvent={event => onEventSelect(event.details)}
      />
    </div>
  );
}

export default RequestsCalendar;

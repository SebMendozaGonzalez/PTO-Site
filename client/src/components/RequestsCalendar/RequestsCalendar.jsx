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
        // Fetch all requests
        const response = await fetch('/requests-info');
        const requestData = await response.json();

        // Filter requests by leader email, if provided
        const filteredRequests = requestData.filter(request =>
          !filterLeaderEmail || request.leader_email?.includes(filterLeaderEmail)
        );

        // Fetch employee info for each request and merge the data
        const requestsWithEmployeeInfo = await Promise.all(
          filteredRequests.map(async request => {
            const employeeResponse = await fetch(`/employee-info/${request.employee_id}`);
            const employeeData = await employeeResponse.json();

            // Merge employee data into the request
            const employeeInfo = employeeData.length > 0 ? employeeData[0] : {};
            return {
              ...request,
              name: employeeInfo.name || request.name,
              leader_email: employeeInfo.leader_email || request.leader_email,
              department: employeeInfo.department || 'Unknown',
            };
          })
        );

        // Convert merged data into calendar events
        const events = [];
        requestsWithEmployeeInfo.forEach(request => {
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
              leaderEmail: request.leader_email,
              department: request.department,
              details: request,
            });
          }
        });

        setRequests(events);
      } catch (err) {
        console.error('Error fetching requests:', err);
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
        showAllEvents={true} // Enable scrollable date cells
        onSelectEvent={event => onEventSelect(event.details)}
      />
    </div>
  );
}

export default RequestsCalendar;

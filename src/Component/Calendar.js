import React, { useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

function Calendar() {
  const calendarRef = useRef(null);

  const fetchEvents = async (info, successCallback, failureCallback) => {
    const ghlApiKey = localStorage.getItem('ghlApiKey');
    const apiUrl = `https://rest.gohighlevel.com/v1/appointments/?startDate=1718971796000&endDate=1721879830000&userId=YtnIKZvb8yvCjzfZZS59&calendarId=FuhywKPvwBZdKT6dYUbT&teamId=YtnIKZvb8yvCjzfZZS59&includeAll=true`;

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ghlApiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      const events = data.appointments.map(appointment => ({
        id: appointment.id,
        title: appointment.title,
        start: appointment.start_time,
        end: appointment.end_time,
      }));

      successCallback(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      failureCallback(error);
    }
  };

  const renderEventContent = (eventInfo) => {
    const start = new Date(eventInfo.event.start).toLocaleTimeString();
    const end = new Date(eventInfo.event.end).toLocaleTimeString();
    return (
      <div className="event-content" style={{ color: 'black' }}>
      <div>{start} - {end}</div>
      <div>{eventInfo.event.title}</div>
    </div>
    );
  };

  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.getApi().refetchEvents();
    }
  }, []);

  return (
    <div className='fs-14'> 
      <FullCalendar
        ref={calendarRef}
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={(info, successCallback, failureCallback) => {
          fetchEvents(info, successCallback, failureCallback);
        }}
        eventContent={renderEventContent}
        dayMaxEvents={2} 
        moreLinkContent={(arg) => ` More Appointments +${arg.num} `} 
        moreLinkClick={(arg) => {
          arg.jsEvent.preventDefault(); 
          // console.log('Clicked "more" link:', arg);
        }}
      />
    </div>
  );
}

export default Calendar;

import React from 'react';
import { Calendar, mockAppointments } from './dist/index.esm.js';
import './src/styles.css';

// Simple test component to verify the library works
function TestCalendar() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Calendar Module Test</h1>
      <Calendar
        appointments={mockAppointments}
        config={{
          view: 'month',
          startOfWeek: 1,
          timeFormat: '12h',
        }}
        eventHandlers={{
          onAppointmentClick: (appointment) => {
            console.log('Appointment clicked:', appointment);
          },
          onDateClick: (date) => {
            console.log('Date clicked:', date);
          },
        }}
      />
    </div>
  );
}

export default TestCalendar;

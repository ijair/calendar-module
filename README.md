# Medical Calendar Module

A reusable React calendar component library for managing medical appointments with TypeScript support and Tailwind CSS styling. Designed specifically for healthcare providers and medical institutions.

## Features

- 📅 Multiple calendar views (Month, Week, Day, Agenda)
- 🏥 Medical appointment creation and editing forms
- 🖥️ Online telemedicine appointment support
- 🎨 Beautiful UI with Tailwind CSS 3
- 📱 Responsive design
- 🔧 TypeScript support with full type definitions
- 🧪 Mock medical data included for testing
- ⚡ Optimized performance with React hooks
- 🎯 Flexible configuration options
- 📊 Medical status and priority management
- 👨‍⚕️ Doctor and patient information management
- 💊 Prescription and diagnosis tracking
- 🔄 Follow-up appointment scheduling

## Installation

```bash
npm install @ijair/calendar-module
```

## Quick Start

```tsx
import React, { useState } from 'react';
import { Calendar, AppointmentForm, mockAppointments } from '@ijair/calendar-module';
import '@ijair/calendar-module/dist/styles.css';

function App() {
  const [appointments, setAppointments] = useState(mockAppointments);
  const [showForm, setShowForm] = useState(false);

  const handleAppointmentCreate = (data) => {
    const newAppointment = {
      ...data,
      id: `apt-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setAppointments(prev => [...prev, newAppointment]);
    setShowForm(false);
  };

  return (
    <div className="p-4">
      <Calendar
        appointments={appointments}
        config={{
          view: 'month',
          startOfWeek: 1, // Monday
          timeFormat: '12h',
          showWeekends: true,
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
      
      {showForm && (
        <AppointmentForm
          onSubmit={handleAppointmentCreate}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
```

## Components

### Calendar

The main calendar component that displays appointments in different views.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `appointments` | `Appointment[]` | - | Array of appointments to display |
| `config` | `Partial<CalendarConfig>` | - | Calendar configuration options |
| `eventHandlers` | `CalendarEventHandlers` | - | Event handler functions |
| `className` | `string` | - | Additional CSS classes |
| `loading` | `boolean` | `false` | Loading state |
| `error` | `string \| null` | `null` | Error message |

#### Calendar Configuration

```tsx
interface CalendarConfig {
  view: CalendarView; // 'month' | 'week' | 'day' | 'agenda'
  startOfWeek: number; // 0 = Sunday, 1 = Monday
  timeFormat: '12h' | '24h';
  showWeekends: boolean;
  businessHours: {
    start: string; // 'HH:mm' format
    end: string; // 'HH:mm' format
    days: number[]; // 0-6 (Sunday-Saturday)
  };
  timezone: string;
}
```

#### Event Handlers

```tsx
interface CalendarEventHandlers {
  onAppointmentClick?: (appointment: Appointment) => void;
  onAppointmentDoubleClick?: (appointment: Appointment) => void;
  onDateClick?: (date: Date) => void;
  onDateSelect?: (startDate: Date, endDate: Date) => void;
  onViewChange?: (view: CalendarView) => void;
  onAppointmentCreate?: (data: AppointmentFormData) => void;
  onAppointmentUpdate?: (appointment: Appointment) => void;
  onAppointmentDelete?: (appointmentId: string) => void;
}
```

### AppointmentForm

A form component for creating and editing appointments.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `appointment` | `Appointment \| null` | - | Appointment to edit (null for new) |
| `onSubmit` | `(data: AppointmentFormData) => void` | - | Submit handler |
| `onCancel` | `() => void` | - | Cancel handler |
| `loading` | `boolean` | `false` | Loading state |
| `className` | `string` | - | Additional CSS classes |
| `defaultDate` | `Date` | `new Date()` | Default date for new appointments |
| `defaultStartTime` | `string` | `'09:00'` | Default start time |
| `defaultEndTime` | `string` | `'10:00'` | Default end time |

## Types

### Appointment

```tsx
interface Appointment {
  id: string;
  title: string;
  description?: string;
  startTime: string; // ISO 8601 format
  endTime: string; // ISO 8601 format
  status: AppointmentStatus;
  priority: AppointmentPriority;
  clientId?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  location?: string;
  notes?: string;
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
  metadata?: Record<string, any>;
}
```

### Appointment Status

```tsx
enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled',
}
```

### Appointment Priority

```tsx
enum AppointmentPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}
```

## Examples

### Basic Usage

```tsx
import { Calendar, mockAppointments } from '@your-org/calendar-module';

function BasicCalendar() {
  return (
    <Calendar
      appointments={mockAppointments}
      config={{
        view: 'month',
        startOfWeek: 1,
        timeFormat: '12h',
      }}
    />
  );
}
```

### With Event Handlers

```tsx
import { Calendar, AppointmentForm } from '@your-org/calendar-module';

function InteractiveCalendar() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowForm(true);
  };

  const handleDateClick = (date) => {
    // Create new appointment for selected date
    setSelectedAppointment(null);
    setShowForm(true);
  };

  const handleAppointmentSubmit = (data) => {
    if (selectedAppointment) {
      // Update existing appointment
      setAppointments(prev => 
        prev.map(apt => apt.id === selectedAppointment.id ? { ...apt, ...data } : apt)
      );
    } else {
      // Create new appointment
      const newAppointment = {
        ...data,
        id: `apt-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setAppointments(prev => [...prev, newAppointment]);
    }
    setShowForm(false);
  };

  return (
    <div>
      <Calendar
        appointments={appointments}
        eventHandlers={{
          onAppointmentClick: handleAppointmentClick,
          onDateClick: handleDateClick,
        }}
      />
      
      {showForm && (
        <AppointmentForm
          appointment={selectedAppointment}
          onSubmit={handleAppointmentSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
```

### API Integration

```tsx
import { Calendar, ApiResponse, Appointment } from '@your-org/calendar-module';

function ApiIntegratedCalendar() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/appointments');
        const data: ApiResponse<Appointment[]> = await response.json();
        
        if (data.success) {
          setAppointments(data.data);
        } else {
          setError(data.message || 'Failed to fetch appointments');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <Calendar
      appointments={appointments}
      loading={loading}
      error={error}
      eventHandlers={{
        onAppointmentCreate: async (data) => {
          try {
            const response = await fetch('/api/appointments', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });
            const result = await response.json();
            if (result.success) {
              setAppointments(prev => [...prev, result.data]);
            }
          } catch (err) {
            console.error('Failed to create appointment:', err);
          }
        },
      }}
    />
  );
}
```

## Styling

The library uses Tailwind CSS 3 for styling. You can customize the appearance by:

1. **Using CSS classes**: Apply custom classes via the `className` prop
2. **Theme customization**: Modify the default theme in your Tailwind config
3. **CSS overrides**: Override specific styles in your application

### Custom Theme Example

```tsx
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
        },
      },
    },
  },
};
```

## Development

### Building the Library

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Type Checking

```bash
npm run type-check
```

## Mock Data

The library includes mock data for testing and development:

```tsx
import { mockAppointments, mockApiResponse } from '@your-org/calendar-module';

// Use mock appointments
const appointments = mockAppointments;

// Use mock API response format
const apiResponse = mockApiResponse;
```

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For issues and questions, please open an issue on the GitHub repository.

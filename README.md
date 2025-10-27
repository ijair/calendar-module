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
- ⚙️ **Configurable enum values** - Use your own statuses, priorities, and types from database
- 🔒 **Moderation system** - Control who can change appointment status
- 👥 **Role-based permissions** - Different access levels for patients, doctors, moderators

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

## Advanced Features

### Configurable Enum Values

The library now supports custom enum values from your database. You can configure your own statuses, priorities, and appointment types:

```tsx
import { Calendar, AppointmentForm, AppointmentEnumConfig } from '@ijair/calendar-module';

// Custom configuration from your database
const customEnumConfig: AppointmentEnumConfig = {
  statuses: [
    { value: 'scheduled', label: 'Scheduled', color: '#3b82f6' },
    { value: 'confirmed', label: 'Confirmed', color: '#10b981' },
    { value: 'pending_review', label: 'Pending Review', color: '#fbbf24' },
    { value: 'approved', label: 'Approved', color: '#059669' },
    // Add your custom statuses here
  ],
  priorities: [
    { value: 'routine', label: 'Routine', color: '#10b981' },
    { value: 'urgent', label: 'Urgent', color: '#f59e0b' },
    { value: 'high_priority', label: 'High Priority', color: '#dc2626' },
    // Add your custom priorities here
  ],
  types: [
    { value: 'consultation', label: 'Consultation' },
    { value: 'surgery', label: 'Surgery' },
    { value: 'therapy', label: 'Therapy Session' },
    // Add your custom types here
  ],
};

// Use in Calendar component
<Calendar
  appointments={appointments}
  enumConfig={customEnumConfig}
  // ... other props
/>

// Use in AppointmentForm component
<AppointmentForm
  enumConfig={customEnumConfig}
  // ... other props
/>
```

### Moderation System

Control who can modify appointment status with the built-in moderation system:

```tsx
import { UserRole } from '@ijair/calendar-module';

// Enable moderation system
<Calendar
  appointments={appointments}
  moderationEnabled={true}
  currentUserRole={UserRole.MODERATOR}
  // ... other props
/>

<AppointmentForm
  moderationEnabled={true}
  currentUserRole={UserRole.MODERATOR}
  allowStatusChange={true}
  // ... other props
/>
```

**User Roles:**
- `PATIENT` - Can create appointments, cannot change status
- `DOCTOR` - Can view and edit appointments, cannot change status
- `MODERATOR` - Can change appointment status (secretary/assistant)
- `ADMIN` - Full access to all features

**Moderation Features:**
- Only moderators can change appointment status
- Automatic tracking of who moderated each appointment
- Moderation notes for audit trail
- Visual indicators for moderated vs unmoderated appointments

## Examples

### Basic Usage

```tsx
import { Calendar, mockAppointments } from '@ijair/calendar-module';

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

### Advanced Usage with Custom Configuration

```tsx
import { 
  Calendar, 
  AppointmentForm, 
  AppointmentEnumConfig, 
  UserRole,
  mockAppointments 
} from '@ijair/calendar-module';

function AdvancedCalendar() {
  const [appointments, setAppointments] = useState(mockAppointments);
  const [currentUserRole, setCurrentUserRole] = useState(UserRole.MODERATOR);

  // Custom enum configuration from your database
  const customEnumConfig: AppointmentEnumConfig = {
    statuses: [
      { value: 'scheduled', label: 'Scheduled', color: '#3b82f6' },
      { value: 'confirmed', label: 'Confirmed', color: '#10b981' },
      { value: 'pending_review', label: 'Pending Review', color: '#fbbf24' },
      { value: 'approved', label: 'Approved', color: '#059669' },
      { value: 'rejected', label: 'Rejected', color: '#dc2626' },
    ],
    priorities: [
      { value: 'routine', label: 'Routine', color: '#10b981' },
      { value: 'urgent', label: 'Urgent', color: '#f59e0b' },
      { value: 'high_priority', label: 'High Priority', color: '#dc2626' },
    ],
    types: [
      { value: 'consultation', label: 'Consultation' },
      { value: 'surgery', label: 'Surgery' },
      { value: 'therapy', label: 'Therapy Session' },
      { value: 'vaccination', label: 'Vaccination' },
    ],
  };

  return (
    <div>
      {/* User Role Selector */}
      <select 
        value={currentUserRole} 
        onChange={(e) => setCurrentUserRole(e.target.value as UserRole)}
      >
        <option value={UserRole.PATIENT}>Patient</option>
        <option value={UserRole.DOCTOR}>Doctor</option>
        <option value={UserRole.MODERATOR}>Moderator</option>
        <option value={UserRole.ADMIN}>Admin</option>
      </select>

      {/* Calendar with custom configuration */}
      <Calendar
        appointments={appointments}
        enumConfig={customEnumConfig}
        moderationEnabled={true}
        currentUserRole={currentUserRole}
        eventHandlers={{
          onAppointmentClick: (appointment) => console.log('Clicked:', appointment),
          onDateClick: (date) => console.log('Date clicked:', date),
        }}
      />

      {/* Form with custom configuration */}
      <AppointmentForm
        enumConfig={customEnumConfig}
        moderationEnabled={true}
        currentUserRole={currentUserRole}
        onSubmit={(data) => console.log('Form submitted:', data)}
        onCancel={() => console.log('Form cancelled')}
      />
    </div>
  );
}
```

### With Event Handlers

```tsx
import { Calendar, AppointmentForm } from '@ijair/calendar-module';

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
import { Calendar, ApiResponse, Appointment } from '@ijair/calendar-module';

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
import { mockAppointments, mockApiResponse } from '@ijair/calendar-module';

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

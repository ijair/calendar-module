# Calendar Module - Installation & Usage Guide

## Project Overview

This is a complete React calendar library built with TypeScript and Tailwind CSS 3. The library provides a comprehensive calendar component for managing appointments with the following features:

- 📅 Multiple calendar views (Month, Week, Day, Agenda)
- 📝 Appointment creation and editing forms
- 🎨 Beautiful UI with Tailwind CSS 3
- 📱 Responsive design
- 🔧 Full TypeScript support
- 🧪 Mock data included for testing
- ⚡ Optimized performance
- 🎯 Flexible configuration options

## Project Structure

```
calendar-module/
├── src/
│   ├── components/
│   │   ├── Calendar.tsx          # Main calendar component
│   │   └── AppointmentForm.tsx   # Appointment form component
│   ├── types/
│   │   └── index.ts              # TypeScript type definitions
│   ├── utils/
│   │   ├── dateUtils.ts          # Date utility functions
│   │   └── classNames.ts         # CSS class utilities
│   ├── mock-data/
│   │   └── appointments.ts       # Mock data for testing
│   ├── styles.css                # Tailwind CSS styles
│   └── index.ts                  # Main export file
├── dist/                         # Built library files
├── example.tsx                   # Complete usage example
├── test.tsx                      # Simple test component
├── package.json                  # Package configuration
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── rollup.config.js              # Build configuration
└── README.md                     # Documentation
```

## Installation Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Library

```bash
npm run build
```

This will create the `dist/` folder with:
- `index.js` - CommonJS build
- `index.esm.js` - ES Module build
- `index.d.ts` - TypeScript declarations
- Source maps for debugging

### 3. Development Commands

```bash
# Build the library
npm run build

# Development mode with watch
npm run dev

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run type-check

# Clean build files
npm run clean
```

## Usage in React Projects

### 1. Install in Your Project

```bash
npm install @your-org/calendar-module
```

### 2. Import and Use

```tsx
import React, { useState } from 'react';
import { Calendar, AppointmentForm, mockAppointments } from '@your-org/calendar-module';
import '@your-org/calendar-module/dist/styles.css';

function App() {
  const [appointments, setAppointments] = useState(mockAppointments);
  const [showForm, setShowForm] = useState(false);

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
          onSubmit={(data) => {
            // Handle appointment creation/update
            console.log('Appointment data:', data);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
```

## API Reference

### Calendar Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `appointments` | `Appointment[]` | - | Array of appointments to display |
| `config` | `Partial<CalendarConfig>` | - | Calendar configuration options |
| `eventHandlers` | `CalendarEventHandlers` | - | Event handler functions |
| `className` | `string` | - | Additional CSS classes |
| `loading` | `boolean` | `false` | Loading state |
| `error` | `string \| null` | `null` | Error message |

### AppointmentForm Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `appointment` | `Appointment \| null` | - | Appointment to edit (null for new) |
| `onSubmit` | `(data: AppointmentFormData) => void` | - | Submit handler |
| `onCancel` | `() => void` | - | Cancel handler |
| `loading` | `boolean` | `false` | Loading state |
| `className` | `string` | - | Additional CSS classes |

## Mock Data

The library includes comprehensive mock data for testing:

```tsx
import { mockAppointments, mockApiResponse } from '@your-org/calendar-module';

// Use mock appointments
const appointments = mockAppointments;

// Use mock API response format
const apiResponse = mockApiResponse;
```

## Configuration Options

### Calendar Configuration

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

### Appointment Data Structure

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

## Styling

The library uses Tailwind CSS 3. You can customize the appearance by:

1. **Using CSS classes**: Apply custom classes via the `className` prop
2. **Theme customization**: Modify the default theme in your Tailwind config
3. **CSS overrides**: Override specific styles in your application

## Testing

### Run the Test Component

```bash
# The test.tsx file demonstrates basic usage
# You can import it in your React project to test the library
```

### Example Integration

See `example.tsx` for a complete example showing:
- Calendar with different views
- Appointment form integration
- Event handling
- Statistics sidebar
- Modal form display

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Next Steps

1. **Customize the theme**: Modify colors and styling in `tailwind.config.js`
2. **Add your own components**: Extend the library with custom components
3. **Integrate with your API**: Use the provided types and mock data as reference
4. **Deploy**: Build and publish to npm for distribution

## Troubleshooting

### Common Issues

1. **Build errors**: Make sure all dependencies are installed
2. **TypeScript errors**: Check that your project has TypeScript configured
3. **Styling issues**: Ensure Tailwind CSS is properly configured in your project
4. **Import errors**: Verify the correct import paths and file extensions

### Getting Help

- Check the `README.md` for detailed documentation
- Review the `example.tsx` for usage patterns
- Examine the mock data structure in `mock-data/appointments.ts`
- Use the TypeScript definitions for type safety

## License

MIT License - Feel free to use in your projects!

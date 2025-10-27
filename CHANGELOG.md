# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2024-10-27

### Added
- **Configurable enum values** - Support for custom statuses, priorities, and appointment types from database
- **Moderation system** - Control who can change appointment status
- **Role-based permissions** - Different access levels for patients, doctors, moderators, and admins
- **UserRole enum** - PATIENT, DOCTOR, MODERATOR, ADMIN roles
- **AppointmentEnumConfig interface** - Configuration for custom enum values
- **ConfigurableOption interface** - Flexible option structure with labels, colors, and disabled states
- **Moderation tracking** - Automatic tracking of who moderated each appointment
- **Moderation notes** - Audit trail for status changes
- **Helper functions** - `getConfigurableOptions()` and `canModifyStatus()` utilities
- **Enhanced form validation** - Role-based field restrictions
- **Advanced example** - Complete example showing configurable values and moderation

### Changed
- **Appointment interface** - Status, priority, and type fields now use strings for flexibility
- **AppointmentFormData interface** - Updated to support string-based enum values
- **CalendarConfig interface** - Added enumConfig, moderationEnabled, and currentUserRole options
- **Form behavior** - Status field disabled for non-moderators when moderation is enabled
- **Mock data** - Added moderation fields to sample appointments

### Features
- Custom statuses from database (e.g., 'pending_review', 'approved', 'rejected')
- Custom priorities (e.g., 'high_priority', 'low_priority')
- Custom appointment types (e.g., 'surgery', 'therapy', 'vaccination')
- Visual indicators for moderated vs unmoderated appointments
- Automatic moderation tracking when status changes
- Role-based UI restrictions and permissions
- Flexible configuration system for different healthcare workflows

## [1.0.0] - 2024-10-27

### Added
- Initial release of Medical Calendar Module
- Complete React calendar component for medical appointments
- TypeScript support with full type definitions
- Tailwind CSS 3 styling
- Multiple calendar views (Month, Week, Day, Agenda)
- Medical appointment form with comprehensive fields
- Telemedicine appointment support with meeting links
- Medical-specific features:
  - Patient information management
  - Doctor and specialty tracking
  - Symptoms, diagnosis, and prescription management
  - Follow-up appointment scheduling
  - Insurance information
- Mock medical data with 7 realistic appointment examples
- Comprehensive documentation and examples
- ESLint configuration for code quality
- Rollup build system for library distribution
- Support for both CommonJS and ES Module builds
- Source maps for debugging
- Responsive design for mobile and desktop

### Features
- Medical appointment statuses: Scheduled, Confirmed, In Progress, Completed, Cancelled, Rescheduled, No Show
- Medical priority levels: Routine, Urgent, Emergency, Follow-up
- Appointment types: Consultation, Follow-up, Emergency, Telemedicine, Lab Results, Prescription Renewal, Preventive Care, Specialist Referral
- Online appointment indicators and meeting links
- Medical statistics dashboard
- Form validation for medical fields
- Accessibility features
- Cross-browser compatibility

### Technical Details
- Built with React 18+ and TypeScript
- Uses date-fns for date manipulation
- Tailwind CSS 3 for styling
- Rollup for bundling
- ESLint for code quality
- PostCSS for CSS processing
- Compatible with modern React applications and Vite

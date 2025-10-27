/**
 * Medical appointment status enumeration
 */
export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled',
  NO_SHOW = 'no_show',
}

/**
 * Medical appointment priority levels
 */
export enum AppointmentPriority {
  ROUTINE = 'routine',
  URGENT = 'urgent',
  EMERGENCY = 'emergency',
  FOLLOW_UP = 'follow_up',
}

/**
 * Medical appointment types
 */
export enum AppointmentType {
  CONSULTATION = 'consultation',
  FOLLOW_UP = 'follow_up',
  EMERGENCY = 'emergency',
  TELEMEDICINE = 'telemedicine',
  LAB_RESULTS = 'lab_results',
  PRESCRIPTION_RENEWAL = 'prescription_renewal',
  PREVENTIVE_CARE = 'preventive_care',
  SPECIALIST_REFERRAL = 'specialist_referral',
}

/**
 * User roles for appointment management
 */
export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
}

/**
 * Configurable option interface for dropdowns
 */
export interface ConfigurableOption {
  value: string;
  label: string;
  description?: string;
  color?: string;
  disabled?: boolean;
}

/**
 * Configuration for appointment enums
 */
export interface AppointmentEnumConfig {
  statuses: ConfigurableOption[];
  priorities: ConfigurableOption[];
  types: ConfigurableOption[];
}

/**
 * Core medical appointment interface
 */
export interface Appointment {
  id: string;
  title: string;
  description?: string;
  startTime: string; // ISO 8601 format
  endTime: string; // ISO 8601 format
  status: string; // Changed to string to support custom values
  priority: string; // Changed to string to support custom values
  type: string; // Changed to string to support custom values
  patientId?: string;
  patientName?: string;
  patientEmail?: string;
  patientPhone?: string;
  patientDateOfBirth?: string; // ISO 8601 format
  patientGender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  doctorId?: string;
  doctorName?: string;
  doctorSpecialty?: string;
  location?: string;
  isOnlineAppointment?: boolean;
  meetingLink?: string;
  meetingPassword?: string;
  symptoms?: string[];
  diagnosis?: string;
  prescription?: string[];
  notes?: string;
  followUpRequired?: boolean;
  followUpDate?: string; // ISO 8601 format
  insuranceProvider?: string;
  insuranceNumber?: string;
  copay?: number;
  // Moderation fields
  isModerated?: boolean;
  moderatedBy?: string; // User ID of moderator
  moderatedAt?: string; // ISO 8601 format
  moderationNotes?: string;
  createdBy?: string; // User ID of creator
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
  metadata?: Record<string, any>;
}

/**
 * Calendar view types
 */
export enum CalendarView {
  MONTH = 'month',
  WEEK = 'week',
  DAY = 'day',
  AGENDA = 'agenda',
}

/**
 * Calendar configuration options
 */
export interface CalendarConfig {
  view: CalendarView;
  startOfWeek: number; // 0 = Sunday, 1 = Monday
  timeFormat: '12h' | '24h';
  showWeekends: boolean;
  businessHours: {
    start: string; // HH:mm format
    end: string; // HH:mm format
    days: number[]; // 0-6 (Sunday-Saturday)
  };
  timezone: string;
  // Configurable enums
  enumConfig?: AppointmentEnumConfig;
  // Moderation settings
  moderationEnabled?: boolean;
  allowStatusChange?: boolean; // Only moderators can change status
  currentUserRole?: UserRole;
}

/**
 * Calendar event handlers
 */
export interface CalendarEventHandlers {
  onAppointmentClick?: (appointment: Appointment) => void;
  onAppointmentDoubleClick?: (appointment: Appointment) => void;
  onDateClick?: (date: Date) => void;
  onDateSelect?: (startDate: Date, endDate: Date) => void;
  onViewChange?: (view: CalendarView) => void;
  onAppointmentCreate?: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onAppointmentUpdate?: (appointment: Appointment) => void;
  onAppointmentDelete?: (appointmentId: string) => void;
}

/**
 * Medical appointment form data interface
 */
export interface AppointmentFormData {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  status: string; // Changed to string to support custom values
  priority: string; // Changed to string to support custom values
  type: string; // Changed to string to support custom values
  patientName?: string;
  patientEmail?: string;
  patientPhone?: string;
  patientDateOfBirth?: string;
  patientGender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  doctorName?: string;
  doctorSpecialty?: string;
  location?: string;
  isOnlineAppointment?: boolean;
  meetingLink?: string;
  meetingPassword?: string;
  symptoms?: string[];
  diagnosis?: string;
  prescription?: string[];
  notes?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  copay?: number;
  // Moderation fields
  isModerated?: boolean;
  moderationNotes?: string;
  metadata?: Record<string, any>;
}

/**
 * API response wrapper interface
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Calendar theme configuration
 */
export interface CalendarTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  hoverColor: string;
  selectedColor: string;
  todayColor: string;
  weekendColor: string;
  appointmentColors: {
    [key in AppointmentStatus]: string;
  };
}

/**
 * Default medical calendar theme
 */
export const defaultTheme: CalendarTheme = {
  primaryColor: '#3b82f6',
  secondaryColor: '#64748b',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  borderColor: '#e5e7eb',
  hoverColor: '#f3f4f6',
  selectedColor: '#dbeafe',
  todayColor: '#fef3c7',
  weekendColor: '#f9fafb',
  appointmentColors: {
    [AppointmentStatus.SCHEDULED]: '#3b82f6',
    [AppointmentStatus.CONFIRMED]: '#10b981',
    [AppointmentStatus.IN_PROGRESS]: '#8b5cf6',
    [AppointmentStatus.COMPLETED]: '#6b7280',
    [AppointmentStatus.CANCELLED]: '#ef4444',
    [AppointmentStatus.RESCHEDULED]: '#f59e0b',
    [AppointmentStatus.NO_SHOW]: '#f97316',
  },
};

/**
 * Default configuration for appointment enums
 */
export const defaultEnumConfig: AppointmentEnumConfig = {
  statuses: [
    { value: AppointmentStatus.SCHEDULED, label: 'Scheduled', color: '#3b82f6' },
    { value: AppointmentStatus.CONFIRMED, label: 'Confirmed', color: '#10b981' },
    { value: AppointmentStatus.IN_PROGRESS, label: 'In Progress', color: '#8b5cf6' },
    { value: AppointmentStatus.COMPLETED, label: 'Completed', color: '#6b7280' },
    { value: AppointmentStatus.CANCELLED, label: 'Cancelled', color: '#ef4444' },
    { value: AppointmentStatus.RESCHEDULED, label: 'Rescheduled', color: '#f59e0b' },
    { value: AppointmentStatus.NO_SHOW, label: 'No Show', color: '#f97316' },
  ],
  priorities: [
    { value: AppointmentPriority.ROUTINE, label: 'Routine', color: '#10b981' },
    { value: AppointmentPriority.URGENT, label: 'Urgent', color: '#f59e0b' },
    { value: AppointmentPriority.EMERGENCY, label: 'Emergency', color: '#ef4444' },
    { value: AppointmentPriority.FOLLOW_UP, label: 'Follow-up', color: '#3b82f6' },
  ],
  types: [
    { value: AppointmentType.CONSULTATION, label: 'Consultation' },
    { value: AppointmentType.FOLLOW_UP, label: 'Follow-up' },
    { value: AppointmentType.EMERGENCY, label: 'Emergency' },
    { value: AppointmentType.TELEMEDICINE, label: 'Telemedicine' },
    { value: AppointmentType.LAB_RESULTS, label: 'Lab Results' },
    { value: AppointmentType.PRESCRIPTION_RENEWAL, label: 'Prescription Renewal' },
    { value: AppointmentType.PREVENTIVE_CARE, label: 'Preventive Care' },
    { value: AppointmentType.SPECIALIST_REFERRAL, label: 'Specialist Referral' },
  ],
};

/**
 * Helper function to get configurable options
 */
export const getConfigurableOptions = (
  config: AppointmentEnumConfig | undefined,
  type: 'statuses' | 'priorities' | 'types'
): ConfigurableOption[] => {
  if (config && config[type]) {
    return config[type];
  }
  return defaultEnumConfig[type];
};

/**
 * Helper function to check if user can modify appointment status
 */
export const canModifyStatus = (
  userRole: UserRole | undefined,
  moderationEnabled: boolean = false
): boolean => {
  if (!moderationEnabled) return true;
  return userRole === UserRole.MODERATOR || userRole === UserRole.ADMIN;
};

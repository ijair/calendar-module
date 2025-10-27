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
 * Core medical appointment interface
 */
export interface Appointment {
  id: string;
  title: string;
  description?: string;
  startTime: string; // ISO 8601 format
  endTime: string; // ISO 8601 format
  status: AppointmentStatus;
  priority: AppointmentPriority;
  type: AppointmentType;
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
  status: AppointmentStatus;
  priority: AppointmentPriority;
  type: AppointmentType;
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

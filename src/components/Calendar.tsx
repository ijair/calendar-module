import React, { useState, useMemo, useCallback } from 'react';
import { format, isSameDay, isSameMonth, isToday } from 'date-fns';
import { 
  Appointment, 
  CalendarView, 
  CalendarConfig, 
  CalendarEventHandlers,
  AppointmentStatus,
  AppointmentPriority,
  AppointmentType,
  AppointmentEnumConfig,
  UserRole,
  getConfigurableOptions,
  canModifyStatus
} from '../types';
import { 
  getMonthDates, 
  getWeekDates, 
  formatDate, 
  formatTime, 
  parseISODate,
  isCurrentMonth,
  isCurrentDay 
} from '../utils/dateUtils';
import { 
  cn, 
  getCalendarDayClasses, 
  getNavigationClasses,
  getAppointmentCardClasses,
  getAppointmentStatusClasses,
  getAppointmentPriorityClasses 
} from '../utils/classNames';

/**
 * Props for the Calendar component
 */
export interface CalendarProps {
  appointments: Appointment[];
  config?: Partial<CalendarConfig>;
  eventHandlers?: CalendarEventHandlers;
  className?: string;
  loading?: boolean;
  error?: string | null;
  // Configuration props
  enumConfig?: AppointmentEnumConfig;
  moderationEnabled?: boolean;
  currentUserRole?: UserRole;
}

/**
 * Main Calendar component
 * Displays appointments in different views (month, week, day, agenda)
 */
export const Calendar: React.FC<CalendarProps> = ({
  appointments,
  config = {},
  eventHandlers = {},
  className,
  loading = false,
  error = null,
  enumConfig,
  moderationEnabled = false,
  currentUserRole,
}) => {
  // Get configurable options
  const statusOptions = getConfigurableOptions(enumConfig, 'statuses');
  const priorityOptions = getConfigurableOptions(enumConfig, 'priorities');
  const typeOptions = getConfigurableOptions(enumConfig, 'types');

  // Default configuration
  const defaultConfig: CalendarConfig = {
    view: CalendarView.MONTH,
    startOfWeek: 1, // Monday
    timeFormat: '12h',
    showWeekends: true,
    businessHours: {
      start: '09:00',
      end: '17:00',
      days: [1, 2, 3, 4, 5], // Monday to Friday
    },
    timezone: 'UTC',
    enumConfig,
    moderationEnabled,
    currentUserRole,
    ...config,
  };

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Get appointments for the current view
  const filteredAppointments = useMemo(() => {
    if (!appointments.length) return [];

    const startDate = new Date(currentDate);
    const endDate = new Date(currentDate);

    switch (defaultConfig.view) {
      case CalendarView.MONTH:
        startDate.setDate(1);
        endDate.setMonth(endDate.getMonth() + 1, 0);
        break;
      case CalendarView.WEEK:
        const weekStart = startDate;
        weekStart.setDate(startDate.getDate() - startDate.getDay() + defaultConfig.startOfWeek);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        startDate.setTime(weekStart.getTime());
        endDate.setTime(weekEnd.getTime());
        break;
      case CalendarView.DAY:
        endDate.setTime(startDate.getTime());
        break;
      default:
        break;
    }

    return appointments.filter(apt => {
      const aptStart = parseISODate(apt.startTime);
      const aptEnd = parseISODate(apt.endTime);
      
      if (!aptStart || !aptEnd) return false;
      
      return aptStart <= endDate && aptEnd >= startDate;
    });
  }, [appointments, currentDate, defaultConfig.view, defaultConfig.startOfWeek]);

  // Get dates for current view
  const viewDates = useMemo(() => {
    switch (defaultConfig.view) {
      case CalendarView.MONTH:
        return getMonthDates(currentDate, defaultConfig.startOfWeek);
      case CalendarView.WEEK:
        return getWeekDates(currentDate, defaultConfig.startOfWeek);
      case CalendarView.DAY:
        return [currentDate];
      default:
        return [];
    }
  }, [currentDate, defaultConfig.view, defaultConfig.startOfWeek]);

  // Get appointments for a specific date
  const getAppointmentsForDate = useCallback((date: Date) => {
    return filteredAppointments.filter(apt => {
      const aptStart = parseISODate(apt.startTime);
      const aptEnd = parseISODate(apt.endTime);
      
      if (!aptStart || !aptEnd) return false;
      
      return isSameDay(aptStart, date) || 
             (aptStart < date && aptEnd > date) ||
             isSameDay(aptEnd, date);
    });
  }, [filteredAppointments]);

  // Handle date click
  const handleDateClick = useCallback((date: Date) => {
    setSelectedDate(date);
    eventHandlers.onDateClick?.(date);
  }, [eventHandlers]);

  // Handle appointment click
  const handleAppointmentClick = useCallback((appointment: Appointment) => {
    setSelectedAppointment(appointment);
    eventHandlers.onAppointmentClick?.(appointment);
  }, [eventHandlers]);

  // Handle appointment double click
  const handleAppointmentDoubleClick = useCallback((appointment: Appointment) => {
    eventHandlers.onAppointmentDoubleClick?.(appointment);
  }, [eventHandlers]);

  // Navigation handlers
  const handlePrevious = useCallback(() => {
    const newDate = new Date(currentDate);
    switch (defaultConfig.view) {
      case CalendarView.MONTH:
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case CalendarView.WEEK:
        newDate.setDate(newDate.getDate() - 7);
        break;
      case CalendarView.DAY:
        newDate.setDate(newDate.getDate() - 1);
        break;
    }
    setCurrentDate(newDate);
  }, [currentDate, defaultConfig.view]);

  const handleNext = useCallback(() => {
    const newDate = new Date(currentDate);
    switch (defaultConfig.view) {
      case CalendarView.MONTH:
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case CalendarView.WEEK:
        newDate.setDate(newDate.getDate() + 7);
        break;
      case CalendarView.DAY:
        newDate.setDate(newDate.getDate() + 1);
        break;
    }
    setCurrentDate(newDate);
  }, [currentDate, defaultConfig.view]);

  const handleToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  // Render month view
  const renderMonthView = () => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const adjustedWeekDays = [
      ...weekDays.slice(defaultConfig.startOfWeek),
      ...weekDays.slice(0, defaultConfig.startOfWeek)
    ];

    return (
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {/* Week day headers */}
        {adjustedWeekDays.map((day) => (
          <div key={day} className="bg-gray-50 px-3 py-2 text-center text-sm font-medium text-gray-700">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {viewDates.map((date, index) => {
          const dayAppointments = getAppointmentsForDate(date);
          const isCurrentMonthDay = isCurrentMonth(date, currentDate);
          const isTodayDate = isCurrentDay(date);
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;

          return (
            <div
              key={index}
              className={cn(
                'bg-white min-h-[120px] p-2 cursor-pointer transition-colors',
                'hover:bg-gray-50',
                {
                  'bg-gray-50': !isCurrentMonthDay,
                  'bg-blue-50': isSelected,
                  'bg-yellow-50': isTodayDate && !isSelected,
                }
              )}
              onClick={() => handleDateClick(date)}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={cn(
                  'text-sm font-medium',
                  {
                    'text-gray-400': !isCurrentMonthDay,
                    'text-blue-600': isSelected,
                    'text-yellow-600': isTodayDate && !isSelected,
                    'text-gray-500': isWeekend && isCurrentMonthDay,
                  }
                )}>
                  {date.getDate()}
                </span>
                {dayAppointments.length > 0 && (
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
              </div>
              
              {/* Appointments for this day */}
              <div className="space-y-1">
                {dayAppointments.slice(0, 3).map((appointment) => (
                  <div
                    key={appointment.id}
                    className={cn(
                      'text-xs p-1 rounded truncate cursor-pointer',
                      'hover:bg-blue-100 transition-colors',
                      getAppointmentStatusClasses(appointment.status)
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAppointmentClick(appointment);
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      handleAppointmentDoubleClick(appointment);
                    }}
                  >
                    {formatTime(parseISODate(appointment.startTime)!, defaultConfig.timeFormat === '24h')} {appointment.title}
                  </div>
                ))}
                {dayAppointments.length > 3 && (
                  <div className="text-xs text-gray-500">
                    +{dayAppointments.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render week view
  const renderWeekView = () => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const adjustedWeekDays = [
      ...weekDays.slice(defaultConfig.startOfWeek),
      ...weekDays.slice(0, defaultConfig.startOfWeek)
    ];

    return (
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {/* Week day headers */}
        {adjustedWeekDays.map((day, index) => (
          <div key={day} className="bg-gray-50 px-3 py-2 text-center text-sm font-medium text-gray-700">
            <div>{day}</div>
            <div className="text-xs text-gray-500">
              {format(viewDates[index], 'MMM dd')}
            </div>
          </div>
        ))}
        
        {/* Week days content */}
        {viewDates.map((date, index) => {
          const dayAppointments = getAppointmentsForDate(date);
          const isTodayDate = isCurrentDay(date);
          const isSelected = selectedDate && isSameDay(date, selectedDate);

          return (
            <div
              key={index}
              className={cn(
                'bg-white min-h-[400px] p-2 cursor-pointer transition-colors',
                'hover:bg-gray-50',
                {
                  'bg-blue-50': isSelected,
                  'bg-yellow-50': isTodayDate && !isSelected,
                }
              )}
              onClick={() => handleDateClick(date)}
            >
              <div className="space-y-2">
                {dayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className={cn(
                      'p-2 rounded border-l-4 cursor-pointer transition-colors',
                      'hover:shadow-sm',
                      getAppointmentCardClasses(appointment.status, appointment.priority)
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAppointmentClick(appointment);
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      handleAppointmentDoubleClick(appointment);
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{appointment.title}</span>
                      <div className={getAppointmentPriorityClasses(appointment.priority)}></div>
                    </div>
                    <div className="text-xs text-gray-600">
                      {formatTime(parseISODate(appointment.startTime)!, defaultConfig.timeFormat === '24h')} - 
                      {formatTime(parseISODate(appointment.endTime)!, defaultConfig.timeFormat === '24h')}
                    </div>
                    {appointment.location && (
                      <div className="text-xs text-gray-500 truncate">
                        📍 {appointment.location}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render day view
  const renderDayView = () => {
    const dayAppointments = getAppointmentsForDate(currentDate);
    const isTodayDate = isCurrentDay(currentDate);

    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className={cn(
          'p-4 border-b',
          {
            'bg-yellow-50': isTodayDate,
            'bg-white': !isTodayDate,
          }
        )}>
          <h3 className="text-lg font-semibold text-gray-900">
            {formatDate(currentDate, 'EEEE, MMMM dd, yyyy')}
          </h3>
          <p className="text-sm text-gray-600">
            {dayAppointments.length} appointment{dayAppointments.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="p-4">
          {dayAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No appointments scheduled for this day
            </div>
          ) : (
            <div className="space-y-3">
              {dayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className={cn(
                    'p-4 rounded-lg border cursor-pointer transition-all',
                    'hover:shadow-md',
                    getAppointmentCardClasses(appointment.status, appointment.priority)
                  )}
                  onClick={() => handleAppointmentClick(appointment)}
                  onDoubleClick={() => handleAppointmentDoubleClick(appointment)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">
                        {appointment.title}
                      </h4>
                      {appointment.description && (
                        <p className="text-sm text-gray-600 mb-2">
                          {appointment.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={getAppointmentPriorityClasses(appointment.priority)}></div>
                      <span className={getAppointmentStatusClasses(appointment.status)}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Time:</span>
                      <div className="text-gray-600">
                        {formatTime(parseISODate(appointment.startTime)!, defaultConfig.timeFormat === '24h')} - 
                        {formatTime(parseISODate(appointment.endTime)!, defaultConfig.timeFormat === '24h')}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Type:</span>
                      <div className="text-gray-600 capitalize">{appointment.type?.replace('_', ' ')}</div>
                    </div>
                    {appointment.patientName && (
                      <div>
                        <span className="font-medium text-gray-700">Patient:</span>
                        <div className="text-gray-600">{appointment.patientName}</div>
                      </div>
                    )}
                    {appointment.doctorName && (
                      <div>
                        <span className="font-medium text-gray-700">Doctor:</span>
                        <div className="text-gray-600">{appointment.doctorName}</div>
                      </div>
                    )}
                    {appointment.location && (
                      <div>
                        <span className="font-medium text-gray-700">Location:</span>
                        <div className="text-gray-600">
                          {appointment.isOnlineAppointment ? '🖥️ ' : '🏥 '}
                          {appointment.location}
                        </div>
                      </div>
                    )}
                    {appointment.meetingLink && (
                      <div>
                        <span className="font-medium text-gray-700">Meeting Link:</span>
                        <div className="text-blue-600">
                          <a href={appointment.meetingLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            Join Meeting
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Medical Information */}
                  {appointment.symptoms && appointment.symptoms.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <span className="font-medium text-gray-700">Symptoms:</span>
                      <div className="text-sm text-gray-600 mt-1">
                        {appointment.symptoms.join(', ')}
                      </div>
                    </div>
                  )}
                  
                  {appointment.diagnosis && (
                    <div className="mt-3 pt-3 border-t">
                      <span className="font-medium text-gray-700">Diagnosis:</span>
                      <div className="text-sm text-gray-600 mt-1">{appointment.diagnosis}</div>
                    </div>
                  )}
                  
                  {appointment.prescription && appointment.prescription.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <span className="font-medium text-gray-700">Prescription:</span>
                      <div className="text-sm text-gray-600 mt-1">
                        {appointment.prescription.join(', ')}
                      </div>
                    </div>
                  )}
                  
                  {appointment.followUpRequired && (
                    <div className="mt-3 pt-3 border-t">
                      <span className="font-medium text-gray-700">Follow-up Required:</span>
                      <div className="text-sm text-gray-600 mt-1">
                        {appointment.followUpDate ? 
                          `Scheduled for ${formatDate(parseISODate(appointment.followUpDate)!, 'MMM dd, yyyy')}` : 
                          'Date to be determined'
                        }
                      </div>
                    </div>
                  )}
                  
                  {appointment.notes && (
                    <div className="mt-3 pt-3 border-t">
                      <span className="font-medium text-gray-700">Notes:</span>
                      <div className="text-sm text-gray-600 mt-1">{appointment.notes}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render agenda view
  const renderAgendaView = () => {
    const sortedAppointments = [...filteredAppointments].sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    return (
      <div className="space-y-4">
        {sortedAppointments.map((appointment) => {
          const startDate = parseISODate(appointment.startTime);
          const endDate = parseISODate(appointment.endTime);
          
          if (!startDate || !endDate) return null;

          return (
            <div
              key={appointment.id}
              className={cn(
                'p-4 rounded-lg border cursor-pointer transition-all',
                'hover:shadow-md',
                getAppointmentCardClasses(appointment.status, appointment.priority)
              )}
              onClick={() => handleAppointmentClick(appointment)}
              onDoubleClick={() => handleAppointmentDoubleClick(appointment)}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="text-sm font-medium text-gray-900">
                    {formatDate(startDate, 'MMM dd')}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatTime(startDate, defaultConfig.timeFormat === '24h')}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-lg font-semibold text-gray-900 truncate">
                      {appointment.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <div className={getAppointmentPriorityClasses(appointment.priority)}></div>
                      <span className={getAppointmentStatusClasses(appointment.status)}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                  
                  {appointment.description && (
                    <p className="text-sm text-gray-600 mb-2">{appointment.description}</p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>
                      {formatTime(startDate, defaultConfig.timeFormat === '24h')} - 
                      {formatTime(endDate, defaultConfig.timeFormat === '24h')}
                    </span>
                    <span className="capitalize">{appointment.type?.replace('_', ' ')}</span>
                    {appointment.location && (
                      <span>
                        {appointment.isOnlineAppointment ? '🖥️' : '🏥'} {appointment.location}
                      </span>
                    )}
                    {appointment.patientName && (
                      <span>👤 {appointment.patientName}</span>
                    )}
                    {appointment.doctorName && (
                      <span>👨‍⚕️ {appointment.doctorName}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {sortedAppointments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No appointments found for the selected period
          </div>
        )}
      </div>
    );
  };

  // Render loading state
  if (loading) {
    return (
      <div className={cn('flex items-center justify-center h-64', className)}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading appointments...</span>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className={cn('flex items-center justify-center h-64', className)}>
        <div className="text-center">
          <div className="text-red-600 mb-2">⚠️ Error loading appointments</div>
          <div className="text-sm text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('calendar-container', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {formatDate(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevious}
              className={getNavigationClasses()}
            >
              ←
            </button>
            <button
              onClick={handleToday}
              className={getNavigationClasses()}
            >
              Today
            </button>
            <button
              onClick={handleNext}
              className={getNavigationClasses()}
            >
              →
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="calendar-content">
        {defaultConfig.view === CalendarView.MONTH && renderMonthView()}
        {defaultConfig.view === CalendarView.WEEK && renderWeekView()}
        {defaultConfig.view === CalendarView.DAY && renderDayView()}
        {defaultConfig.view === CalendarView.AGENDA && renderAgendaView()}
      </div>
    </div>
  );
};

export default Calendar;

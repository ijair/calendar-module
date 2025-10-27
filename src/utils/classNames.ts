import { clsx, type ClassValue } from 'clsx';

/**
 * Utility function to combine CSS classes
 * Uses clsx for conditional class handling
 */
export const cn = (...inputs: ClassValue[]) => {
  return clsx(inputs);
};

/**
 * Generate CSS classes for medical appointment status
 */
export const getAppointmentStatusClasses = (status: string) => {
  const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
  
  switch (status) {
    case 'scheduled':
      return cn(baseClasses, 'bg-blue-100 text-blue-800');
    case 'confirmed':
      return cn(baseClasses, 'bg-green-100 text-green-800');
    case 'in_progress':
      return cn(baseClasses, 'bg-purple-100 text-purple-800');
    case 'completed':
      return cn(baseClasses, 'bg-gray-100 text-gray-800');
    case 'cancelled':
      return cn(baseClasses, 'bg-red-100 text-red-800');
    case 'rescheduled':
      return cn(baseClasses, 'bg-yellow-100 text-yellow-800');
    case 'no_show':
      return cn(baseClasses, 'bg-orange-100 text-orange-800');
    default:
      return cn(baseClasses, 'bg-gray-100 text-gray-800');
  }
};

/**
 * Generate CSS classes for medical appointment priority
 */
export const getAppointmentPriorityClasses = (priority: string) => {
  const baseClasses = 'w-2 h-2 rounded-full';
  
  switch (priority) {
    case 'emergency':
      return cn(baseClasses, 'bg-red-500');
    case 'urgent':
      return cn(baseClasses, 'bg-orange-500');
    case 'follow_up':
      return cn(baseClasses, 'bg-blue-500');
    case 'routine':
      return cn(baseClasses, 'bg-green-500');
    default:
      return cn(baseClasses, 'bg-gray-500');
  }
};

/**
 * Generate CSS classes for calendar day states
 */
export const getCalendarDayClasses = (
  date: Date,
  currentMonth: Date,
  isSelected: boolean = false,
  isToday: boolean = false,
  isWeekend: boolean = false,
  hasAppointments: boolean = false
) => {
  return cn(
    'relative flex h-10 w-10 items-center justify-center text-sm transition-colors',
    'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    {
      'text-gray-400': !isSameMonth(date, currentMonth),
      'text-gray-900': isSameMonth(date, currentMonth) && !isToday && !isSelected,
      'bg-blue-600 text-white': isSelected,
      'bg-yellow-100 text-yellow-900 font-semibold': isToday && !isSelected,
      'text-gray-500': isWeekend && isSameMonth(date, currentMonth),
      'bg-blue-50': hasAppointments && !isSelected && !isToday,
    }
  );
};

/**
 * Generate CSS classes for calendar navigation
 */
export const getNavigationClasses = (disabled: boolean = false) => {
  return cn(
    'inline-flex items-center justify-center rounded-md text-sm font-medium',
    'transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    {
      'bg-white text-gray-900 hover:bg-gray-50 border border-gray-300': !disabled,
      'bg-gray-100 text-gray-400 cursor-not-allowed': disabled,
    }
  );
};

/**
 * Generate CSS classes for appointment cards
 */
export const getAppointmentCardClasses = (
  status: string,
  priority: string,
  isSelected: boolean = false
) => {
  return cn(
    'relative rounded-lg border p-3 shadow-sm transition-all',
    'hover:shadow-md cursor-pointer',
    {
      'border-blue-200 bg-blue-50': isSelected,
      'border-gray-200 bg-white': !isSelected,
      'border-l-4 border-l-blue-500': status === 'scheduled',
      'border-l-4 border-l-green-500': status === 'confirmed',
      'border-l-4 border-l-gray-500': status === 'completed',
      'border-l-4 border-l-red-500': status === 'cancelled',
      'border-l-4 border-l-yellow-500': status === 'rescheduled',
    }
  );
};

/**
 * Generate CSS classes for form inputs
 */
export const getInputClasses = (hasError: boolean = false) => {
  return cn(
    'block w-full rounded-md border px-3 py-2 text-sm',
    'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    {
      'border-gray-300': !hasError,
      'border-red-300 focus:border-red-500 focus:ring-red-500': hasError,
    }
  );
};

/**
 * Generate CSS classes for buttons
 */
export const getButtonClasses = (
  variant: 'primary' | 'secondary' | 'danger' | 'ghost' = 'primary',
  size: 'sm' | 'md' | 'lg' = 'md',
  disabled: boolean = false
) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  return cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    { 'opacity-50 cursor-not-allowed': disabled }
  );
};

// Helper function to check if date is in same month (imported from date-fns)
const isSameMonth = (date1: Date, date2: Date) => {
  return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
};

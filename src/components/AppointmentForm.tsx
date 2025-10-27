import React, { useState, useEffect } from 'react';
import { format, addHours, addMinutes } from 'date-fns';
import { 
  AppointmentFormData, 
  AppointmentStatus, 
  AppointmentPriority,
  AppointmentType,
  Appointment,
  AppointmentEnumConfig,
  UserRole,
  getConfigurableOptions,
  canModifyStatus
} from '../types';
import { cn, getInputClasses, getButtonClasses } from '../utils/classNames';

/**
 * Props for the AppointmentForm component
 */
export interface AppointmentFormProps {
  appointment?: Appointment | null;
  onSubmit: (data: AppointmentFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  className?: string;
  defaultDate?: Date;
  defaultStartTime?: string;
  defaultEndTime?: string;
  // Configuration props
  enumConfig?: AppointmentEnumConfig;
  moderationEnabled?: boolean;
  currentUserRole?: UserRole;
  allowStatusChange?: boolean;
}

/**
 * AppointmentForm component for creating and editing appointments
 */
export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  appointment,
  onSubmit,
  onCancel,
  loading = false,
  className,
  defaultDate = new Date(),
  defaultStartTime = '09:00',
  defaultEndTime = '10:00',
  enumConfig,
  moderationEnabled = false,
  currentUserRole,
  allowStatusChange = true,
}) => {
  // Get configurable options
  const statusOptions = getConfigurableOptions(enumConfig, 'statuses');
  const priorityOptions = getConfigurableOptions(enumConfig, 'priorities');
  const typeOptions = getConfigurableOptions(enumConfig, 'types');
  
  // Check if user can modify status
  const canModifyAppointmentStatus = canModifyStatus(currentUserRole, moderationEnabled) && allowStatusChange;

  const [formData, setFormData] = useState<AppointmentFormData>({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    status: statusOptions[0]?.value || AppointmentStatus.SCHEDULED,
    priority: priorityOptions[0]?.value || AppointmentPriority.ROUTINE,
    type: typeOptions[0]?.value || AppointmentType.CONSULTATION,
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    patientDateOfBirth: '',
    patientGender: 'prefer_not_to_say',
    doctorName: '',
    doctorSpecialty: '',
    location: '',
    isOnlineAppointment: false,
    meetingLink: '',
    meetingPassword: '',
    symptoms: [],
    diagnosis: '',
    prescription: [],
    notes: '',
    followUpRequired: false,
    followUpDate: '',
    insuranceProvider: '',
    insuranceNumber: '',
    copay: 0,
    metadata: {},
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data
  useEffect(() => {
    if (appointment) {
      setFormData({
        title: appointment.title,
        description: appointment.description || '',
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        status: appointment.status,
        priority: appointment.priority,
        type: appointment.type,
        patientName: appointment.patientName || '',
        patientEmail: appointment.patientEmail || '',
        patientPhone: appointment.patientPhone || '',
        patientDateOfBirth: appointment.patientDateOfBirth || '',
        patientGender: appointment.patientGender || 'prefer_not_to_say',
        doctorName: appointment.doctorName || '',
        doctorSpecialty: appointment.doctorSpecialty || '',
        location: appointment.location || '',
        isOnlineAppointment: appointment.isOnlineAppointment || false,
        meetingLink: appointment.meetingLink || '',
        meetingPassword: appointment.meetingPassword || '',
        symptoms: appointment.symptoms || [],
        diagnosis: appointment.diagnosis || '',
        prescription: appointment.prescription || [],
        notes: appointment.notes || '',
        followUpRequired: appointment.followUpRequired || false,
        followUpDate: appointment.followUpDate || '',
        insuranceProvider: appointment.insuranceProvider || '',
        insuranceNumber: appointment.insuranceNumber || '',
        copay: appointment.copay || 0,
        metadata: appointment.metadata || {},
      });
    } else {
      // Set default times based on provided defaults
      const startDateTime = new Date(defaultDate);
      const [startHour, startMinute] = defaultStartTime.split(':').map(Number);
      startDateTime.setHours(startHour, startMinute, 0, 0);

      const endDateTime = new Date(defaultDate);
      const [endHour, endMinute] = defaultEndTime.split(':').map(Number);
      endDateTime.setHours(endHour, endMinute, 0, 0);

      setFormData(prev => ({
        ...prev,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
      }));
    }
  }, [appointment, defaultDate, defaultStartTime, defaultEndTime]);

  // Handle input changes
  const handleInputChange = (field: keyof AppointmentFormData, value: string | AppointmentStatus | AppointmentPriority | AppointmentType | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  // Handle datetime input changes
  const handleDateTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    const date = new Date(value);
    if (isNaN(date.getTime())) return;
    
    setFormData(prev => ({
      ...prev,
      [field]: date.toISOString(),
    }));
    
    // Auto-adjust end time if it's before start time
    if (field === 'startTime') {
      const startDate = new Date(value);
      const endDate = new Date(formData.endTime);
      
      if (endDate <= startDate) {
        const newEndDate = addHours(startDate, 1);
        setFormData(prev => ({
          ...prev,
          endTime: newEndDate.toISOString(),
        }));
      }
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (formData.startTime && formData.endTime) {
      const startDate = new Date(formData.startTime);
      const endDate = new Date(formData.endTime);
      
      if (endDate <= startDate) {
        newErrors.endTime = 'End time must be after start time';
      }
    }

    if (formData.patientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.patientEmail)) {
      newErrors.patientEmail = 'Please enter a valid email address';
    }

    if (formData.patientPhone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.patientPhone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.patientPhone = 'Please enter a valid phone number';
    }

    if (formData.isOnlineAppointment && !formData.meetingLink) {
      newErrors.meetingLink = 'Meeting link is required for online appointments';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  // Quick time presets
  const timePresets = [
    { label: '1 hour', hours: 1 },
    { label: '2 hours', hours: 2 },
    { label: '30 minutes', minutes: 30 },
    { label: '1.5 hours', hours: 1, minutes: 30 },
  ];

  const applyTimePreset = (preset: typeof timePresets[0]) => {
    const startDate = new Date(formData.startTime);
    let endDate = new Date(startDate);
    
    if (preset.hours) {
      endDate = addHours(endDate, preset.hours);
    }
    if (preset.minutes) {
      endDate = addMinutes(endDate, preset.minutes);
    }
    
    setFormData(prev => ({
      ...prev,
      endTime: endDate.toISOString(),
    }));
  };

  return (
    <div className={cn('appointment-form', className)}>
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {appointment ? 'Edit Appointment' : 'Create New Appointment'}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={getInputClasses(!!errors.title)}
                placeholder="Enter appointment title"
                disabled={loading}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={getInputClasses(!!errors.description)}
                placeholder="Enter appointment description"
                rows={3}
                disabled={loading}
              />
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                Start Time *
              </label>
              <input
                type="datetime-local"
                id="startTime"
                value={formData.startTime ? format(new Date(formData.startTime), "yyyy-MM-dd'T'HH:mm") : ''}
                onChange={(e) => handleDateTimeChange('startTime', e.target.value)}
                className={getInputClasses(!!errors.startTime)}
                disabled={loading}
              />
              {errors.startTime && (
                <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                End Time *
              </label>
              <div className="space-y-2">
                <input
                  type="datetime-local"
                  id="endTime"
                  value={formData.endTime ? format(new Date(formData.endTime), "yyyy-MM-dd'T'HH:mm") : ''}
                  onChange={(e) => handleDateTimeChange('endTime', e.target.value)}
                  className={getInputClasses(!!errors.endTime)}
                  disabled={loading}
                />
                {errors.endTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>
                )}
                
                {/* Quick time presets */}
                <div className="flex flex-wrap gap-2">
                  {timePresets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => applyTimePreset(preset)}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      disabled={loading}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Status, Priority and Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className={getInputClasses()}
                disabled={loading || !canModifyAppointmentStatus}
              >
                {statusOptions.map((option) => (
                  <option 
                    key={option.value} 
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
              {moderationEnabled && !canModifyAppointmentStatus && (
                <p className="mt-1 text-xs text-gray-500">
                  Only moderators can change appointment status
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className={getInputClasses()}
                disabled={loading}
              >
                {priorityOptions.map((option) => (
                  <option 
                    key={option.value} 
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Appointment Type
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className={getInputClasses()}
                disabled={loading}
              >
                {typeOptions.map((option) => (
                  <option 
                    key={option.value} 
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Patient Information */}
          <div className="border-t pt-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Patient Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-1">
                  Patient Name
                </label>
                <input
                  type="text"
                  id="patientName"
                  value={formData.patientName}
                  onChange={(e) => handleInputChange('patientName', e.target.value)}
                  className={getInputClasses()}
                  placeholder="Enter patient name"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label htmlFor="patientEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Patient Email
                </label>
                <input
                  type="email"
                  id="patientEmail"
                  value={formData.patientEmail}
                  onChange={(e) => handleInputChange('patientEmail', e.target.value)}
                  className={getInputClasses(!!errors.patientEmail)}
                  placeholder="Enter patient email"
                  disabled={loading}
                />
                {errors.patientEmail && (
                  <p className="mt-1 text-sm text-red-600">{errors.patientEmail}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="patientPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Patient Phone
                </label>
                <input
                  type="tel"
                  id="patientPhone"
                  value={formData.patientPhone}
                  onChange={(e) => handleInputChange('patientPhone', e.target.value)}
                  className={getInputClasses(!!errors.patientPhone)}
                  placeholder="Enter patient phone"
                  disabled={loading}
                />
                {errors.patientPhone && (
                  <p className="mt-1 text-sm text-red-600">{errors.patientPhone}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="patientDateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="patientDateOfBirth"
                  value={formData.patientDateOfBirth}
                  onChange={(e) => handleInputChange('patientDateOfBirth', e.target.value)}
                  className={getInputClasses()}
                  disabled={loading}
                />
              </div>
              
              <div>
                <label htmlFor="patientGender" className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  id="patientGender"
                  value={formData.patientGender}
                  onChange={(e) => handleInputChange('patientGender', e.target.value as any)}
                  className={getInputClasses()}
                  disabled={loading}
                >
                  <option value="prefer_not_to_say">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="border-t pt-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Medical Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="doctorName" className="block text-sm font-medium text-gray-700 mb-1">
                  Doctor Name
                </label>
                <input
                  type="text"
                  id="doctorName"
                  value={formData.doctorName}
                  onChange={(e) => handleInputChange('doctorName', e.target.value)}
                  className={getInputClasses()}
                  placeholder="Enter doctor name"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label htmlFor="doctorSpecialty" className="block text-sm font-medium text-gray-700 mb-1">
                  Doctor Specialty
                </label>
                <input
                  type="text"
                  id="doctorSpecialty"
                  value={formData.doctorSpecialty}
                  onChange={(e) => handleInputChange('doctorSpecialty', e.target.value)}
                  className={getInputClasses()}
                  placeholder="Enter doctor specialty"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={getInputClasses()}
                  placeholder="Enter appointment location"
                  disabled={loading}
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isOnlineAppointment}
                    onChange={(e) => handleInputChange('isOnlineAppointment', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={loading}
                  />
                  <span className="ml-2 text-sm text-gray-700">Online Appointment</span>
                </label>
              </div>
              
              {formData.isOnlineAppointment && (
                <>
                  <div>
                    <label htmlFor="meetingLink" className="block text-sm font-medium text-gray-700 mb-1">
                      Meeting Link
                    </label>
                    <input
                      type="url"
                      id="meetingLink"
                      value={formData.meetingLink}
                      onChange={(e) => handleInputChange('meetingLink', e.target.value)}
                      className={getInputClasses(!!errors.meetingLink)}
                      placeholder="https://meet.example.com/room-123"
                      disabled={loading}
                    />
                    {errors.meetingLink && (
                      <p className="mt-1 text-sm text-red-600">{errors.meetingLink}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="meetingPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Meeting Password
                    </label>
                    <input
                      type="text"
                      id="meetingPassword"
                      value={formData.meetingPassword}
                      onChange={(e) => handleInputChange('meetingPassword', e.target.value)}
                      className={getInputClasses()}
                      placeholder="Enter meeting password"
                      disabled={loading}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="border-t pt-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Additional Information</h4>
            <div className="space-y-6">
              <div>
                <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-1">
                  Symptoms
                </label>
                <input
                  type="text"
                  id="symptoms"
                  value={formData.symptoms?.join(', ') || ''}
                  onChange={(e) => handleInputChange('symptoms', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                  className={getInputClasses()}
                  placeholder="Enter symptoms separated by commas"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-1">
                  Diagnosis
                </label>
                <input
                  type="text"
                  id="diagnosis"
                  value={formData.diagnosis}
                  onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                  className={getInputClasses()}
                  placeholder="Enter diagnosis"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label htmlFor="prescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Prescription
                </label>
                <input
                  type="text"
                  id="prescription"
                  value={formData.prescription?.join(', ') || ''}
                  onChange={(e) => handleInputChange('prescription', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                  className={getInputClasses()}
                  placeholder="Enter prescriptions separated by commas"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className={getInputClasses()}
                  placeholder="Enter any additional notes"
                  rows={3}
                  disabled={loading}
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.followUpRequired}
                    onChange={(e) => handleInputChange('followUpRequired', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={loading}
                  />
                  <span className="ml-2 text-sm text-gray-700">Follow-up Required</span>
                </label>
              </div>
              
              {formData.followUpRequired && (
                <div>
                  <label htmlFor="followUpDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Follow-up Date
                  </label>
                  <input
                    type="datetime-local"
                    id="followUpDate"
                    value={formData.followUpDate ? format(new Date(formData.followUpDate), "yyyy-MM-dd'T'HH:mm") : ''}
                    onChange={(e) => handleInputChange('followUpDate', e.target.value)}
                    className={getInputClasses()}
                    disabled={loading}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Moderation Section */}
          {moderationEnabled && canModifyAppointmentStatus && (
            <div className="border-t pt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Moderation</h4>
              <div>
                <label htmlFor="moderationNotes" className="block text-sm font-medium text-gray-700 mb-1">
                  Moderation Notes
                </label>
                <textarea
                  id="moderationNotes"
                  value={formData.moderationNotes || ''}
                  onChange={(e) => handleInputChange('moderationNotes', e.target.value)}
                  className={getInputClasses()}
                  placeholder="Add notes about status changes or moderation decisions"
                  rows={3}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className={getButtonClasses('secondary', 'md', loading)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={getButtonClasses('primary', 'md', loading)}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {appointment ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                appointment ? 'Update Appointment' : 'Create Appointment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;

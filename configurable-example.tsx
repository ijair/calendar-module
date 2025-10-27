import React, { useState } from 'react';
import { 
  Calendar, 
  AppointmentForm, 
  mockAppointments,
  Appointment,
  AppointmentFormData,
  CalendarView,
  AppointmentEnumConfig,
  UserRole,
  defaultEnumConfig
} from './src/index';
import './src/styles.css';

/**
 * Example showing configurable enum values and moderation system
 */
function ConfigurableCalendarExample() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [showForm, setShowForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [currentView, setCurrentView] = useState<CalendarView>(CalendarView.MONTH);
  const [loading, setLoading] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(UserRole.MODERATOR);

  // Custom configuration for appointment enums
  const customEnumConfig: AppointmentEnumConfig = {
    statuses: [
      { value: 'scheduled', label: 'Scheduled', color: '#3b82f6' },
      { value: 'confirmed', label: 'Confirmed', color: '#10b981' },
      { value: 'in_progress', label: 'In Progress', color: '#8b5cf6' },
      { value: 'completed', label: 'Completed', color: '#6b7280' },
      { value: 'cancelled', label: 'Cancelled', color: '#ef4444' },
      { value: 'rescheduled', label: 'Rescheduled', color: '#f59e0b' },
      { value: 'no_show', label: 'No Show', color: '#f97316' },
      // Custom statuses from database
      { value: 'pending_review', label: 'Pending Review', color: '#fbbf24' },
      { value: 'approved', label: 'Approved', color: '#059669' },
      { value: 'rejected', label: 'Rejected', color: '#dc2626' },
    ],
    priorities: [
      { value: 'routine', label: 'Routine', color: '#10b981' },
      { value: 'urgent', label: 'Urgent', color: '#f59e0b' },
      { value: 'emergency', label: 'Emergency', color: '#ef4444' },
      { value: 'follow_up', label: 'Follow-up', color: '#3b82f6' },
      // Custom priorities
      { value: 'high_priority', label: 'High Priority', color: '#dc2626' },
      { value: 'low_priority', label: 'Low Priority', color: '#6b7280' },
    ],
    types: [
      { value: 'consultation', label: 'Consultation' },
      { value: 'follow_up', label: 'Follow-up' },
      { value: 'emergency', label: 'Emergency' },
      { value: 'telemedicine', label: 'Telemedicine' },
      { value: 'lab_results', label: 'Lab Results' },
      { value: 'prescription_renewal', label: 'Prescription Renewal' },
      { value: 'preventive_care', label: 'Preventive Care' },
      { value: 'specialist_referral', label: 'Specialist Referral' },
      // Custom types from database
      { value: 'surgery', label: 'Surgery' },
      { value: 'therapy', label: 'Therapy Session' },
      { value: 'vaccination', label: 'Vaccination' },
      { value: 'checkup', label: 'Regular Checkup' },
    ],
  };

  // Handle appointment creation/update
  const handleAppointmentSubmit = async (data: AppointmentFormData) => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (selectedAppointment) {
      // Update existing appointment
      const updatedAppointment: Appointment = {
        ...selectedAppointment,
        ...data,
        updatedAt: new Date().toISOString(),
        // Add moderation info if status was changed
        isModerated: data.status !== selectedAppointment.status ? true : selectedAppointment.isModerated,
        moderatedBy: data.status !== selectedAppointment.status ? 'current-user-id' : selectedAppointment.moderatedBy,
        moderatedAt: data.status !== selectedAppointment.status ? new Date().toISOString() : selectedAppointment.moderatedAt,
      };
      
      setAppointments(prev => 
        prev.map(apt => apt.id === selectedAppointment.id ? updatedAppointment : apt)
      );
    } else {
      // Create new appointment
      const newAppointment: Appointment = {
        ...data,
        id: `apt-${Date.now()}`,
        createdBy: 'current-user-id',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isModerated: false, // New appointments need moderation
      };
      
      setAppointments(prev => [...prev, newAppointment]);
    }
    
    setLoading(false);
    setShowForm(false);
    setSelectedAppointment(null);
  };

  // Handle appointment click
  const handleAppointmentClick = (appointment: Appointment) => {
    console.log('Appointment clicked:', appointment);
    setSelectedAppointment(appointment);
    setShowForm(true);
  };

  // Handle date click
  const handleDateClick = (date: Date) => {
    console.log('Date clicked:', date);
    setSelectedAppointment(null);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Configurable Medical Calendar</h1>
              <p className="text-sm text-gray-600">Example with custom enum values and moderation system</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* User Role Selector */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">User Role:</label>
                <select
                  value={currentUserRole}
                  onChange={(e) => setCurrentUserRole(e.target.value as UserRole)}
                  className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={UserRole.PATIENT}>Patient</option>
                  <option value={UserRole.DOCTOR}>Doctor</option>
                  <option value={UserRole.MODERATOR}>Moderator</option>
                  <option value={UserRole.ADMIN}>Admin</option>
                </select>
              </div>
              
              {/* View Selector */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">View:</label>
                <select
                  value={currentView}
                  onChange={(e) => setCurrentView(e.target.value as CalendarView)}
                  className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={CalendarView.MONTH}>Month</option>
                  <option value={CalendarView.WEEK}>Week</option>
                  <option value={CalendarView.DAY}>Day</option>
                  <option value={CalendarView.AGENDA}>Agenda</option>
                </select>
              </div>
              
              {/* Add Appointment Button */}
              <button
                onClick={() => {
                  setSelectedAppointment(null);
                  setShowForm(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add Appointment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <Calendar
              appointments={appointments}
              config={{
                view: currentView,
                startOfWeek: 1, // Monday
                timeFormat: '12h',
                showWeekends: true,
                businessHours: {
                  start: '09:00',
                  end: '17:00',
                  days: [1, 2, 3, 4, 5], // Monday to Friday
                },
                timezone: 'UTC',
              }}
              enumConfig={customEnumConfig}
              moderationEnabled={true}
              currentUserRole={currentUserRole}
              eventHandlers={{
                onAppointmentClick: handleAppointmentClick,
                onDateClick: handleDateClick,
              }}
              className="bg-white rounded-lg shadow-sm"
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration Info</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600">Current User Role</div>
                  <div className="text-lg font-semibold text-blue-600 capitalize">
                    {currentUserRole}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600">Moderation Enabled</div>
                  <div className="text-lg font-semibold text-green-600">Yes</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600">Custom Statuses</div>
                  <div className="text-lg font-semibold text-purple-600">
                    {customEnumConfig.statuses.length}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600">Custom Priorities</div>
                  <div className="text-lg font-semibold text-orange-600">
                    {customEnumConfig.priorities.length}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600">Custom Types</div>
                  <div className="text-lg font-semibold text-indigo-600">
                    {customEnumConfig.types.length}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <h4 className="text-md font-medium text-gray-900 mb-3">Features</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>✅ Configurable enum values</div>
                  <div>✅ Moderation system</div>
                  <div>✅ Role-based permissions</div>
                  <div>✅ Custom statuses from database</div>
                  <div>✅ Status change restrictions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <AppointmentForm
              appointment={selectedAppointment}
              onSubmit={handleAppointmentSubmit}
              onCancel={() => {
                setShowForm(false);
                setSelectedAppointment(null);
              }}
              loading={loading}
              defaultDate={new Date()}
              defaultStartTime="09:00"
              defaultEndTime="10:00"
              enumConfig={customEnumConfig}
              moderationEnabled={true}
              currentUserRole={currentUserRole}
              allowStatusChange={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ConfigurableCalendarExample;

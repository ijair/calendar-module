import React, { useState } from 'react';
import { 
  Calendar, 
  AppointmentForm, 
  mockAppointments,
  Appointment,
  AppointmentFormData,
  CalendarView,
  AppointmentStatus,
  AppointmentPriority 
} from './src/index';
import './src/styles.css';

/**
 * Example usage of the Medical Calendar Module
 * This demonstrates how to integrate the medical calendar into a healthcare application
 */
function MedicalCalendarExample() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [showForm, setShowForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [currentView, setCurrentView] = useState<CalendarView>(CalendarView.MONTH);
  const [loading, setLoading] = useState(false);

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
      };
      
      setAppointments(prev => 
        prev.map(apt => apt.id === selectedAppointment.id ? updatedAppointment : apt)
      );
    } else {
      // Create new appointment
      const newAppointment: Appointment = {
        ...data,
        id: `apt-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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

  // Handle appointment double click
  const handleAppointmentDoubleClick = (appointment: Appointment) => {
    console.log('Appointment double clicked:', appointment);
    // Could open a detailed view or quick edit
  };

  // Handle view change
  const handleViewChange = (view: CalendarView) => {
    setCurrentView(view);
  };

  // Handle appointment deletion
  const handleAppointmentDelete = (appointmentId: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Medical Calendar Module Example</h1>
              <p className="text-sm text-gray-600">A demonstration of the medical calendar library for healthcare providers</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* View Selector */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">View:</label>
                <select
                  value={currentView}
                  onChange={(e) => handleViewChange(e.target.value as CalendarView)}
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
              eventHandlers={{
                onAppointmentClick: handleAppointmentClick,
                onAppointmentDoubleClick: handleAppointmentDoubleClick,
                onDateClick: handleDateClick,
                onViewChange: handleViewChange,
                onAppointmentDelete: handleAppointmentDelete,
              }}
              className="bg-white rounded-lg shadow-sm"
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Statistics</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600">Total Appointments</div>
                  <div className="text-2xl font-bold text-gray-900">{appointments.length}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600">Telemedicine</div>
                  <div className="text-lg font-semibold text-blue-600">
                    {appointments.filter(apt => apt.isOnlineAppointment).length}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600">Confirmed</div>
                  <div className="text-lg font-semibold text-green-600">
                    {appointments.filter(apt => apt.status === AppointmentStatus.CONFIRMED).length}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600">Completed</div>
                  <div className="text-lg font-semibold text-gray-600">
                    {appointments.filter(apt => apt.status === AppointmentStatus.COMPLETED).length}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600">Emergency/Urgent</div>
                  <div className="text-lg font-semibold text-red-600">
                    {appointments.filter(apt => apt.priority === AppointmentPriority.EMERGENCY || apt.priority === AppointmentPriority.URGENT).length}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600">Follow-up Required</div>
                  <div className="text-lg font-semibold text-orange-600">
                    {appointments.filter(apt => apt.followUpRequired).length}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <h4 className="text-md font-medium text-gray-900 mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setSelectedAppointment(null);
                      setShowForm(true);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    + New Medical Appointment
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAppointment(null);
                      setShowForm(true);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-md transition-colors"
                  >
                    🖥️ Schedule Telemedicine
                  </button>
                  <button
                    onClick={() => {
                      // Reset to mock data
                      setAppointments(mockAppointments);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    Reset to Mock Data
                  </button>
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
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MedicalCalendarExample;

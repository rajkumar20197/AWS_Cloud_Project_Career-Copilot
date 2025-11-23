import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Plus, CheckCircle } from 'lucide-react';

export default function CalendarIntegration() {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventType, setEventType] = useState<'interview' | 'deadline' | 'networking' | null>(null);

  const handleConnectCalendar = async () => {
    setLoading(true);
    try {
      // Get OAuth URL from backend
      const response = await fetch('/api/google/auth', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const { authUrl } = await response.json();

      // Redirect to Google OAuth
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error connecting calendar:', error);
      alert('Failed to connect calendar');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleInterview = async (formData: any) => {
    try {
      const tokens = JSON.parse(localStorage.getItem('googleTokens') || '{}');

      const response = await fetch('/api/google/calendar/interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          tokens,
          ...formData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert('Interview prep session scheduled!');
        setShowEventForm(false);
      }
    } catch (error) {
      console.error('Error scheduling interview:', error);
      alert('Failed to schedule interview');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendar Integration</h1>
        <p className="text-gray-600">
          Connect your Google Calendar to schedule interview prep, deadlines, and networking events.
        </p>
      </div>

      {/* Connection Status */}
      {!isConnected ? (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <Calendar className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Connect Your Google Calendar</h2>
          <p className="text-gray-600 mb-6">
            Automatically schedule interview prep sessions, application deadlines, and networking
            events directly to your calendar.
          </p>

          <button
            onClick={handleConnectCalendar}
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Connecting...' : 'Connect Google Calendar'}
          </button>

          <div className="mt-8 grid md:grid-cols-3 gap-6 text-left">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Interview Prep</h3>
                <p className="text-sm text-gray-600">
                  Schedule prep sessions before interviews
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Deadlines</h3>
                <p className="text-sm text-gray-600">Never miss an application deadline</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Networking</h3>
                <p className="text-sm text-gray-600">Track career fairs and events</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Connected State */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center">
            <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
            <div>
              <p className="font-semibold text-green-900">Calendar Connected</p>
              <p className="text-sm text-green-700">
                You can now schedule events directly to your Google Calendar
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => {
                setEventType('interview');
                setShowEventForm(true);
              }}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all text-left"
            >
              <Clock className="w-8 h-8 text-red-500 mb-3" />
              <h3 className="font-semibold mb-2">Schedule Interview Prep</h3>
              <p className="text-sm text-gray-600">Prepare for upcoming interviews</p>
            </button>

            <button
              onClick={() => {
                setEventType('deadline');
                setShowEventForm(true);
              }}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all text-left"
            >
              <Calendar className="w-8 h-8 text-yellow-500 mb-3" />
              <h3 className="font-semibold mb-2">Set Application Deadline</h3>
              <p className="text-sm text-gray-600">Never miss a deadline</p>
            </button>

            <button
              onClick={() => {
                setEventType('networking');
                setShowEventForm(true);
              }}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all text-left"
            >
              <Users className="w-8 h-8 text-green-500 mb-3" />
              <h3 className="font-semibold mb-2">Add Networking Event</h3>
              <p className="text-sm text-gray-600">Track career fairs and meetups</p>
            </button>
          </div>

          {/* Event Form Modal */}
          {showEventForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-md w-full p-6">
                <h2 className="text-2xl font-bold mb-4">
                  {eventType === 'interview' && 'Schedule Interview Prep'}
                  {eventType === 'deadline' && 'Set Application Deadline'}
                  {eventType === 'networking' && 'Add Networking Event'}
                </h2>

                {/* Form fields would go here */}
                <p className="text-gray-600 mb-4">Form implementation coming soon...</p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowEventForm(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600">
                    Schedule
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

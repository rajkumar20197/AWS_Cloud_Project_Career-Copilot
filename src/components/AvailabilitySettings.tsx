/**
 * Availability Settings Component
 * Let students configure their AI scheduling preferences
 */

import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Settings, Bot, Save, AlertCircle } from 'lucide-react';
import availabilityAgent from '../services/availabilityAgent';

const AvailabilitySettings = () => {
  const [preferences, setPreferences] = useState({
    workingHours: { start: '09:00', end: '17:00' },
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    bufferTime: 30,
    maxInterviewsPerDay: 3,
    unavailableDays: [],
    preferredDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    autoResponseEnabled: true,
    responseDelay: 15, // minutes before responding
    requireConfirmation: false // for high-priority companies
  });

  const [agentStatus, setAgentStatus] = useState(false);
  const [saved, setSaved] = useState(false);

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  useEffect(() => {
    // Load saved preferences
    loadPreferences();
  }, []);

  const loadPreferences = () => {
    const saved = localStorage.getItem('availabilityPreferences');
    if (saved) {
      setPreferences(JSON.parse(saved));
    }
  };

  const savePreferences = () => {
    localStorage.setItem('availabilityPreferences', JSON.stringify(preferences));
    availabilityAgent.updatePreferences(preferences);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleAgent = () => {
    if (agentStatus) {
      availabilityAgent.stopMonitoring();
      setAgentStatus(false);
    } else {
      availabilityAgent.startMonitoring();
      setAgentStatus(true);
    }
  };

  const handleDayToggle = (day, isPreferred) => {
    if (isPreferred) {
      setPreferences(prev => ({
        ...prev,
        preferredDays: prev.preferredDays.includes(day) 
          ? prev.preferredDays.filter(d => d !== day)
          : [...prev.preferredDays, day],
        unavailableDays: prev.unavailableDays.filter(d => d !== day)
      }));
    } else {
      setPreferences(prev => ({
        ...prev,
        unavailableDays: prev.unavailableDays.includes(day)
          ? prev.unavailableDays.filter(d => d !== day)
          : [...prev.unavailableDays, day],
        preferredDays: prev.preferredDays.filter(d => d !== day)
      }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Bot className="h-6 w-6 mr-2 text-blue-600" />
              AI Availability Agent
            </h1>
            <p className="text-gray-600 mt-1">
              Automatically respond to interview scheduling emails based on your calendar
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`flex items-center px-3 py-2 rounded-full text-sm font-medium ${
              agentStatus 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                agentStatus ? 'bg-green-500' : 'bg-gray-400'
              }`}></div>
              {agentStatus ? 'Active' : 'Inactive'}
            </div>
            
            <button
              onClick={toggleAgent}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                agentStatus
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {agentStatus ? 'Stop Agent' : 'Start Agent'}
            </button>
          </div>
        </div>
      </div>

      {/* Working Hours */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Working Hours
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Time
            </label>
            <input
              type="time"
              value={preferences.workingHours.start}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                workingHours: { ...prev.workingHours, start: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Time
            </label>
            <input
              type="time"
              value={preferences.workingHours.end}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                workingHours: { ...prev.workingHours, end: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Zone
            </label>
            <select
              value={preferences.timeZone}
              onChange={(e) => setPreferences(prev => ({ ...prev, timeZone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Available Days */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Available Days
        </h2>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Select your preferred days for interviews. You can mark days as preferred or unavailable.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {daysOfWeek.map(day => (
              <div key={day.key} className="text-center">
                <div className="font-medium text-gray-700 mb-2 capitalize">
                  {day.label}
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={() => handleDayToggle(day.key, true)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      preferences.preferredDays.includes(day.key)
                        ? 'bg-green-100 text-green-800 border-2 border-green-300'
                        : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                    }`}
                  >
                    Preferred
                  </button>
                  
                  <button
                    onClick={() => handleDayToggle(day.key, false)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      preferences.unavailableDays.includes(day.key)
                        ? 'bg-red-100 text-red-800 border-2 border-red-300'
                        : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                    }`}
                  >
                    Unavailable
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interview Limits */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Interview Limits
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Interviews Per Day
            </label>
            <select
              value={preferences.maxInterviewsPerDay}
              onChange={(e) => setPreferences(prev => ({ 
                ...prev, 
                maxInterviewsPerDay: parseInt(e.target.value) 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={1}>1 interview</option>
              <option value={2}>2 interviews</option>
              <option value={3}>3 interviews</option>
              <option value={4}>4 interviews</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buffer Time Between Meetings (minutes)
            </label>
            <select
              value={preferences.bufferTime}
              onChange={(e) => setPreferences(prev => ({ 
                ...prev, 
                bufferTime: parseInt(e.target.value) 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>1 hour</option>
            </select>
          </div>
        </div>
      </div>

      {/* Auto-Response Settings */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Auto-Response Settings
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Enable Auto-Response</h3>
              <p className="text-sm text-gray-600">
                Automatically respond to interview scheduling emails
              </p>
            </div>
            <button
              onClick={() => setPreferences(prev => ({ 
                ...prev, 
                autoResponseEnabled: !prev.autoResponseEnabled 
              }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.autoResponseEnabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preferences.autoResponseEnabled ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          
          {preferences.autoResponseEnabled && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Auto-Response Active</p>
                  <p>
                    The AI will monitor your email and automatically respond to interview 
                    scheduling requests based on your calendar availability.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={savePreferences}
          className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center ${
            saved 
              ? 'bg-green-600 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Save className="h-4 w-4 mr-2" />
          {saved ? 'Saved!' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
};

export default AvailabilitySettings;
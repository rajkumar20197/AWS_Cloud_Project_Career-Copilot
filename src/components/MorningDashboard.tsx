/**
 * Morning Dashboard - The First Thing Students See
 * "Wake up → Check Calendar → See Everything"
 */

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Mail, Target, TrendingUp, AlertCircle, RefreshCw, CheckCircle, Bell } from 'lucide-react';
import gmailService from '../services/gmailService';
import calendarService from '../services/calendarService';
import demoDataService from '../services/demoDataService';

const MorningDashboard = () => {
  const [briefingData, setBriefingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [useDemo, setUseDemo] = useState(true); // Start with demo data

  useEffect(() => {
    loadMorningData();
  }, []);

  const loadMorningData = async () => {
    try {
      setLoading(true);
      
      if (useDemo) {
        // Load demo data to show complete functionality
        const demoData = demoDataService.getMorningBriefing();
        setBriefingData(demoData);
      } else {
        // Load real data (when Google APIs are configured)
        await gmailService.initialize();
        await calendarService.initialize();
        
        const events = await calendarService.getTodaysJobEvents();
        const emails = await gmailService.scanJobEmails();
        
        setBriefingData({
          stats: {
            activeApplications: emails.filter(e => e.status === 'applied' || e.status === 'screening').length,
            interviewsToday: events.filter(e => e.summary.includes('Interview')).length,
            pendingOffers: emails.filter(e => e.type === 'offer').length,
            followUpsDue: events.filter(e => e.summary.includes('Follow Up')).length
          },
          todaysEvents: events,
          recentNotifications: emails.slice(0, 3),
          applications: emails.slice(0, 5),
          greeting: getGreeting(),
          aiActivity: {
            emailsProcessed: 0,
            responsesGenerated: 0,
            interviewsScheduled: 0,
            followUpsSent: 0
          }
        });
      }
      
    } catch (error) {
      console.error('Error loading morning data:', error);
      // Fallback to demo data if real data fails
      const demoData = demoDataService.getMorningBriefing();
      setBriefingData(demoData);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning! ☀️";
    if (hour < 17) return "Good afternoon! 🌤️";
    return "Good evening! 🌙";
  };

  const toggleDataSource = () => {
    setUseDemo(!useDemo);
    loadMorningData();
  };

  const getEventIcon = (type) => {
    const icons = {
      'interview': '🎯',
      'deadline': '📝',
      'follow_up': '📞',
      'prep': '📚'
    };
    return icons[type] || '📅';
  };

  const getStatusColor = (status) => {
    const colors = {
      'applied': 'bg-blue-100 text-blue-800',
      'screening': 'bg-yellow-100 text-yellow-800',
      'interview_scheduled': 'bg-purple-100 text-purple-800',
      'offer_received': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your morning briefing...</p>
        </div>
      </div>
    );
  }

  if (!briefingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to load briefing data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {briefingData.greeting}
              </h1>
              <p className="text-gray-600">
                Here's your career dashboard for {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDataSource}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  useDemo 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {useDemo ? '🎭 Demo Mode' : '🔴 Live Mode'}
              </button>
              
              <button
                onClick={loadMorningData}
                className="flex items-center px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>

          {/* AI Activity Banner */}
          <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-4 text-white mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">🤖 AI Agents Working Overnight</h3>
                <p className="text-sm opacity-90">
                  Processed {briefingData.aiActivity.emailsProcessed} emails, 
                  sent {briefingData.aiActivity.responsesGenerated} responses, 
                  scheduled {briefingData.aiActivity.interviewsScheduled} interviews
                </p>
              </div>
              <CheckCircle className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Applications</p>
                <p className="text-2xl font-bold text-gray-900">{briefingData.stats.activeApplications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Interviews Today</p>
                <p className="text-2xl font-bold text-gray-900">{briefingData.stats.interviewsToday}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Follow-ups Due</p>
                <p className="text-2xl font-bold text-gray-900">{briefingData.stats.followUpsDue}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Offers</p>
                <p className="text-2xl font-bold text-gray-900">{briefingData.stats.pendingOffers}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Today's Schedule */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Today's Schedule
            </h2>
            
            {briefingData.todaysEvents.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No job-related events today. Great time to apply to new positions! 🚀
              </p>
            ) : (
              <div className="space-y-4">
                {briefingData.todaysEvents.map((event, index) => (
                  <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-2xl mr-3">{getEventIcon(event.type)}</span>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {event.time}
                      </p>
                      {event.location && (
                        <p className="text-sm text-gray-500 mt-1">📍 {event.location}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-2">{event.description}</p>
                    </div>
                    
                    {event.type === 'interview' && (
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full hover:bg-blue-200">
                          Join Call
                        </button>
                        <button className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full hover:bg-green-200">
                          View Prep
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent AI Activity */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Recent AI Activity
            </h2>
            
            <div className="space-y-4">
              {briefingData.recentNotifications.map((notification, index) => (
                <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{notification.title}</h3>
                      <span className="text-xs text-gray-500">
                        {new Date(notification.timestamp).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-600">{notification.company}</span>
                      {notification.actionRequired && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                          Action Required
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={loadMorningData}
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors"
            >
              <h3 className="font-medium text-blue-900">🔄 Refresh Data</h3>
              <p className="text-sm text-blue-700 mt-1">Scan for new emails and updates</p>
            </button>
            
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
              <h3 className="font-medium text-green-900">📝 Add Application</h3>
              <p className="text-sm text-green-700 mt-1">Manually track a new application</p>
            </button>
            
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors">
              <h3 className="font-medium text-purple-900">📊 View Analytics</h3>
              <p className="text-sm text-purple-700 mt-1">See your job search progress</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MorningDashboard;
/**
 * Smart Scheduling Dashboard
 * Shows AI agent activity and scheduling interactions
 */

import React, { useState, useEffect } from 'react';
import { Bot, Mail, Calendar, Clock, TrendingUp, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import demoDataService from '../services/demoDataService';

const SchedulingDashboard = () => {
  const [agentData, setAgentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgentData();
  }, []);

  const loadAgentData = async () => {
    try {
      setLoading(true);
      // Load demo data to show AI agent functionality
      const data = demoDataService.getAgentActivity();
      setAgentData(data);
    } catch (error) {
      console.error('Error loading agent data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'response_sent': return <Mail className="h-4 w-4" />;
      case 'interview_scheduled': return <Calendar className="h-4 w-4" />;
      case 'email_processed': return <Bot className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getActivityTitle = (type) => {
    switch (type) {
      case 'response_sent': return 'Response Sent';
      case 'interview_scheduled': return 'Interview Scheduled';
      case 'email_processed': return 'Email Processed';
      default: return 'Activity';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading AI agent data...</p>
        </div>
      </div>
    );
  }

  if (!agentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to load agent data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Bot className="h-6 w-6 mr-2 text-blue-600" />
              Smart Scheduling Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor your AI availability agent's performance and activity
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center px-3 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <div className="w-2 h-2 rounded-full mr-2 bg-green-500"></div>
              Agent Active
            </div>
            
            <button
              onClick={loadAgentData}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <Mail className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Emails Processed</p>
              <p className="text-2xl font-bold text-gray-900">{agentData.emailsProcessed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Responses Generated</p>
              <p className="text-2xl font-bold text-gray-900">{agentData.responsesGenerated}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Interviews Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">{agentData.interviewsScheduled}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900">{agentData.averageResponseTime}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Recent Agent Activity
          </h2>
          
          <div className="space-y-4">
            {agentData.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start p-4 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-full ${getStatusColor(activity.status)} mr-4`}>
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900">
                      {getActivityTitle(activity.type)}
                    </h3>
                    <span className="text-sm text-gray-500">{activity.timestamp}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-1">
                    {activity.position} at {activity.company}
                  </p>
                  
                  <p className="text-sm text-gray-500">
                    {activity.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Upcoming Interviews
          </h2>
          
          <div className="space-y-4">
            {upcomingInterviews.map((interview, index) => (
              <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-full mr-4">
                  <Calendar className="h-4 w-4" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900">{interview.company}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      interview.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {interview.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{interview.position}</p>
                  
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <span>📅 {new Date(interview.date).toLocaleDateString()}</span>
                    <span>🕐 {interview.time}</span>
                    <span>📞 {interview.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Performance Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Agent Performance This Week
        </h2>
        
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <div key={day} className="text-center">
              <div className="text-sm font-medium text-gray-600 mb-2">{day}</div>
              <div className="bg-gray-200 rounded-full h-20 flex items-end justify-center p-1">
                <div 
                  className="bg-blue-500 rounded-full w-full transition-all duration-300"
                  style={{ height: `${Math.random() * 80 + 20}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.floor(Math.random() * 10)} emails
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            Emails Processed
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
            <h3 className="font-medium text-blue-900">⚙️ Agent Settings</h3>
            <p className="text-sm text-blue-700 mt-1">Configure availability preferences</p>
          </button>
          
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
            <h3 className="font-medium text-green-900">📊 View Analytics</h3>
            <p className="text-sm text-green-700 mt-1">Detailed performance metrics</p>
          </button>
          
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors">
            <h3 className="font-medium text-purple-900">📧 Email Templates</h3>
            <p className="text-sm text-purple-700 mt-1">Customize response templates</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchedulingDashboard;
/**
 * Application Tracking Dashboard
 * Comprehensive view of all job applications across platforms
 */

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  Calendar,
  MapPin,
  ExternalLink,
  RefreshCw,
  Filter,
  Search
} from 'lucide-react';
import applicationStatusBot from '../services/applicationStatusBot';
import demoDataService from '../services/demoDataService';

const ApplicationTrackingDashboard = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({
    total: 0,
    byStatus: {},
    byPlatform: {},
    recentUpdates: [],
    actionRequired: []
  });
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadApplicationData();
  }, []);

  const loadApplicationData = async () => {
    try {
      setLoading(true);

      // Load demo data to show application tracking functionality
      const trackingData = demoDataService.getApplicationTrackingData();
      setSummary(trackingData.summary);
      setInsights(trackingData.insights);
      setApplications(trackingData.applications);

    } catch (error) {
      console.error('Error loading application data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      'submitted': <Clock className="h-4 w-4 text-blue-500" />,
      'under_review': <AlertCircle className="h-4 w-4 text-yellow-500" />,
      'interview_scheduled': <Calendar className="h-4 w-4 text-purple-500" />,
      'offer': <CheckCircle className="h-4 w-4 text-green-500" />,
      'rejected': <XCircle className="h-4 w-4 text-red-500" />
    };
    return icons[status] || <Clock className="h-4 w-4 text-gray-500" />;
  };

  const getStatusColor = (status) => {
    const colors = {
      'submitted': 'bg-blue-100 text-blue-800',
      'under_review': 'bg-yellow-100 text-yellow-800',
      'interview_scheduled': 'bg-purple-100 text-purple-800',
      'offer': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      'linkedin': '💼',
      'indeed': '🔍',
      'glassdoor': '🏢',
      'company_website': '🌐',
      'email': '📧'
    };
    return icons[platform] || '📄';
  };

  const filteredApplications = applications.filter(app => {
    const matchesFilter = filter === 'all' || app.currentStatus === filter;
    const matchesSearch = searchTerm === '' ||
      app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.position.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading application data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Application Tracking</h1>
              <p className="text-gray-600">Monitor your job applications across all platforms</p>
            </div>
            <button
              onClick={loadApplicationData}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search companies or positions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="interview_scheduled">Interview Scheduled</option>
              <option value="offer">Offer Received</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{summary.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Under Review</p>
                <p className="text-2xl font-bold text-gray-900">{summary.byStatus.under_review || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Interviews Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">{summary.byStatus.interview_scheduled || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Offers Received</p>
                <p className="text-2xl font-bold text-gray-900">{summary.byStatus.offer || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Applications List */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Applications</h2>

            <div className="space-y-4">
              {filteredApplications.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No applications found matching your criteria.</p>
                </div>
              ) : (
                filteredApplications.map((app, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{app.company}</h3>
                        <p className="text-gray-600">{app.position}</p>
                        <p className="text-sm text-gray-500">
                          Applied: {app.applicationDate ? new Date(app.applicationDate).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.currentStatus || 'submitted')}`}>
                          {(app.currentStatus || 'submitted').replace('_', ' ')}
                        </span>
                        {getStatusIcon(app.currentStatus || 'submitted')}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          {(app.platforms || []).map((platform, idx) => (
                            <span key={idx} className="text-lg" title={platform.platform}>
                              {getPlatformIcon(platform.platform)}
                            </span>
                          ))}
                        </div>

                        <div className="text-sm text-gray-500">
                          Last update: {app.lastUpdate ? new Date(app.lastUpdate).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {app.priority === 'high' && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                            High Priority
                          </span>
                        )}

                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          View Details
                        </button>
                      </div>
                    </div>

                    {app.nextAction && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Next Action:</strong> {app.nextAction}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Insights and Analytics */}
          <div className="space-y-6">

            {/* Platform Performance */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Performance</h3>

              <div className="space-y-3">
                {Object.entries(summary.byPlatform).map(([platform, count]) => (
                  <div key={platform} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{getPlatformIcon(platform)}</span>
                      <span className="capitalize text-gray-700">{platform.replace('_', ' ')}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights</h3>

              <div className="space-y-3">
                {insights.map((insight, index) => (
                  <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-sm text-blue-800">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Required */}
            {summary.actionRequired.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Action Required</h3>

                <div className="space-y-3">
                  {summary.actionRequired.slice(0, 3).map((app, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div>
                        <p className="font-medium text-orange-900">{app.company}</p>
                        <p className="text-sm text-orange-700">{app.position}</p>
                      </div>
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>

              <div className="space-y-2">
                <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <span className="font-medium">📝 Add New Application</span>
                  <p className="text-sm text-gray-600">Track a new job application</p>
                </button>

                <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <span className="font-medium">📊 Export Data</span>
                  <p className="text-sm text-gray-600">Download application report</p>
                </button>

                <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <span className="font-medium">⚙️ Configure Tracking</span>
                  <p className="text-sm text-gray-600">Set up automatic monitoring</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationTrackingDashboard;
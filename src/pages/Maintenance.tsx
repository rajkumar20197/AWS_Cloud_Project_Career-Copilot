import React from 'react';
import { Wrench, Clock, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';

interface MaintenanceProps {
  onGoHome: () => void;
}

export default function Maintenance({ onGoHome }: MaintenanceProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Maintenance Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
            <Wrench className="w-14 h-14 text-blue-500" />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          We'll Be Right Back!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Career Copilot is currently undergoing scheduled maintenance to improve your experience.
        </p>

        {/* Estimated Time */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-center mb-3">
            <Clock className="w-6 h-6 text-blue-600 mr-2" />
            <h3 className="font-semibold text-blue-900">Estimated Downtime</h3>
          </div>
          <p className="text-2xl font-bold text-blue-600">30 minutes</p>
          <p className="text-sm text-blue-700 mt-2">Expected back online by 3:00 PM EST</p>
        </div>

        {/* What We're Doing */}
        <div className="text-left mb-8">
          <h3 className="font-semibold text-gray-900 mb-4 text-center">
            What we're working on:
          </h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">Upgrading server infrastructure</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">Improving AI response times</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">Enhancing security features</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">Adding new features</span>
            </div>
          </div>
        </div>

        {/* Stay Updated */}
        <div className="border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-600 mb-4">
            Want to stay updated on our progress?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://twitter.com/careercopilot"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all"
            >
              Follow on Twitter
            </a>
            <a
              href="mailto:support@careercopilot.com"
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all"
            >
              Email Support
            </a>
          </div>
        </div>

        {/* Thank You */}
        <p className="text-gray-500 text-sm mt-8">
          Thank you for your patience! We'll be back soon with improvements.
        </p>
      </div>
    </div>
  );
}

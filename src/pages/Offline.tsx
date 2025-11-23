import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';

interface OfflineProps {
  onGoHome: () => void;
}

export default function Offline({ onGoHome }: OfflineProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Offline Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
            <WifiOff className="w-12 h-12 text-gray-400" />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">You're Offline</h1>
        <p className="text-gray-600 mb-8">
          It looks like you've lost your internet connection. Please check your network and try
          again.
        </p>

        {/* Troubleshooting */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
          <h3 className="font-semibold text-gray-900 mb-3">Quick fixes:</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Check your WiFi or mobile data connection</li>
            <li>• Try turning airplane mode off and on</li>
            <li>• Restart your router if using WiFi</li>
            <li>• Move to an area with better signal</li>
          </ul>
        </div>

        {/* Retry Button */}
        <button
          onClick={() => window.location.reload()}
          className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Try Again
        </button>

        {/* Offline Features */}
        <div className="mt-8 text-sm text-gray-500">
          <p>Some features may be available offline:</p>
          <p className="mt-2">• View saved resumes</p>
          <p>• Review application notes</p>
        </div>
      </div>
    </div>
  );
}

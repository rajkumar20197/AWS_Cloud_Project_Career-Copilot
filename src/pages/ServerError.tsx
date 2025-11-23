import { ServerCrash, RefreshCw, Home, Mail } from 'lucide-react';
import { Button } from '../components/ui/button';

interface ServerErrorProps {
  onGoHome: () => void;
}

export default function ServerError({ onGoHome }: ServerErrorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <ServerCrash className="w-14 h-14 text-red-500" />
          </div>
        </div>

        {/* Error Code */}
        <div className="text-6xl font-bold text-gray-300 mb-4">500</div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Server Error</h1>
        <p className="text-gray-600 mb-8">
          Our servers are experiencing some technical difficulties. We're working hard to fix this
          issue. Please try again in a few moments.
        </p>

        {/* What Happened */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8 text-left">
          <h3 className="font-semibold text-red-900 mb-3">What happened?</h3>
          <ul className="space-y-2 text-sm text-red-800">
            <li>• The server encountered an unexpected error</li>
            <li>• Our team has been automatically notified</li>
            <li>• We're working to resolve this as quickly as possible</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Refresh Page
          </button>
          <Button
            onClick={onGoHome}
            variant="outline"
            className="flex items-center justify-center px-6 py-3"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Button>
        </div>

        {/* Support */}
        <div className="border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-600 mb-4">
            If this problem persists, please contact our support team:
          </p>
          <a
            href="mailto:support@careercopilot.com"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
          >
            <Mail className="w-4 h-4 mr-2" />
            support@careercopilot.com
          </a>
        </div>
      </div>
    </div>
  );
}

import { Clock, Zap, Crown } from 'lucide-react';
import { Button } from '../components/ui/button';

interface RateLimitExceededProps {
  onGoHome: () => void;
}

export default function RateLimitExceeded({ onGoHome }: RateLimitExceededProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
            <Clock className="w-12 h-12 text-orange-500" />
          </div>
        </div>

        {/* Error Code */}
        <div className="text-6xl font-bold text-gray-300 mb-4">429</div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Slow Down There!</h1>
        <p className="text-gray-600 mb-8">
          You've reached your request limit. Please wait a moment before trying again.
        </p>

        {/* Current Limits */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8 text-left">
          <h3 className="font-semibold text-orange-900 mb-3">Your Current Limits:</h3>
          <ul className="space-y-2 text-sm text-orange-800">
            <li>• Free Plan: 10 AI requests per month</li>
            <li>• Rate Limit: 10 requests per minute</li>
            <li>• Resets in: 5 minutes</li>
          </ul>
        </div>

        {/* Upgrade Option */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-6 text-white mb-6">
          <Crown className="w-8 h-8 mx-auto mb-3" />
          <h3 className="font-bold mb-2">Want Unlimited Access?</h3>
          <p className="text-sm mb-4 opacity-90">
            Upgrade to Pro for unlimited AI requests and no rate limits!
          </p>
          <Button
            onClick={onGoHome}
            variant="outline"
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            View Plans
          </Button>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all"
          >
            <Zap className="w-5 h-5 mr-2" />
            Try Again
          </button>
          <Button
            onClick={onGoHome}
            variant="ghost"
            className="w-full text-blue-600 hover:text-blue-700"
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}

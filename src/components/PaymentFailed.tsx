import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, RefreshCw, CreditCard, HelpCircle } from 'lucide-react';

export default function PaymentFailed() {
  const navigate = useNavigate();

  const commonReasons = [
    {
      icon: <CreditCard className="w-5 h-5" />,
      title: 'Insufficient Funds',
      description: 'Your card may not have enough balance',
    },
    {
      icon: <XCircle className="w-5 h-5" />,
      title: 'Card Declined',
      description: 'Your bank declined the transaction',
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      title: 'Incorrect Details',
      description: 'Card number, expiry, or CVV may be wrong',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">Payment Failed</h1>
        <p className="text-gray-600 mb-8 text-center">
          We couldn't process your payment. Don't worry, you haven't been charged.
        </p>

        {/* Common Reasons */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="font-semibold text-lg mb-4">Common Reasons:</h2>
          <div className="space-y-3">
            {commonReasons.map((reason, index) => (
              <div key={index} className="flex items-start">
                <div className="text-red-500 mr-3 mt-0.5">{reason.icon}</div>
                <div>
                  <p className="font-medium text-gray-900">{reason.title}</p>
                  <p className="text-sm text-gray-600">{reason.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What to Do */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="font-semibold text-lg mb-3">What to do:</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">1.</span>
              <span>Check your card details are correct</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">2.</span>
              <span>Ensure you have sufficient funds</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">3.</span>
              <span>Try a different payment method</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">4.</span>
              <span>Contact your bank if issue persists</span>
            </li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/pricing')}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Again
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-all"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/support')}
            className="w-full text-blue-600 py-2 font-medium hover:underline"
          >
            Contact Support
          </button>
        </div>

        {/* Help Text */}
        <p className="text-sm text-gray-500 mt-6 text-center">
          Need help? Email us at support@careercopilot.com
        </p>
      </div>
    </div>
  );
}

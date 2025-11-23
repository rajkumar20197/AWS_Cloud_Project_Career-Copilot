import React, { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 shadow-2xl z-50 animate-slide-up">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start flex-1">
          <Cookie className="w-6 h-6 mr-3 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold mb-1">We use cookies</h3>
            <p className="text-sm text-gray-300">
              We use cookies to enhance your experience, analyze site traffic, and personalize
              content. By clicking "Accept", you consent to our use of cookies.{' '}
              <a href="/privacy" className="underline hover:text-white">
                Learn more
              </a>
            </p>
          </div>
        </div>

        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={declineCookies}
            className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors"
          >
            Decline
          </button>
          <button
            onClick={acceptCookies}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-sm transition-all"
          >
            Accept
          </button>
        </div>

        <button
          onClick={declineCookies}
          className="absolute top-2 right-2 md:relative md:top-0 md:right-0 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

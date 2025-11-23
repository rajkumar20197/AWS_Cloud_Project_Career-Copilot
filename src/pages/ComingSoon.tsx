import { useState } from 'react';
import { Rocket, Bell, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';

interface ComingSoonProps {
  onGoHome: () => void;
}

export default function ComingSoon({ onGoHome }: ComingSoonProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save email to waitlist
    setSubscribed(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Rocket Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center animate-bounce">
            <Rocket className="w-14 h-14 text-purple-500" />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Coming Soon!</h1>
        <p className="text-xl text-gray-600 mb-12">
          We're working hard to bring you something amazing. This feature will be available soon!
        </p>

        {/* Notify Me Form */}
        {!subscribed ? (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Notified</h3>
            <p className="text-gray-600 mb-6">
              Be the first to know when this feature launches. We'll send you an email!
            </p>
            <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all whitespace-nowrap"
              >
                <Bell className="w-5 h-5 inline mr-2" />
                Notify Me
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 mb-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-900 mb-2">You're on the list!</h3>
            <p className="text-green-700">
              We'll email you at <strong>{email}</strong> when this feature is ready.
            </p>
          </div>
        )}

        {/* What's Coming */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">What's Coming:</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-left">
            <div className="flex items-start">
              <span className="text-2xl mr-3">📱</span>
              <div>
                <h4 className="font-semibold text-gray-900">Mobile App</h4>
                <p className="text-sm text-gray-600">iOS and Android apps</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">🤖</span>
              <div>
                <h4 className="font-semibold text-gray-900">Advanced AI</h4>
                <p className="text-sm text-gray-600">Smarter career guidance</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">👥</span>
              <div>
                <h4 className="font-semibold text-gray-900">Team Features</h4>
                <p className="text-sm text-gray-600">Collaborate with peers</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">🔗</span>
              <div>
                <h4 className="font-semibold text-gray-900">More Integrations</h4>
                <p className="text-sm text-gray-600">LinkedIn, Indeed, and more</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to App */}
        <Button
          onClick={onGoHome}
          variant="ghost"
          className="text-blue-600 hover:text-blue-700"
        >
          ← Back to Career Copilot
        </Button>
      </div>
    </div>
  );
}
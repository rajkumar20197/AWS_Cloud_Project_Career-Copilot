import { Lock, LogIn, Home } from 'lucide-react';
import { Button } from '../components/ui/button';

interface UnauthorizedProps {
  onGoHome: () => void;
}

export default function Unauthorized({ onGoHome }: UnauthorizedProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Lock Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <Lock className="w-12 h-12 text-red-500" />
          </div>
        </div>

        {/* Error Code */}
        <div className="text-6xl font-bold text-gray-300 mb-4">401</div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-8">
          You need to be logged in to access this page. Please sign in to continue.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={onGoHome}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Sign In
          </Button>
          <Button
            onClick={onGoHome}
            variant="outline"
            className="w-full"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Button>
        </div>

        {/* Sign Up Link */}
        <div className="mt-6 text-sm text-gray-600">
          Don't have an account?{' '}
          <button 
            onClick={onGoHome}
            className="text-blue-600 hover:text-blue-700 font-semibold underline"
          >
            Sign up for free
          </button>
        </div>
      </div>
    </div>
  );
}

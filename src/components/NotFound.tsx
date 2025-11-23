import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Home, Search, ArrowLeft, Sparkles } from 'lucide-react';

interface NotFoundProps {
  onGoHome: () => void;
}

export function NotFound({ onGoHome }: NotFoundProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        {/* Animated 404 */}
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="mb-8"
        >
          <motion.h1
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            className="text-9xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            style={{ backgroundSize: '200% 200%' }}
          >
            404
          </motion.h1>
        </motion.div>

        {/* Floating Icons */}
        <div className="relative h-32 mb-8">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, 0, -10, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/4 top-0"
          >
            <Search className="w-12 h-12 text-blue-400 opacity-50" />
          </motion.div>
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [0, -10, 0, 10, 0]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute right-1/4 top-4"
          >
            <Sparkles className="w-10 h-10 text-purple-400 opacity-50" />
          </motion.div>
          <motion.div
            animate={{
              y: [0, -25, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute left-1/2 -translate-x-1/2 top-8"
          >
            <div className="w-8 h-8 bg-pink-400 rounded-full opacity-30" />
          </motion.div>
        </div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="space-y-4 mb-12"
        >
          <h2 className="text-3xl font-bold text-slate-800">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-slate-600 max-w-md mx-auto">
            Looks like this career path doesn't exist yet. Let's get you back on track!
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={onGoHome}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Home className="w-5 h-5 mr-2" />
            Go to Dashboard
          </Button>
          <Button
            onClick={() => window.history.back()}
            size="lg"
            variant="outline"
            className="border-2"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-12 pt-8 border-t border-slate-200"
        >
          <p className="text-sm text-slate-500 mb-4">Popular pages:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onGoHome()}
              className="text-slate-600 hover:text-blue-600"
            >
              Job Search
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onGoHome()}
              className="text-slate-600 hover:text-blue-600"
            >
              Applications
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onGoHome()}
              className="text-slate-600 hover:text-blue-600"
            >
              Resume Optimizer
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onGoHome()}
              className="text-slate-600 hover:text-blue-600"
            >
              Settings
            </Button>
          </div>
        </motion.div>

        {/* Fun Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-8 text-sm text-slate-400 italic"
        >
          "Not all who wander are lost... but this page definitely is!" 😄
        </motion.p>
      </motion.div>
    </div>
  );
}

import { motion } from 'motion/react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onGoHome?: () => void;
}

export function ErrorMessage({ 
  title = 'Something went wrong',
  message, 
  onRetry, 
  onGoHome 
}: ErrorMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center min-h-[400px] p-6"
    >
      <Card className="p-8 max-w-md text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <AlertCircle className="w-8 h-8 text-red-600" />
        </motion.div>
        
        <h3 className="text-xl font-semibold text-slate-800 mb-2">
          {title}
        </h3>
        
        <p className="text-slate-600 mb-6">
          {message}
        </p>
        
        <div className="flex gap-3 justify-center">
          {onRetry && (
            <Button onClick={onRetry} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          )}
          {onGoHome && (
            <Button onClick={onGoHome} variant="outline" className="gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

// Empty State Component
export function EmptyState({ 
  icon: Icon = AlertCircle,
  title,
  message,
  action
}: {
  icon?: any;
  title: string;
  message: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center"
    >
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-10 h-10 text-slate-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-slate-800 mb-2">
        {title}
      </h3>
      
      <p className="text-slate-600 mb-6 max-w-md">
        {message}
      </p>
      
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}

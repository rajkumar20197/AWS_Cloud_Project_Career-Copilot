import { Button } from './ui/button';
import { ErrorHandler } from '../utils/errorHandler';

export function ErrorPageDemo() {
  return (
    <div className="p-6 bg-white rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">🧪 Error Pages Demo</h3>
      <p className="text-sm text-slate-600 mb-4">
        Test all error pages to ensure they work correctly:
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => ErrorHandler.handleUnauthorized()}
        >
          401 Unauthorized
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => ErrorHandler.handleServerError()}
        >
          500 Server Error
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => ErrorHandler.handleRateLimit()}
        >
          429 Rate Limit
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => ErrorHandler.handleMaintenance()}
        >
          503 Maintenance
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => ErrorHandler.handleOffline()}
        >
          Offline Mode
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => ErrorHandler.handleComingSoon()}
        >
          Coming Soon
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => ErrorHandler.handleNotFound()}
        >
          404 Not Found
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // Simulate a JavaScript error to test ErrorBoundary
            throw new Error('Test error for ErrorBoundary');
          }}
        >
          JS Error
        </Button>
      </div>
      
      <p className="text-xs text-slate-500 mt-3">
        💡 Click any button to test the corresponding error page
      </p>
    </div>
  );
}
import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ChevronDown, ChevronUp, Terminal, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { config, validateAwsConfig, shouldUseRealAWS } from '../config/env';

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const validation = validateAwsConfig();
  const usingRealAWS = shouldUseRealAWS();

  return (
    <Card className="border-2 border-purple-200 bg-purple-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-purple-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-purple-600" />
          <span className="font-semibold text-purple-900">Debug Panel</span>
          <Badge className="bg-purple-600 text-white">Developer Mode</Badge>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-purple-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-purple-600" />
        )}
      </button>

      {isOpen && (
        <div className="p-4 border-t border-purple-200 space-y-4">
          {/* AWS Configuration Status */}
          <div>
            <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
              {validation.isValid ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600" />
              )}
              AWS Configuration
            </h3>
            <div className="bg-white rounded p-3 space-y-2 text-sm font-mono">
              <div className="flex justify-between">
                <span className="text-slate-600">Region:</span>
                <span className="font-semibold">{config.aws.region}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Access Key ID:</span>
                <span className={config.aws.accessKeyId && config.aws.accessKeyId !== 'your_access_key_here' ? 'text-green-600' : 'text-red-600'}>
                  {config.aws.accessKeyId ? 
                    `${config.aws.accessKeyId.substring(0, 8)}...` : 
                    'Not set'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Secret Key:</span>
                <span className={config.aws.secretAccessKey && config.aws.secretAccessKey !== 'your_secret_key_here' ? 'text-green-600' : 'text-red-600'}>
                  {config.aws.secretAccessKey ? '••••••••' : 'Not set'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Model ID:</span>
                <span className="text-xs">{config.aws.bedrockModelId}</span>
              </div>
            </div>
          </div>

          {/* Feature Flags */}
          <div>
            <h3 className="font-semibold text-purple-900 mb-2">Feature Flags</h3>
            <div className="bg-white rounded p-3 space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Use Mock Data:</span>
                <Badge className={config.features.useMockData ? 'bg-blue-600' : 'bg-slate-400'}>
                  {config.features.useMockData ? 'TRUE' : 'FALSE'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Enable AWS Bedrock:</span>
                <Badge className={config.features.enableAwsBedrock ? 'bg-green-600' : 'bg-slate-400'}>
                  {config.features.enableAwsBedrock ? 'TRUE' : 'FALSE'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Should Use Real AWS:</span>
                <Badge className={usingRealAWS ? 'bg-green-600' : 'bg-orange-600'}>
                  {usingRealAWS ? 'YES' : 'NO'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Validation Results */}
          {!validation.isValid && (
            <div>
              <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                Missing Configuration
              </h3>
              <div className="bg-white rounded p-3">
                <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                  {validation.missingFields.map(field => (
                    <li key={field}>{field}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-white rounded p-3 text-xs text-slate-600">
            <p className="font-semibold mb-1">💡 Tip:</p>
            <p>Open browser console (F12) to see detailed logs about AWS API calls and errors.</p>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.location.reload()}
              className="flex-1"
            >
              Reload App
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => console.clear()}
              className="flex-1"
            >
              Clear Console
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { AlertCircle, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import { validateAwsConfig, shouldUseRealAWS, config } from '../config/env';

export function AWSConfigStatus() {
  const validation = validateAwsConfig();
  const usingRealAWS = shouldUseRealAWS();
  const useMockData = config.features.useMockData;

  if (usingRealAWS && validation.isValid) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-900">AWS Bedrock Connected</AlertTitle>
        <AlertDescription className="text-green-700">
          Using real AWS Bedrock AI for intelligent career guidance.
          <Badge className="ml-2 bg-green-600 text-white">Live</Badge>
        </AlertDescription>
      </Alert>
    );
  }

  if (useMockData) {
    return (
      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-900">Demo Mode</AlertTitle>
        <AlertDescription className="text-blue-700">
          Using mock data for demonstration. Configure AWS credentials to use real AI features.
          <Badge className="ml-2 bg-blue-600 text-white">Demo</Badge>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="p-6 border-orange-200 bg-orange-50">
      <div className="flex items-start gap-4">
        <XCircle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-orange-900 mb-2">
            AWS Configuration Required
          </h3>
          <p className="text-orange-700 mb-4">
            To use real AWS Bedrock AI features, you need to configure your AWS credentials.
          </p>
          
          <div className="bg-white rounded-lg p-4 mb-4 border border-orange-200">
            <p className="font-medium text-orange-900 mb-2">Missing Configuration:</p>
            <ul className="list-disc list-inside space-y-1 text-orange-700">
              {validation.missingFields.map(field => (
                <li key={field}>{field}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-orange-800 font-medium">Setup Steps:</p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-orange-700">
              <li>Get AWS credentials from AWS Console → IAM → Users → Security Credentials</li>
              <li>Ensure you have access to AWS Bedrock (Claude 3.5 Haiku model)</li>
              <li>Create a <code className="bg-orange-100 px-1 rounded">.env</code> file in the project root</li>
              <li>Add your credentials:
                <pre className="bg-white p-3 rounded mt-2 text-xs overflow-x-auto border border-orange-200">
{`VITE_AWS_REGION=us-east-1
VITE_AWS_ACCESS_KEY_ID=your_access_key_here
VITE_AWS_SECRET_ACCESS_KEY=your_secret_key_here`}
                </pre>
              </li>
              <li>Restart the development server</li>
            </ol>
          </div>

          <div className="mt-4 flex gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('https://docs.aws.amazon.com/bedrock/latest/userguide/getting-started.html', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              AWS Bedrock Docs
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.reload()}
            >
              Reload App
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Environment configuration
export const config = {
  aws: {
    region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    bedrockModelId: import.meta.env.VITE_BEDROCK_MODEL_ID || 'anthropic.claude-3-5-haiku-20241022-v1:0',
  },
  google: {
    apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  },
  api: {
    url: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  },
  features: {
    useMockData: import.meta.env.VITE_USE_MOCK_DATA === 'true',
    enableAwsBedrock: import.meta.env.VITE_ENABLE_AWS_BEDROCK !== 'false',
    enableGoogleIntegration: import.meta.env.VITE_GOOGLE_API_KEY && import.meta.env.VITE_GOOGLE_CLIENT_ID,
  },
  environment: import.meta.env.VITE_ENVIRONMENT || 'development',
};

// Validation helper
export function validateAwsConfig(): { isValid: boolean; missingFields: string[] } {
  const missingFields: string[] = [];
  
  if (!config.aws.accessKeyId || config.aws.accessKeyId === 'your_access_key_here') {
    missingFields.push('VITE_AWS_ACCESS_KEY_ID');
  }
  
  if (!config.aws.secretAccessKey || config.aws.secretAccessKey === 'your_secret_key_here') {
    missingFields.push('VITE_AWS_SECRET_ACCESS_KEY');
  }
  
  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}

// Check if we should use real AWS services
export function shouldUseRealAWS(): boolean {
  if (config.features.useMockData) {
    return false;
  }
  
  const validation = validateAwsConfig();
  return validation.isValid && config.features.enableAwsBedrock;
}

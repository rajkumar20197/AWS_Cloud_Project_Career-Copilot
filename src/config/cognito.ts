import { Amplify } from 'aws-amplify';

// AWS Cognito Configuration - Simplified for Direct Auth
export const cognitoConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_RbxnBYOCS',
      userPoolClientId: '5a6kq9althf2te07sv157a26so',
      region: 'us-east-1',
      signUpVerificationMethod: 'code' as const,
      userAttributes: {
        email: {
          required: true,
        },
        name: {
          required: true,
        },
      },
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: true,
      },
    },
  },
};

// Initialize Amplify
Amplify.configure(cognitoConfig);

// Debug logging
console.log('🔧 Cognito Configuration Loaded:', {
  userPoolId: cognitoConfig.Auth.Cognito.userPoolId,
  userPoolClientId: cognitoConfig.Auth.Cognito.userPoolClientId,
  region: cognitoConfig.Auth.Cognito.region
});

export default cognitoConfig;

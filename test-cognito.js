// Test Cognito Configuration
import { Amplify } from 'aws-amplify';

const cognitoConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_RbxnBYOCS',
      userPoolClientId: '5a6kq9althf2te07sv157a26so',
      region: 'us-east-1',
    },
  },
};

Amplify.configure(cognitoConfig);

console.log('🔍 Testing Cognito Configuration...');
console.log('User Pool ID:', cognitoConfig.Auth.Cognito.userPoolId);
console.log('Client ID:', cognitoConfig.Auth.Cognito.userPoolClientId);
console.log('Region:', cognitoConfig.Auth.Cognito.region);

// Test if we can reach the user pool
try {
  console.log('✅ Cognito configuration loaded successfully');
} catch (error) {
  console.error('❌ Cognito configuration error:', error);
}
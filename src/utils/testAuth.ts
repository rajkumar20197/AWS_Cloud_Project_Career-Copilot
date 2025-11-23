// Temporary authentication bypass for testing
// DO NOT USE IN PRODUCTION

export const TEST_CREDENTIALS = {
  email: 'demo@careercopilot.com',
  name: 'Demo User',
  userId: 'demo-user-123',
  isAdmin: true,
  hasRealIntegrations: true, // Enable real Gmail/Calendar
  demoMode: true,
};

export const enableTestMode = () => {
  // Store test credentials in localStorage
  localStorage.setItem('testAuth', JSON.stringify({
    isAuthenticated: true,
    user: TEST_CREDENTIALS,
    timestamp: Date.now(),
  }));
};

export const isTestModeEnabled = () => {
  const testAuth = localStorage.getItem('testAuth');
  if (!testAuth) return false;
  
  try {
    const data = JSON.parse(testAuth);
    // Test mode expires after 24 hours
    const isExpired = Date.now() - data.timestamp > 24 * 60 * 60 * 1000;
    return !isExpired && data.isAuthenticated;
  } catch {
    return false;
  }
};

export const getTestUser = () => {
  if (!isTestModeEnabled()) return null;
  
  const testAuth = localStorage.getItem('testAuth');
  if (!testAuth) return null;
  
  try {
    const data = JSON.parse(testAuth);
    return data.user;
  } catch {
    return null;
  }
};

export const disableTestMode = () => {
  localStorage.removeItem('testAuth');
};
/**
 * Security Configuration
 * Centralized security settings and validation functions
 */

const crypto = require('crypto');

// Security constants
const SECURITY_CONFIG = {
  // JWT Configuration
  JWT_EXPIRY: '8h',
  JWT_TEMP_EXPIRY: '10m',
  
  // Password Requirements
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  
  // Rate Limiting
  LOGIN_ATTEMPTS: {
    MAX_ATTEMPTS: 3,
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  },
  MFA_ATTEMPTS: {
    MAX_ATTEMPTS: 5,
    WINDOW_MS: 5 * 60 * 1000, // 5 minutes
  },
  
  // Encryption
  ENCRYPTION_ALGORITHM: 'aes-256-gcm',
  IV_LENGTH: 16,
  TAG_LENGTH: 16,
  
  // Input Validation
  EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  GOOGLE_CLIENT_ID_REGEX: /^[0-9]+-[a-zA-Z0-9]+\.apps\.googleusercontent\.com$/,
};

/**
 * Validate email format
 */
function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }
  
  if (!SECURITY_CONFIG.EMAIL_REGEX.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }
  
  return { valid: true };
}

/**
 * Validate password strength
 */
function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required' };
  }
  
  if (password.length < SECURITY_CONFIG.MIN_PASSWORD_LENGTH) {
    return { valid: false, error: `Password must be at least ${SECURITY_CONFIG.MIN_PASSWORD_LENGTH} characters` };
  }
  
  if (password.length > SECURITY_CONFIG.MAX_PASSWORD_LENGTH) {
    return { valid: false, error: `Password must be less than ${SECURITY_CONFIG.MAX_PASSWORD_LENGTH} characters` };
  }
  
  return { valid: true };
}

/**
 * Sanitize string input
 */
function sanitizeString(input) {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  return input.trim().replace(/[<>\"'&]/g, '');
}

/**
 * Validate port number
 */
function validatePort(port) {
  const portNum = parseInt(port);
  if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
    return { valid: false, error: 'Invalid port number' };
  }
  return { valid: true, port: portNum };
}

/**
 * Validate Google Client ID format
 */
function validateGoogleClientId(clientId) {
  if (!clientId || typeof clientId !== 'string') {
    return { valid: false, error: 'Google Client ID is required' };
  }
  
  if (!SECURITY_CONFIG.GOOGLE_CLIENT_ID_REGEX.test(clientId)) {
    return { valid: false, error: 'Invalid Google Client ID format' };
  }
  
  return { valid: true };
}

/**
 * Enhanced encryption with GCM mode
 */
function encryptSecure(text, key) {
  try {
    const iv = crypto.randomBytes(SECURITY_CONFIG.IV_LENGTH);
    const cipher = crypto.createCipher(SECURITY_CONFIG.ENCRYPTION_ALGORITHM, Buffer.from(key, 'hex'));
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    return {
      encrypted: iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted,
      success: true
    };
  } catch (error) {
    console.error('Encryption error:', error);
    return { success: false, error: 'Encryption failed' };
  }
}

/**
 * Enhanced decryption with GCM mode
 */
function decryptSecure(encryptedData, key) {
  try {
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const tag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    
    const decipher = crypto.createDecipher(SECURITY_CONFIG.ENCRYPTION_ALGORITHM, Buffer.from(key, 'hex'));
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return { decrypted, success: true };
  } catch (error) {
    console.error('Decryption error:', error);
    return { success: false, error: 'Decryption failed' };
  }
}

/**
 * Generate secure random key
 */
function generateSecureKey() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Log security event
 */
function logSecurityEvent(event, details, req) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
    ip: req?.ip || 'unknown',
    userAgent: req?.headers?.['user-agent'] || 'unknown',
    userId: req?.user?.id || null,
    userEmail: req?.user?.email || null
  };
  
  console.log(`🔒 SECURITY EVENT: ${JSON.stringify(logEntry)}`);
  
  // In production, send to security monitoring system
  // await securityMonitoring.log(logEntry);
}

module.exports = {
  SECURITY_CONFIG,
  validateEmail,
  validatePassword,
  sanitizeString,
  validatePort,
  validateGoogleClientId,
  encryptSecure,
  decryptSecure,
  generateSecureKey,
  logSecurityEvent
};
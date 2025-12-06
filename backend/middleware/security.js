/**
 * Security Middleware
 * Comprehensive security protection for the application
 */

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { logSecurityEvent } = require('../config/security');

/**
 * Security headers middleware
 */
function securityHeaders() {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'", "https://api.stripe.com"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: [],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    noSniff: true,
    frameguard: { action: 'deny' },
    xssFilter: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
  });
}

/**
 * Request sanitization middleware
 */
function sanitizeRequest(req, res, next) {
  // Sanitize request body
  if (req.body && typeof req.body === 'object') {
    sanitizeObject(req.body);
  }
  
  // Sanitize query parameters
  if (req.query && typeof req.query === 'object') {
    sanitizeObject(req.query);
  }
  
  // Sanitize URL parameters
  if (req.params && typeof req.params === 'object') {
    sanitizeObject(req.params);
  }
  
  next();
}

/**
 * Recursively sanitize object properties
 */
function sanitizeObject(obj) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'string') {
        // Remove potentially dangerous characters
        obj[key] = obj[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
          .replace(/javascript:/gi, '') // Remove javascript: protocol
          .replace(/on\w+\s*=/gi, '') // Remove event handlers
          .trim();
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    }
  }
}

/**
 * SQL injection protection middleware
 */
function preventSQLInjection(req, res, next) {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
    /(;|\-\-|\|\||&&)/,
    /('|(\\')|('')|(%27)|(%2527))/,
    /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/,
    /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/,
    /((\%27)|(\'))union/i
  ];
  
  const checkForSQLInjection = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (typeof value === 'string') {
          for (const pattern of sqlPatterns) {
            if (pattern.test(value)) {
              logSecurityEvent('SQL_INJECTION_ATTEMPT', { 
                field: key, 
                value: value.substring(0, 100),
                pattern: pattern.toString()
              }, req);
              return res.status(400).json({ 
                error: 'Invalid input detected',
                code: 'SECURITY_VIOLATION'
              });
            }
          }
        } else if (typeof value === 'object' && value !== null) {
          const result = checkForSQLInjection(value);
          if (result) return result;
        }
      }
    }
    return null;
  };
  
  // Check request body
  if (req.body) {
    const result = checkForSQLInjection(req.body);
    if (result) return result;
  }
  
  // Check query parameters
  if (req.query) {
    const result = checkForSQLInjection(req.query);
    if (result) return result;
  }
  
  next();
}

/**
 * XSS protection middleware
 */
function preventXSS(req, res, next) {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<img[^>]+src[\\s]*=[\\s]*["\']javascript:/gi,
    /<[^>]*style[\\s]*=[\\s]*["\'][^"\']*expression[\\s]*\(/gi
  ];
  
  const checkForXSS = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (typeof value === 'string') {
          for (const pattern of xssPatterns) {
            if (pattern.test(value)) {
              logSecurityEvent('XSS_ATTEMPT', { 
                field: key, 
                value: value.substring(0, 100),
                pattern: pattern.toString()
              }, req);
              return res.status(400).json({ 
                error: 'Invalid input detected',
                code: 'SECURITY_VIOLATION'
              });
            }
          }
        } else if (typeof value === 'object' && value !== null) {
          const result = checkForXSS(value);
          if (result) return result;
        }
      }
    }
    return null;
  };
  
  if (req.body) {
    const result = checkForXSS(req.body);
    if (result) return result;
  }
  
  if (req.query) {
    const result = checkForXSS(req.query);
    if (result) return result;
  }
  
  next();
}

/**
 * Request size limiter
 */
function limitRequestSize(maxSize = '10mb') {
  return (req, res, next) => {
    const contentLength = parseInt(req.headers['content-length']);
    const maxBytes = parseSize(maxSize);
    
    if (contentLength > maxBytes) {
      logSecurityEvent('REQUEST_SIZE_EXCEEDED', { 
        contentLength, 
        maxSize: maxBytes 
      }, req);
      return res.status(413).json({ 
        error: 'Request too large',
        code: 'REQUEST_TOO_LARGE'
      });
    }
    
    next();
  };
}

/**
 * Parse size string to bytes
 */
function parseSize(size) {
  const units = { b: 1, kb: 1024, mb: 1024 * 1024, gb: 1024 * 1024 * 1024 };
  const match = size.toString().toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)?$/);
  
  if (!match) return 0;
  
  const value = parseFloat(match[1]);
  const unit = match[2] || 'b';
  
  return Math.floor(value * units[unit]);
}

/**
 * IP whitelist middleware (for admin endpoints)
 */
function ipWhitelist(allowedIPs = []) {
  return (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    
    // In development, allow localhost
    if (process.env.NODE_ENV === 'development') {
      const localhostIPs = ['127.0.0.1', '::1', '::ffff:127.0.0.1'];
      if (localhostIPs.includes(clientIP)) {
        return next();
      }
    }
    
    if (allowedIPs.length > 0 && !allowedIPs.includes(clientIP)) {
      logSecurityEvent('IP_BLOCKED', { clientIP, allowedIPs }, req);
      return res.status(403).json({ 
        error: 'Access denied from this IP address',
        code: 'IP_BLOCKED'
      });
    }
    
    next();
  };
}

/**
 * Comprehensive security middleware stack
 */
function applySecurity(app) {
  // Security headers
  app.use(securityHeaders());
  
  // Request sanitization
  app.use(sanitizeRequest);
  
  // SQL injection protection
  app.use(preventSQLInjection);
  
  // XSS protection
  app.use(preventXSS);
  
  // Request size limiting
  app.use(limitRequestSize('10mb'));
  
  console.log('🔒 Security middleware applied');
}

module.exports = {
  securityHeaders,
  sanitizeRequest,
  preventSQLInjection,
  preventXSS,
  limitRequestSize,
  ipWhitelist,
  applySecurity
};
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

/**
 * Security Middleware for Career Copilot
 * Protects against common attacks: SQL injection, XSS, CSRF, DDoS, etc.
 */

// 1. Rate Limiting - Prevent DDoS and brute force attacks
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limit for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Only 5 login attempts per 15 minutes
  message: 'Too many login attempts, please try again after 15 minutes.',
  skipSuccessfulRequests: true, // Don't count successful logins
});

// Payment endpoint rate limiting
const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Max 10 payment attempts per hour
  message: 'Too many payment attempts, please try again later.',
});

// AI endpoint rate limiting (expensive operations)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Max 10 AI requests per minute
  message: 'Too many AI requests, please slow down.',
});

// 2. Input Validation Middleware
function validateInput(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Invalid input',
        details: error.details.map((d) => d.message),
      });
    }
    next();
  };
}

// 3. SQL Injection Protection (for DynamoDB/RDS)
function sanitizeInput(req, res, next) {
  // Remove any potential SQL injection characters
  const sanitize = (obj) => {
    if (typeof obj === 'string') {
      // Remove SQL keywords and special characters
      return obj
        .replace(/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi, '')
        .replace(/[;'"\\]/g, '')
        .trim();
    }
    if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach((key) => {
        obj[key] = sanitize(obj[key]);
      });
    }
    return obj;
  };

  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);
  next();
}

// 4. CSRF Protection
function csrfProtection(req, res, next) {
  // Verify CSRF token for state-changing operations
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const csrfToken = req.headers['x-csrf-token'];
    const sessionToken = req.session?.csrfToken;

    if (!csrfToken || csrfToken !== sessionToken) {
      return res.status(403).json({ error: 'Invalid CSRF token' });
    }
  }
  next();
}

// 5. Admin Route Protection
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

// 6. API Key Validation (for external integrations)
function validateApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }

  // Validate API key (check against database)
  // TODO: Implement API key validation
  const validApiKeys = process.env.VALID_API_KEYS?.split(',') || [];

  if (!validApiKeys.includes(apiKey)) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  next();
}

// 7. Content Security Policy
function setupCSP(app) {
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://js.stripe.com'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
        connectSrc: ["'self'", 'https://api.stripe.com', 'https://*.amazonaws.com'],
        frameSrc: ["'self'", 'https://js.stripe.com'],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    })
  );
}

// 8. Request Size Limiting (prevent large payload attacks)
function limitRequestSize(req, res, next) {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const contentLength = parseInt(req.headers['content-length'] || '0');

  if (contentLength > maxSize) {
    return res.status(413).json({ error: 'Request too large' });
  }
  next();
}

// 9. Suspicious Activity Detection
const suspiciousPatterns = [
  /<script[^>]*>.*?<\/script>/gi, // XSS attempts
  /javascript:/gi, // JavaScript protocol
  /on\w+\s*=/gi, // Event handlers
  /\bUNION\b.*\bSELECT\b/gi, // SQL injection
  /\bDROP\b.*\bTABLE\b/gi, // SQL injection
  /../g, // Path traversal
];

function detectSuspiciousActivity(req, res, next) {
  const checkString = JSON.stringify(req.body) + JSON.stringify(req.query);

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(checkString)) {
      console.warn('Suspicious activity detected:', {
        ip: req.ip,
        path: req.path,
        pattern: pattern.toString(),
      });

      // Log to security monitoring service
      // TODO: Send alert to admin

      return res.status(400).json({ error: 'Invalid request detected' });
    }
  }
  next();
}

// 10. IP Whitelist/Blacklist
const blacklistedIPs = new Set();

function checkIPBlacklist(req, res, next) {
  const clientIP = req.ip || req.connection.remoteAddress;

  if (blacklistedIPs.has(clientIP)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
}

function addToBlacklist(ip) {
  blacklistedIPs.add(ip);
  console.log('IP blacklisted:', ip);
}

// 11. Secure Headers
function setupSecureHeaders(app) {
  app.use(helmet()); // Sets various HTTP headers for security
  app.use(helmet.hidePoweredBy()); // Hide X-Powered-By header
  app.use(helmet.noSniff()); // Prevent MIME type sniffing
  app.use(helmet.frameguard({ action: 'deny' })); // Prevent clickjacking
  app.use(helmet.xssFilter()); // XSS protection
  app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true })); // HTTPS enforcement
}

// 12. Request Logging (for security audits)
function securityLogger(req, res, next) {
  const logData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    userId: req.user?.userId,
  };

  // Log sensitive operations
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    console.log('Security log:', logData);
    // TODO: Send to CloudWatch or security monitoring service
  }

  next();
}

module.exports = {
  generalLimiter,
  authLimiter,
  paymentLimiter,
  aiLimiter,
  validateInput,
  sanitizeInput,
  csrfProtection,
  requireAdmin,
  validateApiKey,
  setupCSP,
  setupSecureHeaders,
  limitRequestSize,
  detectSuspiciousActivity,
  checkIPBlacklist,
  addToBlacklist,
  securityLogger,
  mongoSanitize: mongoSanitize(),
  xss: xss(),
  hpp: hpp(),
};

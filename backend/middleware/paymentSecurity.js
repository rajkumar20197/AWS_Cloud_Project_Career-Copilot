const rateLimit = require('express-rate-limit');

/**
 * Payment Security Middleware
 * Advanced fraud detection and payment security
 */

// Track payment attempts per user
const paymentAttempts = new Map();

// Suspicious payment patterns
const suspiciousPatterns = {
  rapidPayments: 3, // Max 3 payments in 10 minutes
  failedAttempts: 5, // Max 5 failed attempts per hour
  unusualAmounts: [0.01, 999999], // Suspicious amounts
};

/**
 * Payment fraud detection middleware
 */
function detectPaymentFraud(req, res, next) {
  const userId = req.user?.userId;
  const clientIP = req.ip;
  const userAgent = req.headers['user-agent'];
  const amount = req.body.amount;

  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Check for rapid payment attempts
  const userKey = `${userId}-${clientIP}`;
  const now = Date.now();
  const attempts = paymentAttempts.get(userKey) || [];
  
  // Clean old attempts (older than 10 minutes)
  const recentAttempts = attempts.filter(time => now - time < 10 * 60 * 1000);
  
  if (recentAttempts.length >= suspiciousPatterns.rapidPayments) {
    console.warn('Rapid payment attempts detected:', {
      userId,
      clientIP,
      attempts: recentAttempts.length,
    });
    
    return res.status(429).json({ 
      error: 'Too many payment attempts. Please wait before trying again.',
      retryAfter: 600 // 10 minutes
    });
  }

  // Track this attempt
  recentAttempts.push(now);
  paymentAttempts.set(userKey, recentAttempts);

  // Check for suspicious amounts
  if (amount && (amount < 0.1 || amount > 10000)) {
    console.warn('Suspicious payment amount:', {
      userId,
      clientIP,
      amount,
    });
    
    // Don't block, but flag for review
    req.flaggedForReview = true;
  }

  // Check for suspicious user agent patterns
  const suspiciousUAPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
  ];

  if (suspiciousUAPatterns.some(pattern => pattern.test(userAgent))) {
    console.warn('Suspicious user agent for payment:', {
      userId,
      clientIP,
      userAgent,
    });
    
    return res.status(403).json({ error: 'Payment not allowed' });
  }

  next();
}

/**
 * Validate payment data
 */
function validatePaymentData(req, res, next) {
  const { plan } = req.body;

  // Validate plan
  const validPlans = ['pro', 'premium'];
  if (!plan || !validPlans.includes(plan.toLowerCase())) {
    return res.status(400).json({ 
      error: 'Invalid plan selected',
      validPlans 
    });
  }

  // Sanitize plan name
  req.body.plan = plan.toLowerCase();

  next();
}

/**
 * Log payment security events
 */
function logPaymentSecurity(req, res, next) {
  const originalSend = res.send;
  
  res.send = function(data) {
    // Log payment attempt
    const logData = {
      timestamp: new Date().toISOString(),
      userId: req.user?.userId,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      plan: req.body.plan,
      success: res.statusCode < 400,
      statusCode: res.statusCode,
      flagged: req.flaggedForReview || false,
    };

    console.log('Payment security log:', logData);
    
    // TODO: Send to security monitoring service
    // await sendToSecurityMonitoring(logData);

    originalSend.call(this, data);
  };

  next();
}

/**
 * Enhanced payment rate limiting
 */
const enhancedPaymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Max 5 payment attempts per hour per IP
  keyGenerator: (req) => {
    // Combine IP and user ID for more accurate limiting
    return `${req.ip}-${req.user?.userId || 'anonymous'}`;
  },
  message: {
    error: 'Payment rate limit exceeded',
    retryAfter: 3600,
    message: 'Too many payment attempts. Please try again in 1 hour.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  detectPaymentFraud,
  validatePaymentData,
  logPaymentSecurity,
  enhancedPaymentLimiter,
};
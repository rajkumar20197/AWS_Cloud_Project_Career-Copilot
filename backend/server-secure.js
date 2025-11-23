const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const security = require('./middleware/security');
const { authenticateToken } = require('./middleware/auth');

// Load environment variables
dotenv.config();

const app = express();

// ============================================
// SECURITY MIDDLEWARE (Apply First!)
// ============================================

// 1. Setup secure HTTP headers
security.setupSecureHeaders(app);
security.setupCSP(app);

// 2. Rate limiting (prevent DDoS)
app.use('/api/', security.generalLimiter);

// 3. Request size limiting
app.use(security.limitRequestSize);

// 4. IP blacklist check
app.use(security.checkIPBlacklist);

// 5. Security logging
app.use(security.securityLogger);

// 6. Suspicious activity detection
app.use(security.detectSuspiciousActivity);

// 7. Input sanitization
app.use(security.sanitizeInput);
app.use(security.mongoSanitize); // NoSQL injection protection
app.use(security.xss); // XSS protection
app.use(security.hpp); // HTTP parameter pollution protection

// ============================================
// STANDARD MIDDLEWARE
// ============================================

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-API-Key'],
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// ROUTES WITH SPECIFIC SECURITY
// ============================================

// Public routes (no auth required)
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Authentication routes (strict rate limiting)
app.use('/api/auth', security.authLimiter);
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Payment routes (payment rate limiting + auth required)
app.use('/api/payment', security.paymentLimiter, authenticateToken);
const paymentRoutes = require('./routes/payment');
app.use('/api/payment', paymentRoutes);

// AI routes (AI rate limiting + auth required)
app.use('/api/ai', security.aiLimiter, authenticateToken);
const aiRoutes = require('./routes/ai');
app.use('/api/ai', aiRoutes);

// User routes (auth required)
app.use('/api/users', authenticateToken);
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

// Admin routes (auth + admin role required)
app.use('/api/admin', authenticateToken, security.requireAdmin);
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(err.status || 500).json({
    error: isDevelopment ? err.message : 'Internal server error',
    ...(isDevelopment && { stack: err.stack }),
  });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔒 Secure server running on port ${PORT}`);
  console.log(`🛡️  Security features enabled:`);
  console.log(`   ✓ Rate limiting`);
  console.log(`   ✓ SQL injection protection`);
  console.log(`   ✓ XSS protection`);
  console.log(`   ✓ CSRF protection`);
  console.log(`   ✓ Secure headers`);
  console.log(`   ✓ Input sanitization`);
  console.log(`   ✓ Request size limiting`);
  console.log(`   ✓ Suspicious activity detection`);
});

module.exports = app;

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const router = express.Router();

// Rate limiting for admin endpoints - more restrictive
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 requests per windowMs (reduced from 5)
  message: {
    error: 'Too many login attempts, please try again later.',
    retryAfter: 15 * 60 * 1000
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Additional rate limiter for MFA attempts
const mfaLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // limit each IP to 5 MFA attempts per 5 minutes
  message: {
    error: 'Too many MFA attempts, please try again later.',
    retryAfter: 5 * 60 * 1000
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Mock admin users (in production, this would be in a database)
const adminUsers = [
  {
    id: 1,
    email: 'admin@aicareeragentcoach.com',
    password: '$2b$12$dUo9YQXZQCfSfIWEb3zLEOCRTYcRcEWFYWvnFPDmRuIf.pIpFLo9.', // password123
    name: 'System Administrator',
    role: 'super_admin',
    mfaEnabled: true,
    mfaSecret: 'JBSWY3DPEHPK3PXP' // Mock TOTP secret
  },
  {
    id: 2,
    email: 'admin@gmail.com',
    password: '$2b$12$dUo9YQXZQCfSfIWEb3zLEOCRTYcRcEWFYWvnFPDmRuIf.pIpFLo9.', // password123
    name: 'Admin User',
    role: 'admin',
    mfaEnabled: false
  }
];

// JWT secret - MUST be set in production
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('🚨 CRITICAL: JWT_SECRET environment variable is required for security');
  process.exit(1);
}

// Middleware to verify admin JWT token
const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Admin login endpoint
router.post('/login', adminLoginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Input validation and sanitization
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const sanitizedEmail = email.toLowerCase().trim();

    // Find admin user using sanitized email
    const admin = adminUsers.find(user => user.email.toLowerCase() === sanitizedEmail);
    if (!admin) {
      // Log failed login attempt
      console.warn(`🚨 Failed admin login attempt for email: ${sanitizedEmail} from IP: ${req.ip}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      // Log failed password attempt
      console.warn(`🚨 Failed password attempt for admin: ${admin.email} from IP: ${req.ip}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const tokenPayload = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      type: 'admin'
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '8h' });

    // Log admin login
    console.log(`🔐 Admin login: ${admin.email} at ${new Date().toISOString()}`);

    res.json({
      success: true,
      requiresMFA: admin.mfaEnabled,
      token: admin.mfaEnabled ? null : token, // Don't send token if MFA required
      tempToken: admin.mfaEnabled ? jwt.sign({ ...tokenPayload, temp: true }, JWT_SECRET, { expiresIn: '10m' }) : null,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// MFA verification endpoint
router.post('/verify-mfa', mfaLimiter, async (req, res) => {
  try {
    const { code } = req.body;
    const authHeader = req.headers.authorization;
    const tempToken = authHeader && authHeader.split(' ')[1];

    if (!tempToken) {
      return res.status(401).json({ error: 'Temporary token required' });
    }

    if (!code || code.length !== 6) {
      return res.status(400).json({ error: 'Valid 6-digit MFA code required' });
    }

    // Verify temporary token
    const decoded = jwt.verify(tempToken, JWT_SECRET);
    if (!decoded.temp) {
      return res.status(401).json({ error: 'Invalid temporary token' });
    }

    // Find admin user
    const admin = adminUsers.find(user => user.id === decoded.id);
    if (!admin) {
      return res.status(401).json({ error: 'Admin user not found' });
    }

    // For demo purposes, accept any 6-digit code
    // In production, verify against TOTP using libraries like 'speakeasy'
    if (!/^\d{6}$/.test(code)) {
      return res.status(401).json({ error: 'Invalid MFA code' });
    }

    // Generate final JWT token
    const tokenPayload = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      type: 'admin'
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '8h' });

    console.log(`🔐 Admin MFA verified: ${admin.email} at ${new Date().toISOString()}`);

    res.json({
      success: true,
      token,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('MFA verification error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get admin dashboard stats
router.get('/stats', verifyAdminToken, async (req, res) => {
  try {
    // Mock dashboard statistics
    const stats = {
      totalUsers: 12847,
      activeUsers: 3421,
      revenue: 89750,
      securityAlerts: 2,
      systemHealth: 'healthy',
      lastUpdated: new Date().toISOString()
    };

    res.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get users (paginated)
router.get('/users', verifyAdminToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    // Mock user data
    const mockUsers = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      status: ['active', 'suspended', 'banned'][Math.floor(Math.random() * 3)],
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    }));

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const users = mockUsers.slice(startIndex, endIndex);

    res.json({
      users,
      pagination: {
        page,
        limit,
        total: mockUsers.length,
        pages: Math.ceil(mockUsers.length / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user status
router.put('/users/:userId/status', verifyAdminToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!['active', 'suspended', 'banned'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    console.log(`🔧 Admin ${req.user.email} updated user ${userId} status to ${status}`);

    res.json({
      success: true,
      message: `User ${userId} status updated to ${status}`
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get security logs
router.get('/security/logs', verifyAdminToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;

    // Mock security logs
    const mockLogs = Array.from({ length: 200 }, (_, i) => ({
      id: i + 1,
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      type: ['login', 'logout', 'failed_login', 'permission_denied'][Math.floor(Math.random() * 4)],
      userId: Math.floor(Math.random() * 1000) + 1,
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
    }));

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const logs = mockLogs.slice(startIndex, endIndex);

    res.json({
      logs,
      pagination: {
        page,
        limit,
        total: mockLogs.length,
        pages: Math.ceil(mockLogs.length / limit)
      }
    });
  } catch (error) {
    console.error('Get security logs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin logout
router.post('/logout', verifyAdminToken, (req, res) => {
  console.log(`🔐 Admin logout: ${req.user.email} at ${new Date().toISOString()}`);
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;
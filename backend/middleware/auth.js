const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * Authentication & Authorization Middleware
 * Secure JWT-based authentication with role-based access control
 */

// JWT Secret (should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this';
const JWT_EXPIRES_IN = '7d'; // Token expires in 7 days

/**
 * Generate JWT token
 */
function generateToken(userId, email, role = 'user') {
  return jwt.sign(
    {
      userId,
      email,
      role,
      iat: Date.now(),
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Verify JWT token
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Authentication middleware - Verify JWT token
 */
function authenticateToken(req, res, next) {
  // Get token from header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  // Verify token
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  // Check if token is expired
  if (decoded.exp && decoded.exp < Date.now() / 1000) {
    return res.status(403).json({ error: 'Token expired' });
  }

  // Attach user info to request
  req.user = {
    userId: decoded.userId,
    email: decoded.email,
    role: decoded.role || 'user',
  };

  next();
}

/**
 * Optional authentication - Don't fail if no token
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role || 'user',
      };
    }
  }

  next();
}

/**
 * Hash password
 */
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare password with hash
 */
async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Validate password strength
 */
function validatePasswordStrength(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  if (!hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!hasNumbers) {
    errors.push('Password must contain at least one number');
  }
  if (!hasSpecialChar) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Require specific role
 */
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ error: `${role} access required` });
    }

    next();
  };
}

/**
 * Check if user owns resource
 */
function requireOwnership(req, res, next) {
  const resourceUserId = req.params.userId || req.body.userId;

  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Admin can access any resource
  if (req.user.role === 'admin') {
    return next();
  }

  // User can only access their own resources
  if (req.user.userId !== resourceUserId) {
    return res.status(403).json({ error: 'Access denied' });
  }

  next();
}

/**
 * Refresh token
 */
function refreshToken(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' });
  }

  const decoded = verifyToken(refreshToken);

  if (!decoded) {
    return res.status(403).json({ error: 'Invalid refresh token' });
  }

  // Generate new access token
  const newToken = generateToken(decoded.userId, decoded.email, decoded.role);

  res.json({ token: newToken });
}

module.exports = {
  generateToken,
  verifyToken,
  authenticateToken,
  optionalAuth,
  hashPassword,
  comparePassword,
  validatePasswordStrength,
  requireRole,
  requireOwnership,
  refreshToken,
};

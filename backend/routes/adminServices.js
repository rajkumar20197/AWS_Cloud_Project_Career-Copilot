const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const router = express.Router();

// Middleware to verify admin token (reuse from admin.js)
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('🚨 CRITICAL: JWT_SECRET environment variable is required for security');
  process.exit(1);
}

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

// Encryption utilities for sensitive data
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
if (!ENCRYPTION_KEY) {
  console.error('🚨 CRITICAL: ENCRYPTION_KEY environment variable is required for security');
  process.exit(1);
}
const IV_LENGTH = 16;

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text) {
  try {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = textParts.join(':');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
}

// Get service status
router.get('/status', verifyAdminToken, async (req, res) => {
  try {
    const emailService = require('../services/emailService');
    const calendarService = require('../services/googleCalendarService');

    const emailStatus = emailService.getEmailServiceStatus();
    const calendarStatus = calendarService.getStatus();

    res.json({
      email: {
        ...emailStatus,
        lastTested: await getLastTestTime('email')
      },
      calendar: {
        ...calendarStatus,
        lastTested: await getLastTestTime('calendar')
      }
    });
  } catch (error) {
    console.error('Get service status error:', error);
    res.status(500).json({ error: 'Failed to get service status' });
  }
});

// Configure email service
router.post('/email/configure', verifyAdminToken, async (req, res) => {
  try {
    const { host, port, user, password, from, replyTo } = req.body;

    if (!user || !password) {
      return res.status(400).json({ error: 'Email user and password are required' });
    }

    // Validate and sanitize email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(user)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Sanitize inputs to prevent injection attacks
    const sanitizedUser = user.toLowerCase().trim();
    const sanitizedHost = (host || 'smtp.gmail.com').trim();
    const sanitizedPort = parseInt(port) || 587;
    
    if (sanitizedPort < 1 || sanitizedPort > 65535) {
      return res.status(400).json({ error: 'Invalid port number' });
    }

    // Create environment configuration with sanitized inputs
    const envConfig = {
      EMAIL_HOST: sanitizedHost,
      EMAIL_PORT: sanitizedPort.toString(),
      EMAIL_USER: sanitizedUser,
      EMAIL_PASSWORD: encrypt(password), // Encrypt password
      EMAIL_FROM: from || `"AI Career Agent Coach" <noreply@aicareeragentcoach.com>`,
      EMAIL_REPLY_TO: replyTo || 'support@aicareeragentcoach.com'
    };

    // Update environment variables
    await updateEnvFile(envConfig);

    // Update process.env for immediate effect with sanitized values
    process.env.EMAIL_HOST = sanitizedHost;
    process.env.EMAIL_PORT = sanitizedPort.toString();
    process.env.EMAIL_USER = sanitizedUser;
    process.env.EMAIL_PASSWORD = password; // Use plain password in memory
    process.env.EMAIL_FROM = envConfig.EMAIL_FROM;
    process.env.EMAIL_REPLY_TO = envConfig.EMAIL_REPLY_TO;

    // Reinitialize email service
    delete require.cache[require.resolve('../services/emailService')];
    const emailService = require('../services/emailService');

    console.log(`🔧 Admin ${req.user.email} configured email service for ${sanitizedUser}`);

    res.json({
      success: true,
      message: 'Email service configured successfully',
      status: emailService.getEmailServiceStatus()
    });

  } catch (error) {
    console.error('Configure email service error:', error);
    res.status(500).json({ error: 'Failed to configure email service' });
  }
});

// Configure calendar service
router.post('/calendar/configure', verifyAdminToken, async (req, res) => {
  try {
    const { clientId, clientSecret, redirectUri } = req.body;

    if (!clientId || !clientSecret) {
      return res.status(400).json({ error: 'Client ID and Client Secret are required' });
    }

    // Validate and sanitize Google OAuth credentials
    const sanitizedClientId = clientId.trim();
    const sanitizedRedirectUri = (redirectUri || 'http://localhost:5000/api/calendar/auth/callback').trim();
    
    // Basic validation for Google Client ID format
    if (!sanitizedClientId.includes('.apps.googleusercontent.com')) {
      return res.status(400).json({ error: 'Invalid Google Client ID format' });
    }

    // Create environment configuration with sanitized inputs
    const envConfig = {
      GOOGLE_CLIENT_ID: sanitizedClientId,
      GOOGLE_CLIENT_SECRET: encrypt(clientSecret), // Encrypt secret
      GOOGLE_REDIRECT_URI: sanitizedRedirectUri
    };

    // Update environment variables
    await updateEnvFile(envConfig);

    // Update process.env for immediate effect with sanitized values
    process.env.GOOGLE_CLIENT_ID = sanitizedClientId;
    process.env.GOOGLE_CLIENT_SECRET = clientSecret; // Use plain secret in memory
    process.env.GOOGLE_REDIRECT_URI = sanitizedRedirectUri;

    // Reinitialize calendar service
    delete require.cache[require.resolve('../services/googleCalendarService')];
    const calendarService = require('../services/googleCalendarService');

    console.log(`🔧 Admin ${req.user.email} configured calendar service`);

    res.json({
      success: true,
      message: 'Calendar service configured successfully',
      status: calendarService.getStatus()
    });

  } catch (error) {
    console.error('Configure calendar service error:', error);
    res.status(500).json({ error: 'Failed to configure calendar service' });
  }
});

// Test email service
router.post('/email/test', verifyAdminToken, async (req, res) => {
  try {
    const { to } = req.body;
    const emailService = require('../services/emailService');

    const testEmail = to || process.env.EMAIL_USER || 'test@example.com';
    const result = await emailService.sendTestEmail(testEmail);

    await saveLastTestTime('email');

    console.log(`🧪 Admin ${req.user.email} tested email service - sent to ${testEmail}`);

    res.json({
      success: true,
      message: `Test email sent successfully to ${testEmail}`,
      messageId: result.messageId
    });

  } catch (error) {
    console.error('Test email service error:', error);
    res.status(500).json({ 
      error: 'Email test failed',
      details: error.message 
    });
  }
});

// Test calendar service
router.post('/calendar/test', verifyAdminToken, async (req, res) => {
  try {
    const calendarService = require('../services/googleCalendarService');

    // Test by getting upcoming events
    const events = await calendarService.getUpcomingEvents(5);

    await saveLastTestTime('calendar');

    console.log(`🧪 Admin ${req.user.email} tested calendar service`);

    res.json({
      success: true,
      message: 'Calendar service test completed successfully',
      eventsFound: events.items ? events.items.length : 0
    });

  } catch (error) {
    console.error('Test calendar service error:', error);
    res.status(500).json({ 
      error: 'Calendar test failed',
      details: error.message 
    });
  }
});

// Helper function to update .env file
async function updateEnvFile(newConfig) {
  const envPath = path.join(__dirname, '../.env');
  
  try {
    // Read existing .env file
    let envContent = '';
    try {
      envContent = await fs.readFile(envPath, 'utf8');
    } catch (error) {
      // File doesn't exist, create new
      console.log('Creating new .env file');
    }

    // Parse existing environment variables
    const envVars = {};
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    });

    // Update with new configuration
    Object.assign(envVars, newConfig);

    // Generate new .env content
    const newEnvContent = Object.entries(envVars)
      .filter(([key, value]) => key && value !== undefined)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // Write back to .env file
    await fs.writeFile(envPath, newEnvContent, 'utf8');
    console.log('✅ Environment configuration updated');

  } catch (error) {
    console.error('❌ Failed to update .env file:', error);
    throw new Error('Failed to save configuration');
  }
}

// Helper function to save last test time
async function saveLastTestTime(service) {
  try {
    const testDataPath = path.join(__dirname, '../data/service-tests.json');
    
    let testData = {};
    try {
      const data = await fs.readFile(testDataPath, 'utf8');
      testData = JSON.parse(data);
    } catch (error) {
      // File doesn't exist, create new
      await fs.mkdir(path.dirname(testDataPath), { recursive: true });
    }

    testData[service] = new Date().toISOString();
    await fs.writeFile(testDataPath, JSON.stringify(testData, null, 2));
  } catch (error) {
    console.error('Failed to save test time:', error);
  }
}

// Helper function to get last test time
async function getLastTestTime(service) {
  try {
    const testDataPath = path.join(__dirname, '../data/service-tests.json');
    const data = await fs.readFile(testDataPath, 'utf8');
    const testData = JSON.parse(data);
    return testData[service] || null;
  } catch (error) {
    return null;
  }
}

module.exports = router;
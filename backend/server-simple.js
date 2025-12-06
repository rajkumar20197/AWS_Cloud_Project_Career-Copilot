require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true,
});

// CORS with specific origins (update for production)
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://aicareeragentcoach.com', 'https://aicareeragentcoach.agency']
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Import services for status checking
const emailService = require('./services/emailService');
const googleCalendarService = require('./services/googleCalendarService');

// Routes
app.get('/', (req, res) => {
  const emailStatus = emailService.getEmailServiceStatus();
  const calendarStatus = googleCalendarService.getStatus();
  
  res.json({ 
    message: '🚀 AI Career Agent Coach Backend Server',
    status: 'running',
    timestamp: new Date().toISOString(),
    services: {
      email: emailStatus,
      calendar: calendarStatus,
      admin: {
        configured: true,
        service: 'Admin API',
        status: '✅ Ready',
        endpoints: ['/api/admin/login', '/api/admin/stats', '/api/admin/users']
      }
    },
    features: {
      gmail: emailStatus.status,
      calendar: calendarStatus.status,
      admin: '✅ API Ready',
      authentication: '✅ JWT + MFA',
      security: '✅ Enterprise Grade'
    }
  });
});

// API Routes
const adminRoutes = require('./routes/admin');
const adminServicesRoutes = require('./routes/adminServices');
const authRoutes = require('./routes/auth');
const emailRoutes = require('./routes/email');
const calendarRoutes = require('./routes/calendar');
const aiRoutes = require('./routes/ai');

app.use('/api/admin', authLimiter, adminRoutes);
app.use('/api/admin/services', adminServicesRoutes);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/ai', aiRoutes);

// Legacy email test route (keeping for compatibility)
app.post('/api/test/email', async (req, res) => {
  try {
    const { to, subject, body } = req.body;
    await emailService.sendTestEmail(to || 'test@example.com');
    res.json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Profile routes (in-memory storage for demo)
let profiles = {};

// Save user profile
app.post('/api/users/profile', (req, res) => {
  try {
    const { userId, email, name, profile, isStudent, major, university, currentSemester, graduationDate, studyGoalsPerWeek, totalPoints, currentStreak, level } = req.body;
    
    const userProfile = {
      userId,
      email,
      name,
      profile,
      isStudent,
      studentProfile: isStudent ? {
        major,
        university,
        currentSemester,
        graduationDate,
        studyGoalsPerWeek
      } : undefined,
      progress: {
        totalPoints: totalPoints || 0,
        currentStreak: currentStreak || 0,
        level: level || 1,
        questionsAttempted: 0,
        questionsSolved: 0
      },
      createdAt: new Date().toISOString()
    };
    
    profiles[userId] = userProfile;
    
    console.log('✅ Profile saved for user:', userId);
    res.json({ success: true, user: userProfile });
  } catch (error) {
    console.error('❌ Error saving profile:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user profile
app.get('/api/users/profile/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const userProfile = profiles[userId];
    
    if (!userProfile) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }
    
    console.log('✅ Profile loaded for user:', userId);
    res.json({ success: true, user: userProfile });
  } catch (error) {
    console.error('❌ Error getting profile:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update user profile
app.put('/api/users/profile/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    
    if (!profiles[userId]) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }
    
    profiles[userId] = { ...profiles[userId], ...updates, updatedAt: new Date().toISOString() };
    
    console.log('✅ Profile updated for user:', userId);
    res.json({ success: true, user: profiles[userId] });
  } catch (error) {
    console.error('❌ Error updating profile:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    gmail: process.env.EMAIL_USER ? '✅' : '❌',
    calendar: process.env.GOOGLE_CLIENT_ID ? '✅' : '❌'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Career Copilot Backend running on port ${PORT}`);
  console.log(`📧 Gmail SMTP: ${process.env.EMAIL_USER ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`📅 Google Calendar: ${process.env.GOOGLE_CLIENT_ID ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
});
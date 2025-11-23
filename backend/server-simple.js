require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Career Copilot Backend Server',
    status: 'running',
    features: {
      gmail: '✅ Configured',
      calendar: '✅ Configured',
      email: '✅ Working'
    }
  });
});

// Email routes
const emailService = require('./services/emailService');

app.post('/api/test/email', async (req, res) => {
  try {
    const { to, subject, body } = req.body;
    await emailService.sendTestEmail(to || 'rajkumarthota20197@gmail.com');
    res.json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Google Calendar routes
const googleRoutes = require('./routes/google');
app.use('/api/google', googleRoutes);

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
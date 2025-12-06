const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const router = express.Router();

// Initialize DynamoDB
const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Utility functions
const generateUserId = () => {
  return 'user_' + crypto.randomBytes(16).toString('hex');
};

const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const hashPassword = async (password) => {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
  return await bcrypt.hash(password, saltRounds);
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 8;
};

// Send welcome email
const sendWelcomeEmail = async (email, firstName) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Welcome to AI Career Agent Coach! 🚀',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to AI Career Coach!</h1>
        </div>
        
        <div style="padding: 40px 20px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${firstName}! 👋</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Welcome to your AI-powered career advancement platform! We're excited to help you achieve your career goals.
          </p>
          
          <div style="background: white; padding: 30px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-bottom: 15px;">🎯 What You Can Do Now:</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li><strong>AI Resume Analysis:</strong> Get instant feedback on your resume</li>
              <li><strong>Job Matching:</strong> Find perfect job opportunities</li>
              <li><strong>Interview Prep:</strong> Practice with AI-powered mock interviews</li>
              <li><strong>Salary Negotiation:</strong> Get personalized negotiation strategies</li>
              <li><strong>Calendar Integration:</strong> Schedule and track your job search activities</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/dashboard" 
               style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Get Started Now →
            </a>
          </div>
          
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #1976d2; margin-bottom: 10px;">💡 Pro Tip:</h4>
            <p style="color: #666; margin: 0;">
              Start by uploading your resume for an AI analysis. Our system will provide personalized recommendations to improve your chances of landing your dream job!
            </p>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-top: 30px;">
            If you have any questions, just reply to this email. We're here to help you succeed!
          </p>
          
          <p style="color: #666;">
            Best regards,<br>
            <strong>The AI Career Coach Team</strong>
          </p>
        </div>
        
        <div style="background: #333; padding: 20px; text-align: center;">
          <p style="color: #999; margin: 0; font-size: 14px;">
            © 2025 AI Career Agent Coach. All rights reserved.
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Reset Your AI Career Coach Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #f44336; padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset Request</h1>
        </div>
        
        <div style="padding: 40px 20px; background: #f8f9fa;">
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            You requested a password reset for your AI Career Coach account.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: #f44336; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            This link will expire in 1 hour. If you didn't request this reset, please ignore this email.
          </p>
          
          <p style="color: #999; font-size: 14px; margin-top: 30px;">
            If the button doesn't work, copy and paste this link: ${resetUrl}
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, jobTitle, experience, goals } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password || !jobTitle) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    // Check if user already exists
    const existingUser = await docClient.send(new GetCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: { email }
    }));

    if (existingUser.Item) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const userId = generateUserId();
    const user = {
      userId,
      email,
      firstName,
      lastName,
      password: hashedPassword,
      jobTitle,
      experience: experience || 'entry',
      goals: goals || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      subscription: {
        plan: 'free',
        status: 'active',
        startDate: new Date().toISOString()
      },
      profile: {
        completionScore: 25, // Basic info completed
        resumeUploaded: false,
        calendarConnected: false,
        firstLogin: true
      }
    };

    // Save to DynamoDB
    await docClient.send(new PutCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: user
    }));

    // Generate JWT token
    const token = generateToken(userId, email);

    // Send welcome email (don't wait for it)
    sendWelcomeEmail(email, firstName).catch(console.error);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        userId,
        email,
        firstName,
        lastName,
        jobTitle,
        experience,
        goals,
        subscription: user.subscription,
        profile: user.profile
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Get user from database
    const result = await docClient.send(new GetCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: { email }
    }));

    const user = result.Item;
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Update last login
    await docClient.send(new UpdateCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: { email },
      UpdateExpression: 'SET lastLogin = :lastLogin, #profile.firstLogin = :firstLogin',
      ExpressionAttributeNames: {
        '#profile': 'profile'
      },
      ExpressionAttributeValues: {
        ':lastLogin': new Date().toISOString(),
        ':firstLogin': false
      }
    }));

    // Generate JWT token
    const tokenExpiry = rememberMe ? '30d' : '7d';
    const token = jwt.sign(
      { userId: user.userId, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: tokenExpiry }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        userId: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        jobTitle: user.jobTitle,
        experience: user.experience,
        goals: user.goals,
        subscription: user.subscription,
        profile: user.profile
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user exists
    const result = await docClient.send(new GetCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: { email }
    }));

    // Always return success for security (don't reveal if email exists)
    res.json({ message: 'If an account exists with this email, you will receive reset instructions' });

    // If user exists, send reset email
    if (result.Item) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpiry = new Date(Date.now() + 3600000).toISOString(); // 1 hour

      // Save reset token
      await docClient.send(new UpdateCommand({
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Key: { email },
        UpdateExpression: 'SET resetToken = :token, resetExpiry = :expiry',
        ExpressionAttributeValues: {
          ':token': resetToken,
          ':expiry': resetExpiry
        }
      }));

      // Send reset email
      await sendPasswordResetEmail(email, resetToken);
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    if (!validatePassword(newPassword)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    // Find user with reset token
    const scanResult = await docClient.send(new ScanCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      FilterExpression: 'resetToken = :token AND resetExpiry > :now',
      ExpressionAttributeValues: {
        ':token': token,
        ':now': new Date().toISOString()
      }
    }));

    if (!scanResult.Items || scanResult.Items.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    const user = scanResult.Items[0];

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password and clear reset token
    await docClient.send(new UpdateCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: { email: user.email },
      UpdateExpression: 'SET password = :password REMOVE resetToken, resetExpiry',
      ExpressionAttributeValues: {
        ':password': hashedPassword
      }
    }));

    res.json({ message: 'Password reset successfully' });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Send welcome email endpoint
router.post('/send-welcome-email', async (req, res) => {
  try {
    const { email, firstName } = req.body;
    await sendWelcomeEmail(email, firstName);
    res.json({ message: 'Welcome email sent successfully' });
  } catch (error) {
    console.error('Send welcome email error:', error);
    res.status(500).json({ message: 'Failed to send welcome email' });
  }
});

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Get user profile (protected route)
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const result = await docClient.send(new GetCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: { email: req.user.email }
    }));

    if (!result.Item) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.Item;
    res.json({
      userId: user.userId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      jobTitle: user.jobTitle,
      experience: user.experience,
      goals: user.goals,
      subscription: user.subscription,
      profile: user.profile
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { hashPassword, comparePassword, generateToken } = require('../middleware/auth');

/**
 * Authentication Routes
 */

/**
 * POST /api/auth/forgot-password
 * Send password reset email
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    // TODO: Check if user exists in database
    // For now, we'll always send success to prevent email enumeration

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // TODO: Save resetToken and resetTokenExpiry to database

    // Send reset email
    const emailService = require('../services/emailService');
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await emailService.sendEmail(
      email,
      'Password Reset Request',
      `
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password for Career Copilot.</p>
        <p>Click the link below to reset your password:</p>
        <p><a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #3B82F6; color: white; text-decoration: none; border-radius: 8px;">Reset Password</a></p>
        <p>Or copy this link: ${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>Career Copilot Team</p>
      `
    );

    res.json({ success: true, message: 'Reset email sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to send reset email' });
  }
});

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password required' });
    }

    // TODO: Find user by reset token and check expiry
    // const user = await findUserByResetToken(token);
    // if (!user || user.resetTokenExpiry < Date.now()) {
    //   return res.status(400).json({ error: 'Invalid or expired token' });
    // }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // TODO: Update user password in database
    // await updateUserPassword(user.id, hashedPassword);
    // await clearResetToken(user.id);

    // Send confirmation email
    const emailService = require('../services/emailService');
    await emailService.sendEmail(
      'user@example.com', // TODO: Get from database
      'Password Reset Successful',
      `
        <h2>Password Reset Successful</h2>
        <p>Your password has been successfully reset.</p>
        <p>If you didn't make this change, please contact support immediately.</p>
        <p>Best regards,<br>Career Copilot Team</p>
      `
    );

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

/**
 * POST /api/auth/login
 * User login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // TODO: Find user in database
    // const user = await findUserByEmail(email);
    // if (!user) {
    //   return res.status(401).json({ error: 'Invalid credentials' });
    // }

    // TODO: Compare password
    // const isValid = await comparePassword(password, user.password);
    // if (!isValid) {
    //   return res.status(401).json({ error: 'Invalid credentials' });
    // }

    // Generate JWT token
    const token = generateToken('user-id', email, 'user');

    res.json({
      success: true,
      token,
      user: {
        id: 'user-id',
        email,
        name: 'User Name',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * POST /api/auth/register
 * User registration
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields required' });
    }

    // TODO: Check if user already exists
    // const existingUser = await findUserByEmail(email);
    // if (existingUser) {
    //   return res.status(400).json({ error: 'Email already registered' });
    // }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // TODO: Save user to database
    // const user = await createUser({ email, password: hashedPassword, name });

    // Generate JWT token
    const token = generateToken('new-user-id', email, 'user');

    // Send welcome email
    const emailService = require('../services/emailService');
    await emailService.sendEmail(
      email,
      'Welcome to Career Copilot!',
      `
        <h2>Welcome ${name}!</h2>
        <p>Thank you for joining Career Copilot!</p>
        <p>We're excited to help you on your career journey.</p>
        <p>Get started by:</p>
        <ul>
          <li>Building your first resume</li>
          <li>Setting up your profile</li>
          <li>Exploring job opportunities</li>
        </ul>
        <p><a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; padding: 12px 24px; background: #3B82F6; color: white; text-decoration: none; border-radius: 8px;">Go to Dashboard</a></p>
        <p>Best regards,<br>Career Copilot Team</p>
      `
    );

    res.json({
      success: true,
      token,
      user: {
        id: 'new-user-id',
        email,
        name,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

module.exports = router;

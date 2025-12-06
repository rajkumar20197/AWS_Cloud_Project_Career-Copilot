const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');

// Get email service status
router.get('/status', (req, res) => {
  try {
    const status = emailService.getEmailServiceStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get email status' });
  }
});

// Send test email
router.post('/test', async (req, res) => {
  try {
    const { to } = req.body;
    const testEmail = to || 'test@example.com';
    
    const result = await emailService.sendTestEmail(testEmail);
    res.json({
      success: true,
      message: `Test email sent to ${testEmail}`,
      messageId: result.messageId
    });
  } catch (error) {
    console.error('Send test email error:', error);
    res.status(500).json({ 
      error: 'Failed to send test email',
      details: error.message 
    });
  }
});

// Send welcome email
router.post('/welcome', async (req, res) => {
  try {
    const { userEmail, userName } = req.body;
    
    if (!userEmail || !userName) {
      return res.status(400).json({ 
        error: 'Missing required fields: userEmail, userName' 
      });
    }

    const result = await emailService.sendWelcomeEmail(userEmail, userName);
    res.json({
      success: true,
      message: `Welcome email sent to ${userEmail}`,
      messageId: result.messageId
    });
  } catch (error) {
    console.error('Send welcome email error:', error);
    res.status(500).json({ 
      error: 'Failed to send welcome email',
      details: error.message 
    });
  }
});

// Send interview reminder
router.post('/interview-reminder', async (req, res) => {
  try {
    const { 
      userEmail, 
      userName, 
      companyName, 
      interviewDate, 
      interviewTime, 
      meetingLink 
    } = req.body;
    
    if (!userEmail || !userName || !companyName || !interviewDate) {
      return res.status(400).json({ 
        error: 'Missing required fields: userEmail, userName, companyName, interviewDate' 
      });
    }

    const result = await emailService.sendInterviewReminderEmail(
      userEmail, 
      userName, 
      companyName, 
      interviewDate, 
      interviewTime, 
      meetingLink
    );
    
    res.json({
      success: true,
      message: `Interview reminder sent to ${userEmail}`,
      messageId: result.messageId
    });
  } catch (error) {
    console.error('Send interview reminder error:', error);
    res.status(500).json({ 
      error: 'Failed to send interview reminder',
      details: error.message 
    });
  }
});

// Send payment notification
router.post('/payment-failed', async (req, res) => {
  try {
    const { userEmail, userName, failureReason } = req.body;
    
    if (!userEmail || !userName) {
      return res.status(400).json({ 
        error: 'Missing required fields: userEmail, userName' 
      });
    }

    const result = await emailService.sendPaymentFailedEmail(
      userEmail, 
      userName, 
      failureReason || 'Payment processing failed'
    );
    
    res.json({
      success: true,
      message: `Payment failure notification sent to ${userEmail}`,
      messageId: result.messageId
    });
  } catch (error) {
    console.error('Send payment failed email error:', error);
    res.status(500).json({ 
      error: 'Failed to send payment notification',
      details: error.message 
    });
  }
});

// Send payment success notification
router.post('/payment-success', async (req, res) => {
  try {
    const { userEmail, userName, planName, amount } = req.body;
    
    if (!userEmail || !userName || !planName) {
      return res.status(400).json({ 
        error: 'Missing required fields: userEmail, userName, planName' 
      });
    }

    const result = await emailService.sendPaymentSuccessEmail(
      userEmail, 
      userName, 
      planName, 
      amount
    );
    
    res.json({
      success: true,
      message: `Payment success notification sent to ${userEmail}`,
      messageId: result.messageId
    });
  } catch (error) {
    console.error('Send payment success email error:', error);
    res.status(500).json({ 
      error: 'Failed to send payment success notification',
      details: error.message 
    });
  }
});

module.exports = router;
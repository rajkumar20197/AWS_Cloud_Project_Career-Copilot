const nodemailer = require('nodemailer');

/**
 * Email Service for Payment Notifications
 * Sends emails for payment failures, successes, etc.
 */

// Email service configuration with better error handling
let transporter = null;
let isConfigured = false;

try {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false // For development only
      }
    });
    
    // Verify connection configuration
    transporter.verify((error, success) => {
      if (error) {
        console.log('📧 Gmail SMTP: ❌ Configuration error:', error.message);
        isConfigured = false;
      } else {
        console.log('📧 Gmail SMTP: ✅ Ready to send emails');
        isConfigured = true;
      }
    });
  } else {
    console.log('📧 Gmail SMTP: ❌ Not configured (missing EMAIL_USER or EMAIL_PASSWORD)');
    isConfigured = false;
  }
} catch (error) {
  console.error('📧 Gmail SMTP initialization error:', error.message);
  isConfigured = false;
}

/**
 * Send payment failed email to user
 */
async function sendPaymentFailedEmail(userEmail, userName, failureReason) {
  const mailOptions = {
    from: '"Career Copilot" <noreply@careercopilot.com>',
    to: userEmail,
    subject: 'Payment Failed - Action Required',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Payment Failed</h1>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            
            <p>We tried to process your payment for Career Copilot, but it didn't go through.</p>
            
            <p><strong>Reason:</strong> ${failureReason}</p>
            
            <h3>What to do next:</h3>
            <ul>
              <li>Check that your card details are correct</li>
              <li>Ensure you have sufficient funds</li>
              <li>Try a different payment method</li>
              <li>Contact your bank if the issue persists</li>
            </ul>
            
            <p>Don't worry - you haven't been charged, and your account is still active for now.</p>
            
            <center>
              <a href="https://careercopilot.com/settings/billing" class="button">Update Payment Method</a>
            </center>
            
            <p>We'll try again in 24 hours. If you need help, just reply to this email.</p>
            
            <p>Best regards,<br>The Career Copilot Team</p>
          </div>
          <div class="footer">
            <p>Career Copilot | careercopilot.com</p>
            <p>You're receiving this because you have an active subscription.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Payment failed email sent to:', userEmail);
  } catch (error) {
    console.error('Error sending payment failed email:', error);
    throw error;
  }
}

/**
 * Send payment success email
 */
async function sendPaymentSuccessEmail(userEmail, userName, amount, plan) {
  const mailOptions = {
    from: '"Career Copilot" <noreply@careercopilot.com>',
    to: userEmail,
    subject: 'Payment Successful - Thank You!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .receipt { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Payment Successful!</h1>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            
            <p>Thank you for your payment! Your subscription is now active.</p>
            
            <div class="receipt">
              <h3>Receipt</h3>
              <p><strong>Plan:</strong> ${plan}</p>
              <p><strong>Amount:</strong> $${amount}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <p>You now have full access to all Career Copilot features!</p>
            
            <p>Best regards,<br>The Career Copilot Team</p>
          </div>
          <div class="footer">
            <p>Career Copilot | careercopilot.com</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Payment success email sent to:', userEmail);
  } catch (error) {
    console.error('Error sending payment success email:', error);
  }
}

module.exports = {
  sendPaymentFailedEmail,
  sendPaymentSuccessEmail,
};

/**
 * Get email service status
 */
function getEmailServiceStatus() {
  return {
    configured: isConfigured,
    service: 'Gmail SMTP',
    status: isConfigured ? '✅ Ready' : '❌ Not configured',
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    user: process.env.EMAIL_USER ? process.env.EMAIL_USER.replace(/(.{3}).*(@.*)/, '$1***$2') : 'Not set'
  };
}

/**
 * Send test email
 */
async function sendTestEmail(to = 'test@example.com') {
  if (!isConfigured || !transporter) {
    throw new Error('Email service not configured');
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"AI Career Agent Coach" <noreply@aicareeragentcoach.com>',
    to: to,
    subject: 'Test Email - AI Career Agent Coach',
    html: `
      <h2>🎉 Email Service Test</h2>
      <p>This is a test email from the AI Career Agent Coach platform.</p>
      <p>If you received this, the email service is working correctly!</p>
      <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
    `
  };

  const result = await transporter.sendMail(mailOptions);
  console.log('📧 Test email sent:', result.messageId);
  return result;
}

module.exports = {
  sendPaymentFailedEmail,
  sendPaymentSuccessEmail,
  getEmailServiceStatus,
  sendTestEmail
};
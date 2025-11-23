require('dotenv').config();
const nodemailer = require('nodemailer');

/**
 * Test Email Script
 * Run: node test-email.js
 */

async function testEmail() {
  console.log('🚀 Testing Gmail SMTP Configuration...\n');

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Email options
  const mailOptions = {
    from: `"Career Copilot" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: 'rajkumarthota20197@gmail.com', // Send to yourself
    subject: '✅ Test Email from Career Copilot',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .success { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .info { background: #d1ecf1; border: 1px solid #bee5eb; color: #0c5460; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Email Setup Successful!</h1>
          </div>
          <div class="content">
            <div class="success">
              <strong>✅ Gmail SMTP is working perfectly!</strong>
            </div>
            
            <p>Congratulations! Your email configuration is set up correctly.</p>
            
            <h3>Configuration Details:</h3>
            <ul>
              <li><strong>Email:</strong> ${process.env.EMAIL_USER}</li>
              <li><strong>SMTP Host:</strong> ${process.env.EMAIL_HOST}</li>
              <li><strong>SMTP Port:</strong> ${process.env.EMAIL_PORT}</li>
              <li><strong>From Address:</strong> ${process.env.EMAIL_FROM}</li>
            </ul>
            
            <div class="info">
              <strong>What works now:</strong>
              <ul>
                <li>✅ Welcome emails</li>
                <li>✅ Password reset emails</li>
                <li>✅ Payment confirmations</li>
                <li>✅ Support notifications</li>
                <li>✅ Feedback confirmations</li>
              </ul>
            </div>
            
            <p><strong>Test Time:</strong> ${new Date().toLocaleString()}</p>
            
            <p>You're all set! Your Career Copilot application can now send emails.</p>
            
            <p>Best regards,<br>Career Copilot Team</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    console.log('📧 Sending test email to: rajkumarthota20197@gmail.com');
    console.log('⏳ Please wait...\n');

    const info = await transporter.sendMail(mailOptions);

    console.log('✅ SUCCESS! Email sent successfully!');
    console.log('📬 Message ID:', info.messageId);
    console.log('\n📥 Check your inbox: rajkumarthota20197@gmail.com');
    console.log('💡 If not in inbox, check Spam folder\n');
  } catch (error) {
    console.error('❌ ERROR: Email failed to send');
    console.error('Error message:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Make sure 2FA is enabled on Gmail');
    console.error('2. Generate app password at: https://myaccount.google.com/apppasswords');
    console.error('3. Copy the 16-character password exactly');
    console.error('4. Add it to backend/.env file as EMAIL_PASSWORD');
    console.error('5. Make sure .env file is in backend/ folder\n');
  }
}

// Run the test
testEmail();

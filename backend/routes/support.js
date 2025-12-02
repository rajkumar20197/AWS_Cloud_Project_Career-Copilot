const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

/**
 * Support & Feedback Routes
 */

/**
 * POST /api/support/feedback
 * Submit user feedback
 */
router.post('/feedback', authenticateToken, async (req, res) => {
  try {
    const { type, message, rating } = req.body;
    const userId = req.user.userId;
    const userEmail = req.user.email;

    if (!type || !message || !rating) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // TODO: Save to database (DynamoDB)
    const feedback = {
      id: Date.now().toString(),
      userId,
      userEmail,
      type,
      message,
      rating: parseInt(rating),
      timestamp: new Date().toISOString(),
      status: 'new',
    };

    // Send notification to admin
    const snsService = require('../services/snsService');
    await snsService.sendAdminAlert({
      type: 'new_feedback',
      feedbackType: type,
      rating,
      user: userEmail,
      message: message.substring(0, 100),
    });

    // Send thank you email to user
    const emailService = require('../services/emailService');
    await emailService.sendEmail(
      userEmail,
      'Thank You for Your Feedback',
      `
        <h2>Thank You!</h2>
        <p>We received your feedback and appreciate you taking the time to help us improve Career Copilot.</p>
        <p>Our team will review your ${type} and get back to you if needed.</p>
        <p>Best regards,<br>The Career Copilot Team</p>
      `
    );

    res.json({ success: true, feedback });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

/**
 * POST /api/support/chat
 * Send chat message (AI bot or human support)
 */
router.post('/chat', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.userId;

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    // TODO: Integrate with AI chatbot (AWS Bedrock or OpenAI)
    // For now, return a simple response
    const botResponse = await generateBotResponse(message);

    res.json({
      success: true,
      response: botResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

/**
 * POST /api/support/ticket
 * Create support ticket
 */
router.post('/ticket', authenticateToken, async (req, res) => {
  try {
    const { subject, description, priority } = req.body;
    const userId = req.user.userId;
    const userEmail = req.user.email;

    if (!subject || !description) {
      return res.status(400).json({ error: 'Subject and description required' });
    }

    const ticket = {
      id: `TICKET-${Date.now()}`,
      userId,
      userEmail,
      subject,
      description,
      priority: priority || 'medium',
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    // TODO: Save to database

    // Send confirmation email
    const emailService = require('../services/emailService');
    await emailService.sendEmail(
      userEmail,
      `Support Ticket Created: ${ticket.id}`,
      `
        <h2>Support Ticket Created</h2>
        <p>Ticket ID: <strong>${ticket.id}</strong></p>
        <p>Subject: ${subject}</p>
        <p>Status: Open</p>
        <p>We'll respond within 24 hours.</p>
        <p>Best regards,<br>Career Copilot Support</p>
      `
    );

    // Notify admin
    const snsService = require('../services/snsService');
    await snsService.sendAdminAlert({
      type: 'new_support_ticket',
      ticketId: ticket.id,
      user: userEmail,
      subject,
      priority,
    });

    res.json({ success: true, ticket });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

/**
 * GET /api/support/faq
 * Get frequently asked questions
 */
router.get('/faq', (req, res) => {
  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'How do I create an account?',
          a: 'Click "Sign Up" in the top right corner and follow the steps to create your account.',
        },
        {
          q: 'Is Career Copilot free?',
          a: 'We offer a free plan with 10 AI requests per month. Upgrade to Pro ($9.99/month) for unlimited access.',
        },
      ],
    },
    {
      category: 'Features',
      questions: [
        {
          q: 'How does the AI resume builder work?',
          a: 'Our AI analyzes your experience and generates a professional resume tailored to your target job.',
        },
        {
          q: 'Can I schedule interview prep sessions?',
          a: 'Yes! Connect your Google Calendar and schedule prep sessions directly from the app.',
        },
      ],
    },
    {
      category: 'Billing',
      questions: [
        {
          q: 'Can I cancel anytime?',
          a: 'Yes, you can cancel your subscription at any time. You\'ll have access until the end of your billing period.',
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit cards, debit cards, Apple Pay, Google Pay, and Klarna.',
        },
      ],
    },
  ];

  res.json({ faqs });
});

/**
 * Simple AI bot response generator
 */
async function generateBotResponse(message) {
  const lowerMessage = message.toLowerCase();

  // Simple keyword matching (replace with AWS Bedrock or OpenAI later)
  if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
    return 'Our pricing is simple: Free plan with 10 AI requests/month, or Pro plan at $9.99/month for unlimited access. Would you like to see our pricing page?';
  }

  if (lowerMessage.includes('resume')) {
    return 'I can help you create a professional resume! Our AI analyzes your experience and generates a tailored resume. Would you like to start building your resume?';
  }

  if (lowerMessage.includes('interview')) {
    return 'We offer AI-powered interview prep! You can practice common questions, get feedback, and schedule prep sessions. Want to try it out?';
  }

  if (lowerMessage.includes('cancel') || lowerMessage.includes('refund')) {
    return 'You can cancel your subscription anytime from Settings > Billing. If you need a refund, please email support@aicareeragentcoach.com and we\'ll help you out.';
  }

  if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
    return 'I\'m here to help! You can:\n- Email us at support@aicareeragentcoach.com\n- Call us at +1 (555) CAREER-1\n- Browse our Help Center\n\nWhat do you need help with?';
  }

  // Default response
  return 'Thanks for your message! I\'m still learning, but I\'ve notified our support team. They\'ll get back to you shortly. In the meantime, you can email support@aicareeragentcoach.com or call +1 (555) CAREER-1.';
}

module.exports = router;

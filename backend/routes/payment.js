const express = require('express');
const router = express.Router();
const stripeService = require('../services/stripeService');
const { authenticateToken } = require('../middleware/auth');

// Pricing tiers (Price IDs from Stripe Dashboard)
const PRICING = {
  PRO: process.env.STRIPE_PRICE_PRO, // $9.99/month
  PREMIUM: process.env.STRIPE_PRICE_PREMIUM, // $19.99/month
};

/**
 * POST /api/payment/create-checkout-session
 * Create a Stripe checkout session for subscription
 */
router.post('/create-checkout-session', authenticateToken, async (req, res) => {
  try {
    const { plan } = req.body; // 'pro' or 'premium'
    const userId = req.user.userId;
    const userEmail = req.user.email;

    // Validate plan
    if (!plan || !['pro', 'premium'].includes(plan.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    // Get price ID based on plan
    const priceId = plan.toLowerCase() === 'pro' ? PRICING.PRO : PRICING.PREMIUM;

    // Create checkout session
    const session = await stripeService.createCheckoutSession(userId, priceId, userEmail);

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

/**
 * POST /api/payment/create-portal-session
 * Create a customer portal session for managing subscription
 */
router.post('/create-portal-session', authenticateToken, async (req, res) => {
  try {
    const { customerId } = req.body;

    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID required' });
    }

    const session = await stripeService.createPortalSession(customerId);

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    res.status(500).json({ error: 'Failed to create portal session' });
  }
});

/**
 * GET /api/payment/subscription/:subscriptionId
 * Get subscription details
 */
router.get('/subscription/:subscriptionId', authenticateToken, async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const subscription = await stripeService.getSubscription(subscriptionId);

    res.json({
      id: subscription.id,
      status: subscription.status,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      plan: subscription.items.data[0].price.nickname,
    });
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    res.status(500).json({ error: 'Failed to retrieve subscription' });
  }
});

/**
 * POST /api/payment/cancel-subscription
 * Cancel a subscription
 */
router.post('/cancel-subscription', authenticateToken, async (req, res) => {
  try {
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({ error: 'Subscription ID required' });
    }

    const subscription = await stripeService.cancelSubscription(subscriptionId);

    res.json({
      message: 'Subscription canceled successfully',
      subscription: {
        id: subscription.id,
        status: subscription.status,
        canceledAt: subscription.canceled_at,
      },
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

/**
 * POST /api/payment/webhook
 * Stripe webhook endpoint for handling events
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['stripe-signature'];

  try {
    // Verify webhook signature
    const event = stripeService.verifyWebhookSignature(req.body, signature);

    // Handle the event
    const result = await stripeService.handleWebhookEvent(event);

    if (result) {
      // Update database based on event
      // TODO: Update user subscription status in DynamoDB
      console.log('Webhook processed:', result);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook signature verification failed' });
  }
});

module.exports = router;

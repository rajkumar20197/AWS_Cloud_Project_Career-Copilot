const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Stripe Payment Service for Career Copilot
 * Handles subscriptions, payments, and customer management
 */

// Create a checkout session for subscription
async function createCheckoutSession(userId, priceId, userEmail) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'us_bank_account', 'klarna'],
      line_items: [
        {
          price: priceId, // Price ID from Stripe Dashboard
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
      customer_email: userEmail,
      client_reference_id: userId,
      metadata: {
        userId: userId,
      },
    });

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

// Create a customer portal session (for managing subscription)
async function createPortalSession(customerId) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.FRONTEND_URL}/settings`,
    });

    return session;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
}

// Get subscription details
async function getSubscription(subscriptionId) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    throw error;
  }
}

// Cancel subscription
async function cancelSubscription(subscriptionId) {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
}

// Verify webhook signature
function verifyWebhookSignature(payload, signature) {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    return event;
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    throw error;
  }
}

// Handle webhook events
async function handleWebhookEvent(event) {
  switch (event.type) {
    case 'checkout.session.completed':
      // Payment successful, activate subscription
      const session = event.data.object;
      console.log('Checkout completed:', session.id);
      // Update user's subscription status in database
      return { userId: session.client_reference_id, status: 'active' };

    case 'customer.subscription.updated':
      // Subscription updated
      const updatedSubscription = event.data.object;
      console.log('Subscription updated:', updatedSubscription.id);
      return { subscriptionId: updatedSubscription.id, status: updatedSubscription.status };

    case 'customer.subscription.deleted':
      // Subscription canceled
      const deletedSubscription = event.data.object;
      console.log('Subscription deleted:', deletedSubscription.id);
      return { subscriptionId: deletedSubscription.id, status: 'canceled' };

    case 'invoice.payment_failed':
      // Payment failed - trigger SNS notification and SQS retry
      const invoice = event.data.object;
      console.log('Payment failed:', invoice.id);
      
      // Send SNS notification
      const snsService = require('./snsService');
      await snsService.notifyPaymentFailed({
        userId: invoice.metadata?.userId,
        userEmail: invoice.customer_email,
        amount: invoice.amount_due / 100,
        currency: invoice.currency,
        failureReason: invoice.last_finalization_error?.message || 'Payment declined',
        customerId: invoice.customer,
        invoiceId: invoice.id,
      });
      
      // Queue for retry via SQS
      const sqsService = require('./sqsService');
      await sqsService.queuePaymentRetry({
        userId: invoice.metadata?.userId,
        userEmail: invoice.customer_email,
        customerId: invoice.customer,
        subscriptionId: invoice.subscription,
        invoiceId: invoice.id,
        amount: invoice.amount_due / 100,
        plan: invoice.lines.data[0]?.price?.nickname || 'Unknown',
        failureReason: invoice.last_finalization_error?.message || 'Payment declined',
      });
      
      // Send email to user
      const emailService = require('./emailService');
      await emailService.sendPaymentFailedEmail(
        invoice.customer_email,
        invoice.customer_name || 'User',
        invoice.last_finalization_error?.message || 'Your payment was declined'
      );
      
      return { customerId: invoice.customer, status: 'payment_failed' };

    default:
      console.log(`Unhandled event type: ${event.type}`);
      return null;
  }
}

module.exports = {
  createCheckoutSession,
  createPortalSession,
  getSubscription,
  cancelSubscription,
  verifyWebhookSignature,
  handleWebhookEvent,
};

const { SNSClient, PublishCommand, CreateTopicCommand } = require('@aws-sdk/client-sns');

const snsClient = new SNSClient({ region: process.env.AWS_REGION || 'us-east-1' });

/**
 * AWS SNS Service for Payment Notifications
 * Sends alerts for payment failures, subscription changes, etc.
 */

// SNS Topic ARNs (create these in AWS Console or via CloudFormation)
const TOPICS = {
  PAYMENT_FAILED: process.env.SNS_TOPIC_PAYMENT_FAILED,
  PAYMENT_SUCCESS: process.env.SNS_TOPIC_PAYMENT_SUCCESS,
  SUBSCRIPTION_CANCELED: process.env.SNS_TOPIC_SUBSCRIPTION_CANCELED,
  ADMIN_ALERTS: process.env.SNS_TOPIC_ADMIN_ALERTS,
};

/**
 * Send payment failure notification
 */
async function notifyPaymentFailed(paymentData) {
  const message = {
    event: 'payment_failed',
    timestamp: new Date().toISOString(),
    userId: paymentData.userId,
    userEmail: paymentData.userEmail,
    amount: paymentData.amount,
    currency: paymentData.currency,
    reason: paymentData.failureReason,
    attemptNumber: paymentData.attemptNumber || 1,
    customerId: paymentData.customerId,
    invoiceId: paymentData.invoiceId,
  };

  try {
    // Send to payment failed topic (triggers retry logic via SQS)
    await publishToTopic(TOPICS.PAYMENT_FAILED, message, 'Payment Failed Alert');

    // Send to admin alerts topic (email/SMS to admin)
    await publishToTopic(
      TOPICS.ADMIN_ALERTS,
      {
        alert: 'Payment Failed',
        user: paymentData.userEmail,
        amount: `$${paymentData.amount}`,
        reason: paymentData.failureReason,
      },
      'Admin Alert: Payment Failed'
    );

    console.log('Payment failure notification sent:', paymentData.userId);
  } catch (error) {
    console.error('Error sending payment failure notification:', error);
    throw error;
  }
}

/**
 * Send payment success notification
 */
async function notifyPaymentSuccess(paymentData) {
  const message = {
    event: 'payment_success',
    timestamp: new Date().toISOString(),
    userId: paymentData.userId,
    userEmail: paymentData.userEmail,
    amount: paymentData.amount,
    plan: paymentData.plan,
    subscriptionId: paymentData.subscriptionId,
  };

  try {
    await publishToTopic(TOPICS.PAYMENT_SUCCESS, message, 'Payment Successful');
    console.log('Payment success notification sent:', paymentData.userId);
  } catch (error) {
    console.error('Error sending payment success notification:', error);
  }
}

/**
 * Send subscription canceled notification
 */
async function notifySubscriptionCanceled(subscriptionData) {
  const message = {
    event: 'subscription_canceled',
    timestamp: new Date().toISOString(),
    userId: subscriptionData.userId,
    userEmail: subscriptionData.userEmail,
    plan: subscriptionData.plan,
    canceledAt: subscriptionData.canceledAt,
    reason: subscriptionData.reason,
  };

  try {
    await publishToTopic(TOPICS.SUBSCRIPTION_CANCELED, message, 'Subscription Canceled');
    console.log('Subscription canceled notification sent:', subscriptionData.userId);
  } catch (error) {
    console.error('Error sending subscription canceled notification:', error);
  }
}

/**
 * Send admin alert
 */
async function sendAdminAlert(alertData) {
  try {
    await publishToTopic(TOPICS.ADMIN_ALERTS, alertData, `Admin Alert: ${alertData.type}`);
    console.log('Admin alert sent:', alertData.type);
  } catch (error) {
    console.error('Error sending admin alert:', error);
  }
}

/**
 * Publish message to SNS topic
 */
async function publishToTopic(topicArn, message, subject) {
  if (!topicArn) {
    console.warn('SNS topic ARN not configured, skipping notification');
    return;
  }

  const command = new PublishCommand({
    TopicArn: topicArn,
    Message: JSON.stringify(message, null, 2),
    Subject: subject,
    MessageAttributes: {
      event_type: {
        DataType: 'String',
        StringValue: message.event || 'notification',
      },
      timestamp: {
        DataType: 'String',
        StringValue: new Date().toISOString(),
      },
    },
  });

  try {
    const response = await snsClient.send(command);
    return response.MessageId;
  } catch (error) {
    console.error('Error publishing to SNS:', error);
    throw error;
  }
}

/**
 * Create SNS topic (for initial setup)
 */
async function createTopic(topicName) {
  const command = new CreateTopicCommand({
    Name: topicName,
    Tags: [
      { Key: 'Application', Value: 'CareerCopilot' },
      { Key: 'Purpose', Value: 'PaymentNotifications' },
    ],
  });

  try {
    const response = await snsClient.send(command);
    console.log('SNS topic created:', response.TopicArn);
    return response.TopicArn;
  } catch (error) {
    console.error('Error creating SNS topic:', error);
    throw error;
  }
}

module.exports = {
  notifyPaymentFailed,
  notifyPaymentSuccess,
  notifySubscriptionCanceled,
  sendAdminAlert,
  createTopic,
};

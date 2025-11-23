const { SQSClient, SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand } = require('@aws-sdk/client-sqs');

const sqsClient = new SQSClient({ region: process.env.AWS_REGION || 'us-east-1' });

/**
 * AWS SQS Service for Payment Retry Logic
 * Handles failed payment retries with exponential backoff
 */

// SQS Queue URLs (create these in AWS Console)
const QUEUES = {
  PAYMENT_RETRY: process.env.SQS_QUEUE_PAYMENT_RETRY,
  PAYMENT_DLQ: process.env.SQS_QUEUE_PAYMENT_DLQ, // Dead Letter Queue
};

/**
 * Add failed payment to retry queue
 */
async function queuePaymentRetry(paymentData) {
  const message = {
    userId: paymentData.userId,
    userEmail: paymentData.userEmail,
    customerId: paymentData.customerId,
    subscriptionId: paymentData.subscriptionId,
    amount: paymentData.amount,
    plan: paymentData.plan,
    failureReason: paymentData.failureReason,
    attemptNumber: (paymentData.attemptNumber || 0) + 1,
    maxAttempts: 3,
    timestamp: new Date().toISOString(),
  };

  // Calculate delay based on attempt number (exponential backoff)
  const delaySeconds = calculateRetryDelay(message.attemptNumber);

  try {
    const command = new SendMessageCommand({
      QueueUrl: QUEUES.PAYMENT_RETRY,
      MessageBody: JSON.stringify(message),
      DelaySeconds: delaySeconds,
      MessageAttributes: {
        attemptNumber: {
          DataType: 'Number',
          StringValue: message.attemptNumber.toString(),
        },
        userId: {
          DataType: 'String',
          StringValue: message.userId,
        },
      },
    });

    const response = await sqsClient.send(command);
    console.log(`Payment retry queued (attempt ${message.attemptNumber}):`, response.MessageId);
    return response.MessageId;
  } catch (error) {
    console.error('Error queuing payment retry:', error);
    throw error;
  }
}

/**
 * Process payment retry queue
 */
async function processPaymentRetries() {
  try {
    const command = new ReceiveMessageCommand({
      QueueUrl: QUEUES.PAYMENT_RETRY,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 20, // Long polling
      MessageAttributeNames: ['All'],
    });

    const response = await sqsClient.send(command);

    if (!response.Messages || response.Messages.length === 0) {
      return [];
    }

    const results = [];

    for (const message of response.Messages) {
      const paymentData = JSON.parse(message.Body);

      try {
        // Attempt to retry payment
        const retryResult = await retryPayment(paymentData);

        if (retryResult.success) {
          // Payment succeeded, delete from queue
          await deleteMessage(message.ReceiptHandle);
          results.push({ success: true, userId: paymentData.userId });
        } else {
          // Payment still failing
          if (paymentData.attemptNumber >= paymentData.maxAttempts) {
            // Max attempts reached, move to DLQ
            await moveToDeadLetterQueue(paymentData);
            await deleteMessage(message.ReceiptHandle);
            results.push({ success: false, userId: paymentData.userId, reason: 'max_attempts' });
          } else {
            // Retry again later
            await queuePaymentRetry(paymentData);
            await deleteMessage(message.ReceiptHandle);
            results.push({ success: false, userId: paymentData.userId, reason: 'retry_queued' });
          }
        }
      } catch (error) {
        console.error('Error processing payment retry:', error);
        results.push({ success: false, userId: paymentData.userId, error: error.message });
      }
    }

    return results;
  } catch (error) {
    console.error('Error processing payment retry queue:', error);
    throw error;
  }
}

/**
 * Retry payment with Stripe
 */
async function retryPayment(paymentData) {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  try {
    // Attempt to charge the customer again
    const invoice = await stripe.invoices.pay(paymentData.invoiceId);

    if (invoice.status === 'paid') {
      console.log('Payment retry successful:', paymentData.userId);
      return { success: true, invoice };
    } else {
      console.log('Payment retry failed:', paymentData.userId);
      return { success: false, reason: invoice.status };
    }
  } catch (error) {
    console.error('Payment retry error:', error);
    return { success: false, reason: error.message };
  }
}

/**
 * Move failed payment to Dead Letter Queue
 */
async function moveToDeadLetterQueue(paymentData) {
  const message = {
    ...paymentData,
    movedToDLQ: new Date().toISOString(),
    reason: 'Max retry attempts exceeded',
  };

  try {
    const command = new SendMessageCommand({
      QueueUrl: QUEUES.PAYMENT_DLQ,
      MessageBody: JSON.stringify(message),
    });

    await sqsClient.send(command);
    console.log('Payment moved to DLQ:', paymentData.userId);

    // Send alert to admin
    const snsService = require('./snsService');
    await snsService.sendAdminAlert({
      type: 'payment_failed_permanently',
      userId: paymentData.userId,
      userEmail: paymentData.userEmail,
      amount: paymentData.amount,
      attempts: paymentData.attemptNumber,
    });
  } catch (error) {
    console.error('Error moving to DLQ:', error);
    throw error;
  }
}

/**
 * Delete message from queue
 */
async function deleteMessage(receiptHandle) {
  const command = new DeleteMessageCommand({
    QueueUrl: QUEUES.PAYMENT_RETRY,
    ReceiptHandle: receiptHandle,
  });

  try {
    await sqsClient.send(command);
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
}

/**
 * Calculate retry delay with exponential backoff
 */
function calculateRetryDelay(attemptNumber) {
  // Attempt 1: 5 minutes (300 seconds)
  // Attempt 2: 1 hour (3600 seconds)
  // Attempt 3: 24 hours (86400 seconds - max SQS delay is 900 seconds, so we use 900)
  const delays = [300, 3600, 900]; // SQS max delay is 15 minutes (900 seconds)
  return delays[attemptNumber - 1] || 900;
}

module.exports = {
  queuePaymentRetry,
  processPaymentRetries,
};

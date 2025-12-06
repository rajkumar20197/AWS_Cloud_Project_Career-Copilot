const AWS = require('aws-sdk');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Initialize AWS services
const dynamodb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();
const sqs = new AWS.SQS();

/**
 * Lambda function for processing payment webhooks from Stripe
 * Handles payment success, failure, and subscription events
 */
exports.handler = async (event) => {
    console.log('Payment processor triggered:', JSON.stringify(event, null, 2));
    
    try {
        // Parse the Stripe webhook event
        const stripeEvent = JSON.parse(event.body);
        
        // Verify webhook signature (in production)
        if (process.env.NODE_ENV === 'production') {
            const sig = event.headers['stripe-signature'];
            const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
            
            try {
                stripe.webhooks.constructEvent(event.body, sig, endpointSecret);
            } catch (err) {
                console.error('Webhook signature verification failed:', err.message);
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: 'Invalid signature' })
                };
            }
        }
        
        // Process different event types
        switch (stripeEvent.type) {
            case 'payment_intent.succeeded':
                await handlePaymentSuccess(stripeEvent.data.object);
                break;
                
            case 'payment_intent.payment_failed':
                await handlePaymentFailed(stripeEvent.data.object);
                break;
                
            case 'customer.subscription.created':
                await handleSubscriptionCreated(stripeEvent.data.object);
                break;
                
            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(stripeEvent.data.object);
                break;
                
            case 'customer.subscription.deleted':
                await handleSubscriptionCanceled(stripeEvent.data.object);
                break;
                
            case 'invoice.payment_succeeded':
                await handleInvoicePaymentSucceeded(stripeEvent.data.object);
                break;
                
            case 'invoice.payment_failed':
                await handleInvoicePaymentFailed(stripeEvent.data.object);
                break;
                
            default:
                console.log(`Unhandled event type: ${stripeEvent.type}`);
        }
        
        return {
            statusCode: 200,
            body: JSON.stringify({ received: true })
        };
        
    } catch (error) {
        console.error('Payment processing error:', error);
        
        // Send alert to admin
        await sendAdminAlert({
            type: 'payment_processor_error',
            error: error.message,
            event: event,
            timestamp: new Date().toISOString()
        });
        
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};

/**
 * Handle successful payment
 */
async function handlePaymentSuccess(paymentIntent) {
    console.log('Processing payment success:', paymentIntent.id);
    
    try {
        // Get customer and subscription info
        const customer = await stripe.customers.retrieve(paymentIntent.customer);
        
        // Update user subscription status in DynamoDB
        await dynamodb.update({
            TableName: process.env.USERS_TABLE_NAME,
            Key: { userId: customer.metadata.userId },
            UpdateExpression: 'SET subscriptionStatus = :status, lastPaymentDate = :date, paymentMethod = :method',
            ExpressionAttributeValues: {
                ':status': 'active',
                ':date': new Date().toISOString(),
                ':method': paymentIntent.payment_method
            }
        }).promise();
        
        // Send success notification
        await sns.publish({
            TopicArn: process.env.SNS_TOPIC_PAYMENT_SUCCESS,
            Message: JSON.stringify({
                event: 'payment_success',
                userId: customer.metadata.userId,
                userEmail: customer.email,
                amount: paymentIntent.amount / 100, // Convert from cents
                currency: paymentIntent.currency,
                paymentIntentId: paymentIntent.id,
                timestamp: new Date().toISOString()
            }),
            Subject: 'Payment Successful'
        }).promise();
        
        console.log('Payment success processed successfully');
        
    } catch (error) {
        console.error('Error processing payment success:', error);
        throw error;
    }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(paymentIntent) {
    console.log('Processing payment failure:', paymentIntent.id);
    
    try {
        // Get customer info
        const customer = await stripe.customers.retrieve(paymentIntent.customer);
        
        // Update user status in DynamoDB
        await dynamodb.update({
            TableName: process.env.USERS_TABLE_NAME,
            Key: { userId: customer.metadata.userId },
            UpdateExpression: 'SET subscriptionStatus = :status, lastFailedPayment = :date',
            ExpressionAttributeValues: {
                ':status': 'payment_failed',
                ':date': new Date().toISOString()
            }
        }).promise();
        
        // Queue for retry
        await sqs.sendMessage({
            QueueUrl: process.env.SQS_QUEUE_PAYMENT_RETRY,
            MessageBody: JSON.stringify({
                userId: customer.metadata.userId,
                userEmail: customer.email,
                customerId: paymentIntent.customer,
                paymentIntentId: paymentIntent.id,
                amount: paymentIntent.amount / 100,
                currency: paymentIntent.currency,
                failureReason: paymentIntent.last_payment_error?.message || 'Unknown error',
                attemptNumber: 1,
                maxAttempts: 3,
                timestamp: new Date().toISOString()
            }),
            DelaySeconds: 300 // 5 minutes delay for first retry
        }).promise();
        
        // Send failure notification
        await sns.publish({
            TopicArn: process.env.SNS_TOPIC_PAYMENT_FAILED,
            Message: JSON.stringify({
                event: 'payment_failed',
                userId: customer.metadata.userId,
                userEmail: customer.email,
                amount: paymentIntent.amount / 100,
                currency: paymentIntent.currency,
                reason: paymentIntent.last_payment_error?.message || 'Unknown error',
                paymentIntentId: paymentIntent.id,
                timestamp: new Date().toISOString()
            }),
            Subject: 'Payment Failed - Retry Queued'
        }).promise();
        
        console.log('Payment failure processed successfully');
        
    } catch (error) {
        console.error('Error processing payment failure:', error);
        throw error;
    }
}

/**
 * Handle subscription created
 */
async function handleSubscriptionCreated(subscription) {
    console.log('Processing subscription created:', subscription.id);
    
    try {
        const customer = await stripe.customers.retrieve(subscription.customer);
        
        // Update user subscription in DynamoDB
        await dynamodb.update({
            TableName: process.env.USERS_TABLE_NAME,
            Key: { userId: customer.metadata.userId },
            UpdateExpression: 'SET subscriptionId = :subId, subscriptionStatus = :status, plan = :plan, subscriptionStartDate = :date',
            ExpressionAttributeValues: {
                ':subId': subscription.id,
                ':status': subscription.status,
                ':plan': subscription.items.data[0].price.nickname || 'unknown',
                ':date': new Date(subscription.created * 1000).toISOString()
            }
        }).promise();
        
        console.log('Subscription created processed successfully');
        
    } catch (error) {
        console.error('Error processing subscription created:', error);
        throw error;
    }
}

/**
 * Handle subscription updated
 */
async function handleSubscriptionUpdated(subscription) {
    console.log('Processing subscription updated:', subscription.id);
    
    try {
        const customer = await stripe.customers.retrieve(subscription.customer);
        
        // Update user subscription in DynamoDB
        await dynamodb.update({
            TableName: process.env.USERS_TABLE_NAME,
            Key: { userId: customer.metadata.userId },
            UpdateExpression: 'SET subscriptionStatus = :status, plan = :plan, subscriptionUpdatedDate = :date',
            ExpressionAttributeValues: {
                ':status': subscription.status,
                ':plan': subscription.items.data[0].price.nickname || 'unknown',
                ':date': new Date().toISOString()
            }
        }).promise();
        
        console.log('Subscription updated processed successfully');
        
    } catch (error) {
        console.error('Error processing subscription updated:', error);
        throw error;
    }
}

/**
 * Handle subscription canceled
 */
async function handleSubscriptionCanceled(subscription) {
    console.log('Processing subscription canceled:', subscription.id);
    
    try {
        const customer = await stripe.customers.retrieve(subscription.customer);
        
        // Update user subscription in DynamoDB
        await dynamodb.update({
            TableName: process.env.USERS_TABLE_NAME,
            Key: { userId: customer.metadata.userId },
            UpdateExpression: 'SET subscriptionStatus = :status, subscriptionCanceledDate = :date',
            ExpressionAttributeValues: {
                ':status': 'canceled',
                ':date': new Date().toISOString()
            }
        }).promise();
        
        // Send cancellation notification
        await sns.publish({
            TopicArn: process.env.SNS_TOPIC_SUBSCRIPTION_CANCELED,
            Message: JSON.stringify({
                event: 'subscription_canceled',
                userId: customer.metadata.userId,
                userEmail: customer.email,
                subscriptionId: subscription.id,
                plan: subscription.items.data[0].price.nickname || 'unknown',
                canceledAt: new Date().toISOString()
            }),
            Subject: 'Subscription Canceled'
        }).promise();
        
        console.log('Subscription canceled processed successfully');
        
    } catch (error) {
        console.error('Error processing subscription canceled:', error);
        throw error;
    }
}

/**
 * Handle invoice payment succeeded
 */
async function handleInvoicePaymentSucceeded(invoice) {
    console.log('Processing invoice payment succeeded:', invoice.id);
    
    try {
        const customer = await stripe.customers.retrieve(invoice.customer);
        
        // Update user payment history in DynamoDB
        await dynamodb.put({
            TableName: process.env.PAYMENTS_TABLE_NAME || process.env.USERS_TABLE_NAME,
            Item: {
                paymentId: invoice.id,
                userId: customer.metadata.userId,
                userEmail: customer.email,
                amount: invoice.amount_paid / 100,
                currency: invoice.currency,
                status: 'succeeded',
                invoiceId: invoice.id,
                subscriptionId: invoice.subscription,
                timestamp: new Date().toISOString(),
                paidAt: new Date(invoice.status_transitions.paid_at * 1000).toISOString()
            }
        }).promise();
        
        console.log('Invoice payment succeeded processed successfully');
        
    } catch (error) {
        console.error('Error processing invoice payment succeeded:', error);
        throw error;
    }
}

/**
 * Handle invoice payment failed
 */
async function handleInvoicePaymentFailed(invoice) {
    console.log('Processing invoice payment failed:', invoice.id);
    
    try {
        const customer = await stripe.customers.retrieve(invoice.customer);
        
        // Update user payment history in DynamoDB
        await dynamodb.put({
            TableName: process.env.PAYMENTS_TABLE_NAME || process.env.USERS_TABLE_NAME,
            Item: {
                paymentId: invoice.id,
                userId: customer.metadata.userId,
                userEmail: customer.email,
                amount: invoice.amount_due / 100,
                currency: invoice.currency,
                status: 'failed',
                invoiceId: invoice.id,
                subscriptionId: invoice.subscription,
                failureReason: invoice.last_finalization_error?.message || 'Unknown error',
                timestamp: new Date().toISOString()
            }
        }).promise();
        
        // Queue for retry if it's a subscription invoice
        if (invoice.subscription) {
            await sqs.sendMessage({
                QueueUrl: process.env.SQS_QUEUE_PAYMENT_RETRY,
                MessageBody: JSON.stringify({
                    userId: customer.metadata.userId,
                    userEmail: customer.email,
                    customerId: invoice.customer,
                    invoiceId: invoice.id,
                    subscriptionId: invoice.subscription,
                    amount: invoice.amount_due / 100,
                    currency: invoice.currency,
                    failureReason: invoice.last_finalization_error?.message || 'Unknown error',
                    attemptNumber: 1,
                    maxAttempts: 3,
                    timestamp: new Date().toISOString()
                }),
                DelaySeconds: 300 // 5 minutes delay
            }).promise();
        }
        
        console.log('Invoice payment failed processed successfully');
        
    } catch (error) {
        console.error('Error processing invoice payment failed:', error);
        throw error;
    }
}

/**
 * Send admin alert
 */
async function sendAdminAlert(alertData) {
    try {
        await sns.publish({
            TopicArn: process.env.SNS_TOPIC_ADMIN_ALERTS,
            Message: JSON.stringify(alertData, null, 2),
            Subject: `Admin Alert: ${alertData.type}`
        }).promise();
    } catch (error) {
        console.error('Error sending admin alert:', error);
    }
}
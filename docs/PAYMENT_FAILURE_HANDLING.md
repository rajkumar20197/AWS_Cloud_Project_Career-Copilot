# Payment Failure Handling System

Complete guide to handling payment failures with SNS, SQS, and email notifications.

---

## Architecture Overview

```
Payment Fails (Stripe)
        ↓
Stripe Webhook → Backend
        ↓
    ┌───┴───┐
    ↓       ↓
  SNS      SQS
    ↓       ↓
 Notify   Retry
  Admin   Queue
    ↓       ↓
 Email   Process
 Alert   Retries
```

---

## Components

### 1. SNS (Simple Notification Service) - Instant Alerts

**Purpose:** Send immediate notifications when payment fails

**Topics:**

- `payment-failed` - Payment failure alerts
- `payment-success` - Payment success notifications
- `subscription-canceled` - Subscription cancellations
- `admin-alerts` - Critical alerts for admin

**Subscribers:**

- Email (admin@careercopilot.com)
- SMS (your phone number)
- Lambda functions (for automation)
- SQS queues (for retry logic)

---

### 2. SQS (Simple Queue Service) - Retry Logic

**Purpose:** Automatically retry failed payments with exponential backoff

**Queues:**

- `payment-retry-queue` - Main retry queue
- `payment-dlq` - Dead Letter Queue (after max retries)

**Retry Schedule:**

- Attempt 1: Immediate (Stripe handles)
- Attempt 2: 5 minutes later
- Attempt 3: 1 hour later
- Attempt 4: 24 hours later
- After 4 attempts: Move to DLQ, alert admin

---

### 3. Email Service - User Communication

**Purpose:** Keep users informed about payment issues

**Emails Sent:**

- Payment failed notification
- Retry attempt notifications
- Payment success confirmation
- Subscription canceled confirmation

---

## Payment Failure Flow

### Step 1: Payment Fails

```
User's card is declined
↓
Stripe sends webhook: invoice.payment_failed
↓
Backend receives webhook
```

### Step 2: Immediate Actions

```javascript
// 1. Send SNS notification (instant alert)
await snsService.notifyPaymentFailed({
  userId,
  userEmail,
  amount,
  reason,
});

// 2. Queue for retry (SQS)
await sqsService.queuePaymentRetry({
  userId,
  customerId,
  invoiceId,
  attemptNumber: 1,
});

// 3. Email user
await emailService.sendPaymentFailedEmail(userEmail, userName, failureReason);
```

### Step 3: SNS Notifications

```
SNS Topic: payment-failed
↓
Subscribers notified:
- Admin email: "Payment failed for user@example.com"
- Admin SMS: "Payment failed: $9.99"
- SQS queue: Trigger retry logic
- Lambda: Update user status in database
```

### Step 4: SQS Retry Logic

```
Message added to SQS queue
↓
Wait 5 minutes (DelaySeconds: 300)
↓
Worker processes message
↓
Attempt to charge card again
↓
Success? → Delete from queue, send success email
Failed? → Re-queue with longer delay (1 hour)
↓
Repeat until max attempts (4)
↓
Still failing? → Move to Dead Letter Queue
```

### Step 5: Dead Letter Queue

```
After 4 failed attempts:
↓
Move to DLQ
↓
Send critical alert to admin
↓
Suspend user's subscription
↓
Send final email to user
```

---

## Setup Instructions

### 1. Create SNS Topics (5 minutes)

```bash
# AWS Console → SNS → Topics → Create topic

# Topic 1: Payment Failed
Name: career-copilot-payment-failed
Type: Standard

# Topic 2: Admin Alerts
Name: career-copilot-admin-alerts
Type: Standard

# Topic 3: Payment Success
Name: career-copilot-payment-success
Type: Standard
```

### 2. Subscribe to SNS Topics

```bash
# Subscribe your email
Topic: career-copilot-admin-alerts
Protocol: Email
Endpoint: admin@careercopilot.com

# Subscribe your phone (optional)
Protocol: SMS
Endpoint: +1234567890

# Confirm subscription (check email/SMS)
```

### 3. Create SQS Queues (5 minutes)

```bash
# AWS Console → SQS → Create queue

# Queue 1: Payment Retry Queue
Name: career-copilot-payment-retry
Type: Standard
Visibility timeout: 300 seconds (5 minutes)
Message retention: 4 days
Delivery delay: 0 seconds
Maximum message size: 256 KB

# Queue 2: Dead Letter Queue
Name: career-copilot-payment-dlq
Type: Standard
Message retention: 14 days

# Configure DLQ on main queue:
Dead-letter queue: career-copilot-payment-dlq
Maximum receives: 4
```

### 4. Connect SNS to SQS

```bash
# SNS Topic → Subscriptions → Create subscription
Topic: career-copilot-payment-failed
Protocol: Amazon SQS
Endpoint: arn:aws:sqs:us-east-1:ACCOUNT_ID:career-copilot-payment-retry
```

### 5. Update Environment Variables

```env
# SNS Topic ARNs
SNS_TOPIC_PAYMENT_FAILED=arn:aws:sns:us-east-1:ACCOUNT_ID:career-copilot-payment-failed
SNS_TOPIC_PAYMENT_SUCCESS=arn:aws:sns:us-east-1:ACCOUNT_ID:career-copilot-payment-success
SNS_TOPIC_SUBSCRIPTION_CANCELED=arn:aws:sns:us-east-1:ACCOUNT_ID:career-copilot-subscription-canceled
SNS_TOPIC_ADMIN_ALERTS=arn:aws:sns:us-east-1:ACCOUNT_ID:career-copilot-admin-alerts

# SQS Queue URLs
SQS_QUEUE_PAYMENT_RETRY=https://sqs.us-east-1.amazonaws.com/ACCOUNT_ID/career-copilot-payment-retry
SQS_QUEUE_PAYMENT_DLQ=https://sqs.us-east-1.amazonaws.com/ACCOUNT_ID/career-copilot-payment-dlq
```

### 6. Install AWS SDK

```bash
npm install @aws-sdk/client-sns @aws-sdk/client-sqs
```

### 7. Create Retry Worker (Cron Job)

```javascript
// backend/workers/paymentRetryWorker.js
const sqsService = require("../services/sqsService");

async function processRetries() {
  console.log("Processing payment retries...");
  const results = await sqsService.processPaymentRetries();
  console.log("Retry results:", results);
}

// Run every 5 minutes
setInterval(processRetries, 5 * 60 * 1000);

// Or use AWS Lambda with EventBridge (cron)
```

---

## Testing

### Test Payment Failure

```bash
# Use Stripe test card that always fails
Card: 4000 0000 0000 0002
Expiry: 12/25
CVC: 123

# Expected flow:
1. Payment fails immediately
2. SNS notification sent (check email)
3. SQS message queued
4. User receives email
5. After 5 minutes, retry attempt
6. If still fails, retry after 1 hour
```

### Monitor in AWS Console

```bash
# Check SNS
SNS → Topics → career-copilot-payment-failed → Metrics
- Messages published
- Messages delivered

# Check SQS
SQS → Queues → career-copilot-payment-retry
- Messages available
- Messages in flight
- Messages in DLQ
```

---

## Cost Breakdown

### SNS Costs:

- First 1,000 notifications: FREE
- After that: $0.50 per million notifications
- SMS: $0.00645 per message (US)

**Example:** 100 payment failures/month

- Email notifications: FREE
- SMS notifications: $0.65/month

### SQS Costs:

- First 1 million requests: FREE
- After that: $0.40 per million requests

**Example:** 100 payment failures × 4 retries = 400 messages

- Cost: FREE (under 1 million)

### Total Cost: ~$1-2/month (mostly SMS if enabled)

---

## Email Templates

### Payment Failed Email:

- Subject: "Payment Failed - Action Required"
- Content: Reason, next steps, update payment link
- CTA: "Update Payment Method"

### Payment Success Email:

- Subject: "Payment Successful - Thank You!"
- Content: Receipt, plan details, next billing date
- CTA: "View Dashboard"

### Final Warning Email (After 3 failures):

- Subject: "Urgent: Subscription Will Be Canceled"
- Content: Multiple failures, final attempt, consequences
- CTA: "Update Payment Now"

---

## Admin Dashboard

### Metrics to Track:

- Payment failure rate
- Retry success rate
- Messages in DLQ
- Average time to resolution

### Alerts to Set:

- Payment failure rate > 5%
- DLQ messages > 10
- Retry success rate < 50%

---

## Best Practices

### 1. Graceful Degradation

- Don't immediately cancel subscription
- Give users 7 days grace period
- Send multiple reminders

### 2. Clear Communication

- Explain why payment failed
- Provide actionable steps
- Make it easy to update payment

### 3. Automatic Retries

- Use exponential backoff
- Don't retry too frequently (annoys banks)
- Max 4 attempts over 24 hours

### 4. Monitor Everything

- Track failure reasons
- Identify patterns (specific cards, banks)
- Optimize retry timing

---

## Files Created:

✅ `backend/services/snsService.js` - SNS notifications
✅ `backend/services/sqsService.js` - SQS retry logic
✅ `backend/services/emailService.js` - Email notifications
✅ `src/components/PaymentFailed.tsx` - User-facing error page
✅ Updated `backend/services/stripeService.js` - Integrated all services

---

## Summary

**When payment fails:**

1. ⚡ SNS sends instant alert to admin
2. 📧 Email sent to user explaining issue
3. 🔄 SQS queues automatic retry (5 min, 1 hour, 24 hours)
4. 🚨 After 4 failures, move to DLQ and alert admin
5. 💬 User can update payment method anytime

**Result:** Professional, automated payment failure handling that maximizes recovery while keeping users informed!

---

**Created:** November 19, 2025
**Status:** Production-ready
**Cost:** ~$1-2/month

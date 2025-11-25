# Setup Checklist - What Needs Configuration

Complete list of files created but not yet connected to external services.

---

## ✅ READY TO USE (No Setup Required)

These files work immediately without any external configuration:

### Frontend Components:

- ✅ `src/pages/TermsOfService.tsx` - Legal page
- ✅ `src/pages/PrivacyPolicy.tsx` - Privacy page
- ✅ `src/pages/FAQ.tsx` - FAQ page
- ✅ `src/pages/HelpCenter.tsx` - Help center
- ✅ `src/pages/ForgotPassword.tsx` - Forgot password UI
- ✅ `src/pages/ResetPassword.tsx` - Reset password UI
- ✅ `src/components/Footer.tsx` - Footer with copyright
- ✅ `src/components/CookieConsent.tsx` - Cookie banner
- ✅ `src/components/SupportPage.tsx` - Support hub
- ✅ `src/components/PricingPage.tsx` - Pricing page
- ✅ `src/components/PaymentSuccess.tsx` - Success page
- ✅ `src/components/PaymentFailed.tsx` - Failure page
- ✅ `src/components/CalendarIntegration.tsx` - Calendar UI

### Backend Middleware:

- ✅ `backend/middleware/auth.js` - JWT auth (works locally)
- ✅ `backend/middleware/security.js` - Security middleware

### Documentation:

- ✅ All 35+ documentation files (just guides)

---

## 🔄 NEEDS SETUP (External Services Required)

### 1. EMAIL SERVICE (Gmail SMTP) 📧

**Files Created:**

- `backend/services/emailService.js`
- `backend/routes/auth.js` (uses email)
- `backend/routes/support.js` (uses email)

**What's Missing:**

- Gmail app password
- Environment variables

**Setup Required:**

```bash
# 1. Enable 2FA on Gmail
# 2. Generate app password at myaccount.google.com/apppasswords
# 3. Add to .env:

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=rajkumarthota979@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```

**Time:** 5 minutes
**Cost:** FREE
**Status:** ❌ NOT CONFIGURED

---

### 2. GOOGLE CALENDAR (OAuth 2.0) 📅

**Files Created:**

- `backend/services/googleCalendarService.js`
- `backend/routes/google.js`
- `src/components/CalendarIntegration.tsx`

**What's Missing:**

- Google Cloud Project
- OAuth 2.0 credentials
- Environment variables

**Setup Required:**

```bash
# 1. Create project at console.cloud.google.com
# 2. Enable Google Calendar API
# 3. Create OAuth 2.0 credentials
# 4. Add to .env:

GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/google/callback
```

**Time:** 15 minutes
**Cost:** FREE
**Status:** ❌ NOT CONFIGURED

---

### 3. STRIPE PAYMENTS 💳

**Files Created:**

- `backend/services/stripeService.js`
- `backend/routes/payment.js`
- `src/components/PricingPage.tsx`

**What's Missing:**

- Stripe account
- API keys
- Product/Price IDs
- Environment variables

**Setup Required:**

```bash
# 1. Create account at stripe.com
# 2. Get API keys from Dashboard
# 3. Create products (Pro $9.99, Premium $19.99)
# 4. Add to .env:

STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_PREMIUM=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Time:** 30 minutes
**Cost:** FREE (2.9% + $0.30 per transaction)
**Status:** ❌ NOT CONFIGURED

---

### 4. AWS SNS (Notifications) 📢

**Files Created:**

- `backend/services/snsService.js`

**What's Missing:**

- AWS account
- SNS topics created
- IAM permissions
- Environment variables

**Setup Required:**

```bash
# 1. Create SNS topics in AWS Console
# 2. Subscribe email to topics
# 3. Add to .env:

AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
SNS_TOPIC_PAYMENT_FAILED=arn:aws:sns:...
SNS_TOPIC_ADMIN_ALERTS=arn:aws:sns:...
```

**Time:** 15 minutes
**Cost:** FREE (first 1,000 notifications)
**Status:** ❌ NOT CONFIGURED

---

### 5. AWS SQS (Retry Queue) 🔄

**Files Created:**

- `backend/services/sqsService.js`

**What's Missing:**

- AWS account
- SQS queues created
- Environment variables

**Setup Required:**

```bash
# 1. Create SQS queues in AWS Console
# 2. Configure dead letter queue
# 3. Add to .env:

SQS_QUEUE_PAYMENT_RETRY=https://sqs.us-east-1.amazonaws.com/...
SQS_QUEUE_PAYMENT_DLQ=https://sqs.us-east-1.amazonaws.com/...
```

**Time:** 10 minutes
**Cost:** FREE (first 1 million requests)
**Status:** ❌ NOT CONFIGURED

---

### 6. AWS BEDROCK (AI) 🤖

**Files Created:**

- Referenced in documentation
- Not yet implemented in code

**What's Missing:**

- AWS account
- Bedrock access enabled
- AI service implementation

**Setup Required:**

```bash
# 1. Request Bedrock access in AWS Console
# 2. Enable Claude model
# 3. Create AI service file
# 4. Add to .env:

AWS_BEDROCK_REGION=us-east-1
AWS_BEDROCK_MODEL=anthropic.claude-v2
```

**Time:** 30 minutes (+ approval wait)
**Cost:** ~$0.01 per 1,000 tokens
**Status:** ❌ NOT IMPLEMENTED

---

### 7. AWS DYNAMODB (Database) 🗄️

**Files Created:**

- Referenced in routes
- Not yet implemented

**What's Missing:**

- DynamoDB tables created
- Database service implementation

**Setup Required:**

```bash
# 1. Create DynamoDB table in AWS Console
# 2. Create database service
# 3. Add to .env:

DYNAMODB_TABLE_NAME=career-copilot-users
DYNAMODB_REGION=us-east-1
```

**Time:** 20 minutes
**Cost:** FREE (25GB storage, 25 read/write units)
**Status:** ❌ NOT IMPLEMENTED

---

### 8. AWS S3 (File Storage) 📦

**Files Created:**

- Referenced in documentation
- Not yet implemented

**What's Missing:**

- S3 bucket created
- Upload service implementation

**Setup Required:**

```bash
# 1. Create S3 bucket in AWS Console
# 2. Configure CORS
# 3. Create upload service
# 4. Add to .env:

S3_BUCKET_NAME=career-copilot-uploads
S3_REGION=us-east-1
```

**Time:** 15 minutes
**Cost:** $0.023 per GB/month
**Status:** ❌ NOT IMPLEMENTED

---

### 9. DOMAIN (Route 53) 🌐

**Files Created:**

- `infrastructure/multi-region-loadbalancer.yaml`
- Documentation guides

**What's Missing:**

- Domain registered
- DNS configured
- SSL certificates

**Setup Required:**

```bash
# 1. Register careercopilot.com in Route 53
# 2. Create hosted zone
# 3. Configure DNS records
# 4. Request SSL certificates in ACM
```

**Time:** 30 minutes
**Cost:** $13/year
**Status:** ❌ NOT REGISTERED

---

### 10. INFRASTRUCTURE (VPC, ALB, etc.) 🏗️

**Files Created:**

- `infrastructure/vpc-networking-setup.yaml`
- `infrastructure/multi-region-loadbalancer.yaml`
- `infrastructure/deploy-network.sh`
- `infrastructure/deploy-network.ps1`

**What's Missing:**

- VPCs created
- Load balancers deployed
- Security groups configured

**Setup Required:**

```bash
# 1. Deploy VPC in us-east-1
# 2. Deploy VPC in us-west-2
# 3. Create ALBs
# 4. Configure Route 53
```

**Time:** 2-3 hours
**Cost:** $96/month (or $0 if deleted after testing)
**Status:** ❌ NOT DEPLOYED

---

## 📊 Summary Table

| Service         | Files Created | Setup Time | Cost            | Status             |
| --------------- | ------------- | ---------- | --------------- | ------------------ |
| Gmail SMTP      | ✅            | 5 min      | FREE            | ❌ Not configured  |
| Google Calendar | ✅            | 15 min     | FREE            | ❌ Not configured  |
| Stripe          | ✅            | 30 min     | 2.9% + $0.30    | ❌ Not configured  |
| AWS SNS         | ✅            | 15 min     | FREE            | ❌ Not configured  |
| AWS SQS         | ✅            | 10 min     | FREE            | ❌ Not configured  |
| AWS Bedrock     | ❌            | 30 min     | $0.01/1K tokens | ❌ Not implemented |
| DynamoDB        | ❌            | 20 min     | FREE            | ❌ Not implemented |
| S3              | ❌            | 15 min     | $0.023/GB       | ❌ Not implemented |
| Domain          | ✅ Docs       | 30 min     | $13/year        | ❌ Not registered  |
| Infrastructure  | ✅            | 2-3 hours  | $96/month       | ❌ Not deployed    |

---

## 🎯 Priority Setup Order

### CRITICAL (Do First):

1. **Gmail SMTP** (5 min) - For emails to work
2. **Stripe** (30 min) - For payments to work
3. **Domain** (30 min) - For professional appearance

### IMPORTANT (Do Soon):

4. **Google Calendar** (15 min) - For calendar features
5. **DynamoDB** (20 min) - For data persistence
6. **S3** (15 min) - For file uploads

### OPTIONAL (Do Later):

7. **AWS SNS** (15 min) - For notifications
8. **AWS SQS** (10 min) - For retry logic
9. **AWS Bedrock** (30 min) - For AI features
10. **Infrastructure** (3 hours) - For production deployment

---

## 🚀 Quick Start (Minimum Setup)

To get the app working locally with basic features:

### 1. Gmail (5 minutes)

```bash
# Generate app password
# Add to .env
EMAIL_USER=rajkumarthota979@gmail.com
EMAIL_PASSWORD=your-app-password
```

### 2. Test Locally

```bash
# Backend
cd backend
npm install
npm start

# Frontend
npm install
npm run dev
```

### 3. Test Features

- ✅ Legal pages work
- ✅ Help center works
- ✅ Support page works
- ✅ Pricing page works
- ❌ Email sending (needs Gmail setup)
- ❌ Payments (needs Stripe setup)
- ❌ Calendar (needs Google setup)

---

## 📋 Environment Variables Needed

Create `.env` file in `backend/` folder:

```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters

# Email (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=rajkumarthota979@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=support@careercopilot.com

# Google Calendar
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/google/callback

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_PREMIUM=price_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AWS (Optional for now)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# SNS Topics (Optional)
SNS_TOPIC_PAYMENT_FAILED=arn:aws:sns:...
SNS_TOPIC_ADMIN_ALERTS=arn:aws:sns:...

# SQS Queues (Optional)
SQS_QUEUE_PAYMENT_RETRY=https://sqs...
SQS_QUEUE_PAYMENT_DLQ=https://sqs...

# Database (Optional)
DYNAMODB_TABLE_NAME=career-copilot-users

# Storage (Optional)
S3_BUCKET_NAME=career-copilot-uploads
```

---

## ✅ What Works WITHOUT Setup

These features work immediately:

- ✅ All UI components
- ✅ Legal pages (Terms, Privacy)
- ✅ Help Center & FAQ
- ✅ Support page (UI only)
- ✅ Pricing page (UI only)
- ✅ Authentication (JWT, local only)
- ✅ Security middleware
- ✅ Cookie consent
- ✅ Footer with copyright

---

## ❌ What DOESN'T Work Without Setup

These features need external services:

- ❌ Email sending (needs Gmail)
- ❌ Password reset emails (needs Gmail)
- ❌ Payment processing (needs Stripe)
- ❌ Calendar integration (needs Google)
- ❌ Notifications (needs SNS)
- ❌ Retry queue (needs SQS)
- ❌ AI features (needs Bedrock)
- ❌ Data persistence (needs DynamoDB)
- ❌ File uploads (needs S3)
- ❌ Production deployment (needs AWS infrastructure)

---

## 🎯 Recommendation

### For Class Demo (This Week):

**Setup:** Nothing! Just show the UI and explain the architecture
**Time:** 0 minutes
**Cost:** $0

### For Testing (Next Week):

**Setup:** Gmail + Stripe
**Time:** 35 minutes
**Cost:** $0 (test mode)

### For Launch (January):

**Setup:** Everything
**Time:** 4-5 hours
**Cost:** $20-30/month

---

**Created:** December 19, 2024
**Status:** All files created, external services not configured
**Next Step:** Choose your setup priority based on needs

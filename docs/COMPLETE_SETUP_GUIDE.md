# 🚀 COMPLETE SETUP GUIDE - Career Copilot

## 📋 CURRENT STATUS

✅ **Security Crisis Resolved** - Credentials secured, Git hooks installed  
✅ **Payment System Ready** - Stripe integration with fraud detection  
⏳ **AWS Setup Needed** - New IAM user and credentials required  
⏳ **Payment Configuration** - Stripe account setup needed

## 🔥 QUICK START (15 Minutes)

### Step 1: Install Dependencies

```bash
# Install new AWS SDK packages
npm install

# Verify installation
npm run security:check
```

### Step 2: AWS IAM Setup (5 minutes)

Follow the **AWS_IAM_SETUP_GUIDE.md** to:

1. Create IAM policy (copy-paste provided JSON)
2. Create new IAM user with minimal permissions
3. Generate new access keys
4. Delete old compromised credentials

### Step 3: Configure Environment (2 minutes)

```bash
# Copy templates
cp .env.template .env
cp backend/.env.template backend/.env

# Edit .env files with your new AWS credentials
# Frontend .env:
VITE_AWS_ACCESS_KEY_ID=AKIA_YOUR_NEW_KEY
VITE_AWS_SECRET_ACCESS_KEY=YOUR_NEW_SECRET

# Backend backend/.env:
AWS_ACCESS_KEY_ID=AKIA_YOUR_NEW_KEY
AWS_SECRET_ACCESS_KEY=YOUR_NEW_SECRET
JWT_SECRET=generate_32_char_random_string
```

### Step 4: Test AWS Connection (1 minute)

```bash
# Test your new AWS setup
npm run test:aws

# Should show:
# ✅ Bedrock connection successful!
# ✅ DynamoDB connection successful!
# ✅ S3 connection successful!
```

### Step 5: Start Development (1 minute)

```bash
# Start backend server
cd backend
npm install
npm run dev

# Start frontend (new terminal)
npm run dev
```

## 💳 STRIPE PAYMENT SETUP (10 minutes)

### Create Stripe Account

1. Go to https://stripe.com and create account
2. Complete business verification
3. Get API keys from Dashboard

### Configure Products

```bash
# In Stripe Dashboard:
# 1. Products → Create Product
# 2. Pro Plan: $9.99/month recurring
# 3. Premium Plan: $19.99/month recurring
# 4. Copy Price IDs
```

### Add Stripe Keys

```bash
# Backend .env:
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PRICE_PRO=price_your_pro_price_id
STRIPE_PRICE_PREMIUM=price_your_premium_price_id

# Frontend .env:
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

### Setup Webhook

```bash
# In Stripe Dashboard:
# 1. Developers → Webhooks → Add endpoint
# 2. URL: http://localhost:5000/api/payment/webhook
# 3. Events: checkout.session.completed, customer.subscription.*
# 4. Copy webhook secret to .env
```

## 🧪 TESTING CHECKLIST

### Security Tests

```bash
# Run security validation
npm run security:check

# Test Git hooks (should block)
echo "password=secret123" > test.txt
git add test.txt
git commit -m "test"  # Should be blocked
rm test.txt
```

### AWS Tests

```bash
# Test AWS connection
npm run test:aws

# Should pass all tests:
# ✅ Bedrock connection successful!
# ✅ DynamoDB connection successful!
# ✅ S3 connection successful!
```

### Payment Tests

```bash
# Use Stripe test cards:
# Success: 4242424242424242
# Declined: 4000000000000002
# Fraud: 4100000000000019

# Test payment flow:
# 1. Go to /pricing
# 2. Select Pro plan
# 3. Use test card
# 4. Verify webhook processing
```

### Application Tests

```bash
# Test AI features
# 1. Login to application
# 2. Try resume analysis
# 3. Test job matching
# 4. Verify AI responses
```

## 🚀 PRODUCTION DEPLOYMENT

### Environment Setup

```bash
# Create production environment files
cp backend/.env.production backend/.env.prod

# Update with production values:
# - Live Stripe keys (sk_live_...)
# - Production domain URLs
# - Secure JWT secrets
# - Production database names
```

### AWS Resources

```bash
# Create production resources:
# 1. DynamoDB table: career-copilot-users-prod
# 2. S3 bucket: career-copilot-uploads-prod
# 3. CloudWatch log groups
```

### Deploy to AWS

```bash
# Option 1: AWS Lambda + API Gateway
# Option 2: AWS ECS + Fargate
# Option 3: AWS Amplify (frontend) + Lambda (backend)

# See deployment guides in docs/
```

## 🛡️ SECURITY VERIFICATION

### Pre-Deployment Checklist

- [ ] All credentials rotated and secured
- [ ] Environment files not committed to Git
- [ ] Git hooks preventing credential leaks
- [ ] Security validation passing 100%
- [ ] Payment fraud detection active
- [ ] Webhook signature verification enabled
- [ ] Rate limiting configured
- [ ] HTTPS enforced in production

### Monitoring Setup

- [ ] AWS CloudWatch alerts configured
- [ ] Stripe webhook monitoring active
- [ ] Security event logging enabled
- [ ] Billing alerts set up
- [ ] Error tracking configured

## 📞 SUPPORT & TROUBLESHOOTING

### Common Issues

**AWS Connection Failed**

```bash
# Check credentials
npm run test:aws

# Verify IAM permissions
# Check region settings
# Confirm Bedrock model access
```

**Payment Issues**

```bash
# Check Stripe keys
# Verify webhook endpoint
# Test with Stripe CLI
# Review fraud detection logs
```

**Security Warnings**

```bash
# Run security check
npm run security:check

# Fix any issues found
# Rotate compromised credentials
# Update security policies
```

### Getting Help

- **AWS Issues**: Check CloudTrail logs, AWS Support
- **Stripe Issues**: Stripe Dashboard logs, Stripe Support
- **Security Issues**: Review security logs, rotate credentials
- **Application Issues**: Check browser console, server logs

## 🎯 SUCCESS METRICS

Your setup is complete when:

- ✅ Security score: 100% (13/13 checks passed)
- ✅ AWS connection: All services accessible
- ✅ Payment flow: End-to-end testing successful
- ✅ AI features: Bedrock integration working
- ✅ Monitoring: Alerts and logging configured

## 🚀 NEXT STEPS

1. **Complete AWS IAM setup** (most important)
2. **Configure Stripe payments**
3. **Test complete application flow**
4. **Set up production environment**
5. **Deploy and monitor**

Your Career Copilot platform will be production-ready with enterprise security! 🔐💳🤖

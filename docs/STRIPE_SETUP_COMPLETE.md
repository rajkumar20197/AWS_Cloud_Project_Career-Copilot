# Stripe Payment Integration - Complete Setup Guide

## Step 1: Create Stripe Account (5 minutes)

1. Go to https://stripe.com
2. Click "Start now" or "Sign up"
3. Enter your email and create password
4. Verify your email
5. Complete business information (can use personal info for now)

## Step 2: Get API Keys (2 minutes)

1. Log into Stripe Dashboard
2. Click "Developers" in left menu
3. Click "API keys"
4. You'll see two keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`) - Click "Reveal test key"
5. Copy both keys

## Step 3: Create Products & Prices (10 minutes)

### Create Pro Plan ($9.99/month):

1. Dashboard → "Products" → "Add product"
2. Name: `Pro Plan`
3. Description: `Unlimited AI requests and premium features`
4. Pricing model: `Recurring`
5. Price: `$9.99`
6. Billing period: `Monthly`
7. Click "Save product"
8. **Copy the Price ID** (starts with `price_`)

### Create Premium Plan ($19.99/month):

1. Click "Add product" again
2. Name: `Premium Plan`
3. Description: `Everything in Pro plus expert coaching`
4. Pricing model: `Recurring`
5. Price: `$19.99`
6. Billing period: `Monthly`
7. Click "Save product"
8. **Copy the Price ID**

## Step 4: Install Stripe Packages

```bash
# Backend
cd backend
npm install stripe

# Frontend
cd ../
npm install @stripe/stripe-js @stripe/react-stripe-js
```

## Step 5: Configure Environment Variables

Create `.env` file in backend folder:

```env
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Price IDs from Step 3
STRIPE_PRICE_PRO=price_your_pro_price_id
STRIPE_PRICE_PREMIUM=price_your_premium_price_id

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

Create `.env` file in root folder (for Vite):

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

## Step 6: Add Payment Route to Backend

In `backend/server.js`, add:

```javascript
const paymentRoutes = require("./routes/payment");
app.use("/api/payment", paymentRoutes);
```

## Step 7: Add Pricing Page to Routes

In `src/App.tsx`, add:

```typescript
import PricingPage from './components/PricingPage';
import PaymentSuccess from './components/PaymentSuccess';

// In your routes:
<Route path="/pricing" element={<PricingPage />} />
<Route path="/payment/success" element={<PaymentSuccess />} />
```

## Step 8: Test Payment Flow

### Test Cards (Stripe provides these):

- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **Requires authentication:** 4000 0025 0000 3155

### Testing Steps:

1. Start backend: `cd backend && npm start`
2. Start frontend: `npm run dev`
3. Go to `http://localhost:3000/pricing`
4. Click "Subscribe Now" on Pro plan
5. Use test card: 4242 4242 4242 4242
6. Expiry: Any future date (e.g., 12/25)
7. CVC: Any 3 digits (e.g., 123)
8. ZIP: Any 5 digits (e.g., 12345)
9. Click "Subscribe"
10. Should redirect to success page!

## Step 9: Setup Webhooks (Production)

1. Stripe Dashboard → "Developers" → "Webhooks"
2. Click "Add endpoint"
3. Endpoint URL: `https://careercopilot.com/api/payment/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Click "Add endpoint"
6. Copy the "Signing secret" (starts with `whsec_`)
7. Add to `.env`: `STRIPE_WEBHOOK_SECRET=whsec_...`

## Files Created:

✅ `src/components/PricingPage.tsx` - Beautiful pricing page
✅ `src/components/PaymentSuccess.tsx` - Success page with confetti
✅ `backend/routes/payment.js` - Payment API endpoints
✅ `backend/services/stripeService.js` - Stripe integration logic
✅ `.env.example` - Environment variables template

## What You Can Do Now:

- Accept payments via credit/debit cards
- Manage subscriptions automatically
- Handle recurring billing
- Cancel/upgrade subscriptions
- Receive money in your bank account

## Money Flow:

1. User pays $9.99
2. Stripe takes 2.9% + $0.30 = $0.59
3. You get $9.40
4. Money arrives in your bank in 2-7 days

## Next Steps:

1. ✅ Get Stripe account
2. ✅ Copy API keys
3. ✅ Create products
4. ✅ Add keys to `.env`
5. ✅ Test with test cards
6. 🔄 Go live when ready (switch to live keys)

Ready to accept payments! 💰

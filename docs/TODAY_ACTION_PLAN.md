# Today's Action Plan - December 2024

Complete checklist for today's tasks.

---

## Priority 1: Domain Registration (30 minutes) 🔥

### Why Do This First:

- Protects your brand name
- Only $13 - low risk
- Can sit unused until you're ready
- Good domains get taken fast

### Steps:

1. [ ] Go to AWS Console → Route 53
2. [ ] Click "Registered domains" → "Register domain"
3. [ ] Search: `careercopilot`
4. [ ] If available: Buy immediately ($13)
5. [ ] If taken: Try these backups:
   - `getcareercopilot.com`
   - `mycareercopilot.com`
   - `careercopilot.app` ($18/year)
6. [ ] Complete purchase
7. [ ] Verify email (check inbox)
8. [ ] Wait for "Registration successful" (10-30 min)

**Cost: $13 one-time**
**Monthly: $0.50 (hosted zone)**

---

## Priority 2: Gmail Integration (1 hour)

### What You're Building:

- Send emails from your app (welcome emails, notifications)
- Use Gmail SMTP or AWS SES

### Option A: Gmail SMTP (Quick & Free)

**Steps:**

1. [ ] Go to Google Account settings
2. [ ] Enable 2-factor authentication
3. [ ] Generate App Password:
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Name it: "Career Copilot App"
   - Copy the 16-character password
4. [ ] Add to your backend `.env`:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

5. [ ] Install nodemailer:

```bash
npm install nodemailer
```

6. [ ] Create email service:

```javascript
// backend/services/emailService.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function sendWelcomeEmail(userEmail, userName) {
  await transporter.sendMail({
    from: '"Career Copilot" <your-email@gmail.com>',
    to: userEmail,
    subject: "Welcome to Career Copilot!",
    html: `<h1>Welcome ${userName}!</h1><p>Start your career journey today.</p>`,
  });
}

module.exports = { sendWelcomeEmail };
```

7. [ ] Test sending an email

**Cost: FREE (Gmail limit: 500 emails/day)**

---

### Option B: AWS SES (Production-Ready)

**Steps:**

1. [ ] Go to AWS SES (Simple Email Service)
2. [ ] Verify your domain: careercopilot.com
3. [ ] Request production access (removes 200 email/day limit)
4. [ ] Configure DKIM and SPF records in Route 53
5. [ ] Update backend to use AWS SDK

**Cost: $0.10 per 1,000 emails (very cheap)**

---

## Priority 3: Google Calendar Integration (1 hour)

### What You're Building:

- Schedule interview prep sessions
- Add career events to user's calendar
- Send calendar invites

### Steps:

1. [ ] Go to Google Cloud Console (console.cloud.google.com)
2. [ ] Create new project: "Career Copilot"
3. [ ] Enable Google Calendar API:
   - APIs & Services → Library
   - Search "Google Calendar API"
   - Click "Enable"
4. [ ] Create OAuth credentials:
   - APIs & Services → Credentials
   - Create Credentials → OAuth client ID
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/auth/google/callback`
   - Copy Client ID and Client Secret
5. [ ] Install packages:

```bash
npm install googleapis
```

6. [ ] Create calendar service:

```javascript
// backend/services/calendarService.js
const { google } = require("googleapis");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/auth/google/callback"
);

async function createCalendarEvent(userAuth, eventDetails) {
  oauth2Client.setCredentials(userAuth);
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const event = {
    summary: "Interview Prep Session",
    description: eventDetails.description,
    start: {
      dateTime: eventDetails.startTime,
      timeZone: "America/New_York",
    },
    end: {
      dateTime: eventDetails.endTime,
      timeZone: "America/New_York",
    },
  };

  const response = await calendar.events.insert({
    calendarId: "primary",
    resource: event,
  });

  return response.data;
}

module.exports = { createCalendarEvent };
```

7. [ ] Test creating a calendar event

**Cost: FREE (Google Calendar API is free)**

---

## Priority 4: S3 Setup (30 minutes)

### What You're Using S3 For:

- Store user profile pictures
- Store uploaded resumes (PDF)
- Store generated documents

### Steps:

1. [ ] Go to AWS S3
2. [ ] Create bucket:
   - Name: `career-copilot-uploads` (must be globally unique)
   - Region: us-east-1
   - Block all public access: OFF (we'll use signed URLs)
   - Versioning: Enabled
   - Encryption: Enabled (AES-256)
3. [ ] Create bucket policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowAppAccess",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::YOUR-ACCOUNT-ID:role/YOUR-APP-ROLE"
      },
      "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::career-copilot-uploads/*"
    }
  ]
}
```

4. [ ] Set up CORS:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["http://localhost:3000", "https://careercopilot.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

5. [ ] Install AWS SDK:

```bash
npm install @aws-sdk/client-s3
```

6. [ ] Create S3 service:

```javascript
// backend/services/s3Service.js
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({ region: "us-east-1" });

async function uploadFile(file, userId) {
  const key = `users/${userId}/${Date.now()}-${file.originalname}`;

  const command = new PutObjectCommand({
    Bucket: "career-copilot-uploads",
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3Client.send(command);
  return key;
}

async function getSignedDownloadUrl(key) {
  const command = new GetObjectCommand({
    Bucket: "career-copilot-uploads",
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

module.exports = { uploadFile, getSignedDownloadUrl };
```

7. [ ] Test uploading a file

**Cost: $0.023 per GB/month (very cheap)**
**Example: 1,000 users × 5MB = 5GB = $0.12/month**

---

## Priority 5: Payment Integration Setup (1 hour)

### Stripe Setup (Recommended):

1. [ ] Go to stripe.com
2. [ ] Create account (free)
3. [ ] Get API keys:
   - Dashboard → Developers → API keys
   - Copy "Publishable key" and "Secret key"
4. [ ] Install Stripe:

```bash
npm install stripe @stripe/stripe-js @stripe/react-stripe-js
```

5. [ ] Create products in Stripe Dashboard:

   - Product 1: "Pro Plan" - $9.99/month
   - Product 2: "Premium Plan" - $19.99/month
   - Copy the Price IDs

6. [ ] Backend integration:

```javascript
// backend/routes/payment.js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.post("/create-checkout-session", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: "price_...", // Your price ID from Stripe
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: "https://careercopilot.com/success",
    cancel_url: "https://careercopilot.com/cancel",
  });

  res.json({ id: session.id });
});
```

7. [ ] Frontend integration:

```javascript
// src/components/SubscribePage.jsx
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_...");

async function handleSubscribe() {
  const stripe = await stripePromise;
  const response = await fetch("/create-checkout-session", {
    method: "POST",
  });
  const session = await response.json();

  await stripe.redirectToCheckout({ sessionId: session.id });
}
```

8. [ ] Test with Stripe test cards:
   - Success: 4242 4242 4242 4242
   - Decline: 4000 0000 0000 0002

**Cost: 2.9% + $0.30 per transaction**

---

## Summary of Today's Tasks

| Task                 | Time   | Cost         | Priority |
| -------------------- | ------ | ------------ | -------- |
| Buy Domain           | 30 min | $13          | 🔥 HIGH  |
| Gmail Integration    | 1 hour | FREE         | HIGH     |
| Calendar Integration | 1 hour | FREE         | MEDIUM   |
| S3 Setup             | 30 min | ~$0          | HIGH     |
| Payment Setup        | 1 hour | FREE (setup) | MEDIUM   |

**Total Time: 4 hours**
**Total Cost: $13**

---

## Launch Timeline

### December (Now):

- ✅ Buy domain: careercopilot.com
- ✅ Set up Gmail, Calendar, S3
- ✅ Set up Stripe payments
- ✅ Complete class project requirements

### January:

- Build remaining features
- Test with friends/classmates
- Fix bugs
- Create marketing materials
- Set up social media accounts

### February (Launch):

- Soft launch to university
- Post on Reddit, LinkedIn
- Email professors/career centers
- Monitor and iterate

---

## Domain Name Decision

### Check Availability Now:

1. Go to Route 53
2. Search: `careercopilot`
3. If available: **BUY IT NOW** ($13)
4. If taken: Try backups immediately

### Backup Options (in order):

1. `getcareercopilot.com`
2. `mycareercopilot.com`
3. `careercopilot.app` ($18/year)
4. `thecareercopilot.com`
5. `careercopilot.io` ($35/year)

**Don't wait!** Good domains get taken daily.

---

## Payment Processing - How You Get Paid

### Stripe Payout Schedule:

- **First payout:** 7-14 days after first payment
- **Regular payouts:** Every 2 days (or daily after 90 days)
- **Method:** Direct deposit to your bank account
- **Minimum:** $1 (no minimum threshold)

### Example:

- User pays $9.99 on Jan 1
- Stripe takes $0.59 fee
- You get $9.40
- Money arrives in your bank: Jan 8-15 (first time)
- Future payments: Every 2 days

### Bank Account Setup:

1. Stripe Dashboard → Settings → Bank accounts
2. Add your bank account details
3. Verify with micro-deposits (2-3 days)
4. Start receiving payments!

---

## Questions Answered

### Q: Which month is perfect to launch?

**A: February 2025** - Students back from break, thinking about careers

### Q: Should I rush to buy domain?

**A: YES! Buy today** - Only $13, protects your brand

### Q: Will someone else buy it?

**A: Possibly** - Good domains get taken fast, don't risk it

### Q: How do we receive payments?

**A: Stripe → Your bank account** - Automatic every 2 days

### Q: What are we doing today?

**A: Domain + Gmail + Calendar + S3** - All foundational pieces

---

**Created:** November 19, 2025
**Status:** Ready to execute
**Time Required:** 4 hours
**Cost:** $13

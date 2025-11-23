# Professional Email Setup for Career Copilot

Complete guide to setting up professional email addresses for your business.

---

## Email Flow Explained

### How Emails Work in Your App:

```
Your App (Career Copilot)
        ↓
Sends email FROM: noreply@careercopilot.com
        ↓
Goes TO: user@example.com (your customer)
        ↓
User replies TO: support@careercopilot.com
        ↓
You receive at: your-personal-email@gmail.com (forwarded)
```

---

## Option 1: Use Personal Gmail (Quick Start - FREE)

### What You Need:

- Your existing Gmail account (e.g., `yourname@gmail.com`)

### Setup:

```env
EMAIL_USER=yourname@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Emails Will Show:

- **From:** yourname@gmail.com
- **Reply-To:** yourname@gmail.com

### Pros:

- ✅ FREE
- ✅ Quick setup (5 minutes)
- ✅ Works immediately

### Cons:

- ❌ Not professional (shows personal email)
- ❌ Limited to 500 emails/day
- ❌ Can't use custom domain

**Best for:** Testing, development, class project

---

## Option 2: Google Workspace (Professional - $6/month)

### What You Get:

- Professional email: `noreply@careercopilot.com`
- Support email: `support@careercopilot.com`
- Admin email: `admin@careercopilot.com`
- 30GB storage per user
- Custom domain email

### Setup Steps:

#### 1. Buy Domain (if not done)

- Already done: `careercopilot.com` ($13/year)

#### 2. Sign Up for Google Workspace

1. Go to https://workspace.google.com
2. Click "Get Started"
3. Enter business name: `Career Copilot`
4. Number of employees: `1-9`
5. Country: Your country
6. Enter your domain: `careercopilot.com`
7. Choose plan: **Business Starter** ($6/user/month)

#### 3. Verify Domain Ownership

1. Google will give you a TXT record
2. Go to Route 53 → Hosted zones → careercopilot.com
3. Create record:
   - Type: TXT
   - Name: @ (or leave blank)
   - Value: (paste from Google)
4. Wait 10-60 minutes for verification

#### 4. Create Email Addresses

```
noreply@careercopilot.com  - For automated emails
support@careercopilot.com  - For customer support
admin@careercopilot.com    - For admin notifications
hello@careercopilot.com    - For general inquiries
```

#### 5. Configure MX Records (Email Routing)

Google will provide MX records. Add to Route 53:

```
Priority 1: ASPMX.L.GOOGLE.COM
Priority 5: ALT1.ASPMX.L.GOOGLE.COM
Priority 5: ALT2.ASPMX.L.GOOGLE.COM
Priority 10: ALT3.ASPMX.L.GOOGLE.COM
Priority 10: ALT4.ASPMX.L.GOOGLE.COM
```

#### 6. Update App Configuration

```env
EMAIL_USER=noreply@careercopilot.com
EMAIL_PASSWORD=your-app-password
```

### Cost:

- **$6/month** for first user
- **$6/month** per additional user
- **Total: $6-12/month** (1-2 users)

### Pros:

- ✅ Professional email addresses
- ✅ Custom domain (@careercopilot.com)
- ✅ 2,000 emails/day (vs 500 with free Gmail)
- ✅ Better deliverability
- ✅ Professional appearance
- ✅ Multiple email addresses

### Cons:

- ❌ Costs $6/month
- ❌ Takes 1-2 hours to setup

**Best for:** Production, real business

---

## Option 3: AWS SES (Scalable - $0.10 per 1,000 emails)

### What You Get:

- Send from any email address
- 50,000 emails/day FREE (first 12 months)
- After that: $0.10 per 1,000 emails
- Very cheap at scale

### Setup Steps:

#### 1. Verify Domain in SES

1. Go to AWS SES Console
2. Click "Verified identities" → "Create identity"
3. Identity type: **Domain**
4. Domain: `careercopilot.com`
5. AWS will provide DNS records

#### 2. Add DNS Records to Route 53

AWS SES will give you:

- DKIM records (3 CNAME records)
- SPF record (TXT record)
- DMARC record (TXT record)

Add all to Route 53 → careercopilot.com

#### 3. Request Production Access

1. SES starts in "Sandbox mode" (can only send to verified emails)
2. Request production access:
   - SES Console → Account dashboard
   - Click "Request production access"
   - Fill out form (takes 24 hours)

#### 4. Update App to Use SES

```javascript
// backend/services/emailService.js
const AWS = require("aws-sdk");
const ses = new AWS.SES({ region: "us-east-1" });

async function sendEmail(to, subject, body) {
  const params = {
    Source: "noreply@careercopilot.com",
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      Body: { Html: { Data: body } },
    },
  };

  return ses.sendEmail(params).promise();
}
```

### Cost:

- **First 12 months:** 50,000 emails/month FREE
- **After that:** $0.10 per 1,000 emails
- **Example:** 10,000 emails/month = $1/month

### Pros:

- ✅ Very cheap at scale
- ✅ 50,000 emails/day
- ✅ High deliverability
- ✅ Detailed analytics
- ✅ No monthly fee

### Cons:

- ❌ More complex setup
- ❌ Need to verify domain
- ❌ 24-hour approval wait
- ❌ Still need email address to receive replies

**Best for:** High volume, production at scale

---

## Recommended Setup by Stage

### Stage 1: Development/Testing (Now)

**Use:** Personal Gmail
**Cost:** FREE
**Setup time:** 5 minutes

```env
EMAIL_USER=yourname@gmail.com
EMAIL_PASSWORD=app-password
```

### Stage 2: Class Project/Demo (Next Month)

**Use:** Personal Gmail OR Google Workspace
**Cost:** FREE or $6/month
**Setup time:** 5 minutes or 1 hour

### Stage 3: Soft Launch (100-1000 users)

**Use:** Google Workspace
**Cost:** $6/month
**Setup time:** 1 hour
**Emails:**

- noreply@careercopilot.com
- support@careercopilot.com

### Stage 4: Production (1000+ users)

**Use:** AWS SES + Google Workspace
**Cost:** $6/month + $0.10 per 1,000 emails
**Setup:**

- SES for sending (cheap, scalable)
- Google Workspace for receiving (professional)

---

## Email Address Strategy

### Sending Emails (Automated):

```
noreply@careercopilot.com
- Payment confirmations
- Password resets
- Application reminders
- System notifications
```

### Receiving Emails (Support):

```
support@careercopilot.com
- Customer questions
- Bug reports
- Feature requests
- General inquiries
```

### Admin Notifications:

```
admin@careercopilot.com
- Payment failures
- System alerts
- Security notifications
- Error reports
```

### Marketing:

```
hello@careercopilot.com
- General inquiries
- Partnership requests
- Media inquiries
```

---

## Email Forwarding Setup

### Forward All Support Emails to Your Personal Email:

#### In Google Workspace:

1. Log into admin.google.com
2. Go to Apps → Google Workspace → Gmail
3. Click "Routing"
4. Add routing rule:
   - From: support@careercopilot.com
   - Forward to: yourpersonal@gmail.com

#### In Route 53 (with AWS SES):

1. Create SES receipt rule
2. Forward to S3 or Lambda
3. Lambda forwards to your email

---

## Where You'll Receive Emails

### Option 1: Google Workspace

- Check at: mail.google.com
- Or forward to personal Gmail
- Or use Gmail app on phone

### Option 2: Personal Gmail

- Check at: gmail.com
- All emails go to your inbox

### Option 3: Email Client

- Use Outlook, Apple Mail, Thunderbird
- Add account: support@careercopilot.com
- IMAP settings from Google Workspace

---

## Quick Start Recommendation

### For Today (Testing):

```env
# Use your personal Gmail
EMAIL_USER=yourname@gmail.com
EMAIL_PASSWORD=your-app-password
```

**Emails will show:**

- From: yourname@gmail.com
- Reply-To: yourname@gmail.com

### For Launch (Professional):

1. **Buy Google Workspace** ($6/month)
2. **Create emails:**
   - noreply@careercopilot.com
   - support@careercopilot.com
3. **Update .env:**

```env
EMAIL_USER=noreply@careercopilot.com
EMAIL_PASSWORD=app-password
```

4. **Forward support@ to your personal email**

**Emails will show:**

- From: noreply@careercopilot.com
- Reply-To: support@careercopilot.com
- You receive replies at: yourpersonal@gmail.com

---

## Cost Comparison

| Option           | Setup Time | Monthly Cost | Emails/Day | Professional? |
| ---------------- | ---------- | ------------ | ---------- | ------------- |
| Personal Gmail   | 5 min      | FREE         | 500        | ❌ No         |
| Google Workspace | 1 hour     | $6           | 2,000      | ✅ Yes        |
| AWS SES          | 2 hours    | $0-1         | 50,000     | ✅ Yes        |
| SES + Workspace  | 3 hours    | $6-7         | 50,000     | ✅ Yes        |

---

## My Recommendation

### For Your Class Project:

**Use Personal Gmail** (FREE)

- Quick to set up
- Works perfectly for testing
- No cost
- Can upgrade later

### For Real Launch:

**Use Google Workspace** ($6/month)

- Professional email addresses
- Custom domain
- Easy to manage
- Worth the $6/month

### For Scale (10,000+ users):

**Use AWS SES + Google Workspace** ($7/month)

- SES for sending (cheap)
- Workspace for receiving (professional)
- Best of both worlds

---

## Setup Instructions

### Quick Start (Personal Gmail):

```bash
1. Enable 2FA on Gmail
2. Generate app password
3. Add to .env:
   EMAIL_USER=yourname@gmail.com
   EMAIL_PASSWORD=abcd efgh ijkl mnop
4. Done! (5 minutes)
```

### Professional (Google Workspace):

```bash
1. Sign up at workspace.google.com ($6/month)
2. Verify domain (add TXT record to Route 53)
3. Add MX records to Route 53
4. Create noreply@careercopilot.com
5. Generate app password
6. Add to .env:
   EMAIL_USER=noreply@careercopilot.com
   EMAIL_PASSWORD=app-password
7. Forward support@ to personal email
8. Done! (1 hour)
```

---

## Summary

### Where Emails Are Sent FROM:

- Development: `yourname@gmail.com`
- Production: `noreply@careercopilot.com`

### Where You RECEIVE Emails:

- Your personal Gmail inbox (forwarded)
- Or check mail.google.com (Google Workspace)
- Or use Gmail app on phone

### What You Need:

- **Now:** Just your personal Gmail (FREE)
- **Launch:** Google Workspace ($6/month)
- **Scale:** AWS SES + Workspace ($7/month)

---

**Created:** November 19, 2025
**Recommendation:** Start with personal Gmail, upgrade to Google Workspace at launch
**Cost:** FREE now, $6/month later

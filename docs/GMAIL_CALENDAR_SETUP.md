# Gmail & Google Calendar Integration Setup

Complete guide to integrate Gmail SMTP and Google Calendar API.

---

## Part 1: Gmail SMTP Setup (Email Sending)

### Step 1: Enable 2-Factor Authentication (5 minutes)

1. Go to https://myaccount.google.com/security
2. Click "2-Step Verification"
3. Follow the setup process
4. Verify with your phone

### Step 2: Generate App Password (2 minutes)

1. Go to https://myaccount.google.com/apppasswords
2. Select app: **Mail**
3. Select device: **Other (Custom name)**
4. Enter name: `Career Copilot`
5. Click **Generate**
6. **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)
7. Save it - you won't see it again!

### Step 3: Add to Environment Variables

```env
# Add to backend/.env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

### Step 4: Test Email Sending

```javascript
// Test script
const emailService = require("./services/emailService");

emailService
  .sendPaymentSuccessEmail("test@example.com", "Test User", "9.99", "Pro Plan")
  .then(() => {
    console.log("Email sent successfully!");
  })
  .catch((error) => {
    console.error("Email failed:", error);
  });
```

---

## Part 2: Google Calendar API Setup (15 minutes)

### Step 1: Create Google Cloud Project

1. Go to https://console.cloud.google.com
2. Click "Select a project" → "New Project"
3. Project name: `Career Copilot`
4. Click **Create**
5. Wait for project creation (30 seconds)

### Step 2: Enable Google Calendar API

1. In the project, go to **APIs & Services** → **Library**
2. Search for "Google Calendar API"
3. Click on it
4. Click **Enable**
5. Wait for activation (10 seconds)

### Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. If prompted, configure OAuth consent screen first:

#### Configure OAuth Consent Screen:

- User Type: **External**
- App name: `Career Copilot`
- User support email: Your email
- Developer contact: Your email
- Scopes: Add `calendar` and `calendar.events`
- Test users: Add your email
- Click **Save and Continue**

#### Create OAuth Client ID:

- Application type: **Web application**
- Name: `Career Copilot Web`
- Authorized JavaScript origins:
  - `http://localhost:3000`
  - `http://localhost:5000`
  - `https://careercopilot.com` (add when deployed)
- Authorized redirect URIs:
  - `http://localhost:5000/api/google/callback`
  - `https://careercopilot.com/api/google/callback` (add when deployed)
- Click **Create**

4. **Copy Client ID and Client Secret**
5. Download JSON (optional backup)

### Step 4: Add to Environment Variables

```env
# Add to backend/.env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwx
GOOGLE_REDIRECT_URI=http://localhost:5000/api/google/callback
```

### Step 5: Install Required Packages

```bash
cd backend
npm install googleapis nodemailer
```

### Step 6: Add Routes to Server

```javascript
// backend/server.js or server-secure.js
const googleRoutes = require("./routes/google");
app.use("/api/google", googleRoutes);
```

---

## Part 3: Testing

### Test 1: Gmail SMTP

```bash
# Start backend
cd backend
npm start

# Test email endpoint
curl -X POST http://localhost:5000/api/test/email \
  -H "Content-Type: application/json" \
  -d '{"to": "your-email@gmail.com", "subject": "Test", "body": "Hello!"}'

# Check your inbox
```

### Test 2: Google Calendar OAuth

1. Start backend: `npm start`
2. Start frontend: `npm run dev`
3. Go to `http://localhost:3000/calendar`
4. Click "Connect Google Calendar"
5. Sign in with Google
6. Grant permissions
7. Should redirect back with success

### Test 3: Create Calendar Event

```bash
# After connecting calendar, test creating event
curl -X POST http://localhost:5000/api/google/calendar/interview \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "tokens": {...},
    "company": "Google",
    "position": "Software Engineer",
    "date": "2025-01-15T10:00:00Z",
    "type": "Technical Interview"
  }'

# Check your Google Calendar
```

---

## Part 4: Features Implemented

### Email Features:

✅ Payment success emails
✅ Payment failed emails
✅ Welcome emails
✅ Password reset emails
✅ Application deadline reminders
✅ Interview reminders

### Calendar Features:

✅ OAuth 2.0 authentication
✅ Schedule interview prep sessions
✅ Set application deadlines
✅ Add networking events
✅ Create custom events
✅ List upcoming events
✅ Update events
✅ Delete events

---

## Part 5: Usage Examples

### Send Welcome Email

```javascript
const emailService = require("./services/emailService");

await emailService.sendWelcomeEmail("user@example.com", "John Doe");
```

### Schedule Interview Prep

```javascript
const calendarService = require("./services/googleCalendarService");

const result = await calendarService.scheduleInterviewPrep(userTokens, {
  company: "Microsoft",
  position: "Product Manager",
  date: "2025-02-01T14:00:00Z",
  type: "Behavioral Interview",
  timeZone: "America/New_York",
});

console.log("Event created:", result.htmlLink);
```

### Set Application Deadline

```javascript
await calendarService.scheduleApplicationDeadline(userTokens, {
  company: "Amazon",
  position: "SDE Intern",
  deadline: "2025-01-31",
  applicationUrl: "https://amazon.jobs/apply/123",
  timeZone: "America/Los_Angeles",
});
```

---

## Part 6: Security Best Practices

### Gmail App Password:

- ✅ Never commit to Git (in .gitignore)
- ✅ Use environment variables
- ✅ Rotate every 90 days
- ✅ Revoke if compromised

### Google OAuth:

- ✅ Use HTTPS in production
- ✅ Validate redirect URIs
- ✅ Store tokens securely (encrypted in database)
- ✅ Implement token refresh
- ✅ Request minimum scopes needed

### Token Storage:

```javascript
// ❌ DON'T: Store in localStorage (vulnerable to XSS)
localStorage.setItem("googleTokens", JSON.stringify(tokens));

// ✅ DO: Store in database, encrypted
await saveTokensToDatabase(userId, encryptTokens(tokens));
```

---

## Part 7: Production Deployment

### Update Environment Variables:

```env
# Production .env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@careercopilot.com
EMAIL_PASSWORD=your-app-password

GOOGLE_CLIENT_ID=your-production-client-id
GOOGLE_CLIENT_SECRET=your-production-secret
GOOGLE_REDIRECT_URI=https://careercopilot.com/api/google/callback

FRONTEND_URL=https://careercopilot.com
```

### Update OAuth Consent Screen:

1. Go to Google Cloud Console
2. OAuth consent screen → Edit
3. Publishing status: **In Production**
4. Add production redirect URIs
5. Submit for verification (if needed)

---

## Part 8: Rate Limits & Quotas

### Gmail SMTP:

- **Free Gmail:** 500 emails/day
- **Google Workspace:** 2,000 emails/day
- **Recommendation:** Use AWS SES for production (50,000 emails/day free)

### Google Calendar API:

- **Queries:** 1,000,000 requests/day (free)
- **Rate limit:** 10 requests/second per user
- **Recommendation:** Implement caching and rate limiting

---

## Part 9: Error Handling

### Common Errors:

#### Gmail SMTP:

```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
Solution: Generate new app password, check 2FA is enabled
```

#### Google Calendar:

```
Error: invalid_grant
Solution: Token expired, request new authorization
```

```
Error: insufficient permissions
Solution: Request calendar.events scope
```

---

## Part 10: Monitoring

### Metrics to Track:

- Email delivery rate
- Email bounce rate
- Calendar events created
- OAuth authorization success rate
- API error rate

### Set Up Alerts:

- Email delivery < 95%
- Calendar API errors > 10/hour
- OAuth failures > 5/hour

---

## Cost Summary

### Gmail SMTP:

- **Cost:** FREE (up to 500 emails/day)
- **Alternative:** AWS SES ($0.10 per 1,000 emails)

### Google Calendar API:

- **Cost:** FREE (1M requests/day)
- **No credit card required**

**Total Cost: $0/month** 🎉

---

## Files Created:

✅ `backend/services/googleCalendarService.js` - Calendar integration
✅ `backend/services/emailService.js` - Email sending
✅ `backend/routes/google.js` - API endpoints
✅ `src/components/CalendarIntegration.tsx` - Frontend UI

---

## Next Steps:

1. ✅ Set up Gmail app password
2. ✅ Create Google Cloud project
3. ✅ Enable Calendar API
4. ✅ Create OAuth credentials
5. ✅ Add to .env
6. ✅ Install packages
7. ✅ Test email sending
8. ✅ Test calendar integration
9. 🔄 Deploy to production

---

**Created:** November 19, 2025
**Status:** Ready to use
**Cost:** FREE
**Time to setup:** 20 minutes

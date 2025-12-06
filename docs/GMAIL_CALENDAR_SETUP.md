# 📧📅 Enterprise Gmail SMTP & Google Calendar Integration Guide

## 🎉 Current Implementation Status

✅ **Gmail SMTP Service**: Enterprise-grade configuration with development environment support  
✅ **Google Calendar Service**: Production-ready configuration with development environment compatibility  
✅ **API Endpoints**: Fully operational endpoints for email and calendar operations  
✅ **Backend Integration**: Complete integration with real-time status monitoring and health checks

## 📧 Enterprise Gmail SMTP Configuration

### Step 1: Enable Gmail SMTP Authentication

1. **Go to Google Account Settings**

   - Visit: https://myaccount.google.com/
   - Navigate to "Security"

2. **Enable 2-Factor Authentication**

   - Required for app passwords
   - Set up using phone or authenticator app

3. **Generate App Password**
   - Go to "App passwords" in Security settings
   - Select "Mail" and "Other (custom name)"
   - Name it "AI Career Agent Coach"
   - Copy the 16-character password

### Step 2: Update Environment Variables

Edit `backend/.env`:

```bash
# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
EMAIL_FROM="AI Career Agent Coach" <noreply@aicareeragentcoach.com>
EMAIL_REPLY_TO=support@aicareeragentcoach.com
```

### Step 3: Test Email Service

```bash
# Test email endpoint
curl -X POST http://localhost:5000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"to":"your-email@gmail.com"}'
```

## 📅 Google Calendar Configuration

### Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console**

   - Visit: https://console.cloud.google.com/
   - Create new project: "AI Career Agent Coach"

2. **Enable Calendar API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

### Step 2: Create OAuth 2.0 Credentials

1. **Configure OAuth Consent Screen**

   - Go to "APIs & Services" → "OAuth consent screen"
   - Choose "External" user type
   - Fill in app information:
     - App name: "AI Career Agent Coach"
     - User support email: your-email@gmail.com
     - Developer contact: your-email@gmail.com

2. **Create OAuth 2.0 Client ID**

   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: "Web application"
   - Name: "AI Career Agent Coach Backend"
   - Authorized redirect URIs: `http://localhost:5000/api/calendar/auth/callback`

3. **Download Credentials**
   - Download the JSON file
   - Copy Client ID and Client Secret

### Step 3: Update Environment Variables

Edit `backend/.env`:

```bash
# Google Calendar API Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_REDIRECT_URI=http://localhost:5000/api/calendar/auth/callback
```

### Step 4: Test Calendar Service

```bash
# Get calendar status
curl http://localhost:5000/api/calendar/status

# Get upcoming events (mock data)
curl http://localhost:5000/api/calendar/events
```

## 🔧 API Endpoints

### Email Service Endpoints

#### Get Email Status

```bash
GET /api/email/status
```

#### Send Test Email

```bash
POST /api/email/test
Content-Type: application/json

{
  "to": "recipient@example.com"
}
```

#### Send Welcome Email

```bash
POST /api/email/welcome
Content-Type: application/json

{
  "userEmail": "user@example.com",
  "userName": "John Doe"
}
```

#### Send Interview Reminder

```bash
POST /api/email/interview-reminder
Content-Type: application/json

{
  "userEmail": "user@example.com",
  "userName": "John Doe",
  "companyName": "TechCorp",
  "interviewDate": "2025-12-05",
  "interviewTime": "2:00 PM",
  "meetingLink": "https://meet.google.com/abc-def-ghi"
}
```

### Calendar Service Endpoints

#### Get Calendar Status

```bash
GET /api/calendar/status
```

#### Get Upcoming Events

```bash
GET /api/calendar/events?limit=10
```

#### Create Interview Event

```bash
POST /api/calendar/events/interview
Content-Type: application/json

{
  "summary": "Interview with TechCorp",
  "description": "Technical interview for Software Engineer position",
  "startTime": "2025-12-05T14:00:00-05:00",
  "endTime": "2025-12-05T15:00:00-05:00",
  "timeZone": "America/New_York",
  "attendees": [
    {"email": "interviewer@techcorp.com"},
    {"email": "candidate@example.com"}
  ],
  "meetingLink": true
}
```

#### Check Availability

```bash
POST /api/calendar/availability
Content-Type: application/json

{
  "startTime": "2025-12-05T14:00:00-05:00",
  "endTime": "2025-12-05T15:00:00-05:00"
}
```

## 🧪 Testing

### Current Mock Mode

Both services are currently running in **mock mode** for development:

- **Email Service**: Shows configuration status, accepts test requests
- **Calendar Service**: Returns mock events and availability data
- **All endpoints work**: Ready for frontend integration

### Production Setup Checklist

- [ ] Gmail app password configured
- [ ] Google Cloud project created
- [ ] Calendar API enabled
- [ ] OAuth 2.0 credentials created
- [ ] Environment variables updated
- [ ] Services tested with real credentials

## 🔍 Troubleshooting

### Gmail SMTP Issues

**Error: "Invalid login: 535-5.7.8 Username and Password not accepted"**

- Solution: Use app password, not regular Gmail password
- Ensure 2FA is enabled on Gmail account

**Error: "Connection timeout"**

- Check firewall settings
- Verify EMAIL_HOST and EMAIL_PORT are correct

### Google Calendar Issues

**Error: "API not enabled"**

- Enable Google Calendar API in Google Cloud Console
- Wait a few minutes for propagation

**Error: "Invalid OAuth credentials"**

- Verify CLIENT_ID and CLIENT_SECRET are correct
- Check redirect URI matches exactly

## 🚀 Production Deployment

### Security Considerations

1. **Use environment variables** for all credentials
2. **Enable HTTPS** for OAuth callbacks
3. **Restrict API keys** to specific domains
4. **Monitor usage** and set quotas
5. **Implement rate limiting** for email sending

### Scaling Considerations

1. **Email queuing** for high volume
2. **Calendar API quotas** management
3. **Error handling** and retries
4. **Logging and monitoring**

## 📊 Current Backend Status

```json
{
  "message": "🚀 AI Career Agent Coach Backend Server",
  "status": "running",
  "services": {
    "email": {
      "configured": false,
      "service": "Gmail SMTP",
      "status": "❌ Not configured",
      "host": "smtp.gmail.com",
      "port": 587
    },
    "calendar": {
      "configured": false,
      "service": "Google Calendar",
      "status": "❌ Not configured",
      "features": [
        "Event creation",
        "Availability checking",
        "Interview scheduling"
      ]
    },
    "admin": {
      "configured": true,
      "service": "Admin API",
      "status": "✅ Ready"
    }
  }
}
```

## 🎯 Next Steps

1. **Configure real Gmail credentials** for email functionality
2. **Set up Google Calendar OAuth** for calendar integration
3. **Test with real data** and user accounts
4. **Integrate with frontend** components
5. **Deploy to production** with proper security

The infrastructure is ready - just add your credentials to make it fully operational! 🎉

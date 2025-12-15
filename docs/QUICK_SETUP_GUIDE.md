# Quick Setup Guide - Get Your AI Career Agent Live in 30 Minutes

## 🎯 **Goal: Test Your Complete AI Career Agent Platform**

### **Step 1: Google API Setup (10 minutes)**

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create New Project**: "AI Career Agent"
3. **Enable APIs**:
   - Gmail API
   - Google Calendar API
4. **Create Credentials**:
   - API Key (for general access)
   - OAuth 2.0 Client ID (for user authentication)
5. **Configure OAuth Consent Screen**:
   - App name: "AI Career Agent"
   - User support email: your email
   - Scopes: Gmail read/send, Calendar read/write

### **Step 2: Update Environment Variables (2 minutes)**

Add to your `.env` file:

```env
# Google APIs - Replace with your actual credentials
VITE_GOOGLE_API_KEY=your_actual_api_key_here
VITE_GOOGLE_CLIENT_ID=your_actual_client_id_here.apps.googleusercontent.com
```

### **Step 3: Test the Platform (5 minutes)**

1. **Start the server**: `npm run dev`
2. **Open**: http://localhost:3000
3. **Navigate to**: "Morning Brief" or "AI Scheduler"
4. **Sign in with Google** when prompted
5. **Grant permissions** for Gmail and Calendar access

### **Step 4: Test AI Agent Workflow (10 minutes)**

**Option A: Send yourself a test email**

```
To: your-email@gmail.com
Subject: Interview Invitation - Software Engineer Role
Body:
Hi [Your Name],

We'd like to schedule an interview for the Software Engineer position.
Are you available this week for a 45-minute video call?

Best regards,
Test Recruiter
```

**Option B: Use the demo mode**

- Navigate to "AI Scheduler Dashboard"
- Click "Test Agent" to simulate email processing
- Watch the complete workflow in action

### **Step 5: Verify Everything Works (3 minutes)**

✅ **Check Morning Dashboard**: Shows today's events
✅ **Check AI Scheduler**: Shows agent activity  
✅ **Check Calendar**: Events created automatically
✅ **Check Email**: Professional responses sent
✅ **Check Application Tracking**: Status updated

## 🎉 **Success! Your AI Career Agent is Live!**

If everything works, you now have a **fully functional AI career management platform** that:

- Automatically responds to interview invitations
- Creates calendar events with prep time
- Tracks applications across platforms
- Provides daily career briefings
- Handles professional communications

## 🚀 **Next: Production Deployment**

Once testing is complete, we'll deploy to production with:

- AWS hosting for scalability
- Custom domain setup
- SSL certificates
- Production database
- Monitoring and analytics

## 🐛 **Troubleshooting**

**Google API Issues:**

- Check API keys are correct
- Verify OAuth consent screen is configured
- Ensure Gmail/Calendar APIs are enabled

**Permission Issues:**

- Grant all requested permissions
- Check browser console for errors
- Try incognito mode if issues persist

**Email Processing Issues:**

- Check AWS Bedrock credentials
- Verify DynamoDB tables exist
- Check browser network tab for API errors

## 📞 **Need Help?**

If you encounter any issues:

1. Check browser console for errors
2. Verify all environment variables are set
3. Ensure AWS infrastructure is running
4. Test with a fresh browser session

**Your AI Career Agent Platform is ready to revolutionize student job searching!** 🎯

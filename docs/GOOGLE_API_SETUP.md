# Google API Setup Guide

To enable Gmail and Calendar integration for the AI Availability Agent, you need to set up Google API credentials.

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your project ID

## Step 2: Enable Required APIs

1. In the Google Cloud Console, go to **APIs & Services > Library**
2. Enable the following APIs:
   - **Gmail API**
   - **Google Calendar API**

## Step 3: Create Credentials

1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > API Key**
3. Copy the API key and add it to your `.env` file as `VITE_GOOGLE_API_KEY`

## Step 4: Create OAuth 2.0 Client ID

1. In **APIs & Services > Credentials**, click **Create Credentials > OAuth client ID**
2. Choose **Web application**
3. Add your domain to **Authorized JavaScript origins**:
   - For development: `http://localhost:3000`
   - For production: `https://yourdomain.com`
4. Copy the Client ID and add it to your `.env` file as `VITE_GOOGLE_CLIENT_ID`

## Step 5: Configure OAuth Consent Screen

1. Go to **APIs & Services > OAuth consent screen**
2. Choose **External** user type
3. Fill in the required information:
   - App name: "AI Career Agent"
   - User support email: your email
   - Developer contact information: your email
4. Add scopes:
   - `https://www.googleapis.com/auth/gmail.readonly`
   - `https://www.googleapis.com/auth/calendar`

## Step 6: Update Environment Variables

Add these to your `.env` file:

```env
# Google APIs for Gmail and Calendar Integration
VITE_GOOGLE_API_KEY=your_actual_api_key_here
VITE_GOOGLE_CLIENT_ID=your_actual_client_id_here
```

## Step 7: Test the Integration

1. Restart your development server
2. Navigate to the "Morning Dashboard" or "AI Scheduler" pages
3. The system will prompt you to sign in with Google
4. Grant permissions for Gmail and Calendar access

## Security Notes

- Keep your API credentials secure
- Never commit real credentials to version control
- Use environment variables for all sensitive data
- Consider using Google's service account for production

## Troubleshooting

**"Access blocked" error:**

- Make sure your OAuth consent screen is properly configured
- Add your test users to the OAuth consent screen if in testing mode

**"Invalid client" error:**

- Verify your Client ID is correct
- Check that your domain is added to authorized origins

**API quota exceeded:**

- Google APIs have daily quotas
- Monitor your usage in the Google Cloud Console
- Consider upgrading to a paid plan for higher limits

## Production Deployment

For production:

1. Verify your domain in Google Search Console
2. Submit your app for OAuth verification if needed
3. Use environment variables on your hosting platform
4. Monitor API usage and costs

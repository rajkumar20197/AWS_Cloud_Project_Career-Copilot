# AWS Setup Guide - Real Data Integration

This guide will help you configure the AI Career Agent Platform to use real AWS Bedrock AI instead of mock data.

## Current Status

The application has been updated to:

- ✅ Remove fallback mock data from AI services
- ✅ Require proper AWS credentials for AI features
- ✅ Show clear error messages when credentials are missing
- ✅ Display AWS configuration status in the UI
- ✅ Use real AWS Bedrock Claude 3.5 Haiku for all AI operations

## Prerequisites

1. **AWS Account** with access to AWS Bedrock
2. **Bedrock Model Access** - Claude 3.5 Haiku must be enabled in your region
3. **IAM User** with appropriate permissions

## Step 1: Enable AWS Bedrock Access

1. Log in to [AWS Console](https://console.aws.amazon.com/)
2. Navigate to **AWS Bedrock** service
3. Go to **Model access** in the left sidebar
4. Click **Manage model access**
5. Find **Anthropic** → **Claude 3.5 Haiku** and enable it
6. Wait for access to be granted (usually instant)

## Step 2: Create IAM User with Bedrock Permissions

1. Go to **IAM** → **Users** → **Create user**
2. User name: `career-agent-bedrock-user`
3. Attach the following policy (or create a custom one):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-5-haiku-*"
    }
  ]
}
```

4. Create **Access Keys** for this user:
   - Go to **Security credentials** tab
   - Click **Create access key**
   - Choose **Application running outside AWS**
   - Save the **Access Key ID** and **Secret Access Key**

## Step 3: Configure Environment Variables

1. Create a `.env` file in the project root (if it doesn't exist)
2. Add your AWS credentials:

```env
# AWS Configuration
VITE_AWS_REGION=us-east-1
VITE_AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
VITE_AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

# AWS Bedrock Model
VITE_BEDROCK_MODEL_ID=anthropic.claude-3-5-haiku-20241022-v1:0

# Feature Flags
VITE_USE_MOCK_DATA=false
VITE_ENABLE_AWS_BEDROCK=true

# Environment
VITE_ENVIRONMENT=development
```

**Important:** Replace the example values with your actual credentials!

## Step 4: Restart the Development Server

1. Stop the current dev server (Ctrl+C)
2. Restart it:

```bash
npm run dev
```

3. The app will now use real AWS Bedrock AI!

## Step 5: Verify Configuration

1. Open the application in your browser
2. Navigate to any page with AI features (Job Search, Resume Optimizer, etc.)
3. Look for the status banner at the top:
   - ✅ **Green "AWS Bedrock Connected"** = Working correctly
   - ⚠️ **Orange "AWS Configuration Required"** = Credentials missing or invalid
   - 🔵 **Blue "Demo Mode"** = Using mock data (VITE_USE_MOCK_DATA=true)

## Features Now Using Real AWS Bedrock AI

Once configured, these features will use real AI:

1. **Job Compatibility Scoring** - AI analyzes how well jobs match your profile
2. **Resume Analysis** - AI reviews your resume and provides feedback
3. **Resume Tailoring** - AI suggests how to customize resume for specific jobs
4. **Career Roadmap** - AI generates personalized career development plans
5. **Market Insights** - AI provides job market intelligence
6. **Interview Questions** - AI generates likely interview questions
7. **Email Analysis** - AI detects interview invitations in emails

## Troubleshooting

### Error: "AWS Access Denied"

- Check that your IAM user has the correct Bedrock permissions
- Verify the policy includes `bedrock:InvokeModel` action
- Ensure the resource ARN matches the Claude model

### Error: "Bedrock model not found"

- Verify you have enabled Claude 3.5 Haiku in AWS Bedrock
- Check that you're using the correct region (us-east-1 recommended)
- Model ID should be: `anthropic.claude-3-5-haiku-20241022-v1:0`

### Error: "AWS credentials not configured"

- Ensure `.env` file exists in project root
- Check that variable names start with `VITE_` prefix
- Restart the dev server after changing `.env`

### Still seeing mock data

- Check that `VITE_USE_MOCK_DATA=false` in `.env`
- Verify credentials are correct (no typos)
- Check browser console for specific error messages

## Cost Considerations

AWS Bedrock Claude 3.5 Haiku pricing (as of 2024):

- **Input**: ~$0.25 per 1M tokens
- **Output**: ~$1.25 per 1M tokens

Typical usage for this app:

- Job scoring: ~100 tokens per job
- Resume analysis: ~500-1000 tokens
- Career roadmap: ~1000-2000 tokens

**Estimated cost for testing**: $0.10 - $1.00 per day of active use

## Security Best Practices

1. **Never commit `.env` file** to version control
2. **Use IAM roles** instead of access keys in production
3. **Rotate access keys** regularly
4. **Set up CloudWatch alarms** for unusual API usage
5. **Use least privilege** - only grant necessary permissions

## Next Steps

After AWS is configured, you can:

1. Test all AI features with real data
2. Add your own resume for analysis
3. Input your actual skills and career goals
4. Get personalized job recommendations
5. Generate real career roadmaps

## Support

If you encounter issues:

1. Check the browser console for detailed error messages
2. Review AWS CloudWatch logs for Bedrock API calls
3. Verify IAM permissions in AWS Console
4. Ensure Bedrock model access is granted

---

**Ready to use real AI!** 🚀

Once configured, the platform will provide genuine AI-powered career guidance using AWS Bedrock Claude 3.5 Haiku.

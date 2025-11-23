# Quick Start - Real Data Integration

## What Changed?

The application has been updated to use **real AWS Bedrock AI** instead of mock data. You'll now see actual AI-powered features!

## Current Status

✅ **Completed:**

- Removed all fallback mock data from AI services
- Added AWS configuration validation
- Created visual status indicators
- Updated Job Search Dashboard to use real data
- Added proper error handling and loading states

## Quick Setup (3 minutes)

### Option 1: Use Real AWS Bedrock (Recommended)

1. **Get AWS Credentials:**

   - Go to [AWS Console](https://console.aws.amazon.com/) → IAM → Users
   - Create access key or use existing one

2. **Enable Bedrock:**

   - Go to AWS Bedrock service
   - Enable "Claude 3.5 Haiku" model access

3. **Configure `.env` file:**

   ```bash
   # Copy the template
   cp .env.example .env

   # Edit .env and add your credentials:
   VITE_AWS_REGION=us-east-1
   VITE_AWS_ACCESS_KEY_ID=your_actual_key_here
   VITE_AWS_SECRET_ACCESS_KEY=your_actual_secret_here
   VITE_USE_MOCK_DATA=false
   ```

4. **Restart the server:**

   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

5. **Verify:** Open http://localhost:3000 and look for the green "AWS Bedrock Connected" banner!

### Option 2: Demo Mode (No AWS Account Needed)

If you don't have AWS credentials yet, you can still test with mock data:

1. **Create `.env` file:**

   ```bash
   VITE_USE_MOCK_DATA=true
   VITE_ENABLE_AWS_BEDROCK=false
   ```

2. **Restart server:**

   ```bash
   npm run dev
   ```

3. **You'll see:** Blue "Demo Mode" banner - all features work with sample data

## What You'll See

### ✅ With AWS Configured:

- 🟢 Green "AWS Bedrock Connected" banner
- Real AI job compatibility scores
- Actual AI resume analysis
- Live career roadmap generation
- Real market insights from AI

### ⚠️ Without AWS Configured:

- 🟠 Orange warning banner with setup instructions
- Clear error messages explaining what's missing
- Links to documentation
- Option to use demo mode

### 🔵 In Demo Mode:

- Blue "Demo Mode" banner
- All features work with sample data
- No AWS costs
- Perfect for testing UI/UX

## Features Using Real AI

Once AWS is configured, these features use real Bedrock AI:

| Feature              | What It Does                         | AI Model         |
| -------------------- | ------------------------------------ | ---------------- |
| **Job Scoring**      | Calculates compatibility (0-100)     | Claude 3.5 Haiku |
| **Resume Analysis**  | Reviews resume, finds improvements   | Claude 3.5 Haiku |
| **Resume Tailoring** | Customizes resume for specific jobs  | Claude 3.5 Haiku |
| **Career Roadmap**   | Creates personalized career plan     | Claude 3.5 Haiku |
| **Market Insights**  | Provides job market intelligence     | Claude 3.5 Haiku |
| **Interview Prep**   | Generates likely interview questions | Claude 3.5 Haiku |
| **Email Analysis**   | Detects interview invitations        | Claude 3.5 Haiku |

## Cost Estimate

AWS Bedrock Claude 3.5 Haiku is very affordable:

- **Input:** ~$0.25 per 1M tokens
- **Output:** ~$1.25 per 1M tokens

**Typical usage:**

- Analyzing 10 jobs: ~$0.01
- Resume analysis: ~$0.02
- Career roadmap: ~$0.03
- **Daily testing:** $0.10 - $0.50

## Troubleshooting

### "AWS Configuration Required" banner shows

**Solution:** Add your AWS credentials to `.env` file (see Option 1 above)

### "AWS Access Denied" error

**Solutions:**

1. Check IAM user has `bedrock:InvokeModel` permission
2. Verify credentials are correct (no typos)
3. Ensure Bedrock is enabled in your region

### "Bedrock model not found" error

**Solutions:**

1. Go to AWS Bedrock → Model access
2. Enable "Claude 3.5 Haiku"
3. Wait a few seconds for activation
4. Try again

### Still seeing mock data

**Solutions:**

1. Check `.env` has `VITE_USE_MOCK_DATA=false`
2. Restart dev server (Ctrl+C, then `npm run dev`)
3. Hard refresh browser (Ctrl+Shift+R)
4. Check browser console for errors

## Next Steps

1. ✅ **Test Job Search** - See real AI compatibility scores
2. ✅ **Try Resume Optimizer** - Upload your resume for AI analysis
3. ✅ **Generate Career Roadmap** - Get personalized career plan
4. ✅ **Check Market Intelligence** - View AI-powered insights

## Documentation

- **Full Setup Guide:** See `AWS_SETUP_GUIDE.md`
- **Technical Details:** See `REAL_DATA_MIGRATION_SUMMARY.md`
- **AWS Bedrock Docs:** https://docs.aws.amazon.com/bedrock/

## Support

Having issues? Check:

1. Browser console (F12) for error messages
2. `.env` file configuration
3. AWS Console → Bedrock → Model access
4. IAM user permissions

---

**Ready to experience real AI-powered career guidance!** 🚀

The platform now uses genuine AWS Bedrock AI to help you find your dream job.

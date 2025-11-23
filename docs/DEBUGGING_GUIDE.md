# 🔍 Debugging Guide - Error Handling & Troubleshooting

## What I Added for Better Error Visibility

### 1. Debug Panel (NEW!)

A collapsible debug panel now appears on the Job Search page showing:

- ✅ AWS configuration status
- ✅ Feature flags (mock data mode, AWS enabled)
- ✅ Missing configuration fields
- ✅ Quick actions (reload, clear console)

**How to use it:**

1. Go to Job Search page
2. Click on the purple "Debug Panel" banner
3. See all configuration details at a glance

### 2. Enhanced Console Logging

The app now logs detailed information to the browser console:

```
🔍 DataService.fetchJobs() called
📊 Config: { useMockData: false, shouldUseRealAWS: true, ... }
✅ AWS configured - attempting to use real AI for job scoring
👤 User profile: { skills: [...], careerStage: 'graduate' }
🤖 Calculating AI score for job 1/6: Senior Software Engineer
✅ Job Senior Software Engineer: AI Score = 94
📊 Job scoring complete: 6 successful, 0 failed
```

### 3. Error Display in UI

When errors occur, you'll see:

- 🔴 Red error card with the error message
- "Try Again" button to retry
- Toast notification with error details

---

## How to See What's Happening

### Step 1: Open Browser Console

1. **Chrome/Edge:** Press `F12` or `Ctrl+Shift+I`
2. **Firefox:** Press `F12` or `Ctrl+Shift+K`
3. **Safari:** Press `Cmd+Option+I`

### Step 2: Go to Console Tab

Click on the "Console" tab at the top

### Step 3: Navigate to Job Search

Click "Job Search" in the sidebar

### Step 4: Watch the Logs

You should see logs like:

```
🔍 DataService.fetchJobs() called
📊 Config: ...
✅ AWS configured - attempting to use real AI
🤖 Calculating AI score for job 1/6: ...
```

---

## What You Should See (Success Case)

### In the UI:

1. **Green banner:** "AWS Bedrock Connected"
2. **Debug Panel:** Shows all config as valid
3. **Loading spinner:** Briefly while fetching
4. **Jobs appear:** With AI-calculated scores
5. **Toast notification:** "Loaded 6 job opportunities"

### In the Console:

```
🔍 DataService.fetchJobs() called
📊 Config: {
  useMockData: false,
  shouldUseRealAWS: true,
  awsRegion: 'us-east-1',
  hasAccessKey: true,
  hasSecretKey: true
}
✅ AWS configured - attempting to use real AI for job scoring
👤 User profile: { skills: ['JavaScript', 'React', ...], careerStage: 'graduate' }
🤖 Calculating AI score for job 1/6: Senior Software Engineer
✅ Job Senior Software Engineer: AI Score = 94
🤖 Calculating AI score for job 2/6: Full Stack Developer
✅ Job Full Stack Developer: AI Score = 89
...
📊 Job scoring complete: 6 successful, 0 failed
```

---

## Common Error Scenarios

### Error 1: "AWS credentials not configured"

**What you'll see:**

- 🟠 Orange warning banner
- Debug Panel shows missing fields
- Console: `⚠️ Using mock job data`

**Solution:**

1. Check `.env` file has correct credentials
2. Restart dev server
3. Hard refresh browser (Ctrl+Shift+R)

---

### Error 2: "AWS Access Denied"

**What you'll see:**

- 🔴 Red error card
- Console: `❌ Failed to calculate AI score`
- Error message: "AWS Access Denied"

**Possible causes:**

1. IAM user doesn't have Bedrock permissions
2. Credentials are incorrect
3. Bedrock not enabled in your region

**Solution:**

1. Go to AWS IAM Console
2. Check user has `bedrock:InvokeModel` permission
3. Verify credentials are correct
4. Check Bedrock is enabled in us-east-1

---

### Error 3: "Bedrock model not found"

**What you'll see:**

- 🔴 Red error card
- Console: `❌ ResourceNotFoundException`
- Error: "Bedrock model not found"

**Possible causes:**

1. Claude 3.5 Haiku not enabled
2. Wrong region
3. Model ID incorrect

**Solution:**

1. Go to AWS Bedrock Console
2. Check Model access (should be automatic now)
3. Verify region is us-east-1
4. Try the Bedrock Playground to test

---

### Error 4: "Network Error" or "Timeout"

**What you'll see:**

- 🔴 Red error card
- Console: `❌ Network error`
- Jobs don't load

**Possible causes:**

1. No internet connection
2. AWS service outage
3. Firewall blocking AWS

**Solution:**

1. Check internet connection
2. Try accessing AWS Console
3. Check AWS Status page
4. Disable VPN if using one

---

### Error 5: Silent Failure (No errors but using mock data)

**What you'll see:**

- 🔵 Blue "Demo Mode" banner
- Or jobs load but scores don't change
- Console: `⚠️ Using mock job data`

**Possible causes:**

1. `VITE_USE_MOCK_DATA=true` in .env
2. Credentials not loaded
3. Server not restarted after .env change

**Solution:**

1. Check `.env` has `VITE_USE_MOCK_DATA=false`
2. Restart dev server
3. Hard refresh browser
4. Check Debug Panel

---

## Testing the Error Handling

### Test 1: Invalid Credentials

1. Edit `.env` and change one character in the secret key
2. Restart server
3. Go to Job Search
4. **Expected:** Red error card with "Access Denied"

### Test 2: Missing Credentials

1. Edit `.env` and set `VITE_AWS_ACCESS_KEY_ID=your_access_key_here`
2. Restart server
3. Go to Job Search
4. **Expected:** Orange warning banner

### Test 3: Demo Mode

1. Edit `.env` and set `VITE_USE_MOCK_DATA=true`
2. Restart server
3. Go to Job Search
4. **Expected:** Blue "Demo Mode" banner, jobs load instantly

---

## Debug Panel Features

### Configuration Display

Shows:

- ✅ AWS Region
- ✅ Access Key ID (first 8 chars)
- ✅ Secret Key (masked)
- ✅ Model ID

### Feature Flags

Shows:

- Use Mock Data: TRUE/FALSE
- Enable AWS Bedrock: TRUE/FALSE
- Should Use Real AWS: YES/NO

### Missing Configuration

Lists any missing or invalid fields

### Quick Actions

- **Reload App:** Refreshes the page
- **Clear Console:** Clears browser console

---

## Console Log Reference

| Icon | Meaning            |
| ---- | ------------------ |
| 🔍   | Function called    |
| 📊   | Configuration info |
| ✅   | Success            |
| ❌   | Error              |
| ⚠️   | Warning            |
| 🤖   | AI processing      |
| 👤   | User data          |
| 💰   | Cost info          |

---

## Monitoring AWS Costs

### In AWS Console:

1. Go to **Billing Dashboard**
2. Click **Bills**
3. Look for **Amazon Bedrock** charges
4. Should be very minimal ($0.01 - $0.10 per day testing)

### Set Up Billing Alert:

1. Go to **CloudWatch**
2. Create alarm for Bedrock costs
3. Set threshold (e.g., $5/day)
4. Get email if exceeded

---

## Advanced Debugging

### Check Network Requests:

1. Open DevTools (F12)
2. Go to **Network** tab
3. Filter by "bedrock"
4. See actual API calls to AWS

### Check Local Storage:

1. Open DevTools (F12)
2. Go to **Application** tab
3. Check **Local Storage**
4. See cached data

### Check Environment Variables:

1. In browser console, type:

```javascript
console.log(import.meta.env);
```

2. See all VITE\_ variables

---

## Getting Help

### Information to Provide:

1. **Screenshot** of Debug Panel (expanded)
2. **Console logs** (copy/paste)
3. **Error message** from UI
4. **AWS region** you're using
5. **Browser** and version

### Where to Check:

1. Browser console (F12)
2. Debug Panel on Job Search page
3. AWS CloudWatch logs (if available)
4. Network tab in DevTools

---

## Quick Troubleshooting Checklist

- [ ] `.env` file exists in project root
- [ ] Credentials are correct (no typos)
- [ ] `VITE_USE_MOCK_DATA=false`
- [ ] `VITE_ENABLE_AWS_BEDROCK=true`
- [ ] Dev server restarted after .env changes
- [ ] Browser hard refreshed (Ctrl+Shift+R)
- [ ] IAM user has Bedrock permissions
- [ ] Bedrock enabled in AWS Console
- [ ] Using us-east-1 region
- [ ] Internet connection working
- [ ] No VPN blocking AWS

---

**With these debugging tools, you can now see exactly what's happening!** 🔍

Open the Debug Panel and browser console to monitor everything in real-time.

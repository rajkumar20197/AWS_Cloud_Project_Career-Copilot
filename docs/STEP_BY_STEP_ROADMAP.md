# 🗺️ Step-by-Step Implementation Roadmap

**Created:** December 15, 2024  
**Status:** 📋 Ready to Execute  
**Estimated Total Time:** 4-6 weeks

---

## 📊 **Current Status Overview**

| Component | Status | Progress |
|-----------|--------|----------|
| **Frontend** | ✅ Complete | 100% |
| **UI/UX** | ✅ Polished | 95% |
| **Demo Data** | ✅ Working | 100% |
| **Refactoring** | ⚠️ In Progress | 25% |
| **Backend APIs** | ⚠️ Partial | 20% |
| **Database** | ❌ Not Started | 0% |
| **Gmail/Calendar** | ❌ Not Started | 0% |
| **Testing** | ⚠️ Partial | 30% |
| **Deployment** | ❌ Not Started | 0% |

**Overall Progress:** ~40% complete

---

## 🎯 **Implementation Phases**

We'll break this down into **manageable phases**, each with clear goals and deliverables.

---

# PHASE 1: Backend Foundation (Week 1)

**Goal:** Get core backend APIs working with database  
**Priority:** 🔴 CRITICAL  
**Time:** 5-7 days

---

## Step 1.1: Database Setup (Day 1 - 4 hours)

### **Task:** Set up DynamoDB tables

**What to do:**
1. Go to AWS Console → DynamoDB
2. Create 4 tables:

#### **Table 1: Users**
```
Table Name: ai-career-agent-users
Partition Key: userId (String)
Global Secondary Index: email-index
  - Partition Key: email (String)
Billing Mode: On-Demand
```

#### **Table 2: Jobs**
```
Table Name: ai-career-agent-jobs
Partition Key: jobId (String)
Sort Key: createdAt (Number)
Billing Mode: On-Demand
```

#### **Table 3: Applications**
```
Table Name: ai-career-agent-applications
Partition Key: userId (String)
Sort Key: applicationId (String)
Billing Mode: On-Demand
```

#### **Table 4: Interviews**
```
Table Name: ai-career-agent-interviews
Partition Key: userId (String)
Sort Key: interviewId (String)
Billing Mode: On-Demand
```

**Verification:**
- [ ] All 4 tables created
- [ ] Tables show "Active" status
- [ ] Indexes created successfully
- [ ] Note down table ARNs

**Cost:** ~$1-2/month (On-Demand pricing)

---

## Step 1.2: Backend Environment Setup (Day 1 - 2 hours)

### **Task:** Configure backend environment variables

**What to do:**

1. Navigate to `backend/` folder
2. Copy `.env.example` to `.env`
3. Fill in all required values:

```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# DynamoDB Tables
DYNAMODB_USERS_TABLE=ai-career-agent-users
DYNAMODB_JOBS_TABLE=ai-career-agent-jobs
DYNAMODB_APPLICATIONS_TABLE=ai-career-agent-applications
DYNAMODB_INTERVIEWS_TABLE=ai-career-agent-interviews

# AWS Cognito
COGNITO_USER_POOL_ID=us-east-1_RbxnBYOCS
COGNITO_CLIENT_ID=5a6kq9althf2te07sv157a26so

# AWS Bedrock
BEDROCK_MODEL_ID=us.anthropic.claude-3-5-haiku-20241022-v1:0

# Server Configuration
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

4. Repeat for `server/` folder

**Verification:**
- [ ] Both `.env` files created
- [ ] All values filled in
- [ ] No placeholder values remain
- [ ] Files added to `.gitignore`

---

## Step 1.3: User Profile API (Day 2 - 6 hours)

### **Task:** Implement user profile CRUD operations

**What to do:**

1. **Create DynamoDB Service** (`backend/services/dynamoService.js`):
```javascript
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

// Get user profile
async function getUserProfile(userId) {
  const command = new GetCommand({
    TableName: process.env.DYNAMODB_USERS_TABLE,
    Key: { userId }
  });
  const response = await docClient.send(command);
  return response.Item;
}

// Save user profile
async function saveUserProfile(profile) {
  const command = new PutCommand({
    TableName: process.env.DYNAMODB_USERS_TABLE,
    Item: {
      ...profile,
      updatedAt: Date.now()
    }
  });
  await docClient.send(command);
  return profile;
}

// Update user profile
async function updateUserProfile(userId, updates) {
  // Implementation here
}

module.exports = {
  getUserProfile,
  saveUserProfile,
  updateUserProfile
};
```

2. **Create User Routes** (`backend/routes/users.js`):
```javascript
const express = require('express');
const router = express.Router();
const { getUserProfile, saveUserProfile, updateUserProfile } = require('../services/dynamoService');

// GET /api/users/profile/:userId
router.get('/profile/:userId', async (req, res) => {
  try {
    const profile = await getUserProfile(req.params.userId);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// POST /api/users/profile
router.post('/profile', async (req, res) => {
  try {
    const profile = await saveUserProfile(req.body);
    res.status(201).json(profile);
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

// PUT /api/users/profile/:userId
router.put('/profile/:userId', async (req, res) => {
  try {
    const profile = await updateUserProfile(req.params.userId, req.body);
    res.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
```

3. **Update Backend Server** (`backend/server-simple.js`):
```javascript
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);
```

**Verification:**
- [ ] Start backend: `cd backend && npm run dev`
- [ ] Test GET: `curl http://localhost:3001/api/users/profile/test123`
- [ ] Test POST: Create a user profile
- [ ] Check DynamoDB console for saved data
- [ ] No errors in console

---

## Step 1.4: Frontend Integration (Day 3 - 4 hours)

### **Task:** Connect frontend to real backend

**What to do:**

1. **Update Profile Service** (`src/services/profileService.ts`):
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function getUserProfile(userId: string) {
  try {
    const response = await fetch(`${API_URL}/api/users/profile/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching profile:', error);
    // Fallback to demo data
    return demoDataService.getUserProfile();
  }
}

export async function saveUserProfile(profile: UserProfile) {
  try {
    const response = await fetch(`${API_URL}/api/users/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    if (!response.ok) {
      throw new Error('Failed to save profile');
    }
    return await response.json();
  } catch (error) {
    console.error('Error saving profile:', error);
    throw error;
  }
}
```

2. **Update Environment Variables** (`.env`):
```env
VITE_API_URL=http://localhost:3001
VITE_USE_REAL_BACKEND=true
```

3. **Test in Browser:**
   - Open http://localhost:3000
   - Complete onboarding
   - Check if profile saves to DynamoDB
   - Refresh page - profile should persist

**Verification:**
- [ ] Profile saves to database
- [ ] Profile loads on page refresh
- [ ] No console errors
- [ ] Fallback to demo data if backend offline

---

## Step 1.5: Testing & Documentation (Day 3 - 2 hours)

### **Task:** Test everything and document

**What to do:**

1. **Test Checklist:**
   - [ ] Create new user profile
   - [ ] Update existing profile
   - [ ] Load profile after refresh
   - [ ] Test with backend offline (should fallback)
   - [ ] Test with invalid data
   - [ ] Check error handling

2. **Create Documentation:**
   - Document API endpoints
   - Add example requests/responses
   - Note any issues found
   - Update TODO list

**Deliverable:**
- ✅ User profiles working end-to-end
- ✅ Data persists in DynamoDB
- ✅ Documentation complete

---

# PHASE 2: AI Job Generation (Week 2)

**Goal:** Replace demo jobs with real AI-generated jobs  
**Priority:** 🔴 HIGH  
**Time:** 5-7 days

---

## Step 2.1: Job API Integration (Day 1 - 4 hours)

### **Task:** Integrate real job search API

**Options:**

#### **Option A: Indeed API** (Recommended - Free)
```javascript
// backend/services/jobService.js
const axios = require('axios');

async function searchIndeedJobs(query, location) {
  const response = await axios.get('https://api.indeed.com/ads/apisearch', {
    params: {
      publisher: process.env.INDEED_PUBLISHER_ID,
      q: query,
      l: location,
      format: 'json',
      v: '2'
    }
  });
  return response.data.results;
}
```

#### **Option B: RapidAPI JSearch** (Paid - More reliable)
```javascript
async function searchJobs(query, location) {
  const response = await axios.get('https://jsearch.p.rapidapi.com/search', {
    params: { query, location },
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
    }
  });
  return response.data.data;
}
```

**What to do:**
1. Choose an API option
2. Sign up and get API key
3. Implement job search service
4. Create API endpoint: `GET /api/jobs/search`
5. Test with Postman/curl

**Verification:**
- [ ] API returns real job listings
- [ ] Jobs have all required fields
- [ ] Error handling works
- [ ] Rate limiting considered

---

## Step 2.2: AI Job Matching (Day 2-3 - 8 hours)

### **Task:** Use AWS Bedrock to match jobs to user profile

**What to do:**

1. **Create AI Matching Service** (`server/services/aiJobMatcher.js`):
```javascript
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

async function matchJobsToProfile(jobs, userProfile) {
  const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION });
  
  const prompt = `
You are an AI career advisor. Analyze these jobs and match them to the user's profile.

User Profile:
- Current Role: ${userProfile.currentRole}
- Target Role: ${userProfile.targetRole}
- Skills: ${userProfile.skills.join(', ')}
- Experience: ${userProfile.experience} years
- Location: ${userProfile.location}

Jobs:
${JSON.stringify(jobs, null, 2)}

For each job, provide:
1. Match score (0-100)
2. Reasons for match
3. Skill gaps
4. Salary alignment

Return as JSON array.
  `;

  const command = new InvokeModelCommand({
    modelId: process.env.BEDROCK_MODEL_ID,
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }]
    })
  });

  const response = await client.send(command);
  const result = JSON.parse(new TextDecoder().decode(response.body));
  return JSON.parse(result.content[0].text);
}
```

2. **Create Endpoint** (`server/routes/jobs.js`):
```javascript
router.post('/generate', async (req, res) => {
  try {
    const { userId, preferences } = req.body;
    
    // 1. Get user profile
    const profile = await getUserProfile(userId);
    
    // 2. Search for jobs
    const jobs = await searchJobs(profile.targetRole, profile.location);
    
    // 3. AI match jobs to profile
    const matchedJobs = await matchJobsToProfile(jobs, profile);
    
    // 4. Save top matches to DynamoDB
    await saveMatchedJobs(userId, matchedJobs);
    
    res.json(matchedJobs);
  } catch (error) {
    console.error('Error generating jobs:', error);
    res.status(500).json({ error: 'Failed to generate jobs' });
  }
});
```

**Verification:**
- [ ] AI generates match scores
- [ ] Jobs ranked by relevance
- [ ] Skill gaps identified
- [ ] Results saved to database

---

## Step 2.3: Frontend Job Swiper Update (Day 4 - 4 hours)

### **Task:** Connect JobSwiper to real backend

**What to do:**

1. **Update JobSwiper** (`src/components/JobSwiper.tsx`):
```typescript
useEffect(() => {
  async function loadJobs() {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/jobs/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: currentUser.id,
          preferences: userPreferences 
        })
      });
      
      if (response.ok) {
        const jobs = await response.json();
        setJobs(jobs);
      } else {
        // Fallback to demo data
        setJobs(demoJobs);
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
      setJobs(demoJobs); // Graceful fallback
    } finally {
      setIsLoading(false);
    }
  }
  
  loadJobs();
}, [currentUser]);
```

**Verification:**
- [ ] Real jobs display in swiper
- [ ] Match scores show correctly
- [ ] Swipe actions work
- [ ] Liked jobs save to database
- [ ] Loading states work
- [ ] Fallback to demo if API fails

---

## Step 2.4: Testing & Optimization (Day 5 - 4 hours)

**What to do:**
1. Test job generation with different profiles
2. Verify AI matching accuracy
3. Optimize API response time
4. Add caching for performance
5. Document the flow

**Deliverable:**
- ✅ Real AI-matched jobs working
- ✅ Performance optimized
- ✅ Documentation complete

---

# PHASE 3: Code Refactoring (Week 3)

**Goal:** Improve code organization and maintainability  
**Priority:** 🟡 MEDIUM  
**Time:** 5-7 days

---

## Step 3.1: LoginPage Refactoring (Day 1-2 - 6 hours)

**Current:** 636 lines in one file  
**Target:** ~100 lines main + 5 smaller components

**What to do:**

1. Create folder: `src/components/auth/`
2. Extract components:
   - `EmailLoginForm.tsx` (120 lines)
   - `SocialLoginButtons.tsx` (80 lines)
   - `SignupForm.tsx` (150 lines)
   - `ForgotPasswordForm.tsx` (80 lines)
   - `AuthLayout.tsx` (60 lines)
3. Refactor `LoginPage.tsx` to use new components
4. Test all auth flows

**Verification:**
- [ ] All auth flows work
- [ ] No broken functionality
- [ ] Code is cleaner
- [ ] Build successful

---

## Step 3.2: SettingsPage Refactoring (Day 3 - 6 hours)

**Current:** 452 lines  
**Target:** ~100 lines main + 4 tab components

**What to do:**

1. Create folder: `src/components/settings/`
2. Extract tabs:
   - `ProfileSettings.tsx`
   - `NotificationSettings.tsx`
   - `SecuritySettings.tsx`
   - `PreferencesSettings.tsx`
3. Refactor main `SettingsPage.tsx`
4. Test all settings

---

## Step 3.3: Onboarding Refactoring (Day 4 - 6 hours)

**Current:** 457 lines  
**Target:** ~120 lines main + 5 step components

**What to do:**

1. Create folder: `src/components/onboarding/steps/`
2. Extract steps:
   - `PersonalInfoStep.tsx`
   - `CareerGoalsStep.tsx`
   - `SkillsStep.tsx`
   - `PreferencesStep.tsx`
   - `ReviewStep.tsx`
3. Create `OnboardingProgress.tsx` component
4. Refactor main `Onboarding.tsx`

---

## Step 3.4: Landing Page Refactoring (Day 5 - 6 hours)

**Current:** 542 lines  
**Target:** ~80 lines main + 6 section components

**What to do:**

1. Create folder: `src/components/landing/`
2. Extract sections:
   - `HeroSection.tsx`
   - `FeaturesSection.tsx`
   - `HowItWorksSection.tsx`
   - `PricingSection.tsx`
   - `FAQSection.tsx`
   - `CTASection.tsx`
3. Refactor main landing page

**Deliverable:**
- ✅ All major components refactored
- ✅ Code is maintainable
- ✅ Performance improved

---

# PHASE 4: Gmail & Calendar Integration (Week 4)

**Goal:** Make Gmail/Calendar features actually work  
**Priority:** 🟡 MEDIUM  
**Time:** 5-7 days

---

## Step 4.1: Google Cloud Setup (Day 1 - 2 hours)

**What to do:**

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project: "AI Career Agent"
3. Enable APIs:
   - Gmail API
   - Google Calendar API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3001/api/google/callback`
5. Download credentials JSON
6. Add to `.env`:
```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3001/api/google/callback
```

**Verification:**
- [ ] APIs enabled
- [ ] OAuth credentials created
- [ ] Credentials saved securely

---

## Step 4.2: Gmail Integration (Day 2-3 - 8 hours)

**What to do:**

1. **Install dependencies:**
```bash
cd backend
npm install googleapis
```

2. **Create Gmail Service** (`backend/services/gmailService.js`):
```javascript
const { google } = require('googleapis');

async function scanForInterviews(accessToken) {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  
  const response = await gmail.users.messages.list({
    userId: 'me',
    q: 'interview OR "interview invitation" OR "schedule interview"',
    maxResults: 50
  });
  
  const messages = response.data.messages || [];
  const interviews = [];
  
  for (const message of messages) {
    const details = await gmail.users.messages.get({
      userId: 'me',
      id: message.id
    });
    
    // Use AI to extract interview details
    const interviewData = await extractInterviewDetails(details);
    if (interviewData) {
      interviews.push(interviewData);
    }
  }
  
  return interviews;
}
```

3. **Create AI Email Parser:**
```javascript
async function extractInterviewDetails(emailContent) {
  // Use AWS Bedrock to parse email and extract:
  // - Company name
  // - Position
  // - Date/time
  // - Location/link
  // - Interviewer name
}
```

**Verification:**
- [ ] Gmail API connects
- [ ] Emails fetched successfully
- [ ] AI extracts interview details
- [ ] Data saved to database

---

## Step 4.3: Calendar Integration (Day 4 - 6 hours)

**What to do:**

1. **Create Calendar Service** (`backend/services/calendarService.js`):
```javascript
async function createInterviewEvent(accessToken, interviewData) {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  
  const event = {
    summary: `Interview: ${interviewData.position} at ${interviewData.company}`,
    description: interviewData.description,
    start: {
      dateTime: interviewData.startTime,
      timeZone: 'America/Los_Angeles'
    },
    end: {
      dateTime: interviewData.endTime,
      timeZone: 'America/Los_Angeles'
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 30 }
      ]
    }
  };
  
  const response = await calendar.events.insert({
    calendarId: 'primary',
    resource: event
  });
  
  return response.data;
}
```

**Verification:**
- [ ] Calendar events created
- [ ] Reminders set correctly
- [ ] Events show in Google Calendar
- [ ] Conflicts detected

---

## Step 4.4: Frontend Integration (Day 5 - 4 hours)

**What to do:**

1. Update `GmailIntegration.tsx` to use real API
2. Update `SchedulingDashboard.tsx` to show real data
3. Add OAuth flow for user authorization
4. Test end-to-end flow

**Deliverable:**
- ✅ Gmail scanning works
- ✅ Calendar events auto-created
- ✅ AI detects interviews accurately

---

# PHASE 5: Production Deployment (Week 5-6)

**Goal:** Deploy to production  
**Priority:** 🟢 MEDIUM  
**Time:** 7-10 days

---

## Step 5.1: Production Environment Setup (Day 1-2)

**What to do:**
1. Set up production AWS account
2. Create production DynamoDB tables
3. Configure production Cognito
4. Set up CloudWatch logging
5. Configure production environment variables

---

## Step 5.2: Backend Deployment (Day 3-4)

**Options:**

### **Option A: AWS Lambda (Recommended)**
- Serverless
- Auto-scaling
- Pay per use
- ~$5-20/month

### **Option B: AWS EC2**
- Full control
- More expensive
- ~$30-50/month

### **Option C: Heroku**
- Easiest
- Quick setup
- ~$7-25/month

**What to do:**
1. Choose deployment option
2. Deploy backend
3. Test all endpoints
4. Set up monitoring

---

## Step 5.3: Frontend Deployment (Day 5)

**Recommended: Vercel**

**What to do:**
1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel`
3. Configure environment variables in Vercel dashboard
4. Deploy: `vercel --prod`
5. Get production URL

**Alternative: Netlify, AWS S3 + CloudFront**

---

## Step 5.4: Domain & SSL (Day 6)

**What to do:**
1. Buy domain (e.g., careercopilot.com) - $13/year
2. Configure DNS in Route 53
3. Set up SSL certificate (free with ACM)
4. Point domain to deployment
5. Test HTTPS

---

## Step 5.5: Testing & Monitoring (Day 7-10)

**What to do:**
1. End-to-end testing in production
2. Performance testing
3. Security audit
4. Set up error monitoring (Sentry)
5. Set up analytics (Google Analytics)
6. Load testing
7. Bug fixes

**Deliverable:**
- ✅ Application live in production
- ✅ Custom domain with HTTPS
- ✅ Monitoring in place
- ✅ All features working

---

# 📋 **Quick Reference Checklist**

## **Week 1: Backend Foundation**
- [ ] DynamoDB tables created
- [ ] Environment variables configured
- [ ] User Profile API working
- [ ] Frontend connected to backend
- [ ] Data persisting correctly

## **Week 2: AI Job Generation**
- [ ] Job API integrated
- [ ] AI matching working
- [ ] JobSwiper using real data
- [ ] Performance optimized

## **Week 3: Code Refactoring**
- [ ] LoginPage refactored
- [ ] SettingsPage refactored
- [ ] Onboarding refactored
- [ ] Landing page refactored

## **Week 4: Gmail & Calendar**
- [ ] Google Cloud configured
- [ ] Gmail integration working
- [ ] Calendar integration working
- [ ] AI email parsing accurate

## **Week 5-6: Production**
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Domain configured
- [ ] SSL enabled
- [ ] Monitoring active
- [ ] Application live! 🚀

---

# 💡 **Tips for Success**

1. **Work incrementally** - Complete one step before moving to next
2. **Test frequently** - Don't wait until the end
3. **Document as you go** - Future you will thank you
4. **Use version control** - Commit after each step
5. **Ask for help** - Don't get stuck for hours
6. **Take breaks** - Avoid burnout
7. **Celebrate wins** - Each step is progress!

---

# 🚨 **Common Pitfalls to Avoid**

1. ❌ Skipping testing
2. ❌ Not handling errors
3. ❌ Hardcoding credentials
4. ❌ Ignoring security
5. ❌ Not backing up data
6. ❌ Deploying without testing
7. ❌ Forgetting to document

---

# 📞 **Resources**

- **AWS Documentation:** https://docs.aws.amazon.com
- **Google APIs:** https://developers.google.com
- **React Docs:** https://react.dev
- **TypeScript Docs:** https://www.typescriptlang.org

---

**Ready to start? Pick Phase 1, Step 1.1 and let's go!** 🚀

**Last Updated:** December 15, 2024  
**Status:** Ready for execution

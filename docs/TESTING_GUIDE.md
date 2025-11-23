# 🧪 Complete Testing Guide - AI Career Agent

## ✅ Servers Running

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3001
- **Status:** Both running and ready!

---

## 🎯 COMPLETE TESTING FLOW

### Step 1: Open the App (1 min)

1. **Open your browser**
2. **Go to:** http://localhost:5173
3. **You should see:** Landing page with "AI Career Agent"

---

### Step 2: Sign Up (2 min)

1. **Click "Get Started"**
2. **Fill in signup form:**
   - Email: your-email@example.com
   - Password: Test123!@# (must be strong)
   - Check "I agree to Terms & Conditions"
3. **Click "Sign Up"**
4. **Check your email** for verification code
5. **Enter verification code**
6. **You should see:** Success message

---

### Step 3: Complete Onboarding (3 min)

**Page 1: Basic Info**

- Name: Your Name
- Email: (pre-filled)
- Click "Next"

**Page 2: Career Stage**

- Select: "Student" or "Professional"
- Click "Next"

**If Student:**

- Major: Computer Science
- Current Semester: 3
- Graduation Date: 2025-05-15
- Click "Next"

**Page 3: Career Goals**

- Current Role: Student / Junior Developer
- Target Role: Software Engineer
- Skills: JavaScript, React, Python
- Experience: Entry level / 1-2 years
- Click "Next"

**Page 4: Preferences**

- Locations: San Francisco, CA
- Salary Min: 100000
- Salary Max: 150000
- Click "Complete Profile"

**You should see:** Dashboard with your profile loaded!

---

### Step 4: Test Student Dashboard (2 min)

**If you selected "Student":**

1. **Check Student Banner:**

   - See graduation countdown
   - See days remaining
   - See progress bar

2. **Check Daily Question:**

   - See coding question
   - Click "Show Hint"
   - Click "Show Solution"
   - Try to solve it

3. **Check Study Materials:**
   - See resources for your major
   - Click to expand categories
   - Check links work

---

### Step 5: Test AI Job Generation (3 min)

1. **Click "Job Swiper" in sidebar**
2. **Wait for AI to generate jobs** (5-10 seconds)
3. **You should see:**

   - Loading: "Generating Personalized Jobs..."
   - Success: "🤖 Generated 15 personalized jobs with AI!"
   - Job cards with:
     - Company name
     - Position title
     - Salary range
     - Match score
     - Skills/tags

4. **Test Swiping:**
   - Swipe right (or click ❤️) to like
   - Swipe left (or click ✕) to pass
   - Click "Undo" to undo last action

---

### Step 6: Test Job Search (2 min)

1. **Click "Job Search" in sidebar**
2. **Wait for AI jobs to load**
3. **You should see:**

   - List of AI-generated jobs
   - Match scores
   - Filter options
   - Search bar

4. **Test Features:**
   - Search for specific role
   - Filter by source
   - Click on a job to see details

---

### Step 7: Test Application Tracker (2 min)

1. **Click "Applications" in sidebar**
2. **Wait for AI to generate applications**
3. **You should see:**

   - AI-generated applications
   - Different statuses (applied, screening, interview, offer)
   - Drag-and-drop columns

4. **Test Features:**
   - Drag application to different status
   - Click "Add Application"
   - View application details

---

### Step 8: Test Resume Optimizer (2 min)

1. **Click "Resume Optimizer" in sidebar**
2. **Paste sample resume text** or upload file
3. **Click "Analyze Resume"**
4. **Wait for AI analysis** (5-10 seconds)
5. **You should see:**
   - Overall score
   - Strengths
   - Improvements
   - Keyword suggestions
   - ATS compatibility score

---

### Step 9: Test Cover Letter Generator (2 min)

1. **Click "Cover Letter" in sidebar**
2. **Fill in:**
   - Company: Google
   - Position: Software Engineer
   - Job Description: (paste sample)
3. **Click "Generate Cover Letter"**
4. **Wait for AI** (5-10 seconds)
5. **You should see:**
   - AI-generated cover letter
   - Personalized to your profile
   - Professional format

---

### Step 10: Test Mock Interview (2 min)

1. **Click "Mock Interview" in sidebar**
2. **Select:**
   - Position: Software Engineer
   - Difficulty: Medium
3. **Click "Start Interview"**
4. **You should see:**
   - AI-generated interview questions
   - Answer input
   - Feedback on answers
   - Tips and suggestions

---

### Step 11: Test Offer Comparison (2 min)

1. **Click "Offers" in sidebar**
2. **Wait for AI to generate offers**
3. **You should see:**

   - 2-3 AI-generated job offers
   - Salary breakdown
   - Benefits comparison
   - Work-life balance scores
   - Recommendation

4. **Test Features:**
   - Adjust importance weights
   - Add custom offer
   - Compare side-by-side

---

### Step 12: Test Profile Persistence (1 min)

1. **Refresh the page** (F5)
2. **You should see:**

   - Still logged in
   - Profile data loaded
   - Dashboard shows your info
   - No need to re-enter data

3. **Close browser completely**
4. **Open browser again**
5. **Go to:** http://localhost:5173
6. **You should see:**
   - Still logged in
   - Profile persisted
   - All data intact

---

### Step 13: Test QR Code System (2 min)

1. **Click "Settings" in sidebar**
2. **Scroll to QR Code section**
3. **You should see:**

   - Profile QR code
   - Referral QR code
   - Custom QR options

4. **Test Features:**
   - Generate QR code
   - Download QR code
   - Scan with phone (optional)

---

## 🎯 WHAT TO CHECK

### ✅ Everything Should Work:

1. **Authentication:**

   - ✅ Sign up works
   - ✅ Email verification works
   - ✅ Login works
   - ✅ Session persists

2. **Profile:**

   - ✅ Onboarding saves data
   - ✅ Profile loads on refresh
   - ✅ Data persists in DynamoDB

3. **AI Features:**

   - ✅ Jobs generated with AI
   - ✅ Applications generated with AI
   - ✅ Offers generated with AI
   - ✅ Resume analysis works
   - ✅ Cover letters generated
   - ✅ Interview questions generated

4. **Student Features:**

   - ✅ Graduation countdown
   - ✅ Daily coding questions
   - ✅ Study materials
   - ✅ Progress tracking

5. **UI/UX:**
   - ✅ Navigation works
   - ✅ Loading states show
   - ✅ Success messages appear
   - ✅ Error handling works
   - ✅ Responsive design

---

## 🐛 IF SOMETHING DOESN'T WORK

### Issue: AI Generation Fails

**Check:**

1. Backend server running? (http://localhost:3001)
2. AWS credentials set in `.env`?
3. Check backend console for errors

**Fix:**

```bash
# Restart backend
cd server
npm start
```

### Issue: Profile Not Saving

**Check:**

1. DynamoDB tables exist?
2. AWS permissions correct?
3. Check browser console for errors

**Fix:**

```bash
# Check DynamoDB
aws dynamodb list-tables --region us-east-1
```

### Issue: Login Fails

**Check:**

1. Email verified?
2. Password meets requirements?
3. Cognito configured?

**Fix:**

- Check email for verification code
- Try password reset

---

## 📊 EXPECTED RESULTS

### After Complete Testing:

✅ **Sign Up:** Account created, email verified  
✅ **Onboarding:** Profile saved to DynamoDB  
✅ **Dashboard:** Shows personalized data  
✅ **Job Swiper:** 15 AI-generated jobs  
✅ **Applications:** 5 AI-generated applications  
✅ **Offers:** 3 AI-generated offers  
✅ **Resume:** AI analysis with score  
✅ **Cover Letter:** AI-generated letter  
✅ **Interview:** AI-generated questions  
✅ **Persistence:** Data survives refresh  
✅ **Student:** All features working

---

## 🎉 SUCCESS CRITERIA

**Your app is working if:**

1. ✅ You can sign up and login
2. ✅ Profile saves and loads
3. ✅ AI generates personalized jobs
4. ✅ All features are accessible
5. ✅ Data persists across sessions
6. ✅ No critical errors in console
7. ✅ UI is responsive and smooth

---

## 🚀 NEXT STEPS AFTER TESTING

### If Everything Works:

1. **Fix S3 Security** (2 min)
2. **Deploy to Production** (30 min)
3. **Share with users!** 🎉

### If Issues Found:

1. **Note the issue**
2. **Check console errors**
3. **Let me know** - I'll help fix it!

---

## 💡 QUICK TIPS

- **Use Chrome DevTools** (F12) to see console logs
- **Check Network tab** to see API calls
- **Take screenshots** of any errors
- **Test on different browsers** (Chrome, Firefox, Safari)
- **Test on mobile** (responsive design)

---

## 🎯 START TESTING NOW!

**Open:** http://localhost:5173

**Follow the steps above and enjoy your AI-powered career platform!** 🚀

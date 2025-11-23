# 📅 Google Calendar Setup Checklist

**Goal:** Enable calendar integration for interview scheduling and deadline tracking

---

## ✅ Step 1: Create Google Cloud Project (5 minutes)

1. **Go to:** https://console.cloud.google.com
2. **Click:** "Select a project" → "New Project"
3. **Project name:** `Career Copilot`
4. **Click:** Create
5. **Wait:** ~30 seconds

**Status:** [ ] Complete

---

## ✅ Step 2: Enable Google Calendar API (2 minutes)

1. **In your project:** APIs & Services → Library
2. **Search:** "Google Calendar API"
3. **Click:** Enable
4. **Wait:** ~10 seconds

**Status:** [ ] Complete

---

## ✅ Step 3: Configure OAuth Consent Screen (5 minutes)

1. **Go to:** APIs & Services → Credentials
2. **Click:** "Configure Consent Screen"
3. **User Type:** External
4. **Fill out:**
   - App name: `Career Copilot`
   - User support email: `rajkumarthota20197@gmail.com`
   - Developer contact: `rajkumarthota20197@gmail.com`
5. **Scopes:** Add these scopes:
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/calendar.events`
6. **Test users:** Add `rajkumarthota20197@gmail.com`
7. **Save and Continue**

**Status:** [ ] Complete

---

## ✅ Step 4: Create OAuth Client ID (3 minutes)

1. **Go to:** APIs & Services → Credentials
2. **Click:** Create Credentials → OAuth client ID
3. **Application type:** Web application
4. **Name:** `Career Copilot Web`
5. **Authorized JavaScript origins:**
   ```
   http://localhost:3000
   http://localhost:5000
   ```
6. **Authorized redirect URIs:**
   ```
   http://localhost:5000/api/google/callback
   ```
7. **Click:** Create
8. **COPY:** Client ID and Client Secret

**Your credentials will look like:**

- Client ID: `123456789-abcdefg.apps.googleusercontent.com`
- Client Secret: `GOCSPX-abcdefghijklmnop`

**Status:** [ ] Complete

---

## ✅ Step 5: Add Credentials to .env (1 minute)

**I'll help you add these to backend/.env once you have them!**

**Status:** [ ] Complete

---

## ✅ Step 6: Test Calendar Integration (2 minutes)

**I'll help you test once credentials are added!**

**Status:** [ ] Complete

---

## 🎯 **What You'll Get:**

- **Schedule interviews** directly from job applications
- **Set application deadlines** with reminders
- **Track networking events** and follow-ups
- **Interview prep sessions** with automatic scheduling
- **Calendar sync** with Gmail notifications

---

## 📞 **Need Help?**

Just let me know when you complete each step and I'll help you with the next one!

**Current Step:** Go to https://console.cloud.google.com and create the project

---

**Time Required:** ~15 minutes total
**Cost:** FREE (1M API calls/day)
**Difficulty:** Easy (just clicking through Google's interface)

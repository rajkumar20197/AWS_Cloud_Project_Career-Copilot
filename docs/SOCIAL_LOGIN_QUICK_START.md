# 🚀 Social Login Quick Start (5 Minutes)

## ✅ Code is Ready!

Your code is already updated and ready to use social login. Now you just need to configure AWS Cognito and the OAuth providers.

---

## 📋 Quick Setup Checklist

### Step 1: GitHub OAuth (5 minutes)

1. **Go to:** https://github.com/settings/developers
2. **Click:** "OAuth Apps" → "New OAuth App"
3. **Fill in:**
   ```
   Application name: AI Career Agent
   Homepage URL: http://localhost:5173
   Callback URL: https://ai-career-agent.auth.us-east-1.amazoncognito.com/oauth2/idpresponse
   ```
4. **Click:** "Register application"
5. **Save:** Client ID and generate Client Secret

### Step 2: Google OAuth (5 minutes)

1. **Go to:** https://console.cloud.google.com/
2. **Create project:** "AI Career Agent"
3. **Enable API:** Search "Google+ API" and enable it
4. **Create credentials:**
   - APIs & Services → Credentials
   - Create OAuth client ID
   - Web application
   - Authorized redirect URI: `https://ai-career-agent.auth.us-east-1.amazoncognito.com/oauth2/idpresponse`
5. **Save:** Client ID and Client Secret

### Step 3: Configure AWS Cognito (10 minutes)

1. **Go to:** https://console.aws.amazon.com/cognito/
2. **Select:** User Pool `us-east-1_RbxnBYOCS`
3. **Add GitHub:**

   - Sign-in experience → Federated identity providers
   - Add identity provider → GitHub
   - Enter Client ID and Secret
   - Authorize scope: `user:email`
   - Save

4. **Add Google:**

   - Add identity provider → Google
   - Enter Client ID and Secret
   - Authorize scope: `profile email openid`
   - Save

5. **Update App Client:**
   - App integration → App client `5a6kq9althf2te07sv157a26so`
   - Edit → Hosted UI
   - Allowed callback URLs: `http://localhost:5173/`, `http://localhost:5173/dashboard`
   - Allowed sign-out URLs: `http://localhost:5173/`
   - Identity providers: ✅ Cognito, ✅ GitHub, ✅ Google
   - OAuth grant types: ✅ Authorization code, ✅ Implicit
   - OpenID scopes: ✅ openid, ✅ email, ✅ profile
   - Save

---

## 🧪 Test It!

1. **Start your app:**

   ```bash
   npm run dev
   ```

2. **Go to:** http://localhost:5173

3. **Click:** "GitHub" or "Google" button

4. **Authorize** the app

5. **You should be logged in!** ✅

---

## 🐛 Troubleshooting

**"Redirect URI mismatch"**

- Make sure callback URL is exactly: `https://ai-career-agent.auth.us-east-1.amazoncognito.com/oauth2/idpresponse`
- No trailing slash!

**"Invalid client"**

- Double-check Client ID and Secret (no extra spaces)

**Buttons don't work**

- Check browser console for errors
- Make sure you saved all changes in Cognito

---

## 📝 What Changed in Your Code

### ✅ Updated Files:

1. **`src/config/cognito.ts`**

   - Added OAuth configuration
   - Added redirect URLs
   - Added scopes

2. **`src/services/authService.ts`**

   - Added `signInWithGitHub()` method
   - Added `signInWithGoogle()` method

3. **`src/components/LoginPage.tsx`**
   - Enabled GitHub button
   - Enabled Google button
   - Added click handlers

### ✅ Created Files:

1. **`SOCIAL_LOGIN_SETUP.md`** - Complete detailed guide
2. **`SOCIAL_LOGIN_QUICK_START.md`** - This quick reference

---

## 🎯 Benefits

**For Users:**

- ✅ No password to remember
- ✅ Faster signup (1 click)
- ✅ Trusted authentication
- ✅ Auto-filled profile info

**For You:**

- ✅ Higher conversion rates (30-50% increase)
- ✅ Verified emails
- ✅ Less support tickets
- ✅ Better UX

---

## 💰 Cost

**Total: $0** (All free!)

- AWS Cognito: Free (first 50,000 users)
- GitHub OAuth: Free
- Google OAuth: Free

---

## 🚀 Production Deployment

When deploying to production:

1. **Update redirect URLs** in:

   - GitHub OAuth app
   - Google OAuth credentials
   - AWS Cognito app client

2. **Use your production domain:**

   ```
   https://your-domain.com/
   https://your-domain.com/dashboard
   ```

3. **Update `src/config/cognito.ts`:**
   - Replace `your-domain.com` with actual domain

---

## 📚 Full Documentation

For detailed step-by-step instructions, see: **`SOCIAL_LOGIN_SETUP.md`**

---

**Ready to go!** Follow the 3 steps above and you'll have social login working in 20 minutes! 🎉

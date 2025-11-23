# 🔄 How to Start Fresh / Clear Data

## Option 1: Clear Browser Data (Quick)

### In Chrome/Edge:

1. Press **F12** to open DevTools
2. Go to **Application** tab
3. Click **Storage** in left sidebar
4. Click **Clear site data** button
5. Refresh page (F5)

### Or use Console:

1. Press **F12**
2. Go to **Console** tab
3. Type: `localStorage.clear()`
4. Press Enter
5. Type: `location.reload()`
6. Press Enter

---

## Option 2: Sign Out (Proper Way)

1. Click your profile icon (top right)
2. Click **"Sign Out"** or **"Logout"**
3. You'll be redirected to landing page
4. Click **"Get Started"** to sign up as new user

---

## Option 3: Use Incognito/Private Window

1. Open **Incognito/Private** window
2. Go to: http://localhost:3000
3. Sign up as completely new user
4. Test fresh experience

---

## Option 4: Delete from Database

If you want to completely remove the user from DynamoDB:

```bash
# Delete user profile
aws dynamodb delete-item \
  --table-name ai-career-users \
  --key '{"userId": {"S": "user-1763438498496-cgp8j1jfw"}}' \
  --region us-east-1
```

---

## Why You See "Alex"?

**This is GOOD!** It means:

- ✅ Profile persistence is working
- ✅ Data saved to DynamoDB
- ✅ App remembers you across sessions
- ✅ localStorage working correctly

**The app is doing exactly what it should!**

---

## To Test as New User:

**Easiest:** Use Incognito window

1. Open Incognito (Ctrl+Shift+N)
2. Go to http://localhost:3000
3. Sign up with different email
4. Complete onboarding with your info
5. Test all features

---

## Current User Info:

**Name:** Alex Johnson  
**User ID:** user-1763438498496-cgp8j1jfw  
**Status:** Profile saved and persisting correctly

**Want to keep Alex?** Continue testing with this profile  
**Want fresh start?** Use one of the options above

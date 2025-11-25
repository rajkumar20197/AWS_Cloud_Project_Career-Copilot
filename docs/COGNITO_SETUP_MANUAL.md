# 🔧 Manual Cognito Setup - Fix Authentication

## Step 1: Create New User Pool

1. **Go to:** https://console.aws.amazon.com/cognito
2. **Click:** "Create user pool"
3. **Configure sign-in experience:**

   - ✅ Email
   - ✅ Username (optional)
   - Click "Next"

4. **Configure security requirements:**

   - Password policy: Default (8 chars, mixed case, numbers, symbols)
   - Multi-factor authentication: No MFA (for testing)
   - Click "Next"

5. **Configure sign-up experience:**

   - ✅ Enable self-registration
   - ✅ Email verification required
   - Required attributes:
     - ✅ Email
     - ✅ Name
   - Click "Next"

6. **Configure message delivery:**

   - Email provider: Send email with Cognito
   - FROM email address: no-reply@verificationemail.com
   - Click "Next"

7. **Integrate your app:**

   - User pool name: `career-copilot-users`
   - App client name: `career-copilot-web`
   - ✅ Generate a client secret: **NO** (uncheck this!)
   - Click "Next"

8. **Review and create:**
   - Review settings
   - Click "Create user pool"

## Step 2: Get New Credentials

After creation, you'll see:

- **User pool ID:** (copy this - looks like us-east-1_XXXXXXXXX)
- **App client ID:** (copy this - looks like 26-character string)

## Step 3: Update Configuration

Replace in `src/config/cognito.ts`:

```typescript
userPoolId: 'YOUR_NEW_USER_POOL_ID',
userPoolClientId: 'YOUR_NEW_APP_CLIENT_ID',
```

## Step 4: Test

1. Save the file
2. Refresh your browser
3. Try signing up again

---

## Alternative: Check Existing User Pool

If you want to check the existing one:

1. Go to Cognito console
2. Click "User pools"
3. Look for `us-east-1_RbxnBYOCS`
4. If it exists:
   - Click on it
   - Go to "App integration" tab
   - Check if app client `5a6kq9althf2te07sv157a26so` exists
   - Make sure "Generate client secret" is OFF

## Common Issues:

❌ **Client secret enabled** (must be disabled for web apps)
❌ **User pool deleted** (need to create new one)
❌ **App client deleted** (need to create new one)
❌ **Wrong region** (must be us-east-1)

---

**After you complete this, the authentication will work properly!**

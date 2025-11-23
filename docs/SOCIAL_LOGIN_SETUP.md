# Social Login Setup Guide (GitHub & Google)

## 📋 Overview

This guide walks you through setting up GitHub and Google OAuth login for your AI Career Agent platform using AWS Cognito.

---

## 🔧 Step 1: Configure AWS Cognito for Social Providers

### 1.1 Access AWS Cognito Console

1. Go to [AWS Cognito Console](https://console.aws.amazon.com/cognito/)
2. Select your User Pool: `us-east-1_RbxnBYOCS`
3. Go to **Sign-in experience** tab

### 1.2 Add Federated Identity Providers

1. Scroll to **Federated identity provider sign-in**
2. Click **Add identity provider**

---

## 🐙 Step 2: Set Up GitHub OAuth

### 2.1 Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **OAuth Apps** → **New OAuth App**
3. Fill in the details:
   ```
   Application name: AI Career Agent
   Homepage URL: https://your-domain.com (or http://localhost:5173 for dev)
   Authorization callback URL: https://ai-career-agent.auth.us-east-1.amazoncognito.com/oauth2/idpresponse
   ```
4. Click **Register application**
5. **Save these credentials:**
   - Client ID: `xxxxxxxxxxxxxxxxxxxxx`
   - Client Secret: Click **Generate a new client secret** and save it

### 2.2 Configure GitHub in Cognito

1. In Cognito User Pool, go to **Sign-in experience** → **Federated identity providers**
2. Click **Add identity provider** → Select **GitHub**
3. Enter:
   ```
   Provider name: GitHub
   Client ID: [Your GitHub Client ID]
   Client secret: [Your GitHub Client Secret]
   Authorize scope: user:email
   ```
4. Click **Add identity provider**

### 2.3 Map GitHub Attributes

1. Go to **Attribute mapping** tab
2. Map GitHub attributes to Cognito:
   ```
   GitHub attribute → Cognito attribute
   email           → email
   name            → name
   ```

---

## 🔵 Step 3: Set Up Google OAuth

### 3.1 Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing: **AI Career Agent**
3. Enable **Google+ API**:

   - Go to **APIs & Services** → **Library**
   - Search for "Google+ API"
   - Click **Enable**

4. Create OAuth credentials:

   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth client ID**
   - Application type: **Web application**
   - Name: **AI Career Agent**
   - Authorized JavaScript origins:
     ```
     http://localhost:5173
     https://your-domain.com
     ```
   - Authorized redirect URIs:
     ```
     https://ai-career-agent.auth.us-east-1.amazoncognito.com/oauth2/idpresponse
     ```
   - Click **Create**

5. **Save these credentials:**
   - Client ID: `xxxxxxxxxxxxx.apps.googleusercontent.com`
   - Client Secret: `xxxxxxxxxxxxxxxxxxxxx`

### 3.2 Configure Google in Cognito

1. In Cognito User Pool, go to **Sign-in experience** → **Federated identity providers**
2. Click **Add identity provider** → Select **Google**
3. Enter:
   ```
   Provider name: Google
   Client ID: [Your Google Client ID]
   Client secret: [Your Google Client Secret]
   Authorize scope: profile email openid
   ```
4. Click **Add identity provider**

### 3.3 Map Google Attributes

1. Go to **Attribute mapping** tab
2. Map Google attributes to Cognito:
   ```
   Google attribute → Cognito attribute
   email           → email
   name            → name
   picture         → picture (optional)
   ```

---

## 🔗 Step 4: Configure App Client

### 4.1 Update App Client Settings

1. Go to **App integration** tab
2. Select your app client: `5a6kq9althf2te07sv157a26so`
3. Click **Edit**

### 4.2 Configure Hosted UI

1. **Allowed callback URLs:**

   ```
   http://localhost:5173/
   http://localhost:5173/dashboard
   https://your-domain.com/
   https://your-domain.com/dashboard
   ```

2. **Allowed sign-out URLs:**

   ```
   http://localhost:5173/
   https://your-domain.com/
   ```

3. **Identity providers:**

   - ✅ Cognito user pool
   - ✅ GitHub
   - ✅ Google

4. **OAuth 2.0 grant types:**

   - ✅ Authorization code grant
   - ✅ Implicit grant

5. **OpenID Connect scopes:**

   - ✅ openid
   - ✅ email
   - ✅ profile

6. Click **Save changes**

---

## 💻 Step 5: Update Code

### 5.1 Update Cognito Configuration

Update `src/config/cognito.ts`:

```typescript
import { Amplify } from "aws-amplify";

export const cognitoConfig = {
  Auth: {
    Cognito: {
      userPoolId: "us-east-1_RbxnBYOCS",
      userPoolClientId: "5a6kq9althf2te07sv157a26so",
      region: "us-east-1",
      loginWith: {
        email: true,
        oauth: {
          domain: "ai-career-agent.auth.us-east-1.amazoncognito.com",
          scopes: ["openid", "email", "profile"],
          redirectSignIn: [
            "http://localhost:5173/",
            "https://your-domain.com/",
          ],
          redirectSignOut: [
            "http://localhost:5173/",
            "https://your-domain.com/",
          ],
          responseType: "code",
        },
      },
      signUpVerificationMethod: "code" as const,
      userAttributes: {
        email: {
          required: true,
        },
        name: {
          required: true,
        },
      },
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: true,
      },
    },
  },
};

Amplify.configure(cognitoConfig);

export default cognitoConfig;
```

### 5.2 Update Auth Service

Update `src/services/authService.ts` to add social login methods:

```typescript
import { signInWithRedirect } from "aws-amplify/auth";

export class AuthService {
  // ... existing methods ...

  static async signInWithGitHub() {
    try {
      await signInWithRedirect({ provider: "GitHub" });
    } catch (error) {
      console.error("GitHub sign in error:", error);
      throw error;
    }
  }

  static async signInWithGoogle() {
    try {
      await signInWithRedirect({ provider: "Google" });
    } catch (error) {
      console.error("Google sign in error:", error);
      throw error;
    }
  }
}
```

### 5.3 Update LoginPage Component

The buttons are already in your LoginPage.tsx, just need to enable them and add handlers.

---

## 🧪 Step 6: Testing

### 6.1 Test GitHub Login

1. Click "GitHub" button
2. Should redirect to GitHub authorization
3. Authorize the app
4. Should redirect back to your app
5. User should be logged in

### 6.2 Test Google Login

1. Click "Google" button
2. Should redirect to Google sign-in
3. Select Google account
4. Should redirect back to your app
5. User should be logged in

### 6.3 Verify User Data

Check that user attributes are properly mapped:

- Email
- Name
- Profile picture (if configured)

---

## 🔒 Security Considerations

### Best Practices

1. **HTTPS Only in Production:**

   - Never use HTTP for OAuth callbacks in production
   - Always use HTTPS

2. **Validate Redirect URIs:**

   - Only whitelist your actual domains
   - Don't use wildcards

3. **Secure Client Secrets:**

   - Never commit secrets to Git
   - Use environment variables
   - Rotate secrets regularly

4. **Scope Minimization:**

   - Only request necessary scopes
   - GitHub: `user:email` (not full `user` scope)
   - Google: `profile email openid` (not additional APIs)

5. **State Parameter:**
   - Cognito handles this automatically
   - Prevents CSRF attacks

---

## 🐛 Troubleshooting

### Common Issues

**1. "Redirect URI mismatch"**

- Solution: Ensure callback URLs match exactly in both provider and Cognito
- Check for trailing slashes
- Verify HTTP vs HTTPS

**2. "Invalid client"**

- Solution: Double-check Client ID and Secret
- Ensure they're copied correctly (no extra spaces)

**3. "User pool client does not have OAuth configured"**

- Solution: Enable OAuth 2.0 grant types in app client settings
- Add identity providers to app client

**4. "Access denied"**

- Solution: User declined authorization
- Check required scopes aren't too broad

**5. Social login works but user attributes missing**

- Solution: Check attribute mapping in Cognito
- Ensure provider returns the attributes you're mapping

---

## 📊 User Flow Diagram

```
User clicks "Sign in with GitHub/Google"
           ↓
Redirect to Provider (GitHub/Google)
           ↓
User authorizes app
           ↓
Provider redirects to Cognito callback
           ↓
Cognito creates/updates user
           ↓
Cognito redirects to your app
           ↓
App detects authenticated user
           ↓
User is logged in!
```

---

## 🎯 Benefits of Social Login

**For Users:**

- ✅ Faster signup (no form filling)
- ✅ No password to remember
- ✅ Trusted authentication
- ✅ One-click login

**For You:**

- ✅ Higher conversion rates
- ✅ Verified email addresses
- ✅ Reduced support (password resets)
- ✅ Better user experience

---

## 📝 Checklist

### GitHub Setup

- [ ] Create GitHub OAuth App
- [ ] Save Client ID and Secret
- [ ] Configure callback URL
- [ ] Add GitHub provider in Cognito
- [ ] Map attributes
- [ ] Test login flow

### Google Setup

- [ ] Create Google Cloud project
- [ ] Enable Google+ API
- [ ] Create OAuth credentials
- [ ] Save Client ID and Secret
- [ ] Configure redirect URIs
- [ ] Add Google provider in Cognito
- [ ] Map attributes
- [ ] Test login flow

### Code Updates

- [ ] Update cognito.ts with OAuth config
- [ ] Update authService.ts with social methods
- [ ] Enable social buttons in LoginPage
- [ ] Test locally
- [ ] Update production URLs
- [ ] Deploy and test in production

---

## 🔗 Useful Links

**AWS Documentation:**

- [Cognito Social Identity Providers](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-social-idp.html)
- [Cognito OAuth 2.0](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-app-integration.html)

**Provider Documentation:**

- [GitHub OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)

**Amplify Documentation:**

- [Social Sign-in](https://docs.amplify.aws/react/build-a-backend/auth/add-social-provider/)

---

## 💰 Cost

**AWS Cognito:**

- First 50,000 MAU: Free
- Social identity providers: No additional cost

**GitHub OAuth:**

- Free for public repositories
- Free for OAuth apps

**Google OAuth:**

- Free (no quota limits for OAuth)

**Total Additional Cost: $0** 🎉

---

## 🚀 Next Steps

After implementing social login:

1. **Test thoroughly** with both providers
2. **Update Terms & Privacy Policy** to mention social login
3. **Add social login to onboarding** (optional)
4. **Monitor login analytics** to see which method users prefer
5. **Consider adding more providers** (Microsoft, Apple, etc.)

---

**Ready to implement?** Follow the steps above and you'll have social login working in about 30-45 minutes! 🎯

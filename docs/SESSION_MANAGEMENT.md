# Session & Cookie Management - AI Career Agent

**Last Updated:** November 16, 2024  
**Authentication Provider:** AWS Cognito + AWS Amplify

---

## 🔐 Overview

Your application uses **AWS Cognito** for authentication, which handles all session management, tokens, and cookies automatically through the **AWS Amplify** library. You don't need to manually manage sessions or cookies - Amplify does it all for you!

---

## 📋 How It Works

### 1. Authentication Flow

```
User Signs Up/In
      ↓
AWS Cognito validates credentials
      ↓
Cognito issues JWT tokens (ID, Access, Refresh)
      ↓
Amplify stores tokens in browser storage
      ↓
Amplify automatically includes tokens in requests
      ↓
Tokens auto-refresh when expired
```

### 2. Token Types

AWS Cognito issues **3 types of JWT tokens**:

#### **ID Token**

- Contains user identity information (userId, email, name)
- Used to identify who the user is
- Expires after 1 hour (default)
- Format: `eyJraWQiOiJ...` (JWT)

#### **Access Token**

- Used to authorize API requests
- Contains user permissions/scopes
- Expires after 1 hour (default)
- Format: `eyJraWQiOiJ...` (JWT)

#### **Refresh Token**

- Used to get new ID and Access tokens
- Expires after 30 days (default)
- Longer-lived than other tokens
- Format: `eyJjdHkiOiJ...` (JWT)

---

## 🍪 Cookie & Storage Management

### Where Tokens Are Stored

Amplify stores tokens in **browser storage** (not traditional cookies):

**Storage Location:**

```
Browser LocalStorage:
├── CognitoIdentityServiceProvider.{clientId}.{userId}.idToken
├── CognitoIdentityServiceProvider.{clientId}.{userId}.accessToken
├── CognitoIdentityServiceProvider.{clientId}.{userId}.refreshToken
├── CognitoIdentityServiceProvider.{clientId}.{userId}.clockDrift
└── CognitoIdentityServiceProvider.{clientId}.LastAuthUser
```

**Example:**

```javascript
// In browser console, you can see:
localStorage.getItem(
  "CognitoIdentityServiceProvider.5a6kq9althf2te07sv157a26so.user123.idToken"
);
// Returns: "eyJraWQiOiJ..."
```

### Why LocalStorage Instead of Cookies?

**Advantages:**

- ✅ Larger storage capacity (5-10MB vs 4KB for cookies)
- ✅ No automatic transmission with every request (better performance)
- ✅ Easier to manage with JavaScript
- ✅ Works well with SPAs (Single Page Applications)

**Security Considerations:**

- ⚠️ Vulnerable to XSS attacks (but so are cookies without httpOnly)
- ✅ Not vulnerable to CSRF attacks (unlike cookies)
- ✅ Tokens are JWT signed by AWS (can't be tampered with)

---

## 🔄 Session Lifecycle

### 1. User Signs In

```typescript
// In your code: src/services/authService.ts
static async signIn({ email, password }: SignInParams) {
  const { isSignedIn, nextStep } = await signIn({
    username: email,
    password,
  });
  // Amplify automatically stores tokens in localStorage
}
```

**What Happens:**

1. User enters email/password
2. Amplify sends credentials to Cognito
3. Cognito validates and returns tokens
4. Amplify stores tokens in localStorage
5. User is now authenticated

### 2. Checking Authentication Status

```typescript
// In your code: src/services/authService.ts
static async isAuthenticated(): Promise<boolean> {
  try {
    const { user } = await this.getCurrentUser();
    return !!user;
  } catch {
    return false;
  }
}
```

**What Happens:**

1. Amplify checks localStorage for valid tokens
2. If tokens exist and not expired → User is authenticated
3. If tokens expired but refresh token valid → Auto-refresh tokens
4. If all tokens expired → User is not authenticated

### 3. Getting Current Session

```typescript
// In your code: src/services/authService.ts
static async getCurrentSession() {
  const session = await fetchAuthSession();
  return {
    success: true,
    session,
    tokens: session.tokens, // ID, Access, Refresh tokens
  };
}
```

**What Happens:**

1. Amplify retrieves tokens from localStorage
2. Checks if tokens are expired
3. If expired, uses refresh token to get new tokens
4. Returns current valid session

### 4. Token Auto-Refresh

**Automatic Process:**

```
Token expires (after 1 hour)
      ↓
User makes a request
      ↓
Amplify detects expired token
      ↓
Amplify uses refresh token to get new tokens
      ↓
New tokens stored in localStorage
      ↓
Request continues with new token
```

**No manual intervention needed!** ✅

### 5. User Signs Out

```typescript
// In your code: src/services/authService.ts
static async signOut() {
  await signOut();
  // Amplify automatically clears all tokens from localStorage
}
```

**What Happens:**

1. Amplify removes all tokens from localStorage
2. Cognito invalidates the session server-side
3. User is logged out

---

## 🔒 Security Features

### 1. JWT Token Security

**Tokens are cryptographically signed:**

```
Header.Payload.Signature
eyJhbGc...  (algorithm, token type)
eyJzdWI...  (user data, expiry)
SflKxwR...  (AWS signature - can't be forged)
```

**Benefits:**

- ✅ Can't be tampered with (signature verification fails)
- ✅ Self-contained (no database lookup needed)
- ✅ Stateless (server doesn't need to store sessions)

### 2. Token Expiration

**Default Expiration Times:**

- ID Token: 1 hour
- Access Token: 1 hour
- Refresh Token: 30 days

**Configurable in Cognito Console:**

```
AWS Console → Cognito → User Pool → App Integration → App Client
→ Edit → Token expiration settings
```

### 3. HTTPS Enforcement

**In Production:**

- All tokens transmitted over HTTPS only
- Prevents man-in-the-middle attacks
- SSL/TLS encryption

### 4. CORS Protection

**Backend Configuration:**

```javascript
// server/server.js
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);
```

**Benefits:**

- Only allowed origins can make requests
- Prevents unauthorized domains from accessing API

---

## 📊 Session State Management

### Current Implementation

**In App.tsx:**

```typescript
import "./config/cognito"; // Initialize AWS Cognito

const [isAuthenticated, setIsAuthenticated] = useState(false);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  checkAuthStatus();
}, []);

const checkAuthStatus = async () => {
  const authenticated = await AuthService.isAuthenticated();
  setIsAuthenticated(authenticated);
  setIsLoading(false);
};
```

**Flow:**

1. App loads → Check if user is authenticated
2. Amplify checks localStorage for valid tokens
3. If valid → User stays logged in
4. If invalid → User sees login page

### Persistent Sessions

**User stays logged in across:**

- ✅ Page refreshes
- ✅ Browser restarts (until tokens expire)
- ✅ Tab closes and reopens
- ✅ Different tabs (shared localStorage)

**User is logged out when:**

- ❌ Tokens expire (after 30 days of inactivity)
- ❌ User clicks "Sign Out"
- ❌ User clears browser data
- ❌ Tokens are manually deleted from localStorage

---

## 🔧 How to Access Session Data

### Get Current User

```typescript
import { AuthService } from "./services/authService";

// Get user info
const { user } = await AuthService.getCurrentUser();
console.log(user.userId); // "abc123..."
console.log(user.username); // "user@example.com"
```

### Get Session Tokens

```typescript
// Get all tokens
const { tokens } = await AuthService.getCurrentSession();
console.log(tokens.idToken); // JWT ID token
console.log(tokens.accessToken); // JWT access token
```

### Get User Attributes

```typescript
// Get user profile data
const { attributes } = await AuthService.getUserAttributes();
console.log(attributes.email); // "user@example.com"
console.log(attributes.name); // "John Doe"
```

### Check Authentication

```typescript
// Simple boolean check
const isAuth = await AuthService.isAuthenticated();
if (isAuth) {
  // User is logged in
} else {
  // User is not logged in
}
```

---

## 🚀 Making Authenticated API Requests

### Option 1: Include Token Manually

```typescript
const { tokens } = await AuthService.getCurrentSession();

fetch("http://localhost:3001/api/users/profile", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${tokens.idToken}`,
    "Content-Type": "application/json",
  },
});
```

### Option 2: Use Amplify API (Recommended)

```typescript
import { get } from "aws-amplify/api";

const response = await get({
  apiName: "myAPI",
  path: "/users/profile",
  // Amplify automatically includes auth token!
});
```

### Backend Token Verification

**To verify tokens on backend:**

```javascript
// server/middleware/auth.js (you'll need to create this)
const { CognitoJwtVerifier } = require("aws-jwt-verify");

const verifier = CognitoJwtVerifier.create({
  userPoolId: "us-east-1_RbxnBYOCS",
  tokenUse: "id",
  clientId: "5a6kq9althf2te07sv157a26so",
});

async function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const payload = await verifier.verify(token);
    req.user = payload; // Attach user info to request
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
}
```

---

## 🔍 Debugging Sessions

### Check Tokens in Browser

**Open Browser Console:**

```javascript
// List all Cognito keys
Object.keys(localStorage).filter((key) => key.includes("Cognito"));

// Get specific token
localStorage.getItem(
  "CognitoIdentityServiceProvider.5a6kq9althf2te07sv157a26so.LastAuthUser"
);

// Decode JWT token (paste token at jwt.io)
const token = localStorage.getItem("...idToken");
console.log(JSON.parse(atob(token.split(".")[1]))); // Decode payload
```

### Check Session Status

```typescript
// In your app
const session = await AuthService.getCurrentSession();
console.log("Session:", session);
console.log("Is authenticated:", await AuthService.isAuthenticated());
```

### Common Issues

**Issue: User logged out unexpectedly**

- Check if tokens expired (30 days default)
- Check if user cleared browser data
- Check browser console for errors

**Issue: "User is not authenticated" error**

- Tokens may have expired
- User may need to sign in again
- Check localStorage for tokens

**Issue: Tokens not refreshing**

- Refresh token may have expired
- Network issues preventing refresh
- Check Cognito configuration

---

## 📈 Session Analytics

### Track Session Duration

```typescript
// Store login time
localStorage.setItem("loginTime", Date.now().toString());

// Calculate session duration
const loginTime = parseInt(localStorage.getItem("loginTime") || "0");
const sessionDuration = Date.now() - loginTime;
console.log(`Session duration: ${sessionDuration / 1000 / 60} minutes`);
```

### Track User Activity

```typescript
// Update last activity time
const updateActivity = () => {
  localStorage.setItem("lastActivity", Date.now().toString());
};

// Check for inactivity
const checkInactivity = () => {
  const lastActivity = parseInt(localStorage.getItem("lastActivity") || "0");
  const inactiveTime = Date.now() - lastActivity;

  if (inactiveTime > 30 * 60 * 1000) {
    // 30 minutes
    // User inactive, maybe show warning or auto-logout
    console.log("User inactive for 30 minutes");
  }
};
```

---

## 🎯 Best Practices

### 1. Always Check Authentication

```typescript
// Before accessing protected routes
useEffect(() => {
  const checkAuth = async () => {
    const isAuth = await AuthService.isAuthenticated();
    if (!isAuth) {
      navigate("/login");
    }
  };
  checkAuth();
}, []);
```

### 2. Handle Token Expiration Gracefully

```typescript
try {
  const response = await fetch("/api/protected");
} catch (error) {
  if (error.status === 401) {
    // Token expired, redirect to login
    await AuthService.signOut();
    navigate("/login");
  }
}
```

### 3. Clear Sensitive Data on Logout

```typescript
const handleLogout = async () => {
  await AuthService.signOut();
  // Clear any cached user data
  localStorage.removeItem("userProfile");
  localStorage.removeItem("savedJobs");
  navigate("/login");
};
```

### 4. Use HTTPS in Production

```typescript
// In production .env
VITE_API_URL=https://api.yourdomain.com  // Always HTTPS!
```

---

## 📚 Summary

**Your Current Setup:**

✅ **Authentication:** AWS Cognito  
✅ **Session Management:** AWS Amplify (automatic)  
✅ **Token Storage:** Browser localStorage  
✅ **Token Types:** ID, Access, Refresh (JWT)  
✅ **Token Expiration:** 1 hour (auto-refresh with refresh token)  
✅ **Session Duration:** 30 days (refresh token expiry)  
✅ **Security:** JWT signed tokens, HTTPS, CORS protection

**What You Don't Need to Worry About:**

❌ Manual cookie management  
❌ Session storage on backend  
❌ Token refresh logic (Amplify handles it)  
❌ CSRF protection (not using cookies)  
❌ Session database (stateless JWT)

**What Amplify Handles Automatically:**

✅ Token storage  
✅ Token refresh  
✅ Token expiration checks  
✅ Session persistence  
✅ Logout cleanup

---

## 🔗 Related Files

- `src/services/authService.ts` - Authentication methods
- `src/config/cognito.ts` - Cognito configuration
- `src/App.tsx` - Session initialization
- `server/server.js` - CORS configuration

---

**Last Updated:** November 16, 2024  
**Authentication Provider:** AWS Cognito  
**Session Library:** AWS Amplify v6.15.8  
**Token Type:** JWT (JSON Web Tokens)  
**Storage:** Browser localStorage

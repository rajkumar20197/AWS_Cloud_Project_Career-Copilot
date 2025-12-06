# 🔐 Admin System Setup Guide

## Prerequisites

- Node.js installed
- Backend server running on port 5000
- Frontend server running on port 3003

## 🚀 Step-by-Step Setup

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install bcrypt jsonwebtoken express-rate-limit
```

### Step 2: Verify Backend Configuration

Ensure `backend/server-simple.js` includes admin routes:

```javascript
// Admin routes
const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);
```

### Step 3: Start Backend Server

```bash
cd backend
node server-simple.js
```

You should see:

```
🚀 Career Copilot Backend running on port 5000
📧 Gmail SMTP: ❌ Not configured
📅 Google Calendar: ❌ Not configured
🌐 Health check: http://localhost:5000/api/health
```

### Step 4: Verify Admin API

Test the admin API endpoint:

```bash
curl http://localhost:5000/
```

Response should include:

```json
{
  "message": "🚀 Career Copilot Backend Server",
  "status": "running",
  "features": {
    "gmail": "✅ Configured",
    "calendar": "✅ Configured",
    "email": "✅ Working",
    "admin": "✅ API Ready"
  }
}
```

### Step 5: Start Frontend Server

```bash
npm run dev
```

Frontend should be available at: http://localhost:3003

### Step 6: Access Admin Interface

1. Open browser to: http://localhost:3003
2. Navigate through the app to the dashboard
3. Click "🧪 Test Components" in the sidebar
4. Click "Admin Login" button

### Step 7: Test Admin Login

Use these credentials:

**Standard Admin:**

- Email: `admin@gmail.com`
- Password: `password123`

**Super Admin (with MFA):**

- Email: `admin@aicareeragentcoach.com`
- Password: `password123`
- MFA Code: Any 6-digit number (e.g., `123456`)

## 🔧 Configuration

### Environment Variables

Create `.env` file in backend directory:

```bash
# Backend/.env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=5000
NODE_ENV=development

# Rate limiting
ADMIN_LOGIN_RATE_LIMIT_WINDOW=900000  # 15 minutes
ADMIN_LOGIN_RATE_LIMIT_MAX=5          # 5 attempts
```

### Admin Users Configuration

Edit `backend/routes/admin.js` to modify admin users:

```javascript
const adminUsers = [
  {
    id: 1,
    email: "your-admin@company.com",
    password: "$2b$12$...", // Use bcrypt to hash your password
    name: "Your Name",
    role: "super_admin",
    mfaEnabled: true,
  },
];
```

### Generate Password Hash

```bash
cd backend
node -e "const bcrypt = require('bcrypt'); console.log(bcrypt.hashSync('your-password', 12));"
```

## 🛡️ Security Configuration

### JWT Secret

**Important**: Change the JWT secret in production!

```javascript
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "your-super-secret-admin-jwt-key-change-in-production";
```

### Rate Limiting

Adjust rate limiting settings:

```javascript
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
});
```

### CORS Configuration

For production, configure specific origins:

```javascript
app.use(
  cors({
    origin: ["https://yourdomain.com", "https://admin.yourdomain.com"],
    credentials: true,
  })
);
```

## 🧪 Testing

### API Testing

Test login endpoint:

```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"password123"}'
```

Expected response:

```json
{
  "success": true,
  "requiresMFA": false,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "email": "admin@gmail.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```

### Frontend Testing

1. Login with admin credentials
2. Verify dashboard loads with metrics
3. Test navigation between admin tabs
4. Check user management functions
5. Verify security logs display

## 🐛 Troubleshooting

### Common Issues

#### "Invalid credentials" error

- Verify password hash is correct
- Check email address matches exactly
- Ensure backend server is running

#### "Cannot find module" errors

- Run `npm install` in backend directory
- Verify all dependencies are installed

#### CORS errors

- Check frontend is running on port 3003
- Verify backend CORS configuration
- Ensure API calls use correct base URL

#### JWT token errors

- Check JWT_SECRET is set correctly
- Verify token is being stored in localStorage
- Check token expiration (8 hours default)

### Debug Mode

Enable debug logging:

```javascript
// In backend/routes/admin.js
console.log("Admin login attempt:", { email, timestamp: new Date() });
```

## 🚀 Production Deployment

### Security Checklist

- [ ] Change JWT secret to secure random string
- [ ] Use HTTPS for all communications
- [ ] Configure proper CORS origins
- [ ] Set up real database (replace mock data)
- [ ] Implement proper MFA with TOTP library
- [ ] Set up monitoring and alerting
- [ ] Configure log rotation
- [ ] Set up backup procedures

### Database Integration

Replace mock data with real database:

```javascript
// Example with MongoDB
const Admin = require("../models/Admin");

const admin = await Admin.findOne({ email: email.toLowerCase() });
```

### MFA Integration

Implement real TOTP:

```javascript
const speakeasy = require("speakeasy");

const verified = speakeasy.totp.verify({
  secret: admin.mfaSecret,
  encoding: "base32",
  token: code,
  window: 2,
});
```

## 📚 Additional Resources

- [Full API Documentation](./ADMIN_API_DOCUMENTATION.md)
- [Quick Reference](./ADMIN_QUICK_REFERENCE.md)
- [Security Configuration](../src/config/enterpriseSecurity.ts)
- [Frontend Components](../src/components/AdminDashboard.tsx)

# 🔐 Admin System - Quick Reference

## 🚀 Quick Start

### 1. Access Admin System

- **URL**: http://localhost:3003
- **Path**: Dashboard → "🧪 Test Components" → "Admin Login"

### 2. Admin Credentials

#### Standard Admin (No MFA)

```
Email: admin@gmail.com
Password: password123
Role: admin
```

#### Super Admin (With MFA)

```
Email: admin@aicareeragentcoach.com
Password: password123
Role: super_admin
MFA Code: Any 6-digit number (e.g., 123456)
```

## 📡 API Endpoints

### Base URL

```
http://localhost:5000/api/admin
```

### Quick API Tests

#### Login Test

```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"password123"}'
```

#### Get Dashboard Stats

```bash
curl -X GET http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🛡️ Security Features

- ✅ **JWT Authentication** (8-hour expiration)
- ✅ **Bcrypt Password Hashing** (12 salt rounds)
- ✅ **Rate Limiting** (5 attempts per 15 minutes)
- ✅ **MFA Support** (TOTP-ready)
- ✅ **Role-Based Access Control**
- ✅ **Activity Logging**

## 🎯 Key Features

### Admin Dashboard

- Real-time user metrics
- Revenue tracking
- System health monitoring
- Security alerts

### User Management

- View all users (paginated)
- Update user status (active/suspended/banned)
- User activity tracking

### Security Center

- Security event logs
- Failed login attempts
- Admin activity audit trail

## 🔧 Development

### Backend Files

- `backend/routes/admin.js` - Admin API routes
- `backend/server-simple.js` - Server configuration

### Frontend Files

- `src/components/AdminLogin.tsx` - Login interface
- `src/components/AdminDashboard.tsx` - Admin dashboard
- `src/services/adminService.ts` - API service

## 🚨 Important Notes

1. **Change JWT Secret** in production
2. **Use HTTPS** for production deployment
3. **Implement real database** (currently using mock data)
4. **Configure proper CORS** origins
5. **Set up monitoring** and alerting

## 📞 Support

For issues or questions about the admin system:

1. Check the full documentation: `docs/ADMIN_API_DOCUMENTATION.md`
2. Review security configuration: `src/config/enterpriseSecurity.ts`
3. Check server logs for authentication errors

# 🚀 Quick Deployment Guide

## 📋 **READY TO DEPLOY**

Your AI Career Agent Coach platform is ready for production deployment! Here's how to get it live:

## 🌐 **YOUR DOMAINS**

- `aicareeragentcoach.com` - Main consumer platform
- `aicareeragentcoach.agency` - Agency/recruiter portal

## ⚡ **QUICK DEPLOYMENT (Recommended)**

### **Step 1: Frontend Deployment (Netlify)**

1. **Go to Netlify**: https://app.netlify.com/
2. **New Site from Git**: Connect your GitHub repository
3. **Build Settings**:
   ```
   Build command: npm run build
   Publish directory: dist
   ```
4. **Add Domains**:
   - Site settings → Domain management
   - Add `aicareeragentcoach.com`
   - Add `aicareeragentcoach.agency`
5. **Update DNS**: Follow Netlify's DNS instructions

### **Step 2: Backend Deployment (Railway)**

1. **Go to Railway**: https://railway.app/
2. **New Project**: Connect your GitHub repository
3. **Environment Variables**: Copy from `backend/.env.production`
4. **Custom Domain**: Add `api.aicareeragentcoach.com`
5. **Update DNS**: Add CNAME record to Railway domain

### **Step 3: Final Configuration**

1. **Update Production Environment**:

   ```bash
   # Copy production environment files
   cp .env.production .env.local
   cp backend/.env.production backend/.env
   ```

2. **Switch Stripe to Live Keys**:

   - Get live keys from Stripe dashboard
   - Update `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY`

3. **Test Everything**:
   ```bash
   npm run deploy:check
   ```

## 🔧 **ALTERNATIVE: Manual Setup**

### **Frontend (Any Static Host)**

```bash
npm run build
# Upload 'dist' folder to your hosting provider
```

### **Backend (Any Node.js Host)**

```bash
cd backend
npm install
NODE_ENV=production node server-simple.js
```

## ✅ **POST-DEPLOYMENT CHECKLIST**

- [ ] Test main site: https://aicareeragentcoach.com
- [ ] Test agency portal: https://aicareeragentcoach.agency
- [ ] Test admin login: https://aicareeragentcoach.com/admin
- [ ] Verify payments work with live Stripe keys
- [ ] Test email sending
- [ ] Check Google Calendar integration

## 🚨 **BEFORE GOING LIVE**

⚠️ **CRITICAL**: Update these in production:

1. **Stripe Keys**: Switch from `sk_test_` to `sk_live_`
2. **JWT Secret**: Generate secure random string
3. **Encryption Key**: Generate new 256-bit key
4. **Database Password**: Set secure password

## 📞 **SUPPORT**

- **Netlify Docs**: https://docs.netlify.com/
- **Railway Docs**: https://docs.railway.app/
- **Stripe Live Mode**: https://stripe.com/docs/keys

---

**🎉 Your platform is ready to launch! Follow the steps above and you'll be live in under 30 minutes.**

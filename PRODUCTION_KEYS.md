# 🔐 PRODUCTION SECURITY KEYS

**Generated:** December 6, 2025  
**⚠️ KEEP THESE SECURE - DO NOT COMMIT TO GIT**

---

## 🔑 Generated Security Keys

### **For backend/.env.production:**

```bash
# Replace these placeholders with the values below:
JWT_SECRET=480861cc948f3aae28b28a30984799a748097792dd1e07e43763e5120eb9f31d
ENCRYPTION_KEY=df006493272ebf1aada9e6f828ccfcd37ddf52a81aedba8e929ec029c0217d9a
DB_PASSWORD=a8L5mv+eLT5OmFxEuyq7hg==
```

---

## 📋 DEPLOYMENT STEPS

### **Step 1: Update Production Environment (2 minutes)**

1. **Open `backend/.env.production`**
2. **Replace these lines:**

   ```bash
   JWT_SECRET=CHANGE_THIS_TO_SECURE_RANDOM_STRING_IN_PRODUCTION
   ENCRYPTION_KEY=GENERATE_NEW_SECURE_256_BIT_KEY_FOR_PRODUCTION_USE
   DB_PASSWORD=GENERATE_SECURE_DATABASE_PASSWORD_FOR_PRODUCTION
   ```

3. **With these secure values:**
   ```bash
   JWT_SECRET=480861cc948f3aae28b28a30984799a748097792dd1e07e43763e5120eb9f31d
   ENCRYPTION_KEY=df006493272ebf1aada9e6f828ccfcd37ddf52a81aedba8e929ec029c0217d9a
   DB_PASSWORD=a8L5mv+eLT5OmFxEuyq7hg==
   ```

### **Step 2: Get Stripe Live Keys (5 minutes)**

1. **Login to Stripe Dashboard**: https://dashboard.stripe.com/
2. **Switch to Live mode** (toggle in top left)
3. **Go to Developers → API keys**
4. **Copy your live keys:**

   - Secret key (starts with `sk_live_`)
   - Publishable key (starts with `pk_live_`)

5. **Update both files:**
   - `backend/.env.production`
   - `.env.production`

### **Step 3: Deploy Frontend (10 minutes)**

1. **Go to Netlify**: https://app.netlify.com/
2. **New site from Git** → Connect your GitHub repo
3. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `build`
4. **Environment variables**: Copy from `.env.production`
5. **Custom domain**: Add `aicareeragentcoach.com`

### **Step 4: Deploy Backend (10 minutes)**

1. **Go to Railway**: https://railway.app/
2. **New Project** → Connect your GitHub repo
3. **Environment variables**: Copy from `backend/.env.production`
4. **Custom domain**: Add `api.aicareeragentcoach.com`

### **Step 5: Configure Domains (15 minutes)**

1. **Purchase domains** (if not already owned):

   - aicareeragentcoach.com
   - aicareeragentcoach.agency

2. **Update DNS records** (at your domain registrar):

   - Point to Netlify for frontend
   - Point to Railway for API

3. **SSL certificates**: Automatically handled by hosting providers

---

## ✅ VERIFICATION CHECKLIST

After deployment, test these URLs:

- [ ] **Main site**: https://aicareeragentcoach.com
- [ ] **Agency portal**: https://aicareeragentcoach.agency
- [ ] **API health**: https://api.aicareeragentcoach.com/api/health
- [ ] **Admin login**: https://aicareeragentcoach.com/admin
- [ ] **Payment flow**: Test with live Stripe keys
- [ ] **Email sending**: Test contact forms
- [ ] **Calendar integration**: Test OAuth flow

---

## 🚨 SECURITY REMINDERS

1. **Never commit these keys to Git**
2. **Store keys securely** (password manager, encrypted notes)
3. **Rotate keys periodically** (every 6-12 months)
4. **Monitor for unauthorized access**
5. **Enable 2FA on all service accounts**

---

## 📞 SUPPORT CONTACTS

- **Netlify Support**: https://docs.netlify.com/
- **Railway Support**: https://docs.railway.app/
- **Stripe Support**: https://support.stripe.com/
- **Domain Registrar**: Contact your domain provider

---

**🎉 You're ready to deploy! Follow the steps above and you'll be live in 30-45 minutes.**

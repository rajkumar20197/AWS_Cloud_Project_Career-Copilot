# 🌐 Domain & SSL Configuration Guide

## 📋 **DOMAIN OVERVIEW**

**Primary Domains:**

- `aicareeragentcoach.com` - Main consumer platform
- `aicareeragentcoach.agency` - Agency/recruiter portal

**Subdomains (Recommended):**

- `admin.aicareeragentcoach.com` - Administrative dashboard
- `api.aicareeragentcoach.com` - API endpoints
- `app.aicareeragentcoach.com` - Main application

## 🚀 **DEPLOYMENT ARCHITECTURE**

### **Option 1: Netlify Deployment (Recommended for MVP)**

**Frontend Deployment:**

```bash
# Build for production
npm run build

# Deploy to Netlify
# 1. Connect GitHub repo to Netlify
# 2. Set build command: npm run build
# 3. Set publish directory: dist
# 4. Add custom domains in Netlify dashboard
```

**Backend Deployment:**

```bash
# Deploy to Railway/Render/Heroku
# 1. Connect GitHub repo
# 2. Set start command: node server-simple.js
# 3. Add environment variables
# 4. Configure custom domain
```

### **Option 2: AWS Full Stack (Production)**

**Frontend (S3 + CloudFront):**

```bash
# S3 bucket for static hosting
aws s3 mb s3://aicareeragentcoach-frontend
aws s3 website s3://aicareeragentcoach-frontend --index-document index.html

# CloudFront distribution for CDN
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

**Backend (EC2 + Load Balancer):**

```bash
# EC2 instance with Node.js
# Application Load Balancer
# Auto Scaling Group
# RDS for database
```

## 🔒 **SSL CERTIFICATE SETUP**

### **Netlify SSL (Automatic)**

- Netlify provides free SSL certificates automatically
- Custom domains get SSL within minutes
- No manual configuration required

### **AWS Certificate Manager**

```bash
# Request SSL certificate
aws acm request-certificate \
  --domain-name aicareeragentcoach.com \
  --subject-alternative-names *.aicareeragentcoach.com \
  --validation-method DNS

# Validate domain ownership via DNS records
```

### **Let's Encrypt (Manual)**

```bash
# Install Certbot
sudo apt-get install certbot

# Generate certificate
sudo certbot certonly --standalone -d aicareeragentcoach.com -d www.aicareeragentcoach.com
```

## 📝 **DNS CONFIGURATION**

### **Required DNS Records:**

```dns
# Main domain
aicareeragentcoach.com        A     [IP_ADDRESS]
www.aicareeragentcoach.com    CNAME aicareeragentcoach.com

# Agency portal
aicareeragentcoach.agency     A     [IP_ADDRESS]
www.aicareeragentcoach.agency CNAME aicareeragentcoach.agency

# Subdomains
admin.aicareeragentcoach.com  CNAME aicareeragentcoach.com
api.aicareeragentcoach.com    CNAME aicareeragentcoach.com
app.aicareeragentcoach.com    CNAME aicareeragentcoach.com
```

## 🔧 **ENVIRONMENT UPDATES FOR PRODUCTION**

### **Frontend Environment (.env.production):**

```env
VITE_API_URL=https://api.aicareeragentcoach.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_KEY
VITE_GOOGLE_CLIENT_ID=575670614362-64k2bdqjetnc0cfeprtter67qj921b6m.apps.googleusercontent.com
```

### **Backend Environment (Production):**

```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://aicareeragentcoach.com

# Update Google Calendar redirect
GOOGLE_REDIRECT_URI=https://api.aicareeragentcoach.com/api/calendar/auth/callback

# Switch to live Stripe keys
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY
```

## 🚀 **QUICK DEPLOYMENT STEPS**

### **Step 1: Netlify Frontend Deployment**

1. **Connect Repository:**

   - Go to Netlify dashboard
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Build Settings:**

   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Add Custom Domains:**
   - Go to Site settings → Domain management
   - Add `aicareeragentcoach.com`
   - Add `aicareeragentcoach.agency`
   - Configure DNS records as provided by Netlify

### **Step 2: Backend Deployment (Railway)**

1. **Connect Repository:**

   - Go to Railway dashboard
   - Click "New Project"
   - Connect GitHub repository

2. **Environment Variables:**

   - Add all variables from `backend/.env`
   - Update URLs for production domains

3. **Custom Domain:**
   - Add `api.aicareeragentcoach.com`
   - Configure DNS CNAME record

### **Step 3: DNS Configuration**

Update your domain registrar DNS settings:

```dns
# For Netlify frontend
aicareeragentcoach.com        CNAME [netlify-subdomain].netlify.app
aicareeragentcoach.agency     CNAME [netlify-subdomain].netlify.app

# For Railway backend
api.aicareeragentcoach.com    CNAME [railway-subdomain].railway.app
```

## ✅ **DEPLOYMENT CHECKLIST**

### **Pre-Deployment:**

- [ ] Build frontend successfully (`npm run build`)
- [ ] Test backend locally with production environment
- [ ] Update all environment variables for production
- [ ] Switch Stripe to live keys
- [ ] Update Google Calendar redirect URI

### **During Deployment:**

- [ ] Deploy frontend to Netlify
- [ ] Deploy backend to Railway/Render
- [ ] Configure custom domains
- [ ] Set up DNS records
- [ ] Verify SSL certificates

### **Post-Deployment:**

- [ ] Test all functionality on live domains
- [ ] Verify payment processing works
- [ ] Test email sending
- [ ] Check Google Calendar integration
- [ ] Monitor error logs

## 🔍 **TESTING PRODUCTION DEPLOYMENT**

### **Frontend Tests:**

```bash
# Test main site
curl -I https://aicareeragentcoach.com

# Test agency portal
curl -I https://aicareeragentcoach.agency

# Test SSL certificate
openssl s_client -connect aicareeragentcoach.com:443 -servername aicareeragentcoach.com
```

### **Backend Tests:**

```bash
# Test API health
curl https://api.aicareeragentcoach.com/api/health

# Test admin login
curl -X POST https://api.aicareeragentcoach.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"password123"}'
```

## 📊 **MONITORING & MAINTENANCE**

### **Uptime Monitoring:**

- Set up UptimeRobot or similar service
- Monitor main domains every 5 minutes
- Alert on downtime via email/SMS

### **SSL Certificate Renewal:**

- Netlify: Automatic renewal
- AWS: Automatic renewal
- Let's Encrypt: Set up auto-renewal cron job

### **Performance Monitoring:**

- Google PageSpeed Insights
- GTmetrix for performance analysis
- AWS CloudWatch for backend monitoring

## 🚨 **TROUBLESHOOTING**

### **Common Issues:**

**DNS Propagation:**

- DNS changes can take 24-48 hours to propagate
- Use `dig` or online DNS checkers to verify

**SSL Certificate Issues:**

- Verify domain ownership
- Check DNS records are correct
- Wait for certificate validation

**CORS Errors:**

- Update backend CORS settings for production domains
- Verify frontend API URLs are correct

**Environment Variables:**

- Double-check all production environment variables
- Ensure no test/development values in production

## 📞 **SUPPORT RESOURCES**

- **Netlify Docs:** https://docs.netlify.com/
- **Railway Docs:** https://docs.railway.app/
- **AWS Docs:** https://docs.aws.amazon.com/
- **Let's Encrypt:** https://letsencrypt.org/docs/

---

**Next Steps:** Choose deployment platform and follow the quick deployment steps above!
</text>
</invoke>

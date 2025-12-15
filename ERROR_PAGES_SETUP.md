# Error Pages Configuration Guide

**Date:** December 15, 2024  
**Purpose:** Configure custom error pages for server downtime and errors

---

## 📄 **Error Pages Created**

### **1. Maintenance Page** (`public/maintenance.html`)
- **Use Case:** Scheduled maintenance, planned downtime
- **Features:**
  - ⚙️ Animated gear icon
  - ⏱️ Auto-refresh countdown (30 seconds)
  - 🔄 Manual refresh button
  - 📧 Contact support link
  - 🎨 Animated background with particles
  - 📊 Progress bar animation
  - ✅ Automatic server status checking every 5 seconds

### **2. Error Page** (`public/error.html`)
- **Use Case:** Server errors (500, 502, 503, 504)
- **Features:**
  - ⚠️ Error code display (dynamic)
  - 🆔 Unique error reference ID
  - 🔄 Auto-retry for 503 errors
  - 📋 Helpful troubleshooting steps
  - 📧 Support contact options
  - 🏠 Return to home button
  - 📝 Error logging for debugging

---

## 🚀 **How to Use**

### **Option 1: S3 Static Website (Current Setup)**

#### **Step 1: Upload Error Pages to S3**

```powershell
# Upload to your S3 bucket
aws s3 cp public/maintenance.html s3://aicareeragentcoach-frontend/maintenance.html
aws s3 cp public/error.html s3://aicareeragentcoach-frontend/error.html

# Make them public
aws s3api put-object-acl --bucket aicareeragentcoach-frontend --key maintenance.html --acl public-read
aws s3api put-object-acl --bucket aicareeragentcoach-frontend --key error.html --acl public-read
```

#### **Step 2: Configure S3 Website Error Document**

1. Go to **S3 Console** → Your bucket → **Properties**
2. Scroll to **Static website hosting**
3. Click **Edit**
4. Set:
   - **Index document:** `index.html`
   - **Error document:** `error.html`
5. Save changes

**URLs:**
- Maintenance: `http://your-bucket.s3-website-us-east-1.amazonaws.com/maintenance.html`
- Error: `http://your-bucket.s3-website-us-east-1.amazonaws.com/error.html`

---

### **Option 2: CloudFront Distribution (Recommended)**

#### **Step 1: Upload to S3** (same as above)

#### **Step 2: Configure CloudFront Custom Error Responses**

1. Go to **CloudFront Console** → Your distribution
2. Click **Error Pages** tab
3. Click **Create Custom Error Response**

**For 500 Internal Server Error:**
- HTTP Error Code: `500`
- Customize Error Response: `Yes`
- Response Page Path: `/error.html?code=500`
- HTTP Response Code: `500`
- Error Caching Minimum TTL: `10` seconds

**For 502 Bad Gateway:**
- HTTP Error Code: `502`
- Response Page Path: `/error.html?code=502`
- HTTP Response Code: `502`
- Error Caching Minimum TTL: `10` seconds

**For 503 Service Unavailable:**
- HTTP Error Code: `503`
- Response Page Path: `/maintenance.html`
- HTTP Response Code: `503`
- Error Caching Minimum TTL: `10` seconds

**For 504 Gateway Timeout:**
- HTTP Error Code: `504`
- Response Page Path: `/error.html?code=504`
- HTTP Response Code: `504`
- Error Caching Minimum TTL: `10` seconds

4. Click **Create** for each error response
5. Wait for distribution to deploy (~5-10 minutes)

---

### **Option 3: Application Load Balancer (ALB)**

#### **Configure Custom Error Pages in ALB**

1. Go to **EC2 Console** → **Load Balancers**
2. Select your ALB → **Listeners** tab
3. Edit listener rules
4. Add custom error responses:

**For 503 (Service Unavailable):**
```json
{
  "Type": "fixed-response",
  "FixedResponseConfig": {
    "StatusCode": "503",
    "ContentType": "text/html",
    "MessageBody": "<!-- Redirect to maintenance page -->\n<meta http-equiv=\"refresh\" content=\"0; url=https://your-domain.com/maintenance.html\">"
  }
}
```

---

## 🎨 **Customization**

### **Update Branding**

Edit the HTML files to match your branding:

**Colors:**
```css
/* Primary gradient */
background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);

/* Error gradient (red/orange) */
background: linear-gradient(135deg, #ef4444 0%, #f97316 100%);
```

**Contact Email:**
```html
<!-- Update all instances of -->
support@careercopilot.com
<!-- to your actual support email -->
```

**Company Name:**
```html
<!-- Update -->
© 2025 AI Career Agent Coach
<!-- to your company name -->
```

### **Auto-Refresh Timing**

**Maintenance page:**
```javascript
// Change countdown from 30 seconds
let countdown = 30; // Change this value
```

**Error page (503 only):**
```javascript
// Change auto-retry from 30 seconds
let countdown = 30; // Change this value
```

---

## 🧪 **Testing**

### **Test Maintenance Page**

```powershell
# Direct URL test
Start-Process "http://your-bucket.s3-website-us-east-1.amazonaws.com/maintenance.html"
```

### **Test Error Page**

```powershell
# Test different error codes
Start-Process "http://your-bucket.s3-website-us-east-1.amazonaws.com/error.html?code=500"
Start-Process "http://your-bucket.s3-website-us-east-1.amazonaws.com/error.html?code=503"
```

### **Simulate Server Down**

**Option A: Stop backend server**
```powershell
# If using local backend
# Stop the server process
```

**Option B: Modify ALB health check**
```
1. Go to EC2 → Target Groups
2. Select your target group
3. Deregister all targets
4. Wait 1-2 minutes
5. Try accessing your site
6. Should show error page
```

---

## 📊 **Monitoring & Analytics**

### **Track Error Page Views**

Add Google Analytics or AWS CloudWatch to error pages:

```html
<!-- Add before </head> in error.html and maintenance.html -->
<script>
  // Send error page view to analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', 'error_page_view', {
      'error_code': document.getElementById('errorCode').textContent,
      'error_ref': document.getElementById('errorRef').textContent
    });
  }
</script>
```

### **CloudWatch Logs**

Error pages automatically log to browser console. To send to CloudWatch:

```javascript
// Add to error.html
fetch('https://your-api.com/log-error', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: errorCode,
    reference: errorRef,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  })
});
```

---

## 🔔 **Alerting**

### **Set Up Alerts for Error Pages**

**CloudWatch Alarm for 503 Errors:**

1. Go to **CloudWatch** → **Alarms** → **Create Alarm**
2. Select metric: **CloudFront** → **4xx/5xx Error Rate**
3. Conditions:
   - Threshold: `> 5%` for 2 consecutive periods
   - Period: 5 minutes
4. Actions:
   - Send notification to SNS topic
   - Email: `your-email@example.com`

---

## 📱 **Mobile Responsiveness**

Both error pages are fully responsive:
- ✅ Mobile-first design
- ✅ Touch-friendly buttons
- ✅ Readable text on small screens
- ✅ Optimized animations for mobile

---

## 🌐 **Multi-Language Support (Optional)**

To add multiple languages:

```javascript
// Add to error.html
const userLang = navigator.language || navigator.userLanguage;

const messages = {
  'en': {
    title: 'Oops! Something Went Wrong',
    message: 'We\'re experiencing technical difficulties.'
  },
  'es': {
    title: '¡Ups! Algo salió mal',
    message: 'Estamos experimentando dificultades técnicas.'
  }
};

const lang = userLang.split('-')[0];
const msg = messages[lang] || messages['en'];
document.getElementById('errorTitle').textContent = msg.title;
```

---

## 🎯 **Best Practices**

1. **Keep error pages simple** - No external dependencies (CSS/JS inline)
2. **Fast loading** - Error pages should load instantly
3. **Clear messaging** - Tell users what happened and what to do
4. **Contact info** - Always provide a way to reach support
5. **Auto-refresh** - For temporary errors (503), auto-retry
6. **Error tracking** - Log errors for debugging
7. **Branding** - Match your site's design
8. **Testing** - Test error pages regularly

---

## 📋 **Deployment Checklist**

- [ ] Upload `maintenance.html` to S3
- [ ] Upload `error.html` to S3
- [ ] Make files public (if using S3 static hosting)
- [ ] Configure S3 error document
- [ ] Configure CloudFront custom error responses (if using CloudFront)
- [ ] Update support email in both files
- [ ] Update company name/branding
- [ ] Test maintenance page directly
- [ ] Test error page with different codes
- [ ] Simulate server down scenario
- [ ] Verify auto-refresh works
- [ ] Check mobile responsiveness
- [ ] Set up CloudWatch alarms
- [ ] Document URLs for team

---

## 🚨 **Emergency Maintenance Mode**

To put your site in maintenance mode:

### **Quick Method (S3):**

```powershell
# Backup current index.html
aws s3 cp s3://aicareeragentcoach-frontend/index.html s3://aicareeragentcoach-frontend/index.html.backup

# Replace with maintenance page
aws s3 cp public/maintenance.html s3://aicareeragentcoach-frontend/index.html

# To restore:
aws s3 cp s3://aicareeragentcoach-frontend/index.html.backup s3://aicareeragentcoach-frontend/index.html
```

### **CloudFront Method:**

1. Create CloudFront function to redirect all traffic:

```javascript
function handler(event) {
  var response = {
    statusCode: 503,
    statusDescription: 'Service Unavailable',
    headers: {
      'location': { value: '/maintenance.html' }
    }
  };
  return response;
}
```

2. Associate with CloudFront distribution
3. Wait for deployment
4. Remove function when maintenance is complete

---

## 📞 **Support**

If you need help configuring error pages:
- 📧 Email: support@careercopilot.com
- 📚 AWS Docs: [Custom Error Pages](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/custom-error-pages.html)

---

**Last Updated:** December 15, 2024  
**Status:** Ready to deploy  
**Files:** `public/maintenance.html`, `public/error.html`

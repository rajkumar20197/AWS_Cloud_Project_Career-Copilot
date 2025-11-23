# Buy and Setup Domain with AWS Route 53

Complete guide to purchasing and configuring your domain directly in AWS.

---

## Why Route 53 for Domain Registration?

✅ **Easiest AWS integration** - Everything in one place
✅ **Auto-configured** - Nameservers set up automatically
✅ **No separate login** - Manage domain in AWS Console
✅ **Free privacy protection** - WHOIS privacy included
✅ **Auto-renewal** - Never lose your domain
✅ **Instant hosted zone** - Created automatically

---

## Part 1: Register Domain in Route 53

### Step 1: Go to Route 53

1. Log into **AWS Console**
2. Search for **Route 53** in the search bar
3. Click **Route 53**

### Step 2: Register Domain

1. In the left menu, click **Registered domains**
2. Click **Register domain** (orange button)

### Step 3: Search for Your Domain

1. Enter your desired domain name:
   - `aicareeragent` (without .com)
2. Click **Search**
3. AWS will show availability and pricing

**Popular TLDs and Prices:**

- `.com` - $13/year ⭐ (Most popular)
- `.net` - $13/year
- `.org` - $13/year
- `.ai` - $80/year (Perfect for AI apps, but expensive)
- `.app` - $18/year (Good for applications)
- `.io` - $35/year (Tech-focused)
- `.tech` - $8/year
- `.online` - $40/year
- `.click` - $3/year (Cheap but less professional)

### Step 4: Select Your Domain

1. If available, click **Add to cart**
2. If taken, try variations:
   - `myaicareeragent.com`
   - `getcareeragent.com`
   - `careeraiagent.com`
   - `smartcareeragent.com`
3. Click **Continue**

### Step 5: Configure Domain Settings

1. **Auto-renew:** ✅ Enabled (recommended)
2. **Duration:** 1 year (or more for discount)
3. **Privacy protection:** ✅ Enabled (FREE - hides your personal info)
4. Click **Continue**

### Step 6: Enter Contact Information

Fill in all required fields:

- **Contact Type:** Person (or Company if you have one)
- **First Name / Last Name**
- **Email:** Your email (important - you'll get verification email)
- **Phone Number:** Include country code
- **Address:** Your address
- **City, State, Zip**
- **Country**

**Note:** This info is hidden from public WHOIS due to privacy protection.

### Step 7: Review and Purchase

1. Review all details
2. Check the box: "I have read and agree to the AWS Domain Name Registration Agreement"
3. Click **Complete purchase**

### Step 8: Wait for Registration

- **Processing time:** 10-30 minutes (usually faster)
- **Email verification:** Check your email and click verification link
- **Status:** Go to **Registered domains** to check status

---

## Part 2: Verify Domain Registration

### Check Registration Status

1. Go to **Route 53** → **Registered domains**
2. Your domain should show:
   - **Status:** Registration successful (after 10-30 min)
   - **Auto-renew:** Enabled
   - **Transfer lock:** Enabled (prevents unauthorized transfers)

### Verify Email

1. Check your email inbox
2. Look for email from: `no-reply@registrar.amazon.com`
3. Subject: "Verify your email address for [yourdomain.com]"
4. Click the verification link
5. **Important:** Must verify within 15 days or domain will be suspended!

### Check Hosted Zone (Auto-Created)

1. Go to **Route 53** → **Hosted zones**
2. You should see your domain listed
3. Click on it to see:
   - **NS records** (nameservers) - Already configured!
   - **SOA record** (Start of Authority)
4. **Note the 4 nameservers** - These are already set for your domain!

Example nameservers:

```
ns-1234.awsdns-12.org
ns-5678.awsdns-34.com
ns-9012.awsdns-56.net
ns-3456.awsdns-78.co.uk
```

---

## Part 3: Get Free SSL Certificate

### Step 1: Request Certificate in us-east-1

1. Go to **AWS Certificate Manager (ACM)**
2. **Important:** Change region to **us-east-1** (top right)
3. Click **Request certificate**
4. Select **Request a public certificate**
5. Click **Next**

### Step 2: Add Domain Names

1. **Fully qualified domain name:**

   - Add: `yourdomain.com`
   - Click **Add another name to this certificate**
   - Add: `*.yourdomain.com` (wildcard for subdomains)
   - Click **Add another name**
   - Add: `www.yourdomain.com`

2. **Validation method:** DNS validation (recommended)
3. **Key algorithm:** RSA 2048 (default)
4. Click **Request**

### Step 3: Validate Certificate (Easy!)

1. Click on your certificate (status: Pending validation)
2. Scroll down to **Domains** section
3. Click **Create records in Route 53** (magic button!)
4. Click **Create records**
5. Wait 5-30 minutes for validation
6. Status will change to **Issued** ✅

### Step 4: Repeat for us-west-2

1. Change region to **us-west-2**
2. Repeat Steps 1-3
3. Request another certificate (each region needs its own)
4. Use same domain names
5. Click **Create records in Route 53**
6. Wait for validation

**Cost: $0 (FREE forever, auto-renews)**

---

## Part 4: Test Your Domain

### Test 1: DNS Resolution

```bash
# Windows Command Prompt
nslookup yourdomain.com

# Should return Route 53 nameservers
```

### Test 2: Check Nameservers

```bash
nslookup -type=NS yourdomain.com

# Should show your 4 Route 53 nameservers
```

### Test 3: WHOIS Lookup

1. Go to: https://whois.domaintools.com
2. Enter your domain
3. Verify:
   - ✅ Privacy protection enabled (your info hidden)
   - ✅ Nameservers point to Route 53
   - ✅ Registration date is today

---

## Part 5: Create DNS Records

### Create A Record (Points to Your ALB)

#### After You Create Your ALB:

1. Go to **Route 53** → **Hosted zones**
2. Click your domain
3. Click **Create record**
4. Configure:
   - **Record name:** Leave blank (for root domain)
   - **Record type:** A
   - **Alias:** ✅ Toggle ON
   - **Route traffic to:**
     - Select: **Alias to Application and Classic Load Balancer**
     - Region: **us-east-1**
     - Load balancer: Select your ALB
   - **Routing policy:** Simple routing
5. Click **Create records**

### Create WWW Record

1. Click **Create record**
2. Configure:
   - **Record name:** `www`
   - **Record type:** A
   - **Alias:** ✅ ON
   - **Route traffic to:** Same ALB as above
3. Click **Create records**

Now both `yourdomain.com` and `www.yourdomain.com` work!

---

## Part 6: Setup Multi-Region Failover

### Create Health Checks

1. Go to **Route 53** → **Health checks**
2. Click **Create health check**

#### Health Check 1 (us-east-1):

- **Name:** `career-agent-health-east`
- **What to monitor:** Endpoint
- **Specify endpoint by:** Domain name
- **Protocol:** HTTPS
- **Domain name:** Your us-east-1 ALB DNS
- **Port:** 443
- **Path:** `/health` (or `/`)
- **Request interval:** Standard (30 seconds)
- **Failure threshold:** 3
- Click **Next**
- Skip alarm (or add SNS notification)
- Click **Create health check**

#### Health Check 2 (us-west-2):

- Repeat with us-west-2 ALB DNS
- Name: `career-agent-health-west`

### Create Failover Records

1. Go to your **Hosted zone**
2. Click **Create record**
3. Configure:
   - **Record name:** Leave blank
   - **Record type:** A
   - **Routing policy:** Failover
   - Click **Define failover record**

#### Primary Record:

- **Failover record type:** Primary
- **Value/Route traffic to:**
  - Alias to Application Load Balancer
  - Region: us-east-1
  - Select your ALB
- **Health check:** Select `career-agent-health-east`
- **Record ID:** `primary-us-east-1`
- Click **Define failover record**

#### Secondary Record:

- Click **Add another record**
- **Failover record type:** Secondary
- **Value/Route traffic to:**
  - Alias to Application Load Balancer
  - Region: us-west-2
  - Select your ALB
- **Health check:** Select `career-agent-health-west`
- **Record ID:** `secondary-us-west-2`
- Click **Define failover record**

4. Click **Create records**

---

## Part 7: Update ALB to Use HTTPS

### Configure ALB Listener (us-east-1)

1. Go to **EC2** → **Load Balancers**
2. Select your ALB
3. Click **Listeners** tab
4. Click **Add listener**
5. Configure:
   - **Protocol:** HTTPS
   - **Port:** 443
   - **Default action:** Forward to your target group
   - **Security policy:** ELBSecurityPolicy-TLS13-1-2-2021-06
   - **Default SSL certificate:** Select your ACM certificate
6. Click **Add**

### Add HTTP → HTTPS Redirect

1. Click **Add listener**
2. Configure:
   - **Protocol:** HTTP
   - **Port:** 80
   - **Default action:** Redirect
   - **Protocol:** HTTPS
   - **Port:** 443
   - **Status code:** 301 (Permanent redirect)
3. Click **Add**

### Repeat for us-west-2

1. Change region to **us-west-2**
2. Add HTTPS listener with us-west-2 certificate
3. Add HTTP → HTTPS redirect

---

## Part 8: Test Everything

### Test 1: Access Your Site

```
https://yourdomain.com
```

Should load with green padlock (SSL working)

### Test 2: Test WWW

```
https://www.yourdomain.com
```

Should also work

### Test 3: Test HTTP Redirect

```
http://yourdomain.com
```

Should redirect to HTTPS automatically

### Test 4: Test Failover

1. Go to **EC2** → **Target Groups** (us-east-1)
2. Deregister all targets (simulate failure)
3. Wait 2-3 minutes
4. Access `https://yourdomain.com`
5. Should still work (now using us-west-2)
6. Check health check - us-east-1 should be unhealthy

### Test 5: Check SSL Certificate

1. Click padlock in browser
2. Verify:
   - ✅ Certificate valid
   - ✅ Issued by Amazon
   - ✅ Covers your domain
   - ✅ Expires in ~1 year (auto-renews)

---

## Cost Summary

### One-Time Costs:

- Domain registration: **$13** (first year)

### Monthly Costs:

- Route 53 hosted zone: **$0.50/month**
- Route 53 health checks (2): **$1/month**
- SSL certificates (ACM): **FREE**
- Route 53 queries: **$0.40 per million** (very cheap)

### Annual Costs:

- Domain renewal: **$13/year** (auto-renews)

**Total Monthly: ~$1.50/month** (just for domain and DNS)

---

## Domain Management

### View Domain Details

1. **Route 53** → **Registered domains**
2. Click your domain
3. View:
   - Registration date
   - Expiration date
   - Auto-renew status
   - Transfer lock status
   - Contact information

### Update Contact Information

1. Click **Edit contacts**
2. Update any information
3. Click **Save**

### Enable/Disable Auto-Renew

1. Click **Enable/Disable auto-renewal**
2. Choose setting
3. **Recommended:** Keep enabled

### Transfer Domain (If Needed Later)

1. Disable transfer lock
2. Get authorization code
3. Initiate transfer at new registrar
4. **Note:** Can't transfer for 60 days after registration

---

## Troubleshooting

### Issue: Domain not resolving

- **Wait time:** DNS propagation can take up to 48 hours (usually 1-2 hours)
- **Check:** Verify nameservers are set correctly
- **Test:** Use `nslookup yourdomain.com`

### Issue: Email verification not received

- **Check spam folder**
- **Resend:** Route 53 → Registered domains → Resend verification email
- **Important:** Must verify within 15 days

### Issue: SSL certificate pending

- **Wait:** Can take up to 30 minutes
- **Check:** Verify CNAME records were created in Route 53
- **Retry:** Delete and recreate certificate if stuck

### Issue: Health checks failing

- **Verify:** ALB is running and healthy
- **Check:** Security groups allow Route 53 health checker IPs
- **Path:** Ensure `/health` endpoint exists and returns 200

### Issue: High costs

- **Check billing dashboard** for unexpected charges
- **Delete unused resources:** Old ALBs, NAT Gateways
- **Monitor:** Set up billing alarms

---

## Next Steps

1. ✅ Domain registered and verified
2. ✅ SSL certificates issued
3. ✅ DNS configured
4. ✅ Multi-region failover setup
5. [ ] Deploy your application
6. [ ] Add monitoring (CloudWatch)
7. [ ] Set up CI/CD pipeline
8. [ ] Add WAF for security
9. [ ] Configure CloudFront (optional)
10. [ ] Launch! 🚀

---

## Pro Tips

### 1. Set Up Billing Alerts

1. **CloudWatch** → **Billing** → **Create alarm**
2. Set threshold: $10
3. Get notified if costs spike

### 2. Enable MFA on AWS Account

1. **IAM** → **Users** → Your user
2. **Security credentials** → **Assign MFA device**
3. Protect your domain and infrastructure

### 3. Document Everything

- Save ALB DNS names
- Note certificate ARNs
- Keep architecture diagrams
- Document all configurations

### 4. Regular Backups

- Export Route 53 records (JSON)
- Save CloudFormation templates
- Document manual configurations

### 5. Monitor Domain Expiration

- Check **Registered domains** monthly
- Verify auto-renew is enabled
- Keep payment method updated

---

## Summary

You now have:

- ✅ Professional domain registered
- ✅ Free SSL certificates
- ✅ Route 53 DNS configured
- ✅ Multi-region failover ready
- ✅ HTTPS enabled
- ✅ Auto-renewal enabled

**Total setup time:** 30-45 minutes
**Monthly cost:** $1.50 (domain + DNS)
**Annual cost:** $13 (domain renewal)

Your AI Career Agent is ready for production! 🎉

---

**Created:** November 19, 2025
**Last Updated:** November 19, 2025
**Status:** Production Ready

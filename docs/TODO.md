# AWS Career Agent - TODO List

## Current Status

- ✅ Multi-region load balancer configuration created (Route 53 + ALB)
- ✅ VPC networking infrastructure complete
- ✅ Profile system with DynamoDB integration
- ✅ AI integration with AWS Bedrock
- ✅ Full-stack application with 20+ features
- ✅ Domain strategy decided: **careercopilot.com**
- ✅ Complete setup guides created (5 comprehensive docs)
- 🔥 **TODAY:** Buy domain + Gmail + Calendar + S3 + Stripe setup

---

## 🚀 IMMEDIATE: Production Deployment Checklist

### Phase 1: Domain Registration (START HERE - 30 min)

- [ ] Go to AWS Console → Route 53 → Registered domains
- [ ] Click "Register domain"
- [ ] Search: `careercopilot`
- [ ] Select `.com` → Add to cart
- [ ] Configure: 1 year, auto-renew ON, privacy ON
- [ ] Enter contact information
- [ ] Complete purchase: **$13**
- [ ] Verify email (check inbox for verification link)
- [ ] Wait for "Registration successful" status (10-30 min)
- [ ] Verify hosted zone auto-created

**Cost: $13 one-time | Monthly: $0.50**

---

### Phase 2: SSL Certificates (10 min)

**us-east-1:**

- [ ] Go to AWS Certificate Manager (ACM)
- [ ] Change region to **us-east-1**
- [ ] Request certificate → Public certificate
- [ ] Add domains:
  - `careercopilot.com`
  - `*.careercopilot.com`
  - `www.careercopilot.com`
- [ ] Validation: DNS validation
- [ ] Click "Create records in Route 53" (auto-validates)
- [ ] Wait for "Issued" status (5-30 min)

**us-west-2:**

- [ ] Change region to **us-west-2**
- [ ] Repeat above steps
- [ ] Request certificate with same domains
- [ ] Create records in Route 53
- [ ] Wait for "Issued" status

**Cost: FREE (forever)**

---

### Phase 3: VPC - us-east-1 Primary (10 min)

- [ ] VPC → Create VPC → "VPC and more"
- [ ] Name: `career-copilot-vpc-east`
- [ ] IPv4 CIDR: `10.0.0.0/16`
- [ ] Availability Zones: 2
- [ ] Public subnets: 2
- [ ] Private subnets: 2
- [ ] NAT gateways: 1 (in 1 AZ only - save cost)
- [ ] VPC endpoints: None
- [ ] Create VPC (wait 3-5 min)

**Cost: $32/month (NAT Gateway) - DELETE after testing to save**

---

### Phase 4: VPC - us-west-2 Secondary (10 min)

- [ ] Change region to **us-west-2**
- [ ] VPC → Create VPC → "VPC and more"
- [ ] Name: `career-copilot-vpc-west`
- [ ] IPv4 CIDR: `10.1.0.0/16`
- [ ] Availability Zones: 2
- [ ] Public subnets: 2
- [ ] Private subnets: 2
- [ ] NAT gateways: 1
- [ ] Create VPC

**Cost: $32/month (NAT Gateway) - DELETE after testing**

---

### Phase 5: Application Load Balancer - us-east-1 (15 min)

**Target Group:**

- [ ] EC2 → Target Groups → Create target group
- [ ] Target type: Instances (or IP)
- [ ] Name: `career-copilot-tg-east`
- [ ] Protocol: HTTP, Port: 3000
- [ ] VPC: `career-copilot-vpc-east`
- [ ] Health check path: `/health` (or `/`)
- [ ] Create target group

**Load Balancer:**

- [ ] EC2 → Load Balancers → Create Load Balancer
- [ ] Application Load Balancer
- [ ] Name: `career-copilot-alb-east`
- [ ] Scheme: Internet-facing
- [ ] VPC: `career-copilot-vpc-east`
- [ ] Mappings: Select BOTH public subnets
- [ ] Security group: Allow HTTP (80), HTTPS (443)
- [ ] Listener 1: HTTPS:443 → Forward to target group
  - SSL certificate: Select us-east-1 ACM certificate
- [ ] Listener 2: HTTP:80 → Redirect to HTTPS:443
- [ ] Create load balancer
- [ ] **COPY ALB DNS NAME** (save for Route 53)

**Cost: $16/month - DELETE after testing**

---

### Phase 6: Application Load Balancer - us-west-2 (15 min)

- [ ] Change region to **us-west-2**
- [ ] Create target group: `career-copilot-tg-west`
- [ ] Create ALB: `career-copilot-alb-west`
- [ ] Same settings as us-east-1
- [ ] Use us-west-2 ACM certificate
- [ ] **COPY ALB DNS NAME**

**Cost: $16/month - DELETE after testing**

---

### Phase 7: Route 53 Health Checks (5 min)

- [ ] Route 53 → Health checks → Create health check
- [ ] Health Check 1:
  - Name: `copilot-health-east`
  - Monitor: Endpoint
  - Protocol: HTTPS
  - Domain: [Paste us-east-1 ALB DNS]
  - Port: 443
  - Path: `/health` or `/`
  - Interval: 30 seconds
  - Failure threshold: 3
- [ ] Health Check 2:
  - Name: `copilot-health-west`
  - Domain: [Paste us-west-2 ALB DNS]
  - Same settings

**Cost: $1/month (both health checks)**

---

### Phase 8: Route 53 Failover Records (10 min)

- [ ] Route 53 → Hosted zones → careercopilot.com
- [ ] Create record → Failover routing
- [ ] Primary Record:
  - Record name: (leave blank for root domain)
  - Record type: A
  - Failover: PRIMARY
  - Alias: ON
  - Route traffic to: ALB (us-east-1)
  - Health check: copilot-health-east
  - Record ID: `primary-us-east-1`
- [ ] Add another record → Secondary:
  - Failover: SECONDARY
  - Alias to: ALB (us-west-2)
  - Health check: copilot-health-west
  - Record ID: `secondary-us-west-2`
- [ ] Create records
- [ ] Repeat for `www` subdomain

**Cost: $0**

---

### Phase 9: Testing (20 min)

- [ ] Test: `https://careercopilot.com` (should load with SSL)
- [ ] Test: `https://www.careercopilot.com` (should work)
- [ ] Test: `http://careercopilot.com` (should redirect to HTTPS)
- [ ] Check SSL certificate (green padlock in browser)
- [ ] Test failover:
  - EC2 → Target Groups (us-east-1)
  - Deregister all targets
  - Wait 2-3 minutes
  - Refresh site (should still work via us-west-2)
  - Check health checks (us-east-1 should be unhealthy)
- [ ] **📸 Take screenshots of everything for documentation**

---

### Phase 10: COST OPTIMIZATION (CRITICAL!)

**After testing, DELETE expensive resources:**

- [ ] Delete ALB in us-east-1
- [ ] Delete ALB in us-west-2
- [ ] Delete NAT Gateway in us-east-1
- [ ] Delete NAT Gateway in us-west-2
- [ ] EC2 → Elastic IPs → Release any unattached IPs (both regions)
- [ ] Verify deletions in billing dashboard

**KEEP these (cheap/free):**

- ✅ VPCs (free)
- ✅ Subnets (free)
- ✅ Route 53 hosted zone ($0.50/month)
- ✅ Route 53 health checks ($1/month)
- ✅ SSL certificates (free)

**Savings: $96/month → Only pay $2.58/month**

---

## 💰 Cost Summary

### Setup Phase (2-3 hours of testing):

- Domain registration: $13 (one-time)
- Infrastructure running: ~$0.30
- **Total: $13.30**

### Monthly Ongoing (After deletion):

- Domain: $1.08/month ($13/year ÷ 12)
- Route 53 hosted zone: $0.50/month
- Route 53 health checks: $1/month
- **Total: $2.58/month** ✅

### If Kept Running (Production):

- Domain + Route 53: $2.58/month
- 2 NAT Gateways: $64/month
- 2 ALBs: $32/month
- Data transfer: $5-20/month
- **Total: $103-120/month** ❌

---

## 📚 Reference Documentation

All guides are in `docs/` folder:

1. **DOMAIN_SETUP_ROUTE53.md** - Complete domain registration guide
2. **MULTI_REGION_MANUAL_SETUP.md** - Full infrastructure setup (detailed)
3. **COST_OPTIMIZED_SETUP.md** - Budget-friendly approach

---

## ⏭️ Next: AWS Lifecycle Management

### 1. S3 Lifecycle Policies

- [ ] Create S3 bucket lifecycle configuration
- [ ] Set up transition rules (Standard → IA → Glacier)
- [ ] Configure expiration policies for old data
- [ ] Add intelligent tiering for cost optimization

### 2. EC2 Instance Lifecycle

- [ ] Document EC2 instance states
- [ ] Create auto-scaling lifecycle hooks
- [ ] Set up scheduled start/stop for dev environments

### 3. Lambda Lifecycle

- [ ] Document Lambda execution lifecycle
- [ ] Optimize cold start performance
- [ ] Set up provisioned concurrency

### 4. RDS Lifecycle & Backups

- [ ] Configure automated backup retention
- [ ] Set up manual snapshot lifecycle
- [ ] Create backup restoration procedures

### 5. CloudFormation Stack Lifecycle

- [ ] Create stack creation templates
- [ ] Document update procedures
- [ ] Set up stack deletion policies

### 6. Data Lifecycle Management (DLM)

- [ ] Create EBS snapshot lifecycle policies
- [ ] Set up AMI lifecycle management
- [ ] Configure retention schedules

---

## 🎓 Class Requirements Status

### Module 7 - Networking ✅

- ✅ VPC with public/private subnets
- ✅ Internet Gateway
- ✅ NAT Gateway
- ✅ Security Groups
- ✅ Route Tables
- ✅ Multi-region setup

### Next Modules

- [ ] Module 8 - Lifecycle Management
- [ ] Module 9 - Monitoring & Logging
- [ ] Module 10 - Security & Compliance
- [ ] Final Project Submission

---

## 📝 Quick Notes

- **Domain:** careercopilot.com ($13/year)
- **Strategy:** Setup → Test → Document → Delete expensive parts
- **Monthly cost:** $2.58 (domain + DNS only)
- **Can recreate infrastructure anytime:** Takes 30 min, costs $0.40/hour
- **Multi-region:** Route 53 DNS-based failover (not traditional load balancer)
- **SSL:** Free via AWS Certificate Manager (ACM)
- **Health checks:** Monitor `/health` endpoints every 30 seconds

---

**Last Updated:** November 19, 2025  
**Status:** Ready to deploy careercopilot.com  
**Next Action:** Register domain on Route 53

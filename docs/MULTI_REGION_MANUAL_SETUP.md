# Multi-Region Load Balancer - Manual Setup Guide

Complete step-by-step guide to manually configure multi-region load balancing using AWS Console.

---

## Overview

You'll set up:

- 2 VPCs (us-east-1 and us-west-2)
- 2 Application Load Balancers
- Route 53 for DNS-based traffic routing
- Health checks for failover

**Time Required:** 60-90 minutes

---

## Part 1: Setup VPC in us-east-1 (Primary Region)

### Step 1: Create VPC

1. Go to **AWS Console** → **VPC**
2. Change region to **us-east-1** (top right)
3. Click **Create VPC**
4. Select **VPC and more** (easier option)
5. Configure:
   - **Name:** `career-agent-vpc-east`
   - **IPv4 CIDR:** `10.0.0.0/16`
   - **Availability Zones:** 2
   - **Public subnets:** 2
   - **Private subnets:** 2
   - **NAT gateways:** 1 per AZ (or just 1 to save cost)
   - **VPC endpoints:** None (for now)
6. Click **Create VPC**
7. Wait 3-5 minutes for creation

### Step 2: Verify VPC Components

Check that these were created:

- ✅ VPC
- ✅ 2 Public subnets
- ✅ 2 Private subnets
- ✅ Internet Gateway
- ✅ NAT Gateway(s)
- ✅ Route Tables

---

## Part 2: Setup VPC in us-west-2 (Secondary Region)

### Step 1: Create VPC

1. Change region to **us-west-2** (top right)
2. Click **Create VPC**
3. Select **VPC and more**
4. Configure:
   - **Name:** `career-agent-vpc-west`
   - **IPv4 CIDR:** `10.1.0.0/16` (different from us-east-1)
   - **Availability Zones:** 2
   - **Public subnets:** 2
   - **Private subnets:** 2
   - **NAT gateways:** 1 per AZ (or just 1)
   - **VPC endpoints:** None
5. Click **Create VPC**
6. Wait 3-5 minutes

---

## Part 3: Create Application Load Balancer in us-east-1

### Step 1: Create Target Group

1. Go to **EC2** → **Target Groups** (left menu)
2. Make sure you're in **us-east-1**
3. Click **Create target group**
4. Configure:
   - **Target type:** Instances (or IP addresses if using containers)
   - **Target group name:** `career-agent-tg-east`
   - **Protocol:** HTTP
   - **Port:** 3000 (or your app port)
   - **VPC:** Select `career-agent-vpc-east`
   - **Health check path:** `/health` or `/`
   - **Health check interval:** 30 seconds
5. Click **Next**
6. Skip registering targets for now (we'll add later)
7. Click **Create target group**

### Step 2: Create Application Load Balancer

1. Go to **EC2** → **Load Balancers**
2. Click **Create Load Balancer**
3. Select **Application Load Balancer**
4. Configure:
   - **Name:** `career-agent-alb-east`
   - **Scheme:** Internet-facing
   - **IP address type:** IPv4
   - **VPC:** `career-agent-vpc-east`
   - **Mappings:** Select BOTH public subnets
   - **Security groups:** Create new or select existing
     - Allow inbound: HTTP (80), HTTPS (443)
     - Allow outbound: All traffic

### Step 3: Configure Listeners

1. **Listener 1:**

   - **Protocol:** HTTP
   - **Port:** 80
   - **Default action:** Forward to `career-agent-tg-east`

2. (Optional) **Listener 2:**

   - **Protocol:** HTTPS
   - **Port:** 443
   - **SSL certificate:** Upload or use ACM certificate
   - **Default action:** Forward to `career-agent-tg-east`

3. Click **Create load balancer**
4. Wait 3-5 minutes for provisioning

### Step 4: Note the ALB DNS Name

1. Click on your load balancer
2. Copy the **DNS name** (e.g., `career-agent-alb-east-123456789.us-east-1.elb.amazonaws.com`)
3. Save this - you'll need it for Route 53

---

## Part 4: Create Application Load Balancer in us-west-2

### Step 1: Create Target Group

1. Change region to **us-west-2**
2. Go to **EC2** → **Target Groups**
3. Click **Create target group**
4. Configure:
   - **Target group name:** `career-agent-tg-west`
   - **Protocol:** HTTP
   - **Port:** 3000
   - **VPC:** Select `career-agent-vpc-west`
   - **Health check path:** `/health` or `/`
5. Click **Next** → **Create target group**

### Step 2: Create Application Load Balancer

1. Go to **EC2** → **Load Balancers**
2. Click **Create Load Balancer**
3. Select **Application Load Balancer**
4. Configure:
   - **Name:** `career-agent-alb-west`
   - **Scheme:** Internet-facing
   - **VPC:** `career-agent-vpc-west`
   - **Mappings:** Select BOTH public subnets
   - **Security groups:** Create/select (same rules as us-east-1)
   - **Listener:** HTTP:80 → Forward to `career-agent-tg-west`
5. Click **Create load balancer**

### Step 3: Note the ALB DNS Name

1. Copy the **DNS name** (e.g., `career-agent-alb-west-987654321.us-west-2.elb.amazonaws.com`)
2. Save this for Route 53

---

## Part 5: Setup Route 53 for Multi-Region Routing

### Step 1: Create Hosted Zone

1. Go to **Route 53** → **Hosted zones**
2. Click **Create hosted zone**
3. Configure:
   - **Domain name:** Your domain (e.g., `aicareeragent.com`)
   - **Type:** Public hosted zone
4. Click **Create hosted zone**
5. **Note the 4 nameservers** - you'll need to update these at your domain registrar

### Step 2: Create Health Checks

#### Health Check for us-east-1

1. Go to **Route 53** → **Health checks**
2. Click **Create health check**
3. Configure:
   - **Name:** `career-agent-health-east`
   - **What to monitor:** Endpoint
   - **Protocol:** HTTP or HTTPS
   - **IP address or domain:** Paste your us-east-1 ALB DNS name
   - **Port:** 80 (or 443)
   - **Path:** `/health` or `/`
   - **Request interval:** Standard (30 seconds)
   - **Failure threshold:** 3
4. Click **Create health check**

#### Health Check for us-west-2

1. Click **Create health check**
2. Configure:
   - **Name:** `career-agent-health-west`
   - **Protocol:** HTTP or HTTPS
   - **IP address or domain:** Paste your us-west-2 ALB DNS name
   - **Port:** 80
   - **Path:** `/health` or `/`
   - **Request interval:** Standard (30 seconds)
   - **Failure threshold:** 3
3. Click **Create health check**

### Step 3: Create DNS Records - Failover Routing

#### Primary Record (us-east-1)

1. Go to your **Hosted zone**
2. Click **Create record**
3. Configure:
   - **Record name:** Leave blank (or `www`)
   - **Record type:** A
   - **Routing policy:** Failover
   - Click **Define failover record**
   - **Failover record type:** Primary
   - **Value/Route traffic to:** Alias to Application Load Balancer
   - **Region:** us-east-1
   - **Load balancer:** Select your us-east-1 ALB
   - **Health check:** Select `career-agent-health-east`
   - **Record ID:** `primary-us-east-1`
4. Click **Define failover record**

#### Secondary Record (us-west-2)

1. Click **Add another record**
2. Configure:
   - **Record name:** Same as primary (blank or `www`)
   - **Record type:** A
   - **Routing policy:** Failover
   - Click **Define failover record**
   - **Failover record type:** Secondary
   - **Value/Route traffic to:** Alias to Application Load Balancer
   - **Region:** us-west-2
   - **Load balancer:** Select your us-west-2 ALB
   - **Health check:** Select `career-agent-health-west`
   - **Record ID:** `secondary-us-west-2`
3. Click **Define failover record**
4. Click **Create records**

---

## Part 6: (Optional) Setup Latency-Based Routing

### Step 1: Create Latency Record for us-east-1

1. Click **Create record**
2. Configure:
   - **Record name:** `app` (creates app.yourdomain.com)
   - **Record type:** A
   - **Routing policy:** Latency
   - Click **Define latency record**
   - **Region:** us-east-1
   - **Value/Route traffic to:** Alias to ALB (us-east-1)
   - **Health check:** `career-agent-health-east`
   - **Record ID:** `latency-us-east-1`
3. Click **Define latency record**

### Step 2: Create Latency Record for us-west-2

1. Click **Add another record**
2. Configure:
   - **Record name:** `app`
   - **Record type:** A
   - **Routing policy:** Latency
   - **Region:** us-west-2
   - **Value/Route traffic to:** Alias to ALB (us-west-2)
   - **Health check:** `career-agent-health-west`
   - **Record ID:** `latency-us-west-2`
3. Click **Create records**

---

## Part 7: Deploy Your Application

### Option A: Deploy to EC2 Instances

#### In us-east-1:

1. Launch 2 EC2 instances in private subnets
2. Install your application
3. Register instances with `career-agent-tg-east`

#### In us-west-2:

1. Launch 2 EC2 instances in private subnets
2. Install your application
3. Register instances with `career-agent-tg-west`

### Option B: Deploy to ECS/Fargate

1. Create ECS cluster in each region
2. Create task definitions
3. Create services pointing to target groups

### Option C: Deploy to Lambda (with ALB)

1. Create Lambda functions in each region
2. Add ALB as trigger
3. Configure target groups to point to Lambda

---

## Part 8: Testing

### Test 1: Basic Connectivity

```bash
# Test us-east-1 ALB directly
curl http://career-agent-alb-east-123456789.us-east-1.elb.amazonaws.com

# Test us-west-2 ALB directly
curl http://career-agent-alb-west-987654321.us-west-2.elb.amazonaws.com
```

### Test 2: DNS Resolution

```bash
# Test failover domain
nslookup yourdomain.com

# Test latency-based domain
nslookup app.yourdomain.com
```

### Test 3: Health Checks

1. Go to **Route 53** → **Health checks**
2. Verify both health checks show **Healthy**

### Test 4: Failover

1. Stop all instances in us-east-1 (or disable target group)
2. Wait 2-3 minutes
3. Access your domain - should route to us-west-2
4. Check health check status - us-east-1 should show **Unhealthy**

### Test 5: Latency Routing

1. Use VPN to connect from different locations
2. Access `app.yourdomain.com`
3. Check which region responds (add region identifier in your app)

---

## Part 9: Update Domain Nameservers

### At Your Domain Registrar:

1. Log into your domain registrar (GoDaddy, Namecheap, etc.)
2. Find DNS/Nameserver settings
3. Replace existing nameservers with Route 53 nameservers:
   ```
   ns-1234.awsdns-12.org
   ns-5678.awsdns-34.com
   ns-9012.awsdns-56.net
   ns-3456.awsdns-78.co.uk
   ```
4. Save changes
5. Wait 24-48 hours for DNS propagation (usually faster)

---

## Cost Estimates

### Monthly Costs (Approximate):

- **VPCs:** Free
- **NAT Gateways:** $32/month each × 2 = $64
- **Application Load Balancers:** $16/month each × 2 = $32
- **Route 53 Hosted Zone:** $0.50/month
- **Route 53 Health Checks:** $0.50/month each × 2 = $1
- **Data Transfer:** Variable (depends on traffic)

**Total:** ~$97-100/month (excluding EC2/ECS/data transfer)

### Cost Savings Tips:

- Use 1 NAT Gateway per region instead of per AZ
- Use Network Load Balancer instead of ALB ($10/month vs $16/month)
- Delete resources when not in use
- Use AWS Free Tier where applicable

---

## Troubleshooting

### Issue: Health checks failing

- Verify security groups allow traffic from Route 53 health checkers
- Check that `/health` endpoint exists and returns 200 OK
- Verify ALB target groups have healthy targets

### Issue: DNS not resolving

- Wait for DNS propagation (up to 48 hours)
- Verify nameservers are updated at registrar
- Use `dig` or `nslookup` to check DNS records

### Issue: Failover not working

- Verify health checks are configured correctly
- Check that primary health check is actually failing
- Wait 2-3 minutes for Route 53 to detect failure

### Issue: High costs

- Delete NAT Gateways when not needed
- Use single NAT Gateway per region
- Delete unused load balancers
- Monitor data transfer costs

---

## Next Steps

1. ✅ Complete manual setup
2. [ ] Add SSL/TLS certificates (AWS Certificate Manager)
3. [ ] Configure CloudWatch alarms for health checks
4. [ ] Set up logging (ALB access logs to S3)
5. [ ] Add WAF (Web Application Firewall) for security
6. [ ] Configure auto-scaling for EC2 instances
7. [ ] Set up CI/CD pipeline for deployments

---

## Summary

You now have:

- ✅ Multi-region infrastructure (us-east-1 and us-west-2)
- ✅ Application Load Balancers in both regions
- ✅ Route 53 failover routing
- ✅ Health checks for automatic failover
- ✅ (Optional) Latency-based routing

Your application will automatically failover to us-west-2 if us-east-1 becomes unhealthy!

---

**Created:** November 19, 2025
**Estimated Setup Time:** 60-90 minutes
**Difficulty:** Intermediate

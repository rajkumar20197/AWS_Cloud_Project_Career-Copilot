# Multi-Region Setup - Cost Optimized for Students ($1/month)

Learn multi-region architecture without breaking the bank!

---

## Strategy: Setup → Test → Delete → Keep Documentation

**Total Cost: ~$1/month**

---

## Phase 1: Quick Setup (2 hours)

### Step 1: Create VPCs (FREE - Keep Forever)

#### us-east-1

1. Go to **VPC** → Change region to **us-east-1**
2. **Create VPC** → **VPC and more**
3. Settings:
   - Name: `career-agent-vpc-east`
   - CIDR: `10.0.0.0/16`
   - AZs: 2
   - Public subnets: 2
   - Private subnets: 2
   - NAT gateways: **1** (we'll delete this soon)
   - VPC endpoints: None
4. Create VPC

#### us-west-2

1. Change region to **us-west-2**
2. **Create VPC** → **VPC and more**
3. Settings:
   - Name: `career-agent-vpc-west`
   - CIDR: `10.1.0.0/16`
   - AZs: 2
   - Public subnets: 2
   - Private subnets: 2
   - NAT gateways: **1**
4. Create VPC

**Cost so far: $0** (VPCs are free)

---

### Step 2: Create Load Balancers (Delete After Testing)

#### us-east-1 ALB

1. **EC2** → **Target Groups** → **Create target group**

   - Name: `career-agent-tg-east`
   - Protocol: HTTP, Port: 80
   - VPC: `career-agent-vpc-east`
   - Health check: `/`

2. **Load Balancers** → **Create ALB**

   - Name: `career-agent-alb-east`
   - Internet-facing
   - VPC: `career-agent-vpc-east`
   - Subnets: Both public subnets
   - Security group: Allow HTTP (80)
   - Listener: HTTP:80 → Forward to target group

3. **Copy the ALB DNS name** (save for Route 53)

#### us-west-2 ALB

1. Change to **us-west-2**
2. Repeat same steps:
   - Target group: `career-agent-tg-west`
   - ALB: `career-agent-alb-west`
3. **Copy the ALB DNS name**

**Cost: $0.045/hour × 2 = $0.09/hour** (we'll delete these soon!)

---

### Step 3: Setup Route 53 (Keep Forever - $0.50/month)

#### Create Hosted Zone

1. **Route 53** → **Hosted zones** → **Create**
2. Domain: `yourdomain.com` (or use a free subdomain service)
3. Type: Public
4. **Note the 4 nameservers**

#### Create Health Checks

1. **Health checks** → **Create health check**
2. Health check 1:

   - Name: `health-east`
   - Endpoint: Paste us-east-1 ALB DNS
   - Path: `/`
   - Interval: 30 seconds

3. Health check 2:
   - Name: `health-west`
   - Endpoint: Paste us-west-2 ALB DNS
   - Path: `/`

#### Create Failover Records

1. Go to your hosted zone
2. **Create record**:
   - Type: A
   - Routing: Failover
   - Primary record:
     - Alias to ALB (us-east-1)
     - Health check: `health-east`
     - Record ID: `primary`
3. **Add another record**:

   - Type: A
   - Routing: Failover
   - Secondary record:
     - Alias to ALB (us-west-2)
     - Health check: `health-west`
     - Record ID: `secondary`

4. **Create records**

**Cost: $0.50/month (hosted zone) + $1/month (health checks) = $1.50/month**

---

## Phase 2: Testing & Documentation (30 minutes)

### Test 1: Check Health

1. **Route 53** → **Health checks**
2. Verify both show **Healthy** (may take 2-3 minutes)
3. **📸 SCREENSHOT THIS**

### Test 2: Test Failover

1. Access your domain in browser
2. **📸 SCREENSHOT - Working site**
3. Go to **EC2** → **Target Groups** (us-east-1)
4. Deregister all targets (simulate failure)
5. Wait 2-3 minutes
6. Refresh browser - should still work (now using us-west-2)
7. **📸 SCREENSHOT - Failover working**
8. Check health checks - us-east-1 should be **Unhealthy**
9. **📸 SCREENSHOT THIS**

### Test 3: Check DNS Resolution

```bash
# Windows
nslookup yourdomain.com

# Take screenshot of results
```

### Test 4: Direct ALB Access

```bash
# Test each ALB directly
curl http://[us-east-1-alb-dns-name]
curl http://[us-west-2-alb-dns-name]

# Screenshot the responses
```

### Document Everything

Create a document with:

- Architecture diagram
- All screenshots
- Configuration details
- Test results
- Lessons learned

**Time spent: 2.5 hours**
**Cost so far: ~$0.25**

---

## Phase 3: DELETE EXPENSIVE RESOURCES (Critical!)

### Delete Load Balancers

#### us-east-1

1. **EC2** → **Load Balancers**
2. Select `career-agent-alb-east`
3. **Actions** → **Delete**
4. Confirm deletion

#### us-west-2

1. Change to **us-west-2**
2. Delete `career-agent-alb-west`

**Savings: $32/month**

---

### Delete NAT Gateways

#### us-east-1

1. **VPC** → **NAT Gateways**
2. Select NAT gateway
3. **Actions** → **Delete NAT gateway**
4. Type "delete" to confirm

#### us-west-2

1. Change to **us-west-2**
2. Delete NAT gateway

**Savings: $64/month**

---

### Delete Elastic IPs (Important!)

NAT Gateways create Elastic IPs that keep charging even after NAT deletion!

#### Both Regions

1. **EC2** → **Elastic IPs**
2. Select any unattached IPs
3. **Actions** → **Release Elastic IP addresses**
4. Confirm

**Savings: $3.60/month per unused IP**

---

### What to KEEP (Free or Cheap)

✅ **VPCs** - FREE
✅ **Subnets** - FREE
✅ **Route Tables** - FREE
✅ **Internet Gateways** - FREE
✅ **Security Groups** - FREE
✅ **Route 53 Hosted Zone** - $0.50/month
✅ **Route 53 Health Checks** - $1/month

**Total Monthly Cost: $1.50/month**

---

## Phase 4: When You Need to Demo Again

### Quick Recreation (15 minutes)

1. **Create NAT Gateways** (if you need private subnet internet access)

   - VPC → NAT Gateways → Create
   - Select public subnet
   - Allocate Elastic IP
   - Cost: $0.045/hour

2. **Create ALBs**

   - Use same settings as before
   - Update Route 53 records with new ALB DNS names
   - Cost: $0.0225/hour each

3. **Test for your demo**

4. **DELETE AGAIN** when done

**Demo cost: ~$0.20 per hour**

---

## Alternative: Even Cheaper Setup

### Use CloudFront Instead of ALBs

1. Keep VPCs and Route 53
2. Deploy static site to S3
3. Use CloudFront distributions in multiple regions
4. Point Route 53 to CloudFront

**Cost: $0.50/month** (just Route 53)

### Use EC2 Instances Directly

1. Launch t2.micro in each region (free tier)
2. Assign Elastic IPs
3. Point Route 53 directly to EC2 instances
4. No ALB needed

**Cost: $0.50/month** (just Route 53, EC2 is free tier)

---

## Cost Breakdown Summary

### Full Setup (Running 24/7)

- 2 NAT Gateways: $64/month
- 2 ALBs: $32/month
- Route 53: $1.50/month
- **Total: $97.50/month** ❌

### Student Optimized (Setup → Delete)

- VPCs: $0 (keep)
- Route 53: $1.50/month (keep)
- Testing time (2 hours): $0.20
- **Total: $1.70/month** ✅

### Per Demo Session

- Recreate NAT + ALB: $0.20/hour
- 2-hour demo: $0.40
- Delete after demo
- **Cost per demo: $0.40** ✅

---

## Pro Tips

### 1. Set Billing Alarms

1. **CloudWatch** → **Billing** → **Create alarm**
2. Set threshold: $5
3. Get email if costs exceed $5

### 2. Use AWS Budgets

1. **Billing** → **Budgets** → **Create budget**
2. Set monthly budget: $10
3. Get alerts at 80% and 100%

### 3. Check Costs Daily

1. **Billing Dashboard** → **Bills**
2. Review charges by service
3. Catch any forgotten resources

### 4. Tag Everything

Add tags to all resources:

- Project: career-agent
- Environment: learning
- DeleteAfter: [date]

### 5. Use AWS Cost Explorer

1. **Billing** → **Cost Explorer**
2. View costs by service
3. Identify expensive resources

---

## Deletion Checklist

Before you turn off your PC, verify you deleted:

- [ ] Load Balancer in us-east-1
- [ ] Load Balancer in us-west-2
- [ ] NAT Gateway in us-east-1
- [ ] NAT Gateway in us-west-2
- [ ] Elastic IPs in us-east-1 (check for unattached)
- [ ] Elastic IPs in us-west-2 (check for unattached)
- [ ] Any EC2 instances you created
- [ ] Any RDS databases

Keep these (cheap/free):

- ✅ VPCs
- ✅ Subnets
- ✅ Route 53 Hosted Zone
- ✅ Route 53 Health Checks

---

## What You Learned

✅ Multi-region architecture
✅ VPC networking
✅ Application Load Balancers
✅ Route 53 DNS routing
✅ Failover configuration
✅ Health checks
✅ Cost optimization
✅ AWS resource management

**Total learning cost: ~$2-3 for the entire project!**

---

## Next Time You Need It

1. Recreate NAT Gateways (5 min)
2. Recreate ALBs (10 min)
3. Update Route 53 records (2 min)
4. Test (10 min)
5. Demo/Present
6. Delete everything (5 min)

**Time: 30 minutes**
**Cost: $0.40**

---

**Created:** November 19, 2025
**Strategy:** Learn everything, pay almost nothing
**Perfect for:** Students, learning, class projects

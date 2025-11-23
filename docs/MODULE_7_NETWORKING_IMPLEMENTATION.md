# 🌐 Module 7: VPC & Networking Implementation

## 📚 What You'll Learn

- VPC (Virtual Private Cloud)
- Subnets (Public & Private)
- Internet Gateway & NAT Gateway
- Route Tables
- Security Groups
- Network ACLs
- VPC Endpoints
- CloudFront CDN
- Load Balancing

---

## 🎯 Architecture Overview

```
                    Internet
                       │
                       ▼
              ┌────────────────┐
              │  CloudFront    │ (CDN - Global)
              │   (Optional)   │
              └────────┬───────┘
                       │
              ┌────────▼───────┐
              │ Internet       │
              │ Gateway (IGW)  │
              └────────┬───────┘
                       │
    ┌──────────────────┴──────────────────┐
    │              VPC                     │
    │         (10.0.0.0/16)               │
    │                                      │
    │  ┌────────────────────────────────┐ │
    │  │     Public Subnets             │ │
    │  │  (10.0.1.0/24, 10.0.2.0/24)   │ │
    │  │                                 │ │
    │  │  ┌──────────────────────────┐  │ │
    │  │  │  Load Balancer (ALB)     │  │ │
    │  │  └──────────────────────────┘  │ │
    │  │  ┌──────────────────────────┐  │ │
    │  │  │  NAT Gateway             │  │ │
    │  │  └──────────────────────────┘  │ │
    │  └────────────────────────────────┘ │
    │                │                     │
    │  ┌─────────────▼──────────────────┐ │
    │  │     Private Subnets            │ │
    │  │ (10.0.11.0/24, 10.0.12.0/24)  │ │
    │  │                                 │ │
    │  │  ┌──────────────────────────┐  │ │
    │  │  │  Lambda Functions        │  │ │
    │  │  │  (Backend Logic)         │  │ │
    │  │  └──────────────────────────┘  │ │
    │  └────────────────────────────────┘ │
    │                │                     │
    │  ┌─────────────▼──────────────────┐ │
    │  │     VPC Endpoints              │ │
    │  │  (DynamoDB, S3, Bedrock)       │ │
    │  └────────────────────────────────┘ │
    └──────────────────────────────────────┘
```

---

## 🚀 Step 1: Deploy VPC with CloudFormation

### **Option A: Deploy via AWS Console** (Easiest)

1. **Go to CloudFormation Console:**

   ```
   https://console.aws.amazon.com/cloudformation
   ```

2. **Create Stack:**

   - Click "Create stack" → "With new resources"
   - Choose "Upload a template file"
   - Upload: `infrastructure/vpc-networking-setup.yaml`
   - Click "Next"

3. **Configure Stack:**

   - Stack name: `ai-career-agent-network`
   - ProjectName: `ai-career-agent`
   - Environment: `production`
   - Click "Next"

4. **Review & Create:**

   - Review settings
   - Check "I acknowledge that AWS CloudFormation might create IAM resources"
   - Click "Create stack"

5. **Wait for Completion:**
   - Status will change to "CREATE_COMPLETE" (5-10 minutes)
   - Check "Outputs" tab for resource IDs

### **Option B: Deploy via AWS CLI** (Faster)

```bash
# Deploy the stack
aws cloudformation create-stack \
  --stack-name ai-career-agent-network \
  --template-body file://infrastructure/vpc-networking-setup.yaml \
  --parameters \
    ParameterKey=ProjectName,ParameterValue=ai-career-agent \
    ParameterKey=Environment,ParameterValue=production \
  --capabilities CAPABILITY_IAM \
  --region us-east-1

# Check status
aws cloudformation describe-stacks \
  --stack-name ai-career-agent-network \
  --region us-east-1 \
  --query 'Stacks[0].StackStatus'

# Get outputs
aws cloudformation describe-stacks \
  --stack-name ai-career-agent-network \
  --region us-east-1 \
  --query 'Stacks[0].Outputs'
```

---

## 📊 What Gets Created

### **1. VPC (Virtual Private Cloud)**

- **CIDR:** 10.0.0.0/16
- **Purpose:** Isolated network for your resources
- **Cost:** FREE

### **2. Subnets (4 total)**

- **Public Subnets (2):**
  - 10.0.1.0/24 (AZ 1)
  - 10.0.2.0/24 (AZ 2)
  - For: Load Balancer, NAT Gateway
- **Private Subnets (2):**
  - 10.0.11.0/24 (AZ 1)
  - 10.0.12.0/24 (AZ 2)
  - For: Lambda functions, backend logic

### **3. Internet Gateway**

- **Purpose:** Internet access for public subnets
- **Cost:** FREE

### **4. NAT Gateway**

- **Purpose:** Internet access for private subnets
- **Cost:** ~$32/month + data transfer

### **5. Route Tables (2)**

- **Public Route Table:** Routes to Internet Gateway
- **Private Route Table:** Routes to NAT Gateway

### **6. Security Groups (3)**

- **ALB Security Group:** HTTP/HTTPS from internet
- **Lambda Security Group:** HTTPS from ALB only
- **Database Security Group:** HTTPS from Lambda only

### **7. Network ACLs**

- **Purpose:** Additional firewall layer
- **Rules:** Allow HTTP, HTTPS, ephemeral ports

### **8. VPC Endpoints (2)**

- **DynamoDB Endpoint:** Access DynamoDB without internet
- **S3 Endpoint:** Access S3 without internet
- **Cost:** FREE (Gateway endpoints)

---

## 💰 Cost Breakdown

| Resource         | Cost              | Notes              |
| ---------------- | ----------------- | ------------------ |
| VPC              | FREE              | No charge          |
| Subnets          | FREE              | No charge          |
| Internet Gateway | FREE              | No charge          |
| **NAT Gateway**  | **$32/month**     | Main cost          |
| Data Transfer    | $0.045/GB         | Outbound only      |
| VPC Endpoints    | FREE              | Gateway type       |
| Security Groups  | FREE              | No charge          |
| **Total**        | **~$35-50/month** | Depends on traffic |

### **Cost Optimization:**

- Use VPC Endpoints (saves NAT Gateway data transfer)
- Consider removing NAT Gateway for dev environment
- Use CloudFront to reduce data transfer

---

## 🔒 Security Features

### **Defense in Depth:**

1. **Network ACLs** - Subnet level firewall
2. **Security Groups** - Instance level firewall
3. **Private Subnets** - No direct internet access
4. **VPC Endpoints** - No internet for AWS services
5. **IAM Roles** - Least privilege access

### **Security Groups Rules:**

**ALB Security Group:**

```
Inbound:
- Port 80 (HTTP) from 0.0.0.0/0
- Port 443 (HTTPS) from 0.0.0.0/0

Outbound:
- All traffic to anywhere
```

**Lambda Security Group:**

```
Inbound:
- Port 443 (HTTPS) from ALB Security Group only

Outbound:
- All traffic to anywhere
```

**Database Security Group:**

```
Inbound:
- Port 443 (HTTPS) from Lambda Security Group only

Outbound:
- All traffic to anywhere
```

---

## 🧪 Step 2: Test Your VPC

### **Test 1: Verify VPC Creation**

```bash
# Get VPC ID
aws ec2 describe-vpcs \
  --filters "Name=tag:Name,Values=ai-career-agent-vpc" \
  --query 'Vpcs[0].VpcId' \
  --output text

# Get Subnets
aws ec2 describe-subnets \
  --filters "Name=vpc-id,Values=<VPC-ID>" \
  --query 'Subnets[*].[SubnetId,CidrBlock,Tags[?Key==`Name`].Value|[0]]' \
  --output table
```

### **Test 2: Verify Internet Gateway**

```bash
# Check Internet Gateway
aws ec2 describe-internet-gateways \
  --filters "Name=tag:Name,Values=ai-career-agent-igw" \
  --query 'InternetGateways[0].InternetGatewayId' \
  --output text
```

### **Test 3: Verify NAT Gateway**

```bash
# Check NAT Gateway
aws ec2 describe-nat-gateways \
  --filter "Name=tag:Name,Values=ai-career-agent-nat-gateway" \
  --query 'NatGateways[0].[NatGatewayId,State]' \
  --output table
```

### **Test 4: Verify Security Groups**

```bash
# List Security Groups
aws ec2 describe-security-groups \
  --filters "Name=vpc-id,Values=<VPC-ID>" \
  --query 'SecurityGroups[*].[GroupId,GroupName]' \
  --output table
```

---

## 📈 Step 3: Add CloudFront CDN (Optional)

### **Why CloudFront?**

- **Fast:** Global edge locations
- **Cheap:** Reduces data transfer costs
- **Secure:** DDoS protection, HTTPS
- **Cache:** Reduces backend load

### **Create CloudFront Distribution:**

```bash
# Create distribution (replace with your domain)
aws cloudfront create-distribution \
  --origin-domain-name your-alb-domain.us-east-1.elb.amazonaws.com \
  --default-root-object index.html
```

### **Or use Console:**

1. Go to CloudFront Console
2. Create Distribution
3. Origin: Your ALB or S3 bucket
4. Default Cache Behavior: Redirect HTTP to HTTPS
5. Price Class: Use Only North America and Europe
6. Create Distribution

### **Cost:**

- **Free Tier:** 1 TB data transfer, 10M requests
- **After:** $0.085/GB (North America)
- **Estimated:** $5-10/month

---

## 🎯 Step 4: Document Your Architecture

### **Create Architecture Diagram:**

Save this as `docs/NETWORK_ARCHITECTURE.md`:

```markdown
# Network Architecture

## VPC Configuration

- **VPC CIDR:** 10.0.0.0/16
- **Region:** us-east-1
- **Availability Zones:** 2

## Subnets

### Public Subnets

- Public Subnet 1: 10.0.1.0/24 (us-east-1a)
- Public Subnet 2: 10.0.2.0/24 (us-east-1b)

### Private Subnets

- Private Subnet 1: 10.0.11.0/24 (us-east-1a)
- Private Subnet 2: 10.0.12.0/24 (us-east-1b)

## Routing

- Public subnets → Internet Gateway
- Private subnets → NAT Gateway → Internet Gateway

## Security

- Network ACLs: Stateless firewall
- Security Groups: Stateful firewall
- VPC Endpoints: Private AWS service access

## High Availability

- Multi-AZ deployment
- 2 public subnets
- 2 private subnets
- Load balancer across AZs
```

---

## ✅ Verification Checklist

- [ ] VPC created with correct CIDR
- [ ] 2 public subnets in different AZs
- [ ] 2 private subnets in different AZs
- [ ] Internet Gateway attached
- [ ] NAT Gateway created
- [ ] Route tables configured
- [ ] Security groups created
- [ ] Network ACLs configured
- [ ] VPC Endpoints created
- [ ] CloudFormation stack complete
- [ ] Architecture documented

---

## 🎓 Class Presentation Points

### **What to Highlight:**

1. **VPC Design:**

   - Isolated network
   - CIDR planning
   - Multi-AZ for HA

2. **Security:**

   - Defense in depth
   - Security groups
   - Network ACLs
   - Private subnets

3. **Routing:**

   - Public vs Private
   - Internet Gateway
   - NAT Gateway
   - VPC Endpoints

4. **Cost Optimization:**

   - VPC Endpoints save money
   - CloudFront reduces transfer
   - Right-sized NAT Gateway

5. **High Availability:**
   - Multi-AZ deployment
   - Redundant subnets
   - Load balancing ready

---

## 🚀 Next Steps

### **After VPC Setup:**

1. **Deploy Lambda to VPC** (30 min)

   - Update Lambda configuration
   - Add VPC settings
   - Test connectivity

2. **Add Load Balancer** (30 min)

   - Create Application Load Balancer
   - Configure target groups
   - Add Lambda targets

3. **Add CloudFront** (20 min)

   - Create distribution
   - Configure caching
   - Test performance

4. **Monitor & Optimize** (Ongoing)
   - CloudWatch metrics
   - Cost analysis
   - Performance tuning

---

## 💡 Troubleshooting

### **Issue: Stack creation fails**

```bash
# Check events
aws cloudformation describe-stack-events \
  --stack-name ai-career-agent-network \
  --max-items 10
```

### **Issue: NAT Gateway not working**

```bash
# Check NAT Gateway state
aws ec2 describe-nat-gateways \
  --nat-gateway-ids <NAT-ID>
```

### **Issue: Can't access internet from private subnet**

- Check route table has route to NAT Gateway
- Check NAT Gateway is in public subnet
- Check NAT Gateway has Elastic IP

---

## 📊 Summary

### **What You Implemented:**

- ✅ VPC with proper CIDR
- ✅ Public & Private subnets
- ✅ Internet Gateway
- ✅ NAT Gateway
- ✅ Route Tables
- ✅ Security Groups
- ✅ Network ACLs
- ✅ VPC Endpoints
- ✅ Infrastructure as Code (CloudFormation)

### **Skills Demonstrated:**

- VPC design
- Network security
- High availability
- Cost optimization
- Infrastructure automation
- AWS best practices

### **Cost:**

- **Setup:** FREE
- **Monthly:** $35-50
- **Can optimize:** Use VPC Endpoints, CloudFront

**Module 7 Complete!** 🎉

# AWS VPC and Subnet Configuration Guide

## 📋 Overview

This guide covers setting up a production-ready VPC with public and private subnets for your AI Career Agent platform.

---

## 🏗️ VPC Architecture Design

### Network Layout

```
VPC: 10.0.0.0/16 (65,536 IPs)
├── Availability Zone A (us-east-1a)
│   ├── Public Subnet A:  10.0.1.0/24 (256 IPs)
│   └── Private Subnet A: 10.0.10.0/24 (256 IPs)
│
└── Availability Zone B (us-east-1b)
    ├── Public Subnet B:  10.0.2.0/24 (256 IPs)
    └── Private Subnet B: 10.0.20.0/24 (256 IPs)
```

### Component Placement

**Public Subnets (Internet-facing):**

- Application Load Balancer (ALB)
- NAT Gateways
- Bastion Host (optional)

**Private Subnets (Secure):**

- Lambda Functions
- RDS Database
- ElastiCache (if added)

---

## 📝 Step-by-Step Setup

### Step 1: Create VPC

**AWS Console:**

1. Go to VPC Dashboard → "Create VPC"
2. Select "VPC and more" (recommended)
3. Configure:
   - Name: `ai-career-agent-vpc`
   - IPv4 CIDR: `10.0.0.0/16`
   - IPv6: No IPv6 CIDR block
   - Tenancy: Default
   - Number of AZs: 2
   - Number of public subnets: 2
   - Number of private subnets: 2
   - NAT gateways: 1 per AZ (recommended) or 1 total (cost-saving)
   - VPC endpoints: S3 Gateway (free)
   - DNS hostnames: Enable
   - DNS resolution: Enable

**AWS CLI:**

```bash
# Create VPC
aws ec2 create-vpc \
  --cidr-block 10.0.0.0/16 \
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=ai-career-agent-vpc}]'

# Enable DNS hostnames
aws ec2 modify-vpc-attribute \
  --vpc-id vpc-xxxxx \
  --enable-dns-hostnames
```

**CloudFormation (Recommended):**
See `vpc-cloudformation.yaml` below

---

### Step 2: Create Subnets

**Public Subnet A (us-east-1a):**

```bash
aws ec2 create-subnet \
  --vpc-id vpc-xxxxx \
  --cidr-block 10.0.1.0/24 \
  --availability-zone us-east-1a \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=ai-career-public-subnet-a}]'
```

**Public Subnet B (us-east-1b):**

```bash
aws ec2 create-subnet \
  --vpc-id vpc-xxxxx \
  --cidr-block 10.0.2.0/24 \
  --availability-zone us-east-1b \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=ai-career-public-subnet-b}]'
```

**Private Subnet A (us-east-1a):**

```bash
aws ec2 create-subnet \
  --vpc-id vpc-xxxxx \
  --cidr-block 10.0.10.0/24 \
  --availability-zone us-east-1a \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=ai-career-private-subnet-a}]'
```

**Private Subnet B (us-east-1b):**

```bash
aws ec2 create-subnet \
  --vpc-id vpc-xxxxx \
  --cidr-block 10.0.20.0/24 \
  --availability-zone us-east-1b \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=ai-career-private-subnet-b}]'
```

---

### Step 3: Create Internet Gateway

```bash
# Create Internet Gateway
aws ec2 create-internet-gateway \
  --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=ai-career-igw}]'

# Attach to VPC
aws ec2 attach-internet-gateway \
  --internet-gateway-id igw-xxxxx \
  --vpc-id vpc-xxxxx
```

---

### Step 4: Create NAT Gateways

**NAT Gateway for AZ A:**

```bash
# Allocate Elastic IP
aws ec2 allocate-address --domain vpc

# Create NAT Gateway in Public Subnet A
aws ec2 create-nat-gateway \
  --subnet-id subnet-public-a-xxxxx \
  --allocation-id eipalloc-xxxxx \
  --tag-specifications 'ResourceType=natgateway,Tags=[{Key=Name,Value=ai-career-nat-a}]'
```

**NAT Gateway for AZ B (Optional - Cost Saving):**

```bash
# Allocate Elastic IP
aws ec2 allocate-address --domain vpc

# Create NAT Gateway in Public Subnet B
aws ec2 create-nat-gateway \
  --subnet-id subnet-public-b-xxxxx \
  --allocation-id eipalloc-xxxxx \
  --tag-specifications 'ResourceType=natgateway,Tags=[{Key=Name,Value=ai-career-nat-b}]'
```

**Cost Note:** NAT Gateways cost ~$32/month each. For MVP, use 1 NAT Gateway.

---

### Step 5: Create Route Tables

**Public Route Table:**

```bash
# Create route table
aws ec2 create-route-table \
  --vpc-id vpc-xxxxx \
  --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=ai-career-public-rt}]'

# Add route to Internet Gateway
aws ec2 create-route \
  --route-table-id rtb-public-xxxxx \
  --destination-cidr-block 0.0.0.0/0 \
  --gateway-id igw-xxxxx

# Associate with public subnets
aws ec2 associate-route-table \
  --route-table-id rtb-public-xxxxx \
  --subnet-id subnet-public-a-xxxxx

aws ec2 associate-route-table \
  --route-table-id rtb-public-xxxxx \
  --subnet-id subnet-public-b-xxxxx
```

**Private Route Table A:**

```bash
# Create route table
aws ec2 create-route-table \
  --vpc-id vpc-xxxxx \
  --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=ai-career-private-rt-a}]'

# Add route to NAT Gateway A
aws ec2 create-route \
  --route-table-id rtb-private-a-xxxxx \
  --destination-cidr-block 0.0.0.0/0 \
  --nat-gateway-id nat-xxxxx

# Associate with private subnet A
aws ec2 associate-route-table \
  --route-table-id rtb-private-a-xxxxx \
  --subnet-id subnet-private-a-xxxxx
```

**Private Route Table B:**

```bash
# Create route table
aws ec2 create-route-table \
  --vpc-id vpc-xxxxx \
  --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=ai-career-private-rt-b}]'

# Add route to NAT Gateway B (or A if using single NAT)
aws ec2 create-route \
  --route-table-id rtb-private-b-xxxxx \
  --destination-cidr-block 0.0.0.0/0 \
  --nat-gateway-id nat-xxxxx

# Associate with private subnet B
aws ec2 associate-route-table \
  --route-table-id rtb-private-b-xxxxx \
  --subnet-id subnet-private-b-xxxxx
```

---

### Step 6: Create Security Groups

**ALB Security Group:**

```bash
aws ec2 create-security-group \
  --group-name ai-career-alb-sg \
  --description "Security group for Application Load Balancer" \
  --vpc-id vpc-xxxxx

# Allow HTTP from anywhere
aws ec2 authorize-security-group-ingress \
  --group-id sg-alb-xxxxx \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

# Allow HTTPS from anywhere
aws ec2 authorize-security-group-ingress \
  --group-id sg-alb-xxxxx \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0
```

**Lambda Security Group:**

```bash
aws ec2 create-security-group \
  --group-name ai-career-lambda-sg \
  --description "Security group for Lambda functions" \
  --vpc-id vpc-xxxxx

# Allow all outbound (default)
# No inbound rules needed (Lambda is invoked, not accessed)
```

**RDS Security Group:**

```bash
aws ec2 create-security-group \
  --group-name ai-career-rds-sg \
  --description "Security group for RDS database" \
  --vpc-id vpc-xxxxx

# Allow PostgreSQL from Lambda security group
aws ec2 authorize-security-group-ingress \
  --group-id sg-rds-xxxxx \
  --protocol tcp \
  --port 5432 \
  --source-group sg-lambda-xxxxx
```

---

### Step 7: Create Network ACLs (Optional)

**Public Subnet NACL:**

```bash
# Create NACL
aws ec2 create-network-acl \
  --vpc-id vpc-xxxxx \
  --tag-specifications 'ResourceType=network-acl,Tags=[{Key=Name,Value=ai-career-public-nacl}]'

# Allow inbound HTTP
aws ec2 create-network-acl-entry \
  --network-acl-id acl-xxxxx \
  --rule-number 100 \
  --protocol tcp \
  --port-range From=80,To=80 \
  --cidr-block 0.0.0.0/0 \
  --rule-action allow \
  --ingress

# Allow inbound HTTPS
aws ec2 create-network-acl-entry \
  --network-acl-id acl-xxxxx \
  --rule-number 110 \
  --protocol tcp \
  --port-range From=443,To=443 \
  --cidr-block 0.0.0.0/0 \
  --rule-action allow \
  --ingress

# Allow ephemeral ports (for responses)
aws ec2 create-network-acl-entry \
  --network-acl-id acl-xxxxx \
  --rule-number 120 \
  --protocol tcp \
  --port-range From=1024,To=65535 \
  --cidr-block 0.0.0.0/0 \
  --rule-action allow \
  --ingress

# Allow all outbound
aws ec2 create-network-acl-entry \
  --network-acl-id acl-xxxxx \
  --rule-number 100 \
  --protocol -1 \
  --cidr-block 0.0.0.0/0 \
  --rule-action allow \
  --egress
```

---

## 📄 CloudFormation Template

Save as `infrastructure/vpc-cloudformation.yaml`:

```yaml
AWSTemplateFormatVersion: "2010-09-09"
Description: "VPC with public and private subnets for AI Career Agent"

Parameters:
  EnvironmentName:
    Type: String
    Default: ai-career-agent
    Description: Environment name prefix

Resources:
  # VPC
  VPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.0.0.0/16
      EnableDnsHostnames: true
      EnableDnsSupport: true
      Tags:
        - Key: Name
          Value: !Sub ${EnvironmentName}-vpc

  # Internet Gateway
  InternetGateway:
    Type: AWS::EC2::InternetGateway
    Properties:
      Tags:
        - Key: Name
          Value: !Sub ${EnvironmentName}-igw

  AttachGateway:
    Type: AWS::EC2::VPCGatewayAttachment
    Properties:
      VpcId: !Ref VPC
      InternetGatewayId: !Ref InternetGateway

  # Public Subnets
  PublicSubnetA:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      CidrBlock: 10.0.1.0/24
      AvailabilityZone: !Select [0, !GetAZs ""]
      MapPublicIpOnLaunch: true
      Tags:
        - Key: Name
          Value: !Sub ${EnvironmentName}-public-subnet-a

  PublicSubnetB:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      CidrBlock: 10.0.2.0/24
      AvailabilityZone: !Select [1, !GetAZs ""]
      MapPublicIpOnLaunch: true
      Tags:
        - Key: Name
          Value: !Sub ${EnvironmentName}-public-subnet-b

  # Private Subnets
  PrivateSubnetA:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      CidrBlock: 10.0.10.0/24
      AvailabilityZone: !Select [0, !GetAZs ""]
      Tags:
        - Key: Name
          Value: !Sub ${EnvironmentName}-private-subnet-a

  PrivateSubnetB:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      CidrBlock: 10.0.20.0/24
      AvailabilityZone: !Select [1, !GetAZs ""]
      Tags:
        - Key: Name
          Value: !Sub ${EnvironmentName}-private-subnet-b

  # NAT Gateway A
  NatGatewayAEIP:
    Type: AWS::EC2::EIP
    DependsOn: AttachGateway
    Properties:
      Domain: vpc

  NatGatewayA:
    Type: AWS::EC2::NatGateway
    Properties:
      AllocationId: !GetAtt NatGatewayAEIP.AllocationId
      SubnetId: !Ref PublicSubnetA
      Tags:
        - Key: Name
          Value: !Sub ${EnvironmentName}-nat-a

  # NAT Gateway B (Optional - comment out for cost saving)
  NatGatewayBEIP:
    Type: AWS::EC2::EIP
    DependsOn: AttachGateway
    Properties:
      Domain: vpc

  NatGatewayB:
    Type: AWS::EC2::NatGateway
    Properties:
      AllocationId: !GetAtt NatGatewayBEIP.AllocationId
      SubnetId: !Ref PublicSubnetB
      Tags:
        - Key: Name
          Value: !Sub ${EnvironmentName}-nat-b

  # Public Route Table
  PublicRouteTable:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId: !Ref VPC
      Tags:
        - Key: Name
          Value: !Sub ${EnvironmentName}-public-rt

  PublicRoute:
    Type: AWS::EC2::Route
    DependsOn: AttachGateway
    Properties:
      RouteTableId: !Ref PublicRouteTable
      DestinationCidrBlock: 0.0.0.0/0
      GatewayId: !Ref InternetGateway

  PublicSubnetARouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      SubnetId: !Ref PublicSubnetA
      RouteTableId: !Ref PublicRouteTable

  PublicSubnetBRouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      SubnetId: !Ref PublicSubnetB
      RouteTableId: !Ref PublicRouteTable

  # Private Route Table A
  PrivateRouteTableA:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId: !Ref VPC
      Tags:
        - Key: Name
          Value: !Sub ${EnvironmentName}-private-rt-a

  PrivateRouteA:
    Type: AWS::EC2::Route
    Properties:
      RouteTableId: !Ref PrivateRouteTableA
      DestinationCidrBlock: 0.0.0.0/0
      NatGatewayId: !Ref NatGatewayA

  PrivateSubnetARouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      SubnetId: !Ref PrivateSubnetA
      RouteTableId: !Ref PrivateRouteTableA

  # Private Route Table B
  PrivateRouteTableB:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId: !Ref VPC
      Tags:
        - Key: Name
          Value: !Sub ${EnvironmentName}-private-rt-b

  PrivateRouteB:
    Type: AWS::EC2::Route
    Properties:
      RouteTableId: !Ref PrivateRouteTableB
      DestinationCidrBlock: 0.0.0.0/0
      NatGatewayId: !Ref NatGatewayB # Change to NatGatewayA for single NAT

  PrivateSubnetBRouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      SubnetId: !Ref PrivateSubnetB
      RouteTableId: !Ref PrivateRouteTableB

  # Security Groups
  ALBSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupName: !Sub ${EnvironmentName}-alb-sg
      GroupDescription: Security group for Application Load Balancer
      VpcId: !Ref VPC
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 80
          ToPort: 80
          CidrIp: 0.0.0.0/0
        - IpProtocol: tcp
          FromPort: 443
          ToPort: 443
          CidrIp: 0.0.0.0/0
      Tags:
        - Key: Name
          Value: !Sub ${EnvironmentName}-alb-sg

  LambdaSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupName: !Sub ${EnvironmentName}-lambda-sg
      GroupDescription: Security group for Lambda functions
      VpcId: !Ref VPC
      Tags:
        - Key: Name
          Value: !Sub ${EnvironmentName}-lambda-sg

  RDSSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupName: !Sub ${EnvironmentName}-rds-sg
      GroupDescription: Security group for RDS database
      VpcId: !Ref VPC
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 5432
          ToPort: 5432
          SourceSecurityGroupId: !Ref LambdaSecurityGroup
      Tags:
        - Key: Name
          Value: !Sub ${EnvironmentName}-rds-sg

  # S3 VPC Endpoint (Free)
  S3VPCEndpoint:
    Type: AWS::EC2::VPCEndpoint
    Properties:
      VpcId: !Ref VPC
      ServiceName: !Sub com.amazonaws.${AWS::Region}.s3
      RouteTableIds:
        - !Ref PrivateRouteTableA
        - !Ref PrivateRouteTableB

Outputs:
  VPCId:
    Description: VPC ID
    Value: !Ref VPC
    Export:
      Name: !Sub ${EnvironmentName}-vpc-id

  PublicSubnetA:
    Description: Public Subnet A ID
    Value: !Ref PublicSubnetA
    Export:
      Name: !Sub ${EnvironmentName}-public-subnet-a

  PublicSubnetB:
    Description: Public Subnet B ID
    Value: !Ref PublicSubnetB
    Export:
      Name: !Sub ${EnvironmentName}-public-subnet-b

  PrivateSubnetA:
    Description: Private Subnet A ID
    Value: !Ref PrivateSubnetA
    Export:
      Name: !Sub ${EnvironmentName}-private-subnet-a

  PrivateSubnetB:
    Description: Private Subnet B ID
    Value: !Ref PrivateSubnetB
    Export:
      Name: !Sub ${EnvironmentName}-private-subnet-b

  ALBSecurityGroup:
    Description: ALB Security Group ID
    Value: !Ref ALBSecurityGroup
    Export:
      Name: !Sub ${EnvironmentName}-alb-sg

  LambdaSecurityGroup:
    Description: Lambda Security Group ID
    Value: !Ref LambdaSecurityGroup
    Export:
      Name: !Sub ${EnvironmentName}-lambda-sg

  RDSSecurityGroup:
    Description: RDS Security Group ID
    Value: !Ref RDSSecurityGroup
    Export:
      Name: !Sub ${EnvironmentName}-rds-sg
```

---

## 🚀 Deploy CloudFormation Stack

```bash
# Deploy the stack
aws cloudformation create-stack \
  --stack-name ai-career-agent-vpc \
  --template-body file://infrastructure/vpc-cloudformation.yaml \
  --parameters ParameterKey=EnvironmentName,ParameterValue=ai-career-agent

# Check status
aws cloudformation describe-stacks \
  --stack-name ai-career-agent-vpc \
  --query 'Stacks[0].StackStatus'

# Get outputs
aws cloudformation describe-stacks \
  --stack-name ai-career-agent-vpc \
  --query 'Stacks[0].Outputs'
```

---

## 🔧 Configure Lambda to Use VPC

**Update Lambda Function:**

```bash
aws lambda update-function-configuration \
  --function-name ai-career-agent-api \
  --vpc-config SubnetIds=subnet-private-a-xxxxx,subnet-private-b-xxxxx,SecurityGroupIds=sg-lambda-xxxxx
```

**Note:** Lambda in VPC needs NAT Gateway for internet access (AWS Bedrock, external APIs).

---

## 💰 Cost Breakdown

**Monthly Costs:**

- VPC: Free
- Subnets: Free
- Internet Gateway: Free
- NAT Gateway (1): ~$32/month + data transfer
- NAT Gateway (2): ~$64/month + data transfer
- Elastic IPs (attached): Free
- S3 VPC Endpoint: Free

**Cost Optimization:**

- Use 1 NAT Gateway instead of 2 (saves $32/month)
- Use VPC Endpoints for AWS services (saves data transfer costs)
- Consider NAT Instance instead of NAT Gateway (more management, less cost)

---

## ✅ Verification Checklist

- [ ] VPC created with correct CIDR block
- [ ] 2 public subnets in different AZs
- [ ] 2 private subnets in different AZs
- [ ] Internet Gateway attached to VPC
- [ ] NAT Gateway(s) in public subnet(s)
- [ ] Public route table routes to Internet Gateway
- [ ] Private route tables route to NAT Gateway
- [ ] Security groups configured correctly
- [ ] Lambda functions in private subnets
- [ ] RDS in private subnets
- [ ] ALB in public subnets
- [ ] S3 VPC Endpoint configured

---

## 📊 Architecture Diagram

```
                    Internet
                       |
                       |
                 [Internet Gateway]
                       |
        ┌──────────────┴──────────────┐
        |                             |
   [Public Subnet A]          [Public Subnet B]
   10.0.1.0/24                10.0.2.0/24
        |                             |
   [NAT Gateway A]            [NAT Gateway B]
        |                             |
   [ALB - Port 80/443]                |
        |                             |
        └──────────────┬──────────────┘
                       |
        ┌──────────────┴──────────────┐
        |                             |
   [Private Subnet A]         [Private Subnet B]
   10.0.10.0/24               10.0.20.0/24
        |                             |
   [Lambda Functions]         [Lambda Functions]
        |                             |
        └──────────────┬──────────────┘
                       |
                  [RDS Database]
                  Multi-AZ
```

---

## 🎓 Cloud Computing Course Alignment

**Module 7 - Networking:**

- ✅ VPC creation and configuration
- ✅ Public and private subnets
- ✅ Internet Gateway for public access
- ✅ NAT Gateway for private subnet internet access
- ✅ Route tables and routing
- ✅ Security groups (stateful firewall)
- ✅ Network ACLs (stateless firewall)
- ✅ Multi-AZ deployment for high availability

**Best Practices Demonstrated:**

- Network isolation (public vs private)
- Defense in depth (Security Groups + NACLs)
- High availability (Multi-AZ)
- Least privilege access
- VPC Endpoints for cost optimization

---

## 📝 Next Steps

After VPC setup:

1. Deploy Lambda functions to private subnets
2. Set up Application Load Balancer in public subnets
3. Create RDS database in private subnets
4. Configure security group rules
5. Test connectivity
6. Document architecture

---

## 🔗 Useful Commands

**List VPCs:**

```bash
aws ec2 describe-vpcs --query 'Vpcs[*].[VpcId,CidrBlock,Tags[?Key==`Name`].Value|[0]]' --output table
```

**List Subnets:**

```bash
aws ec2 describe-subnets --filters "Name=vpc-id,Values=vpc-xxxxx" --query 'Subnets[*].[SubnetId,CidrBlock,AvailabilityZone,Tags[?Key==`Name`].Value|[0]]' --output table
```

**List Security Groups:**

```bash
aws ec2 describe-security-groups --filters "Name=vpc-id,Values=vpc-xxxxx" --query 'SecurityGroups[*].[GroupId,GroupName,Description]' --output table
```

**Test Connectivity from Lambda:**

```python
import urllib.request

def lambda_handler(event, context):
    try:
        response = urllib.request.urlopen('https://www.google.com')
        return {'statusCode': 200, 'body': 'Internet access working'}
    except Exception as e:
        return {'statusCode': 500, 'body': f'Error: {str(e)}'}
```

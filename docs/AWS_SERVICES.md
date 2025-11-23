# AWS Services Used in AI Career Agent Project

## 📋 Complete AWS Services Inventory

This document lists all AWS services used in the AI Career Agent platform, organized by category and implementation phase.

---

## 🎯 Project Overview

**Project Name:** AI Career Agent Platform  
**Architecture:** Serverless + Hybrid Cloud  
**Primary Region:** us-east-1  
**Backup Region:** us-west-2 (for disaster recovery)

---

## ✅ Currently Implemented Services

### 1. AWS Bedrock (AI/ML)

**Purpose:** AI-powered career guidance and analysis  
**Model:** Claude 3.5 Haiku  
**Usage:**

- Job compatibility scoring
- Resume analysis and optimization
- Career roadmap generation
- Market intelligence insights
- Interview question generation

**Cost:** ~$20-50/month (1,000 users)  
**Module:** Custom AI Service  
**Status:** ✅ Implemented

---

### 2. AWS Cognito (Authentication)

**Purpose:** User authentication and management  
**Features:**

- User sign up with email verification
- Secure login/logout
- Password management
- Session management
- MFA support (optional)

**Cost:** Free (up to 50,000 MAU)  
**Module:** Module 3 - IAM & Security  
**Status:** ✅ Implemented

---

### 3. AWS Lambda (Compute)

**Purpose:** Serverless backend API  
**Functions:**

- API endpoints for Bedrock integration
- User profile management
- Job data processing
- Resume handling

**Cost:** Free tier (1M requests/month), then $0.20 per 1M requests  
**Module:** Module 8 - Managed Services  
**Status:** ✅ Implemented

---

### 4. Amazon S3 (Storage)

**Purpose:** Object storage for resumes and static assets  
**Buckets:**

- `ai-career-resumes` - Resume storage
- `ai-career-frontend` - Static website hosting
- `ai-career-backups` - Backup storage (cross-region)

**Features:**

- Versioning enabled
- Encryption at rest (AES-256)
- Lifecycle policies
- Cross-region replication

**Cost:** $0.023/GB-month (Standard), $0.004/GB-month (Glacier)  
**Module:** Module 6 - Cloud Storage  
**Status:** ✅ Implemented

---

## 🔄 Planned/Optional Services

### 5. Amazon DynamoDB (Database)

**Purpose:** NoSQL database for user data and job cache  
**Tables:**

- `ai-career-users` - User profiles and preferences
- `ai-career-jobs` - Job listings cache
- `ai-career-applications` - Application tracking
- `ai-career-sessions` - Session data (with TTL)

**Features:**

- Point-in-Time Recovery (PITR)
- Auto-scaling (5-100 capacity units)
- On-demand billing mode
- DynamoDB Streams
- Global tables (optional)

**Cost:** On-demand: $1.25 per million writes, $0.25 per million reads  
**Module:** Module 6 - Databases (NoSQL)  
**Status:** 🟡 Planned (High Priority)

---

### 6. Amazon RDS (Relational Database)

**Purpose:** SQL database for analytics and reporting  
**Engine:** PostgreSQL  
**Features:**

- Multi-AZ deployment
- Automated backups (7 days)
- Read replicas
- Encryption at rest

**Cost:** db.t3.micro: ~$15/month  
**Module:** Module 6 - Databases (SQL)  
**Status:** 🟡 Planned (Medium Priority)

---

### 7. Amazon VPC (Networking)

**Purpose:** Isolated network for secure resource deployment  
**Configuration:**

- CIDR: 10.0.0.0/16
- 2 Availability Zones
- 2 Public subnets (10.0.1.0/24, 10.0.2.0/24)
- 2 Private subnets (10.0.10.0/24, 10.0.20.0/24)
- Internet Gateway
- NAT Gateways (1-2)
- Security Groups
- Network ACLs

**Cost:** NAT Gateway: ~$32/month each  
**Module:** Module 7 - Networking  
**Status:** 🟡 Planned (Course Demo)

---

### 8. Application Load Balancer (ALB)

**Purpose:** Distribute traffic across Lambda functions  
**Features:**

- SSL/TLS termination
- Health checks
- Target groups
- Auto-scaling integration

**Cost:** ~$16/month + data transfer  
**Module:** Module 7 - Load Balancing  
**Status:** 🟡 Planned (Course Demo)

---

### 9. Amazon CloudWatch (Monitoring)

**Purpose:** Monitoring, logging, and observability  
**Components:**

- **Logs:** Lambda, API Gateway, VPC Flow Logs
- **Metrics:** Custom and default metrics
- **Alarms:** Error rate, latency, capacity
- **Dashboards:** Performance visualization
- **Logs Insights:** Log analysis and queries

**Cost:** $0.50/GB ingested, $0.10 per alarm  
**Module:** Module 8 - Monitoring  
**Status:** 🟡 Planned (High Priority)

---

### 10. AWS X-Ray (Distributed Tracing)

**Purpose:** Application performance analysis  
**Features:**

- Request tracing
- Service maps
- Performance bottleneck identification
- Error analysis

**Cost:** $5 per million traces  
**Module:** Module 8 - Monitoring  
**Status:** 🟡 Planned (Medium Priority)

---

### 11. Amazon Route 53 (DNS)

**Purpose:** Domain name system management  
**Features:**

- Domain registration
- DNS routing
- Health checks
- Failover routing
- Geolocation routing

**Cost:** $0.50/month per hosted zone + $0.40 per million queries  
**Module:** Module 7 - Networking  
**Status:** 🟡 Planned (Medium Priority)

---

### 12. Amazon CloudFront (CDN)

**Purpose:** Content delivery network for global distribution  
**Features:**

- Global edge locations (400+)
- SSL/TLS certificates (ACM)
- Cache optimization
- DDoS protection (Shield Standard)
- Custom domain support

**Cost:** Free tier (1 TB, 10M requests), then $0.085/GB  
**Module:** Module 7 - Networking  
**Status:** 🟡 Planned (Medium Priority)

---

### 13. AWS Certificate Manager (ACM)

**Purpose:** SSL/TLS certificate management  
**Features:**

- Free SSL certificates
- Automatic renewal
- Integration with CloudFront and ALB

**Cost:** Free  
**Module:** Module 7 - Security  
**Status:** 🟡 Planned (Medium Priority)

---

### 14. AWS KMS (Key Management Service)

**Purpose:** Encryption key management  
**Features:**

- Customer-managed keys
- Automatic key rotation
- CloudTrail integration
- Fine-grained access control

**Cost:** $1/month per key + $0.03 per 10,000 requests  
**Module:** Module 7 - Security  
**Status:** 🟡 Planned (Optional)

---

### 15. AWS Secrets Manager

**Purpose:** Secure storage for API keys and credentials  
**Secrets:**

- AWS Bedrock API keys
- Database credentials
- Third-party API keys (Stripe, RapidAPI)

**Cost:** $0.40 per secret per month + $0.05 per 10,000 API calls  
**Module:** Module 7 - Security  
**Status:** 🟡 Planned (High Priority)

---

### 16. AWS CloudTrail (Auditing)

**Purpose:** API call logging and compliance  
**Features:**

- Multi-region trail
- Log file validation
- S3 integration
- CloudWatch Logs integration
- Event history (90 days free)

**Cost:** First trail free, additional trails $2 per 100,000 events  
**Module:** Module 7 - Security  
**Status:** 🟡 Planned (High Priority)

---

### 17. VPC Flow Logs

**Purpose:** Network traffic monitoring  
**Features:**

- Traffic analysis
- Security monitoring
- Troubleshooting
- Compliance auditing

**Cost:** $0.50/GB ingested  
**Module:** Module 7 - Networking  
**Status:** 🟡 Planned (Medium Priority)

---

### 18. AWS Shield (DDoS Protection)

**Purpose:** DDoS attack protection  
**Tiers:**

- **Shield Standard:** Free, automatic protection
- **Shield Advanced:** $3,000/month, enhanced protection

**Cost:** Standard: Free, Advanced: $3,000/month  
**Module:** Module 7 - Security  
**Status:** ✅ Shield Standard (Automatic)

---

### 19. Amazon GuardDuty (Threat Detection)

**Purpose:** Intelligent threat detection  
**Features:**

- Continuous monitoring
- Machine learning detection
- Threat intelligence feeds
- Automated alerts

**Cost:** ~$5-10/month (30-day free trial)  
**Module:** Module 7 - Security  
**Status:** 🟡 Planned (Medium Priority)

---

### 20. AWS Trusted Advisor

**Purpose:** Best practices recommendations  
**Categories:**

- Cost optimization
- Performance
- Security
- Fault tolerance
- Service limits

**Cost:** Free tier (basic checks), Business/Enterprise support for all checks  
**Module:** Module 9 - Architecture  
**Status:** ✅ Free Tier Available

---

### 21. AWS Backup

**Purpose:** Centralized backup management  
**Features:**

- Automated backup schedules
- Lifecycle policies
- Cross-region backup
- Backup vault

**Cost:** $0.05/GB-month + restore costs  
**Module:** Module 9 - Disaster Recovery  
**Status:** 🟡 Planned (Medium Priority)

---

### 22. AWS CloudFormation (IaC)

**Purpose:** Infrastructure as Code deployment  
**Templates:**

- VPC and networking
- DynamoDB tables
- Lambda functions
- Monitoring and alarms
- Security services

**Cost:** Free (pay for resources created)  
**Module:** Module 5 - Infrastructure as Code  
**Status:** 🟡 Templates Ready

---

### 23. Amazon SNS (Notifications)

**Purpose:** Alert notifications  
**Topics:**

- High error rate alerts
- Security alerts
- Backup completion
- GuardDuty findings

**Cost:** $0.50 per million requests + $0.06 per 100,000 email notifications  
**Module:** Module 8 - Monitoring  
**Status:** 🟡 Planned (High Priority)

---

### 24. Amazon EventBridge

**Purpose:** Event-driven automation  
**Rules:**

- GuardDuty findings → SNS
- CloudWatch alarms → Lambda
- Scheduled events (cron jobs)

**Cost:** Free for AWS service events, $1 per million custom events  
**Module:** Module 8 - Automation  
**Status:** 🟡 Planned (Medium Priority)

---

### 25. AWS API Gateway

**Purpose:** REST API management  
**Features:**

- Request throttling
- API keys
- Usage plans
- CORS configuration
- Lambda integration

**Cost:** $3.50 per million requests  
**Module:** Module 7 - Networking  
**Status:** 🟡 Planned (Optional - can use Lambda Function URLs)

---

## 📊 Services by Implementation Phase

### Phase 1: MVP (Launch) - Essential Services

**Must Have:**

1. ✅ AWS Bedrock (AI)
2. ✅ AWS Cognito (Auth)
3. ✅ AWS Lambda (Compute)
4. ✅ Amazon S3 (Storage)
5. 🟡 Amazon DynamoDB (Database)
6. 🟡 CloudWatch Logs (Basic monitoring)
7. 🟡 CloudTrail (Auditing)
8. ✅ AWS Shield Standard (DDoS)

**Estimated Cost:** $30-50/month

---

### Phase 2: Production - Enhanced Services

**Recommended:**

1. Amazon RDS (Analytics)
2. CloudWatch Dashboards & Alarms
3. Route 53 (Custom domain)
4. CloudFront (CDN)
5. AWS Secrets Manager
6. GuardDuty (Threat detection)
7. AWS Backup
8. SNS (Notifications)

**Estimated Cost:** $80-120/month

---

### Phase 3: Enterprise - Advanced Services

**Advanced:**

1. VPC with private subnets
2. Application Load Balancer
3. Multi-AZ RDS
4. VPC Flow Logs
5. AWS KMS (Customer-managed keys)
6. X-Ray (Distributed tracing)
7. EventBridge (Automation)
8. Cross-region replication

**Estimated Cost:** $200-300/month

---

## 🎓 Services by Course Module

### Module 3: Cloud Computing & IAM

- ✅ AWS Cognito
- 🟡 IAM Roles and Policies
- 🟡 AWS Secrets Manager

### Module 5: Infrastructure as Code

- 🟡 AWS CloudFormation
- 🟡 Terraform (optional)

### Module 6: Cloud Storage & Databases

- ✅ Amazon S3
- 🟡 Amazon DynamoDB
- 🟡 Amazon RDS
- 🟡 S3 Lifecycle Policies
- 🟡 DynamoDB TTL

### Module 7: Networking & Security

- 🟡 Amazon VPC
- 🟡 Application Load Balancer
- 🟡 Route 53
- 🟡 CloudFront
- 🟡 VPC Flow Logs
- 🟡 AWS Shield
- 🟡 GuardDuty
- 🟡 CloudTrail
- 🟡 AWS KMS
- 🟡 Security Groups & NACLs

### Module 8: Cloud Monitoring

- 🟡 Amazon CloudWatch
- 🟡 AWS X-Ray
- 🟡 CloudWatch Logs Insights
- 🟡 SNS
- 🟡 EventBridge

### Module 9: Cloud Architecture & DR

- 🟡 AWS Backup
- 🟡 DynamoDB PITR
- 🟡 RDS Snapshots
- 🟡 S3 Versioning
- 🟡 Cross-region Replication
- ✅ AWS Trusted Advisor

---

## 💰 Cost Summary

### MVP (1,000 users)

| Service     | Monthly Cost |
| ----------- | ------------ |
| AWS Bedrock | $20-50       |
| Lambda      | $5           |
| DynamoDB    | $1-2         |
| S3          | $1-2         |
| Cognito     | Free         |
| CloudWatch  | $5           |
| CloudTrail  | Free         |
| **Total**   | **$32-64**   |

---

### Production (10,000 users)

| Service     | Monthly Cost |
| ----------- | ------------ |
| AWS Bedrock | $100-200     |
| Lambda      | $20-30       |
| DynamoDB    | $10-15       |
| RDS         | $15-30       |
| S3          | $5-10        |
| CloudFront  | $10-20       |
| Route 53    | $1-2         |
| CloudWatch  | $10-20       |
| GuardDuty   | $10-15       |
| Backup      | $5-10        |
| **Total**   | **$186-352** |

---

### Enterprise (100,000 users)

| Service           | Monthly Cost   |
| ----------------- | -------------- |
| AWS Bedrock       | $500-1000      |
| Lambda            | $100-200       |
| DynamoDB          | $50-100        |
| RDS               | $100-200       |
| S3                | $20-50         |
| CloudFront        | $50-100        |
| VPC (NAT Gateway) | $64            |
| ALB               | $16-30         |
| Route 53          | $2-5           |
| CloudWatch        | $30-50         |
| GuardDuty         | $20-40         |
| Backup            | $20-40         |
| KMS               | $2-5           |
| **Total**         | **$974-1,884** |

---

## 🔗 Service Dependencies

### Critical Path (MVP)

```
User → Cognito → Lambda → Bedrock
                    ↓
                DynamoDB
                    ↓
                   S3
```

### Production Architecture

```
User → Route 53 → CloudFront → ALB → Lambda → Bedrock
                                        ↓
                                    DynamoDB
                                        ↓
                                      RDS
                                        ↓
                                       S3
                                        ↓
                                  CloudWatch
```

### Monitoring & Security Layer

```
All Services → CloudWatch → SNS → Alerts
              CloudTrail → S3 → Analysis
              GuardDuty → EventBridge → Response
              VPC Flow Logs → CloudWatch Logs Insights
```

---

## 📈 Service Scaling Strategy

### Auto-Scaling Services (Automatic)

- ✅ AWS Lambda (1-1000 concurrent executions)
- ✅ Amazon S3 (unlimited storage)
- ✅ AWS Bedrock (managed scaling)
- ✅ CloudFront (global edge locations)

### Manual Scaling Required

- 🟡 DynamoDB (configure auto-scaling 5-100 capacity)
- 🟡 RDS (vertical scaling, read replicas)
- 🟡 NAT Gateway (add more for higher throughput)

### No Scaling Needed

- ✅ Cognito (managed service)
- ✅ Route 53 (managed service)
- ✅ CloudWatch (managed service)

---

## 🔒 Security Services Summary

| Service             | Purpose            | Cost         | Priority |
| ------------------- | ------------------ | ------------ | -------- |
| **Cognito**         | Authentication     | Free         | High     |
| **KMS**             | Encryption keys    | $1/month     | Medium   |
| **Secrets Manager** | API keys           | $0.40/secret | High     |
| **CloudTrail**      | API auditing       | Free         | High     |
| **Shield Standard** | DDoS protection    | Free         | High     |
| **GuardDuty**       | Threat detection   | $10/month    | Medium   |
| **VPC Flow Logs**   | Network monitoring | $0.50/GB     | Medium   |
| **Security Groups** | Firewall           | Free         | High     |
| **ACM**             | SSL certificates   | Free         | High     |

---

## 📝 Service Selection Rationale

### Why Serverless (Lambda)?

- ✅ No server management
- ✅ Auto-scaling
- ✅ Pay per use
- ✅ High availability
- ✅ Fast deployment

### Why DynamoDB over RDS only?

- ✅ Faster for key-value lookups
- ✅ Better for session data
- ✅ Auto-scaling
- ✅ Lower cost for read-heavy workloads
- ✅ Global tables for multi-region

### Why Hybrid (DynamoDB + RDS)?

- ✅ DynamoDB: Fast access (users, jobs, sessions)
- ✅ RDS: Complex queries (analytics, reporting)
- ✅ Best of both worlds

### Why CloudFront?

- ✅ Global performance
- ✅ Free SSL certificates
- ✅ DDoS protection
- ✅ Cache optimization
- ✅ Cost-effective

---

## 🎯 Next Steps

### Immediate (MVP Launch)

1. Set up DynamoDB tables
2. Configure CloudWatch basic monitoring
3. Enable CloudTrail
4. Implement Secrets Manager

### Short-term (Post-Launch)

1. Add Route 53 custom domain
2. Deploy CloudFront CDN
3. Enable GuardDuty
4. Set up CloudWatch Dashboards

### Long-term (Scale)

1. Implement VPC architecture
2. Add Application Load Balancer
3. Deploy RDS for analytics
4. Enable advanced monitoring

---

## 📚 Additional Resources

**AWS Documentation:**

- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [AWS Serverless Application Lens](https://docs.aws.amazon.com/wellarchitected/latest/serverless-applications-lens/welcome.html)
- [AWS Security Best Practices](https://aws.amazon.com/architecture/security-identity-compliance/)

**Cost Optimization:**

- [AWS Cost Explorer](https://aws.amazon.com/aws-cost-management/aws-cost-explorer/)
- [AWS Pricing Calculator](https://calculator.aws/)
- [AWS Free Tier](https://aws.amazon.com/free/)

**Training:**

- [AWS Academy Cloud Foundations](https://aws.amazon.com/training/awsacademy/)
- [AWS Certified Cloud Practitioner](https://aws.amazon.com/certification/certified-cloud-practitioner/)
- [AWS Certified Solutions Architect](https://aws.amazon.com/certification/certified-solutions-architect-associate/)

---

**Last Updated:** November 15, 2024  
**Project Status:** 60% Complete  
**Total AWS Services:** 25 services  
**Implemented:** 4 services  
**Planned:** 21 services

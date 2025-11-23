# AWS Lifecycle Management & Auto Scaling Guide

## 📋 Overview

Complete guide for implementing lifecycle management and auto-scaling for cost optimization and performance.

**For Course:**

- Module 6: Cloud Storage (Lifecycle Management)
- Module 7: Load Balancing and Scaling (Auto Scaling)

---

## 🔄 Lifecycle Management

### What is Lifecycle Management?

Automatically transition data between storage classes to optimize costs based on access patterns.

**Benefits:**

- Reduce storage costs by 70-90%
- Automate data archival
- Compliance with retention policies
- No manual intervention needed

---

## 📦 S3 Lifecycle Policies

### Storage Classes Comparison

| Storage Class               | Use Case                 | Cost                             | Retrieval Time | Availability |
| --------------------------- | ------------------------ | -------------------------------- | -------------- | ------------ |
| **S3 Standard**             | Frequently accessed      | $0.023/GB                        | Instant        | 99.99%       |
| **S3 Intelligent-Tiering**  | Unknown patterns         | $0.023/GB + $0.0025/1000 objects | Instant        | 99.9%        |
| **S3 Standard-IA**          | Infrequent access        | $0.0125/GB                       | Instant        | 99.9%        |
| **S3 One Zone-IA**          | Infrequent, non-critical | $0.01/GB                         | Instant        | 99.5%        |
| **S3 Glacier Instant**      | Archive, instant access  | $0.004/GB                        | Instant        | 99.9%        |
| **S3 Glacier Flexible**     | Archive, 1-5 min         | $0.0036/GB                       | 1-5 min        | 99.99%       |
| **S3 Glacier Deep Archive** | Long-term archive        | $0.00099/GB                      | 12 hours       | 99.99%       |

---

### Lifecycle Policy for Resume Storage

**Strategy for AI Career Agent:**

```
Day 0-30:    S3 Standard (frequent access)
Day 31-90:   S3 Standard-IA (occasional access)
Day 91-365:  S3 Glacier Flexible (archive)
Day 365+:    S3 Glacier Deep Archive (long-term)
```

**Cost Savings:**

- Standard: $0.023/GB × 100 GB = $2.30/month
- With lifecycle: $0.50/month (78% savings)

---

### Implementation

**AWS Console:**

1. Go to S3 → Select bucket → Management → Lifecycle rules
2. Create rule: "Archive old resumes"
3. Configure transitions

**AWS CLI:**

```bash
# Create lifecycle configuration
aws s3api put-bucket-lifecycle-configuration \
  --bucket ai-career-resumes \
  --lifecycle-configuration '{
    "Rules": [
      {
        "Id": "ArchiveResumes",
        "Status": "Enabled",
        "Filter": {
          "Prefix": ""
        },
        "Transitions": [
          {
            "Days": 30,
            "StorageClass": "STANDARD_IA"
          },
          {
            "Days": 90,
            "StorageClass": "GLACIER"
          },
          {
            "Days": 365,
            "StorageClass": "DEEP_ARCHIVE"
          }
        ],
        "NoncurrentVersionTransitions": [
          {
            "NoncurrentDays": 30,
            "StorageClass": "GLACIER"
          }
        ],
        "NoncurrentVersionExpiration": {
          "NoncurrentDays": 90
        }
      }
    ]
  }'
```

**CloudFormation:**

```yaml
ResumesBucket:
  Type: AWS::S3::Bucket
  Properties:
    BucketName: ai-career-resumes
    LifecycleConfiguration:
      Rules:
        - Id: ArchiveResumes
          Status: Enabled
          Transitions:
            - TransitionInDays: 30
              StorageClass: STANDARD_IA
            - TransitionInDays: 90
              StorageClass: GLACIER
            - TransitionInDays: 365
              StorageClass: DEEP_ARCHIVE
          NoncurrentVersionTransitions:
            - TransitionInDays: 30
              StorageClass: GLACIER
          NoncurrentVersionExpiration:
            NoncurrentDays: 90
```

---

### S3 Intelligent-Tiering

**Automatic optimization without lifecycle rules**

**Enable Intelligent-Tiering:**

```bash
# Set default storage class
aws s3api put-bucket-intelligent-tiering-configuration \
  --bucket ai-career-resumes \
  --id EntireBucket \
  --intelligent-tiering-configuration '{
    "Id": "EntireBucket",
    "Status": "Enabled",
    "Tierings": [
      {
        "Days": 90,
        "AccessTier": "ARCHIVE_ACCESS"
      },
      {
        "Days": 180,
        "AccessTier": "DEEP_ARCHIVE_ACCESS"
      }
    ]
  }'
```

**How it works:**

- Monitors access patterns
- Moves objects automatically
- No retrieval fees
- Small monitoring fee: $0.0025 per 1,000 objects

---

## 🗄️ DynamoDB Lifecycle Management

### Time-to-Live (TTL)

**Automatically delete expired items**

**Use Cases:**

- Session data (expire after 24 hours)
- Temporary job cache (expire after 7 days)
- Old application records (expire after 1 year)

**Enable TTL:**

```bash
# Enable TTL on DynamoDB table
aws dynamodb update-time-to-live \
  --table-name ai-career-sessions \
  --time-to-live-specification \
    Enabled=true,AttributeName=expirationTime
```

**Example Item:**

```json
{
  "userId": "user123",
  "sessionId": "sess456",
  "data": "...",
  "expirationTime": 1700000000
}
```

**CloudFormation:**

```yaml
SessionsTable:
  Type: AWS::DynamoDB::Table
  Properties:
    TableName: ai-career-sessions
    TimeToLiveSpecification:
      Enabled: true
      AttributeName: expirationTime
```

---

### DynamoDB On-Demand vs Provisioned

**Capacity Modes:**

| Mode            | Best For              | Cost             | Scaling     |
| --------------- | --------------------- | ---------------- | ----------- |
| **On-Demand**   | Unpredictable traffic | Pay per request  | Automatic   |
| **Provisioned** | Predictable traffic   | Pay for capacity | Manual/Auto |

**Switch to On-Demand:**

```bash
# Switch to on-demand
aws dynamodb update-table \
  --table-name ai-career-users \
  --billing-mode PAY_PER_REQUEST
```

**Cost Comparison (10,000 users):**

- On-Demand: ~$1.25/month (100K reads, 10K writes)
- Provisioned: ~$0.65/month (5 RCU, 1 WCU)

**Recommendation:** Start with On-Demand, switch to Provisioned when traffic is predictable

---

## 📈 Auto Scaling

### What is Auto Scaling?

Automatically adjust compute capacity based on demand.

**Benefits:**

- Handle traffic spikes
- Reduce costs during low traffic
- Improve availability
- No manual intervention

---

## ⚡ Lambda Auto Scaling

**Lambda scales automatically!**

**Configuration:**

- Concurrent executions: 1-1000 (default)
- Reserved concurrency: Guarantee capacity
- Provisioned concurrency: Pre-warmed instances

**Set Reserved Concurrency:**

```bash
# Reserve 100 concurrent executions
aws lambda put-function-concurrency \
  --function-name ai-career-api \
  --reserved-concurrent-executions 100
```

**Set Provisioned Concurrency:**

```bash
# Pre-warm 10 instances
aws lambda put-provisioned-concurrency-config \
  --function-name ai-career-api \
  --provisioned-concurrent-executions 10 \
  --qualifier $LATEST
```

**Cost:**

- Reserved: Free (just limits)
- Provisioned: $0.0000041667 per GB-second

---

## 🔄 DynamoDB Auto Scaling

**Automatically adjust read/write capacity**

**Enable Auto Scaling:**

```bash
# Register scalable target
aws application-autoscaling register-scalable-target \
  --service-namespace dynamodb \
  --resource-id table/ai-career-users \
  --scalable-dimension dynamodb:table:ReadCapacityUnits \
  --min-capacity 5 \
  --max-capacity 100

# Create scaling policy
aws application-autoscaling put-scaling-policy \
  --service-namespace dynamodb \
  --resource-id table/ai-career-users \
  --scalable-dimension dynamodb:table:ReadCapacityUnits \
  --policy-name ai-career-read-scaling \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration '{
    "TargetValue": 70.0,
    "PredefinedMetricSpecification": {
      "PredefinedMetricType": "DynamoDBReadCapacityUtilization"
    }
  }'
```

**CloudFormation:**

```yaml
UsersTableReadScaling:
  Type: AWS::ApplicationAutoScaling::ScalableTarget
  Properties:
    ServiceNamespace: dynamodb
    ResourceId: table/ai-career-users
    ScalableDimension: dynamodb:table:ReadCapacityUnits
    MinCapacity: 5
    MaxCapacity: 100

UsersTableReadScalingPolicy:
  Type: AWS::ApplicationAutoScaling::ScalingPolicy
  Properties:
    PolicyName: ReadAutoScalingPolicy
    PolicyType: TargetTrackingScaling
    ScalingTargetId: !Ref UsersTableReadScaling
    TargetTrackingScalingPolicyConfiguration:
      TargetValue: 70.0
      PredefinedMetricSpecification:
        PredefinedMetricType: DynamoDBReadCapacityUtilization
```

---

## 🌐 Application Load Balancer Auto Scaling

**Scale Lambda targets behind ALB**

**Target Tracking Policies:**

- CPU utilization
- Request count per target
- Network traffic

**Create Auto Scaling Group (if using EC2):**

```bash
# Create launch template
aws ec2 create-launch-template \
  --launch-template-name ai-career-template \
  --version-description "v1" \
  --launch-template-data '{
    "ImageId": "ami-xxxxx",
    "InstanceType": "t3.micro",
    "SecurityGroupIds": ["sg-xxxxx"],
    "UserData": "..."
  }'

# Create auto scaling group
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name ai-career-asg \
  --launch-template LaunchTemplateName=ai-career-template \
  --min-size 2 \
  --max-size 10 \
  --desired-capacity 2 \
  --vpc-zone-identifier "subnet-xxxxx,subnet-yyyyy" \
  --target-group-arns arn:aws:elasticloadbalancing:...

# Create scaling policy
aws autoscaling put-scaling-policy \
  --auto-scaling-group-name ai-career-asg \
  --policy-name cpu-scaling \
  --policy-type TargetTrackingScaling \
  --target-tracking-configuration '{
    "PredefinedMetricSpecification": {
      "PredefinedMetricType": "ASGAverageCPUUtilization"
    },
    "TargetValue": 70.0
  }'
```

---

## 📊 Complete Auto Scaling Architecture

```yaml
AWSTemplateFormatVersion: "2010-09-09"
Description: "Auto Scaling Configuration for AI Career Agent"

Resources:
  # DynamoDB Auto Scaling
  UsersTableReadScaling:
    Type: AWS::ApplicationAutoScaling::ScalableTarget
    Properties:
      ServiceNamespace: dynamodb
      ResourceId: !Sub "table/${UsersTable}"
      ScalableDimension: dynamodb:table:ReadCapacityUnits
      MinCapacity: 5
      MaxCapacity: 100
      RoleARN: !GetAtt ScalingRole.Arn

  UsersTableReadScalingPolicy:
    Type: AWS::ApplicationAutoScaling::ScalingPolicy
    Properties:
      PolicyName: ReadAutoScalingPolicy
      PolicyType: TargetTrackingScaling
      ScalingTargetId: !Ref UsersTableReadScaling
      TargetTrackingScalingPolicyConfiguration:
        TargetValue: 70.0
        PredefinedMetricSpecification:
          PredefinedMetricType: DynamoDBReadCapacityUtilization
        ScaleInCooldown: 60
        ScaleOutCooldown: 60

  UsersTableWriteScaling:
    Type: AWS::ApplicationAutoScaling::ScalableTarget
    Properties:
      ServiceNamespace: dynamodb
      ResourceId: !Sub "table/${UsersTable}"
      ScalableDimension: dynamodb:table:WriteCapacityUnits
      MinCapacity: 5
      MaxCapacity: 100
      RoleARN: !GetAtt ScalingRole.Arn

  UsersTableWriteScalingPolicy:
    Type: AWS::ApplicationAutoScaling::ScalingPolicy
    Properties:
      PolicyName: WriteAutoScalingPolicy
      PolicyType: TargetTrackingScaling
      ScalingTargetId: !Ref UsersTableWriteScaling
      TargetTrackingScalingPolicyConfiguration:
        TargetValue: 70.0
        PredefinedMetricSpecification:
          PredefinedMetricType: DynamoDBWriteCapacityUtilization
        ScaleInCooldown: 60
        ScaleOutCooldown: 60

  # Lambda Provisioned Concurrency Auto Scaling
  LambdaScalingTarget:
    Type: AWS::ApplicationAutoScaling::ScalableTarget
    Properties:
      ServiceNamespace: lambda
      ResourceId: !Sub "function:${LambdaFunction}:provisioned-concurrency"
      ScalableDimension: lambda:function:ProvisionedConcurrentExecutions
      MinCapacity: 1
      MaxCapacity: 10
      RoleARN: !GetAtt ScalingRole.Arn

  LambdaScalingPolicy:
    Type: AWS::ApplicationAutoScaling::ScalingPolicy
    Properties:
      PolicyName: LambdaScalingPolicy
      PolicyType: TargetTrackingScaling
      ScalingTargetId: !Ref LambdaScalingTarget
      TargetTrackingScalingPolicyConfiguration:
        TargetValue: 0.70
        PredefinedMetricSpecification:
          PredefinedMetricType: LambdaProvisionedConcurrencyUtilization

  # IAM Role for Auto Scaling
  ScalingRole:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Version: "2012-10-17"
        Statement:
          - Effect: Allow
            Principal:
              Service:
                - application-autoscaling.amazonaws.com
            Action: sts:AssumeRole
      ManagedPolicyArns:
        - arn:aws:iam::aws:policy/service-role/DynamoDBAutoscalingRole
        - arn:aws:iam::aws:policy/service-role/AWSLambdaRole

  # CloudWatch Alarms
  HighReadCapacityAlarm:
    Type: AWS::CloudWatch::Alarm
    Properties:
      AlarmName: ai-career-high-read-capacity
      AlarmDescription: Alert when read capacity is high
      MetricName: ConsumedReadCapacityUnits
      Namespace: AWS/DynamoDB
      Statistic: Sum
      Period: 300
      EvaluationPeriods: 2
      Threshold: 240
      ComparisonOperator: GreaterThanThreshold
      Dimensions:
        - Name: TableName
          Value: !Ref UsersTable

  HighWriteCapacityAlarm:
    Type: AWS::CloudWatch::Alarm
    Properties:
      AlarmName: ai-career-high-write-capacity
      AlarmDescription: Alert when write capacity is high
      MetricName: ConsumedWriteCapacityUnits
      Namespace: AWS/DynamoDB
      Statistic: Sum
      Period: 300
      EvaluationPeriods: 2
      Threshold: 240
      ComparisonOperator: GreaterThanThreshold
      Dimensions:
        - Name: TableName
          Value: !Ref UsersTable
```

---

## 💰 Cost Optimization with Lifecycle & Auto Scaling

### Scenario 1: MVP (1,000 users)

**Without Optimization:**

- S3 Standard: 10 GB × $0.023 = $0.23/month
- DynamoDB On-Demand: $1.25/month
- Lambda: $5/month
- **Total: $6.48/month**

**With Optimization:**

- S3 Lifecycle: 10 GB × $0.005 = $0.05/month (78% savings)
- DynamoDB On-Demand: $1.25/month (same)
- Lambda: $5/month (same)
- **Total: $6.30/month (3% savings)**

---

### Scenario 2: Production (10,000 users)

**Without Optimization:**

- S3 Standard: 100 GB × $0.023 = $2.30/month
- DynamoDB Provisioned: $12/month
- Lambda: $50/month
- **Total: $64.30/month**

**With Optimization:**

- S3 Lifecycle: 100 GB × $0.005 = $0.50/month (78% savings)
- DynamoDB Auto Scaling: $8/month (33% savings)
- Lambda Reserved: $40/month (20% savings)
- **Total: $48.50/month (25% savings)**

---

### Scenario 3: Enterprise (100,000 users)

**Without Optimization:**

- S3 Standard: 1 TB × $0.023 = $23/month
- DynamoDB Provisioned: $120/month
- Lambda: $500/month
- **Total: $643/month**

**With Optimization:**

- S3 Lifecycle: 1 TB × $0.005 = $5/month (78% savings)
- DynamoDB Auto Scaling: $80/month (33% savings)
- Lambda Provisioned: $400/month (20% savings)
- **Total: $485/month (25% savings)**

---

## 🎯 Recommended Strategy

### Phase 1: MVP (Launch)

**Lifecycle:**

- ✅ S3 Intelligent-Tiering (automatic)
- ❌ Complex lifecycle rules (not needed yet)

**Auto Scaling:**

- ✅ Lambda (automatic)
- ✅ DynamoDB On-Demand (automatic)
- ❌ Provisioned concurrency (not needed)

**Time:** 10 minutes
**Cost:** Same as without optimization

---

### Phase 2: Production (After Launch)

**Lifecycle:**

- ✅ S3 Lifecycle rules (30/90/365 days)
- ✅ DynamoDB TTL for sessions
- ✅ CloudWatch Logs retention (30 days)

**Auto Scaling:**

- ✅ DynamoDB Auto Scaling (5-100 capacity)
- ✅ Lambda reserved concurrency
- ❌ Provisioned concurrency (wait for traffic)

**Time:** 1 hour
**Cost Savings:** 20-25%

---

### Phase 3: Enterprise (Scale)

**Lifecycle:**

- ✅ S3 Lifecycle with Deep Archive
- ✅ DynamoDB TTL for all temporary data
- ✅ Automated log archival
- ✅ Old data deletion policies

**Auto Scaling:**

- ✅ DynamoDB Auto Scaling (10-1000 capacity)
- ✅ Lambda Provisioned Concurrency
- ✅ ALB with Auto Scaling Groups
- ✅ Predictive scaling

**Time:** 2-3 hours
**Cost Savings:** 30-40%

---

## 🚀 Quick Implementation

### Step 1: Enable S3 Intelligent-Tiering (5 min)

```bash
# Set default storage class
aws s3api put-bucket-intelligent-tiering-configuration \
  --bucket ai-career-resumes \
  --id EntireBucket \
  --intelligent-tiering-configuration '{
    "Id": "EntireBucket",
    "Status": "Enabled",
    "Tierings": [
      {"Days": 90, "AccessTier": "ARCHIVE_ACCESS"},
      {"Days": 180, "AccessTier": "DEEP_ARCHIVE_ACCESS"}
    ]
  }'
```

---

### Step 2: Enable DynamoDB TTL (3 min)

```bash
# Enable TTL for sessions
aws dynamodb update-time-to-live \
  --table-name ai-career-sessions \
  --time-to-live-specification \
    Enabled=true,AttributeName=expirationTime
```

---

### Step 3: Configure DynamoDB Auto Scaling (10 min)

```bash
# Deploy CloudFormation template
aws cloudformation create-stack \
  --stack-name ai-career-autoscaling \
  --template-body file://infrastructure/autoscaling-cloudformation.yaml \
  --capabilities CAPABILITY_IAM
```

---

## 📊 Monitoring Auto Scaling

### CloudWatch Metrics

**DynamoDB:**

- ConsumedReadCapacityUnits
- ConsumedWriteCapacityUnits
- ProvisionedReadCapacityUnits
- ProvisionedWriteCapacityUnits

**Lambda:**

- ConcurrentExecutions
- ProvisionedConcurrentExecutions
- ProvisionedConcurrencyUtilization

**View Metrics:**

```bash
# DynamoDB capacity utilization
aws cloudwatch get-metric-statistics \
  --namespace AWS/DynamoDB \
  --metric-name ConsumedReadCapacityUnits \
  --dimensions Name=TableName,Value=ai-career-users \
  --start-time 2024-11-15T00:00:00Z \
  --end-time 2024-11-15T23:59:59Z \
  --period 3600 \
  --statistics Sum
```

---

## ✅ Checklist for Course Presentation

**Lifecycle Management:**

- [ ] Explain S3 storage classes
- [ ] Show cost comparison
- [ ] Demonstrate lifecycle rules
- [ ] Explain Intelligent-Tiering
- [ ] Show DynamoDB TTL

**Auto Scaling:**

- [ ] Explain auto scaling concepts
- [ ] Show DynamoDB auto scaling
- [ ] Demonstrate Lambda scaling
- [ ] Explain target tracking
- [ ] Show cost savings

**Architecture Diagram:**

```
┌─────────────────────────────────────────────┐
│         Lifecycle Management                │
│                                             │
│  S3 Resumes                                 │
│  Day 0-30:   Standard ($0.023/GB)          │
│  Day 31-90:  Standard-IA ($0.0125/GB)      │
│  Day 91-365: Glacier ($0.004/GB)           │
│  Day 365+:   Deep Archive ($0.00099/GB)    │
│                                             │
│  Cost Savings: 78%                          │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│         Auto Scaling                        │
│                                             │
│  DynamoDB                                   │
│  Min: 5 RCU/WCU                            │
│  Max: 100 RCU/WCU                          │
│  Target: 70% utilization                    │
│                                             │
│  Lambda                                     │
│  Concurrent: 1-1000 (automatic)            │
│  Reserved: 100 (optional)                   │
│                                             │
│  Cost Savings: 25-30%                       │
└─────────────────────────────────────────────┘
```

---

## 🔗 Resources

**AWS Documentation:**

- [S3 Lifecycle](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html)
- [DynamoDB Auto Scaling](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/AutoScaling.html)
- [Lambda Scaling](https://docs.aws.amazon.com/lambda/latest/dg/invocation-scaling.html)
- [Application Auto Scaling](https://docs.aws.amazon.com/autoscaling/application/userguide/what-is-application-auto-scaling.html)

**Best Practices:**

- [Cost Optimization](https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/welcome.html)
- [Performance Efficiency](https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/welcome.html)

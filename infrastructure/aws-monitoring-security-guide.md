# AWS Monitoring & Security Services Guide

## 📋 Overview

Complete guide for implementing AWS monitoring, security, and networking services for production-ready applications.

**For Course:**

- Module 7: Networking & Security
- Module 8: Cloud Monitoring
- Module 9: Cloud Architecture

---

## 📊 CloudWatch - Monitoring & Observability

### What is CloudWatch?

AWS CloudWatch is a monitoring and observability service for AWS resources and applications.

**Key Features:**

- Metrics collection and monitoring
- Log aggregation and analysis
- Alarms and notifications
- Dashboards and visualization
- Events and automation

---

### CloudWatch Metrics

**Default Metrics (Free):**

- Lambda: Invocations, Duration, Errors, Throttles
- DynamoDB: ConsumedReadCapacity, ConsumedWriteCapacity
- S3: BucketSizeBytes, NumberOfObjects
- API Gateway: Count, Latency, 4XXError, 5XXError

**Custom Metrics:**

```bash
# Publish custom metric
aws cloudwatch put-metric-data \
  --namespace "AICareerAgent" \
  --metric-name "UserSignups" \
  --value 1 \
  --dimensions Environment=Production
```

**View Metrics:**

```bash
# Get metric statistics
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Duration \
  --dimensions Name=FunctionName,Value=ai-career-api \
  --start-time 2024-11-15T00:00:00Z \
  --end-time 2024-11-15T23:59:59Z \
  --period 3600 \
  --statistics Average,Maximum
```

---

### CloudWatch Logs

**Log Groups for Your Project:**

- `/aws/lambda/ai-career-api`
- `/aws/apigateway/ai-career-agent`
- `/aws/rds/instance/ai-career-db/error`

**Create Log Group:**

```bash
# Create log group with retention
aws logs create-log-group \
  --log-group-name /aws/lambda/ai-career-api

aws logs put-retention-policy \
  --log-group-name /aws/lambda/ai-career-api \
  --retention-in-days 30
```

**Query Logs (Logs Insights):**

```sql
-- Find errors in last hour
fields @timestamp, @message
| filter @message like /ERROR/
| sort @timestamp desc
| limit 20

-- Average response time
fields @timestamp, @duration
| stats avg(@duration) as avg_duration by bin(5m)

-- Top 10 slowest requests
fields @timestamp, @duration, @requestId
| sort @duration desc
| limit 10
```

---

### CloudWatch Alarms

**Create Alarm:**

```bash
# High error rate alarm
aws cloudwatch put-metric-alarm \
  --alarm-name ai-career-high-errors \
  --alarm-description "Alert when error rate is high" \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --evaluation-periods 2 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=FunctionName,Value=ai-career-api \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:alerts
```

**CloudFormation:**

```yaml
HighErrorAlarm:
  Type: AWS::CloudWatch::Alarm
  Properties:
    AlarmName: ai-career-high-errors
    AlarmDescription: Alert when Lambda errors exceed threshold
    MetricName: Errors
    Namespace: AWS/Lambda
    Statistic: Sum
    Period: 300
    EvaluationPeriods: 2
    Threshold: 10
    ComparisonOperator: GreaterThanThreshold
    Dimensions:
      - Name: FunctionName
        Value: !Ref LambdaFunction
    AlarmActions:
      - !Ref SNSTopic
```

---

### CloudWatch Dashboards

**Create Dashboard:**

```bash
# Create dashboard
aws cloudwatch put-dashboard \
  --dashboard-name ai-career-agent \
  --dashboard-body '{
    "widgets": [
      {
        "type": "metric",
        "properties": {
          "metrics": [
            ["AWS/Lambda", "Invocations", {"stat": "Sum"}],
            [".", "Errors", {"stat": "Sum"}],
            [".", "Duration", {"stat": "Average"}]
          ],
          "period": 300,
          "stat": "Average",
          "region": "us-east-1",
          "title": "Lambda Performance"
        }
      }
    ]
  }'
```

**Cost:** $3 per dashboard per month

---

## 🌐 Route 53 - DNS Management

### What is Route 53?

AWS Route 53 is a scalable DNS web service.

**Key Features:**

- Domain registration
- DNS routing
- Health checks
- Traffic management
- Failover routing

---

### Setup Custom Domain

**Create Hosted Zone:**

```bash
# Create hosted zone
aws route53 create-hosted-zone \
  --name aicareeragent.com \
  --caller-reference $(date +%s)
```

**Create Record Sets:**

```bash
# A record for root domain
aws route53 change-resource-record-sets \
  --hosted-zone-id Z1234567890ABC \
  --change-batch '{
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "aicareeragent.com",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2FDTNDATAQYW2",
          "DNSName": "d123456789.cloudfront.net",
          "EvaluateTargetHealth": false
        }
      }
    }]
  }'

# CNAME for www
aws route53 change-resource-record-sets \
  --hosted-zone-id Z1234567890ABC \
  --change-batch '{
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "www.aicareeragent.com",
        "Type": "CNAME",
        "TTL": 300,
        "ResourceRecords": [{"Value": "aicareeragent.com"}]
      }
    }]
  }'
```

**Health Checks:**

```bash
# Create health check
aws route53 create-health-check \
  --health-check-config \
    IPAddress=1.2.3.4,\
    Port=443,\
    Type=HTTPS,\
    ResourcePath=/health,\
    RequestInterval=30,\
    FailureThreshold=3
```

**Cost:**

- Hosted zone: $0.50/month
- Queries: $0.40 per million queries
- Health checks: $0.50/month each

---

## 🚀 CloudFront - Content Delivery Network

### What is CloudFront?

AWS CloudFront is a global CDN that delivers content with low latency.

**Key Features:**

- Global edge locations (400+)
- HTTPS/SSL support
- Custom domain names
- Cache optimization
- DDoS protection (AWS Shield)

---

### Setup CloudFront Distribution

**Create Distribution:**

```bash
# Create CloudFront distribution
aws cloudfront create-distribution \
  --distribution-config '{
    "CallerReference": "ai-career-'$(date +%s)'",
    "Comment": "AI Career Agent CDN",
    "Enabled": true,
    "Origins": {
      "Quantity": 1,
      "Items": [{
        "Id": "S3-ai-career-frontend",
        "DomainName": "ai-career-frontend.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }]
    },
    "DefaultCacheBehavior": {
      "TargetOriginId": "S3-ai-career-frontend",
      "ViewerProtocolPolicy": "redirect-to-https",
      "AllowedMethods": {
        "Quantity": 2,
        "Items": ["GET", "HEAD"]
      },
      "ForwardedValues": {
        "QueryString": false,
        "Cookies": {"Forward": "none"}
      },
      "MinTTL": 0,
      "DefaultTTL": 86400,
      "MaxTTL": 31536000
    },
    "ViewerCertificate": {
      "CloudFrontDefaultCertificate": true
    }
  }'
```

**CloudFormation:**

```yaml
CloudFrontDistribution:
  Type: AWS::CloudFront::Distribution
  Properties:
    DistributionConfig:
      Enabled: true
      Comment: AI Career Agent CDN
      Origins:
        - Id: S3Origin
          DomainName: !GetAtt FrontendBucket.DomainName
          S3OriginConfig:
            OriginAccessIdentity: !Sub "origin-access-identity/cloudfront/${CloudFrontOAI}"
      DefaultCacheBehavior:
        TargetOriginId: S3Origin
        ViewerProtocolPolicy: redirect-to-https
        AllowedMethods: [GET, HEAD, OPTIONS]
        CachedMethods: [GET, HEAD]
        ForwardedValues:
          QueryString: false
          Cookies:
            Forward: none
        Compress: true
        DefaultTTL: 86400
      ViewerCertificate:
        AcmCertificateArn: !Ref SSLCertificate
        SslSupportMethod: sni-only
        MinimumProtocolVersion: TLSv1.2_2021
      CustomErrorResponses:
        - ErrorCode: 404
          ResponseCode: 200
          ResponsePagePath: /index.html
```

**Cost:**

- Data transfer out: $0.085 per GB (first 10 TB)
- Requests: $0.0075 per 10,000 requests
- Free tier: 1 TB data transfer, 10M requests/month

---

## 🔍 VPC Flow Logs

### What are VPC Flow Logs?

Capture information about IP traffic going to and from network interfaces in your VPC.

**Use Cases:**

- Security analysis
- Troubleshooting connectivity
- Compliance auditing
- Traffic pattern analysis

---

### Enable VPC Flow Logs

**Create Flow Log:**

```bash
# Enable VPC flow logs to CloudWatch
aws ec2 create-flow-logs \
  --resource-type VPC \
  --resource-ids vpc-xxxxx \
  --traffic-type ALL \
  --log-destination-type cloud-watch-logs \
  --log-group-name /aws/vpc/flowlogs \
  --deliver-logs-permission-arn arn:aws:iam::123456789012:role/flowlogsRole
```

**CloudFormation:**

```yaml
VPCFlowLog:
  Type: AWS::EC2::FlowLog
  Properties:
    ResourceType: VPC
    ResourceId: !Ref VPC
    TrafficType: ALL
    LogDestinationType: cloud-watch-logs
    LogGroupName: /aws/vpc/flowlogs
    DeliverLogsPermissionArn: !GetAtt FlowLogsRole.Arn

FlowLogsRole:
  Type: AWS::IAM::Role
  Properties:
    AssumeRolePolicyDocument:
      Version: "2012-10-17"
      Statement:
        - Effect: Allow
          Principal:
            Service: vpc-flow-logs.amazonaws.com
          Action: sts:AssumeRole
    Policies:
      - PolicyName: CloudWatchLogPolicy
        PolicyDocument:
          Version: "2012-10-17"
          Statement:
            - Effect: Allow
              Action:
                - logs:CreateLogGroup
                - logs:CreateLogStream
                - logs:PutLogEvents
              Resource: "*"
```

**Query Flow Logs:**

```sql
-- Top talkers
fields srcaddr, dstaddr, bytes
| stats sum(bytes) as total_bytes by srcaddr
| sort total_bytes desc
| limit 10

-- Rejected connections
fields @timestamp, srcaddr, dstaddr, dstport, action
| filter action = "REJECT"
| sort @timestamp desc
```

**Cost:** $0.50 per GB ingested + CloudWatch Logs storage

---

## 📝 CloudTrail - API Auditing

### What is CloudTrail?

AWS CloudTrail records AWS API calls for auditing and compliance.

**Key Features:**

- API call logging
- User activity tracking
- Compliance auditing
- Security analysis
- Event history (90 days free)

---

### Enable CloudTrail

**Create Trail:**

```bash
# Create CloudTrail
aws cloudtrail create-trail \
  --name ai-career-trail \
  --s3-bucket-name ai-career-cloudtrail-logs \
  --is-multi-region-trail \
  --enable-log-file-validation

# Start logging
aws cloudtrail start-logging \
  --name ai-career-trail
```

**CloudFormation:**

```yaml
CloudTrail:
  Type: AWS::CloudTrail::Trail
  Properties:
    TrailName: ai-career-trail
    S3BucketName: !Ref CloudTrailBucket
    IsLogging: true
    IsMultiRegionTrail: true
    EnableLogFileValidation: true
    EventSelectors:
      - ReadWriteType: All
        IncludeManagementEvents: true
        DataResources:
          - Type: AWS::S3::Object
            Values:
              - !Sub "${ResumesBucket.Arn}/*"
          - Type: AWS::Lambda::Function
            Values:
              - !GetAtt LambdaFunction.Arn

CloudTrailBucket:
  Type: AWS::S3::Bucket
  Properties:
    BucketName: ai-career-cloudtrail-logs
    LifecycleConfiguration:
      Rules:
        - Id: DeleteOldLogs
          Status: Enabled
          ExpirationInDays: 90
```

**Query CloudTrail:**

```sql
-- Failed login attempts
fields eventTime, userIdentity.principalId, errorCode
| filter eventName = "ConsoleLogin" and errorCode exists
| sort eventTime desc

-- S3 bucket access
fields eventTime, userIdentity.principalId, requestParameters.bucketName
| filter eventSource = "s3.amazonaws.com"
| stats count() by requestParameters.bucketName
```

**Cost:**

- First trail: Free (management events)
- Additional trails: $2 per 100,000 events
- Data events: $0.10 per 100,000 events

---

## 🛡️ AWS Shield - DDoS Protection

### What is AWS Shield?

AWS Shield protects against Distributed Denial of Service (DDoS) attacks.

**Two Tiers:**

**Shield Standard (Free):**

- Automatic protection
- Layer 3/4 DDoS protection
- Always-on detection
- Inline mitigation
- No additional cost

**Shield Advanced ($3,000/month):**

- Enhanced DDoS protection
- 24/7 DDoS Response Team (DRT)
- Cost protection
- Advanced metrics
- WAF included

---

### Enable Shield Advanced (Optional)

```bash
# Subscribe to Shield Advanced
aws shield subscribe-to-shield-advanced

# Associate with CloudFront
aws shield create-protection \
  --name ai-career-cloudfront \
  --resource-arn arn:aws:cloudfront::123456789012:distribution/E1234567890ABC
```

**For MVP:** Shield Standard (free) is sufficient

---

## 🔒 Amazon Inspector - Vulnerability Assessment

### What is Amazon Inspector?

Automated security assessment service for EC2 instances and container images.

**Key Features:**

- Vulnerability scanning
- Network exposure analysis
- Best practice checks
- Compliance reporting
- Continuous monitoring

---

### Enable Inspector

**For EC2 Instances:**

```bash
# Enable Inspector
aws inspector2 enable \
  --resource-types EC2 ECR

# Create assessment target
aws inspector create-assessment-target \
  --assessment-target-name ai-career-instances \
  --resource-group-arn arn:aws:inspector:us-east-1:123456789012:resourcegroup/...
```

**For Lambda (Not directly supported):**

- Use container images with Inspector
- Scan dependencies with third-party tools
- Use AWS Security Hub integration

**Cost:**

- EC2 scanning: $0.30 per instance per month
- ECR scanning: $0.09 per image scan

**For Serverless MVP:** Not critical, focus on other security measures

---

## 🕵️ GuardDuty - Threat Detection

### What is GuardDuty?

Intelligent threat detection service that monitors for malicious activity.

**Key Features:**

- Continuous monitoring
- Machine learning detection
- Threat intelligence feeds
- Automated response
- Multi-account support

---

### Enable GuardDuty

**Enable Service:**

```bash
# Enable GuardDuty
aws guardduty create-detector \
  --enable \
  --finding-publishing-frequency FIFTEEN_MINUTES
```

**CloudFormation:**

```yaml
GuardDutyDetector:
  Type: AWS::GuardDuty::Detector
  Properties:
    Enable: true
    FindingPublishingFrequency: FIFTEEN_MINUTES

GuardDutyNotification:
  Type: AWS::Events::Rule
  Properties:
    Description: Notify on GuardDuty findings
    EventPattern:
      source:
        - aws.guardduty
      detail-type:
        - GuardDuty Finding
      detail:
        severity:
          - 4
          - 4.0
          - 4.1
          - 4.2
          - 4.3
          - 4.4
          - 4.5
          - 4.6
          - 4.7
          - 4.8
          - 4.9
          - 5
          - 5.0
          - 5.1
          - 5.2
          - 5.3
          - 5.4
          - 5.5
          - 5.6
          - 5.7
          - 5.8
          - 5.9
          - 6
          - 6.0
          - 6.1
          - 6.2
          - 6.3
          - 6.4
          - 6.5
          - 6.6
          - 6.7
          - 6.8
          - 6.9
          - 7
          - 7.0
          - 7.1
          - 7.2
          - 7.3
          - 7.4
          - 7.5
          - 7.6
          - 7.7
          - 7.8
          - 7.9
          - 8
          - 8.0
          - 8.1
          - 8.2
          - 8.3
          - 8.4
          - 8.5
          - 8.6
          - 8.7
          - 8.8
          - 8.9
    Targets:
      - Arn: !Ref SNSTopic
        Id: GuardDutyAlerts
```

**Cost:**

- CloudTrail analysis: $4.40 per million events
- VPC Flow Logs: $1.18 per GB
- DNS logs: $0.40 per million queries
- First 30 days: Free trial

**Estimated Cost (MVP):** ~$5-10/month

---

## ✅ AWS Trusted Advisor

### What is Trusted Advisor?

Provides real-time guidance to help provision resources following AWS best practices.

**Five Categories:**

1. Cost Optimization
2. Performance
3. Security
4. Fault Tolerance
5. Service Limits

---

### Access Trusted Advisor

**AWS Console:**

1. Go to AWS Trusted Advisor
2. View recommendations
3. Implement suggestions

**API Access (Business/Enterprise Support):**

```bash
# List checks
aws support describe-trusted-advisor-checks \
  --language en

# Get check result
aws support describe-trusted-advisor-check-result \
  --check-id <check-id>
```

**Free Tier Checks:**

- S3 Bucket Permissions
- Security Groups - Specific Ports Unrestricted
- IAM Use
- MFA on Root Account
- EBS Public Snapshots
- RDS Public Snapshots
- Service Limits

**Business/Enterprise Support:**

- All checks available
- API access
- Automated notifications
- Cost: $100+/month

**For MVP:** Use free tier checks

---

## 💰 Cost Summary

### MVP (Launch)

| Service           | Cost               | Priority |
| ----------------- | ------------------ | -------- |
| CloudWatch Logs   | $0.50/GB           | High     |
| CloudWatch Alarms | $0.10 each         | High     |
| Route 53          | $0.50/month        | Medium   |
| CloudFront        | Free tier          | High     |
| VPC Flow Logs     | $0.50/GB           | Low      |
| CloudTrail        | Free (first trail) | High     |
| Shield Standard   | Free               | High     |
| Inspector         | Skip               | Low      |
| GuardDuty         | $5-10/month        | Medium   |
| Trusted Advisor   | Free tier          | High     |

**Total MVP Cost:** ~$10-15/month

---

### Production

| Service         | Cost         | Priority |
| --------------- | ------------ | -------- |
| CloudWatch      | $5-10/month  | High     |
| Route 53        | $1-2/month   | High     |
| CloudFront      | $10-20/month | High     |
| VPC Flow Logs   | $2-5/month   | Medium   |
| CloudTrail      | $2-5/month   | High     |
| Shield Standard | Free         | High     |
| Inspector       | Skip         | Low      |
| GuardDuty       | $10-20/month | High     |
| Trusted Advisor | Free tier    | High     |

**Total Production Cost:** ~$30-60/month

---

## 🚀 Implementation Priority

### Phase 1: MVP (Launch) - Essential

**Must Have (30 minutes):**

1. ✅ CloudWatch Logs with retention
2. ✅ CloudWatch Alarms (errors, latency)
3. ✅ CloudTrail (first trail free)
4. ✅ Shield Standard (automatic)
5. ✅ Trusted Advisor (free checks)

**Cost:** ~$2-5/month

---

### Phase 2: Production (1-2 hours)

**Recommended:**

1. ✅ CloudWatch Dashboards
2. ✅ Route 53 custom domain
3. ✅ CloudFront CDN
4. ✅ GuardDuty threat detection
5. ✅ VPC Flow Logs

**Cost:** ~$30-60/month

---

### Phase 3: Enterprise (2-3 hours)

**Advanced:**

1. ✅ CloudWatch Logs Insights queries
2. ✅ Custom CloudWatch metrics
3. ✅ CloudFront with WAF
4. ✅ Inspector for containers
5. ✅ Shield Advanced (if needed)
6. ✅ Business Support for Trusted Advisor

**Cost:** ~$100-200/month (or $3,000+ with Shield Advanced)

---

## 📊 Complete Monitoring Architecture

```yaml
AWSTemplateFormatVersion: "2010-09-09"
Description: "Complete Monitoring & Security Stack"

Resources:
  # SNS Topic for Alerts
  AlertTopic:
    Type: AWS::SNS::Topic
    Properties:
      TopicName: ai-career-alerts
      Subscription:
        - Endpoint: admin@aicareeragent.com
          Protocol: email

  # CloudWatch Log Groups
  LambdaLogGroup:
    Type: AWS::Logs::LogGroup
    Properties:
      LogGroupName: /aws/lambda/ai-career-api
      RetentionInDays: 30

  # CloudWatch Alarms
  HighErrorAlarm:
    Type: AWS::CloudWatch::Alarm
    Properties:
      AlarmName: ai-career-high-errors
      MetricName: Errors
      Namespace: AWS/Lambda
      Statistic: Sum
      Period: 300
      EvaluationPeriods: 2
      Threshold: 10
      ComparisonOperator: GreaterThanThreshold
      AlarmActions:
        - !Ref AlertTopic

  HighLatencyAlarm:
    Type: AWS::CloudWatch::Alarm
    Properties:
      AlarmName: ai-career-high-latency
      MetricName: Duration
      Namespace: AWS/Lambda
      Statistic: Average
      Period: 300
      EvaluationPeriods: 2
      Threshold: 5000
      ComparisonOperator: GreaterThanThreshold
      AlarmActions:
        - !Ref AlertTopic

  # VPC Flow Logs
  VPCFlowLog:
    Type: AWS::EC2::FlowLog
    Properties:
      ResourceType: VPC
      ResourceId: !Ref VPC
      TrafficType: ALL
      LogDestinationType: cloud-watch-logs
      LogGroupName: /aws/vpc/flowlogs
      DeliverLogsPermissionArn: !GetAtt FlowLogsRole.Arn

  # CloudTrail
  CloudTrail:
    Type: AWS::CloudTrail::Trail
    Properties:
      TrailName: ai-career-trail
      S3BucketName: !Ref CloudTrailBucket
      IsLogging: true
      IsMultiRegionTrail: true
      EnableLogFileValidation: true

  # GuardDuty
  GuardDutyDetector:
    Type: AWS::GuardDuty::Detector
    Properties:
      Enable: true
      FindingPublishingFrequency: FIFTEEN_MINUTES

  # CloudFront Distribution
  CloudFrontDistribution:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Enabled: true
        Origins:
          - Id: S3Origin
            DomainName: !GetAtt FrontendBucket.DomainName
            S3OriginConfig:
              OriginAccessIdentity: !Sub "origin-access-identity/cloudfront/${CloudFrontOAI}"
        DefaultCacheBehavior:
          TargetOriginId: S3Origin
          ViewerProtocolPolicy: redirect-to-https
          AllowedMethods: [GET, HEAD, OPTIONS]
          CachedMethods: [GET, HEAD]
          Compress: true
        ViewerCertificate:
          CloudFrontDefaultCertificate: true

  # Route 53 Hosted Zone
  HostedZone:
    Type: AWS::Route53::HostedZone
    Properties:
      Name: aicareeragent.com

  # Route 53 Record
  DNSRecord:
    Type: AWS::Route53::RecordSet
    Properties:
      HostedZoneId: !Ref HostedZone
      Name: aicareeragent.com
      Type: A
      AliasTarget:
        HostedZoneId: Z2FDTNDATAQYW2
        DNSName: !GetAtt CloudFrontDistribution.DomainName
        EvaluateTargetHealth: false
```

---

## ✅ Checklist for Course Presentation

**CloudWatch:**

- [ ] Explain metrics, logs, alarms
- [ ] Show dashboard creation
- [ ] Demonstrate Logs Insights queries
- [ ] Show cost optimization

**Route 53:**

- [ ] Explain DNS concepts
- [ ] Show domain setup
- [ ] Demonstrate health checks
- [ ] Explain routing policies

**CloudFront:**

- [ ] Explain CDN benefits
- [ ] Show distribution setup
- [ ] Demonstrate cache optimization
- [ ] Show performance improvements

**VPC Flow Logs:**

- [ ] Explain network monitoring
- [ ] Show log analysis
- [ ] Demonstrate security use cases

**CloudTrail:**

- [ ] Explain API auditing
- [ ] Show compliance use cases
- [ ] Demonstrate log analysis

**Security Services:**

- [ ] Compare Shield, Inspector, GuardDuty
- [ ] Show threat detection
- [ ] Explain cost-benefit analysis
- [ ] Demonstrate Trusted Advisor

---

## 🔗 Resources

**AWS Documentation:**

- [CloudWatch](https://docs.aws.amazon.com/cloudwatch/)
- [Route 53](https://docs.aws.amazon.com/route53/)
- [CloudFront](https://docs.aws.amazon.com/cloudfront/)
- [VPC Flow Logs](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html)
- [CloudTrail](https://docs.aws.amazon.com/cloudtrail/)
- [GuardDuty](https://docs.aws.amazon.com/guardduty/)
- [Trusted Advisor](https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor.html)

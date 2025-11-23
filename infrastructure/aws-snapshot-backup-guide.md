# AWS Snapshot & Backup Strategy Guide

## 📋 Overview

Complete guide for implementing snapshots and backups across AWS services for disaster recovery and data protection.

**For Course:** Module 9 - Cloud Architecture and Disaster Recovery

---

## 📸 What are Snapshots?

Snapshots are point-in-time backups of your data that can be used for:

- Disaster recovery
- Data migration
- Testing and development
- Compliance and auditing
- Rollback capabilities

---

## 🎯 Snapshot Types for Your Project

### 1. DynamoDB Backups

**Your user data, job data, applications**

### 2. RDS Snapshots

**If using RDS for analytics/reporting**

### 3. S3 Versioning

**Resume storage with version history**

### 4. EBS Snapshots

**If using EC2 instances (not needed for serverless)**

---

## 💾 DynamoDB Backup Strategies

### Option 1: On-Demand Backups

**Manual backups when needed**

**Create Backup:**

```bash
# Create on-demand backup
aws dynamodb create-backup \
  --table-name ai-career-users \
  --backup-name ai-career-users-backup-$(date +%Y%m%d)
```

**Restore from Backup:**

```bash
# Restore to new table
aws dynamodb restore-table-from-backup \
  --target-table-name ai-career-users-restored \
  --backup-arn arn:aws:dynamodb:us-east-1:123456789012:table/ai-career-users/backup/01234567890123-abcdefgh
```

**Cost:**

- Backup storage: $0.10 per GB-month
- Restore: $0.15 per GB

---

### Option 2: Point-in-Time Recovery (PITR)

**Continuous backups for last 35 days**

**Enable PITR:**

```bash
# Enable point-in-time recovery
aws dynamodb update-continuous-backups \
  --table-name ai-career-users \
  --point-in-time-recovery-specification PointInTimeRecoveryEnabled=true
```

**Restore to Any Point:**

```bash
# Restore to specific timestamp
aws dynamodb restore-table-to-point-in-time \
  --source-table-name ai-career-users \
  --target-table-name ai-career-users-restored \
  --restore-date-time 2024-11-15T10:30:00Z
```

**Cost:**

- PITR: $0.20 per GB-month (continuous backup)
- Restore: $0.15 per GB

**Recommendation:** Enable PITR for production

---

### Option 3: AWS Backup (Automated)

**Centralized backup management**

**Create Backup Plan:**

```bash
# Create backup plan
aws backup create-backup-plan \
  --backup-plan '{
    "BackupPlanName": "ai-career-daily-backup",
    "Rules": [{
      "RuleName": "DailyBackup",
      "TargetBackupVaultName": "Default",
      "ScheduleExpression": "cron(0 2 * * ? *)",
      "StartWindowMinutes": 60,
      "CompletionWindowMinutes": 120,
      "Lifecycle": {
        "DeleteAfterDays": 30
      }
    }]
  }'
```

**Assign Resources:**

```bash
# Assign DynamoDB table to backup plan
aws backup create-backup-selection \
  --backup-plan-id <plan-id> \
  --backup-selection '{
    "SelectionName": "DynamoDBTables",
    "IamRoleArn": "arn:aws:iam::123456789012:role/AWSBackupRole",
    "Resources": [
      "arn:aws:dynamodb:us-east-1:123456789012:table/ai-career-users",
      "arn:aws:dynamodb:us-east-1:123456789012:table/ai-career-jobs"
    ]
  }'
```

---

## 🗄️ RDS Snapshot Strategies

### Automated Snapshots

**Enable Automated Backups:**

```bash
# Create RDS instance with automated backups
aws rds create-db-instance \
  --db-instance-identifier ai-career-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password <password> \
  --allocated-storage 20 \
  --backup-retention-period 7 \
  --preferred-backup-window "03:00-04:00" \
  --preferred-maintenance-window "sun:04:00-sun:05:00"
```

**Modify Existing Instance:**

```bash
# Update backup retention
aws rds modify-db-instance \
  --db-instance-identifier ai-career-db \
  --backup-retention-period 7 \
  --apply-immediately
```

**Retention Options:**

- 0 days: Disabled
- 1-35 days: Automated backups
- Recommendation: 7 days for production

---

### Manual Snapshots

**Create Manual Snapshot:**

```bash
# Create snapshot
aws rds create-db-snapshot \
  --db-instance-identifier ai-career-db \
  --db-snapshot-identifier ai-career-db-snapshot-$(date +%Y%m%d)
```

**List Snapshots:**

```bash
# List all snapshots
aws rds describe-db-snapshots \
  --db-instance-identifier ai-career-db
```

**Restore from Snapshot:**

```bash
# Restore to new instance
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier ai-career-db-restored \
  --db-snapshot-identifier ai-career-db-snapshot-20241115
```

**Copy Snapshot to Another Region:**

```bash
# Cross-region copy for disaster recovery
aws rds copy-db-snapshot \
  --source-db-snapshot-identifier arn:aws:rds:us-east-1:123456789012:snapshot:ai-career-db-snapshot-20241115 \
  --target-db-snapshot-identifier ai-career-db-snapshot-20241115 \
  --region us-west-2
```

**Cost:**

- Automated backups: Free (within retention period)
- Manual snapshots: $0.095 per GB-month
- Cross-region copy: $0.02 per GB transferred

---

## 📦 S3 Versioning & Lifecycle

### Enable Versioning

**Enable on Bucket:**

```bash
# Enable versioning
aws s3api put-bucket-versioning \
  --bucket ai-career-resumes \
  --versioning-configuration Status=Enabled
```

**List Versions:**

```bash
# List all versions of an object
aws s3api list-object-versions \
  --bucket ai-career-resumes \
  --prefix user123/resume.pdf
```

**Restore Previous Version:**

```bash
# Copy old version to current
aws s3api copy-object \
  --bucket ai-career-resumes \
  --copy-source ai-career-resumes/user123/resume.pdf?versionId=abc123 \
  --key user123/resume.pdf
```

---

### Lifecycle Policies

**Transition Old Versions to Glacier:**

```bash
# Create lifecycle policy
aws s3api put-bucket-lifecycle-configuration \
  --bucket ai-career-resumes \
  --lifecycle-configuration '{
    "Rules": [{
      "Id": "ArchiveOldVersions",
      "Status": "Enabled",
      "NoncurrentVersionTransitions": [{
        "NoncurrentDays": 30,
        "StorageClass": "GLACIER"
      }],
      "NoncurrentVersionExpiration": {
        "NoncurrentDays": 90
      }
    }]
  }'
```

**Cost Optimization:**

- S3 Standard: $0.023 per GB-month
- S3 Glacier: $0.004 per GB-month
- Savings: 83% for archived versions

---

## 🔄 Cross-Region Replication

### S3 Cross-Region Replication

**Enable Replication:**

```bash
# Create replication configuration
aws s3api put-bucket-replication \
  --bucket ai-career-resumes \
  --replication-configuration '{
    "Role": "arn:aws:iam::123456789012:role/S3ReplicationRole",
    "Rules": [{
      "Status": "Enabled",
      "Priority": 1,
      "DeleteMarkerReplication": { "Status": "Enabled" },
      "Filter": {},
      "Destination": {
        "Bucket": "arn:aws:s3:::ai-career-resumes-backup",
        "ReplicationTime": {
          "Status": "Enabled",
          "Time": { "Minutes": 15 }
        },
        "Metrics": {
          "Status": "Enabled",
          "EventThreshold": { "Minutes": 15 }
        }
      }
    }]
  }'
```

**Cost:**

- Replication: $0.02 per GB transferred
- Storage in second region: Standard rates
- Replication Time Control: $0.015 per GB

---

## 🏗️ Complete Backup Architecture

### CloudFormation Template

```yaml
AWSTemplateFormatVersion: "2010-09-09"
Description: "Backup and Snapshot Configuration for AI Career Agent"

Resources:
  # Backup Vault
  BackupVault:
    Type: AWS::Backup::BackupVault
    Properties:
      BackupVaultName: ai-career-backup-vault

  # Backup Plan
  BackupPlan:
    Type: AWS::Backup::BackupPlan
    Properties:
      BackupPlan:
        BackupPlanName: ai-career-backup-plan
        BackupPlanRule:
          - RuleName: DailyBackup
            TargetBackupVault: !Ref BackupVault
            ScheduleExpression: cron(0 2 * * ? *)
            StartWindowMinutes: 60
            CompletionWindowMinutes: 120
            Lifecycle:
              DeleteAfterDays: 30
              MoveToColdStorageAfterDays: 7

  # IAM Role for Backup
  BackupRole:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Version: "2012-10-17"
        Statement:
          - Effect: Allow
            Principal:
              Service: backup.amazonaws.com
            Action: sts:AssumeRole
      ManagedPolicyArns:
        - arn:aws:iam::aws:policy/service-role/AWSBackupServiceRolePolicyForBackup
        - arn:aws:iam::aws:policy/service-role/AWSBackupServiceRolePolicyForRestores

  # Backup Selection
  BackupSelection:
    Type: AWS::Backup::BackupSelection
    Properties:
      BackupPlanId: !Ref BackupPlan
      BackupSelection:
        SelectionName: ai-career-resources
        IamRoleArn: !GetAtt BackupRole.Arn
        Resources:
          - !Sub "arn:aws:dynamodb:${AWS::Region}:${AWS::AccountId}:table/ai-career-users"
          - !Sub "arn:aws:dynamodb:${AWS::Region}:${AWS::AccountId}:table/ai-career-jobs"
          - !Sub "arn:aws:rds:${AWS::Region}:${AWS::AccountId}:db:ai-career-db"

  # Enable DynamoDB PITR
  DynamoDBPITR:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: ai-career-users
      PointInTimeRecoverySpecification:
        PointInTimeRecoveryEnabled: true

  # S3 Bucket with Versioning
  ResumesBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: ai-career-resumes
      VersioningConfiguration:
        Status: Enabled
      LifecycleConfiguration:
        Rules:
          - Id: ArchiveOldVersions
            Status: Enabled
            NoncurrentVersionTransitions:
              - StorageClass: GLACIER
                TransitionInDays: 30
            NoncurrentVersionExpiration:
              NoncurrentDays: 90

  # Backup Bucket (Cross-Region)
  BackupBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: ai-career-resumes-backup
      VersioningConfiguration:
        Status: Enabled

  # Replication Role
  ReplicationRole:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Version: "2012-10-17"
        Statement:
          - Effect: Allow
            Principal:
              Service: s3.amazonaws.com
            Action: sts:AssumeRole
      Policies:
        - PolicyName: S3ReplicationPolicy
          PolicyDocument:
            Version: "2012-10-17"
            Statement:
              - Effect: Allow
                Action:
                  - s3:GetReplicationConfiguration
                  - s3:ListBucket
                Resource: !GetAtt ResumesBucket.Arn
              - Effect: Allow
                Action:
                  - s3:GetObjectVersionForReplication
                  - s3:GetObjectVersionAcl
                Resource: !Sub "${ResumesBucket.Arn}/*"
              - Effect: Allow
                Action:
                  - s3:ReplicateObject
                  - s3:ReplicateDelete
                Resource: !Sub "${BackupBucket.Arn}/*"

Outputs:
  BackupVaultArn:
    Value: !GetAtt BackupVault.BackupVaultArn
  BackupPlanId:
    Value: !Ref BackupPlan
```

---

## 📊 Backup Strategy Comparison

| Service      | Backup Type | Frequency  | Retention | Cost               | RPO    | RTO       |
| ------------ | ----------- | ---------- | --------- | ------------------ | ------ | --------- |
| **DynamoDB** | PITR        | Continuous | 35 days   | $0.20/GB-mo        | 1 sec  | 5-10 min  |
| **DynamoDB** | On-Demand   | Manual     | Unlimited | $0.10/GB-mo        | Hours  | 5-10 min  |
| **RDS**      | Automated   | Daily      | 7-35 days | Free               | 5 min  | 10-30 min |
| **RDS**      | Manual      | Manual     | Unlimited | $0.095/GB-mo       | Hours  | 10-30 min |
| **S3**       | Versioning  | Per change | Unlimited | $0.023/GB-mo       | 0 sec  | Instant   |
| **S3**       | Replication | Real-time  | Unlimited | $0.02/GB + storage | 15 min | Instant   |

**RPO:** Recovery Point Objective (how much data loss is acceptable)
**RTO:** Recovery Time Objective (how long to recover)

---

## 💰 Cost Breakdown

### Scenario 1: MVP (1,000 users)

**Data Volume:**

- DynamoDB: 1 GB
- RDS: 5 GB
- S3: 10 GB

**Monthly Costs:**

- DynamoDB PITR: $0.20
- RDS automated backups: Free
- S3 versioning: $0.23
- **Total: ~$0.43/month**

---

### Scenario 2: Production (10,000 users)

**Data Volume:**

- DynamoDB: 10 GB
- RDS: 50 GB
- S3: 100 GB

**Monthly Costs:**

- DynamoDB PITR: $2.00
- RDS automated backups: Free
- RDS manual snapshots: $4.75 (50 GB × $0.095)
- S3 versioning: $2.30
- Cross-region replication: $2.00
- **Total: ~$11.05/month**

---

### Scenario 3: Enterprise (100,000 users)

**Data Volume:**

- DynamoDB: 100 GB
- RDS: 500 GB
- S3: 1 TB

**Monthly Costs:**

- DynamoDB PITR: $20.00
- AWS Backup: $5.00
- RDS automated backups: Free
- RDS manual snapshots: $47.50
- S3 versioning: $23.00
- Cross-region replication: $20.00
- Glacier archival: $4.00
- **Total: ~$119.50/month**

---

## 🎯 Recommended Backup Strategy

### For Your AI Career Agent:

**Phase 1: MVP (Launch)**

```
✅ DynamoDB: On-demand backups (manual)
✅ S3: Versioning enabled
❌ RDS: Not yet implemented
❌ Cross-region: Not needed yet

Cost: ~$0.50/month
Time to implement: 15 minutes
```

**Phase 2: Production (After Launch)**

```
✅ DynamoDB: Point-in-Time Recovery (PITR)
✅ RDS: Automated backups (7 days)
✅ S3: Versioning + Lifecycle policies
✅ AWS Backup: Centralized management
❌ Cross-region: Not needed yet

Cost: ~$10-15/month
Time to implement: 1 hour
```

**Phase 3: Enterprise (Scale)**

```
✅ DynamoDB: PITR + AWS Backup
✅ RDS: Automated + Manual snapshots
✅ S3: Versioning + Cross-region replication
✅ AWS Backup: All resources
✅ Glacier: Long-term archival

Cost: ~$100-150/month
Time to implement: 2-3 hours
```

---

## 🚀 Quick Implementation Guide

### Step 1: Enable DynamoDB PITR (5 minutes)

```bash
# Enable for all tables
aws dynamodb update-continuous-backups \
  --table-name ai-career-users \
  --point-in-time-recovery-specification PointInTimeRecoveryEnabled=true

aws dynamodb update-continuous-backups \
  --table-name ai-career-jobs \
  --point-in-time-recovery-specification PointInTimeRecoveryEnabled=true
```

---

### Step 2: Enable S3 Versioning (2 minutes)

```bash
# Enable versioning
aws s3api put-bucket-versioning \
  --bucket ai-career-resumes \
  --versioning-configuration Status=Enabled
```

---

### Step 3: Configure RDS Backups (5 minutes)

```bash
# Set backup retention to 7 days
aws rds modify-db-instance \
  --db-instance-identifier ai-career-db \
  --backup-retention-period 7 \
  --preferred-backup-window "03:00-04:00" \
  --apply-immediately
```

---

### Step 4: Create AWS Backup Plan (10 minutes)

```bash
# Deploy CloudFormation template
aws cloudformation create-stack \
  --stack-name ai-career-backup \
  --template-body file://infrastructure/backup-cloudformation.yaml \
  --capabilities CAPABILITY_IAM
```

---

## 🧪 Testing Your Backups

### Test 1: DynamoDB Restore

```bash
# 1. Create test backup
aws dynamodb create-backup \
  --table-name ai-career-users \
  --backup-name test-backup

# 2. Restore to new table
aws dynamodb restore-table-from-backup \
  --target-table-name ai-career-users-test \
  --backup-arn <backup-arn>

# 3. Verify data
aws dynamodb scan --table-name ai-career-users-test --max-items 10

# 4. Delete test table
aws dynamodb delete-table --table-name ai-career-users-test
```

---

### Test 2: S3 Version Recovery

```bash
# 1. Upload test file
echo "Version 1" > test.txt
aws s3 cp test.txt s3://ai-career-resumes/test.txt

# 2. Overwrite file
echo "Version 2" > test.txt
aws s3 cp test.txt s3://ai-career-resumes/test.txt

# 3. List versions
aws s3api list-object-versions \
  --bucket ai-career-resumes \
  --prefix test.txt

# 4. Restore old version
aws s3api copy-object \
  --bucket ai-career-resumes \
  --copy-source "ai-career-resumes/test.txt?versionId=<old-version-id>" \
  --key test.txt

# 5. Verify
aws s3 cp s3://ai-career-resumes/test.txt -
```

---

### Test 3: RDS Snapshot Restore

```bash
# 1. Create snapshot
aws rds create-db-snapshot \
  --db-instance-identifier ai-career-db \
  --db-snapshot-identifier test-snapshot

# 2. Wait for completion
aws rds wait db-snapshot-completed \
  --db-snapshot-identifier test-snapshot

# 3. Restore to new instance
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier ai-career-db-test \
  --db-snapshot-identifier test-snapshot

# 4. Verify connection
psql -h <test-endpoint> -U admin -d aicareer

# 5. Delete test instance
aws rds delete-db-instance \
  --db-instance-identifier ai-career-db-test \
  --skip-final-snapshot
```

---

## 📝 Disaster Recovery Plan

### Scenario 1: Accidental Data Deletion

**Problem:** User accidentally deletes their profile

**Solution:**

1. Use DynamoDB PITR to restore to 5 minutes ago
2. Recovery time: 5-10 minutes
3. Data loss: None

```bash
aws dynamodb restore-table-to-point-in-time \
  --source-table-name ai-career-users \
  --target-table-name ai-career-users-recovered \
  --restore-date-time $(date -u -d '5 minutes ago' +%Y-%m-%dT%H:%M:%SZ)
```

---

### Scenario 2: Database Corruption

**Problem:** Database becomes corrupted

**Solution:**

1. Restore RDS from automated backup
2. Recovery time: 10-30 minutes
3. Data loss: Up to 5 minutes

```bash
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier ai-career-db \
  --target-db-instance-identifier ai-career-db-recovered \
  --restore-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%SZ)
```

---

### Scenario 3: Region Failure

**Problem:** Entire AWS region goes down

**Solution:**

1. Failover to backup region
2. Use cross-region replicated S3 data
3. Restore DynamoDB from backup
4. Recovery time: 1-2 hours
5. Data loss: Up to 15 minutes

---

## ✅ Checklist for Course Presentation

**Backup Strategy:**

- [ ] Explain RPO and RTO concepts
- [ ] Document backup types (full, incremental, differential)
- [ ] Show DynamoDB PITR implementation
- [ ] Demonstrate RDS snapshot process
- [ ] Explain S3 versioning benefits
- [ ] Calculate backup costs
- [ ] Create disaster recovery plan
- [ ] Test backup restoration

**Architecture Diagram:**

```
┌─────────────────────────────────────────────┐
│           Production Region (us-east-1)     │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │DynamoDB  │  │   RDS    │  │    S3    │ │
│  │  (PITR)  │  │(Auto BKP)│  │(Versions)│ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘ │
│       │             │             │        │
│       └─────────────┼─────────────┘        │
│                     │                      │
│              ┌──────▼──────┐              │
│              │ AWS Backup  │              │
│              │   Service   │              │
│              └──────┬──────┘              │
└─────────────────────┼───────────────────────┘
                      │
                      │ Replication
                      │
┌─────────────────────▼───────────────────────┐
│        Backup Region (us-west-2)            │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │DynamoDB  │  │   RDS    │  │    S3    │ │
│  │ Backups  │  │Snapshots │  │ Replica  │ │
│  └──────────┘  └──────────┘  └──────────┘ │
└─────────────────────────────────────────────┘
```

---

## 🔗 Resources

**AWS Documentation:**

- [DynamoDB Backup](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/BackupRestore.html)
- [RDS Snapshots](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_CreateSnapshot.html)
- [S3 Versioning](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html)
- [AWS Backup](https://docs.aws.amazon.com/aws-backup/latest/devguide/whatisbackup.html)

**Best Practices:**

- [Backup Best Practices](https://docs.aws.amazon.com/prescriptive-guidance/latest/backup-recovery/backup-recovery.html)
- [Disaster Recovery](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-workloads-on-aws.html)

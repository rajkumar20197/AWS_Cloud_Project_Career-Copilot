# AWS KMS (Key Management Service) - Decision Guide

## 🤔 Do You Need AWS KMS?

**Short Answer:** Yes, it's valuable for security and course demonstration, but you can start with default encryption.

---

## 📊 Quick Decision Matrix

| Scenario                    | Need KMS?   | Why                                  |
| --------------------------- | ----------- | ------------------------------------ |
| **MVP Launch**              | Optional    | Default encryption works fine        |
| **Production**              | Recommended | Better security control              |
| **Course Project**          | Yes         | Demonstrates security best practices |
| **Compliance (HIPAA, PCI)** | Required    | Regulatory requirement               |
| **Enterprise Clients**      | Required    | Customer-managed keys                |

---

## 🔐 What is AWS KMS?

AWS Key Management Service (KMS) is a managed service for creating and controlling encryption keys used to encrypt your data.

**Key Features:**

- Centralized key management
- Automatic key rotation
- Audit trail (CloudTrail integration)
- Fine-grained access control
- FIPS 140-2 validated
- Integration with AWS services

---

## 🎯 For Your AI Career Agent Project

### Current Encryption Status

**What You Already Have:**

✅ **DynamoDB:** Default encryption at rest (AWS-owned keys)
✅ **S3:** AES-256 encryption (SSE-S3)
✅ **Cognito:** Encrypted by default
✅ **HTTPS/TLS:** Encryption in transit
✅ **Secrets Manager:** For API keys (uses KMS by default)

**What's Missing:**

❌ **Customer-managed KMS keys:** More control over encryption
❌ **Key rotation:** Automatic key rotation
❌ **Audit logging:** Who accessed what data
❌ **Cross-account access:** For enterprise deployments

---

## 💡 Encryption Options Comparison

### Option 1: Default Encryption (Current)

**What you have now**

**DynamoDB:**

- AWS-owned keys (free)
- Automatic encryption
- No management needed
- ❌ No audit trail
- ❌ No key rotation control

**S3:**

- SSE-S3 (AES-256)
- Free
- Automatic
- ❌ No audit trail
- ❌ AWS manages keys

**Cost:** $0

---

### Option 2: AWS-Managed KMS Keys

**Upgrade option**

**DynamoDB:**

- AWS-managed KMS key
- Automatic rotation (every 3 years)
- CloudTrail logging
- ✅ Audit trail
- ❌ Can't disable/delete key

**S3:**

- SSE-KMS with AWS-managed key
- CloudTrail logging
- ✅ Audit trail
- ❌ Can't control rotation

**Cost:** ~$1/month per key + API calls

---

### Option 3: Customer-Managed KMS Keys (Recommended for Production)

**Best security**

**DynamoDB:**

- Your own KMS key
- Control rotation (annual)
- Full audit trail
- ✅ Complete control
- ✅ Can disable/delete
- ✅ Cross-account access

**S3:**

- SSE-KMS with customer key
- Full control
- ✅ Audit trail
- ✅ Key policies

**Cost:** ~$1/month per key + API calls (~$0.03 per 10,000 requests)

---

## 📋 What Data Needs Encryption?

### Your AI Career Agent Data:

**1. User Profiles (DynamoDB)**

- Personal information
- Email addresses
- Career history
- Skills and experience
- **Sensitivity:** Medium-High
- **Recommendation:** KMS encryption

**2. Resumes (S3)**

- Full resume documents
- Personal details
- Work history
- **Sensitivity:** High
- **Recommendation:** KMS encryption with versioning

**3. Job Applications (DynamoDB)**

- Application status
- Interview notes
- AI analysis results
- **Sensitivity:** Medium
- **Recommendation:** KMS encryption

**4. API Keys & Secrets (Secrets Manager)**

- AWS credentials
- Bedrock API keys
- Stripe keys
- **Sensitivity:** Critical
- **Recommendation:** KMS encryption (automatic)

**5. Session Data (Cognito)**

- Authentication tokens
- User sessions
- **Sensitivity:** High
- **Recommendation:** Encrypted by default

---

## 🚀 Implementation Guide

### Step 1: Create KMS Key

**AWS Console:**

1. Go to KMS → Customer managed keys
2. Click "Create key"
3. Choose "Symmetric" key type
4. Add alias: `ai-career-agent-key`
5. Define key administrators
6. Define key users (Lambda, DynamoDB, S3)
7. Review and create

**AWS CLI:**

```bash
# Create KMS key
aws kms create-key \
  --description "AI Career Agent encryption key" \
  --key-usage ENCRYPT_DECRYPT \
  --origin AWS_KMS

# Create alias
aws kms create-alias \
  --alias-name alias/ai-career-agent \
  --target-key-id <key-id>

# Enable automatic rotation
aws kms enable-key-rotation \
  --key-id <key-id>
```

**CloudFormation:**

```yaml
KMSKey:
  Type: AWS::KMS::Key
  Properties:
    Description: AI Career Agent encryption key
    KeyPolicy:
      Version: "2012-10-17"
      Statement:
        - Sid: Enable IAM User Permissions
          Effect: Allow
          Principal:
            AWS: !Sub "arn:aws:iam::${AWS::AccountId}:root"
          Action: "kms:*"
          Resource: "*"
        - Sid: Allow DynamoDB
          Effect: Allow
          Principal:
            Service: dynamodb.amazonaws.com
          Action:
            - "kms:Decrypt"
            - "kms:DescribeKey"
            - "kms:CreateGrant"
          Resource: "*"
        - Sid: Allow S3
          Effect: Allow
          Principal:
            Service: s3.amazonaws.com
          Action:
            - "kms:Decrypt"
            - "kms:GenerateDataKey"
          Resource: "*"
    EnableKeyRotation: true

KMSKeyAlias:
  Type: AWS::KMS::Alias
  Properties:
    AliasName: alias/ai-career-agent
    TargetKeyId: !Ref KMSKey
```

---

### Step 2: Enable KMS for DynamoDB

**Update DynamoDB Table:**

```bash
# Enable KMS encryption on existing table
aws dynamodb update-table \
  --table-name ai-career-users \
  --sse-specification \
    Enabled=true,\
    SSEType=KMS,\
    KMSMasterKeyId=alias/ai-career-agent
```

**CloudFormation:**

```yaml
UsersTable:
  Type: AWS::DynamoDB::Table
  Properties:
    TableName: ai-career-users
    SSESpecification:
      SSEEnabled: true
      SSEType: KMS
      KMSMasterKeyId: !Ref KMSKey
```

---

### Step 3: Enable KMS for S3

**Update S3 Bucket:**

```bash
# Enable KMS encryption
aws s3api put-bucket-encryption \
  --bucket ai-career-resumes \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "aws:kms",
        "KMSMasterKeyID": "alias/ai-career-agent"
      },
      "BucketKeyEnabled": true
    }]
  }'
```

**CloudFormation:**

```yaml
ResumesBucket:
  Type: AWS::S3::Bucket
  Properties:
    BucketName: ai-career-resumes
    BucketEncryption:
      ServerSideEncryptionConfiguration:
        - ServerSideEncryptionByDefault:
            SSEAlgorithm: aws:kms
            KMSMasterKeyID: !Ref KMSKey
          BucketKeyEnabled: true
```

---

### Step 4: Update IAM Policies

**Lambda Execution Role:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["kms:Decrypt", "kms:DescribeKey", "kms:GenerateDataKey"],
      "Resource": "arn:aws:kms:us-east-1:123456789012:key/your-key-id"
    }
  ]
}
```

---

## 💰 Cost Breakdown

**KMS Pricing:**

**Key Storage:**

- Customer-managed keys: $1/month per key
- AWS-managed keys: Free

**API Requests:**

- First 20,000 requests/month: Free
- Additional requests: $0.03 per 10,000 requests

**Example Monthly Cost:**

**Scenario 1: MVP (1,000 users)**

- 1 KMS key: $1
- ~50,000 API requests: $0.09
- **Total: ~$1.10/month**

**Scenario 2: Production (10,000 users)**

- 1 KMS key: $1
- ~500,000 API requests: $1.44
- **Total: ~$2.44/month**

**Scenario 3: Enterprise (100,000 users)**

- 2 KMS keys (data + backups): $2
- ~5,000,000 API requests: $14.97
- **Total: ~$16.97/month**

---

## 🎓 For Your Cloud Computing Course

### Module 7: Cloud Security

**KMS Demonstrates:**

- ✅ Encryption at rest
- ✅ Key management best practices
- ✅ Compliance requirements
- ✅ Audit and logging
- ✅ Access control

### What to Include in Presentation

**Slide: Data Security Architecture**

```
┌─────────────────────────────────────────────┐
│              AWS KMS                        │
│         (Key Management)                    │
│                                             │
│  ┌─────────────────────────────────┐       │
│  │  Customer-Managed Key           │       │
│  │  - Automatic rotation           │       │
│  │  - CloudTrail logging           │       │
│  │  - Fine-grained access control  │       │
│  └─────────────────────────────────┘       │
└──────────────┬──────────────────────────────┘
               │
               │ Encryption Keys
               │
    ┌──────────┴──────────┐
    │                     │
    ▼                     ▼
┌─────────┐         ┌─────────┐
│DynamoDB │         │   S3    │
│ (Users) │         │(Resumes)│
│         │         │         │
│Encrypted│         │Encrypted│
└─────────┘         └─────────┘
```

**Key Points:**

- All sensitive data encrypted at rest
- Customer-managed keys for control
- Automatic key rotation
- Full audit trail via CloudTrail
- Compliance-ready (HIPAA, PCI-DSS)

---

## ✅ Recommendation for Your Project

### For MVP Launch (Next 5 days):

**Option 1: Keep Default Encryption** ⚡

- Fastest approach
- Already secure
- Free
- Focus on features
- **Add KMS later**

**Option 2: Add KMS Now** 🔒

- Better security
- Course demonstration
- Only 30 minutes to implement
- Minimal cost (~$1/month)
- **Recommended if time permits**

---

### For Production (After Launch):

**Must Have:**

- ✅ Customer-managed KMS keys
- ✅ Automatic key rotation
- ✅ CloudTrail logging
- ✅ Key policies for access control
- ✅ Separate keys for different data types

**Implementation Priority:**

1. Create KMS key (5 min)
2. Enable for DynamoDB (5 min)
3. Enable for S3 (5 min)
4. Update IAM policies (10 min)
5. Test encryption (5 min)
6. Document for course (10 min)

**Total Time: 30-40 minutes**

---

## 🔧 Quick Start Commands

**Complete KMS Setup (Copy-Paste):**

```bash
# 1. Create KMS key
KEY_ID=$(aws kms create-key \
  --description "AI Career Agent encryption key" \
  --query 'KeyMetadata.KeyId' \
  --output text)

# 2. Create alias
aws kms create-alias \
  --alias-name alias/ai-career-agent \
  --target-key-id $KEY_ID

# 3. Enable rotation
aws kms enable-key-rotation --key-id $KEY_ID

# 4. Update DynamoDB
aws dynamodb update-table \
  --table-name ai-career-users \
  --sse-specification \
    Enabled=true,SSEType=KMS,KMSMasterKeyId=$KEY_ID

# 5. Update S3
aws s3api put-bucket-encryption \
  --bucket ai-career-resumes \
  --server-side-encryption-configuration "{
    \"Rules\": [{
      \"ApplyServerSideEncryptionByDefault\": {
        \"SSEAlgorithm\": \"aws:kms\",
        \"KMSMasterKeyID\": \"$KEY_ID\"
      },
      \"BucketKeyEnabled\": true
    }]
  }"

echo "KMS setup complete! Key ID: $KEY_ID"
```

---

## 📊 Security Comparison

| Feature            | Default  | AWS-Managed KMS | Customer-Managed KMS |
| ------------------ | -------- | --------------- | -------------------- |
| **Encryption**     | ✅ Yes   | ✅ Yes          | ✅ Yes               |
| **Cost**           | Free     | ~$1/mo          | ~$1/mo               |
| **Audit Trail**    | ❌ No    | ✅ Yes          | ✅ Yes               |
| **Key Rotation**   | ❌ No    | ✅ Auto (3yr)   | ✅ Auto (1yr)        |
| **Key Control**    | ❌ No    | ⚠️ Limited      | ✅ Full              |
| **Compliance**     | ⚠️ Basic | ✅ Good         | ✅ Excellent         |
| **Cross-Account**  | ❌ No    | ❌ No           | ✅ Yes               |
| **Disable/Delete** | ❌ No    | ❌ No           | ✅ Yes               |

---

## 🎯 Final Recommendation

### For Your Situation:

**Priority 1: MVP Launch (Days 1-5)**

- Keep default encryption
- Focus on core features
- Add KMS after launch

**Priority 2: Course Demo (Days 6-7)**

- Implement KMS
- Document security architecture
- Add to presentation
- Show best practices

**Priority 3: Production (Week 2+)**

- Customer-managed keys
- Key rotation enabled
- CloudTrail monitoring
- Compliance documentation

---

## 📝 Add to TODO.md

**High Priority (Before Launch):**

- [ ] Review KMS decision guide
- [ ] Decide: Default encryption or KMS

**Medium Priority (Course Demo):**

- [ ] Create customer-managed KMS key
- [ ] Enable KMS for DynamoDB
- [ ] Enable KMS for S3
- [ ] Update IAM policies
- [ ] Enable key rotation
- [ ] Test encryption
- [ ] Document security architecture
- [ ] Add KMS to presentation slides

**Cost:** ~$1-2/month

---

## 🔗 Resources

**AWS Documentation:**

- [AWS KMS](https://aws.amazon.com/kms/)
- [KMS Best Practices](https://docs.aws.amazon.com/kms/latest/developerguide/best-practices.html)
- [DynamoDB Encryption](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/encryption.tutorial.html)
- [S3 Encryption](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html)

**Pricing:**

- [KMS Pricing](https://aws.amazon.com/kms/pricing/)

**Compliance:**

- [HIPAA Compliance](https://aws.amazon.com/compliance/hipaa-compliance/)
- [PCI DSS](https://aws.amazon.com/compliance/pci-dss-level-1-faqs/)

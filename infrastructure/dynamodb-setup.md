# DynamoDB Setup Guide

## 📋 Quick Setup (15 minutes)

### Step 1: Create DynamoDB Tables

Run these AWS CLI commands:

```bash
# 1. Create Users Table
aws dynamodb create-table \
  --table-name ai-career-users \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
    AttributeName=email,AttributeType=S \
  --key-schema \
    AttributeName=userId,KeyType=HASH \
  --global-secondary-indexes \
    "[{\"IndexName\":\"EmailIndex\",\"KeySchema\":[{\"AttributeName\":\"email\",\"KeyType\":\"HASH\"}],\"Projection\":{\"ProjectionType\":\"ALL\"},\"ProvisionedThroughput\":{\"ReadCapacityUnits\":5,\"WriteCapacityUnits\":5}}]" \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

# 2. Create Jobs Table
aws dynamodb create-table \
  --table-name ai-career-jobs \
  --attribute-definitions \
    AttributeName=jobId,AttributeType=S \
    AttributeName=userId,AttributeType=S \
  --key-schema \
    AttributeName=jobId,KeyType=HASH \
  --global-secondary-indexes \
    "[{\"IndexName\":\"UserIdIndex\",\"KeySchema\":[{\"AttributeName\":\"userId\",\"KeyType\":\"HASH\"}],\"Projection\":{\"ProjectionType\":\"ALL\"},\"ProvisionedThroughput\":{\"ReadCapacityUnits\":5,\"WriteCapacityUnits\":5}}]" \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

# 3. Create Applications Table
aws dynamodb create-table \
  --table-name ai-career-applications \
  --attribute-definitions \
    AttributeName=applicationId,AttributeType=S \
    AttributeName=userId,AttributeType=S \
  --key-schema \
    AttributeName=applicationId,KeyType=HASH \
  --global-secondary-indexes \
    "[{\"IndexName\":\"UserIdIndex\",\"KeySchema\":[{\"AttributeName\":\"userId\",\"KeyType\":\"HASH\"}],\"Projection\":{\"ProjectionType\":\"ALL\"},\"ProvisionedThroughput\":{\"ReadCapacityUnits\":5,\"WriteCapacityUnits\":5}}]" \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

### Step 2: Verify Tables Created

```bash
aws dynamodb list-tables --region us-east-1
```

You should see:

- ai-career-users
- ai-career-jobs
- ai-career-applications

---

## 📊 Table Schemas

### Users Table

```
Primary Key: userId (String)
GSI: EmailIndex (email)

Attributes:
- userId: String (UUID)
- email: String
- name: String
- createdAt: String (ISO timestamp)
- updatedAt: String (ISO timestamp)
- profile: Map
  - currentRole: String
  - targetRole: String
  - skills: List<String>
  - experience: String
  - graduationDate: String
  - location: String
  - salaryExpectation: Number
```

### Jobs Table

```
Primary Key: jobId (String)
GSI: UserIdIndex (userId)

Attributes:
- jobId: String (UUID)
- userId: String
- title: String
- company: String
- location: String
- salary: Map
- description: String
- requirements: List<String>
- compatibilityScore: Number
- saved: Boolean
- appliedDate: String
- createdAt: String
```

### Applications Table

```
Primary Key: applicationId (String)
GSI: UserIdIndex (userId)

Attributes:
- applicationId: String (UUID)
- userId: String
- jobId: String
- status: String (applied, interviewing, offered, rejected)
- appliedDate: String
- notes: String
- interviewDates: List<String>
- createdAt: String
- updatedAt: String
```

---

## 🔧 Install AWS SDK

```bash
cd server
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb uuid
```

---

## ✅ Done!

Tables are ready. Now implement the service layer in your code.

# 🔧 Update IAM Policy for Complete AWS Access

## 🎯 **ISSUE**

Your current IAM user `career-app-access` doesn't have permissions to:

- Create S3 buckets
- Access DynamoDB tables
- Use the correct Bedrock model

## 🔑 **SOLUTION: Update IAM Policy**

### **Step 1: Go to AWS Console**

1. Open [AWS IAM Console](https://console.aws.amazon.com/iam/)
2. Go to **Users** → **career-app-access**
3. Click **Permissions** tab
4. Find your existing policy and click **Edit**

### **Step 2: Replace Policy with Complete Version**

Replace your current policy with this complete one:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "S3FullAccess",
      "Effect": "Allow",
      "Action": [
        "s3:CreateBucket",
        "s3:DeleteBucket",
        "s3:ListBucket",
        "s3:GetBucketLocation",
        "s3:GetBucketPolicy",
        "s3:PutBucketPolicy",
        "s3:DeleteBucketPolicy",
        "s3:GetBucketCors",
        "s3:PutBucketCors",
        "s3:GetBucketWebsite",
        "s3:PutBucketWebsite",
        "s3:DeleteBucketWebsite",
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListAllMyBuckets"
      ],
      "Resource": [
        "arn:aws:s3:::aicareeragentcoach*",
        "arn:aws:s3:::aicareeragentcoach*/*"
      ]
    },
    {
      "Sid": "DynamoDBFullAccess",
      "Effect": "Allow",
      "Action": [
        "dynamodb:CreateTable",
        "dynamodb:DeleteTable",
        "dynamodb:DescribeTable",
        "dynamodb:ListTables",
        "dynamodb:UpdateTable",
        "dynamodb:UpdateTimeToLive",
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:BatchGetItem",
        "dynamodb:BatchWriteItem"
      ],
      "Resource": [
        "arn:aws:dynamodb:*:*:table/aicareeragentcoach*",
        "arn:aws:dynamodb:*:*:table/aicareeragentcoach*/index/*"
      ]
    },
    {
      "Sid": "BedrockAccess",
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream",
        "bedrock:ListFoundationModels",
        "bedrock:GetFoundationModel"
      ],
      "Resource": [
        "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-5-haiku-20241022-v1:0",
        "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0",
        "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-opus-20240229-v1:0"
      ]
    },
    {
      "Sid": "CloudWatchLogs",
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:DescribeLogGroups",
        "logs:DescribeLogStreams"
      ],
      "Resource": "arn:aws:logs:*:*:log-group:/aws/lambda/aicareeragentcoach*"
    }
  ]
}
```

### **Step 3: Save and Test**

1. Click **Save changes**
2. Wait 1-2 minutes for propagation
3. Run the setup script again

## 🚀 **AFTER UPDATING POLICY**

Run these commands to set up your infrastructure:

```bash
# Setup S3 buckets and DynamoDB tables
node scripts/setup-aws-infrastructure.js

# Check status
node scripts/check-aws-status.js
```

## 📋 **WHAT THIS POLICY ENABLES**

### **S3 Permissions:**

- ✅ Create/delete buckets for file storage
- ✅ Upload/download files (resumes, generated content)
- ✅ Configure CORS for React app
- ✅ Set bucket policies for security

### **DynamoDB Permissions:**

- ✅ Create tables for users, resumes, jobs, sessions
- ✅ Read/write data for your React app
- ✅ Query and scan operations
- ✅ Batch operations for performance

### **Bedrock Permissions:**

- ✅ Access Claude 3.5 Haiku for AI features
- ✅ Access Claude 3 Sonnet for advanced features
- ✅ Stream responses for real-time AI

### **CloudWatch Permissions:**

- ✅ Log application events
- ✅ Monitor performance
- ✅ Debug issues

## ⚡ **QUICK ALTERNATIVE**

If you want to test quickly, you can also attach these AWS managed policies:

- `AmazonS3FullAccess`
- `AmazonDynamoDBFullAccess`
- `AmazonBedrockFullAccess`

But the custom policy above is more secure and follows least-privilege principle.

## 🔒 **SECURITY NOTE**

This policy is scoped to only resources starting with `aicareeragentcoach*`, so it won't affect other AWS resources in your account.

**Update your IAM policy and then we can proceed with setting up S3 and DynamoDB! 🚀**

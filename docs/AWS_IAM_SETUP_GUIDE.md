# 🔐 AWS IAM Setup Guide for Career Copilot

## 🚨 STEP-BY-STEP IAM USER CREATION

### Step 1: Create IAM Policy (Do This First)

1. **Open AWS Console** → **IAM** → **Policies** → **Create policy**

2. **Select JSON tab** and paste this exact policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "BedrockModelAccess",
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": [
        "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-5-haiku-20241022-v1:0",
        "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0",
        "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-opus-20240229-v1:0",
        "arn:aws:bedrock:*::foundation-model/anthropic.*"
      ]
    },
    {
      "Sid": "BedrockListModels",
      "Effect": "Allow",
      "Action": ["bedrock:ListFoundationModels", "bedrock:GetFoundationModel"],
      "Resource": "*"
    },
    {
      "Sid": "DynamoDBAccess",
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:BatchGetItem",
        "dynamodb:BatchWriteItem"
      ],
      "Resource": [
        "arn:aws:dynamodb:us-east-1:*:table/career-copilot-users",
        "arn:aws:dynamodb:us-east-1:*:table/career-copilot-users/*"
      ]
    },
    {
      "Sid": "S3BucketAccess",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::career-copilot-uploads",
        "arn:aws:s3:::career-copilot-uploads/*"
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
      "Resource": "arn:aws:logs:us-east-1:*:log-group:/aws/lambda/career-copilot*"
    }
  ]
}
```

3. **Click "Next"**

4. **Name the policy**: `CareerCopilotBedrockPolicy`

5. **Description**: `Minimal permissions for Career Copilot AI application - Bedrock, DynamoDB, S3`

6. **Click "Create policy"**

### Step 2: Create IAM User

1. **Go to IAM** → **Users** → **Create user**

2. **User name**: `career-copilot-app`

3. **Select**: "Attach policies directly"

4. **Search for**: `CareerCopilotBedrockPolicy` (the policy you just created)

5. **Check the box** next to your policy

6. **Click "Next"** → **Create user**

### Step 3: Create Access Keys

1. **Click on the user** you just created (`career-copilot-app`)

2. **Go to "Security credentials" tab**

3. **Click "Create access key"**

4. **Select**: "Application running outside AWS"

5. **Check**: "I understand the above recommendation..."

6. **Click "Next"**

7. **Description**: `Career Copilot Application Keys`

8. **Click "Create access key"**

9. **⚠️ IMPORTANT**: Copy both keys immediately:
   - **Access Key ID**: `AKIA...`
   - **Secret Access Key**: `...`

### Step 4: Delete Old Compromised User

1. **Go to IAM** → **Users**

2. **Find the user** with the compromised key `AKIA6IXOQF5LPWL3RQSM`

3. **Click on the user** → **Security credentials**

4. **Delete the compromised access key**

5. **Or delete the entire user** if it's no longer needed

## 🔧 UPDATE YOUR ENVIRONMENT FILES

### Frontend (.env)

```env
# Replace with your NEW credentials
VITE_AWS_REGION=us-east-1
VITE_AWS_ACCESS_KEY_ID=AKIA_YOUR_NEW_KEY_HERE
VITE_AWS_SECRET_ACCESS_KEY=YOUR_NEW_SECRET_HERE
VITE_BEDROCK_MODEL_ID=us.anthropic.claude-3-5-haiku-20241022-v1:0
```

### Backend (backend/.env)

```env
# Add AWS credentials for backend services
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA_YOUR_NEW_KEY_HERE
AWS_SECRET_ACCESS_KEY=YOUR_NEW_SECRET_HERE
DYNAMODB_TABLE_NAME=career-copilot-users
S3_BUCKET_NAME=career-copilot-uploads
```

## 🧪 TEST YOUR SETUP

### Test Bedrock Access

```bash
# Run this in your project directory
node -e "
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const client = new BedrockRuntimeClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'YOUR_NEW_ACCESS_KEY',
    secretAccessKey: 'YOUR_NEW_SECRET_KEY'
  }
});

async function test() {
  try {
    const command = new InvokeModelCommand({
      modelId: 'us.anthropic.claude-3-5-haiku-20241022-v1:0',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 100,
        messages: [{ role: 'user', content: 'Hello, test message' }]
      })
    });

    const response = await client.send(command);
    console.log('✅ Bedrock access successful!');
  } catch (error) {
    console.error('❌ Bedrock access failed:', error.message);
  }
}

test();
"
```

## 🛡️ SECURITY BEST PRACTICES

### ✅ What This Policy Does (Minimal Permissions)

- **Bedrock**: Only invoke Claude models for AI features
- **DynamoDB**: Only access your specific user table
- **S3**: Only access your specific upload bucket
- **CloudWatch**: Only create logs for monitoring

### ❌ What This Policy Does NOT Allow

- No EC2 instance creation
- No billing access
- No IAM modifications
- No other AWS services
- No access to other accounts' resources

### 🔒 Additional Security Measures

1. **Enable MFA** on your AWS root account
2. **Set up billing alerts** to monitor usage
3. **Regularly rotate access keys** (every 90 days)
4. **Monitor CloudTrail** for unusual activity
5. **Use least privilege principle**

## 🚨 EMERGENCY PROCEDURES

### If Keys Are Compromised Again

1. **Immediately disable** the access key in IAM
2. **Create new access key** for the same user
3. **Update environment files** with new credentials
4. **Check CloudTrail** for unauthorized usage
5. **Monitor billing** for unexpected charges

### If Unusual Activity Detected

1. **Disable access key** immediately
2. **Check CloudTrail logs** for the past 24 hours
3. **Review billing** for unexpected charges
4. **Contact AWS Support** if needed
5. **Rotate all credentials**

## ✅ VERIFICATION CHECKLIST

- [ ] Created IAM policy with minimal permissions
- [ ] Created new IAM user with policy attached
- [ ] Generated new access keys
- [ ] Updated .env files with new credentials
- [ ] Deleted/disabled old compromised keys
- [ ] Tested Bedrock access
- [ ] Verified application functionality
- [ ] Set up monitoring and alerts

## 🎯 NEXT STEPS

1. **Complete this IAM setup** (should take 10-15 minutes)
2. **Test your application** with new credentials
3. **Set up Stripe payments** (next major task)
4. **Deploy to production** with proper security

Your AWS setup will now be secure with minimal permissions following the principle of least privilege! 🔐

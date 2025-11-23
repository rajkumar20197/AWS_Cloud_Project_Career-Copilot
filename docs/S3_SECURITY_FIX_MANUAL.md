# 🔒 S3 Bucket Security - Manual Fix Guide

## ⚠️ Current Status

You have an S3 bucket: `ai-career-agent-980826468182`

**Potential Security Risk:** If it's publicly accessible, anyone can:

- View your files
- Download your data
- Potentially upload malicious files
- Rack up your AWS bill

---

## 🎯 Quick Security Check (Do This First!)

### Option 1: AWS Console (Easiest - 2 minutes)

1. **Go to AWS Console:**

   - Open: https://console.aws.amazon.com/s3/
   - Sign in with your AWS account

2. **Find Your Bucket:**

   - Look for: `ai-career-agent-980826468182`
   - Click on it

3. **Check Permissions Tab:**

   - Click "Permissions" tab
   - Look for "Block public access" section

4. **What You Should See:**

   ```
   ✅ Block all public access: ON
   ```

5. **If It Says "OFF" - FIX IT NOW:**
   - Click "Edit" button
   - Check ALL 4 boxes:
     ☑ Block public access to buckets and objects granted through new access control lists (ACLs)
     ☑ Block public access to buckets and objects granted through any access control lists (ACLs)
     ☑ Block public access to buckets and objects granted through new public bucket or access point policies
     ☑ Block public and cross-account access to buckets and objects through any public bucket or access point policies
   - Click "Save changes"
   - Type "confirm" when prompted
   - Click "Confirm"

---

### Option 2: Command Line (Quick - 30 seconds)

**Run this command in your terminal:**

```bash
# Block all public access
aws s3api put-public-access-block \
  --bucket ai-career-agent-980826468182 \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

**Verify it worked:**

```bash
# Check the settings
aws s3api get-public-access-block --bucket ai-career-agent-980826468182
```

**You should see:**

```json
{
  "PublicAccessBlockConfiguration": {
    "BlockPublicAcls": true,
    "IgnorePublicAcls": true,
    "BlockPublicPolicy": true,
    "RestrictPublicBuckets": true
  }
}
```

---

## 🔍 Additional Security Checks

### 1. Check Bucket Policy

**Command:**

```bash
aws s3api get-bucket-policy --bucket ai-career-agent-980826468182
```

**If you see a policy, check if it has:**

- `"Principal": "*"` (BAD - means anyone)
- `"Effect": "Allow"` with `"Principal": "*"` (BAD)

**To remove a public policy:**

```bash
aws s3api delete-bucket-policy --bucket ai-career-agent-980826468182
```

### 2. Check ACLs (Access Control Lists)

**Command:**

```bash
aws s3api get-bucket-acl --bucket ai-career-agent-980826468182
```

**Safe ACL should only show:**

- Your AWS account ID
- No "AllUsers" or "AuthenticatedUsers"

### 3. Enable Encryption

**Command:**

```bash
aws s3api put-bucket-encryption \
  --bucket ai-career-agent-980826468182 \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'
```

### 4. Enable Versioning (Recommended)

**Command:**

```bash
aws s3api put-bucket-versioning \
  --bucket ai-career-agent-980826468182 \
  --versioning-configuration Status=Enabled
```

---

## ✅ Complete Security Checklist

Run these commands one by one:

```bash
# 1. Block public access
aws s3api put-public-access-block \
  --bucket ai-career-agent-980826468182 \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

# 2. Enable encryption
aws s3api put-bucket-encryption \
  --bucket ai-career-agent-980826468182 \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'

# 3. Enable versioning
aws s3api put-bucket-versioning \
  --bucket ai-career-agent-980826468182 \
  --versioning-configuration Status=Enabled

# 4. Verify everything
echo "=== Public Access Block ==="
aws s3api get-public-access-block --bucket ai-career-agent-980826468182

echo "=== Encryption ==="
aws s3api get-bucket-encryption --bucket ai-career-agent-980826468182

echo "=== Versioning ==="
aws s3api get-bucket-versioning --bucket ai-career-agent-980826468182
```

---

## 🚨 If You Need Public Access (For Website Hosting)

**Only do this if you're hosting a static website!**

### Safe Public Access Configuration:

1. **Keep Block Public Access ON for most things**
2. **Use CloudFront instead** (CDN - more secure)
3. **If you must make it public:**

```bash
# Create a bucket policy that only allows read access
aws s3api put-bucket-policy --bucket ai-career-agent-980826468182 --policy '{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::ai-career-agent-980826468182/*"
  }]
}'
```

**But this is NOT recommended!** Use CloudFront instead.

---

## 🛡️ Best Practices

### ✅ DO:

- ✅ Block all public access by default
- ✅ Enable encryption
- ✅ Enable versioning
- ✅ Use IAM roles for access
- ✅ Enable CloudTrail logging
- ✅ Use CloudFront for public content
- ✅ Set up lifecycle policies
- ✅ Monitor access logs

### ❌ DON'T:

- ❌ Make buckets public unless absolutely necessary
- ❌ Store sensitive data without encryption
- ❌ Use overly permissive policies
- ❌ Share AWS credentials
- ❌ Ignore security warnings
- ❌ Leave default settings

---

## 🔐 Secure Access Methods

### For Your Application:

**Use IAM Roles (Best Practice):**

```javascript
// In your backend code
const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  region: "us-east-1",
  // Uses IAM role credentials automatically
});

// Upload file securely
await s3
  .putObject({
    Bucket: "ai-career-agent-980826468182",
    Key: "resumes/user-123.pdf",
    Body: fileBuffer,
    ServerSideEncryption: "AES256",
  })
  .promise();

// Generate temporary signed URL for download
const url = s3.getSignedUrl("getObject", {
  Bucket: "ai-career-agent-980826468182",
  Key: "resumes/user-123.pdf",
  Expires: 3600, // 1 hour
});
```

---

## 📊 Cost Impact

**Secure S3 bucket costs:**

- Storage: $0.023 per GB/month
- Requests: $0.0004 per 1,000 GET requests
- Encryption: FREE
- Versioning: Stores multiple versions (costs more storage)

**Example:**

- 100 users × 1MB resume = 100MB = $0.002/month
- Very cheap! 💰

---

## 🚨 Emergency: If Your Bucket Was Hacked

### Immediate Actions:

1. **Block all access immediately:**

```bash
aws s3api put-public-access-block \
  --bucket ai-career-agent-980826468182 \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

2. **Check what's in the bucket:**

```bash
aws s3 ls s3://ai-career-agent-980826468182 --recursive
```

3. **Delete suspicious files:**

```bash
aws s3 rm s3://ai-career-agent-980826468182/suspicious-file.txt
```

4. **Review CloudTrail logs:**

   - Go to AWS CloudTrail console
   - Check who accessed your bucket
   - Look for unauthorized IPs

5. **Rotate AWS credentials:**
   - Go to IAM console
   - Delete old access keys
   - Create new ones
   - Update your .env file

---

## ✅ Verification Commands

**Run these to verify your bucket is secure:**

```bash
# 1. Check public access block
aws s3api get-public-access-block --bucket ai-career-agent-980826468182

# 2. Check bucket policy (should error if none exists - that's good!)
aws s3api get-bucket-policy --bucket ai-career-agent-980826468182

# 3. Check ACL
aws s3api get-bucket-acl --bucket ai-career-agent-980826468182

# 4. Check encryption
aws s3api get-bucket-encryption --bucket ai-career-agent-980826468182

# 5. List contents (make sure nothing suspicious)
aws s3 ls s3://ai-career-agent-980826468182 --recursive
```

---

## 📝 Summary

### Quick Fix (2 minutes):

1. Go to AWS Console → S3
2. Click your bucket
3. Permissions tab
4. Turn ON "Block all public access"
5. Done! ✅

### Complete Fix (5 minutes):

1. Block public access
2. Enable encryption
3. Enable versioning
4. Verify settings
5. Done! ✅

---

## 🎯 What You Should Do RIGHT NOW:

### Step 1: Check Security (30 seconds)

```bash
aws s3api get-public-access-block --bucket ai-career-agent-980826468182
```

### Step 2: If Not Secure, Fix It (30 seconds)

```bash
aws s3api put-public-access-block \
  --bucket ai-career-agent-980826468182 \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

### Step 3: Verify (30 seconds)

```bash
aws s3api get-public-access-block --bucket ai-career-agent-980826468182
```

**That's it! Your bucket is now secure! 🔒**

---

**Need help?** Just run the commands above or use the AWS Console. It's super easy! 💪

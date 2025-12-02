# How to Check User Registration Count

## AWS Cognito User Pool Analytics

---

## 🎯 **Your Cognito Configuration**

- **User Pool ID:** `us-east-1_RbxnBYOCS`
- **Region:** `us-east-1`
- **Client ID:** `5a6kq9althf2te07sv157a26so`

---

## 🚀 **Quick Methods to Check User Count**

### **Method 1: Run the PowerShell Script (Recommended)**

```powershell
# Run the automated script
.\check-user-count.ps1
```

### **Method 2: Run the Node.js Script**

```bash
# Run the Node.js script
node check-user-count.js
```

### **Method 3: Direct AWS CLI Commands**

#### **Quick User Count:**

```bash
aws cognito-idp list-users \
  --user-pool-id us-east-1_RbxnBYOCS \
  --region us-east-1 \
  --query "Users[].Username" \
  --output json | jq length
```

#### **Detailed User Information:**

```bash
aws cognito-idp list-users \
  --user-pool-id us-east-1_RbxnBYOCS \
  --region us-east-1 \
  --output table
```

#### **User Pool Statistics:**

```bash
aws cognito-idp describe-user-pool \
  --user-pool-id us-east-1_RbxnBYOCS \
  --region us-east-1 \
  --query "UserPool.{Name:Name,Status:Status,CreationDate:CreationDate,EstimatedUsers:EstimatedNumberOfUsers}"
```

---

## 📊 **What You'll See**

### **User Information Includes:**

- **Total registered users**
- **User status** (CONFIRMED, UNCONFIRMED, etc.)
- **Email addresses** and verification status
- **Registration dates** and timeline
- **User creation statistics**

### **Sample Output:**

```
✅ Total Registered Users: 5

👥 Registered Users:
   1. user123
   2. alex.johnson@email.com
   3. demo.user@example.com
   4. test.student@university.edu
   5. career.seeker@gmail.com

📊 Status Summary:
   CONFIRMED: 4 users
   UNCONFIRMED: 1 user

📅 Registration Timeline:
   First User: 2024-12-15 10:30:00
   Latest User: 2024-12-20 14:45:00
   Registered Today: 2 users
   Registered This Week: 5 users
```

---

## 🔧 **Prerequisites**

### **1. AWS CLI Installation**

```bash
# Check if AWS CLI is installed
aws --version

# If not installed, download from:
# https://aws.amazon.com/cli/
```

### **2. AWS Credentials Configuration**

```bash
# Configure AWS credentials
aws configure

# You'll need:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region: us-east-1
# - Default output format: json
```

### **3. Required Permissions**

Your AWS user needs these permissions:

- `cognito-idp:ListUsers`
- `cognito-idp:DescribeUserPool`
- `cognito-idp:AdminGetUser`

---

## 🎯 **For Class Demo**

### **Show User Registration Analytics:**

1. **Run the script** before your presentation
2. **Take screenshots** of user count and details
3. **Demonstrate** real user registration system
4. **Highlight** authentication security

### **Key Metrics to Show:**

- **Total registered users**
- **Email verification status**
- **Registration timeline**
- **User status breakdown**

### **Demo Script:**

_"Let me show you the real user registration data from our AWS Cognito user pool. As you can see, we have [X] registered users with proper email verification and secure authentication."_

---

## 📱 **Alternative: AWS Console Method**

### **Via AWS Management Console:**

1. **Go to:** https://console.aws.amazon.com/cognito/
2. **Select:** User Pools
3. **Choose:** `us-east-1_RbxnBYOCS`
4. **Click:** Users tab
5. **View:** All registered users and statistics

### **Console Benefits:**

- Visual interface
- User management options
- Real-time statistics
- Export capabilities

---

## 🔍 **Troubleshooting**

### **Common Issues:**

#### **"AWS CLI not found"**

```bash
# Install AWS CLI v2
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

#### **"Access Denied"**

```bash
# Check your credentials
aws sts get-caller-identity

# Reconfigure if needed
aws configure
```

#### **"User Pool not found"**

- Verify the User Pool ID: `us-east-1_RbxnBYOCS`
- Check the region: `us-east-1`
- Ensure you have proper permissions

---

## 📊 **Expected Results for Demo**

### **If You Have Test Users:**

- Show real registration data
- Demonstrate email verification
- Highlight security features

### **If No Users Yet:**

- Create a test account during demo
- Show the registration process
- Verify email confirmation flow

### **Professional Presentation:**

_"This demonstrates our production-ready authentication system using AWS Cognito, with real user management and security features."_

---

## 🎯 **Quick Commands Summary**

```bash
# 1. Quick count
aws cognito-idp list-users --user-pool-id us-east-1_RbxnBYOCS --region us-east-1 --query "Users[].Username" --output json | jq length

# 2. Detailed info
aws cognito-idp list-users --user-pool-id us-east-1_RbxnBYOCS --region us-east-1 --output table

# 3. Pool stats
aws cognito-idp describe-user-pool --user-pool-id us-east-1_RbxnBYOCS --region us-east-1

# 4. Run automated script
.\check-user-count.ps1
```

---

**This gives you complete visibility into your user registration system for both development and presentation purposes!** 🚀

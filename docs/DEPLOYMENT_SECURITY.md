# Deployment Security Guide

Complete guide on what to exclude from deployment and how to secure your production environment.

---

## 🚫 Files That Should NEVER Be Deployed

### 1. Environment Variables (.env files)

```
❌ .env
❌ .env.local
❌ .env.production
❌ .env.development
```

**Why:** Contains API keys, database passwords, secrets
**Instead:** Use AWS Secrets Manager or environment variables in deployment platform

---

### 2. AWS Credentials

```
❌ .aws/credentials
❌ aws-credentials.json
❌ credentials.json
❌ config.json
```

**Why:** Direct access to your AWS account
**Instead:** Use IAM roles for EC2/ECS/Lambda

---

### 3. SSL Certificates & Private Keys

```
❌ *.pem
❌ *.key
❌ *.cert
❌ private-key.pem
❌ certificate.pem
```

**Why:** Can be used to impersonate your site
**Instead:** Use AWS Certificate Manager (ACM)

---

### 4. Database Files

```
❌ *.db
❌ *.sqlite
❌ *.sql
❌ database-backup.sql
```

**Why:** Contains all user data
**Instead:** Use managed databases (RDS, DynamoDB)

---

### 5. Log Files

```
❌ *.log
❌ logs/
❌ npm-debug.log
❌ error.log
```

**Why:** May contain sensitive information, stack traces, API keys
**Instead:** Use CloudWatch Logs

---

### 6. Node Modules

```
❌ node_modules/
```

**Why:** Huge size (100MB+), can be rebuilt
**Instead:** Run `npm install` on server

---

### 7. Development Files

```
❌ .vscode/
❌ .idea/
❌ *.swp
❌ .DS_Store
❌ Thumbs.db
```

**Why:** Not needed in production, waste space
**Instead:** Only deploy production code

---

### 8. Test Files

```
❌ *.test.js
❌ *.spec.js
❌ __tests__/
❌ coverage/
```

**Why:** Not needed in production
**Instead:** Run tests in CI/CD, not production

---

### 9. Documentation (Optional)

```
❌ docs/
❌ README.md
❌ TODO.md
❌ notes/
```

**Why:** Not needed for app to run, can expose internal info
**Instead:** Host docs separately or keep in repo only

---

### 10. User Uploaded Files

```
❌ uploads/
❌ user-data/
❌ temp-uploads/
```

**Why:** Should be in S3, not on server
**Instead:** Store in S3 bucket

---

## ✅ Files That SHOULD Be Deployed

### Frontend:

```
✅ dist/ or build/ (production build)
✅ index.html
✅ assets/ (CSS, JS, images)
✅ public/ (static files)
```

### Backend:

```
✅ src/ or dist/ (compiled code)
✅ package.json
✅ server.js or index.js
✅ routes/
✅ controllers/
✅ middleware/
✅ services/
```

### Configuration:

```
✅ package.json (dependencies list)
✅ .gitignore
✅ .dockerignore
✅ Dockerfile
```

---

## 🔐 Secure Deployment Checklist

### Before Deployment:

#### 1. Check .gitignore

```bash
# Verify .env is ignored
git check-ignore .env
# Should output: .env

# Check what will be committed
git status
# Should NOT show .env, node_modules, etc.
```

#### 2. Remove Sensitive Files

```bash
# Find all .env files
find . -name ".env*"

# Find all credential files
find . -name "*credentials*"

# Find all key files
find . -name "*.pem" -o -name "*.key"
```

#### 3. Scan for Secrets

```bash
# Install git-secrets
brew install git-secrets  # macOS
# or
apt-get install git-secrets  # Linux

# Scan repository
git secrets --scan

# Scan history
git secrets --scan-history
```

#### 4. Check File Sizes

```bash
# Find large files (>10MB)
find . -type f -size +10M

# Check total size
du -sh .
```

---

## 🚀 Deployment Methods

### Method 1: AWS Elastic Beanstalk

**What to deploy:**

```
✅ Source code (without node_modules)
✅ package.json
✅ .ebextensions/ (config)
```

**What NOT to deploy:**

```
❌ .env (use EB environment variables)
❌ node_modules (EB installs them)
❌ .git/ (not needed)
```

**Deploy command:**

```bash
# Create .ebignore
cp .gitignore .ebignore

# Deploy
eb deploy
```

---

### Method 2: Docker + ECS

**Dockerfile:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/
COPY public/ ./public/

# Don't copy .env, node_modules, etc.

EXPOSE 3000
CMD ["node", "src/server.js"]
```

**.dockerignore:**

```
.env
.env.*
node_modules/
.git/
docs/
*.md
```

---

### Method 3: AWS Lambda

**What to deploy:**

```
✅ Lambda function code
✅ node_modules (only production)
✅ package.json
```

**What NOT to deploy:**

```
❌ .env (use Lambda environment variables)
❌ Dev dependencies
❌ Test files
```

**Deploy:**

```bash
# Install only production dependencies
npm ci --only=production

# Create deployment package
zip -r function.zip . -x "*.git*" "*.env*" "docs/*"

# Deploy to Lambda
aws lambda update-function-code \
  --function-name career-copilot \
  --zip-file fileb://function.zip
```

---

## 🔒 Environment Variables in Production

### ❌ DON'T: Hardcode in code

```javascript
// BAD!
const apiKey = "sk_live_abc123";
```

### ❌ DON'T: Commit .env file

```bash
# BAD!
git add .env
git commit -m "Add env file"
```

### ✅ DO: Use AWS Secrets Manager

```javascript
const AWS = require("aws-sdk");
const secretsManager = new AWS.SecretsManager();

async function getSecret(secretName) {
  const data = await secretsManager
    .getSecretValue({ SecretId: secretName })
    .promise();
  return JSON.parse(data.SecretString);
}

// Usage
const secrets = await getSecret("career-copilot/production");
const apiKey = secrets.STRIPE_SECRET_KEY;
```

### ✅ DO: Use Environment Variables

```bash
# Set in AWS Console or CLI
aws lambda update-function-configuration \
  --function-name career-copilot \
  --environment Variables="{
    STRIPE_SECRET_KEY=sk_live_...,
    JWT_SECRET=super-secret-key
  }"
```

---

## 🛡️ Security Best Practices

### 1. Use .gitignore Properly

```bash
# Create .gitignore before first commit
touch .gitignore

# Add sensitive files
echo ".env" >> .gitignore
echo "node_modules/" >> .gitignore
echo "*.log" >> .gitignore

# Commit .gitignore
git add .gitignore
git commit -m "Add gitignore"
```

### 2. Remove Accidentally Committed Secrets

```bash
# If you already committed .env
git rm --cached .env
git commit -m "Remove .env from tracking"

# Remove from history (DANGEROUS!)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (only if repo is private and you're sure!)
git push origin --force --all
```

### 3. Rotate Compromised Secrets

```bash
# If secrets were exposed:
1. Immediately rotate all API keys
2. Change all passwords
3. Revoke compromised tokens
4. Generate new JWT secret
5. Update all services
```

### 4. Use Separate Environments

```
Development: .env.development
Staging: .env.staging
Production: AWS Secrets Manager
```

### 5. Audit Access

```bash
# Check who has access to secrets
aws secretsmanager describe-secret \
  --secret-id career-copilot/production

# Review IAM policies
aws iam list-attached-user-policies \
  --user-name your-username
```

---

## 📦 Deployment Package Structure

### Good Structure:

```
deployment-package/
├── src/
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   └── services/
├── package.json
├── package-lock.json
└── .ebignore or .dockerignore
```

### Bad Structure:

```
deployment-package/
├── .env ❌
├── .git/ ❌
├── node_modules/ ❌
├── docs/ ❌
├── *.log ❌
├── credentials.json ❌
└── src/
```

---

## 🔍 Pre-Deployment Security Scan

### Run These Commands:

```bash
# 1. Check for secrets in code
npm install -g trufflehog
trufflehog filesystem . --json

# 2. Check for vulnerabilities
npm audit

# 3. Check dependencies
npm outdated

# 4. Scan for malware
clamscan -r .

# 5. Check file permissions
find . -type f -perm 777
```

---

## 📋 Deployment Checklist

### Before Every Deployment:

- [ ] Run `git status` - verify no sensitive files
- [ ] Check `.gitignore` is up to date
- [ ] Run `npm audit` - check for vulnerabilities
- [ ] Remove all `.env` files from deployment
- [ ] Verify secrets are in AWS Secrets Manager
- [ ] Test with production-like environment
- [ ] Run security scan
- [ ] Check file sizes (no huge files)
- [ ] Verify HTTPS is enabled
- [ ] Enable CloudWatch logging
- [ ] Set up monitoring and alerts
- [ ] Create backup before deployment
- [ ] Document deployment process
- [ ] Have rollback plan ready

---

## 🚨 If Secrets Are Exposed

### Immediate Actions:

1. **Rotate all secrets** (API keys, passwords, tokens)
2. **Revoke compromised credentials**
3. **Check logs** for unauthorized access
4. **Notify users** if data was accessed
5. **Update security policies**
6. **Review access logs**
7. **Implement additional monitoring**

### AWS Secrets Rotation:

```bash
# Rotate Stripe key
1. Generate new key in Stripe Dashboard
2. Update in AWS Secrets Manager
3. Deploy new version
4. Revoke old key

# Rotate JWT secret
1. Generate new secret: openssl rand -base64 32
2. Update in Secrets Manager
3. Deploy (users will need to re-login)
```

---

## 💰 Cost of Security Mistakes

### If .env is exposed:

- Stripe charges: **Unlimited** (attacker can charge cards)
- AWS charges: **Unlimited** (attacker can spin up resources)
- Data breach fines: **$50,000 - $1,000,000+**
- Reputation damage: **Priceless**

### Prevention cost:

- AWS Secrets Manager: **$0.40/month per secret**
- Proper .gitignore: **FREE**
- Security audit: **1 hour of your time**

**Conclusion: Prevention is 1,000,000x cheaper than recovery!**

---

## ✅ Summary

### Never Deploy:

- ❌ .env files
- ❌ AWS credentials
- ❌ SSL private keys
- ❌ Database files
- ❌ Log files
- ❌ node_modules
- ❌ Test files
- ❌ User uploads

### Always Deploy:

- ✅ Production build
- ✅ package.json
- ✅ Source code
- ✅ .gitignore
- ✅ .dockerignore

### Use Instead:

- ✅ AWS Secrets Manager for secrets
- ✅ IAM roles for AWS access
- ✅ ACM for SSL certificates
- ✅ RDS/DynamoDB for databases
- ✅ CloudWatch for logs
- ✅ S3 for user uploads

---

**Created:** November 19, 2025
**Status:** Production security checklist
**Priority:** CRITICAL - Follow before every deployment!

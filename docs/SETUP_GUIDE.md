# AI Career Agent - Complete Setup Guide

**Last Updated:** November 16, 2024  
**Version:** 1.0.0

This guide contains all commands, packages, and steps needed to run this project on any machine.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation Steps](#installation-steps)
3. [AWS Configuration](#aws-configuration)
4. [Environment Variables](#environment-variables)
5. [Running the Project](#running-the-project)
6. [Troubleshooting](#troubleshooting)
7. [All Commands Reference](#all-commands-reference)

---

## 🔧 Prerequisites

### Required Software

1. **Node.js** (v18 or higher)

   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **npm** (comes with Node.js)

   - Verify: `npm --version`

3. **Git**

   - Download: https://git-scm.com/
   - Verify: `git --version`

4. **AWS CLI** (for DynamoDB setup)
   - Download: https://aws.amazon.com/cli/
   - Verify: `aws --version`

### Required AWS Services

1. **AWS Account** (Free tier eligible)
2. **AWS Bedrock Access** (Request access in AWS Console)
3. **AWS Cognito User Pool** (for authentication)
4. **AWS DynamoDB** (for database)
5. **IAM User with programmatic access**

---

## 📦 Installation Steps

### Step 1: Clone the Repository

```bash
# Clone the project
git clone <your-repo-url>
cd ai-career-agent-aws-bedrock

# Or if you have the project folder already
cd ai-career-agent-aws-bedrock
```

### Step 2: Install Frontend Dependencies

```bash
# Install all frontend packages
npm install
```

**Frontend Packages Installed:**

- React 18.3.1
- Vite 6.3.5 (build tool)
- AWS Amplify 6.15.8 (authentication)
- AWS SDK for Bedrock Runtime 3.913.0
- Radix UI components (accordion, dialog, dropdown, etc.)
- Lucide React (icons)
- Recharts (charts/graphs)
- React Hook Form (form handling)
- Tailwind CSS utilities
- And 30+ other UI/utility packages

**Total Frontend Packages:** ~50 packages

### Step 3: Install Backend Dependencies

```bash
# Navigate to server directory
cd server

# Install all backend packages
npm install

# Return to root directory
cd ..
```

**Backend Packages Installed:**

- Express 4.18.2 (web framework)
- AWS SDK for Bedrock Runtime 3.913.0
- AWS SDK for DynamoDB 3.932.0
- AWS SDK DynamoDB Document Client 3.932.0
- UUID 13.0.0 (unique ID generation)
- CORS 2.8.5 (cross-origin requests)
- Helmet 7.1.0 (security headers)
- Express Rate Limit 7.1.5 (rate limiting)
- Dotenv 16.3.1 (environment variables)
- Nodemon 3.0.2 (dev server auto-restart)

**Total Backend Packages:** ~10 packages + dependencies

---

## ☁️ AWS Configuration

### Step 1: Create IAM User

```bash
# 1. Go to AWS Console → IAM → Users → Create User
# 2. User name: ai-career-agent-user
# 3. Enable "Programmatic access"
# 4. Attach policies:
#    - AmazonBedrockFullAccess
#    - AmazonDynamoDBFullAccess
#    - AmazonCognitoPowerUser
# 5. Save Access Key ID and Secret Access Key
```

### Step 2: Configure AWS CLI

```bash
# Configure AWS credentials
aws configure

# Enter when prompted:
# AWS Access Key ID: <your-access-key>
# AWS Secret Access Key: <your-secret-key>
# Default region name: us-east-1
# Default output format: json

# Verify configuration
aws sts get-caller-identity
```

### Step 3: Request AWS Bedrock Access

```bash
# 1. Go to AWS Console → Bedrock → Model access
# 2. Click "Manage model access"
# 3. Select: Anthropic Claude 3.5 Haiku
# 4. Submit request (usually approved instantly)
# 5. Wait for "Access granted" status
```

### Step 4: Create Cognito User Pool

```bash
# 1. Go to AWS Console → Cognito → Create User Pool
# 2. Configure sign-in options:
#    - Email
# 3. Configure security requirements:
#    - Password: Minimum 8 characters
#    - Require: lowercase, uppercase, numbers, special characters
# 4. Configure sign-up experience:
#    - Enable self-registration
#    - Email verification required
# 5. Configure message delivery:
#    - Send email with Cognito
# 6. Integrate your app:
#    - User pool name: ai-career-agent-users
#    - App client name: ai-career-agent-client
#    - App type: Public client (no secret)
# 7. Save User Pool ID and Client ID
```

### Step 5: Create DynamoDB Tables

```bash
# Create Users table
aws dynamodb create-table \
  --table-name ai-career-users \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
    AttributeName=email,AttributeType=S \
  --key-schema \
    AttributeName=userId,KeyType=HASH \
  --global-secondary-indexes \
    "[{\"IndexName\":\"EmailIndex\",\"KeySchema\":[{\"AttributeName\":\"email\",\"KeyType\":\"HASH\"}],\"Projection\":{\"ProjectionType\":\"ALL\"},\"ProvisionedThroughput\":{\"ReadCapacityUnits\":5,\"WriteCapacityUnits\":5}}]" \
  --provisioned-throughput \
    ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region us-east-1

# Create Jobs table
aws dynamodb create-table \
  --table-name ai-career-jobs \
  --attribute-definitions \
    AttributeName=jobId,AttributeType=S \
    AttributeName=userId,AttributeType=S \
  --key-schema \
    AttributeName=jobId,KeyType=HASH \
  --global-secondary-indexes \
    "[{\"IndexName\":\"UserIdIndex\",\"KeySchema\":[{\"AttributeName\":\"userId\",\"KeyType\":\"HASH\"}],\"Projection\":{\"ProjectionType\":\"ALL\"},\"ProvisionedThroughput\":{\"ReadCapacityUnits\":5,\"WriteCapacityUnits\":5}}]" \
  --provisioned-throughput \
    ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region us-east-1

# Create Applications table
aws dynamodb create-table \
  --table-name ai-career-applications \
  --attribute-definitions \
    AttributeName=applicationId,AttributeType=S \
    AttributeName=userId,AttributeType=S \
  --key-schema \
    AttributeName=applicationId,KeyType=HASH \
  --global-secondary-indexes \
    "[{\"IndexName\":\"UserIdIndex\",\"KeySchema\":[{\"AttributeName\":\"userId\",\"KeyType\":\"HASH\"}],\"Projection\":{\"ProjectionType\":\"ALL\"},\"ProvisionedThroughput\":{\"ReadCapacityUnits\":5,\"WriteCapacityUnits\":5}}]" \
  --provisioned-throughput \
    ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region us-east-1

# Verify tables were created
aws dynamodb list-tables --region us-east-1

# Check table status (should be ACTIVE)
aws dynamodb describe-table --table-name ai-career-users --region us-east-1
aws dynamodb describe-table --table-name ai-career-jobs --region us-east-1
aws dynamodb describe-table --table-name ai-career-applications --region us-east-1
```

---

## 🔐 Environment Variables

### Step 1: Create Frontend .env File

```bash
# Copy example file
cp .env.example .env

# Edit .env file with your values
```

**Frontend .env Configuration:**

```bash
# AWS Configuration
VITE_AWS_REGION=us-east-1
VITE_AWS_ACCESS_KEY_ID=your_access_key_here
VITE_AWS_SECRET_ACCESS_KEY=your_secret_key_here

# AWS Bedrock
VITE_BEDROCK_MODEL_ID=us.anthropic.claude-3-5-haiku-20241022-v1:0

# API Configuration
VITE_API_URL=http://localhost:3001

# Cognito Configuration
VITE_USER_POOL_ID=us-east-1_YourPoolId
VITE_USER_POOL_CLIENT_ID=your_client_id_here

# Environment
VITE_ENVIRONMENT=development
```

### Step 2: Create Backend .env File

```bash
# Navigate to server directory
cd server

# Create .env file
touch .env

# Or on Windows
type nul > .env
```

**Backend server/.env Configuration:**

```bash
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here

# AWS Bedrock
BEDROCK_MODEL_ID=us.anthropic.claude-3-5-haiku-20241022-v1:0

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🚀 Running the Project

### Option 1: Run Both Servers Separately

**Terminal 1 - Frontend:**

```bash
# From project root
npm run dev

# Frontend will start on: http://localhost:3000
```

**Terminal 2 - Backend:**

```bash
# From project root
cd server
npm start

# Backend will start on: http://localhost:3001
```

### Option 2: Run with Development Mode (Auto-restart)

**Terminal 1 - Frontend:**

```bash
npm run dev
```

**Terminal 2 - Backend (with auto-restart):**

```bash
cd server
npm run dev
```

### Verify Everything is Running

1. **Frontend:** Open http://localhost:3000 in browser
2. **Backend Health Check:**

   ```bash
   curl http://localhost:3001/health
   ```

   Should return: `{"status":"healthy","timestamp":"...","environment":"development"}`

3. **Database Health Check:**
   ```bash
   curl http://localhost:3001/api/users/health
   ```
   Should return: `{"success":true,"tables":{...},"message":"DynamoDB service is healthy"}`

---

## 🐛 Troubleshooting

### Issue: "Module not found" errors

**Solution:**

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# For backend
cd server
rm -rf node_modules package-lock.json
npm install
```

### Issue: AWS credentials not working

**Solution:**

```bash
# Verify AWS CLI configuration
aws configure list

# Test credentials
aws sts get-caller-identity

# Reconfigure if needed
aws configure
```

### Issue: DynamoDB tables not found

**Solution:**

```bash
# Check if tables exist
aws dynamodb list-tables --region us-east-1

# If tables don't exist, create them using commands in Step 5 above

# Check table status
aws dynamodb describe-table --table-name ai-career-users --region us-east-1
```

### Issue: Bedrock access denied

**Solution:**

```bash
# 1. Go to AWS Console → Bedrock → Model access
# 2. Verify Claude 3.5 Haiku has "Access granted" status
# 3. If not, request access and wait for approval
# 4. Verify IAM user has AmazonBedrockFullAccess policy
```

### Issue: CORS errors in browser

**Solution:**

```bash
# Check backend .env has correct ALLOWED_ORIGINS
# Should include: http://localhost:3000,http://localhost:5173

# Restart backend server after changing .env
cd server
npm start
```

### Issue: Port already in use

**Solution:**

```bash
# Find process using port 3000 (frontend)
# Windows:
netstat -ano | findstr :3000
taskkill /PID <process_id> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Find process using port 3001 (backend)
# Windows:
netstat -ano | findstr :3001
taskkill /PID <process_id> /F

# Mac/Linux:
lsof -ti:3001 | xargs kill -9
```

---

## 📚 All Commands Reference

### Installation Commands

```bash
# Clone project
git clone <repo-url>
cd ai-career-agent-aws-bedrock

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### AWS CLI Commands

```bash
# Configure AWS
aws configure

# Verify credentials
aws sts get-caller-identity

# List DynamoDB tables
aws dynamodb list-tables --region us-east-1

# Describe table
aws dynamodb describe-table --table-name ai-career-users --region us-east-1

# Delete table (if needed)
aws dynamodb delete-table --table-name ai-career-users --region us-east-1
```

### Development Commands

```bash
# Start frontend (from root)
npm run dev

# Start backend (from root)
cd server && npm start

# Start backend with auto-restart (from root)
cd server && npm run dev

# Build frontend for production
npm run build
```

### Testing Commands

```bash
# Test backend health
curl http://localhost:3001/health

# Test database health
curl http://localhost:3001/api/users/health

# Test Bedrock endpoint (requires authentication)
curl -X POST http://localhost:3001/api/bedrock/analyze \
  -H "Content-Type: application/json" \
  -d '{"resume":"test resume","jobDescription":"test job"}'
```

### Cleanup Commands

```bash
# Remove node_modules
rm -rf node_modules
rm -rf server/node_modules

# Remove package-lock files
rm package-lock.json
rm server/package-lock.json

# Reinstall everything
npm install
cd server && npm install
```

---

## 📦 Complete Package List

### Frontend Dependencies (50+ packages)

**Core:**

- react: ^18.3.1
- react-dom: ^18.3.1
- vite: 6.3.5

**AWS:**

- @aws-amplify/ui-react: ^6.13.1
- @aws-sdk/client-bedrock-runtime: ^3.913.0
- @aws-sdk/credential-providers: ^3.913.0
- aws-amplify: ^6.15.8

**UI Components (Radix UI):**

- @radix-ui/react-accordion: ^1.2.3
- @radix-ui/react-alert-dialog: ^1.1.6
- @radix-ui/react-aspect-ratio: ^1.1.2
- @radix-ui/react-avatar: ^1.1.3
- @radix-ui/react-checkbox: ^1.1.4
- @radix-ui/react-collapsible: ^1.1.3
- @radix-ui/react-context-menu: ^2.2.6
- @radix-ui/react-dialog: ^1.1.6
- @radix-ui/react-dropdown-menu: ^2.1.6
- @radix-ui/react-hover-card: ^1.1.6
- @radix-ui/react-label: ^2.1.2
- @radix-ui/react-menubar: ^1.1.6
- @radix-ui/react-navigation-menu: ^1.2.5
- @radix-ui/react-popover: ^1.1.6
- @radix-ui/react-progress: ^1.1.2
- @radix-ui/react-radio-group: ^1.2.3
- @radix-ui/react-scroll-area: ^1.2.3
- @radix-ui/react-select: ^2.1.6
- @radix-ui/react-separator: ^1.1.2
- @radix-ui/react-slider: ^1.2.3
- @radix-ui/react-slot: ^1.1.2
- @radix-ui/react-switch: ^1.1.3
- @radix-ui/react-tabs: ^1.1.3
- @radix-ui/react-toggle: ^1.1.2
- @radix-ui/react-toggle-group: ^1.1.2
- @radix-ui/react-tooltip: ^1.1.8

**Utilities:**

- class-variance-authority: ^0.7.1
- clsx: \*
- cmdk: ^1.1.1
- embla-carousel-react: ^8.6.0
- input-otp: ^1.4.2
- lucide-react: ^0.487.0
- motion: \*
- next-themes: ^0.4.6
- react-day-picker: ^8.10.1
- react-hook-form: ^7.55.0
- react-resizable-panels: ^2.1.7
- recharts: ^2.15.2
- sonner: ^2.0.3
- tailwind-merge: \*
- vaul: ^1.1.2

**Dev Dependencies:**

- @types/node: ^20.10.0
- @vitejs/plugin-react-swc: ^3.10.2

### Backend Dependencies (10+ packages)

**Core:**

- express: ^4.18.2
- dotenv: ^16.3.1

**AWS:**

- @aws-sdk/client-bedrock-runtime: ^3.913.0
- @aws-sdk/client-dynamodb: ^3.932.0
- @aws-sdk/lib-dynamodb: ^3.932.0

**Utilities:**

- uuid: ^13.0.0
- cors: ^2.8.5
- helmet: ^7.1.0
- express-rate-limit: ^7.1.5

**Dev Dependencies:**

- nodemon: ^3.0.2

---

## 🎯 Quick Start Checklist

- [ ] Install Node.js (v18+)
- [ ] Install AWS CLI
- [ ] Clone repository
- [ ] Run `npm install` in root
- [ ] Run `npm install` in server folder
- [ ] Configure AWS CLI with `aws configure`
- [ ] Request AWS Bedrock access
- [ ] Create Cognito User Pool
- [ ] Create DynamoDB tables
- [ ] Create `.env` file in root
- [ ] Create `.env` file in server folder
- [ ] Start frontend: `npm run dev`
- [ ] Start backend: `cd server && npm start`
- [ ] Open http://localhost:3000
- [ ] Test health endpoints

---

## 📞 Support

If you encounter issues:

1. Check the Troubleshooting section above
2. Verify all environment variables are set correctly
3. Ensure AWS services are properly configured
4. Check that all dependencies are installed
5. Review the console logs for error messages

---

**Last Updated:** November 16, 2024  
**Project Version:** 1.0.0  
**Node Version Required:** 18+  
**AWS Services Used:** Bedrock, Cognito, DynamoDB

**Total Setup Time:** 30-45 minutes (including AWS configuration)

# 🚀 AWS AI Agent Global Hackathon - Quick Setup

## ⚠️ IMPORTANT: AWS Bedrock Setup Required

This project uses **real AWS Bedrock integration** for hackathon compliance. You need:

1. **AWS Account** with Bedrock access
2. **Claude 3.5 Haiku model access** approved
3. **AWS credentials** configured

## 🎯 Quick Start (5 minutes)

### 1. Clone and Install

```bash
git clone <your-repo>
cd ai-career-agent-platform
npm install
```

### 2. AWS Setup

```bash
# Install AWS CLI
# Configure with your credentials
aws configure

# Request Bedrock access (if not done)
# Go to AWS Console → Bedrock → Model Access
# Request access to Claude 3.5 Haiku
```

### 3. Environment Setup

```bash
# Copy example environment
cp .env.example .env

# Edit .env with your AWS credentials
# VITE_AWS_ACCESS_KEY_ID=your_key
# VITE_AWS_SECRET_ACCESS_KEY=your_secret
# VITE_AWS_REGION=us-east-1
```

### 4. Run Application

```bash
npm run dev
```

## ✅ Hackathon Compliance

- ✅ **AWS Bedrock Integration**: Real Claude 3.5 Haiku API calls
- ✅ **AI Agent Qualification**: Autonomous job matching, resume analysis
- ✅ **AWS Services**: Bedrock, Lambda (planned), DynamoDB (planned)
- ✅ **Original Work**: Created for hackathon
- ✅ **Working Demo**: Full functionality

## 🎬 Demo Features

1. **AI Job Matching** - Bedrock analyzes job compatibility
2. **Resume Analysis** - AI-powered resume scoring and suggestions
3. **Career Roadmaps** - Personalized career planning
4. **Market Intelligence** - AI-driven market insights
5. **Interview Prep** - AI-generated interview questions

## 📊 Architecture

```
Frontend (React/TypeScript)
    ↓
AWS Bedrock (Claude 3.5 Haiku)
    ↓
AI Agent Services
    ↓
Career Intelligence Platform
```

## 🏆 Ready for Submission

This project meets all AWS AI Agent Global Hackathon requirements and is ready for submission with real AWS integration.

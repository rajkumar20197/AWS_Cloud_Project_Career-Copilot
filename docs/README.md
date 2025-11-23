# 🚀 AI Career Agent Platform - AWS AI Agent Global Hackathon

A comprehensive AI-powered career guidance platform built with **AWS Bedrock Claude 3.5 Haiku**, React, TypeScript, and modern UI components.

## 🏆 AWS AI Agent Global Hackathon Submission

This project is built for the **AWS AI Agent Global Hackathon** and demonstrates:

- ✅ **Real AWS Bedrock Integration** with Claude 3.5 Haiku
- ✅ **Autonomous AI Agent Capabilities** for career guidance
- ✅ **Multi-service AWS Architecture** (Bedrock, Lambda, DynamoDB)
- ✅ **Production-ready Implementation** with full documentation

## 🤖 AI Agent Features

### Core AI Capabilities

- **Intelligent Job Matching** - AI analyzes job compatibility using Bedrock
- **Resume Analysis & Optimization** - AI-powered resume scoring and suggestions
- **Career Roadmap Generation** - Personalized career planning with AI
- **Market Intelligence** - AI-driven salary and market insights
- **Interview Preparation** - AI-generated interview questions and tips

### AWS Services Used

- **Amazon Bedrock** - Claude 3.5 Haiku for AI reasoning and decision-making
- **AWS Lambda** - Serverless compute for API endpoints
- **Amazon DynamoDB** - NoSQL database for user data and job storage
- **Amazon S3** - File storage for resumes and documents
- **Amazon Cognito** - User authentication and management
- **Amazon API Gateway** - REST API management

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- AWS Account with Bedrock access
- AWS CLI configured

### Installation

```bash
# Clone the repository
git clone https://github.com/rajkumar20197/ai-career-agent-aws-bedrock.git
cd ai-career-agent-aws-bedrock

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Configure your AWS credentials in .env
# VITE_AWS_ACCESS_KEY_ID=your_access_key
# VITE_AWS_SECRET_ACCESS_KEY=your_secret_key
# VITE_AWS_REGION=us-east-1

# Start development server
npm run dev
```

### AWS Setup Required

1. **AWS Bedrock Access**: Request access to Claude 3.5 Haiku model in AWS Console
2. **AWS Credentials**: Configure your access keys in `.env` file
3. **Region**: Use `us-east-1` for best Bedrock model availability

## 🏗️ Architecture

```
Frontend (React/TypeScript)
    ↓
AWS Bedrock (Claude 3.5 Haiku)
    ↓
AWS Lambda Functions
    ↓
Amazon DynamoDB + S3
```

## 🎯 Hackathon Compliance

This project meets all AWS AI Agent Global Hackathon requirements:

### ✅ AI Agent Qualification

1. **LLM on AWS**: Uses AWS Bedrock Claude 3.5 Haiku
2. **AWS Services**: Bedrock, Lambda, DynamoDB, S3, Cognito
3. **AI Agent Capabilities**:
   - Uses reasoning LLMs for decision-making
   - Demonstrates autonomous capabilities
   - Integrates multiple APIs and databases

### ✅ Technical Requirements

- **Functionality**: Working AI agent with career guidance features
- **Platform**: AWS serverless architecture
- **New Development**: Created specifically for hackathon
- **Original Work**: No third-party IP violations

## 🎬 Demo Features

1. **Landing Page** - Professional introduction to AI career agent
2. **User Onboarding** - Personalized profile setup
3. **Job Search Dashboard** - AI-powered job matching with compatibility scores
4. **Resume Optimizer** - AI analysis and improvement suggestions
5. **Career Roadmap** - Personalized career planning with skill gap analysis
6. **Market Intelligence** - AI-driven salary and market insights
7. **Interview Preparation** - AI-generated questions and tips

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **AI/ML**: AWS Bedrock (Claude 3.5 Haiku)
- **Backend**: AWS Lambda (Python 3.11)
- **Database**: Amazon DynamoDB
- **Storage**: Amazon S3
- **Authentication**: Amazon Cognito
- **API**: Amazon API Gateway
- **Infrastructure**: AWS CloudFormation

## 📁 Project Structure

```
src/
├── components/          # React components
├── services/           # AWS Bedrock integration
├── types/              # TypeScript definitions
├── config/             # AWS configuration
server/
├── routes/             # API endpoints
├── services/           # Backend services
└── config/             # Server configuration
docs/
├── COURSE_MATERIALS_GUIDE.md    # 🎓 Complete course guide for students
├── AWS_SERVICES.md              # AWS services documentation
├── DATABASE_SETUP_COMPLETE.md   # Database setup guide
├── TESTING_GUIDE.md             # Testing instructions
├── PRODUCTION_DEPLOYMENT_GUIDE.md # Deployment guide
└── [38+ more documentation files]
infrastructure/
└── *.yaml              # CloudFormation templates
```

## 📚 Documentation

All documentation has been organized in the `/docs` folder:

### 🎓 For Students & Learning

- **[COURSE_MATERIALS_GUIDE.md](docs/COURSE_MATERIALS_GUIDE.md)** - Complete course guide mapping to cloud computing modules
- **[AWS_SERVICES.md](docs/AWS_SERVICES.md)** - Comprehensive AWS services documentation
- **[TERRAFORM_VS_CLOUDFORMATION.md](docs/TERRAFORM_VS_CLOUDFORMATION.md)** - IaC comparison guide

### 🚀 Setup & Configuration

- **[SETUP_GUIDE.md](docs/SETUP_GUIDE.md)** - Initial setup instructions
- **[AWS_SETUP_GUIDE.md](docs/AWS_SETUP_GUIDE.md)** - AWS configuration
- **[DATABASE_SETUP_COMPLETE.md](docs/DATABASE_SETUP_COMPLETE.md)** - Database setup
- **[SOCIAL_LOGIN_SETUP.md](docs/SOCIAL_LOGIN_SETUP.md)** - OAuth integration
- **[GMAIL_CALENDAR_SETUP.md](docs/GMAIL_CALENDAR_SETUP.md)** - Gmail/Calendar integration

### 🧪 Testing & Debugging

- **[TESTING_GUIDE.md](docs/TESTING_GUIDE.md)** - Complete testing guide
- **[DEBUGGING_GUIDE.md](docs/DEBUGGING_GUIDE.md)** - Troubleshooting help

### 🏗️ Architecture & Infrastructure

- **[PRESENTATION_SLIDES.md](docs/PRESENTATION_SLIDES.md)** - Project presentation
- **[PRODUCTION_DEPLOYMENT_GUIDE.md](docs/PRODUCTION_DEPLOYMENT_GUIDE.md)** - Production deployment
- **[infrastructure/](infrastructure/)** - CloudFormation templates and guides

### 📊 Project Management

- **[TODO.md](docs/TODO.md)** - Task tracking
- **[PROJECT_STATUS_SUMMARY.md](docs/PROJECT_STATUS_SUMMARY.md)** - Current status
- **[TIME_ESTIMATE.md](docs/TIME_ESTIMATE.md)** - Time planning

## 🔒 Security

- Environment variables for sensitive data
- AWS IAM roles with least privilege
- Encryption at rest and in transit
- No hardcoded credentials

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

This project was created for the AWS AI Agent Global Hackathon. Contributions welcome after the competition!

---

**Built with ❤️ for the AWS AI Agent Global Hackathon 2025**

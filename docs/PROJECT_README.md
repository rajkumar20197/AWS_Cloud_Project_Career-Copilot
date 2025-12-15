# Career Copilot - AI-Powered Career Platform

[![AWS](https://img.shields.io/badge/AWS-Cloud%20Architecture-orange)](https://aws.amazon.com/)
[![React](https://img.shields.io/badge/React-18.0-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> A comprehensive full-stack SaaS platform that leverages AI to revolutionize career development and job searching.

## 🚀 Project Overview

**Career Copilot** is a production-ready, AI-powered career assistance platform built with modern web technologies and enterprise-grade AWS infrastructure. This project demonstrates advanced full-stack development, cloud architecture, and AI integration capabilities.

### 🎯 Key Features

- **AI-Powered Resume Builder** - Generate professional resumes using AWS Bedrock
- **Smart Job Matching** - AI-driven job recommendations based on user profiles
- **Interview Preparation** - AI-powered interview coaching and practice sessions
- **Application Tracking** - Comprehensive job application management system
- **Calendar Integration** - Google Calendar sync for interview scheduling
- **Payment Processing** - Stripe integration with multiple subscription tiers
- **Multi-Region Architecture** - AWS-based scalable infrastructure
- **Enterprise Security** - OWASP Top 10 protection and comprehensive security measures

## 🏗️ Architecture

### Frontend (React + TypeScript)

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Components**: 30+ reusable components
- **State Management**: React Hooks
- **Routing**: React Router v6

### Backend (Node.js + Express)

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Authentication**: JWT with bcrypt
- **Security**: Helmet, rate limiting, input sanitization
- **Email**: Nodemailer (Gmail SMTP)
- **Payment**: Stripe SDK

### AWS Infrastructure

- **Compute**: EC2, ECS/Fargate
- **Database**: DynamoDB
- **Storage**: S3
- **AI/ML**: AWS Bedrock (Claude AI)
- **Networking**: VPC, ALB, Route 53
- **Security**: IAM, ACM, Secrets Manager
- **Monitoring**: CloudWatch, CloudTrail
- **Messaging**: SNS, SQS

## 📁 Project Structure

```
├── src/                          # Frontend React application
│   ├── components/              # Reusable UI components (30+)
│   ├── pages/                   # Page components
│   ├── services/                # API and data services
│   ├── utils/                   # Utility functions
│   └── types/                   # TypeScript type definitions
├── backend/                     # Node.js backend server
│   ├── routes/                  # API endpoints
│   ├── services/                # Business logic services
│   ├── middleware/              # Express middleware
│   └── server-secure.js         # Main server file
├── infrastructure/              # AWS infrastructure as code
│   ├── vpc-networking-setup.yaml
│   ├── multi-region-loadbalancer.yaml
│   └── deploy-network.sh
├── docs/                        # Comprehensive documentation (35+ guides)
│   ├── SECURITY_GUIDE.md
│   ├── DEPLOYMENT_GUIDE.md
│   └── AWS_SETUP_GUIDE.md
└── public/                      # Static assets
```

## 🛠️ Technology Stack

### Frontend Technologies

- React 18 + TypeScript
- Tailwind CSS
- Vite (Build Tool)
- React Router v6
- Lucide React (Icons)

### Backend Technologies

- Node.js + Express
- JWT Authentication
- bcrypt (Password Hashing)
- Nodemailer (Email)
- Stripe (Payments)

### AWS Services (15+)

- **Compute**: EC2, Lambda
- **Database**: DynamoDB
- **Storage**: S3
- **AI/ML**: Bedrock
- **Networking**: VPC, ALB, Route 53
- **Security**: IAM, ACM, Secrets Manager
- **Monitoring**: CloudWatch, CloudTrail
- **Messaging**: SNS, SQS
- **Email**: SES

### Third-Party Integrations

- Stripe (Payment Processing)
- Google Calendar (OAuth 2.0)
- Gmail SMTP (Email Service)
- AWS Bedrock (AI Services)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- AWS Account
- Stripe Account
- Google Cloud Console Account

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/rajkumar20197/AWS_Cloud_Project_Career-Copilot.git
   cd AWS_Cloud_Project_Career-Copilot
   ```

2. **Install frontend dependencies**

   ```bash
   npm install
   ```

3. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

4. **Environment Setup**

   ```bash
   # Copy environment files
   cp .env.example .env
   cp backend/.env.example backend/.env

   # Configure your environment variables
   # See docs/SETUP_CHECKLIST.md for detailed instructions
   ```

5. **Start Development Servers**

   ```bash
   # Frontend (Port 5173)
   npm run dev

   # Backend (Port 3001)
   cd backend
   npm run dev
   ```

## 📊 Project Statistics

- **Total Files**: 100+
- **Lines of Code**: 10,000+
- **Documentation**: 35+ comprehensive guides
- **Components**: 30+ React components
- **API Endpoints**: 20+ RESTful endpoints
- **AWS Services**: 15+ integrated services
- **Development Time**: 200+ hours

## 🔒 Security Features

- **Authentication**: JWT with secure password hashing
- **Authorization**: Role-based access control
- **Input Validation**: Comprehensive sanitization
- **Rate Limiting**: DDoS protection
- **HTTPS/TLS**: End-to-end encryption
- **OWASP Top 10**: Complete protection coverage
- **Security Headers**: Helmet.js implementation
- **Audit Logging**: CloudTrail integration

## 💰 Cost Optimization

### Development Environment

- **Total Cost**: $0/month (using AWS free tier)

### Production Environment

- **Estimated Cost**: $3-7/month for small scale
- **At Scale (1000 users)**: $150-200/month

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:

- [Quick Start Guide](docs/QUICK_START_GUIDE.md)
- [AWS Setup Guide](docs/AWS_SETUP_GUIDE.md)
- [Security Implementation](docs/SECURITY_GUIDE.md)
- [Deployment Guide](docs/DEPLOYMENT_SECURITY.md)
- [Cost Analysis](docs/COST_AND_REVENUE_ANALYSIS.md)
- [Project Architecture](PROJECT_ARCHITECTURE.md)
- [Version Roadmap](VERSION_ROADMAP.md)

## 🎯 Key Achievements

### Technical Excellence

- ✅ Production-ready full-stack application
- ✅ Multi-region AWS architecture
- ✅ Enterprise-grade security implementation
- ✅ AI integration with AWS Bedrock
- ✅ Payment processing with Stripe
- ✅ Google Calendar integration
- ✅ Comprehensive error handling
- ✅ Responsive design (mobile, tablet, desktop)

### Business Features

- ✅ User authentication and profiles
- ✅ Subscription management (Free, Pro, Premium)
- ✅ AI-powered resume generation
- ✅ Job matching and recommendations
- ✅ Application tracking system
- ✅ Interview preparation tools
- ✅ Calendar integration
- ✅ Email notification system

## 🔄 Version History

- **v1.0** (December 2024) - MVP Complete
  - Full-stack application
  - AWS infrastructure
  - AI integration
  - Payment processing
  - Security implementation

## 🤝 Contributing

This is an educational project demonstrating full-stack development and AWS cloud architecture. Feel free to explore the code and documentation.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Rajkumar Thota**

- GitHub: [@rajkumar20197](https://github.com/rajkumar20197)
- Email: rajkumarthota979@gmail.com

## 🙏 Acknowledgments

- AWS for cloud infrastructure services
- Stripe for payment processing
- Google for Calendar API integration
- React and Node.js communities
- Open source contributors

---

**⭐ If you find this project helpful, please give it a star!**

_This project demonstrates advanced full-stack development, cloud architecture, and AI integration capabilities suitable for enterprise-level applications._

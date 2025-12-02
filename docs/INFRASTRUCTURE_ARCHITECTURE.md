# 🏗️ Career Copilot - Complete Infrastructure Architecture

## 🎯 **SYSTEM OVERVIEW**

**Career Copilot** is an AI-powered career advancement platform built with modern cloud architecture, featuring enterprise-grade security, scalable AI processing, and robust payment systems.

## 🔧 **TECHNOLOGY STACK**

### **Frontend (React/TypeScript)**

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 6.4.1
- **UI Library**: Radix UI + Tailwind CSS
- **State Management**: React Hooks + Context
- **Authentication**: AWS Amplify + JWT
- **Payment UI**: Stripe Elements

### **Backend (Node.js/Express)**

- **Runtime**: Node.js with Express.js
- **Language**: JavaScript (ES6+)
- **Authentication**: JWT with bcrypt
- **Security**: Helmet, CORS, Rate Limiting
- **API Architecture**: RESTful APIs
- **Middleware**: Custom security layers

### **AI/ML Services**

- **Primary AI**: AWS Bedrock (Claude 3.5 Haiku)
- **Model Access**: Anthropic Claude via Bedrock Runtime
- **Use Cases**: Resume analysis, job matching, cover letters
- **Processing**: Real-time AI inference

### **Database & Storage**

- **Primary Database**: AWS DynamoDB (NoSQL)
- **File Storage**: AWS S3
- **Caching**: In-memory (Redis optional)
- **Backup**: Automated AWS backups

### **Payment Processing**

- **Provider**: Stripe
- **Features**: Subscriptions, webhooks, fraud detection
- **Plans**: Free, Pro ($9.99), Premium ($19.99)
- **Security**: PCI DSS compliant

## 🏛️ **INFRASTRUCTURE COMPONENTS**

### **1. USER INTERFACE LAYER**

```
┌─────────────────────────────────────────┐
│           FRONTEND (React)              │
├─────────────────────────────────────────┤
│ • Landing Page & Marketing              │
│ • User Dashboard & Profile              │
│ • AI Tools (Resume, Jobs, Interview)    │
│ • Payment & Subscription Management     │
│ • Authentication & Security             │
└─────────────────────────────────────────┘
```

### **2. API GATEWAY LAYER**

```
┌─────────────────────────────────────────┐
│        BACKEND API (Express.js)         │
├─────────────────────────────────────────┤
│ • Authentication & Authorization        │
│ • Rate Limiting & Security Middleware   │
│ • Input Validation & Sanitization       │
│ • CORS & CSRF Protection               │
│ • Request/Response Logging              │
└─────────────────────────────────────────┘
```

### **3. BUSINESS LOGIC LAYER**

```
┌─────────────────────────────────────────┐
│           CORE SERVICES                 │
├─────────────────────────────────────────┤
│ • AI Service (Bedrock Integration)      │
│ • User Management Service              │
│ • Payment Service (Stripe)             │
│ • Email Service (SMTP)                 │
│ • File Upload Service                  │
│ • Analytics Service                    │
└─────────────────────────────────────────┘
```

### **4. DATA LAYER**

```
┌─────────────────────────────────────────┐
│            DATA STORAGE                 │
├─────────────────────────────────────────┤
│ • DynamoDB (User data, preferences)     │
│ • S3 (Files, documents, images)        │
│ • CloudWatch (Logs, metrics)           │
│ • Stripe (Payment data)                │
└─────────────────────────────────────────┘
```

### **5. EXTERNAL INTEGRATIONS**

```
┌─────────────────────────────────────────┐
│        THIRD-PARTY SERVICES             │
├─────────────────────────────────────────┤
│ • AWS Bedrock (AI/ML)                  │
│ • Stripe (Payments)                    │
│ • Gmail SMTP (Email)                   │
│ • Google Calendar API                  │
│ • AWS CloudWatch (Monitoring)          │
└─────────────────────────────────────────┘
```

## 🔄 **DATA FLOW ARCHITECTURE**

### **User Request Flow:**

1. **User** → Frontend (React)
2. **Frontend** → Backend API (Express)
3. **Backend** → Authentication Check (JWT)
4. **Backend** → Business Logic Processing
5. **Backend** → External Services (AI, Payment, etc.)
6. **Backend** → Database Operations (DynamoDB/S3)
7. **Backend** → Response to Frontend
8. **Frontend** → Updated UI for User

### **AI Processing Flow:**

1. **User Input** (Resume, Job Preferences)
2. **Frontend** → Backend API
3. **Backend** → Input Validation & Security
4. **Backend** → AWS Bedrock (Claude 3.5 Haiku)
5. **Bedrock** → AI Processing & Response
6. **Backend** → Response Formatting
7. **Frontend** → Display Results

### **Payment Flow:**

1. **User** → Select Plan (Frontend)
2. **Frontend** → Stripe Checkout
3. **Stripe** → Payment Processing
4. **Stripe** → Webhook to Backend
5. **Backend** → Update User Subscription (DynamoDB)
6. **Backend** → Confirmation to User

## 🛡️ **SECURITY ARCHITECTURE**

### **Frontend Security:**

- HTTPS enforcement
- Content Security Policy (CSP)
- XSS protection
- Input validation
- Secure token storage

### **Backend Security:**

- JWT authentication
- Rate limiting (multiple layers)
- Input sanitization
- SQL injection protection
- CORS configuration
- Helmet security headers
- Request size limiting
- Suspicious activity detection

### **Infrastructure Security:**

- IAM roles with minimal permissions
- VPC security groups (if deployed)
- Encrypted data at rest
- Encrypted data in transit
- Regular security audits
- Automated vulnerability scanning

## 📊 **MONITORING & ANALYTICS**

### **Application Monitoring:**

- AWS CloudWatch (metrics, logs)
- Error tracking and alerting
- Performance monitoring
- Uptime monitoring
- Security event logging

### **Business Analytics:**

- User engagement metrics
- AI usage statistics
- Payment conversion rates
- Feature adoption tracking
- Performance benchmarks

## 🚀 **DEPLOYMENT ARCHITECTURE**

### **Current Deployment:**

- **Frontend**: AWS S3 Static Website
- **Backend**: Local development (can deploy to AWS Lambda/ECS)
- **Database**: AWS DynamoDB
- **Storage**: AWS S3
- **CDN**: AWS CloudFront (optional)

### **Production Deployment Options:**

#### **Option 1: Serverless (Recommended)**

- Frontend: AWS S3 + CloudFront
- Backend: AWS Lambda + API Gateway
- Database: DynamoDB
- Storage: S3

#### **Option 2: Container-based**

- Frontend: AWS S3 + CloudFront
- Backend: AWS ECS/Fargate
- Database: DynamoDB
- Storage: S3

#### **Option 3: Traditional Server**

- Frontend: AWS S3 + CloudFront
- Backend: AWS EC2
- Database: DynamoDB
- Storage: S3

## 💰 **COST STRUCTURE**

### **Development Costs (Monthly):**

- AWS Bedrock: ~$10-50 (based on usage)
- DynamoDB: ~$1-5 (pay-per-request)
- S3: ~$1-3 (storage)
- CloudWatch: ~$1-2 (logging)
- **Total**: ~$13-60/month

### **Production Costs (Monthly, 1000 users):**

- AWS Bedrock: ~$100-500
- DynamoDB: ~$10-50
- S3: ~$5-20
- Lambda/ECS: ~$20-100
- CloudFront: ~$5-15
- **Total**: ~$140-685/month

## 🔧 **SCALABILITY FEATURES**

### **Horizontal Scaling:**

- Stateless backend design
- Load balancer ready
- Database auto-scaling (DynamoDB)
- CDN for global distribution

### **Performance Optimization:**

- Caching strategies
- Database query optimization
- Image optimization
- Code splitting (frontend)
- API response compression

## 🎯 **KEY FEATURES IMPLEMENTED**

### **AI-Powered Features:**

- ✅ Resume analysis and scoring
- ✅ Personalized job recommendations
- ✅ AI cover letter generation
- ✅ Mock interview questions
- ✅ Career guidance and tips

### **User Management:**

- ✅ Secure authentication (JWT)
- ✅ User profiles and preferences
- ✅ Usage tracking and analytics
- ✅ Subscription management

### **Payment System:**

- ✅ Stripe integration
- ✅ Multiple subscription tiers
- ✅ Fraud detection
- ✅ Webhook processing
- ✅ Payment analytics

### **Security Features:**

- ✅ Enterprise-grade security
- ✅ Rate limiting and DDoS protection
- ✅ Input validation and sanitization
- ✅ Secure credential management
- ✅ Automated security monitoring

## 🎨 **VISUAL ARCHITECTURE SUMMARY**

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   USERS     │───▶│  FRONTEND   │───▶│   BACKEND   │
│ (Web/Mobile)│    │  (React)    │    │ (Express)   │
└─────────────┘    └─────────────┘    └─────────────┘
                                              │
                   ┌─────────────────────────┼─────────────────────────┐
                   │                         │                         │
                   ▼                         ▼                         ▼
            ┌─────────────┐         ┌─────────────┐         ┌─────────────┐
            │ AWS BEDROCK │         │  DYNAMODB   │         │   STRIPE    │
            │ (AI/Claude) │         │ (Database)  │         │ (Payments)  │
            └─────────────┘         └─────────────┘         └─────────────┘
                   │                         │                         │
                   └─────────────────────────┼─────────────────────────┘
                                             │
                                             ▼
                                    ┌─────────────┐
                                    │     S3      │
                                    │ (Storage)   │
                                    └─────────────┘
```

This architecture provides a robust, scalable, and secure foundation for your AI-powered career platform! 🚀

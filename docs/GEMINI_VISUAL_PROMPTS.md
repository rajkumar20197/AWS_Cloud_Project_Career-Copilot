# 🎨 Gemini Prompts for Career Copilot Infrastructure Diagrams

## 🏗️ **PROMPT 1: Complete System Architecture**

```
Create a professional system architecture diagram for "Career Copilot" - an AI-powered career advancement platform. Show the following components with clean, modern styling:

**USER LAYER:**
- Web browsers and mobile devices connecting to the system

**FRONTEND LAYER:**
- React.js application hosted on AWS S3
- Features: Landing page, Dashboard, AI tools, Payment interface
- Connected via HTTPS

**API GATEWAY LAYER:**
- Express.js backend server
- Security middleware (JWT, Rate limiting, CORS)
- RESTful API endpoints

**BUSINESS LOGIC LAYER:**
- AI Service (AWS Bedrock integration)
- User Management Service
- Payment Service (Stripe)
- Email Service
- File Upload Service

**DATA LAYER:**
- AWS DynamoDB (user data, preferences)
- AWS S3 (file storage)
- Stripe (payment data)

**EXTERNAL SERVICES:**
- AWS Bedrock (Claude 3.5 Haiku AI)
- Stripe Payment Processing
- Gmail SMTP
- Google Calendar API

Use modern cloud architecture styling with:
- Clean boxes and arrows
- AWS orange/blue color scheme
- Professional icons
- Clear data flow arrows
- Security shields for protected components
- Modern flat design aesthetic

Title: "Career Copilot - AI-Powered Career Platform Architecture"
```

## 🔄 **PROMPT 2: Data Flow Diagram**

```
Create a detailed data flow diagram for "Career Copilot" showing how user requests are processed through the AI-powered career platform:

**FLOW SEQUENCE:**
1. User submits resume → React Frontend
2. Frontend → Express.js Backend API (with JWT authentication)
3. Backend → Input validation and security checks
4. Backend → AWS Bedrock (Claude 3.5 Haiku) for AI analysis
5. Bedrock → AI processing and intelligent response
6. Backend → Format and structure AI response
7. Backend → Store results in DynamoDB
8. Backend → Return processed data to Frontend
9. Frontend → Display AI insights to user

**PARALLEL FLOWS:**
- Payment processing via Stripe webhooks
- File uploads to S3 storage
- Email notifications via SMTP
- Analytics tracking to CloudWatch

Use a flowchart style with:
- Numbered sequence steps
- Different colors for each layer (Frontend=blue, Backend=green, AI=purple, Database=orange)
- Security checkpoints highlighted
- Processing time indicators
- Error handling paths
- Modern, professional design

Title: "Career Copilot - AI Request Processing Flow"
```

## 🛡️ **PROMPT 3: Security Architecture**

```
Design a comprehensive security architecture diagram for "Career Copilot" showing all security layers and protections:

**SECURITY LAYERS:**
1. **Frontend Security:**
   - HTTPS enforcement
   - Content Security Policy (CSP)
   - XSS protection
   - Secure token storage

2. **API Security:**
   - JWT authentication
   - Rate limiting (multiple tiers)
   - Input sanitization
   - CORS protection
   - Request size limiting

3. **Infrastructure Security:**
   - AWS IAM roles with minimal permissions
   - Encrypted data at rest and in transit
   - VPC security groups
   - DDoS protection

4. **Application Security:**
   - SQL injection protection
   - Suspicious activity detection
   - Payment fraud detection
   - Secure credential management

**THREAT PROTECTION:**
- Show shields blocking common attacks (XSS, CSRF, SQL injection, DDoS)
- Security monitoring and alerting
- Automated vulnerability scanning

Use a layered security model with:
- Concentric circles or layered shields
- Red for threats, green for protections
- Security icons (locks, shields, keys)
- Attack vectors being blocked
- Monitoring dashboards
- Professional cybersecurity styling

Title: "Career Copilot - Multi-Layer Security Architecture"
```

## 💳 **PROMPT 4: Payment Processing Flow**

```
Create a detailed payment processing flow diagram for "Career Copilot" subscription system:

**PAYMENT FLOW:**
1. User selects plan (Free/Pro $9.99/Premium $19.99) → React Frontend
2. Frontend → Stripe Checkout (secure payment form)
3. User enters payment details → Stripe secure servers
4. Stripe → Payment processing and validation
5. Stripe → Webhook notification to Backend
6. Backend → Verify webhook signature (security)
7. Backend → Update user subscription in DynamoDB
8. Backend → Send confirmation email to user
9. Frontend → Display success message and unlock features

**SECURITY FEATURES:**
- PCI DSS compliance
- Webhook signature verification
- Fraud detection algorithms
- Payment attempt monitoring
- Secure token handling

**SUBSCRIPTION MANAGEMENT:**
- Plan upgrades/downgrades
- Billing cycle management
- Failed payment handling
- Cancellation processing

Use a payment-focused design with:
- Stripe branding colors (purple/blue)
- Security badges and certifications
- Money/payment icons
- Clear success/failure paths
- Professional fintech styling
- Compliance indicators

Title: "Career Copilot - Secure Payment Processing Architecture"
```

## 🤖 **PROMPT 5: AI Processing Pipeline**

```
Design an AI processing pipeline diagram for "Career Copilot" showing how artificial intelligence powers career advancement features:

**AI FEATURES:**
1. **Resume Analysis:**
   - Text extraction → NLP processing → Scoring algorithm → Improvement suggestions

2. **Job Matching:**
   - User preferences → Skill analysis → Market data → AI recommendations

3. **Cover Letter Generation:**
   - Job description + User profile → AI writing → Personalization → Final document

4. **Interview Preparation:**
   - Job requirements → Question generation → Difficulty assessment → Practice scenarios

**AI INFRASTRUCTURE:**
- AWS Bedrock service
- Claude 3.5 Haiku model
- Real-time inference
- Response optimization
- Quality assurance

**DATA PROCESSING:**
- Input validation and cleaning
- Context preparation
- Prompt engineering
- Response formatting
- Result caching

Use an AI-focused design with:
- Neural network visual elements
- Brain/AI icons
- Data transformation arrows
- Processing nodes
- Modern AI/ML color scheme (purple, teal, orange)
- Performance metrics
- Futuristic, tech-forward styling

Title: "Career Copilot - AI-Powered Career Intelligence Pipeline"
```

## 🚀 **PROMPT 6: Deployment Architecture**

```
Create a cloud deployment architecture diagram for "Career Copilot" showing production infrastructure on AWS:

**DEPLOYMENT COMPONENTS:**
1. **Frontend Deployment:**
   - React build → AWS S3 static hosting
   - AWS CloudFront CDN for global distribution
   - Custom domain with SSL certificate

2. **Backend Deployment:**
   - Express.js → AWS Lambda functions (serverless)
   - API Gateway for request routing
   - Auto-scaling and load balancing

3. **Database Layer:**
   - DynamoDB with auto-scaling
   - S3 for file storage with lifecycle policies
   - CloudWatch for monitoring and logs

4. **External Integrations:**
   - AWS Bedrock for AI processing
   - Stripe for payment processing
   - Route 53 for DNS management

**DEPLOYMENT PIPELINE:**
- GitHub Actions CI/CD
- Automated testing
- Blue-green deployment
- Rollback capabilities

**MONITORING & SCALING:**
- CloudWatch dashboards
- Auto-scaling policies
- Performance metrics
- Cost optimization

Use AWS architecture styling with:
- Official AWS service icons
- AWS orange and blue colors
- Cloud infrastructure elements
- Scalability indicators
- Professional enterprise design
- Geographic distribution map

Title: "Career Copilot - AWS Cloud Deployment Architecture"
```

## 🎯 **BONUS PROMPT: Complete Infrastructure Overview**

```
Create a comprehensive, bird's-eye view infrastructure diagram of "Career Copilot" - an enterprise-grade AI career platform. Show the complete ecosystem:

**MAIN COMPONENTS:**
- Users (web/mobile) connecting globally
- React frontend (S3 + CloudFront)
- Express.js backend (Lambda/ECS)
- AWS Bedrock AI (Claude 3.5 Haiku)
- DynamoDB database
- S3 file storage
- Stripe payment system
- Email/calendar integrations

**KEY FEATURES TO HIGHLIGHT:**
- AI-powered resume analysis
- Intelligent job matching
- Automated cover letter generation
- Mock interview preparation
- Subscription management ($9.99 Pro, $19.99 Premium)
- Enterprise security (JWT, rate limiting, encryption)

**VISUAL STYLE:**
- Modern, professional cloud architecture
- Clean, minimalist design
- Consistent color coding by function
- Clear data flow arrows
- Security indicators
- Performance metrics
- Scalability symbols

Make it suitable for:
- Executive presentations
- Technical documentation
- Investor pitches
- Architecture reviews

Title: "Career Copilot - Complete AI-Powered Career Platform Infrastructure"
```

---

## 🎨 **HOW TO USE THESE PROMPTS:**

1. **Copy any prompt** from above
2. **Paste into Gemini** (or Claude, ChatGPT, etc.)
3. **Add specific requests** like "make it more colorful" or "add specific AWS services"
4. **Iterate and refine** based on the results

These prompts will generate professional, detailed infrastructure diagrams perfect for documentation, presentations, or technical reviews! 🚀

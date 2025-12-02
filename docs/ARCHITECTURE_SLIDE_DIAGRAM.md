# Career Copilot - Architecture Block Diagram (Slide Format)

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CAREER COPILOT PLATFORM                            │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     USERS       │    │   FRONTEND      │    │    BACKEND      │    │   EXTERNAL      │
│                 │───▶│                 │───▶│                 │───▶│   SERVICES      │
│ • Job Seekers   │    │ • React App     │    │ • Express API   │    │ • AWS Bedrock   │
│ • Professionals │    │ • Vite Build    │    │ • JWT Auth      │    │ • Stripe        │
│ • Career        │    │ • Tailwind CSS  │    │ • Security      │    │ • Google APIs   │
│   Changers      │    │ • TypeScript    │    │ • Rate Limiting │    │ • Email SMTP    │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │                        │
                                │                        ▼                        │
                                │               ┌─────────────────┐               │
                                │               │  CORE SERVICES  │               │
                                │               │                 │               │
                                │               │ • AI Service    │               │
                                │               │ • User Mgmt     │               │
                                │               │ • Payment Svc   │               │
                                │               │ • File Mgmt     │               │
                                │               └─────────────────┘               │
                                │                        │                        │
                                │                        ▼                        │
                                │               ┌─────────────────┐               │
                                │               │   DATA LAYER    │               │
                                │               │                 │               │
                                │               │ • DynamoDB      │               │
                                │               │ • S3 Storage    │               │
                                │               │ • Redis Cache   │               │
                                │               └─────────────────┘               │
                                │                                                  │
                                ▼◀─────────────────────────────────────────────────┘
                       ┌─────────────────┐
                       │    RESPONSE     │
                       │                 │
                       │ • JSON Data     │
                       │ • AI Results    │
                       │ • File URLs     │
                       └─────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DEPLOYMENT LAYERS                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │   NETWORK   │  │ APPLICATION │  │    DATA     │  │  MONITORING │           │
│  │  SECURITY   │  │  SECURITY   │  │  SECURITY   │  │ & ANALYTICS │           │
│  │             │  │             │  │             │  │             │           │
│  │ • HTTPS/TLS │  │ • JWT Auth  │  │ • Encryption│  │ • CloudWatch│           │
│  │ • CDN       │  │ • Rate Limit│  │ • IAM       │  │ • Stripe    │           │
│  │ • DDoS      │  │ • CORS      │  │ • Backups   │  │ • Analytics │           │
│  │ Protection  │  │ • XSS/CSRF  │  │ • Access    │  │ • Logging   │           │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘           │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Key Features & Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                               FEATURE BLOCKS                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │ RESUME      │  │    JOB      │  │ INTERVIEW   │  │   CAREER    │           │
│  │ ANALYSIS    │  │  MATCHING   │  │ PRACTICE    │  │ ANALYTICS   │           │
│  │             │  │             │  │             │  │             │           │
│  │ • AI Scoring│  │ • Smart     │  │ • Mock      │  │ • Progress  │           │
│  │ • Feedback  │  │   Matching  │  │   Questions │  │   Tracking  │           │
│  │ • Optimize  │  │ • Personali-│  │ • AI Coach  │  │ • Insights  │           │
│  │   Tips      │  │   zation    │  │ • Practice  │  │ • Reports   │           │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘           │
│         │                 │                 │                 │               │
│         └─────────────────┼─────────────────┼─────────────────┘               │
│                           │                 │                                 │
│                           ▼                 ▼                                 │
│                  ┌─────────────────────────────────┐                          │
│                  │        AWS BEDROCK AI           │                          │
│                  │                                 │                          │
│                  │ • Claude 3.5 Haiku (Primary)   │                          │
│                  │ • Claude 3 Sonnet (Advanced)    │                          │
│                  │ • Natural Language Processing   │                          │
│                  │ • Content Generation           │                          │
│                  └─────────────────────────────────┘                          │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Subscription & Payment Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            SUBSCRIPTION TIERS                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                            │
│  │    FREE     │  │     PRO     │  │   PREMIUM   │                            │
│  │   TIER      │  │    TIER     │  │    TIER     │                            │
│  │             │  │             │  │             │                            │
│  │ • Basic     │  │ • Full      │  │ • Expert    │                            │
│  │   Resume    │  │   Features  │  │   Features  │                            │
│  │ • Limited   │  │ • Unlimited │  │ • Priority  │                            │
│  │   AI Calls  │  │   AI Calls  │  │   Support   │                            │
│  │             │  │             │  │             │                            │
│  │   $0/mo     │  │  $9.99/mo   │  │  $19.99/mo  │                            │
│  └─────────────┘  └─────────────┘  └─────────────┘                            │
│         │                 │                 │                                 │
│         └─────────────────┼─────────────────┘                                 │
│                           │                                                   │
│                           ▼                                                   │
│                  ┌─────────────────┐                                          │
│                  │  STRIPE PAYMENT │                                          │
│                  │                 │                                          │
│                  │ • Secure        │                                          │
│                  │ • PCI Compliant │                                          │
│                  │ • Webhooks      │                                          │
│                  │ • Fraud Detect  │                                          │
│                  └─────────────────┘                                          │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Current Status & Next Steps

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CURRENT STATUS                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ✅ COMPLETED                    ⏳ IN PROGRESS              📋 NEXT STEPS      │
│                                                                                 │
│  • React Frontend Built         • S3 Website Live          • HTTPS Setup       │
│  • Express Backend Ready        • Domain Configured        • Backend Deploy    │
│  • AWS Bedrock Connected        • Testing Phase           • Database Setup     │
│  • Stripe Integration           • Security Review         • User Registration  │
│  • AI Features Working          • Performance Opt         • Beta Launch        │
│                                                                                 │
│  DEPLOYMENT TARGET: Production Ready in 7-14 Days                              │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Technology Stack Summary

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                             TECH STACK                                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  FRONTEND          BACKEND           DATABASE          AI & SERVICES            │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐         │
│  │ • React 18  │   │ • Node.js   │   │ • DynamoDB  │   │ • AWS       │         │
│  │ • TypeScript│   │ • Express   │   │ • S3 Storage│   │   Bedrock   │         │
│  │ • Vite      │   │ • JWT Auth  │   │ • Redis     │   │ • Stripe    │         │
│  │ • Tailwind  │   │ • Security  │   │   Cache     │   │ • Google    │         │
│  │ • Radix UI  │   │   Layers    │   │             │   │   APIs      │         │
│  └─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘         │
│                                                                                 │
│  DEPLOYMENT: AWS S3 + CloudFront (Current) → Vercel/AWS Lambda (Production)    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

# AI Career Agent - Backend API

Production-ready Express.js backend for the AI Career Agent Platform.

## Features

- ✅ Secure AWS Bedrock integration (credentials stay on server)
- ✅ RESTful API endpoints
- ✅ Rate limiting
- ✅ CORS protection
- ✅ Error handling
- ✅ Health checks
- ✅ Production-ready

## Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your AWS credentials
```

### 3. Start Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will run on `http://localhost:3001`

## API Endpoints

### Health Check

```
GET /health
```

### Calculate Job Score

```
POST /api/bedrock/calculate-job-score
Body: {
  job: { title, company, requirements, description },
  userSkills: string[],
  userExperience: string
}
Response: { score: number, jobId: string }
```

### Analyze Resume

```
POST /api/bedrock/analyze-resume
Body: { resumeText: string }
Response: {
  strengths: string[],
  weaknesses: string[],
  suggestions: string[],
  keywordMatch: number,
  formatScore: number,
  contentScore: number
}
```

### Tailor Resume

```
POST /api/bedrock/tailor-resume
Body: { resumeText: string, job: object }
Response: { suggestions: string[] }
```

### Generate Career Roadmap

```
POST /api/bedrock/generate-career-roadmap
Body: {
  currentRole: string,
  targetRole: string,
  currentSkills: string[]
}
Response: { roadmap object }
```

### Generate Market Insights

```
POST /api/bedrock/generate-market-insights
Body: { role: string, location: string }
Response: { insights: string[] }
```

### Generate Interview Questions

```
POST /api/bedrock/generate-interview-questions
Body: { job: object }
Response: { questions: string[] }
```

## Environment Variables

```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
BEDROCK_MODEL_ID=anthropic.claude-3-5-haiku-20241022-v1:0

# Server
PORT=3001
NODE_ENV=development

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Deployment

### Option 1: AWS Lambda (Serverless)

- Use AWS SAM or Serverless Framework
- Deploy as Lambda function with API Gateway
- Auto-scaling, pay-per-use

### Option 2: Docker Container

```bash
docker build -t ai-career-backend .
docker run -p 3001:3001 --env-file .env ai-career-backend
```

### Option 3: Traditional Server

- Deploy to EC2, DigitalOcean, Heroku, etc.
- Use PM2 for process management
- Set up reverse proxy (Nginx)

## Security

- ✅ AWS credentials never exposed to frontend
- ✅ Rate limiting prevents abuse
- ✅ CORS restricts origins
- ✅ Helmet.js security headers
- ✅ Input validation
- ✅ Error handling

## Monitoring

Add monitoring with:

- AWS CloudWatch
- Datadog
- New Relic
- Sentry for error tracking

## Cost Optimization

- Use caching (Redis) for repeated requests
- Implement request batching
- Set up CloudWatch alarms
- Monitor Bedrock usage

## Next Steps

1. Add authentication (JWT, OAuth)
2. Add database (DynamoDB, PostgreSQL)
3. Implement caching (Redis)
4. Add logging (Winston, CloudWatch)
5. Set up CI/CD pipeline
6. Add API documentation (Swagger)
7. Implement WebSockets for real-time features

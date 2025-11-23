# Production Deployment Guide

Complete guide to deploy AI Career Agent Platform to production.

## Architecture Overview

```
Users → Frontend (Vercel/Netlify) → Backend API (AWS Lambda/EC2) → AWS Bedrock
                                   ↓
                               DynamoDB (future)
                                   ↓
                               S3 (future)
```

## Step 1: Install Backend Dependencies

```bash
cd server
npm install
```

## Step 2: Test Backend Locally

```bash
# Start backend server
cd server
npm run dev

# In another terminal, start frontend
cd ..
npm run dev
```

Visit `http://localhost:3000` - it should now use REAL AWS Bedrock AI!

## Step 3: Deploy Backend

### Option A: AWS Lambda (Recommended)

**Pros:** Serverless, auto-scaling, pay-per-use, no server management

1. Install AWS SAM CLI:

```bash
pip install aws-sam-cli
```

2. Create `server/template.yaml`:

```yaml
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31

Resources:
  CareerAgentAPI:
    Type: AWS::Serverless::Function
    Properties:
      Handler: server.handler
      Runtime: nodejs18.x
      Timeout: 30
      Environment:
        Variables:
          AWS_REGION: us-east-1
          BEDROCK_MODEL_ID: anthropic.claude-3-5-haiku-20241022-v1:0
      Events:
        ApiEvent:
          Type: Api
          Properties:
            Path: /{proxy+}
            Method: ANY
```

3. Deploy:

```bash
cd server
sam build
sam deploy --guided
```

4. Note the API Gateway URL (e.g., `https://abc123.execute-api.us-east-1.amazonaws.com/`)

### Option B: Heroku (Easy)

```bash
cd server
heroku create ai-career-agent-api
heroku config:set AWS_REGION=us-east-1
heroku config:set AWS_ACCESS_KEY_ID=your_key
heroku config:set AWS_SECRET_ACCESS_KEY=your_secret
heroku config:set BEDROCK_MODEL_ID=anthropic.claude-3-5-haiku-20241022-v1:0
git push heroku main
```

### Option C: DigitalOcean/AWS EC2

1. Create a server (Ubuntu 22.04)
2. SSH into server
3. Install Node.js:

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. Clone repo and setup:

```bash
git clone your-repo
cd ai-career-agent-aws-bedrock/server
npm install
```

5. Create `.env` file with your credentials

6. Install PM2:

```bash
sudo npm install -g pm2
pm2 start server.js --name career-agent-api
pm2 startup
pm2 save
```

7. Setup Nginx reverse proxy:

```nginx
server {
    listen 80;
    server_name api.yourdom ain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Step 4: Deploy Frontend

### Option A: Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Set environment variable:
   - `VITE_API_URL` = your backend URL (e.g., `https://your-api.herokuapp.com/api`)
5. Deploy!

### Option B: Netlify

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Import repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Environment variables:
   - `VITE_API_URL` = your backend URL
6. Deploy!

### Option C: AWS S3 + CloudFront

```bash
# Build frontend
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

## Step 5: Configure Production Environment

### Frontend `.env.production`:

```env
VITE_API_URL=https://your-backend-api.com/api
VITE_USE_MOCK_DATA=false
VITE_ENABLE_AWS_BEDROCK=true
VITE_ENVIRONMENT=production
```

### Backend Environment Variables:

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
BEDROCK_MODEL_ID=anthropic.claude-3-5-haiku-20241022-v1:0
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=https://your-frontend-domain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Step 6: Security Checklist

- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS (SSL certificate)
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Use IAM roles instead of access keys (if on AWS)
- [ ] Enable CloudWatch logging
- [ ] Set up error monitoring (Sentry)
- [ ] Configure firewall rules
- [ ] Regular security updates
- [ ] Backup strategy

## Step 7: Monitoring & Alerts

### AWS CloudWatch

```bash
# Set up billing alarm
aws cloudwatch put-metric-alarm \
  --alarm-name bedrock-cost-alarm \
  --alarm-description "Alert when Bedrock costs exceed $50" \
  --metric-name EstimatedCharges \
  --namespace AWS/Billing \
  --statistic Maximum \
  --period 21600 \
  --evaluation-periods 1 \
  --threshold 50 \
  --comparison-operator GreaterThanThreshold
```

### Error Tracking (Sentry)

```bash
npm install @sentry/node
```

Add to `server/server.js`:

```javascript
const Sentry = require("@sentry/node");
Sentry.init({ dsn: process.env.SENTRY_DSN });
```

## Step 8: Performance Optimization

### Add Redis Caching

```bash
npm install redis
```

Cache AI responses for repeated requests:

```javascript
const redis = require("redis");
const client = redis.createClient();

// Cache job scores for 1 hour
const cacheKey = `job-score-${jobId}-${userId}`;
const cached = await client.get(cacheKey);
if (cached) return JSON.parse(cached);

// ... call Bedrock ...
await client.setEx(cacheKey, 3600, JSON.stringify(result));
```

### Enable Compression

```javascript
const compression = require("compression");
app.use(compression());
```

### Add CDN

- Use CloudFront or Cloudflare
- Cache static assets
- Reduce latency globally

## Step 9: Cost Optimization

### Bedrock Costs

- Claude 3.5 Haiku: ~$0.25 per 1M input tokens, ~$1.25 per 1M output tokens
- Typical job score: ~100 tokens = $0.0001
- 10,000 job scores/day = ~$1/day

### Optimization Strategies:

1. **Cache results** - Same job + user = cached score
2. **Batch requests** - Process multiple jobs together
3. **Rate limiting** - Prevent abuse
4. **Lazy loading** - Only calculate scores when needed
5. **Use cheaper models** - For simple tasks

### Set Budget Alerts:

```bash
aws budgets create-budget \
  --account-id 123456789012 \
  --budget file://budget.json \
  --notifications-with-subscribers file://notifications.json
```

## Step 10: CI/CD Pipeline

### GitHub Actions (`.github/workflows/deploy.yml`):

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to AWS Lambda
        run: |
          cd server
          npm install
          sam build
          sam deploy --no-confirm-changeset

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## Step 11: Domain & SSL

### Custom Domain:

1. Buy domain (Namecheap, GoDaddy, Route53)
2. Point to your deployments:
   - Frontend: `www.yourcareeragent.com` → Vercel/Netlify
   - Backend: `api.yourcareeragent.com` → Your API server
3. Enable SSL (automatic on Vercel/Netlify)

### DNS Records:

```
A     @           → Frontend IP
CNAME api         → Backend URL
CNAME www         → Frontend URL
```

## Step 12: Testing in Production

```bash
# Test backend health
curl https://api.yourcareeragent.com/health

# Test job scoring
curl -X POST https://api.yourcareeragent.com/api/bedrock/calculate-job-score \
  -H "Content-Type: application/json" \
  -d '{"job": {...}, "userSkills": [...], "userExperience": "..."}'
```

## Estimated Costs

### Minimal Traffic (100 users/day):

- AWS Lambda: $0-5/month (free tier)
- Bedrock: $5-10/month
- S3/CloudFront: $1-2/month
- **Total: ~$10-15/month**

### Medium Traffic (1,000 users/day):

- AWS Lambda: $10-20/month
- Bedrock: $50-100/month
- S3/CloudFront: $5-10/month
- **Total: ~$65-130/month**

### High Traffic (10,000 users/day):

- AWS Lambda: $50-100/month
- Bedrock: $500-1000/month
- S3/CloudFront: $20-50/month
- **Total: ~$570-1150/month**

## Support & Maintenance

- Monitor CloudWatch logs daily
- Review Bedrock usage weekly
- Update dependencies monthly
- Security patches immediately
- Backup data regularly

---

**You're ready for production!** 🚀

Start with the backend deployment, test it, then deploy the frontend.

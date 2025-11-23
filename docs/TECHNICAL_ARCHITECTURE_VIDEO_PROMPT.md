# AI Career Agent - Technical Architecture Video Prompt

## Video Specifications

- **Duration:** 3 minutes
- **Style:** Technical diagram animation, architecture visualization
- **Tone:** Professional, educational, technical
- **Target Audience:** Developers, technical recruiters, AWS professionals

---

## Video Script & Architecture Flow

### Scene 1: Project Overview (0:00 - 0:20)

**Visual:** Project title card with tech stack icons
**Narration:**
"AI Career Agent - A full-stack AWS serverless application powered by Bedrock AI. Let's dive into the technical architecture."

**Text Overlay:**

- "Full-Stack AWS Application"
- "React + TypeScript Frontend"
- "Node.js + Express Backend"
- "AWS Bedrock Claude 3.5 Haiku"

**Visual:** Show tech stack icons appearing:

- React logo
- TypeScript logo
- Node.js logo
- AWS logo
- Bedrock icon

---

### Scene 2: Frontend Architecture (0:20 - 0:50)

**Visual:** Animated diagram of frontend components
**Narration:**
"The frontend is built with React and TypeScript, featuring a modern component architecture with real-time AI integration."

**Diagram Flow:**

```
┌─────────────────────────────────────┐
│     React + TypeScript Frontend     │
├─────────────────────────────────────┤
│  • Job Search Dashboard             │
│  • Resume Optimizer                 │
│  • Application Tracker              │
│  • Market Intelligence              │
│  • Gmail Integration                │
└─────────────────────────────────────┘
         ↓ API Calls
┌─────────────────────────────────────┐
│      API Service Layer              │
│  • Error Handling                   │
│  • Retry Logic                      │
│  • Circuit Breaker                  │
└─────────────────────────────────────┘
```

**Text Overlay:**

- "React 18 with Hooks"
- "TypeScript for type safety"
- "Tailwind CSS styling"
- "Framer Motion animations"
- "Error boundaries"

---

### Scene 3: Backend Architecture (0:50 - 1:30)

**Visual:** Animated backend flow diagram
**Narration:**
"The Node.js backend handles all AI requests with enterprise-grade error handling, including retry logic, circuit breakers, and graceful fallbacks."

**Diagram Flow:**

```
┌─────────────────────────────────────┐
│    Express.js Backend Server        │
├─────────────────────────────────────┤
│  • Rate Limiting (100 req/15min)    │
│  • CORS Protection                  │
│  • Helmet Security                  │
│  • Request Validation               │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│      Bedrock Routes Layer           │
├─────────────────────────────────────┤
│  • /calculate-job-score             │
│  • /analyze-resume                  │
│  • /generate-career-roadmap         │
│  • /generate-interview-questions    │
│  • /tailor-resume                   │
│  • /generate-market-insights        │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│    Error Handling Middleware        │
├─────────────────────────────────────┤
│  • Circuit Breaker Pattern          │
│  • Retry with Exponential Backoff   │
│  • 30-second Timeout                │
│  • Safe JSON Parsing                │
│  • Graceful Fallbacks               │
└─────────────────────────────────────┘
```

**Text Overlay:**

- "Node.js + Express"
- "RESTful API design"
- "Production-grade error handling"
- "Circuit breaker: 5 failures → OPEN"
- "Auto-retry: 3 attempts with backoff"

---

### Scene 4: AWS Bedrock Integration (1:30 - 2:10)

**Visual:** Detailed AWS Bedrock flow with animations
**Narration:**
"Every AI request goes through AWS Bedrock Runtime, using Claude 3.5 Haiku with the Converse API. The system includes intelligent retry logic and circuit breaker protection."

**Diagram Flow:**

```
┌─────────────────────────────────────┐
│         API Request                 │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│    Circuit Breaker Check            │
│  State: CLOSED / OPEN / HALF_OPEN   │
└─────────────────────────────────────┘
         ↓ (if CLOSED or HALF_OPEN)
┌─────────────────────────────────────┐
│    AWS Bedrock Runtime Client       │
│  Region: us-east-1                  │
│  Model: us.anthropic.claude-3-5-    │
│         haiku-20241022-v1:0         │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│      Converse Command               │
│  • User prompt                      │
│  • Max tokens: 1024-3000            │
│  • Temperature: 0.7                 │
│  • 30-second timeout                │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│    Retry Logic (if fails)           │
│  Attempt 1 → Wait 1s                │
│  Attempt 2 → Wait 2s                │
│  Attempt 3 → Wait 4s                │
│  → Fallback data                    │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│    Response Processing              │
│  • Safe JSON parsing                │
│  • Validation                       │
│  • Fallback on error                │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│    Return to Frontend               │
└─────────────────────────────────────┘
```

**Text Overlay:**

- "AWS Bedrock Runtime"
- "Claude 3.5 Haiku"
- "Inference Profile: us.anthropic..."
- "Converse API"
- "Retry: 3 attempts"
- "Timeout: 30 seconds"

---

### Scene 5: Error Handling Pipeline (2:10 - 2:40)

**Visual:** Error handling flow with state transitions
**Narration:**
"Production-grade error handling ensures reliability. The circuit breaker opens after 5 failures, preventing cascading failures. Automatic recovery after 60 seconds."

**Diagram Flow:**

```
┌─────────────────────────────────────┐
│    Circuit Breaker States           │
└─────────────────────────────────────┘

    CLOSED (Normal Operation)
         ↓ (5 consecutive failures)
    OPEN (Blocking requests)
         ↓ (60 seconds timeout)
    HALF_OPEN (Testing recovery)
         ↓ (Success)
    CLOSED (Recovered)

┌─────────────────────────────────────┐
│    Error Types Handled              │
├─────────────────────────────────────┤
│  ✓ ThrottlingException → Retry      │
│  ✓ ServiceUnavailable → Retry       │
│  ✓ Timeout → Retry                  │
│  ✓ Connection Reset → Retry         │
│  ✓ JSON Parse Error → Fallback      │
│  ✓ Invalid Response → Fallback      │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│    Graceful Fallbacks               │
├─────────────────────────────────────┤
│  • Resume analysis → Basic feedback │
│  • Job scoring → 0 with message     │
│  • Career roadmap → Minimal struct  │
│  • Interview Q's → Generic questions│
└─────────────────────────────────────┘
```

**Text Overlay:**

- "Circuit Breaker Pattern"
- "Exponential Backoff"
- "Graceful Degradation"
- "Always returns useful data"
- "Never crashes"

---

### Scene 6: Complete Data Flow (2:40 - 3:00)

**Visual:** End-to-end animated flow
**Narration:**
"From user interaction to AI response, every step is optimized for reliability, security, and performance. This is production-ready AWS architecture."

**Complete Flow Animation:**

```
User → Frontend → API Service → Backend →
Circuit Breaker → AWS Bedrock → Claude AI →
Response → JSON Parse → Validation →
Frontend → User Interface
```

**Text Overlay:**

- "End-to-End Flow"
- "< 2 second response time"
- "99.9% uptime"
- "Enterprise-grade security"
- "Production-ready"

**Final Screen:**

```
┌─────────────────────────────────────┐
│     Tech Stack Summary              │
├─────────────────────────────────────┤
│  Frontend: React + TypeScript       │
│  Backend: Node.js + Express         │
│  AI: AWS Bedrock Claude 3.5 Haiku   │
│  Error Handling: Circuit Breaker    │
│  Security: Helmet + CORS + Rate Limit│
│  Deployment: AWS Serverless         │
└─────────────────────────────────────┘
```

---

## Visual Style Guide

### Color Scheme

- **AWS Orange:** #FF9900
- **Tech Blue:** #232F3E
- **Success Green:** #10B981
- **Error Red:** #EF4444
- **Neutral Gray:** #64748B

### Diagram Style

- Clean, modern architecture diagrams
- Animated arrows showing data flow
- Color-coded components
- Icons for each service
- Smooth transitions between scenes

### Animation Style

- Boxes/components fade in
- Arrows animate to show flow
- Highlight active components
- State transitions with color changes
- Smooth zoom in/out for details

---

## Technical Details to Highlight

### Frontend

- React 18 with TypeScript
- Component-based architecture
- Error boundaries
- Real-time updates
- Responsive design

### Backend

- Express.js REST API
- Rate limiting: 100 req/15min
- CORS protection
- Helmet security headers
- Request validation

### AWS Bedrock

- Model: Claude 3.5 Haiku
- Inference Profile: us.anthropic.claude-3-5-haiku-20241022-v1:0
- Converse API
- Region: us-east-1
- Max tokens: 1024-3000

### Error Handling

- Circuit breaker: 5 failures → OPEN
- Retry: 3 attempts with exponential backoff
- Timeout: 30 seconds
- Safe JSON parsing
- Graceful fallbacks

### Security

- Environment variables for secrets
- CORS configuration
- Rate limiting
- Input validation
- Helmet middleware

---

## Code Snippets to Show (Optional)

### Circuit Breaker Implementation

```javascript
const circuitBreaker = {
  failures: 0,
  state: "CLOSED",
  threshold: 5,
  timeout: 60000,
};
```

### Retry Logic

```javascript
for (let attempt = 1; attempt <= 3; attempt++) {
  try {
    const response = await bedrockClient.send(command);
    return response;
  } catch (error) {
    if (attempt === 3) throw error;
    await sleep(1000 * Math.pow(2, attempt - 1));
  }
}
```

### Bedrock API Call

```javascript
const command = new ConverseCommand({
  modelId: "us.anthropic.claude-3-5-haiku-20241022-v1:0",
  messages: [{ role: "user", content: [{ text: prompt }] }],
  inferenceConfig: { maxTokens: 1024, temperature: 0.7 },
});
```

---

## Video Generation Instructions

1. **Use a diagram animation tool:**

   - Mermaid.js for diagrams
   - Excalidraw for hand-drawn style
   - Draw.io for professional diagrams
   - Figma for custom designs

2. **Animation tools:**

   - After Effects for professional animation
   - Canva for simple animations
   - Remotion for code-based video
   - Manim for mathematical animations

3. **Screen recording:**

   - Show actual code files
   - Demonstrate the app working
   - Show AWS console
   - Display logs and monitoring

4. **Narration:**
   - Professional voice-over
   - Clear technical explanations
   - Emphasize key architecture decisions

---

## Output Format

- **Resolution:** 1920x1080 (Full HD)
- **Format:** MP4
- **Frame Rate:** 30fps
- **Duration:** 3:00
- **Audio:** Clear narration + subtle background music
- **Captions:** Technical terms and code snippets

---

**This prompt creates a technical deep-dive video perfect for showcasing your project's architecture to developers and technical audiences!**

# Error Handling Improvements

## Summary

Your AI Career Agent now has production-grade error handling! Here's what was added:

## ✅ Backend Improvements

### 1. **Retry Logic with Exponential Backoff**

- Automatically retries failed AWS Bedrock calls up to 3 times
- Uses exponential backoff (1s, 2s, 4s delays)
- Only retries transient errors (throttling, timeouts, connection resets)
- Logs each attempt for debugging

### 2. **Circuit Breaker Pattern**

- Tracks failure count across all requests
- Opens circuit after 5 consecutive failures
- Prevents hammering AWS when service is down
- Auto-recovers after 60 seconds (HALF_OPEN state)
- Logs state transitions for monitoring

### 3. **Timeout Handling**

- 30-second timeout on all Bedrock API calls
- Prevents hanging requests
- Returns clear timeout error messages

### 4. **Safe JSON Parsing**

- Gracefully handles malformed AI responses
- Extracts JSON from text with regex
- Returns sensible fallback data on parse errors
- Never crashes the app due to bad JSON

### 5. **Graceful Fallbacks**

- Every endpoint returns useful data even on failure
- Resume analysis: Returns basic feedback
- Job scoring: Returns 0 with error message
- Career roadmap: Returns minimal structure
- Interview questions: Returns generic questions
- Users always get something useful

## ✅ Frontend Improvements

### 6. **React Error Boundary**

- Catches all React component errors
- Shows user-friendly error UI
- Provides "Try Again" and "Go Home" buttons
- Shows error details in development mode
- Prevents white screen of death

## How It Works

### Circuit Breaker States

```
CLOSED (Normal)
   ↓ (5 failures)
OPEN (Blocking requests)
   ↓ (60 seconds)
HALF_OPEN (Testing recovery)
   ↓ (Success)
CLOSED (Recovered)
```

### Retry Flow

```
Request → Attempt 1 → Fail (retryable)
       → Wait 1s
       → Attempt 2 → Fail (retryable)
       → Wait 2s
       → Attempt 3 → Fail
       → Return fallback data
```

### Error Response Example

```json
{
  "suggestions": [
    "Service temporarily unavailable",
    "Please try again in a few moments"
  ],
  "error": "Bedrock request timeout"
}
```

## Testing the Improvements

### Test Timeout Handling

```bash
# Simulate slow Bedrock response
# The app will timeout after 30s and return fallback
```

### Test Circuit Breaker

```bash
# Make 5+ failed requests quickly
# Circuit opens, subsequent requests fail fast
# Wait 60s, circuit recovers
```

### Test Retry Logic

```bash
# Temporary network issue
# App automatically retries 3 times
# Succeeds on retry or returns fallback
```

### Test Error Boundary

```javascript
// Throw an error in any React component
throw new Error("Test error");
// Error boundary catches it and shows friendly UI
```

## Monitoring

### Backend Logs

- `🚀 Calling AWS Bedrock (attempt X/3)...` - Retry attempts
- `✅ Bedrock response received` - Success
- `❌ Bedrock error (attempt X/3)` - Failure
- `🔄 Circuit breaker: HALF_OPEN` - Recovery attempt
- `🚨 Circuit breaker: OPEN` - Service down
- `⚠️ No JSON found in response` - Parse warning

### What to Watch For

- High retry counts → AWS throttling or network issues
- Circuit breaker opening → AWS Bedrock outage
- Frequent timeouts → Need to optimize prompts
- JSON parse errors → AI returning unexpected format

## Benefits

1. **Better User Experience**

   - No crashes or white screens
   - Always get useful feedback
   - Clear error messages

2. **Improved Reliability**

   - Handles transient failures automatically
   - Protects AWS from overload
   - Graceful degradation

3. **Easier Debugging**

   - Detailed logs for every error
   - Clear error states
   - Development mode shows stack traces

4. **Production Ready**
   - Handles real-world failures
   - Protects against cascading failures
   - Self-healing with circuit breaker

## Next Steps (Optional)

1. **Add Metrics**

   - Track retry rates
   - Monitor circuit breaker state
   - Alert on high error rates

2. **Caching**

   - Cache successful AI responses
   - Serve cached data during outages
   - Reduce AWS costs

3. **Rate Limiting Per User**

   - Prevent individual users from exhausting quota
   - Fair usage across all users

4. **Health Check Endpoint**
   - `/health` endpoint with circuit breaker status
   - Monitor from external service
   - Auto-restart if unhealthy

## Configuration

All settings are in `server/routes/bedrock.js`:

```javascript
// Circuit breaker settings
threshold: 5,        // Failures before opening
timeout: 60000,      // Recovery time (ms)

// Retry settings
retries: 3,          // Max retry attempts
timeout: 30000,      // Request timeout (ms)
```

Adjust these based on your needs!

---

**Your app is now production-ready with enterprise-grade error handling!** 🚀

# Design Document

## Overview

The database layer implements a complete persistence solution for the AI Career Agent using AWS DynamoDB as the primary data store. The architecture follows a three-tier pattern: API routes handle HTTP requests, a service layer manages business logic and DynamoDB operations, and DynamoDB provides scalable NoSQL storage.

The design prioritizes:

- Fast read/write operations (sub-500ms response times)
- Scalability for growing user base
- Simple integration with existing authentication
- RESTful API design patterns
- Comprehensive error handling

## Architecture

### High-Level Architecture

```
Frontend (React)
      ↓
API Routes (Express)
      ↓
Service Layer (DynamoService)
      ↓
AWS DynamoDB (3 Tables)
```

### Component Diagram

```
┌─────────────────────────────────────────┐
│         Express Server                   │
│  ┌────────────────────────────────────┐ │
│  │  API Routes (/api/users/*)         │ │
│  │  - Profile endpoints               │ │
│  │  - Job endpoints                   │ │
│  │  - Application endpoints           │ │
│  │  - Health check                    │ │
│  └────────────┬───────────────────────┘ │
│               ↓                          │
│  ┌────────────────────────────────────┐ │
│  │  DynamoService                     │ │
│  │  - User operations                 │ │
│  │  - Job operations                  │ │
│  │  - Application operations          │ │
│  │  - Utility operations              │ │
│  └────────────┬───────────────────────┘ │
└───────────────┼─────────────────────────┘
                ↓
┌───────────────────────────────────────────┐
│         AWS DynamoDB                      │
│  ┌─────────────────────────────────────┐ │
│  │  ai-career-users                    │ │
│  │  PK: userId                         │ │
│  │  GSI: EmailIndex (email)            │ │
│  └─────────────────────────────────────┘ │
│  ┌─────────────────────────────────────┐ │
│  │  ai-career-jobs                     │ │
│  │  PK: jobId                          │ │
│  │  GSI: UserIdIndex (userId)          │ │
│  └─────────────────────────────────────┘ │
│  ┌─────────────────────────────────────┐ │
│  │  ai-career-applications             │ │
│  │  PK: applicationId                  │ │
│  │  GSI: UserIdIndex (userId)          │ │
│  └─────────────────────────────────────┘ │
└───────────────────────────────────────────┘
```

## Components and Interfaces

### 1. DynamoDB Tables

#### Users Table (ai-career-users)

- **Primary Key**: `userId` (String)
- **Global Secondary Index**: `EmailIndex` on `email` field
- **Attributes**:
  - `userId`: Unique identifier from Cognito
  - `email`: User email address
  - `name`: User full name
  - `profile`: Object containing career information
    - `currentRole`: Current job title
    - `targetRole`: Desired job title
    - `skills`: Array of skills
    - `experience`: Years of experience
    - `graduationDate`: Expected/actual graduation date
    - `location`: Preferred work location
    - `salaryExpectation`: Desired salary
  - `createdAt`: ISO timestamp
  - `updatedAt`: ISO timestamp

#### Jobs Table (ai-career-jobs)

- **Primary Key**: `jobId` (String, UUID)
- **Global Secondary Index**: `UserIdIndex` on `userId` field
- **Attributes**:
  - `jobId`: Unique job identifier
  - `userId`: User who saved the job
  - `title`: Job title
  - `company`: Company name
  - `location`: Job location
  - `salary`: Object with min/max salary
  - `description`: Job description
  - `requirements`: Array of requirements
  - `compatibilityScore`: AI-calculated match score
  - `saved`: Boolean flag
  - `appliedDate`: Date applied (nullable)
  - `createdAt`: ISO timestamp

#### Applications Table (ai-career-applications)

- **Primary Key**: `applicationId` (String, UUID)
- **Global Secondary Index**: `UserIdIndex` on `userId` field
- **Attributes**:
  - `applicationId`: Unique application identifier
  - `userId`: User who applied
  - `jobId`: Reference to job
  - `status`: Enum (applied, interviewing, offered, rejected)
  - `appliedDate`: Date of application
  - `notes`: User notes
  - `interviewDates`: Array of interview dates
  - `createdAt`: ISO timestamp
  - `updatedAt`: ISO timestamp

### 2. Service Layer (DynamoService)

The `DynamoService` class provides a clean abstraction over DynamoDB operations:

#### User Operations

- `saveUserProfile(userId, profileData)`: Create or update user profile
- `getUserProfile(userId)`: Retrieve user by ID
- `getUserByEmail(email)`: Retrieve user by email (uses EmailIndex)
- `updateUserProfile(userId, updates)`: Partial update of user profile

#### Job Operations

- `saveJob(userId, jobData)`: Save a job for a user
- `getUserJobs(userId)`: Get all saved jobs for a user (uses UserIdIndex)
- `deleteJob(jobId)`: Remove a saved job

#### Application Operations

- `createApplication(userId, jobId, applicationData)`: Create application record
- `getUserApplications(userId)`: Get all applications for a user (uses UserIdIndex)
- `updateApplication(applicationId, updates)`: Update application status/notes

#### Utility Operations

- `checkTablesExist()`: Health check for all tables

### 3. API Routes

RESTful endpoints following standard HTTP conventions:

#### Profile Endpoints

- `POST /api/users/profile`: Create/update profile
- `GET /api/users/profile/:userId`: Get profile by ID
- `GET /api/users/profile/email/:email`: Get profile by email
- `PUT /api/users/profile/:userId`: Update profile

#### Job Endpoints

- `POST /api/users/jobs`: Save a job
- `GET /api/users/:userId/jobs`: Get saved jobs

#### Application Endpoints

- `POST /api/users/applications`: Create application
- `GET /api/users/:userId/applications`: Get applications
- `PUT /api/users/applications/:applicationId`: Update application

#### Health Endpoint

- `GET /api/users/health`: Check DynamoDB connectivity

## Data Models

### User Profile Model

```javascript
{
  userId: "cognito-user-id",
  email: "user@example.com",
  name: "John Doe",
  profile: {
    currentRole: "Software Engineer",
    targetRole: "Senior Software Engineer",
    skills: ["JavaScript", "React", "Node.js"],
    experience: "3 years",
    graduationDate: "2021-05",
    location: "San Francisco, CA",
    salaryExpectation: 120000
  },
  createdAt: "2024-11-15T10:00:00.000Z",
  updatedAt: "2024-11-15T10:00:00.000Z"
}
```

### Saved Job Model

```javascript
{
  jobId: "uuid-v4",
  userId: "cognito-user-id",
  title: "Senior Software Engineer",
  company: "Tech Corp",
  location: "San Francisco, CA",
  salary: {
    min: 120000,
    max: 180000,
    currency: "USD"
  },
  description: "Job description...",
  requirements: ["5+ years experience", "React expertise"],
  compatibilityScore: 85,
  saved: true,
  appliedDate: null,
  createdAt: "2024-11-15T10:00:00.000Z"
}
```

### Application Model

```javascript
{
  applicationId: "uuid-v4",
  userId: "cognito-user-id",
  jobId: "job-uuid",
  status: "interviewing",
  appliedDate: "2024-11-15T10:00:00.000Z",
  notes: "Phone screen scheduled for next week",
  interviewDates: [
    "2024-11-20T14:00:00.000Z",
    "2024-11-22T10:00:00.000Z"
  ],
  createdAt: "2024-11-15T10:00:00.000Z",
  updatedAt: "2024-11-16T09:00:00.000Z"
}
```

## Error Handling

### Service Layer Error Handling

- All DynamoDB operations wrapped in try-catch blocks
- Errors logged to console with descriptive messages
- Errors propagated to route handlers with original error object
- Success/failure indicated in return objects

### API Route Error Handling

- Input validation before service calls
- 400 status for missing/invalid parameters
- 404 status for not found resources
- 500 status for server errors
- Consistent error response format:

```javascript
{
  error: "Error message",
  stack: "..." // Only in development
}
```

### Error Middleware

- Global error handler in Express server
- Catches all unhandled errors
- Logs errors to console
- Returns appropriate HTTP status codes
- Includes stack traces in development mode

## Testing Strategy

### Unit Testing

- Test DynamoService methods in isolation
- Mock DynamoDB client responses
- Verify correct parameters passed to DynamoDB
- Test error handling paths

### Integration Testing

- Test API endpoints with real DynamoDB (local or test environment)
- Verify end-to-end data flow
- Test authentication integration
- Validate response formats

### Health Check Testing

- Verify table connectivity
- Test with missing tables
- Validate response format

### Manual Testing Checklist

1. Create user profile via POST /api/users/profile
2. Retrieve profile via GET /api/users/profile/:userId
3. Update profile via PUT /api/users/profile/:userId
4. Save job via POST /api/users/jobs
5. Retrieve saved jobs via GET /api/users/:userId/jobs
6. Create application via POST /api/users/applications
7. Update application via PUT /api/users/applications/:applicationId
8. Test health check via GET /api/users/health
9. Test error cases (missing parameters, invalid IDs)
10. Verify timestamps are set correctly

## Security Considerations

### Authentication

- All endpoints should be protected by authentication middleware (to be implemented)
- userId should be extracted from authenticated session, not request body
- Validate user can only access their own data

### Data Validation

- Validate all input parameters
- Sanitize user-provided data
- Enforce required fields
- Validate data types

### AWS Credentials

- Store credentials in environment variables
- Never commit credentials to version control
- Use IAM roles in production
- Follow principle of least privilege

### Rate Limiting

- Already implemented at server level
- Consider per-user rate limits for expensive operations

## Performance Considerations

### DynamoDB Optimization

- Use Global Secondary Indexes for common query patterns
- Batch operations where possible
- Consider DynamoDB auto-scaling for production
- Monitor read/write capacity units

### Response Times

- Target: < 500ms for all operations
- Use DynamoDB's single-digit millisecond latency
- Minimize data transfer size
- Consider caching for frequently accessed data

### Scalability

- DynamoDB scales automatically
- Stateless API design allows horizontal scaling
- Consider connection pooling for high traffic

## Deployment Considerations

### Environment Variables Required

```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

### DynamoDB Table Creation

- Tables must be created before deployment
- Configure appropriate read/write capacity
- Enable point-in-time recovery for production
- Set up CloudWatch alarms for capacity

### Monitoring

- CloudWatch metrics for DynamoDB operations
- Application logs for debugging
- Error tracking with Sentry (future)
- Performance monitoring with X-Ray (future)

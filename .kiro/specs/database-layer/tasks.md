# Implementation Plan

- [ ] 1. Install dependencies and verify AWS configuration

  - Install required npm packages: @aws-sdk/client-dynamodb, @aws-sdk/lib-dynamodb, uuid
  - Verify AWS credentials are configured in environment variables
  - Test AWS CLI connectivity to DynamoDB
  - _Requirements: 1.1, 2.1, 3.1, 4.1_

- [ ] 2. Create DynamoDB tables in AWS

  - Create ai-career-users table with userId as primary key
  - Create EmailIndex global secondary index on email field for users table
  - Create ai-career-jobs table with jobId as primary key
  - Create UserIdIndex global secondary index on userId field for jobs table
  - Create ai-career-applications table with applicationId as primary key
  - Create UserIdIndex global secondary index on userId field for applications table
  - Verify all tables are active using AWS CLI or Console
  - _Requirements: 1.1, 2.1, 3.1_

- [ ] 3. Test backend service layer and API endpoints

  - Start the Express server locally
  - Test health check endpoint to verify table connectivity
  - Test user profile creation with sample data
  - Test user profile retrieval by userId
  - Test user profile update operations
  - Test job saving functionality
  - Test application creation and tracking
  - Verify error handling for invalid requests
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 3.1, 3.2, 4.1, 4.2, 4.3, 5.1, 5.2_

- [ ] 4. Create frontend API service

  - Create src/services/apiService.ts file
  - Implement saveUserProfile function to call POST /api/users/profile
  - Implement getUserProfile function to call GET /api/users/profile/:userId
  - Implement updateUserProfile function to call PUT /api/users/profile/:userId
  - Implement saveJob function to call POST /api/users/jobs
  - Implement getSavedJobs function to call GET /api/users/:userId/jobs
  - Implement createApplication function to call POST /api/users/applications
  - Implement getApplications function to call GET /api/users/:userId/applications
  - Add error handling and response parsing for all API calls
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 3.1, 3.2_

- [ ] 5. Integrate database persistence with onboarding flow

  - Update Onboarding component to call saveUserProfile after form completion
  - Extract userId from authenticated Cognito session
  - Pass profile data to apiService.saveUserProfile
  - Handle success and error responses with user feedback
  - Add loading state during profile save operation
  - Redirect to dashboard after successful profile save
  - _Requirements: 1.1, 1.4, 5.1, 5.2_

- [ ] 6. Integrate database persistence with dashboard

  - Update Dashboard component to load user profile on mount
  - Call apiService.getUserProfile with authenticated userId
  - Display profile data in dashboard UI
  - Handle case where profile doesn't exist (redirect to onboarding)
  - Add loading state while fetching profile
  - _Requirements: 1.2, 5.1, 5.2_

- [ ] 7. Implement job saving functionality in frontend

  - Add "Save Job" button to job cards in dashboard
  - Call apiService.saveJob when user clicks save button
  - Update UI to show saved state (filled heart icon or similar)
  - Add "Saved Jobs" section to dashboard
  - Load and display saved jobs using apiService.getSavedJobs
  - Handle duplicate saves gracefully
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 8. Implement application tracking in frontend

  - Add "Mark as Applied" button to job cards
  - Call apiService.createApplication when user marks job as applied
  - Create Applications page/section to view all applications
  - Display application status, date, and notes
  - Add ability to update application status
  - Sort applications by date (most recent first)
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 9. End-to-end testing and bug fixes

  - Test complete user flow: signup → onboarding → profile save → dashboard load
  - Test job saving and retrieval across sessions
  - Test application tracking and status updates
  - Verify data persists after logout and login
  - Test error scenarios (network failures, invalid data)
  - Fix any bugs discovered during testing
  - Verify all timestamps are displayed correctly
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ]\* 10. Add comprehensive error handling and user feedback
  - Add toast notifications for success/error messages
  - Implement retry logic for failed API calls
  - Add offline detection and queue failed requests
  - Display helpful error messages for common issues
  - Add loading skeletons for better UX
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

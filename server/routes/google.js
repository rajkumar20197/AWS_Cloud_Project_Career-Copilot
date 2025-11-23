const express = require('express');
const router = express.Router();
const GoogleService = require('../services/googleService');
const InterviewDetectionService = require('../services/interviewDetectionService');
const DynamoService = require('../services/dynamoService');

// GET /api/google/auth - Start OAuth flow
router.get('/auth', (req, res, next) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const authUrl = GoogleService.getAuthUrl(userId);
    res.json({ authUrl });
  } catch (error) {
    next(error);
  }
});

// GET /api/google/callback - OAuth callback
router.get('/callback', async (req, res, next) => {
  try {
    const { code, state: userId } = req.query;

    if (!code || !userId) {
      return res.status(400).json({ error: 'Missing code or userId' });
    }

    // Exchange code for tokens
    const tokens = await GoogleService.getTokens(code);

    // Save tokens
    await GoogleService.saveTokens(userId, tokens);

    // Get user info
    const userInfo = await GoogleService.getUserInfo(userId);

    res.json({
      success: true,
      message: 'Google account connected successfully',
      userInfo: {
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/google/disconnect - Disconnect Google account
router.post('/disconnect', async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    await GoogleService.disconnect(userId);

    res.json({
      success: true,
      message: 'Google account disconnected successfully',
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/google/emails - Get recent emails
router.get('/emails', async (req, res, next) => {
  try {
    const { userId, maxResults, query, after } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const emails = await GoogleService.getEmails(userId, {
      maxResults: parseInt(maxResults) || 50,
      query: query || 'interview OR meeting OR call',
      after,
    });

    res.json({
      success: true,
      count: emails.length,
      emails,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/google/scan-interviews - Scan emails for interviews
router.post('/scan-interviews', async (req, res, next) => {
  try {
    const { userId, days = 7 } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Calculate date range
    const afterDate = new Date();
    afterDate.setDate(afterDate.getDate() - days);
    const after = afterDate.toISOString().split('T')[0].replace(/-/g, '/');

    // Get emails
    console.log(`📧 Fetching emails for user ${userId} from last ${days} days...`);
    const emails = await GoogleService.getEmails(userId, {
      maxResults: 50,
      query: 'interview OR meeting OR call OR schedule',
      after,
    });

    if (emails.length === 0) {
      return res.json({
        success: true,
        message: 'No emails found',
        interviews: [],
      });
    }

    // Analyze emails for interviews
    console.log(`🤖 Analyzing ${emails.length} emails with AI...`);
    const analysis = await InterviewDetectionService.analyzeEmails(emails);

    // Save detected interviews to DynamoDB
    if (analysis.interviews.length > 0) {
      console.log(`💾 Saving ${analysis.interviews.length} interviews to database...`);
      
      for (const interview of analysis.interviews) {
        await DynamoService.createApplication(userId, interview.emailId, {
          status: 'interview_scheduled',
          notes: `Detected from email: ${interview.emailSubject}`,
          interviewDates: [interview.date],
          company: interview.company,
          position: interview.position,
          interviewType: interview.type,
          meetingLink: interview.meetingLink,
          interviewer: interview.interviewer,
          confidence: interview.confidence,
        });
      }
    }

    res.json({
      success: true,
      message: `Found ${analysis.interviewsFound} interviews out of ${analysis.total} emails`,
      total: analysis.total,
      interviewsFound: analysis.interviewsFound,
      interviews: analysis.interviews,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/google/interviews/:userId - Get detected interviews
router.get('/interviews/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;

    const result = await DynamoService.getUserApplications(userId);
    
    // Filter for interview-related applications
    const interviews = result.applications.filter(
      app => app.status === 'interview_scheduled' || app.interviewDates
    );

    res.json({
      success: true,
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/google/create-event - Create calendar event
router.post('/create-event', async (req, res, next) => {
  try {
    const { userId, event, interviewId } = req.body;

    if (!userId || !event) {
      return res.status(400).json({ error: 'userId and event are required' });
    }

    // Create calendar event
    const result = await GoogleService.createCalendarEvent(userId, event);

    // Update application with calendar event ID
    if (interviewId) {
      await DynamoService.updateApplication(interviewId, {
        calendarEventId: result.eventId,
        calendarEventLink: result.htmlLink,
        addedToCalendar: true,
      });
    }

    res.json({
      success: true,
      message: 'Calendar event created successfully',
      eventId: result.eventId,
      eventLink: result.htmlLink,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/google/create-event-from-interview - Create event from detected interview
router.post('/create-event-from-interview', async (req, res, next) => {
  try {
    const { userId, interviewId } = req.body;

    if (!userId || !interviewId) {
      return res.status(400).json({ error: 'userId and interviewId are required' });
    }

    // Get interview details
    const applications = await DynamoService.getUserApplications(userId);
    const interview = applications.applications.find(app => app.applicationId === interviewId);

    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    // Format for calendar
    const eventData = InterviewDetectionService.formatForCalendar(interview);

    // Create calendar event
    const result = await GoogleService.createCalendarEvent(userId, eventData);

    // Update application
    await DynamoService.updateApplication(interviewId, {
      calendarEventId: result.eventId,
      calendarEventLink: result.htmlLink,
      addedToCalendar: true,
    });

    res.json({
      success: true,
      message: 'Interview added to calendar successfully',
      eventId: result.eventId,
      eventLink: result.htmlLink,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/google/events/:userId - Get calendar events
router.get('/events/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { timeMin, timeMax, maxResults } = req.query;

    const events = await GoogleService.getCalendarEvents(userId, {
      timeMin,
      timeMax,
      maxResults: parseInt(maxResults) || 50,
    });

    res.json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/google/update-event/:eventId - Update calendar event
router.put('/update-event/:eventId', async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { userId, updates } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const event = await GoogleService.updateCalendarEvent(userId, eventId, updates);

    res.json({
      success: true,
      message: 'Calendar event updated successfully',
      event,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/google/delete-event/:eventId - Delete calendar event
router.delete('/delete-event/:eventId', async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    await GoogleService.deleteCalendarEvent(userId, eventId);

    res.json({
      success: true,
      message: 'Calendar event deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/google/status/:userId - Check connection status
router.get('/status/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;

    const { user } = await DynamoService.getUserProfile(userId);

    if (!user || !user.googleConnected) {
      return res.json({
        connected: false,
        message: 'Google account not connected',
      });
    }

    // Try to get user info to verify tokens are valid
    try {
      const userInfo = await GoogleService.getUserInfo(userId);
      res.json({
        connected: true,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        connectedAt: user.googleConnectedAt,
      });
    } catch (error) {
      // Tokens might be invalid
      res.json({
        connected: false,
        message: 'Google tokens expired or invalid',
        needsReconnect: true,
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const calendarService = require('../services/googleCalendarService');
const { authenticateToken } = require('../middleware/auth');

/**
 * Google Calendar Integration Routes
 */

/**
 * GET /api/google/auth
 * Get Google OAuth URL for user to authorize
 */
router.get('/auth', authenticateToken, (req, res) => {
  try {
    const authUrl = calendarService.getAuthUrl();
    res.json({ authUrl });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({ error: 'Failed to generate authorization URL' });
  }
});

/**
 * GET /api/google/callback
 * OAuth callback - exchange code for tokens
 */
router.get('/callback', async (req, res) => {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code required' });
  }

  try {
    // Exchange code for tokens
    const tokens = await calendarService.getTokensFromCode(code);

    // TODO: Save tokens to database (DynamoDB) associated with user
    // For now, return tokens to frontend to store temporarily
    
    // In production, you'd save to database and redirect to success page
    res.redirect(`${process.env.FRONTEND_URL}/calendar/success?tokens=${encodeURIComponent(JSON.stringify(tokens))}`);
  } catch (error) {
    console.error('Error in OAuth callback:', error);
    res.redirect(`${process.env.FRONTEND_URL}/calendar/error`);
  }
});

/**
 * POST /api/google/calendar/interview
 * Schedule interview prep session
 */
router.post('/calendar/interview', authenticateToken, async (req, res) => {
  try {
    const { tokens, company, position, date, type, timeZone } = req.body;

    if (!tokens || !company || !position || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await calendarService.scheduleInterviewPrep(tokens, {
      company,
      position,
      date,
      type,
      timeZone: timeZone || 'America/New_York',
    });

    res.json(result);
  } catch (error) {
    console.error('Error scheduling interview prep:', error);
    res.status(500).json({ error: 'Failed to schedule interview prep' });
  }
});

/**
 * POST /api/google/calendar/deadline
 * Schedule application deadline reminder
 */
router.post('/calendar/deadline', authenticateToken, async (req, res) => {
  try {
    const { tokens, company, position, deadline, applicationUrl, timeZone } = req.body;

    if (!tokens || !company || !position || !deadline) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await calendarService.scheduleApplicationDeadline(tokens, {
      company,
      position,
      deadline,
      applicationUrl,
      timeZone: timeZone || 'America/New_York',
    });

    res.json(result);
  } catch (error) {
    console.error('Error scheduling deadline:', error);
    res.status(500).json({ error: 'Failed to schedule deadline' });
  }
});

/**
 * POST /api/google/calendar/networking
 * Schedule networking event
 */
router.post('/calendar/networking', authenticateToken, async (req, res) => {
  try {
    const { tokens, eventName, location, startTime, endTime, meetingLink, attendees, timeZone } = req.body;

    if (!tokens || !eventName || !startTime || !endTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await calendarService.scheduleNetworkingEvent(tokens, {
      eventName,
      location,
      startTime,
      endTime,
      meetingLink,
      attendees,
      timeZone: timeZone || 'America/New_York',
    });

    res.json(result);
  } catch (error) {
    console.error('Error scheduling networking event:', error);
    res.status(500).json({ error: 'Failed to schedule networking event' });
  }
});

/**
 * POST /api/google/calendar/event
 * Create custom calendar event
 */
router.post('/calendar/event', authenticateToken, async (req, res) => {
  try {
    const { tokens, title, description, startTime, endTime, timeZone, attendees, colorId } = req.body;

    if (!tokens || !title || !startTime || !endTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await calendarService.createEvent(tokens, {
      title,
      description,
      startTime,
      endTime,
      timeZone: timeZone || 'America/New_York',
      attendees,
      colorId,
    });

    res.json(result);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

/**
 * GET /api/google/calendar/events
 * List upcoming events
 */
router.get('/calendar/events', authenticateToken, async (req, res) => {
  try {
    const { tokens } = req.query;
    const maxResults = parseInt(req.query.maxResults) || 10;

    if (!tokens) {
      return res.status(400).json({ error: 'Tokens required' });
    }

    const parsedTokens = JSON.parse(tokens);
    const events = await calendarService.listUpcomingEvents(parsedTokens, maxResults);

    res.json({ events });
  } catch (error) {
    console.error('Error listing events:', error);
    res.status(500).json({ error: 'Failed to list events' });
  }
});

/**
 * DELETE /api/google/calendar/event/:eventId
 * Delete a calendar event
 */
router.delete('/calendar/event/:eventId', authenticateToken, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { tokens } = req.body;

    if (!tokens) {
      return res.status(400).json({ error: 'Tokens required' });
    }

    const result = await calendarService.deleteEvent(tokens, eventId);
    res.json(result);
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

/**
 * PUT /api/google/calendar/event/:eventId
 * Update a calendar event
 */
router.put('/calendar/event/:eventId', authenticateToken, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { tokens, updates } = req.body;

    if (!tokens || !updates) {
      return res.status(400).json({ error: 'Tokens and updates required' });
    }

    const result = await calendarService.updateEvent(tokens, eventId, updates);
    res.json(result);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

module.exports = router;

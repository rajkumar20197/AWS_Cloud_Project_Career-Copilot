const express = require('express');
const router = express.Router();
const googleCalendarService = require('../services/googleCalendarService');

// Get calendar service status
router.get('/status', (req, res) => {
  try {
    const status = googleCalendarService.getStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get calendar status' });
  }
});

// Get upcoming events
router.get('/events', async (req, res) => {
  try {
    const maxResults = parseInt(req.query.limit) || 10;
    const events = await googleCalendarService.getUpcomingEvents(maxResults);
    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Failed to fetch calendar events' });
  }
});

// Create interview event
router.post('/events/interview', async (req, res) => {
  try {
    const {
      summary,
      description,
      startTime,
      endTime,
      timeZone,
      attendees,
      meetingLink
    } = req.body;

    if (!summary || !startTime || !endTime) {
      return res.status(400).json({ 
        error: 'Missing required fields: summary, startTime, endTime' 
      });
    }

    const eventDetails = {
      summary,
      description,
      startTime,
      endTime,
      timeZone,
      attendees: attendees || [],
      meetingLink
    };

    const event = await googleCalendarService.createInterviewEvent(eventDetails);
    res.json({
      success: true,
      event: {
        id: event.id,
        summary: event.summary,
        start: event.start,
        end: event.end,
        htmlLink: event.htmlLink,
        status: event.status
      }
    });
  } catch (error) {
    console.error('Create interview event error:', error);
    res.status(500).json({ error: 'Failed to create calendar event' });
  }
});

// Check availability
router.post('/availability', async (req, res) => {
  try {
    const { startTime, endTime } = req.body;

    if (!startTime || !endTime) {
      return res.status(400).json({ 
        error: 'Missing required fields: startTime, endTime' 
      });
    }

    const availability = await googleCalendarService.checkAvailability(startTime, endTime);
    res.json(availability);
  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({ error: 'Failed to check availability' });
  }
});

// Update event
router.put('/events/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const updates = req.body;

    const updatedEvent = await googleCalendarService.updateEvent(eventId, updates);
    res.json({
      success: true,
      event: updatedEvent
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Failed to update calendar event' });
  }
});

// Delete event
router.delete('/events/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const result = await googleCalendarService.deleteEvent(eventId);
    res.json(result);
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Failed to delete calendar event' });
  }
});

// Get Google OAuth URL
router.get('/auth/url', (req, res) => {
  try {
    const authUrl = googleCalendarService.getAuthUrl();
    res.json({ authUrl });
  } catch (error) {
    console.error('Get auth URL error:', error);
    res.status(500).json({ error: 'Failed to generate auth URL' });
  }
});

// Handle OAuth callback
router.post('/auth/callback', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Authorization code required' });
    }

    const tokens = await googleCalendarService.setCredentials(code);
    res.json({
      success: true,
      message: 'Google Calendar connected successfully',
      tokens: {
        access_token: tokens.access_token ? '***' : null,
        refresh_token: tokens.refresh_token ? '***' : null
      }
    });
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({ error: 'Failed to process OAuth callback' });
  }
});

module.exports = router;
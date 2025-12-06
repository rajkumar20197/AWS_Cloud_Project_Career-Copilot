const { google } = require('googleapis');

/**
 * Google Calendar Service
 * Handles calendar integration for interview scheduling
 */

class GoogleCalendarService {
  constructor() {
    this.oauth2Client = null;
    this.calendar = null;
    this.isConfigured = false;
    this.initializeService();
  }

  initializeService() {
    try {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      const redirectUri = process.env.GOOGLE_REDIRECT_URI;

      if (!clientId || !clientSecret || !redirectUri) {
        console.log('📅 Google Calendar: Configuration missing, using mock mode');
        this.isConfigured = false;
        return;
      }

      this.oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        redirectUri
      );

      this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
      this.isConfigured = true;
      console.log('📅 Google Calendar: ✅ Configured and ready');
    } catch (error) {
      console.error('📅 Google Calendar initialization error:', error.message);
      this.isConfigured = false;
    }
  }

  /**
   * Get authorization URL for OAuth flow
   */
  getAuthUrl() {
    if (!this.oauth2Client) {
      throw new Error('Google Calendar not configured');
    }

    const scopes = [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.events'
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });
  }

  /**
   * Set credentials from OAuth callback
   */
  async setCredentials(code) {
    if (!this.oauth2Client) {
      throw new Error('Google Calendar not configured');
    }

    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    return tokens;
  }

  /**
   * Create a calendar event for interview
   */
  async createInterviewEvent(eventDetails) {
    try {
      if (!this.isConfigured) {
        // Mock response for demo
        return {
          id: 'mock_event_' + Date.now(),
          htmlLink: 'https://calendar.google.com/calendar/event?eid=mock_event',
          summary: eventDetails.summary,
          start: { dateTime: eventDetails.startTime },
          end: { dateTime: eventDetails.endTime },
          status: 'confirmed'
        };
      }

      const event = {
        summary: eventDetails.summary || 'Interview',
        description: eventDetails.description || 'Job interview scheduled via AI Career Agent Coach',
        start: {
          dateTime: eventDetails.startTime,
          timeZone: eventDetails.timeZone || 'America/New_York',
        },
        end: {
          dateTime: eventDetails.endTime,
          timeZone: eventDetails.timeZone || 'America/New_York',
        },
        attendees: eventDetails.attendees || [],
        conferenceData: eventDetails.meetingLink ? {
          createRequest: {
            requestId: 'interview_' + Date.now(),
            conferenceSolutionKey: { type: 'hangoutsMeet' }
          }
        } : undefined,
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 day before
            { method: 'popup', minutes: 30 }, // 30 minutes before
          ],
        },
      };

      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        conferenceDataVersion: eventDetails.meetingLink ? 1 : 0,
      });

      console.log('📅 Calendar event created:', response.data.id);
      return response.data;
    } catch (error) {
      console.error('📅 Calendar event creation error:', error);
      throw error;
    }
  }

  /**
   * Get upcoming events
   */
  async getUpcomingEvents(maxResults = 10) {
    try {
      if (!this.isConfigured) {
        // Mock response for demo
        return {
          items: [
            {
              id: 'mock_event_1',
              summary: 'Interview with TechCorp',
              start: { dateTime: new Date(Date.now() + 86400000).toISOString() },
              end: { dateTime: new Date(Date.now() + 90000000).toISOString() },
              status: 'confirmed'
            },
            {
              id: 'mock_event_2',
              summary: 'Follow-up call with StartupXYZ',
              start: { dateTime: new Date(Date.now() + 172800000).toISOString() },
              end: { dateTime: new Date(Date.now() + 176400000).toISOString() },
              status: 'confirmed'
            }
          ]
        };
      }

      const response = await this.calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        maxResults: maxResults,
        singleEvents: true,
        orderBy: 'startTime',
      });

      return response.data;
    } catch (error) {
      console.error('📅 Get events error:', error);
      throw error;
    }
  }

  /**
   * Check for scheduling conflicts
   */
  async checkAvailability(startTime, endTime) {
    try {
      if (!this.isConfigured) {
        // Mock response - assume available
        return {
          available: true,
          conflicts: []
        };
      }

      const response = await this.calendar.freebusy.query({
        resource: {
          timeMin: startTime,
          timeMax: endTime,
          items: [{ id: 'primary' }],
        },
      });

      const busy = response.data.calendars.primary.busy || [];
      return {
        available: busy.length === 0,
        conflicts: busy
      };
    } catch (error) {
      console.error('📅 Availability check error:', error);
      return { available: true, conflicts: [] };
    }
  }

  /**
   * Update an existing event
   */
  async updateEvent(eventId, updates) {
    try {
      if (!this.isConfigured) {
        return {
          id: eventId,
          ...updates,
          status: 'confirmed'
        };
      }

      const response = await this.calendar.events.patch({
        calendarId: 'primary',
        eventId: eventId,
        resource: updates,
      });

      console.log('📅 Calendar event updated:', eventId);
      return response.data;
    } catch (error) {
      console.error('📅 Calendar event update error:', error);
      throw error;
    }
  }

  /**
   * Delete an event
   */
  async deleteEvent(eventId) {
    try {
      if (!this.isConfigured) {
        console.log('📅 Mock: Event deleted:', eventId);
        return { success: true };
      }

      await this.calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
      });

      console.log('📅 Calendar event deleted:', eventId);
      return { success: true };
    } catch (error) {
      console.error('📅 Calendar event deletion error:', error);
      throw error;
    }
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      configured: this.isConfigured,
      service: 'Google Calendar',
      status: this.isConfigured ? '✅ Ready' : '❌ Not configured',
      features: [
        'Event creation',
        'Availability checking',
        'Interview scheduling',
        'Automatic reminders'
      ]
    };
  }
}

module.exports = new GoogleCalendarService();
const { google } = require('googleapis');
const DynamoService = require('./dynamoService');

class GoogleService {
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    this.scopes = (process.env.GOOGLE_SCOPES || 
      'https://www.googleapis.com/auth/gmail.readonly,https://www.googleapis.com/auth/calendar.events,https://www.googleapis.com/auth/userinfo.email'
    ).split(',');
  }

  /**
   * Generate OAuth URL for user authorization
   */
  getAuthUrl(userId) {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.scopes,
      state: userId, // Pass userId to identify user after callback
      prompt: 'consent', // Force consent to get refresh token
    });
  }

  /**
   * Exchange authorization code for tokens
   */
  async getTokens(code) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      return tokens;
    } catch (error) {
      console.error('Error getting tokens:', error);
      throw new Error('Failed to exchange authorization code');
    }
  }

  /**
   * Save tokens to DynamoDB
   */
  async saveTokens(userId, tokens) {
    try {
      await DynamoService.updateUserProfile(userId, {
        googleTokens: {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expiry_date: tokens.expiry_date,
          scope: tokens.scope,
          token_type: tokens.token_type,
        },
        googleConnected: true,
        googleConnectedAt: new Date().toISOString(),
      });
      console.log('✅ Google tokens saved for user:', userId);
    } catch (error) {
      console.error('Error saving tokens:', error);
      throw error;
    }
  }

  /**
   * Get tokens from DynamoDB
   */
  async getStoredTokens(userId) {
    try {
      const { user } = await DynamoService.getUserProfile(userId);
      if (!user || !user.googleTokens) {
        throw new Error('No Google tokens found for user');
      }
      return user.googleTokens;
    } catch (error) {
      console.error('Error getting stored tokens:', error);
      throw error;
    }
  }

  /**
   * Set credentials and refresh if needed
   */
  async setCredentials(userId) {
    try {
      const tokens = await this.getStoredTokens(userId);
      this.oauth2Client.setCredentials(tokens);

      // Check if token is expired and refresh
      if (tokens.expiry_date && tokens.expiry_date < Date.now()) {
        console.log('🔄 Refreshing expired token...');
        const { credentials } = await this.oauth2Client.refreshAccessToken();
        await this.saveTokens(userId, credentials);
        this.oauth2Client.setCredentials(credentials);
      }

      return this.oauth2Client;
    } catch (error) {
      console.error('Error setting credentials:', error);
      throw error;
    }
  }

  /**
   * Disconnect Google account
   */
  async disconnect(userId) {
    try {
      await DynamoService.updateUserProfile(userId, {
        googleTokens: null,
        googleConnected: false,
      });
      console.log('✅ Google account disconnected for user:', userId);
    } catch (error) {
      console.error('Error disconnecting:', error);
      throw error;
    }
  }

  /**
   * Get Gmail messages
   */
  async getEmails(userId, options = {}) {
    try {
      const auth = await this.setCredentials(userId);
      const gmail = google.gmail({ version: 'v1', auth });

      const {
        maxResults = 50,
        query = 'interview OR meeting OR call',
        after = null, // Date in YYYY/MM/DD format
      } = options;

      // Build search query
      let searchQuery = query;
      if (after) {
        searchQuery += ` after:${after}`;
      }

      // List messages
      const response = await gmail.users.messages.list({
        userId: 'me',
        q: searchQuery,
        maxResults,
      });

      if (!response.data.messages) {
        return [];
      }

      // Get full message details
      const messages = await Promise.all(
        response.data.messages.map(async (message) => {
          const details = await gmail.users.messages.get({
            userId: 'me',
            id: message.id,
            format: 'full',
          });
          return this.parseEmail(details.data);
        })
      );

      console.log(`✅ Retrieved ${messages.length} emails for user:`, userId);
      return messages;
    } catch (error) {
      console.error('Error getting emails:', error);
      throw error;
    }
  }

  /**
   * Parse email data
   */
  parseEmail(emailData) {
    const headers = emailData.payload.headers;
    const getHeader = (name) => headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || '';

    // Get email body
    let body = '';
    if (emailData.payload.body.data) {
      body = Buffer.from(emailData.payload.body.data, 'base64').toString('utf-8');
    } else if (emailData.payload.parts) {
      const textPart = emailData.payload.parts.find(part => part.mimeType === 'text/plain');
      if (textPart && textPart.body.data) {
        body = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
      }
    }

    return {
      id: emailData.id,
      threadId: emailData.threadId,
      subject: getHeader('Subject'),
      from: getHeader('From'),
      to: getHeader('To'),
      date: getHeader('Date'),
      body: body.substring(0, 5000), // Limit body size
      snippet: emailData.snippet,
      labels: emailData.labelIds || [],
    };
  }

  /**
   * Create calendar event
   */
  async createCalendarEvent(userId, eventData) {
    try {
      const auth = await this.setCredentials(userId);
      const calendar = google.calendar({ version: 'v3', auth });

      const event = {
        summary: eventData.title,
        description: eventData.description || '',
        location: eventData.location || '',
        start: {
          dateTime: eventData.startTime,
          timeZone: eventData.timeZone || 'America/Los_Angeles',
        },
        end: {
          dateTime: eventData.endTime || this.addMinutes(eventData.startTime, eventData.duration || 60),
          timeZone: eventData.timeZone || 'America/Los_Angeles',
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 day before
            { method: 'popup', minutes: 60 }, // 1 hour before
            { method: 'popup', minutes: 15 }, // 15 minutes before
          ],
        },
      };

      // Add meeting link if provided
      if (eventData.meetingLink) {
        event.description += `\n\nMeeting Link: ${eventData.meetingLink}`;
        event.conferenceData = {
          entryPoints: [{
            entryPointType: 'video',
            uri: eventData.meetingLink,
          }],
        };
      }

      const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        conferenceDataVersion: eventData.meetingLink ? 1 : 0,
      });

      console.log('✅ Calendar event created:', response.data.id);
      return {
        eventId: response.data.id,
        htmlLink: response.data.htmlLink,
        event: response.data,
      };
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  }

  /**
   * Get calendar events
   */
  async getCalendarEvents(userId, options = {}) {
    try {
      const auth = await this.setCredentials(userId);
      const calendar = google.calendar({ version: 'v3', auth });

      const {
        timeMin = new Date().toISOString(),
        timeMax = null,
        maxResults = 50,
      } = options;

      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin,
        timeMax,
        maxResults,
        singleEvents: true,
        orderBy: 'startTime',
      });

      console.log(`✅ Retrieved ${response.data.items?.length || 0} calendar events`);
      return response.data.items || [];
    } catch (error) {
      console.error('Error getting calendar events:', error);
      throw error;
    }
  }

  /**
   * Update calendar event
   */
  async updateCalendarEvent(userId, eventId, updates) {
    try {
      const auth = await this.setCredentials(userId);
      const calendar = google.calendar({ version: 'v3', auth });

      const response = await calendar.events.patch({
        calendarId: 'primary',
        eventId,
        resource: updates,
      });

      console.log('✅ Calendar event updated:', eventId);
      return response.data;
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw error;
    }
  }

  /**
   * Delete calendar event
   */
  async deleteCalendarEvent(userId, eventId) {
    try {
      const auth = await this.setCredentials(userId);
      const calendar = google.calendar({ version: 'v3', auth });

      await calendar.events.delete({
        calendarId: 'primary',
        eventId,
      });

      console.log('✅ Calendar event deleted:', eventId);
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw error;
    }
  }

  /**
   * Helper: Add minutes to ISO date string
   */
  addMinutes(isoString, minutes) {
    const date = new Date(isoString);
    date.setMinutes(date.getMinutes() + minutes);
    return date.toISOString();
  }

  /**
   * Get user info from Google
   */
  async getUserInfo(userId) {
    try {
      const auth = await this.setCredentials(userId);
      const oauth2 = google.oauth2({ version: 'v2', auth });

      const response = await oauth2.userinfo.get();
      return response.data;
    } catch (error) {
      console.error('Error getting user info:', error);
      throw error;
    }
  }
}

module.exports = new GoogleService();

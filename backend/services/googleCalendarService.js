const { google } = require('googleapis');

/**
 * Google Calendar Service for Career Copilot
 * Schedule interview prep sessions, career events, job application deadlines
 */

// OAuth2 client configuration
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/google/callback'
);

/**
 * Generate OAuth URL for user to authorize
 */
function getAuthUrl() {
  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent', // Force consent screen to get refresh token
  });
}

/**
 * Exchange authorization code for tokens
 */
async function getTokensFromCode(code) {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    return tokens;
  } catch (error) {
    console.error('Error getting tokens:', error);
    throw error;
  }
}

/**
 * Set credentials for authenticated requests
 */
function setCredentials(tokens) {
  oauth2Client.setCredentials(tokens);
}

/**
 * Create a calendar event
 */
async function createEvent(userTokens, eventDetails) {
  try {
    // Set user's credentials
    oauth2Client.setCredentials(userTokens);

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
      summary: eventDetails.title,
      description: eventDetails.description,
      start: {
        dateTime: eventDetails.startTime,
        timeZone: eventDetails.timeZone || 'America/New_York',
      },
      end: {
        dateTime: eventDetails.endTime,
        timeZone: eventDetails.timeZone || 'America/New_York',
      },
      attendees: eventDetails.attendees || [],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 30 }, // 30 minutes before
        ],
      },
      colorId: eventDetails.colorId || '9', // Blue color
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      sendUpdates: 'all', // Send email notifications
    });

    return {
      success: true,
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
 * Create interview prep session
 */
async function scheduleInterviewPrep(userTokens, details) {
  const startTime = new Date(details.date);
  const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour

  return createEvent(userTokens, {
    title: `Interview Prep: ${details.company}`,
    description: `
🎯 Interview Preparation Session

Company: ${details.company}
Position: ${details.position}
Interview Type: ${details.type || 'General'}

Preparation Topics:
- Review company background
- Practice common interview questions
- Prepare questions to ask
- Review your resume and experiences

Good luck! 🚀

Powered by Career Copilot
    `.trim(),
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    timeZone: details.timeZone,
    colorId: '11', // Red for important
  });
}

/**
 * Create job application deadline reminder
 */
async function scheduleApplicationDeadline(userTokens, details) {
  const deadlineDate = new Date(details.deadline);
  const reminderDate = new Date(deadlineDate.getTime() - 24 * 60 * 60 * 1000); // 1 day before

  return createEvent(userTokens, {
    title: `📝 Application Deadline: ${details.company}`,
    description: `
Application Deadline Reminder

Company: ${details.company}
Position: ${details.position}
Deadline: ${deadlineDate.toLocaleDateString()}

Don't forget to:
✓ Complete application form
✓ Upload resume and cover letter
✓ Double-check all information
✓ Submit before deadline!

Application Link: ${details.applicationUrl || 'N/A'}

Powered by Career Copilot
    `.trim(),
    startTime: reminderDate.toISOString(),
    endTime: new Date(reminderDate.getTime() + 30 * 60 * 1000).toISOString(), // 30 min
    timeZone: details.timeZone,
    colorId: '5', // Yellow for deadlines
  });
}

/**
 * Create networking event
 */
async function scheduleNetworkingEvent(userTokens, details) {
  const startTime = new Date(details.startTime);
  const endTime = new Date(details.endTime);

  return createEvent(userTokens, {
    title: `🤝 Networking: ${details.eventName}`,
    description: `
Networking Event

Event: ${details.eventName}
Location: ${details.location || 'Virtual'}
${details.meetingLink ? `Meeting Link: ${details.meetingLink}` : ''}

Goals:
- Meet professionals in your field
- Learn about job opportunities
- Build your network

Tips:
- Prepare your elevator pitch
- Bring business cards (or digital contact)
- Follow up within 24 hours

Powered by Career Copilot
    `.trim(),
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    timeZone: details.timeZone,
    attendees: details.attendees,
    colorId: '10', // Green for networking
  });
}

/**
 * List upcoming events
 */
async function listUpcomingEvents(userTokens, maxResults = 10) {
  try {
    oauth2Client.setCredentials(userTokens);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: maxResults,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items || [];
  } catch (error) {
    console.error('Error listing events:', error);
    throw error;
  }
}

/**
 * Delete an event
 */
async function deleteEvent(userTokens, eventId) {
  try {
    oauth2Client.setCredentials(userTokens);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
}

/**
 * Update an event
 */
async function updateEvent(userTokens, eventId, updates) {
  try {
    oauth2Client.setCredentials(userTokens);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Get existing event
    const existingEvent = await calendar.events.get({
      calendarId: 'primary',
      eventId: eventId,
    });

    // Merge updates
    const updatedEvent = {
      ...existingEvent.data,
      ...updates,
    };

    const response = await calendar.events.update({
      calendarId: 'primary',
      eventId: eventId,
      resource: updatedEvent,
    });

    return {
      success: true,
      event: response.data,
    };
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
}

module.exports = {
  getAuthUrl,
  getTokensFromCode,
  setCredentials,
  createEvent,
  scheduleInterviewPrep,
  scheduleApplicationDeadline,
  scheduleNetworkingEvent,
  listUpcomingEvents,
  deleteEvent,
  updateEvent,
};

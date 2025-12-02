/**
 * Google Calendar Integration Service
 * Automatically manages job search calendar events
 */

class CalendarService {
  constructor() {
    this.isInitialized = false;
  }

  // Initialize Calendar API
  async initialize() {
    if (this.isInitialized) return;

    await new Promise((resolve) => {
      gapi.load('auth2:client', resolve);
    });

    await gapi.client.init({
      apiKey: process.env.VITE_GOOGLE_API_KEY,
      clientId: process.env.VITE_GOOGLE_CLIENT_ID,
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
      scope: 'https://www.googleapis.com/auth/calendar'
    });

    this.isInitialized = true;
  }

  // Create interview event
  async createInterviewEvent(jobInfo) {
    const event = {
      summary: `🎯 Interview: ${jobInfo.position} at ${jobInfo.company}`,
      description: this.buildInterviewDescription(jobInfo),
      start: {
        dateTime: jobInfo.interviewDate,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: this.addHours(jobInfo.interviewDate, 1), // Default 1 hour
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      location: jobInfo.interviewLocation,
      colorId: '11', // Red for interviews
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 60 }, // 1 hour before
          { method: 'popup', minutes: 15 }  // 15 minutes before
        ]
      }
    };

    // Add prep time block before interview
    await this.createPrepTimeEvent(jobInfo);

    const response = await gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event
    });

    return response.result;
  }

  // Create application deadline reminder
  async createDeadlineReminder(jobInfo) {
    const event = {
      summary: `📝 Application Deadline: ${jobInfo.position} at ${jobInfo.company}`,
      description: `Don't forget to submit your application for ${jobInfo.position} at ${jobInfo.company}!`,
      start: {
        date: jobInfo.applicationDeadline // All-day event
      },
      end: {
        date: jobInfo.applicationDeadline
      },
      colorId: '9', // Blue for deadlines
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 1440 }, // 1 day before
          { method: 'popup', minutes: 60 }    // 1 hour before
        ]
      }
    };

    const response = await gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event
    });

    return response.result;
  }

  // Create follow-up reminder
  async createFollowUpReminder(jobInfo, daysAfter = 7) {
    const followUpDate = this.addDays(new Date(), daysAfter);
    
    const event = {
      summary: `📞 Follow Up: ${jobInfo.position} at ${jobInfo.company}`,
      description: `Time to follow up on your application for ${jobInfo.position} at ${jobInfo.company}`,
      start: {
        dateTime: followUpDate.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: this.addHours(followUpDate.toISOString(), 0.5),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      colorId: '5', // Yellow for follow-ups
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 15 }
        ]
      }
    };

    const response = await gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event
    });

    return response.result;
  }

  // Create interview prep time block
  async createPrepTimeEvent(jobInfo) {
    const prepTime = this.subtractHours(jobInfo.interviewDate, 1);
    
    const event = {
      summary: `🎯 Prep Time: ${jobInfo.company} Interview`,
      description: `Preparation time for your ${jobInfo.position} interview at ${jobInfo.company}.\n\nPrep checklist:\n- Review job description\n- Research company\n- Prepare questions\n- Test video setup`,
      start: {
        dateTime: prepTime,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: jobInfo.interviewDate,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      colorId: '10', // Green for prep
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 15 }
        ]
      }
    };

    const response = await gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event
    });

    return response.result;
  }

  // Get today's job-related events
  async getTodaysJobEvents() {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

    const response = await gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: startOfDay,
      timeMax: endOfDay,
      singleEvents: true,
      orderBy: 'startTime',
      q: 'Interview OR Application OR Follow'
    });

    return response.result.items || [];
  }

  // Helper functions
  buildInterviewDescription(jobInfo) {
    return `
Interview Details:
• Position: ${jobInfo.position}
• Company: ${jobInfo.company}
• Location: ${jobInfo.interviewLocation}

Preparation Tips:
• Research the company and role
• Prepare STAR method examples
• Have questions ready about the team/culture
• Test your setup if it's a video interview

Good luck! 🍀
    `.trim();
  }

  addHours(dateString, hours) {
    const date = new Date(dateString);
    date.setHours(date.getHours() + hours);
    return date.toISOString();
  }

  subtractHours(dateString, hours) {
    const date = new Date(dateString);
    date.setHours(date.getHours() - hours);
    return date.toISOString();
  }

  addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}

export default new CalendarService();
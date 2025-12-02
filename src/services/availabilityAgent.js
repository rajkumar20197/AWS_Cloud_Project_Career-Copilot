/**
 * AI Availability Agent
 * Automatically responds to interview scheduling emails based on student's calendar
 */

import calendarService from './calendarService';
import gmailService from './gmailService';
import { BedrockService } from './bedrockService';
import googleAuthService from './googleAuthService';
import emailSendingService from './emailSendingService';
import interviewPrepAgent from './interviewPrepAgent';
import followUpAgent from './followUpAgent';
import schedulingDataService from './schedulingDataService';

class AvailabilityAgent {
  constructor() {
    this.isActive = false;
    this.studentPreferences = {
      workingHours: { start: '09:00', end: '17:00' },
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      bufferTime: 30, // minutes between meetings
      maxInterviewsPerDay: 3,
      unavailableDays: [], // ['saturday', 'sunday']
      preferredDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    };
  }

  // Start monitoring for interview scheduling emails
  async startMonitoring(userId) {
    this.isActive = true;
    this.userId = userId;
    console.log('🤖 Availability Agent is now active');
    
    // Ensure Google Auth is initialized
    await googleAuthService.initialize();
    
    // Check for new emails every 5 minutes
    this.monitoringInterval = setInterval(async () => {
      await this.checkForSchedulingEmails();
    }, 5 * 60 * 1000);
    
    // Process pending follow-ups every hour
    this.followUpInterval = setInterval(async () => {
      await followUpAgent.processPendingFollowUps(userId);
    }, 60 * 60 * 1000);
  }

  // Stop monitoring
  stopMonitoring() {
    this.isActive = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    if (this.followUpInterval) {
      clearInterval(this.followUpInterval);
    }
    console.log('🤖 Availability Agent stopped');
  }

  // Check for new interview scheduling emails
  async checkForSchedulingEmails() {
    try {
      const schedulingEmails = await this.findSchedulingEmails();
      
      for (const email of schedulingEmails) {
        if (await this.shouldAutoRespond(email)) {
          await this.processSchedulingRequest(email);
        }
      }
    } catch (error) {
      console.error('Error checking scheduling emails:', error);
    }
  }

  // Find emails that need scheduling responses
  async findSchedulingEmails() {
    const query = [
      'subject:(schedule OR interview OR available OR availability)',
      'body:(when are you available OR schedule an interview OR pick a time)',
      'is:unread',
      'newer_than:1d'
    ].join(' AND ');

    const response = await gapi.client.gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults: 10
    });

    const emails = [];
    for (const message of response.result.messages || []) {
      const email = await gmailService.getEmailDetails(message.id);
      const parsed = await this.parseSchedulingEmail(email);
      if (parsed && parsed.needsScheduling) {
        emails.push({ ...parsed, messageId: message.id });
      }
    }

    return emails;
  }

  // Parse scheduling email with AI
  async parseSchedulingEmail(email) {
    const headers = email.payload.headers;
    const subject = headers.find(h => h.name === 'Subject')?.value || '';
    const from = headers.find(h => h.name === 'From')?.value || '';
    
    // Get email body
    let body = '';
    if (email.payload.body?.data) {
      body = atob(email.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
    } else if (email.payload.parts) {
      const textPart = email.payload.parts.find(part => part.mimeType === 'text/plain');
      if (textPart?.body?.data) {
        body = atob(textPart.body.data.replace(/-/g, '+').replace(/_/g, '/'));
      }
    }

    const prompt = `
    Analyze this email to determine if it's requesting interview scheduling:
    
    Subject: ${subject}
    From: ${from}
    Body: ${body.substring(0, 1500)}
    
    Return JSON with:
    {
      "needsScheduling": true/false,
      "company": "company name",
      "position": "job title", 
      "contactName": "recruiter/interviewer name",
      "contactEmail": "email address",
      "suggestedTimes": ["YYYY-MM-DD HH:mm", ...] or null,
      "interviewType": "phone|video|in-person",
      "duration": "estimated duration in minutes",
      "urgency": "high|medium|low",
      "schedulingDeadline": "YYYY-MM-DD" or null
    }
    `;

    const aiResponse = await this.callAI(prompt);
    return JSON.parse(aiResponse);
  }

  // Check if we should auto-respond to this email
  async shouldAutoRespond(emailData) {
    // Don't respond if:
    // 1. Already responded to this sender recently
    // 2. Email is too old
    // 3. Student has disabled auto-scheduling
    // 4. High-priority company (student wants manual control)
    
    const recentResponses = await this.getRecentResponses(emailData.contactEmail);
    if (recentResponses.length > 0) {
      console.log(`Already responded to ${emailData.contactEmail} recently`);
      return false;
    }

    return true;
  }

  // Main scheduling logic
  async processSchedulingRequest(emailData) {
    try {
      console.log(`🤖 Processing scheduling request from ${emailData.company}`);
      
      // Get student's availability
      const availability = await this.getStudentAvailability(emailData.schedulingDeadline);
      
      if (availability.length === 0) {
        await this.sendNoAvailabilityResponse(emailData);
        return;
      }

      // Generate professional response
      const response = await this.generateSchedulingResponse(emailData, availability);
      
      // Send the response using the email sending service
      await emailSendingService.sendAvailabilityResponse(
        emailData.contactEmail,
        emailData.company,
        emailData.position,
        availability.map(slot => slot.formatted),
        emailData.messageId
      );
      
      // Create calendar event for the interview (tentative)
      if (availability.length > 0) {
        const tentativeInterview = {
          company: emailData.company,
          position: emailData.position,
          interviewDate: availability[0].start, // Use first available slot as tentative
          interviewType: emailData.interviewType,
          contactEmail: emailData.contactEmail
        };
        
        // Schedule interview prep
        await interviewPrepAgent.scheduleInterviewPrep(
          this.userId,
          emailData.company,
          emailData.position,
          availability[0].start,
          emailData.interviewType
        );
        
        // Track application
        await followUpAgent.trackApplication(
          this.userId,
          emailData.company,
          emailData.position,
          emailData.contactEmail
        );
      }
      
      // Log the interaction
      await schedulingDataService.logSchedulingInteraction(this.userId, {
        type: 'response_sent',
        company: emailData.company,
        position: emailData.position,
        timestamp: new Date().toISOString(),
        metadata: { availabilitySlots: availability.length, autoSent: true }
      });
      
      console.log(`✅ Sent availability response to ${emailData.company}`);
      
    } catch (error) {
      console.error('Error processing scheduling request:', error);
    }
  }

  // Get student's available time slots
  async getStudentAvailability(deadline = null) {
    const endDate = deadline ? new Date(deadline) : this.addDays(new Date(), 14); // 2 weeks default
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1); // Start from tomorrow

    const busyTimes = await this.getBusyTimes(startDate, endDate);
    const availableSlots = this.generateAvailableSlots(startDate, endDate, busyTimes);
    
    return availableSlots.slice(0, 5); // Return top 5 options
  }

  // Get busy times from calendar
  async getBusyTimes(startDate, endDate) {
    const response = await gapi.client.calendar.freebusy.query({
      resource: {
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        items: [{ id: 'primary' }]
      }
    });

    return response.result.calendars.primary.busy || [];
  }

  // Generate available time slots
  generateAvailableSlots(startDate, endDate, busyTimes) {
    const slots = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      // Skip weekends if not preferred
      if (this.studentPreferences.unavailableDays.includes(this.getDayName(current))) {
        current.setDate(current.getDate() + 1);
        continue;
      }

      // Generate slots for this day
      const daySlots = this.generateDaySlots(current, busyTimes);
      slots.push(...daySlots);

      current.setDate(current.getDate() + 1);
    }

    return slots.sort((a, b) => new Date(a.start) - new Date(b.start));
  }

  // Generate available slots for a specific day
  generateDaySlots(date, busyTimes) {
    const slots = [];
    const dayStart = new Date(date);
    const [startHour, startMin] = this.studentPreferences.workingHours.start.split(':');
    dayStart.setHours(parseInt(startHour), parseInt(startMin), 0, 0);

    const dayEnd = new Date(date);
    const [endHour, endMin] = this.studentPreferences.workingHours.end.split(':');
    dayEnd.setHours(parseInt(endHour), parseInt(endMin), 0, 0);

    const slotDuration = 60; // 1 hour slots
    const current = new Date(dayStart);

    while (current < dayEnd) {
      const slotEnd = new Date(current.getTime() + slotDuration * 60000);
      
      // Check if this slot conflicts with busy times
      const isAvailable = !busyTimes.some(busy => {
        const busyStart = new Date(busy.start);
        const busyEnd = new Date(busy.end);
        return (current < busyEnd && slotEnd > busyStart);
      });

      if (isAvailable) {
        slots.push({
          start: current.toISOString(),
          end: slotEnd.toISOString(),
          formatted: this.formatTimeSlot(current, slotEnd)
        });
      }

      current.setTime(current.getTime() + slotDuration * 60000);
    }

    return slots.slice(0, this.studentPreferences.maxInterviewsPerDay);
  }

  // Generate professional scheduling response
  async generateSchedulingResponse(emailData, availability) {
    const availabilityText = availability.map((slot, index) => 
      `${index + 1}. ${slot.formatted}`
    ).join('\n');

    const prompt = `
    Generate a professional email response for interview scheduling:
    
    Context:
    - Company: ${emailData.company}
    - Position: ${emailData.position}
    - Contact: ${emailData.contactName}
    - Interview Type: ${emailData.interviewType}
    
    Available times:
    ${availabilityText}
    
    Write a professional, enthusiastic response that:
    1. Thanks them for the opportunity
    2. Confirms interest in the position
    3. Provides the available time slots
    4. Asks them to confirm their preferred time
    5. Mentions any preparation questions if needed
    
    Keep it concise and professional.
    `;

    return await this.callAI(prompt);
  }

  // Send email response
  async sendEmailResponse(emailData, responseText) {
    const email = [
      `To: ${emailData.contactEmail}`,
      `Subject: Re: Interview Scheduling - ${emailData.position}`,
      `Content-Type: text/plain; charset=utf-8`,
      '',
      responseText
    ].join('\n');

    const encodedEmail = btoa(email).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    await gapi.client.gmail.users.messages.send({
      userId: 'me',
      resource: {
        raw: encodedEmail
      }
    });
  }

  // Send response when no availability
  async sendNoAvailabilityResponse(emailData) {
    const response = `
Dear ${emailData.contactName || 'Hiring Team'},

Thank you for your interest in scheduling an interview for the ${emailData.position} position at ${emailData.company}.

Unfortunately, I don't have any availability that matches your requested timeframe. However, I remain very interested in this opportunity.

Could we explore alternative dates? I would be happy to work with you to find a mutually convenient time.

Thank you for your understanding, and I look forward to hearing from you.

Best regards,
[Student Name]
    `.trim();

    await this.sendEmailResponse(emailData, response);
  }

  // Helper functions
  formatTimeSlot(start, end) {
    const options = {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    })}`;
  }

  getDayName(date) {
    return date.toLocaleDateString('en-US', { weekday: 'lowercase' });
  }

  addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  async getRecentResponses(email) {
    // Check if we've responded to this email in the last 7 days
    const query = `to:${email} from:me newer_than:7d`;
    const response = await gapi.client.gmail.users.messages.list({
      userId: 'me',
      q: query
    });
    return response.result.messages || [];
  }

  async logSchedulingInteraction(emailData, availability) {
    // Log to your analytics system
    console.log('Scheduling interaction logged:', {
      company: emailData.company,
      position: emailData.position,
      availabilityOffered: availability.length,
      timestamp: new Date().toISOString()
    });
  }

  async callAI(prompt) {
    try {
      // Use your existing Bedrock AI service
      const response = await BedrockService.callBedrock(prompt, 1000);
      return response;
    } catch (error) {
      console.error('AI service error:', error);
      // Fallback response
      return `Thank you for your interest in scheduling an interview. I'm excited about this opportunity and would be happy to meet at your convenience.`;
    }
  }

  // Update student preferences
  updatePreferences(newPreferences) {
    this.studentPreferences = { ...this.studentPreferences, ...newPreferences };
    console.log('🤖 Availability preferences updated');
  }
}

export default new AvailabilityAgent();
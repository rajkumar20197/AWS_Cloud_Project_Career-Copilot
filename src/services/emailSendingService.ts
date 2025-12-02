/**
 * Email Sending Service
 * Handles sending emails through Gmail API
 */

import googleAuthService from './googleAuthService';

interface EmailDraft {
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  body: string;
  isHtml?: boolean;
  replyToMessageId?: string;
  threadId?: string;
}

interface EmailTemplate {
  type: 'interview_response' | 'follow_up' | 'thank_you' | 'availability_update';
  subject: string;
  body: string;
  variables: { [key: string]: string };
}

class EmailSendingService {
  
  // Send email through Gmail API
  async sendEmail(draft: EmailDraft): Promise<string> {
    try {
      const accessToken = await googleAuthService.getValidAccessToken();
      
      // Create email message
      const email = this.createEmailMessage(draft);
      
      // Send via Gmail API
      const response = await gapi.client.gmail.users.messages.send({
        userId: 'me',
        resource: {
          raw: email,
          threadId: draft.threadId
        }
      });

      console.log('✅ Email sent successfully:', response.result.id);
      return response.result.id;
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      
      // Handle token refresh
      const shouldRetry = await googleAuthService.handleApiError(error);
      if (shouldRetry) {
        return this.sendEmail(draft); // Retry once
      }
      
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  // Reply to an existing email
  async replyToEmail(originalMessageId: string, replyBody: string, includeOriginal: boolean = true): Promise<string> {
    try {
      // Get original email details
      const originalEmail = await gapi.client.gmail.users.messages.get({
        userId: 'me',
        id: originalMessageId,
        format: 'full'
      });

      const headers = originalEmail.result.payload.headers;
      const originalSubject = headers.find((h: any) => h.name === 'Subject')?.value || '';
      const originalFrom = headers.find((h: any) => h.name === 'From')?.value || '';
      const threadId = originalEmail.result.threadId;

      // Create reply
      const replySubject = originalSubject.startsWith('Re: ') ? originalSubject : `Re: ${originalSubject}`;
      
      let fullReplyBody = replyBody;
      if (includeOriginal) {
        const originalBody = this.extractEmailBody(originalEmail.result);
        fullReplyBody += `\n\n--- Original Message ---\n${originalBody}`;
      }

      const replyDraft: EmailDraft = {
        to: originalFrom,
        subject: replySubject,
        body: fullReplyBody,
        replyToMessageId: originalMessageId,
        threadId: threadId
      };

      return await this.sendEmail(replyDraft);
    } catch (error) {
      console.error('❌ Failed to reply to email:', error);
      throw error;
    }
  }

  // Send interview availability response
  async sendAvailabilityResponse(
    recruiterEmail: string,
    company: string,
    position: string,
    availableSlots: string[],
    originalMessageId?: string
  ): Promise<string> {
    const subject = `Re: Interview Scheduling - ${position}`;
    
    const body = `Dear Hiring Team,

Thank you for your interest in scheduling an interview for the ${position} position at ${company}. I'm excited about this opportunity and would be happy to meet at your convenience.

I'm available during the following times:

${availableSlots.map((slot, index) => `${index + 1}. ${slot}`).join('\n')}

Please let me know which time works best for you, and I'll confirm immediately. If none of these times work, I'm happy to work with you to find an alternative.

I look forward to our conversation and learning more about the role and team.

Best regards,
[Your Name]`;

    const draft: EmailDraft = {
      to: recruiterEmail,
      subject,
      body,
      replyToMessageId: originalMessageId
    };

    return await this.sendEmail(draft);
  }

  // Send follow-up email
  async sendFollowUpEmail(
    recruiterEmail: string,
    company: string,
    position: string,
    followUpType: 'application_status' | 'post_interview' | 'offer_follow_up',
    originalMessageId?: string
  ): Promise<string> {
    const templates = this.getFollowUpTemplates();
    const template = templates[followUpType];
    
    const subject = template.subject.replace('{position}', position).replace('{company}', company);
    const body = template.body
      .replace('{position}', position)
      .replace('{company}', company)
      .replace('{date}', new Date().toLocaleDateString());

    const draft: EmailDraft = {
      to: recruiterEmail,
      subject,
      body,
      replyToMessageId: originalMessageId
    };

    return await this.sendEmail(draft);
  }

  // Send thank you email after interview
  async sendThankYouEmail(
    interviewerEmail: string,
    interviewerName: string,
    company: string,
    position: string,
    interviewDate: string,
    keyDiscussionPoints?: string[]
  ): Promise<string> {
    const subject = `Thank you - ${position} Interview`;
    
    let body = `Dear ${interviewerName},

Thank you for taking the time to speak with me about the ${position} role at ${company} on ${interviewDate}. I enjoyed our conversation and learning more about the team and the exciting projects you're working on.`;

    if (keyDiscussionPoints && keyDiscussionPoints.length > 0) {
      body += `\n\nI was particularly interested in our discussion about:\n${keyDiscussionPoints.map(point => `• ${point}`).join('\n')}`;
    }

    body += `\n\nI'm very excited about the opportunity to contribute to ${company} and would welcome the chance to join your team. Please let me know if you need any additional information from me.

Thank you again for your time and consideration.

Best regards,
[Your Name]`;

    const draft: EmailDraft = {
      to: interviewerEmail,
      subject,
      body
    };

    return await this.sendEmail(draft);
  }

  // Schedule email to be sent later
  async scheduleEmail(draft: EmailDraft, sendTime: Date): Promise<string> {
    // For now, we'll store in localStorage and use a simple scheduler
    // In production, you'd use a proper job queue or AWS SES scheduled sending
    
    const scheduledEmail = {
      id: `scheduled_${Date.now()}`,
      draft,
      sendTime: sendTime.toISOString(),
      status: 'scheduled'
    };

    const scheduledEmails = this.getScheduledEmails();
    scheduledEmails.push(scheduledEmail);
    localStorage.setItem('scheduled_emails', JSON.stringify(scheduledEmails));

    // Set timeout for sending (if within next 24 hours)
    const timeUntilSend = sendTime.getTime() - Date.now();
    if (timeUntilSend > 0 && timeUntilSend < 24 * 60 * 60 * 1000) {
      setTimeout(async () => {
        try {
          await this.sendEmail(draft);
          this.markScheduledEmailAsSent(scheduledEmail.id);
        } catch (error) {
          console.error('Failed to send scheduled email:', error);
        }
      }, timeUntilSend);
    }

    return scheduledEmail.id;
  }

  // Create email message in RFC 2822 format
  private createEmailMessage(draft: EmailDraft): string {
    const boundary = `boundary_${Date.now()}`;
    
    let message = [
      `To: ${draft.to}`,
      draft.cc ? `Cc: ${draft.cc}` : '',
      draft.bcc ? `Bcc: ${draft.bcc}` : '',
      `Subject: ${draft.subject}`,
      'Content-Type: text/plain; charset=utf-8',
      '',
      draft.body
    ].filter(line => line !== '').join('\n');

    // Base64 encode and make URL safe
    return btoa(message)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  // Extract body from email payload
  private extractEmailBody(message: any): string {
    let body = '';
    
    if (message.payload.body?.data) {
      body = atob(message.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
    } else if (message.payload.parts) {
      const textPart = message.payload.parts.find((part: any) => part.mimeType === 'text/plain');
      if (textPart?.body?.data) {
        body = atob(textPart.body.data.replace(/-/g, '+').replace(/_/g, '/'));
      }
    }
    
    return body.substring(0, 500) + '...'; // Truncate for reply
  }

  // Get follow-up email templates
  private getFollowUpTemplates(): { [key: string]: EmailTemplate } {
    return {
      application_status: {
        type: 'follow_up',
        subject: 'Following up on {position} Application',
        body: `Dear Hiring Team,

I hope this email finds you well. I wanted to follow up on my application for the {position} role at {company} that I submitted on {date}.

I remain very interested in this opportunity and would welcome the chance to discuss how my skills and experience align with your team's needs.

If you need any additional information from me, please don't hesitate to reach out.

Thank you for your time and consideration.

Best regards,
[Your Name]`,
        variables: { position: '', company: '', date: '' }
      },
      
      post_interview: {
        type: 'follow_up',
        subject: 'Thank you and next steps - {position}',
        body: `Dear Hiring Team,

I wanted to thank you again for the opportunity to interview for the {position} role at {company}. I enjoyed our conversation and learning more about the team and projects.

I'm very excited about the possibility of joining {company} and contributing to your continued success. 

Could you please let me know about the next steps in the process and the expected timeline for a decision?

Thank you for your time and consideration.

Best regards,
[Your Name]`,
        variables: { position: '', company: '' }
      },
      
      offer_follow_up: {
        type: 'follow_up',
        subject: 'Following up on {position} Offer',
        body: `Dear Hiring Team,

I hope you're doing well. I wanted to follow up on the offer for the {position} role at {company}.

I'm very excited about this opportunity and am currently reviewing the details. I should have a response for you by [specific date].

If you have any questions or need additional information from me in the meantime, please let me know.

Thank you for your patience and for this wonderful opportunity.

Best regards,
[Your Name]`,
        variables: { position: '', company: '' }
      }
    };
  }

  // Get scheduled emails from storage
  private getScheduledEmails(): any[] {
    const stored = localStorage.getItem('scheduled_emails');
    return stored ? JSON.parse(stored) : [];
  }

  // Mark scheduled email as sent
  private markScheduledEmailAsSent(emailId: string): void {
    const scheduledEmails = this.getScheduledEmails();
    const emailIndex = scheduledEmails.findIndex(email => email.id === emailId);
    
    if (emailIndex !== -1) {
      scheduledEmails[emailIndex].status = 'sent';
      scheduledEmails[emailIndex].sentAt = new Date().toISOString();
      localStorage.setItem('scheduled_emails', JSON.stringify(scheduledEmails));
    }
  }

  // Process scheduled emails (call this periodically)
  async processScheduledEmails(): Promise<void> {
    const scheduledEmails = this.getScheduledEmails();
    const now = new Date();

    for (const scheduledEmail of scheduledEmails) {
      if (scheduledEmail.status === 'scheduled' && new Date(scheduledEmail.sendTime) <= now) {
        try {
          await this.sendEmail(scheduledEmail.draft);
          this.markScheduledEmailAsSent(scheduledEmail.id);
          console.log('✅ Scheduled email sent:', scheduledEmail.id);
        } catch (error) {
          console.error('❌ Failed to send scheduled email:', error);
          // Mark as failed
          scheduledEmail.status = 'failed';
          scheduledEmail.error = error.message;
        }
      }
    }

    // Update storage
    localStorage.setItem('scheduled_emails', JSON.stringify(scheduledEmails));
  }
}

export default new EmailSendingService();
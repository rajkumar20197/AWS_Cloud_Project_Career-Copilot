const { BedrockRuntimeClient, ConverseCommand } = require('@aws-sdk/client-bedrock-runtime');

// Initialize Bedrock client
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const MODEL_ID = process.env.BEDROCK_MODEL_ID || 'us.anthropic.claude-3-5-haiku-20241022-v1:0';

class InterviewDetectionService {
  /**
   * Analyze email to detect if it's an interview invitation
   */
  async analyzeEmail(email) {
    try {
      const prompt = `
Analyze this email and determine if it's an interview invitation or interview-related communication.

Email Subject: ${email.subject}
Email From: ${email.from}
Email Body:
${email.body}

Extract the following information if this is an interview-related email:

1. Is this an interview invitation? (yes/no)
2. Company name
3. Interview date and time (in ISO 8601 format if possible)
4. Interview type (phone, video, in-person, or unknown)
5. Meeting link (Zoom, Teams, Google Meet, etc.)
6. Interviewer name
7. Interview position/role
8. Location (if in-person)
9. Duration (in minutes, estimate if not specified)
10. Confidence score (0-100) that this is an interview

Return ONLY a JSON object with this structure:
{
  "isInterview": boolean,
  "confidence": number,
  "company": string,
  "position": string,
  "date": string (ISO 8601),
  "time": string,
  "type": string,
  "meetingLink": string,
  "interviewer": string,
  "location": string,
  "duration": number,
  "notes": string
}

If any field cannot be determined, use null. Be conservative - only mark as interview if confidence > 70.
`;

      const command = new ConverseCommand({
        modelId: MODEL_ID,
        messages: [
          {
            role: 'user',
            content: [{ text: prompt }]
          }
        ],
        inferenceConfig: {
          maxTokens: 1024,
          temperature: 0.3, // Lower temperature for more consistent extraction
        }
      });

      const response = await bedrockClient.send(command);
      const text = response.output.message.content[0].text;

      // Parse JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn('⚠️ Could not parse AI response as JSON');
        return this.createDefaultResponse(false);
      }

      const analysis = JSON.parse(jsonMatch[0]);
      
      console.log(`✅ Email analyzed - Interview: ${analysis.isInterview}, Confidence: ${analysis.confidence}%`);
      
      return {
        ...analysis,
        emailId: email.id,
        emailSubject: email.subject,
        emailFrom: email.from,
        emailDate: email.date,
      };
    } catch (error) {
      console.error('❌ Error analyzing email:', error);
      return this.createDefaultResponse(false, error.message);
    }
  }

  /**
   * Batch analyze multiple emails
   */
  async analyzeEmails(emails) {
    try {
      console.log(`🔍 Analyzing ${emails.length} emails for interviews...`);
      
      const analyses = await Promise.all(
        emails.map(email => this.analyzeEmail(email))
      );

      // Filter for high-confidence interviews
      const interviews = analyses.filter(
        analysis => analysis.isInterview && analysis.confidence >= 70
      );

      console.log(`✅ Found ${interviews.length} interviews out of ${emails.length} emails`);
      
      return {
        total: emails.length,
        interviewsFound: interviews.length,
        interviews,
        allAnalyses: analyses,
      };
    } catch (error) {
      console.error('❌ Error in batch analysis:', error);
      throw error;
    }
  }

  /**
   * Extract meeting link from email body
   */
  extractMeetingLink(text) {
    // Common meeting link patterns
    const patterns = [
      /https?:\/\/[\w-]*\.?zoom\.us\/[^\s]+/i,
      /https?:\/\/teams\.microsoft\.com\/[^\s]+/i,
      /https?:\/\/meet\.google\.com\/[^\s]+/i,
      /https?:\/\/[\w-]*\.?webex\.com\/[^\s]+/i,
      /https?:\/\/[\w-]*\.?gotomeeting\.com\/[^\s]+/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[0];
      }
    }

    return null;
  }

  /**
   * Detect interview keywords
   */
  hasInterviewKeywords(text) {
    const keywords = [
      'interview',
      'interviewing',
      'interview invitation',
      'schedule an interview',
      'phone screen',
      'technical interview',
      'behavioral interview',
      'final round',
      'onsite interview',
      'video interview',
      'meet with',
      'speak with you',
      'discuss your application',
      'next steps in the process',
    ];

    const lowerText = text.toLowerCase();
    return keywords.some(keyword => lowerText.includes(keyword));
  }

  /**
   * Create default response
   */
  createDefaultResponse(isInterview = false, error = null) {
    return {
      isInterview,
      confidence: 0,
      company: null,
      position: null,
      date: null,
      time: null,
      type: null,
      meetingLink: null,
      interviewer: null,
      location: null,
      duration: null,
      notes: error || 'Could not analyze email',
    };
  }

  /**
   * Format interview for calendar event
   */
  formatForCalendar(interview) {
    try {
      // Parse date/time
      let startTime;
      if (interview.date) {
        startTime = new Date(interview.date).toISOString();
      } else {
        // Default to tomorrow at 10 AM if no date found
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 0, 0, 0);
        startTime = tomorrow.toISOString();
      }

      return {
        title: `Interview: ${interview.position || 'Position'} at ${interview.company || 'Company'}`,
        description: this.buildDescription(interview),
        startTime,
        duration: interview.duration || 60,
        location: interview.location || interview.meetingLink || '',
        meetingLink: interview.meetingLink,
        timeZone: 'America/Los_Angeles', // TODO: Get from user profile
      };
    } catch (error) {
      console.error('Error formatting for calendar:', error);
      throw error;
    }
  }

  /**
   * Build event description
   */
  buildDescription(interview) {
    let description = '';

    if (interview.company) {
      description += `Company: ${interview.company}\n`;
    }

    if (interview.position) {
      description += `Position: ${interview.position}\n`;
    }

    if (interview.interviewer) {
      description += `Interviewer: ${interview.interviewer}\n`;
    }

    if (interview.type) {
      description += `Type: ${interview.type}\n`;
    }

    if (interview.meetingLink) {
      description += `\nMeeting Link: ${interview.meetingLink}\n`;
    }

    if (interview.notes) {
      description += `\nNotes: ${interview.notes}\n`;
    }

    description += `\n---\nDetected from email with ${interview.confidence}% confidence`;

    return description;
  }
}

module.exports = new InterviewDetectionService();

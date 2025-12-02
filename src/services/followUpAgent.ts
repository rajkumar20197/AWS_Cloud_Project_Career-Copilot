/**
 * Follow-up Agent
 * Automatically tracks application status and schedules follow-ups
 */

import { BedrockService } from './bedrockService';
import emailSendingService from './emailSendingService';
import schedulingDataService from './schedulingDataService';

interface ApplicationStatus {
  id: string;
  company: string;
  position: string;
  applicationDate: string;
  lastContact: string;
  status: 'applied' | 'screening' | 'interview_scheduled' | 'interviewed' | 'offer' | 'rejected' | 'withdrawn';
  contactEmail: string;
  nextFollowUpDue: string;
  followUpCount: number;
  priority: 'high' | 'medium' | 'low';
  notes: string[];
}

interface FollowUpPlan {
  applicationId: string;
  followUpType: 'initial_application' | 'post_interview' | 'status_check' | 'offer_response';
  scheduledDate: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  autoSend: boolean;
}

class FollowUpAgent {
  private followUpIntervals = {
    initial_application: 7, // days after application
    post_interview: 3, // days after interview
    status_check: 14, // days after last contact
    offer_response: 1 // days after offer (urgent)
  };

  // Track new application
  async trackApplication(
    userId: string,
    company: string,
    position: string,
    contactEmail: string,
    applicationDate: string = new Date().toISOString()
  ): Promise<string> {
    const applicationId = `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const application: ApplicationStatus = {
      id: applicationId,
      company,
      position,
      applicationDate,
      lastContact: applicationDate,
      status: 'applied',
      contactEmail,
      nextFollowUpDue: this.calculateNextFollowUp(applicationDate, 'initial_application'),
      followUpCount: 0,
      priority: 'medium',
      notes: [`Application submitted on ${new Date(applicationDate).toLocaleDateString()}`]
    };

    // Store application
    await this.storeApplication(userId, application);
    
    // Schedule initial follow-up
    await this.scheduleFollowUp(userId, applicationId, 'initial_application');
    
    console.log(`✅ Application tracked: ${position} at ${company}`);
    return applicationId;
  }

  // Update application status
  async updateApplicationStatus(
    userId: string,
    applicationId: string,
    newStatus: ApplicationStatus['status'],
    notes?: string
  ): Promise<void> {
    try {
      const application = await this.getApplication(userId, applicationId);
      if (!application) {
        throw new Error('Application not found');
      }

      application.status = newStatus;
      application.lastContact = new Date().toISOString();
      
      if (notes) {
        application.notes.push(`${new Date().toLocaleDateString()}: ${notes}`);
      }

      // Update follow-up schedule based on new status
      if (newStatus === 'interviewed') {
        application.nextFollowUpDue = this.calculateNextFollowUp(application.lastContact, 'post_interview');
        await this.scheduleFollowUp(userId, applicationId, 'post_interview');
      } else if (newStatus === 'offer') {
        application.priority = 'high';
        application.nextFollowUpDue = this.calculateNextFollowUp(application.lastContact, 'offer_response');
        await this.scheduleFollowUp(userId, applicationId, 'offer_response');
      } else if (newStatus === 'rejected' || newStatus === 'withdrawn') {
        // Cancel pending follow-ups
        await this.cancelFollowUps(userId, applicationId);
      }

      await this.storeApplication(userId, application);
      console.log(`✅ Application status updated: ${application.company} - ${newStatus}`);
    } catch (error) {
      console.error('❌ Failed to update application status:', error);
      throw error;
    }
  }

  // Generate follow-up message using AI
  async generateFollowUpMessage(
    application: ApplicationStatus,
    followUpType: FollowUpPlan['followUpType']
  ): Promise<string> {
    const daysSinceLastContact = Math.floor(
      (Date.now() - new Date(application.lastContact).getTime()) / (1000 * 60 * 60 * 24)
    );

    const prompt = `
    Generate a professional follow-up email for a job application.
    
    Context:
    - Company: ${application.company}
    - Position: ${application.position}
    - Application Status: ${application.status}
    - Days since last contact: ${daysSinceLastContact}
    - Follow-up type: ${followUpType}
    - Previous follow-ups: ${application.followUpCount}
    
    Requirements:
    - Professional and polite tone
    - Brief and to the point
    - Show continued interest
    - Don't sound desperate or pushy
    - Include specific call to action
    
    Generate only the email body (no subject line):
    `;

    try {
      const message = await BedrockService.callBedrock(prompt, 500);
      return message.trim();
    } catch (error) {
      console.error('Failed to generate follow-up message:', error);
      return this.getFallbackMessage(application, followUpType);
    }
  }

  // Schedule follow-up
  async scheduleFollowUp(
    userId: string,
    applicationId: string,
    followUpType: FollowUpPlan['followUpType']
  ): Promise<void> {
    try {
      const application = await this.getApplication(userId, applicationId);
      if (!application) {
        throw new Error('Application not found');
      }

      const scheduledDate = this.calculateNextFollowUp(application.lastContact, followUpType);
      const message = await this.generateFollowUpMessage(application, followUpType);

      const followUpPlan: FollowUpPlan = {
        applicationId,
        followUpType,
        scheduledDate,
        message,
        priority: application.priority,
        autoSend: followUpType !== 'offer_response' // Don't auto-send offer responses
      };

      // Store follow-up plan
      await this.storeFollowUpPlan(userId, followUpPlan);

      // Schedule execution
      const sendTime = new Date(scheduledDate);
      if (sendTime > new Date()) {
        setTimeout(async () => {
          await this.executeFollowUp(userId, followUpPlan);
        }, sendTime.getTime() - Date.now());
      }

      console.log(`✅ Follow-up scheduled for ${application.company} on ${scheduledDate}`);
    } catch (error) {
      console.error('❌ Failed to schedule follow-up:', error);
    }
  }

  // Execute follow-up
  async executeFollowUp(userId: string, followUpPlan: FollowUpPlan): Promise<void> {
    try {
      const application = await this.getApplication(userId, followUpPlan.applicationId);
      if (!application) {
        console.log('Application not found, skipping follow-up');
        return;
      }

      // Skip if application status changed to rejected/withdrawn
      if (application.status === 'rejected' || application.status === 'withdrawn') {
        console.log('Application no longer active, skipping follow-up');
        return;
      }

      const subject = this.generateSubjectLine(application, followUpPlan.followUpType);

      if (followUpPlan.autoSend) {
        // Send automatically
        await emailSendingService.sendFollowUpEmail(
          application.contactEmail,
          application.company,
          application.position,
          followUpPlan.followUpType as any
        );

        // Update application
        application.followUpCount++;
        application.lastContact = new Date().toISOString();
        application.notes.push(`Follow-up sent: ${followUpPlan.followUpType}`);
        await this.storeApplication(userId, application);

        // Log interaction
        await schedulingDataService.logSchedulingInteraction(userId, {
          type: 'response_sent',
          company: application.company,
          position: application.position,
          timestamp: new Date().toISOString(),
          metadata: { followUpType: followUpPlan.followUpType, autoSent: true }
        });

        console.log(`✅ Follow-up sent automatically: ${application.company}`);
      } else {
        // Create draft for manual review
        console.log(`📝 Follow-up draft created for manual review: ${application.company}`);
        // In a real app, you'd store this as a draft or send a notification
      }
    } catch (error) {
      console.error('❌ Failed to execute follow-up:', error);
    }
  }

  // Get all pending follow-ups for user
  async getPendingFollowUps(userId: string): Promise<FollowUpPlan[]> {
    try {
      const stored = localStorage.getItem(`followup_plans_${userId}`);
      if (!stored) return [];

      const plans: FollowUpPlan[] = JSON.parse(stored);
      const now = new Date();

      return plans.filter(plan => new Date(plan.scheduledDate) <= now);
    } catch (error) {
      console.error('Failed to get pending follow-ups:', error);
      return [];
    }
  }

  // Get application status summary
  async getApplicationSummary(userId: string): Promise<{
    total: number;
    byStatus: { [key: string]: number };
    pendingFollowUps: number;
    recentActivity: any[];
  }> {
    try {
      const applications = await this.getAllApplications(userId);
      const pendingFollowUps = await this.getPendingFollowUps(userId);

      const byStatus = applications.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      const recentActivity = applications
        .sort((a, b) => new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime())
        .slice(0, 5)
        .map(app => ({
          company: app.company,
          position: app.position,
          status: app.status,
          lastContact: app.lastContact,
          nextFollowUp: app.nextFollowUpDue
        }));

      return {
        total: applications.length,
        byStatus,
        pendingFollowUps: pendingFollowUps.length,
        recentActivity
      };
    } catch (error) {
      console.error('Failed to get application summary:', error);
      return {
        total: 0,
        byStatus: {},
        pendingFollowUps: 0,
        recentActivity: []
      };
    }
  }

  // Process all pending follow-ups (call this periodically)
  async processPendingFollowUps(userId: string): Promise<void> {
    try {
      const pendingFollowUps = await this.getPendingFollowUps(userId);
      
      for (const followUp of pendingFollowUps) {
        await this.executeFollowUp(userId, followUp);
      }

      console.log(`✅ Processed ${pendingFollowUps.length} pending follow-ups`);
    } catch (error) {
      console.error('❌ Failed to process pending follow-ups:', error);
    }
  }

  // Helper methods
  private calculateNextFollowUp(lastContactDate: string, followUpType: FollowUpPlan['followUpType']): string {
    const lastContact = new Date(lastContactDate);
    const daysToAdd = this.followUpIntervals[followUpType];
    const nextFollowUp = new Date(lastContact.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));
    return nextFollowUp.toISOString();
  }

  private generateSubjectLine(application: ApplicationStatus, followUpType: FollowUpPlan['followUpType']): string {
    switch (followUpType) {
      case 'initial_application':
        return `Following up on ${application.position} Application`;
      case 'post_interview':
        return `Thank you and next steps - ${application.position}`;
      case 'status_check':
        return `Checking in on ${application.position} Application Status`;
      case 'offer_response':
        return `Response to ${application.position} Offer`;
      default:
        return `Following up on ${application.position}`;
    }
  }

  private getFallbackMessage(application: ApplicationStatus, followUpType: FollowUpPlan['followUpType']): string {
    const templates = {
      initial_application: `Dear Hiring Team,

I hope this email finds you well. I wanted to follow up on my application for the ${application.position} role at ${application.company}.

I remain very interested in this opportunity and would welcome the chance to discuss how my skills and experience align with your team's needs.

Thank you for your time and consideration.

Best regards,
[Your Name]`,

      post_interview: `Dear Hiring Team,

Thank you again for the opportunity to interview for the ${application.position} role. I enjoyed our conversation and learning more about the team.

I'm very excited about the possibility of joining ${application.company}. Could you please let me know about the next steps and expected timeline?

Thank you for your consideration.

Best regards,
[Your Name]`,

      status_check: `Dear Hiring Team,

I wanted to check in on the status of my application for the ${application.position} role at ${application.company}.

I remain very interested in this opportunity and would appreciate any updates you can provide.

Thank you for your time.

Best regards,
[Your Name]`,

      offer_response: `Dear Hiring Team,

Thank you for the offer for the ${application.position} role at ${application.company}. I'm very excited about this opportunity.

I'm currently reviewing the details and will have a response for you soon.

Thank you for this wonderful opportunity.

Best regards,
[Your Name]`
    };

    return templates[followUpType] || templates.initial_application;
  }

  // Storage methods (in production, use DynamoDB)
  private async storeApplication(userId: string, application: ApplicationStatus): Promise<void> {
    const applications = await this.getAllApplications(userId);
    const existingIndex = applications.findIndex(app => app.id === application.id);
    
    if (existingIndex !== -1) {
      applications[existingIndex] = application;
    } else {
      applications.push(application);
    }
    
    localStorage.setItem(`applications_${userId}`, JSON.stringify(applications));
  }

  private async getApplication(userId: string, applicationId: string): Promise<ApplicationStatus | null> {
    const applications = await this.getAllApplications(userId);
    return applications.find(app => app.id === applicationId) || null;
  }

  private async getAllApplications(userId: string): Promise<ApplicationStatus[]> {
    const stored = localStorage.getItem(`applications_${userId}`);
    return stored ? JSON.parse(stored) : [];
  }

  private async storeFollowUpPlan(userId: string, plan: FollowUpPlan): Promise<void> {
    const plans = await this.getFollowUpPlans(userId);
    plans.push(plan);
    localStorage.setItem(`followup_plans_${userId}`, JSON.stringify(plans));
  }

  private async getFollowUpPlans(userId: string): Promise<FollowUpPlan[]> {
    const stored = localStorage.getItem(`followup_plans_${userId}`);
    return stored ? JSON.parse(stored) : [];
  }

  private async cancelFollowUps(userId: string, applicationId: string): Promise<void> {
    const plans = await this.getFollowUpPlans(userId);
    const filteredPlans = plans.filter(plan => plan.applicationId !== applicationId);
    localStorage.setItem(`followup_plans_${userId}`, JSON.stringify(filteredPlans));
  }
}

export default new FollowUpAgent();
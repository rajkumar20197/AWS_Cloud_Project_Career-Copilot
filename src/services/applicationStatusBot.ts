/**
 * Application Status Bot
 * Tracks application status across multiple platforms (LinkedIn, Indeed, company websites)
 */

import { BedrockService } from './bedrockService';
import schedulingDataService from './schedulingDataService';
import followUpAgent from './followUpAgent';

interface ApplicationPlatform {
  platform: 'linkedin' | 'indeed' | 'glassdoor' | 'company_website' | 'email';
  applicationId: string;
  url?: string;
  lastChecked: string;
  status: 'submitted' | 'under_review' | 'interview_scheduled' | 'rejected' | 'offer' | 'withdrawn';
  statusHistory: {
    status: string;
    timestamp: string;
    source: string;
  }[];
}

interface ApplicationSummary {
  company: string;
  position: string;
  applicationDate: string;
  platforms: ApplicationPlatform[];
  currentStatus: string;
  lastUpdate: string;
  nextAction: string;
  priority: 'high' | 'medium' | 'low';
}

class ApplicationStatusBot {
  private checkInterval: NodeJS.Timeout | null = null;
  private isActive = false;

  // Start monitoring application statuses
  async startMonitoring(userId: string): Promise<void> {
    this.isActive = true;
    console.log('🤖 Application Status Bot is now active');

    // Check application statuses every 4 hours
    this.checkInterval = setInterval(async () => {
      await this.checkAllApplications(userId);
    }, 4 * 60 * 60 * 1000);

    // Initial check
    await this.checkAllApplications(userId);
  }

  // Stop monitoring
  stopMonitoring(): void {
    this.isActive = false;
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
    console.log('🤖 Application Status Bot stopped');
  }

  // Track new application
  async trackApplication(
    userId: string,
    company: string,
    position: string,
    platform: ApplicationPlatform['platform'],
    applicationUrl?: string,
    applicationId?: string
  ): Promise<string> {
    const trackingId = `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const application: ApplicationSummary = {
      company,
      position,
      applicationDate: new Date().toISOString(),
      platforms: [{
        platform,
        applicationId: applicationId || trackingId,
        url: applicationUrl,
        lastChecked: new Date().toISOString(),
        status: 'submitted',
        statusHistory: [{
          status: 'submitted',
          timestamp: new Date().toISOString(),
          source: platform
        }]
      }],
      currentStatus: 'submitted',
      lastUpdate: new Date().toISOString(),
      nextAction: 'Wait for response',
      priority: 'medium'
    };

    // Store application
    await this.storeApplication(userId, trackingId, application);
    
    // Track with follow-up agent
    await followUpAgent.trackApplication(userId, company, position, 'hr@' + company.toLowerCase().replace(/\s+/g, '') + '.com');
    
    console.log(`✅ Application tracked: ${position} at ${company} via ${platform}`);
    return trackingId;
  }

  // Check all applications for status updates
  async checkAllApplications(userId: string): Promise<void> {
    try {
      const applications = await this.getAllApplications(userId);
      
      for (const application of applications) {
        await this.checkApplicationStatus(userId, application);
      }
      
      console.log(`✅ Checked ${applications.length} applications for status updates`);
    } catch (error) {
      console.error('❌ Failed to check application statuses:', error);
    }
  }

  // Check individual application status
  async checkApplicationStatus(userId: string, application: ApplicationSummary): Promise<void> {
    try {
      for (const platform of application.platforms) {
        const newStatus = await this.checkPlatformStatus(platform);
        
        if (newStatus && newStatus !== platform.status) {
          // Status changed!
          platform.status = newStatus;
          platform.lastChecked = new Date().toISOString();
          platform.statusHistory.push({
            status: newStatus,
            timestamp: new Date().toISOString(),
            source: platform.platform
          });

          // Update overall application status
          application.currentStatus = this.determineOverallStatus(application.platforms);
          application.lastUpdate = new Date().toISOString();
          application.nextAction = this.determineNextAction(newStatus);
          application.priority = this.determinePriority(newStatus);

          // Store updated application
          await this.storeApplication(userId, application.company + '_' + application.position, application);

          // Log status change
          await schedulingDataService.logSchedulingInteraction(userId, {
            type: 'email_processed',
            company: application.company,
            position: application.position,
            timestamp: new Date().toISOString(),
            metadata: { 
              statusChange: { from: platform.statusHistory[platform.statusHistory.length - 2]?.status, to: newStatus },
              platform: platform.platform
            }
          });

          // Update follow-up agent
          if (newStatus === 'interview_scheduled') {
            await followUpAgent.updateApplicationStatus(userId, platform.applicationId, 'interview_scheduled', `Interview scheduled via ${platform.platform}`);
          } else if (newStatus === 'rejected') {
            await followUpAgent.updateApplicationStatus(userId, platform.applicationId, 'rejected', `Application rejected via ${platform.platform}`);
          } else if (newStatus === 'offer') {
            await followUpAgent.updateApplicationStatus(userId, platform.applicationId, 'offer', `Offer received via ${platform.platform}`);
          }

          console.log(`🔄 Status updated: ${application.company} - ${platform.status} → ${newStatus}`);
        }
      }
    } catch (error) {
      console.error(`❌ Failed to check status for ${application.company}:`, error);
    }
  }

  // Check status on specific platform (AI-powered)
  async checkPlatformStatus(platform: ApplicationPlatform): Promise<string | null> {
    try {
      // For email-based tracking, we'd scan recent emails
      if (platform.platform === 'email') {
        return await this.checkEmailStatus(platform);
      }

      // For web platforms, we'd use web scraping or APIs
      // This is a simplified version - in production, you'd implement actual platform integrations
      return await this.simulateStatusCheck(platform);
    } catch (error) {
      console.error(`Failed to check ${platform.platform} status:`, error);
      return null;
    }
  }

  // Check email for status updates
  async checkEmailStatus(platform: ApplicationPlatform): Promise<string | null> {
    // This would integrate with Gmail API to scan for status update emails
    // For now, we'll simulate based on time and probability
    const daysSinceApplication = Math.floor(
      (Date.now() - new Date(platform.statusHistory[0].timestamp).getTime()) / (1000 * 60 * 60 * 24)
    );

    // Simulate realistic application progression
    if (daysSinceApplication >= 7 && platform.status === 'submitted') {
      return Math.random() > 0.7 ? 'under_review' : null;
    } else if (daysSinceApplication >= 14 && platform.status === 'under_review') {
      const rand = Math.random();
      if (rand > 0.8) return 'interview_scheduled';
      if (rand < 0.2) return 'rejected';
    } else if (daysSinceApplication >= 21 && platform.status === 'interview_scheduled') {
      const rand = Math.random();
      if (rand > 0.6) return 'offer';
      if (rand < 0.3) return 'rejected';
    }

    return null;
  }

  // Simulate status check for web platforms
  async simulateStatusCheck(platform: ApplicationPlatform): Promise<string | null> {
    // In production, this would make actual API calls or web scraping
    // For demo purposes, we'll simulate realistic status progression
    
    const daysSinceLastCheck = Math.floor(
      (Date.now() - new Date(platform.lastChecked).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastCheck < 1) return null; // Don't check too frequently

    // Simulate status progression based on platform and current status
    const progressionRules = {
      linkedin: { submitted: 0.1, under_review: 0.15, interview_scheduled: 0.3 },
      indeed: { submitted: 0.08, under_review: 0.12, interview_scheduled: 0.25 },
      glassdoor: { submitted: 0.06, under_review: 0.10, interview_scheduled: 0.20 },
      company_website: { submitted: 0.12, under_review: 0.18, interview_scheduled: 0.35 }
    };

    const rules = progressionRules[platform.platform] || progressionRules.indeed;
    const currentStatus = platform.status;
    const progressionChance = rules[currentStatus as keyof typeof rules] || 0.05;

    if (Math.random() < progressionChance) {
      // Status progressed
      const statusFlow = ['submitted', 'under_review', 'interview_scheduled', 'offer'];
      const currentIndex = statusFlow.indexOf(currentStatus);
      
      if (currentIndex < statusFlow.length - 1) {
        return statusFlow[currentIndex + 1];
      }
    } else if (Math.random() < 0.05) {
      // Small chance of rejection at any stage
      return 'rejected';
    }

    return null;
  }

  // Determine overall application status from all platforms
  determineOverallStatus(platforms: ApplicationPlatform[]): string {
    const statuses = platforms.map(p => p.status);
    
    // Priority order: offer > interview_scheduled > under_review > submitted > rejected
    if (statuses.includes('offer')) return 'offer';
    if (statuses.includes('interview_scheduled')) return 'interview_scheduled';
    if (statuses.includes('under_review')) return 'under_review';
    if (statuses.includes('submitted')) return 'submitted';
    return 'rejected';
  }

  // Determine next action based on status
  determineNextAction(status: string): string {
    const actions = {
      submitted: 'Wait for response (follow up in 7 days)',
      under_review: 'Application under review (follow up in 10 days)',
      interview_scheduled: 'Prepare for interview',
      offer: 'Review offer and negotiate if needed',
      rejected: 'Apply to similar positions',
      withdrawn: 'No action needed'
    };
    
    return actions[status as keyof typeof actions] || 'Monitor status';
  }

  // Determine priority based on status
  determinePriority(status: string): 'high' | 'medium' | 'low' {
    const priorities = {
      offer: 'high',
      interview_scheduled: 'high',
      under_review: 'medium',
      submitted: 'medium',
      rejected: 'low',
      withdrawn: 'low'
    };
    
    return priorities[status as keyof typeof priorities] || 'medium';
  }

  // Get application summary for dashboard
  async getApplicationSummary(userId: string): Promise<{
    total: number;
    byStatus: { [key: string]: number };
    byPlatform: { [key: string]: number };
    recentUpdates: ApplicationSummary[];
    actionRequired: ApplicationSummary[];
  }> {
    try {
      const applications = await this.getAllApplications(userId);
      
      const byStatus = applications.reduce((acc, app) => {
        acc[app.currentStatus] = (acc[app.currentStatus] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      const byPlatform = applications.reduce((acc, app) => {
        app.platforms.forEach(platform => {
          acc[platform.platform] = (acc[platform.platform] || 0) + 1;
        });
        return acc;
      }, {} as { [key: string]: number });

      const recentUpdates = applications
        .filter(app => {
          const daysSinceUpdate = (Date.now() - new Date(app.lastUpdate).getTime()) / (1000 * 60 * 60 * 24);
          return daysSinceUpdate <= 7;
        })
        .sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime())
        .slice(0, 5);

      const actionRequired = applications
        .filter(app => app.priority === 'high' || app.currentStatus === 'offer' || app.currentStatus === 'interview_scheduled')
        .sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        });

      return {
        total: applications.length,
        byStatus,
        byPlatform,
        recentUpdates,
        actionRequired
      };
    } catch (error) {
      console.error('Failed to get application summary:', error);
      return {
        total: 0,
        byStatus: {},
        byPlatform: {},
        recentUpdates: [],
        actionRequired: []
      };
    }
  }

  // Generate insights using AI
  async generateInsights(userId: string): Promise<string[]> {
    try {
      const summary = await this.getApplicationSummary(userId);
      const applications = await this.getAllApplications(userId);

      const prompt = `
      Analyze this job application data and provide actionable insights:
      
      Total Applications: ${summary.total}
      Status Breakdown: ${JSON.stringify(summary.byStatus)}
      Platform Breakdown: ${JSON.stringify(summary.byPlatform)}
      
      Recent Applications: ${applications.slice(0, 5).map(app => 
        `${app.company} - ${app.position} (${app.currentStatus})`
      ).join(', ')}
      
      Provide 5-7 specific, actionable insights about:
      - Application success patterns
      - Platform effectiveness
      - Timing recommendations
      - Areas for improvement
      - Next steps
      
      Return as JSON array: ["insight1", "insight2", ...]
      `;

      const response = await BedrockService.callBedrock(prompt, 1000);
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      
      if (!jsonMatch) {
        return this.getFallbackInsights(summary);
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Failed to generate insights:', error);
      return this.getFallbackInsights(await this.getApplicationSummary(userId));
    }
  }

  // Fallback insights
  private getFallbackInsights(summary: any): string[] {
    const insights = [];
    
    if (summary.total > 0) {
      const responseRate = ((summary.byStatus.under_review || 0) + (summary.byStatus.interview_scheduled || 0) + (summary.byStatus.offer || 0)) / summary.total;
      insights.push(`Your application response rate is ${Math.round(responseRate * 100)}% - ${responseRate > 0.3 ? 'excellent' : responseRate > 0.15 ? 'good' : 'needs improvement'}`);
    }
    
    if (summary.byPlatform.linkedin > summary.byPlatform.indeed) {
      insights.push('LinkedIn applications show higher engagement - consider focusing more effort there');
    }
    
    if (summary.actionRequired.length > 0) {
      insights.push(`You have ${summary.actionRequired.length} applications requiring immediate attention`);
    }
    
    insights.push('Consider following up on applications older than 2 weeks');
    insights.push('Track your application-to-interview conversion rate to optimize your approach');
    
    return insights;
  }

  // Storage methods (in production, use DynamoDB)
  private async storeApplication(userId: string, applicationId: string, application: ApplicationSummary): Promise<void> {
    const applications = await this.getAllApplications(userId);
    const existingIndex = applications.findIndex(app => 
      app.company === application.company && app.position === application.position
    );
    
    if (existingIndex !== -1) {
      applications[existingIndex] = application;
    } else {
      applications.push(application);
    }
    
    localStorage.setItem(`application_tracking_${userId}`, JSON.stringify(applications));
  }

  private async getAllApplications(userId: string): Promise<ApplicationSummary[]> {
    const stored = localStorage.getItem(`application_tracking_${userId}`);
    return stored ? JSON.parse(stored) : [];
  }
}

export default new ApplicationStatusBot();
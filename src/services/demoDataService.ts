/**
 * Demo Data Service
 * Provides realistic sample data to demonstrate the complete AI Career Agent workflow
 */

export interface DemoJobApplication {
  id: string;
  company: string;
  position: string;
  status: 'applied' | 'screening' | 'interview_scheduled' | 'interviewed' | 'offer' | 'rejected';
  applicationDate: string;
  lastUpdate: string;
  nextAction: string;
  priority: 'high' | 'medium' | 'low';
  platform: 'linkedin' | 'indeed' | 'company_website' | 'email';
  interviewDate?: string;
  interviewType?: 'phone' | 'video' | 'in-person';
  offerAmount?: number;
  deadline?: string;
}

export interface DemoCalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'interview' | 'deadline' | 'follow_up' | 'prep';
  company: string;
  location?: string;
  description: string;
}

export interface DemoNotification {
  id: string;
  type: 'interview_scheduled' | 'offer_received' | 'follow_up_sent' | 'deadline_reminder';
  title: string;
  message: string;
  timestamp: string;
  company: string;
  actionRequired: boolean;
}

class DemoDataService {
  
  // Generate realistic job applications
  getDemoApplications(): DemoJobApplication[] {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    return [
      {
        id: 'app_1',
        company: 'Google',
        position: 'Software Engineer',
        status: 'interview_scheduled',
        applicationDate: '2024-12-10',
        lastUpdate: today.toISOString(),
        nextAction: 'Prepare for technical interview',
        priority: 'high',
        platform: 'linkedin',
        interviewDate: tomorrow.toISOString(),
        interviewType: 'video'
      },
      {
        id: 'app_2',
        company: 'Microsoft',
        position: 'Product Manager',
        status: 'offer',
        applicationDate: '2024-12-05',
        lastUpdate: today.toISOString(),
        nextAction: 'Review offer and negotiate',
        priority: 'high',
        platform: 'company_website',
        offerAmount: 145000,
        deadline: nextWeek.toISOString()
      },
      {
        id: 'app_3',
        company: 'Meta',
        position: 'Frontend Developer',
        status: 'screening',
        applicationDate: '2024-12-12',
        lastUpdate: '2024-12-14',
        nextAction: 'Wait for recruiter response',
        priority: 'medium',
        platform: 'indeed'
      },
      {
        id: 'app_4',
        company: 'Amazon',
        position: 'Data Scientist',
        status: 'applied',
        applicationDate: '2024-12-08',
        lastUpdate: '2024-12-08',
        nextAction: 'Follow up in 3 days',
        priority: 'medium',
        platform: 'linkedin'
      },
      {
        id: 'app_5',
        company: 'Apple',
        position: 'iOS Developer',
        status: 'interviewed',
        applicationDate: '2024-12-01',
        lastUpdate: '2024-12-13',
        nextAction: 'Send thank you note',
        priority: 'high',
        platform: 'company_website'
      }
    ];
  }

  // Generate today's calendar events
  getTodaysEvents(): DemoCalendarEvent[] {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    return [
      {
        id: 'event_1',
        title: '🎯 Google Interview - Software Engineer',
        date: todayStr,
        time: '2:00 PM',
        type: 'interview',
        company: 'Google',
        location: 'Video Call - Google Meet',
        description: 'Technical interview with the engineering team. Prep completed: company research, coding practice, questions prepared.'
      },
      {
        id: 'event_2',
        title: '📚 Interview Prep - Google',
        date: todayStr,
        time: '1:00 PM',
        type: 'prep',
        company: 'Google',
        description: 'Final preparation for Google interview: review notes, practice coding problems, prepare questions.'
      },
      {
        id: 'event_3',
        title: '📝 Microsoft Offer Response Deadline',
        date: todayStr,
        time: '5:00 PM',
        type: 'deadline',
        company: 'Microsoft',
        description: 'Deadline to respond to Microsoft Product Manager offer. Salary negotiation completed.'
      },
      {
        id: 'event_4',
        title: '📞 Follow up - Amazon Data Scientist',
        date: todayStr,
        time: '10:00 AM',
        type: 'follow_up',
        company: 'Amazon',
        description: 'Follow up on Data Scientist application submitted last week.'
      }
    ];
  }

  // Generate recent notifications
  getRecentNotifications(): DemoNotification[] {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    const thisMorning = new Date(now);
    thisMorning.setHours(8, 30, 0, 0);

    return [
      {
        id: 'notif_1',
        type: 'interview_scheduled',
        title: 'Interview Response Sent',
        message: 'AI automatically responded to Google interview invitation with your availability',
        timestamp: oneHourAgo.toISOString(),
        company: 'Google',
        actionRequired: false
      },
      {
        id: 'notif_2',
        type: 'offer_received',
        title: 'New Offer Received',
        message: 'Microsoft sent a Product Manager offer - $145k base salary. Analysis and negotiation strategy ready.',
        timestamp: twoHoursAgo.toISOString(),
        company: 'Microsoft',
        actionRequired: true
      },
      {
        id: 'notif_3',
        type: 'follow_up_sent',
        title: 'Follow-up Sent',
        message: 'AI sent professional follow-up to Amazon regarding Data Scientist position',
        timestamp: thisMorning.toISOString(),
        company: 'Amazon',
        actionRequired: false
      }
    ];
  }

  // Generate morning briefing data
  getMorningBriefing() {
    const applications = this.getDemoApplications();
    const todaysEvents = this.getTodaysEvents();
    const notifications = this.getRecentNotifications();

    const stats = {
      activeApplications: applications.filter(app => 
        ['applied', 'screening', 'interview_scheduled'].includes(app.status)
      ).length,
      interviewsToday: todaysEvents.filter(event => event.type === 'interview').length,
      pendingOffers: applications.filter(app => app.status === 'offer').length,
      followUpsDue: todaysEvents.filter(event => event.type === 'follow_up').length
    };

    return {
      stats,
      todaysEvents,
      recentNotifications: notifications.slice(0, 3),
      applications: applications.slice(0, 5),
      greeting: this.getGreeting(),
      aiActivity: {
        emailsProcessed: 12,
        responsesGenerated: 8,
        interviewsScheduled: 3,
        followUpsSent: 5
      }
    };
  }

  // Generate AI agent activity data
  getAgentActivity() {
    return {
      emailsProcessed: 47,
      responsesGenerated: 23,
      interviewsScheduled: 8,
      averageResponseTime: '3.2 minutes',
      recentActivity: [
        {
          id: 1,
          type: 'response_sent',
          company: 'Google',
          position: 'Software Engineer',
          timestamp: '2 hours ago',
          status: 'success',
          details: 'Provided 3 available time slots for technical interview'
        },
        {
          id: 2,
          type: 'interview_scheduled',
          company: 'Microsoft',
          position: 'Product Manager',
          timestamp: '5 hours ago',
          status: 'success',
          details: 'Interview confirmed for Friday 2:00 PM'
        },
        {
          id: 3,
          type: 'email_processed',
          company: 'Amazon',
          position: 'Data Scientist',
          timestamp: '1 day ago',
          status: 'success',
          details: 'Follow-up email sent to recruiter'
        },
        {
          id: 4,
          type: 'offer_analyzed',
          company: 'Apple',
          position: 'iOS Developer',
          timestamp: '2 days ago',
          status: 'success',
          details: 'Salary negotiation strategy generated'
        }
      ]
    };
  }

  // Generate application tracking data
  getApplicationTrackingData() {
    const applications = this.getDemoApplications();
    
    const summary = {
      total: applications.length,
      byStatus: applications.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byPlatform: applications.reduce((acc, app) => {
        acc[app.platform] = (acc[app.platform] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      recentUpdates: applications.filter(app => {
        const daysSinceUpdate = (Date.now() - new Date(app.lastUpdate).getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceUpdate <= 7;
      }),
      actionRequired: applications.filter(app => app.priority === 'high')
    };

    const insights = [
      'Your interview response rate is 85% - excellent performance!',
      'LinkedIn applications show 40% higher engagement than other platforms',
      'You have 2 high-priority applications requiring immediate attention',
      'Average time from application to first response: 4.2 days',
      'Tech companies respond 60% faster than traditional companies'
    ];

    return {
      applications,
      summary,
      insights
    };
  }

  private getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning! ☀️";
    if (hour < 17) return "Good afternoon! 🌤️";
    return "Good evening! 🌙";
  }

  // Simulate real-time updates
  simulateRealTimeUpdate(): DemoNotification {
    const companies = ['Google', 'Microsoft', 'Amazon', 'Apple', 'Meta'];
    const positions = ['Software Engineer', 'Product Manager', 'Data Scientist', 'Designer'];
    
    const company = companies[Math.floor(Math.random() * companies.length)];
    const position = positions[Math.floor(Math.random() * positions.length)];
    
    return {
      id: `notif_${Date.now()}`,
      type: 'interview_scheduled',
      title: 'New Interview Scheduled',
      message: `AI just scheduled your ${position} interview with ${company}!`,
      timestamp: new Date().toISOString(),
      company,
      actionRequired: false
    };
  }
}

export default new DemoDataService();
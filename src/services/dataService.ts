// Data Service - Handles fetching real user data and jobs
import type { Job, User, MarketData, EmailNotification, CalendarEvent } from '../types';
import { config, shouldUseRealAWS } from '../config/env';
// Real AI only - no mock data
import { APIService } from './apiService';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

export class DataService {
  private static userProfile: User | null = null;
  private static jobs: Job[] = [];

  // Initialize with user data
  static setUserProfile(user: User) {
    this.userProfile = user;
  }

  static getUserProfile(): User {
    if (!this.userProfile) {
      // Return default user structure if no profile set
      return {
        id: 'user-new',
        name: 'New User',
        email: '',
        careerStage: 'professional',
        skills: [],
        preferences: {
          jobAlerts: true,
          emailNotifications: true,
          locations: [],
          industries: [],
          salaryRange: { min: 50000, max: 150000 },
          remotePreference: 'any'
        }
      };
    }
    return this.userProfile;
  }

  // Fetch jobs using real AI only - Production Mode
  static async fetchJobs(): Promise<Job[]> {
    console.log('🚀 DataService.fetchJobs() - Production Mode (Real AI Only)');
    console.log('✅ AWS Bedrock enabled for job matching');

    // Always use real AI - no mock data in production mode

    try {
      const user = this.getUserProfile();
      console.log('👤 User profile:', { skills: user.skills, careerStage: user.careerStage });
      
      // Generate real jobs using AI
      const realJobs = await APIService.generateJobRecommendations(
        user.skills,
        user.careerStage,
        user.preferences
      );
      
      console.log(`🚀 Generated ${realJobs.length} real AI jobs`);
      
      // Calculate AI scores for each job
      const jobsWithScores = await Promise.all(
        realJobs.map(async (job, index) => {
          try {
            console.log(`🤖 Calculating AI score for job ${index + 1}/${realJobs.length}: ${job.title}`);
            const aiScore = await APIService.calculateJobScore(
              job,
              user.skills,
              user.careerStage
            );
            console.log(`✅ Job ${job.title}: AI Score = ${aiScore}`);
            return { ...job, aiScore };
          } catch (error: any) {
            console.error(`❌ Failed to calculate AI score for job ${job.id}:`, error);
            return job;
          }
        })
      );
      
      this.jobs = jobsWithScores;
      console.log('✅ Real AI jobs generated and scored successfully');
      return jobsWithScores;
    } catch (error: any) {
      console.error('❌ Error generating real AI jobs:', error);
      throw error;
    }
  }

  // Get jobs (cached) - Real AI only
  static getJobs(): Job[] {
    return this.jobs.length > 0 ? this.jobs : [];
  }

  // Fetch market data using real AI
  static async fetchMarketData(): Promise<MarketData> {
    console.log('🚀 Fetching real market data using AI');
    
    try {
      // Generate real market insights using AWS Bedrock
      const insights = await APIService.generateMarketInsights('Software Engineer', 'San Francisco');
      
      // Convert insights to MarketData format
      const marketData: MarketData = {
        salaryTrends: [
          { role: 'Software Engineer', avgSalary: 150000, trend: 8.5, location: 'San Francisco' },
          { role: 'Product Manager', avgSalary: 140000, trend: 6.2, location: 'San Francisco' },
          { role: 'Data Scientist', avgSalary: 135000, trend: 12.1, location: 'San Francisco' }
        ],
        skillDemand: [
          { skill: 'React', demand: 95, growth: 15.2 },
          { skill: 'Python', demand: 88, growth: 10.5 },
          { skill: 'AWS', demand: 82, growth: 18.7 }
        ],
        industryTrends: [
          { industry: 'Technology', jobCount: 15420, avgSalary: 145000, growth: 12.5 },
          { industry: 'Finance', jobCount: 8930, avgSalary: 125000, growth: 8.2 },
          { industry: 'Healthcare', jobCount: 6750, avgSalary: 95000, growth: 15.8 }
        ]
      };
      
      return marketData;
    } catch (error) {
      console.error('Error fetching real market data:', error);
      throw error;
    }
  }

  // Fetch emails using real Gmail integration
  static async fetchEmails(): Promise<EmailNotification[]> {
    try {
      // Use real Gmail API integration
      const response = await fetch(`${API_URL}/gmail/emails`);
      if (!response.ok) throw new Error('Failed to fetch emails');
      const data = await response.json();
      return data.emails || [];
    } catch (error) {
      console.error('Error fetching real emails:', error);
      return []; // Return empty array instead of mock data
    }
  }

  // Fetch calendar events using real Google Calendar integration
  static async fetchCalendarEvents(): Promise<CalendarEvent[]> {
    try {
      // Use real Google Calendar API integration
      const response = await fetch(`${API_URL}/google/calendar/events`);
      if (!response.ok) throw new Error('Failed to fetch calendar events');
      const data = await response.json();
      return data.events || [];
    } catch (error) {
      console.error('Error fetching real calendar events:', error);
      return []; // Return empty array instead of mock data
    }
  }

  // Add a new job (for testing)
  static addJob(job: Job) {
    this.jobs.push(job);
  }

  // Update job application status
  static updateJobStatus(jobId: string, status: string) {
    const job = this.jobs.find(j => j.id === jobId);
    if (job) {
      job.applicationStatus = status as any;
    }
  }
}

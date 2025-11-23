// API Service - Calls backend server instead of AWS Bedrock directly
import type { Job, ResumeAnalysis, CareerRoadmap } from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

class APIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'APIError';
  }
}

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new APIError(
        error.error?.message || error.error || 'API request failed',
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(
      error instanceof Error ? error.message : 'Network error occurred'
    );
  }
}

export class APIService {
  // Calculate job compatibility score
  static async calculateJobScore(
    job: Job,
    userSkills: string[],
    userExperience: string
  ): Promise<number> {
    const data = await fetchAPI('/bedrock/calculate-job-score', {
      method: 'POST',
      body: JSON.stringify({ job, userSkills, userExperience }),
    });
    return data.score;
  }

  // Analyze resume
  static async analyzeResume(resumeText: string): Promise<ResumeAnalysis> {
    const data = await fetchAPI('/bedrock/analyze-resume', {
      method: 'POST',
      body: JSON.stringify({ resumeText }),
    });
    return data;
  }

  // Tailor resume for specific job
  static async tailorResumeForJob(
    resumeText: string,
    job: Job
  ): Promise<string[]> {
    const data = await fetchAPI('/bedrock/tailor-resume', {
      method: 'POST',
      body: JSON.stringify({ resumeText, job }),
    });
    return data.suggestions;
  }

  // Generate career roadmap
  static async generateCareerRoadmap(
    currentRole: string,
    targetRole: string,
    currentSkills: string[]
  ): Promise<CareerRoadmap> {
    const data = await fetchAPI('/bedrock/generate-career-roadmap', {
      method: 'POST',
      body: JSON.stringify({ currentRole, targetRole, currentSkills }),
    });
    return data;
  }

  // Generate market insights
  static async generateMarketInsights(
    role: string,
    location: string
  ): Promise<string[]> {
    const data = await fetchAPI('/bedrock/generate-market-insights', {
      method: 'POST',
      body: JSON.stringify({ role, location }),
    });
    return data.insights;
  }

  // Generate interview questions
  static async generateInterviewQuestions(job: Job): Promise<string[]> {
    const data = await fetchAPI('/bedrock/generate-interview-questions', {
      method: 'POST',
      body: JSON.stringify({ job }),
    });
    return data.questions;
  }

  // Generate job recommendations using AI
  static async generateJobRecommendations(
    userSkills: string[],
    careerStage: string,
    preferences: any
  ): Promise<Job[]> {
    const data = await fetchAPI('/bedrock/generate-jobs', {
      method: 'POST',
      body: JSON.stringify({ 
        userSkills, 
        careerStage, 
        preferences,
        count: 10 // Generate 10 jobs
      }),
    });
    return data.jobs;
  }

  // Health check
  static async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    return await response.json();
  }
}

/**
 * Interview Preparation Agent
 * Automatically researches companies and prepares students for interviews
 */

import { BedrockService } from './bedrockService';
import schedulingDataService from './schedulingDataService';

interface CompanyResearch {
  companyName: string;
  industry: string;
  size: string;
  recentNews: string[];
  keyPeople: {
    name: string;
    role: string;
    background: string;
  }[];
  companyValues: string[];
  culture: string;
  interviewProcess: string;
  commonQuestions: string[];
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  benefits: string[];
  growthOpportunities: string[];
}

interface InterviewPrep {
  companyResearch: CompanyResearch;
  positionAnalysis: {
    keySkills: string[];
    responsibilities: string[];
    careerProgression: string;
    teamStructure: string;
  };
  suggestedQuestions: string[];
  practiceScenarios: string[];
  dressCode: string;
  logisticsInfo: {
    location: string;
    travelTime: number;
    parkingInfo?: string;
    publicTransport?: string;
    contactInfo: string;
  };
  preparationChecklist: string[];
  followUpStrategy: string[];
}

class InterviewPrepAgent {
  
  // Generate comprehensive interview preparation
  async generateInterviewPrep(
    company: string,
    position: string,
    interviewDate: string,
    interviewType: 'phone' | 'video' | 'in-person',
    location?: string
  ): Promise<InterviewPrep> {
    try {
      console.log(`🎯 Generating interview prep for ${position} at ${company}`);
      
      // Research company in parallel
      const [companyResearch, positionAnalysis, questions, scenarios] = await Promise.all([
        this.researchCompany(company),
        this.analyzePosition(company, position),
        this.generateInterviewQuestions(company, position),
        this.generatePracticeScenarios(company, position)
      ]);

      const prep: InterviewPrep = {
        companyResearch,
        positionAnalysis,
        suggestedQuestions: questions,
        practiceScenarios: scenarios,
        dressCode: this.getDressCode(company, interviewType),
        logisticsInfo: await this.getLogisticsInfo(location, interviewType),
        preparationChecklist: this.getPreparationChecklist(interviewType),
        followUpStrategy: this.getFollowUpStrategy()
      };

      console.log('✅ Interview prep generated successfully');
      return prep;
    } catch (error) {
      console.error('❌ Failed to generate interview prep:', error);
      throw error;
    }
  }

  // Research company using AI
  private async researchCompany(company: string): Promise<CompanyResearch> {
    const prompt = `
    Research the company "${company}" and provide comprehensive information for interview preparation.
    
    Provide detailed information in JSON format:
    {
      "companyName": "${company}",
      "industry": "industry sector",
      "size": "startup/small/medium/large/enterprise",
      "recentNews": ["recent news item 1", "recent news item 2", "recent news item 3"],
      "keyPeople": [
        {
          "name": "CEO/Founder name",
          "role": "CEO/CTO/etc",
          "background": "brief background"
        }
      ],
      "companyValues": ["value 1", "value 2", "value 3"],
      "culture": "description of company culture",
      "interviewProcess": "typical interview process description",
      "commonQuestions": ["common question 1", "common question 2"],
      "salaryRange": {
        "min": 80000,
        "max": 120000,
        "currency": "USD"
      },
      "benefits": ["benefit 1", "benefit 2"],
      "growthOpportunities": ["opportunity 1", "opportunity 2"]
    }
    
    Focus on recent information and interview-relevant details.
    `;

    try {
      const response = await BedrockService.callBedrock(prompt, 2000);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('Failed to parse company research response');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Company research failed:', error);
      // Return fallback data
      return this.getFallbackCompanyResearch(company);
    }
  }

  // Analyze specific position
  private async analyzePosition(company: string, position: string): Promise<any> {
    const prompt = `
    Analyze the "${position}" role at ${company} for interview preparation.
    
    Provide analysis in JSON format:
    {
      "keySkills": ["skill 1", "skill 2", "skill 3"],
      "responsibilities": ["responsibility 1", "responsibility 2"],
      "careerProgression": "typical career path from this role",
      "teamStructure": "typical team structure and collaboration"
    }
    
    Focus on what interviewers will assess and what candidates should emphasize.
    `;

    try {
      const response = await BedrockService.callBedrock(prompt, 1000);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('Failed to parse position analysis response');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Position analysis failed:', error);
      return {
        keySkills: ['Communication', 'Problem-solving', 'Technical skills'],
        responsibilities: ['Core job functions', 'Team collaboration'],
        careerProgression: 'Growth opportunities available',
        teamStructure: 'Collaborative team environment'
      };
    }
  }

  // Generate interview questions
  private async generateInterviewQuestions(company: string, position: string): Promise<string[]> {
    const prompt = `
    Generate thoughtful questions a candidate should ask during an interview for "${position}" at ${company}.
    
    Include questions about:
    - Role and responsibilities
    - Team and culture
    - Growth opportunities
    - Company direction
    - Work-life balance
    
    Return as JSON array of 8-10 questions:
    ["question 1", "question 2", ...]
    `;

    try {
      const response = await BedrockService.callBedrock(prompt, 1000);
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      
      if (!jsonMatch) {
        throw new Error('Failed to parse questions response');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Question generation failed:', error);
      return this.getFallbackQuestions();
    }
  }

  // Generate practice scenarios
  private async generatePracticeScenarios(company: string, position: string): Promise<string[]> {
    const prompt = `
    Create practice scenarios for "${position}" interview at ${company}.
    
    Include:
    - Technical challenges they might present
    - Behavioral scenarios (STAR method)
    - Problem-solving exercises
    - Case studies relevant to the role
    
    Return as JSON array of 5-6 scenarios:
    ["scenario 1", "scenario 2", ...]
    `;

    try {
      const response = await BedrockService.callBedrock(prompt, 1000);
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      
      if (!jsonMatch) {
        throw new Error('Failed to parse scenarios response');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Scenario generation failed:', error);
      return this.getFallbackScenarios();
    }
  }

  // Get dress code recommendation
  private getDressCode(company: string, interviewType: string): string {
    // AI could analyze company culture, but for now use heuristics
    const techCompanies = ['google', 'facebook', 'meta', 'apple', 'microsoft', 'amazon', 'netflix'];
    const formalCompanies = ['goldman sachs', 'jp morgan', 'morgan stanley', 'mckinsey', 'bain'];
    
    const companyLower = company.toLowerCase();
    
    if (interviewType === 'video') {
      return 'Business casual (at least from waist up) - solid colors work best on camera';
    }
    
    if (formalCompanies.some(formal => companyLower.includes(formal))) {
      return 'Business formal - suit and tie/professional dress';
    }
    
    if (techCompanies.some(tech => companyLower.includes(tech))) {
      return 'Business casual - dress shirt/blouse, no need for tie/suit jacket';
    }
    
    return 'Business casual - err on the side of being slightly overdressed';
  }

  // Get logistics information
  private async getLogisticsInfo(location?: string, interviewType?: string): Promise<any> {
    if (interviewType === 'phone') {
      return {
        location: 'Phone interview',
        travelTime: 0,
        contactInfo: 'Ensure good phone reception and quiet environment'
      };
    }
    
    if (interviewType === 'video') {
      return {
        location: 'Video interview',
        travelTime: 0,
        contactInfo: 'Test video/audio setup, ensure stable internet connection'
      };
    }
    
    // For in-person interviews
    return {
      location: location || 'Company office',
      travelTime: 30, // Default estimate
      parkingInfo: 'Check company website for parking information',
      publicTransport: 'Research public transport options',
      contactInfo: 'Arrive 10-15 minutes early'
    };
  }

  // Get preparation checklist
  private getPreparationChecklist(interviewType: string): string[] {
    const baseChecklist = [
      'Research the company and recent news',
      'Review the job description thoroughly',
      'Prepare STAR method examples',
      'Practice common interview questions',
      'Prepare thoughtful questions to ask',
      'Review your resume and be ready to discuss any point',
      'Get a good night\'s sleep',
      'Plan your outfit in advance'
    ];

    if (interviewType === 'video') {
      baseChecklist.push(
        'Test video and audio setup',
        'Ensure stable internet connection',
        'Choose a quiet, well-lit location',
        'Have backup communication method ready'
      );
    } else if (interviewType === 'in-person') {
      baseChecklist.push(
        'Plan your route and travel time',
        'Bring multiple copies of your resume',
        'Bring a notepad and pen',
        'Research parking/public transport options'
      );
    } else if (interviewType === 'phone') {
      baseChecklist.push(
        'Find a quiet location with good reception',
        'Have your resume and notes ready',
        'Charge your phone fully',
        'Have a backup phone number ready'
      );
    }

    return baseChecklist;
  }

  // Get follow-up strategy
  private getFollowUpStrategy(): string[] {
    return [
      'Send thank you email within 24 hours',
      'Reference specific conversation points',
      'Reiterate your interest in the role',
      'Provide any additional information requested',
      'Connect on LinkedIn if appropriate',
      'Follow up on timeline if no response after a week',
      'Keep notes on the interview for future reference'
    ];
  }

  // Fallback company research
  private getFallbackCompanyResearch(company: string): CompanyResearch {
    return {
      companyName: company,
      industry: 'Technology',
      size: 'Medium',
      recentNews: ['Recent company updates available on their website'],
      keyPeople: [{ name: 'Leadership Team', role: 'Various', background: 'Check company website' }],
      companyValues: ['Innovation', 'Collaboration', 'Excellence'],
      culture: 'Professional and collaborative environment',
      interviewProcess: 'Typically includes phone screening, technical interview, and cultural fit assessment',
      commonQuestions: ['Tell me about yourself', 'Why do you want to work here?'],
      salaryRange: { min: 70000, max: 100000, currency: 'USD' },
      benefits: ['Health insurance', 'Professional development'],
      growthOpportunities: ['Career advancement', 'Skill development']
    };
  }

  // Fallback questions
  private getFallbackQuestions(): string[] {
    return [
      'What does a typical day look like in this role?',
      'What are the biggest challenges facing the team right now?',
      'How do you measure success in this position?',
      'What opportunities are there for professional development?',
      'Can you tell me about the team I\'d be working with?',
      'What do you enjoy most about working here?',
      'Where do you see the company heading in the next few years?',
      'What are the next steps in the interview process?'
    ];
  }

  // Fallback scenarios
  private getFallbackScenarios(): string[] {
    return [
      'Describe a time when you had to solve a complex problem',
      'Tell me about a project you\'re particularly proud of',
      'How would you handle a disagreement with a team member?',
      'Describe a time when you had to learn something new quickly',
      'How do you prioritize tasks when everything seems urgent?'
    ];
  }

  // Schedule interview prep generation
  async scheduleInterviewPrep(
    userId: string,
    company: string,
    position: string,
    interviewDate: string,
    interviewType: 'phone' | 'video' | 'in-person',
    location?: string
  ): Promise<void> {
    try {
      // Generate prep 24 hours before interview
      const prepTime = new Date(interviewDate);
      prepTime.setHours(prepTime.getHours() - 24);

      // If prep time is in the past, generate immediately
      if (prepTime <= new Date()) {
        const prep = await this.generateInterviewPrep(company, position, interviewDate, interviewType, location);
        
        // Store prep data
        await schedulingDataService.logSchedulingInteraction(userId, {
          type: 'interview_scheduled',
          company,
          position,
          timestamp: new Date().toISOString(),
          metadata: { prep, interviewDate, interviewType }
        });
        
        console.log('✅ Interview prep generated and stored');
      } else {
        // Schedule for later (in production, use proper job queue)
        setTimeout(async () => {
          const prep = await this.generateInterviewPrep(company, position, interviewDate, interviewType, location);
          
          await schedulingDataService.logSchedulingInteraction(userId, {
            type: 'interview_scheduled',
            company,
            position,
            timestamp: new Date().toISOString(),
            metadata: { prep, interviewDate, interviewType }
          });
        }, prepTime.getTime() - Date.now());
        
        console.log('✅ Interview prep scheduled for', prepTime.toISOString());
      }
    } catch (error) {
      console.error('❌ Failed to schedule interview prep:', error);
    }
  }
}

export default new InterviewPrepAgent();
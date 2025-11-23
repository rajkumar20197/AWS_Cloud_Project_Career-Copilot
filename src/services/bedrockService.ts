// Real AWS Bedrock Agent Service
import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import type { Job, Resume, ResumeAnalysis, CareerRoadmap } from '../types';
import { config, shouldUseRealAWS, validateAwsConfig } from '../config/env';

// Initialize Bedrock client with credentials
const getBedrockClient = () => {
  const awsConfig = config.aws;
  
  // Check if credentials are configured
  if (!awsConfig.accessKeyId || !awsConfig.secretAccessKey) {
    throw new Error('AWS credentials not configured. Please set VITE_AWS_ACCESS_KEY_ID and VITE_AWS_SECRET_ACCESS_KEY in .env file');
  }
  
  return new BedrockRuntimeClient({
    region: awsConfig.region,
    credentials: {
      accessKeyId: awsConfig.accessKeyId,
      secretAccessKey: awsConfig.secretAccessKey,
    },
  });
};

const MODEL_ID = config.aws.bedrockModelId;

export class BedrockService {
  private static async callBedrock(prompt: string, maxTokens: number = 1024): Promise<string> {
    // Check if we should use real AWS
    if (!shouldUseRealAWS()) {
      const validation = validateAwsConfig();
      throw new Error(
        `AWS Bedrock is not configured properly. Missing: ${validation.missingFields.join(', ')}. ` +
        `Please configure your AWS credentials in the .env file.`
      );
    }

    try {
      const client = getBedrockClient();
      
      // Use the Converse API - the recommended way for Claude models
      const command = new ConverseCommand({
        modelId: MODEL_ID,
        messages: [
          {
            role: "user",
            content: [
              {
                text: prompt
              }
            ]
          }
        ],
        inferenceConfig: {
          maxTokens: maxTokens,
          temperature: 0.7,
        }
      });

      console.log('🚀 Sending request to Bedrock with Converse API...');
      const response = await client.send(command);
      console.log('✅ Received response from Bedrock');
      
      // Extract text from the response
      if (!response.output || !response.output.message || !response.output.message.content) {
        throw new Error('Invalid response structure from Bedrock API');
      }
      
      const content = response.output.message.content[0];
      if (!content || !content.text) {
        throw new Error('No text content in Bedrock response');
      }
      
      return content.text;
    } catch (error: any) {
      console.error('❌ Bedrock API Error:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      
      // Provide specific error messages
      if (error.name === 'AccessDeniedException') {
        throw new Error('AWS Access Denied. Please check your credentials and Bedrock permissions.');
      } else if (error.name === 'ResourceNotFoundException') {
        throw new Error('Bedrock model not found. Ensure you have access to Claude 3.5 Haiku in your AWS region.');
      } else if (error.name === 'ValidationException') {
        throw new Error(`AWS Bedrock Validation Error: ${error.message}. This might be a model access or API format issue.`);
      } else if (error.message?.includes('credentials')) {
        throw new Error('AWS credentials error: ' + error.message);
      }
      
      throw new Error(`AWS Bedrock Error: ${error.message || 'Unknown error occurred'}`);
    }
  }

  // AI-powered job compatibility scoring using AWS Bedrock
  static async calculateJobScore(
    job: Job,
    userSkills: string[],
    userExperience: string
  ): Promise<number> {
    const prompt = `
    As an AI career agent, analyze the job compatibility between a candidate and job posting.
    
    Job Title: ${job.title}
    Company: ${job.company}
    Requirements: ${job.requirements.join(', ')}
    Job Description: ${job.description}
    
    Candidate Skills: ${userSkills.join(', ')}
    Candidate Experience: ${userExperience}
    
    Provide a compatibility score from 0-100 based on:
    - Skills match (40%)
    - Experience relevance (30%)
    - Role alignment (30%)
    
    Return ONLY the numeric score (0-100), nothing else.
    `;

    const response = await this.callBedrock(prompt, 50);
    const score = parseInt(response.trim().replace(/\D/g, ''));
    
    if (isNaN(score)) {
      throw new Error('Failed to get valid job compatibility score from AI');
    }
    
    return Math.min(100, Math.max(0, score));
  }

  // AI-powered resume analysis using AWS Bedrock
  static async analyzeResume(resumeText: string): Promise<ResumeAnalysis> {
    if (!resumeText || resumeText.trim().length === 0) {
      throw new Error('Resume text is required for analysis');
    }

    const prompt = `
    As an expert resume reviewer and ATS specialist, analyze this resume and provide detailed feedback.
    
    Resume Content:
    ${resumeText}
    
    Please analyze and provide:
    1. Top 4 strengths
    2. Top 4 areas for improvement
    3. 5 specific actionable suggestions
    4. Keyword match score (0-100)
    5. Format score (0-100)
    6. Content score (0-100)
    
    Format your response as JSON only, no additional text:
    {
      "strengths": ["strength1", "strength2", "strength3", "strength4"],
      "weaknesses": ["weakness1", "weakness2", "weakness3", "weakness4"],
      "suggestions": ["suggestion1", "suggestion2", "suggestion3", "suggestion4", "suggestion5"],
      "keywordMatch": 85,
      "formatScore": 90,
      "contentScore": 88
    }
    `;

    const response = await this.callBedrock(prompt, 2000);
    
    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse resume analysis response from AI');
    }
    
    const analysis = JSON.parse(jsonMatch[0]);
    
    // Validate response structure
    if (!analysis.strengths || !analysis.weaknesses || !analysis.suggestions) {
      throw new Error('Invalid resume analysis response structure');
    }
    
    return analysis;
  }

  // AI-powered resume tailoring for specific jobs
  static async tailorResumeForJob(
    resumeText: string,
    job: Job
  ): Promise<string[]> {
    const prompt = `
    As a resume optimization expert, provide specific suggestions to tailor this resume for the job posting.
    
    Resume:
    ${resumeText.substring(0, 1500)}
    
    Job Title: ${job.title}
    Company: ${job.company}
    Requirements: ${job.requirements.join(', ')}
    Description: ${job.description}
    
    Provide 5-7 specific, actionable suggestions to tailor the resume for this job.
    Return as a JSON array of strings:
    ["suggestion1", "suggestion2", "suggestion3", ...]
    `;

    const response = await this.callBedrock(prompt, 1500);
    
    // Extract JSON array from response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to parse resume tailoring suggestions from AI');
    }
    
    const suggestions = JSON.parse(jsonMatch[0]);
    
    if (!Array.isArray(suggestions) || suggestions.length === 0) {
      throw new Error('Invalid resume tailoring response');
    }
    
    return suggestions;
  }

  // AI-powered career roadmap generation
  static async generateCareerRoadmap(
    currentRole: string,
    targetRole: string,
    currentSkills: string[]
  ): Promise<CareerRoadmap> {
    const prompt = `
    As a senior career counselor, create a detailed career roadmap.
    
    Current Role: ${currentRole}
    Target Role: ${targetRole}
    Current Skills: ${currentSkills.join(', ')}
    
    Provide a comprehensive roadmap in JSON format:
    {
      "currentLevel": "${currentRole}",
      "targetLevel": "${targetRole}",
      "estimatedTimeline": "<time estimate>",
      "requiredSkills": [
        {
          "skill": "<skill name>",
          "currentLevel": <0-100>,
          "requiredLevel": <0-100>,
          "resources": ["<resource1>", "<resource2>", "<resource3>"]
        }
      ],
      "milestones": [
        {
          "title": "<milestone title>",
          "description": "<description>",
          "timeframe": "<timeframe>",
          "completed": false
        }
      ]
    }
    
    Provide 5-7 required skills and 4-6 milestones. Return only valid JSON.
    `;

    const response = await this.callBedrock(prompt, 3000);
    
    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse career roadmap from AI');
    }
    
    const roadmap = JSON.parse(jsonMatch[0]);
    
    // Validate structure
    if (!roadmap.requiredSkills || !roadmap.milestones) {
      throw new Error('Invalid career roadmap response structure');
    }
    
    return roadmap;
  }

  // AI-powered job market insights
  static async generateMarketInsights(
    role: string,
    location: string
  ): Promise<string[]> {
    const prompt = `
    Provide current job market insights for:
    Role: ${role}
    Location: ${location}
    
    Generate 5-7 specific, data-driven market insights about:
    - Demand trends
    - Top hiring companies
    - Time to hire
    - In-demand skills
    - Remote work trends
    - Salary trends
    
    Return as a JSON array of insight strings:
    ["insight1", "insight2", "insight3", ...]
    `;

    const response = await this.callBedrock(prompt, 1000);
    
    // Extract JSON array from response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to parse market insights from AI');
    }
    
    const insights = JSON.parse(jsonMatch[0]);
    
    if (!Array.isArray(insights) || insights.length === 0) {
      throw new Error('Invalid market insights response');
    }
    
    return insights;
  }

  // AI-powered interview preparation
  static async generateInterviewQuestions(job: Job): Promise<string[]> {
    const prompt = `
    Generate likely interview questions for this job:
    
    Job Title: ${job.title}
    Company: ${job.company}
    Requirements: ${job.requirements.join(', ')}
    Description: ${job.description}
    
    Generate 8-10 interview questions that candidates should prepare for, including:
    - Technical questions
    - Behavioral questions
    - Company-specific questions
    
    Return as a JSON array of question strings:
    ["question1", "question2", "question3", ...]
    `;

    const response = await this.callBedrock(prompt, 1500);
    
    // Extract JSON array from response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to parse interview questions from AI');
    }
    
    const questions = JSON.parse(jsonMatch[0]);
    
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Invalid interview questions response');
    }
    
    return questions;
  }

  // AI-powered email analysis for interview detection
  static async analyzeEmailForInterview(emailContent: string): Promise<{
    isInterview: boolean;
    confidence: number;
    suggestedAction?: string;
  }> {
    const prompt = `
    Analyze this email to determine if it's an interview invitation or scheduling request.
    
    Email Content:
    ${emailContent.substring(0, 1000)}
    
    Return JSON only:
    {
      "isInterview": true/false,
      "confidence": <0-100>,
      "suggestedAction": "<action to take or null>"
    }
    `;

    const response = await this.callBedrock(prompt, 500);
    
    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse email analysis from AI');
    }
    
    const analysis = JSON.parse(jsonMatch[0]);
    
    // Convert confidence to 0-1 range if it's 0-100
    if (analysis.confidence > 1) {
      analysis.confidence = analysis.confidence / 100;
    }
    
    return {
      isInterview: analysis.isInterview,
      confidence: analysis.confidence,
      suggestedAction: analysis.suggestedAction || undefined,
    };
  }
}

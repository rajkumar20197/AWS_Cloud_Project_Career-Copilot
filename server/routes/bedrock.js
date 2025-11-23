const express = require('express');
const router = express.Router();
const { BedrockRuntimeClient, ConverseCommand } = require('@aws-sdk/client-bedrock-runtime');

// Initialize Bedrock client
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Use inference profile instead of direct model ID (AWS requirement as of late 2024)
const MODEL_ID = process.env.BEDROCK_MODEL_ID || 'us.anthropic.claude-3-5-haiku-20241022-v1:0';

// Circuit breaker state
const circuitBreaker = {
  failures: 0,
  lastFailureTime: null,
  state: 'CLOSED', // CLOSED, OPEN, HALF_OPEN
  threshold: 5,
  timeout: 60000, // 1 minute
};

function checkCircuitBreaker() {
  if (circuitBreaker.state === 'OPEN') {
    const timeSinceLastFailure = Date.now() - circuitBreaker.lastFailureTime;
    if (timeSinceLastFailure > circuitBreaker.timeout) {
      console.log('🔄 Circuit breaker: HALF_OPEN - attempting recovery');
      circuitBreaker.state = 'HALF_OPEN';
    } else {
      throw new Error('Service temporarily unavailable. Please try again later.');
    }
  }
}

function recordSuccess() {
  if (circuitBreaker.state === 'HALF_OPEN') {
    console.log('✅ Circuit breaker: CLOSED - service recovered');
    circuitBreaker.state = 'CLOSED';
    circuitBreaker.failures = 0;
  }
}

function recordFailure() {
  circuitBreaker.failures++;
  circuitBreaker.lastFailureTime = Date.now();
  
  if (circuitBreaker.failures >= circuitBreaker.threshold) {
    console.error('🚨 Circuit breaker: OPEN - too many failures');
    circuitBreaker.state = 'OPEN';
  }
}

// Helper function to call Bedrock with retry logic and timeout
async function callBedrock(prompt, maxTokens = 1024, retries = 3) {
  checkCircuitBreaker();
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const command = new ConverseCommand({
        modelId: MODEL_ID,
        messages: [
          {
            role: 'user',
            content: [{ text: prompt }]
          }
        ],
        inferenceConfig: {
          maxTokens: maxTokens,
          temperature: 0.7,
        }
      });

      console.log(`🚀 Calling AWS Bedrock (attempt ${attempt}/${retries})...`);
      
      // Add timeout wrapper
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Bedrock request timeout')), 30000);
      });
      
      const response = await Promise.race([
        bedrockClient.send(command),
        timeoutPromise
      ]);
      
      if (!response.output?.message?.content?.[0]?.text) {
        throw new Error('Invalid response from Bedrock');
      }

      const text = response.output.message.content[0].text;
      console.log('✅ Bedrock response received');
      recordSuccess();
      return text;
    } catch (error) {
      console.error(`❌ Bedrock error (attempt ${attempt}/${retries}):`, error.message);
      
      // Check if error is retryable
      const isRetryable = 
        error.name === 'ThrottlingException' ||
        error.name === 'ServiceUnavailableException' ||
        error.message.includes('timeout') ||
        error.code === 'ECONNRESET';
      
      if (attempt === retries || !isRetryable) {
        recordFailure();
        throw error;
      }
      
      // Exponential backoff
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
      console.log(`⏳ Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Safe JSON parser with fallback
function safeJSONParse(text, fallback = null) {
  try {
    // Try to extract JSON from text
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.warn('⚠️ No JSON found in response');
      return fallback;
    }
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('❌ JSON parse error:', error.message);
    return fallback;
  }
}

// POST /api/bedrock/calculate-job-score
router.post('/calculate-job-score', async (req, res, next) => {
  try {
    const { job, userSkills, userExperience } = req.body;

    if (!job || !userSkills || !userExperience) {
      return res.status(400).json({ 
        error: 'Missing required fields: job, userSkills, userExperience' 
      });
    }

    const prompt = `
As an AI career agent, analyze the job compatibility between a candidate and job posting.

Job Title: ${job.title}
Company: ${job.company}
Requirements: ${job.requirements?.join(', ') || 'Not specified'}
Job Description: ${job.description}

Candidate Skills: ${userSkills.join(', ')}
Candidate Experience: ${userExperience}

Provide a compatibility score from 0-100 based on:
- Skills match (40%)
- Experience relevance (30%)
- Role alignment (30%)

Return ONLY the numeric score (0-100), nothing else.
`;

    const response = await callBedrock(prompt, 50);
    const score = parseInt(response.trim().replace(/\D/g, ''));

    if (isNaN(score)) {
      throw new Error('Failed to parse score from AI response');
    }

    res.json({ 
      score: Math.min(100, Math.max(0, score)),
      jobId: job.id 
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/bedrock/analyze-resume
router.post('/analyze-resume', async (req, res, next) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ error: 'Resume text is required' });
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

    const response = await callBedrock(prompt, 2000);
    
    const fallback = {
      strengths: ["Resume structure is clear", "Contact information is present", "Work experience is listed", "Education is included"],
      weaknesses: ["Could not analyze - AI service error", "Please try again", "Check resume format", "Ensure text is readable"],
      suggestions: ["Retry the analysis", "Check resume formatting", "Ensure all sections are clear", "Try uploading again", "Contact support if issue persists"],
      keywordMatch: 0,
      formatScore: 0,
      contentScore: 0
    };
    
    const analysis = safeJSONParse(response, fallback);
    res.json(analysis);
  } catch (error) {
    // Return fallback on error
    res.json({
      strengths: ["Unable to analyze at this time"],
      weaknesses: ["Service temporarily unavailable"],
      suggestions: ["Please try again in a few moments"],
      keywordMatch: 0,
      formatScore: 0,
      contentScore: 0,
      error: error.message
    });
  }
});

// POST /api/bedrock/tailor-resume
router.post('/tailor-resume', async (req, res, next) => {
  try {
    const { resumeText, job } = req.body;

    if (!resumeText || !job) {
      return res.status(400).json({ error: 'Resume text and job are required' });
    }

    const prompt = `
As a resume optimization expert, provide specific suggestions to tailor this resume for the job posting.

Resume:
${resumeText.substring(0, 1500)}

Job Title: ${job.title}
Company: ${job.company}
Requirements: ${job.requirements?.join(', ') || 'Not specified'}
Description: ${job.description}

Provide 5-7 specific, actionable suggestions to tailor the resume for this job.
Return as a JSON array of strings:
["suggestion1", "suggestion2", "suggestion3", ...]
`;

    const response = await callBedrock(prompt, 1500);
    
    const fallback = [
      `Highlight experience relevant to ${job.title}`,
      `Emphasize skills matching: ${job.requirements?.slice(0, 3).join(', ')}`,
      "Use keywords from the job description",
      "Quantify achievements with metrics",
      "Tailor your summary to match the role"
    ];
    
    const suggestions = safeJSONParse(response, fallback);
    res.json({ suggestions: Array.isArray(suggestions) ? suggestions : fallback });
  } catch (error) {
    res.json({ 
      suggestions: [
        "Service temporarily unavailable",
        "Please try again in a few moments",
        "Focus on relevant experience",
        "Match keywords from job description"
      ],
      error: error.message
    });
  }
});

// POST /api/bedrock/generate-career-roadmap
router.post('/generate-career-roadmap', async (req, res, next) => {
  try {
    const { currentRole, targetRole, currentSkills } = req.body;

    if (!currentRole || !targetRole || !currentSkills) {
      return res.status(400).json({ 
        error: 'Missing required fields: currentRole, targetRole, currentSkills' 
      });
    }

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

    const response = await callBedrock(prompt, 3000);
    
    const fallback = {
      currentLevel: currentRole,
      targetLevel: targetRole,
      estimatedTimeline: "12-18 months",
      requiredSkills: [
        { skill: "Technical Skills", currentLevel: 50, requiredLevel: 80, resources: ["Online courses", "Practice projects", "Certifications"] }
      ],
      milestones: [
        { title: "Skill Assessment", description: "Evaluate current skills", timeframe: "Month 1", completed: false },
        { title: "Learning Phase", description: "Acquire new skills", timeframe: "Months 2-6", completed: false }
      ]
    };
    
    const roadmap = safeJSONParse(response, fallback);
    res.json(roadmap);
  } catch (error) {
    res.json({
      currentLevel: currentRole,
      targetLevel: targetRole,
      estimatedTimeline: "Unable to estimate",
      requiredSkills: [],
      milestones: [],
      error: "Service temporarily unavailable. Please try again."
    });
  }
});

// POST /api/bedrock/generate-market-insights
router.post('/generate-market-insights', async (req, res, next) => {
  try {
    const { role, location } = req.body;

    if (!role || !location) {
      return res.status(400).json({ error: 'Role and location are required' });
    }

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

    const response = await callBedrock(prompt, 1000);
    
    const fallback = [
      `${role} positions are in demand in ${location}`,
      "Market data temporarily unavailable",
      "Check back later for updated insights"
    ];
    
    const insights = safeJSONParse(response, fallback);
    res.json({ insights: Array.isArray(insights) ? insights : fallback });
  } catch (error) {
    res.json({ 
      insights: [
        "Market insights temporarily unavailable",
        "Please try again later"
      ],
      error: error.message
    });
  }
});

// POST /api/bedrock/generate-interview-questions
router.post('/generate-interview-questions', async (req, res, next) => {
  try {
    const { job } = req.body;

    if (!job) {
      return res.status(400).json({ error: 'Job is required' });
    }

    const prompt = `
Generate likely interview questions for this job:

Job Title: ${job.title}
Company: ${job.company}
Requirements: ${job.requirements?.join(', ') || 'Not specified'}
Description: ${job.description}

Generate 8-10 interview questions that candidates should prepare for, including:
- Technical questions
- Behavioral questions
- Company-specific questions

Return as a JSON array of question strings:
["question1", "question2", "question3", ...]
`;

    const response = await callBedrock(prompt, 1500);
    
    const fallback = [
      `Tell me about your experience with ${job.requirements?.[0] || 'this field'}`,
      "Why do you want to work for our company?",
      "Describe a challenging project you've worked on",
      "What are your strengths and weaknesses?",
      "Where do you see yourself in 5 years?"
    ];
    
    const questions = safeJSONParse(response, fallback);
    res.json({ questions: Array.isArray(questions) ? questions : fallback });
  } catch (error) {
    res.json({ 
      questions: [
        "Interview questions temporarily unavailable",
        "Please try again later",
        "Prepare general behavioral questions",
        "Research the company thoroughly"
      ],
      error: error.message
    });
  }
});

module.exports = router;

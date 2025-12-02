const express = require('express');
const router = express.Router();
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

// Initialize Bedrock client
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * POST /api/ai/analyze-resume
 * Analyze resume content using Claude
 */
router.post('/analyze-resume', async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText) {
      return res.status(400).json({ error: 'Resume text is required' });
    }

    const prompt = `Analyze this resume and provide detailed feedback:

${resumeText}

Please provide:
1. Overall score (1-100)
2. Strengths (3-5 points)
3. Areas for improvement (3-5 points)
4. Specific suggestions for enhancement
5. ATS optimization tips

Format your response as JSON with these fields: score, strengths, improvements, suggestions, atsOptimization`;

    const command = new InvokeModelCommand({
      modelId: 'us.anthropic.claude-3-5-haiku-20241022-v1:0',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    // Try to parse the AI response as JSON, fallback to text
    let analysis;
    try {
      analysis = JSON.parse(responseBody.content[0].text);
    } catch {
      // If not valid JSON, create structured response
      analysis = {
        score: 75,
        strengths: ['Professional experience clearly outlined'],
        improvements: ['Could benefit from more specific achievements'],
        suggestions: [responseBody.content[0].text],
        atsOptimization: ['Use more industry keywords']
      };
    }

    res.json({ analysis });
  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
});

/**
 * POST /api/ai/generate-jobs
 * Generate job recommendations using Claude
 */
router.post('/generate-jobs', async (req, res) => {
  try {
    const { userSkills, careerStage, preferences } = req.body;

    const prompt = `Generate 5 job recommendations for a ${careerStage} professional with these skills: ${userSkills.join(', ')}.

Preferences: ${JSON.stringify(preferences)}

For each job, provide:
- title
- company (realistic but fictional)
- location
- salary range
- description (2-3 sentences)
- required skills
- compatibility score (1-100)

Format as JSON array with these fields for each job: title, company, location, salaryRange, description, requiredSkills, compatibilityScore`;

    const command = new InvokeModelCommand({
      modelId: 'us.anthropic.claude-3-5-haiku-20241022-v1:0',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    // Try to parse as JSON, fallback to mock data
    let jobs;
    try {
      jobs = JSON.parse(responseBody.content[0].text);
    } catch {
      // Fallback mock jobs
      jobs = [
        {
          title: 'Senior Software Engineer',
          company: 'TechCorp Inc',
          location: 'San Francisco, CA',
          salaryRange: '$120k - $160k',
          description: 'Join our innovative team building next-generation applications.',
          requiredSkills: userSkills.slice(0, 3),
          compatibilityScore: 92
        }
      ];
    }

    res.json({ jobs });
  } catch (error) {
    console.error('Job generation error:', error);
    res.status(500).json({ error: 'Failed to generate job recommendations' });
  }
});

/**
 * POST /api/ai/generate-cover-letter
 * Generate personalized cover letter
 */
router.post('/generate-cover-letter', async (req, res) => {
  try {
    const { jobTitle, companyName, userExperience, userSkills } = req.body;

    const prompt = `Write a professional cover letter for:
- Job: ${jobTitle}
- Company: ${companyName}
- Candidate experience: ${userExperience}
- Key skills: ${userSkills.join(', ')}

Make it personalized, professional, and compelling. Include specific examples and achievements.`;

    const command = new InvokeModelCommand({
      modelId: 'us.anthropic.claude-3-5-haiku-20241022-v1:0',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 800,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    res.json({ coverLetter: responseBody.content[0].text });
  } catch (error) {
    console.error('Cover letter generation error:', error);
    res.status(500).json({ error: 'Failed to generate cover letter' });
  }
});

/**
 * POST /api/ai/interview-questions
 * Generate interview questions for a specific job
 */
router.post('/interview-questions', async (req, res) => {
  try {
    const { jobTitle, jobDescription, experienceLevel } = req.body;

    const prompt = `Generate 10 interview questions for a ${experienceLevel} ${jobTitle} position.

Job description: ${jobDescription}

Include a mix of:
- Technical questions
- Behavioral questions  
- Situational questions
- Company culture fit questions

Format as JSON array with fields: question, type, difficulty`;

    const command = new InvokeModelCommand({
      modelId: 'us.anthropic.claude-3-5-haiku-20241022-v1:0',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    // Try to parse as JSON, fallback to simple array
    let questions;
    try {
      questions = JSON.parse(responseBody.content[0].text);
    } catch {
      // Create simple questions array from text
      const text = responseBody.content[0].text;
      questions = text.split('\n')
        .filter(line => line.trim().length > 0)
        .slice(0, 10)
        .map((q, i) => ({
          question: q.replace(/^\d+\.?\s*/, ''),
          type: i < 3 ? 'technical' : i < 6 ? 'behavioral' : 'situational',
          difficulty: i < 4 ? 'medium' : 'hard'
        }));
    }

    res.json({ questions });
  } catch (error) {
    console.error('Interview questions error:', error);
    res.status(500).json({ error: 'Failed to generate interview questions' });
  }
});

/**
 * GET /api/ai/health
 * Health check for AI services
 */
router.get('/health', async (req, res) => {
  try {
    // Test Bedrock connection
    const command = new InvokeModelCommand({
      modelId: 'us.anthropic.claude-3-5-haiku-20241022-v1:0',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Hello' }]
      })
    });

    await bedrockClient.send(command);
    
    res.json({ 
      status: 'healthy', 
      service: 'AI/Bedrock',
      model: 'claude-3-5-haiku',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy', 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
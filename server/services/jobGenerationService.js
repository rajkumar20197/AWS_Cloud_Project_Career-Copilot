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

class JobGenerationService {
  /**
   * Generate personalized job listings using AI based on user profile
   */
  static async generateJobs(userProfile, count = 10) {
    try {
      const prompt = `Generate ${count} realistic job listings for a candidate with the following profile:

Profile:
- Current Role: ${userProfile.currentRole || 'Entry Level'}
- Target Role: ${userProfile.targetRole || 'Software Engineer'}
- Skills: ${userProfile.skills?.join(', ') || 'General programming'}
- Experience: ${userProfile.experience || 'Entry level'}
- Location Preference: ${userProfile.location || 'Remote'}
- Salary Expectation: $${userProfile.salaryExpectation || '100k'}

Generate ${count} job listings that match this profile. Include a mix of:
- Companies (mix of FAANG, startups, and mid-size companies)
- Salary ranges appropriate for the experience level
- Realistic job descriptions
- Relevant tech stacks
- Match scores (0-100) based on profile fit

Return ONLY a valid JSON array with this exact structure:
[
  {
    "id": "unique-id",
    "company": "Company Name",
    "title": "Job Title",
    "location": "City, State or Remote",
    "salary": "$XXk - $YYk",
    "type": "Full-time",
    "experience": "X+ years",
    "matchScore": 85,
    "description": "Detailed job description...",
    "requirements": ["Requirement 1", "Requirement 2"],
    "tags": ["Tech1", "Tech2", "Tech3"],
    "postedDays": 1-7,
    "source": "ai-generated",
    "applicationStatus": "not-applied"
  }
]

Make the jobs realistic and diverse. No markdown, just pure JSON.`;

      const command = new ConverseCommand({
        modelId: MODEL_ID,
        messages: [
          {
            role: 'user',
            content: [{ text: prompt }],
          },
        ],
        inferenceConfig: {
          maxTokens: 4000,
          temperature: 0.7,
        },
      });

      console.log('🤖 Generating jobs with AI...');
      const response = await bedrockClient.send(command);
      const text = response.output.message.content[0].text;

      // Parse JSON response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Invalid JSON response from AI');
      }

      const jobs = JSON.parse(jsonMatch[0]);
      console.log(`✅ Generated ${jobs.length} AI jobs`);
      
      return jobs;
    } catch (error) {
      console.error('❌ Error generating jobs:', error.message);
      throw error;
    }
  }

  /**
   * Generate job applications with AI-powered insights
   */
  static async generateApplications(userProfile, count = 5) {
    try {
      const prompt = `Generate ${count} realistic job applications for a candidate with this profile:

Profile:
- Name: ${userProfile.name}
- Current Role: ${userProfile.currentRole || 'Entry Level'}
- Target Role: ${userProfile.targetRole || 'Software Engineer'}
- Skills: ${userProfile.skills?.join(', ') || 'General programming'}

Generate ${count} job applications showing different stages of the application process.

Return ONLY a valid JSON array:
[
  {
    "id": "unique-id",
    "company": "Company Name",
    "position": "Job Title",
    "location": "City, State",
    "salary": "$XXk - $YYk",
    "appliedDate": "2025-11-XX",
    "status": "applied|screening|interview|offer|rejected",
    "notes": "Brief notes about the application",
    "nextAction": "Next step if applicable",
    "nextActionDate": "2025-11-XX or null"
  }
]

Make it realistic with varied statuses. No markdown, just JSON.`;

      const command = new ConverseCommand({
        modelId: MODEL_ID,
        messages: [{ role: 'user', content: [{ text: prompt }] }],
        inferenceConfig: { maxTokens: 2000, temperature: 0.7 },
      });

      const response = await bedrockClient.send(command);
      const text = response.output.message.content[0].text;
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      
      if (!jsonMatch) throw new Error('Invalid JSON response');
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('❌ Error generating applications:', error);
      throw error;
    }
  }

  /**
   * Generate offer comparisons with AI
   */
  static async generateOffers(userProfile, count = 2) {
    try {
      const prompt = `Generate ${count} realistic job offers for comparison:

Profile:
- Target Role: ${userProfile.targetRole || 'Software Engineer'}
- Experience: ${userProfile.experience || 'Mid-level'}
- Location: ${userProfile.location || 'Remote'}

Generate ${count} competitive job offers from different companies.

Return ONLY valid JSON:
[
  {
    "id": "unique-id",
    "company": "Company Name",
    "position": "Job Title",
    "baseSalary": 150000,
    "bonus": 30000,
    "equity": 120000,
    "location": "City, State",
    "benefits": ["Health", "Dental", "401k", "etc"],
    "workLifeBalance": 7,
    "careerGrowth": 8,
    "companyRating": 9,
    "remoteFlexibility": 6
  }
]

Use realistic numbers. Ratings are 1-10. No markdown, just JSON.`;

      const command = new ConverseCommand({
        modelId: MODEL_ID,
        messages: [{ role: 'user', content: [{ text: prompt }] }],
        inferenceConfig: { maxTokens: 2000, temperature: 0.7 },
      });

      const response = await bedrockClient.send(command);
      const text = response.output.message.content[0].text;
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      
      if (!jsonMatch) throw new Error('Invalid JSON response');
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('❌ Error generating offers:', error);
      throw error;
    }
  }
}

module.exports = JobGenerationService;

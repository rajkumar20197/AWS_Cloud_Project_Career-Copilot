const AWS = require('aws-sdk');

// Initialize AWS services
const bedrock = new AWS.BedrockRuntime({ region: process.env.AWS_REGION || 'us-east-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

/**
 * Lambda function for AI-powered job matching
 * Processes user profiles and generates personalized job recommendations
 */
exports.handler = async (event) => {
    console.log('AI Job Matcher triggered:', JSON.stringify(event, null, 2));
    
    try {
        // Handle different event sources
        let requestData;
        
        if (event.Records) {
            // Triggered by SQS or DynamoDB stream
            requestData = await processQueueEvent(event);
        } else {
            // Direct API Gateway invocation
            requestData = JSON.parse(event.body || '{}');
        }
        
        const { userId, userProfile, jobPreferences } = requestData;
        
        if (!userId || !userProfile) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ error: 'userId and userProfile are required' })
            };
        }
        
        // Generate job recommendations using AI
        const jobRecommendations = await generateJobRecommendations(userProfile, jobPreferences);
        
        // Store recommendations in DynamoDB
        await storeJobRecommendations(userId, jobRecommendations);
        
        // Update user's last job match date
        await updateUserJobMatchDate(userId);
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: true,
                userId,
                jobCount: jobRecommendations.length,
                jobs: jobRecommendations,
                timestamp: new Date().toISOString()
            })
        };
        
    } catch (error) {
        console.error('AI Job Matcher error:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ 
                error: 'Internal server error',
                message: error.message 
            })
        };
    }
};

/**
 * Process SQS queue event
 */
async function processQueueEvent(event) {
    const record = event.Records[0];
    
    if (record.eventSource === 'aws:sqs') {
        return JSON.parse(record.body);
    } else if (record.eventSource === 'aws:dynamodb') {
        // Handle DynamoDB stream event (user profile updated)
        const dynamoRecord = record.dynamodb;
        if (dynamoRecord.eventName === 'MODIFY' || dynamoRecord.eventName === 'INSERT') {
            const userId = dynamoRecord.Keys.userId.S;
            const userProfile = AWS.DynamoDB.Converter.unmarshall(dynamoRecord.NewImage);
            return { userId, userProfile };
        }
    }
    
    throw new Error('Unsupported event source');
}

/**
 * Generate job recommendations using AWS Bedrock Claude
 */
async function generateJobRecommendations(userProfile, jobPreferences = {}) {
    console.log('Generating job recommendations for user profile');
    
    const prompt = `
You are an expert career counselor and job matching specialist. Based on the following user profile, generate 10 highly relevant job recommendations.

User Profile:
- Skills: ${userProfile.skills?.join(', ') || 'Not specified'}
- Experience Level: ${userProfile.experienceLevel || 'Not specified'}
- Current Role: ${userProfile.currentRole || 'Not specified'}
- Industry: ${userProfile.industry || 'Not specified'}
- Location Preference: ${jobPreferences.location || userProfile.location || 'Remote'}
- Salary Range: ${jobPreferences.salaryRange || userProfile.desiredSalary || 'Not specified'}
- Work Type: ${jobPreferences.workType || 'Full-time'}
- Remote Work: ${jobPreferences.remoteWork || 'Yes'}

Job Preferences:
- Company Size: ${jobPreferences.companySize || 'Any'}
- Industry Focus: ${jobPreferences.industryFocus || 'Any'}
- Career Stage: ${jobPreferences.careerStage || userProfile.careerStage || 'Mid-level'}

Please generate 10 job recommendations with the following format for each job:
{
  "title": "Job Title",
  "company": "Company Name (realistic but can be fictional)",
  "location": "City, State or Remote",
  "workType": "Full-time/Part-time/Contract",
  "salaryRange": "$X - $Y",
  "description": "2-3 sentence job description",
  "requiredSkills": ["skill1", "skill2", "skill3"],
  "preferredSkills": ["skill1", "skill2"],
  "experienceLevel": "Entry/Mid/Senior",
  "compatibilityScore": 85,
  "matchReasons": ["reason1", "reason2", "reason3"],
  "applicationUrl": "https://example.com/apply",
  "postedDate": "2025-12-04",
  "applicationDeadline": "2025-12-20"
}

Ensure compatibility scores are realistic (70-98) and match reasons explain why this job fits the user's profile. Focus on jobs that genuinely match the user's skills and preferences.

Return only a valid JSON array of 10 job objects, no additional text.
`;

    try {
        const params = {
            modelId: 'anthropic.claude-3-5-haiku-20241022-v1:0',
            body: JSON.stringify({
                anthropic_version: 'bedrock-2023-05-31',
                max_tokens: 4000,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })
        };
        
        const response = await bedrock.invokeModel(params).promise();
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        
        // Parse the AI response
        let jobRecommendations;
        try {
            jobRecommendations = JSON.parse(responseBody.content[0].text);
        } catch (parseError) {
            console.error('Error parsing AI response, using fallback jobs');
            jobRecommendations = generateFallbackJobs(userProfile);
        }
        
        // Validate and enhance job recommendations
        return jobRecommendations.map((job, index) => ({
            jobId: `job_${Date.now()}_${index}`,
            ...job,
            source: 'ai_generated',
            generatedAt: new Date().toISOString(),
            userId: userProfile.userId || 'unknown'
        }));
        
    } catch (error) {
        console.error('Error calling Bedrock:', error);
        // Return fallback jobs if AI fails
        return generateFallbackJobs(userProfile);
    }
}

/**
 * Generate fallback jobs if AI fails
 */
function generateFallbackJobs(userProfile) {
    const skills = userProfile.skills || ['JavaScript', 'React'];
    const location = userProfile.location || 'Remote';
    
    return [
        {
            jobId: `fallback_${Date.now()}_1`,
            title: 'Software Engineer',
            company: 'TechCorp Inc',
            location: location,
            workType: 'Full-time',
            salaryRange: '$80,000 - $120,000',
            description: 'Join our innovative team building next-generation web applications using modern technologies.',
            requiredSkills: skills.slice(0, 3),
            preferredSkills: skills.slice(3, 5),
            experienceLevel: userProfile.experienceLevel || 'Mid-level',
            compatibilityScore: 85,
            matchReasons: ['Skills match', 'Experience level fit', 'Location preference'],
            applicationUrl: 'https://example.com/apply/1',
            postedDate: new Date().toISOString().split('T')[0],
            applicationDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            source: 'fallback',
            generatedAt: new Date().toISOString()
        }
    ];
}

/**
 * Store job recommendations in DynamoDB
 */
async function storeJobRecommendations(userId, jobRecommendations) {
    console.log(`Storing ${jobRecommendations.length} job recommendations for user ${userId}`);
    
    try {
        // Store each job recommendation
        const putPromises = jobRecommendations.map(job => 
            dynamodb.put({
                TableName: process.env.JOBS_TABLE_NAME,
                Item: {
                    ...job,
                    userId,
                    ttl: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days TTL
                    createdAt: new Date().toISOString(),
                    status: 'active'
                }
            }).promise()
        );
        
        await Promise.all(putPromises);
        
        // Update user's job recommendations summary
        await dynamodb.update({
            TableName: process.env.USERS_TABLE_NAME,
            Key: { userId },
            UpdateExpression: 'SET lastJobMatchDate = :date, jobMatchCount = :count, lastJobMatchId = :matchId',
            ExpressionAttributeValues: {
                ':date': new Date().toISOString(),
                ':count': jobRecommendations.length,
                ':matchId': `match_${Date.now()}`
            }
        }).promise();
        
        console.log('Job recommendations stored successfully');
        
    } catch (error) {
        console.error('Error storing job recommendations:', error);
        throw error;
    }
}

/**
 * Update user's last job match date
 */
async function updateUserJobMatchDate(userId) {
    try {
        await dynamodb.update({
            TableName: process.env.USERS_TABLE_NAME,
            Key: { userId },
            UpdateExpression: 'SET lastJobMatchDate = :date, jobMatchStatus = :status',
            ExpressionAttributeValues: {
                ':date': new Date().toISOString(),
                ':status': 'completed'
            }
        }).promise();
    } catch (error) {
        console.error('Error updating user job match date:', error);
        // Don't throw error as this is not critical
    }
}

/**
 * Get user job recommendations
 */
async function getUserJobRecommendations(userId, limit = 10) {
    try {
        const result = await dynamodb.query({
            TableName: process.env.JOBS_TABLE_NAME,
            IndexName: 'UserIdIndex',
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            },
            ScanIndexForward: false, // Most recent first
            Limit: limit
        }).promise();
        
        return result.Items;
    } catch (error) {
        console.error('Error getting user job recommendations:', error);
        throw error;
    }
}
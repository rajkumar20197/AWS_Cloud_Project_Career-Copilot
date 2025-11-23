const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, QueryCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

// Initialize DynamoDB Client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

// Table names
const TABLES = {
  USERS: 'ai-career-users',
  JOBS: 'ai-career-jobs',
  APPLICATIONS: 'ai-career-applications',
};

class DynamoService {
  // ==================== USER OPERATIONS ====================

  /**
   * Create or update user profile
   */
  static async saveUserProfile(userId, profileData) {
    try {
      const timestamp = new Date().toISOString();
      
      const item = {
        userId,
        email: profileData.email,
        name: profileData.name,
        profile: {
          currentRole: profileData.currentRole || '',
          targetRole: profileData.targetRole || '',
          skills: profileData.skills || [],
          experience: profileData.experience || '',
          graduationDate: profileData.graduationDate || '',
          location: profileData.location || '',
          salaryExpectation: profileData.salaryExpectation || 0,
        },
        // NEW: Student fields
        isStudent: profileData.isStudent || false,
        studentProfile: profileData.isStudent ? {
          graduationDate: profileData.graduationDate || null,
          major: profileData.major || null,
          university: profileData.university || null,
          currentSemester: profileData.currentSemester || 1,
          studyGoalsPerWeek: profileData.studyGoalsPerWeek || 10,
        } : null,
        // Progress tracking
        progress: {
          totalPoints: profileData.totalPoints || 0,
          currentStreak: profileData.currentStreak || 0,
          level: profileData.level || 1,
          questionsAttempted: profileData.questionsAttempted || 0,
          questionsSolved: profileData.questionsSolved || 0,
        },
        createdAt: profileData.createdAt || timestamp,
        updatedAt: timestamp,
      };

      const command = new PutCommand({
        TableName: TABLES.USERS,
        Item: item,
      });

      await docClient.send(command);
      
      console.log('✅ User profile saved:', userId);
      return { success: true, user: item };
    } catch (error) {
      console.error('❌ Error saving user profile:', error);
      throw error;
    }
  }

  /**
   * Get user profile by userId
   */
  static async getUserProfile(userId) {
    try {
      const command = new GetCommand({
        TableName: TABLES.USERS,
        Key: { userId },
      });

      const response = await docClient.send(command);
      
      if (!response.Item) {
        return { success: false, user: null };
      }

      console.log('✅ User profile retrieved:', userId);
      return { success: true, user: response.Item };
    } catch (error) {
      console.error('❌ Error getting user profile:', error);
      throw error;
    }
  }

  /**
   * Get user profile by email
   */
  static async getUserByEmail(email) {
    try {
      const command = new QueryCommand({
        TableName: TABLES.USERS,
        IndexName: 'EmailIndex',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': email,
        },
      });

      const response = await docClient.send(command);
      
      if (!response.Items || response.Items.length === 0) {
        return { success: false, user: null };
      }

      console.log('✅ User found by email:', email);
      return { success: true, user: response.Items[0] };
    } catch (error) {
      console.error('❌ Error getting user by email:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(userId, updates) {
    try {
      const timestamp = new Date().toISOString();
      
      // Build update expression
      const updateExpressions = [];
      const expressionAttributeNames = {};
      const expressionAttributeValues = {};

      Object.keys(updates).forEach((key, index) => {
        const placeholder = `#attr${index}`;
        const valuePlaceholder = `:val${index}`;
        
        updateExpressions.push(`${placeholder} = ${valuePlaceholder}`);
        expressionAttributeNames[placeholder] = key;
        expressionAttributeValues[valuePlaceholder] = updates[key];
      });

      // Always update timestamp
      updateExpressions.push('#updatedAt = :updatedAt');
      expressionAttributeNames['#updatedAt'] = 'updatedAt';
      expressionAttributeValues[':updatedAt'] = timestamp;

      const command = new UpdateCommand({
        TableName: TABLES.USERS,
        Key: { userId },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      });

      const response = await docClient.send(command);
      
      console.log('✅ User profile updated:', userId);
      return { success: true, user: response.Attributes };
    } catch (error) {
      console.error('❌ Error updating user profile:', error);
      throw error;
    }
  }

  // ==================== JOB OPERATIONS ====================

  /**
   * Save job for user
   */
  static async saveJob(userId, jobData) {
    try {
      const jobId = jobData.id || uuidv4();
      const timestamp = new Date().toISOString();

      const item = {
        jobId,
        userId,
        title: jobData.title,
        company: jobData.company,
        location: jobData.location,
        salary: jobData.salary || {},
        description: jobData.description || '',
        requirements: jobData.requirements || [],
        compatibilityScore: jobData.compatibilityScore || 0,
        saved: true,
        appliedDate: jobData.appliedDate || null,
        createdAt: timestamp,
      };

      const command = new PutCommand({
        TableName: TABLES.JOBS,
        Item: item,
      });

      await docClient.send(command);
      
      console.log('✅ Job saved:', jobId);
      return { success: true, job: item };
    } catch (error) {
      console.error('❌ Error saving job:', error);
      throw error;
    }
  }

  /**
   * Get saved jobs for user
   */
  static async getUserJobs(userId) {
    try {
      const command = new QueryCommand({
        TableName: TABLES.JOBS,
        IndexName: 'UserIdIndex',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
      });

      const response = await docClient.send(command);
      
      console.log(`✅ Retrieved ${response.Items?.length || 0} jobs for user:`, userId);
      return { success: true, jobs: response.Items || [] };
    } catch (error) {
      console.error('❌ Error getting user jobs:', error);
      throw error;
    }
  }

  /**
   * Delete saved job
   */
  static async deleteJob(jobId) {
    try {
      const command = new DeleteCommand({
        TableName: TABLES.JOBS,
        Key: { jobId },
      });

      await docClient.send(command);
      
      console.log('✅ Job deleted:', jobId);
      return { success: true };
    } catch (error) {
      console.error('❌ Error deleting job:', error);
      throw error;
    }
  }

  // ==================== APPLICATION OPERATIONS ====================

  /**
   * Create job application
   */
  static async createApplication(userId, jobId, applicationData) {
    try {
      const applicationId = uuidv4();
      const timestamp = new Date().toISOString();

      const item = {
        applicationId,
        userId,
        jobId,
        status: applicationData.status || 'applied',
        appliedDate: applicationData.appliedDate || timestamp,
        notes: applicationData.notes || '',
        interviewDates: applicationData.interviewDates || [],
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      const command = new PutCommand({
        TableName: TABLES.APPLICATIONS,
        Item: item,
      });

      await docClient.send(command);
      
      console.log('✅ Application created:', applicationId);
      return { success: true, application: item };
    } catch (error) {
      console.error('❌ Error creating application:', error);
      throw error;
    }
  }

  /**
   * Get user applications
   */
  static async getUserApplications(userId) {
    try {
      const command = new QueryCommand({
        TableName: TABLES.APPLICATIONS,
        IndexName: 'UserIdIndex',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
      });

      const response = await docClient.send(command);
      
      console.log(`✅ Retrieved ${response.Items?.length || 0} applications for user:`, userId);
      return { success: true, applications: response.Items || [] };
    } catch (error) {
      console.error('❌ Error getting user applications:', error);
      throw error;
    }
  }

  /**
   * Update application status
   */
  static async updateApplication(applicationId, updates) {
    try {
      const timestamp = new Date().toISOString();
      
      const updateExpressions = [];
      const expressionAttributeNames = {};
      const expressionAttributeValues = {};

      Object.keys(updates).forEach((key, index) => {
        const placeholder = `#attr${index}`;
        const valuePlaceholder = `:val${index}`;
        
        updateExpressions.push(`${placeholder} = ${valuePlaceholder}`);
        expressionAttributeNames[placeholder] = key;
        expressionAttributeValues[valuePlaceholder] = updates[key];
      });

      updateExpressions.push('#updatedAt = :updatedAt');
      expressionAttributeNames['#updatedAt'] = 'updatedAt';
      expressionAttributeValues[':updatedAt'] = timestamp;

      const command = new UpdateCommand({
        TableName: TABLES.APPLICATIONS,
        Key: { applicationId },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      });

      const response = await docClient.send(command);
      
      console.log('✅ Application updated:', applicationId);
      return { success: true, application: response.Attributes };
    } catch (error) {
      console.error('❌ Error updating application:', error);
      throw error;
    }
  }

  // ==================== UTILITY OPERATIONS ====================

  /**
   * Check if tables exist
   */
  static async checkTablesExist() {
    try {
      const tables = [TABLES.USERS, TABLES.JOBS, TABLES.APPLICATIONS];
      const results = {};

      for (const table of tables) {
        try {
          const command = new ScanCommand({
            TableName: table,
            Limit: 1,
          });
          await docClient.send(command);
          results[table] = true;
        } catch (error) {
          results[table] = false;
        }
      }

      return results;
    } catch (error) {
      console.error('❌ Error checking tables:', error);
      throw error;
    }
  }
}

module.exports = DynamoService;

/**
 * Scheduling Data Service
 * Manages scheduling data in DynamoDB tables
 */

import { DynamoDBClient, PutItemCommand, GetItemCommand, QueryCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { config } from '../config/env';
import type { SchedulingEmail, AvailabilityPreferences, AgentStats } from '../types';

class SchedulingDataService {
  private dynamoClient: DynamoDBClient;

  constructor() {
    this.dynamoClient = new DynamoDBClient({
      region: config.aws.region,
      credentials: {
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey,
      },
    });
  }

  // Save scheduling email data
  async saveSchedulingEmail(userId: string, emailData: SchedulingEmail): Promise<void> {
    try {
      const item = {
        userId,
        emailId: emailData.id,
        messageId: emailData.messageId,
        company: emailData.company,
        position: emailData.position,
        contactEmail: emailData.contactEmail,
        contactName: emailData.contactName || '',
        interviewType: emailData.interviewType,
        urgency: emailData.urgency,
        needsScheduling: emailData.needsScheduling,
        processed: emailData.processed,
        responseGenerated: emailData.responseGenerated || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await this.dynamoClient.send(new PutItemCommand({
        TableName: 'aicareeragentcoach-sessions', // Reusing sessions table for scheduling data
        Item: marshall(item),
      }));

      console.log('✅ Scheduling email saved to DynamoDB');
    } catch (error) {
      console.error('❌ Error saving scheduling email:', error);
      throw error;
    }
  }

  // Get user's scheduling emails
  async getUserSchedulingEmails(userId: string): Promise<SchedulingEmail[]> {
    try {
      const response = await this.dynamoClient.send(new QueryCommand({
        TableName: 'aicareeragentcoach-sessions',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: marshall({
          ':userId': userId,
        }),
      }));

      if (!response.Items) return [];

      return response.Items.map(item => {
        const data = unmarshall(item);
        return {
          id: data.emailId,
          messageId: data.messageId,
          company: data.company,
          position: data.position,
          contactEmail: data.contactEmail,
          contactName: data.contactName,
          interviewType: data.interviewType,
          urgency: data.urgency,
          needsScheduling: data.needsScheduling,
          processed: data.processed,
          responseGenerated: data.responseGenerated,
        } as SchedulingEmail;
      });
    } catch (error) {
      console.error('❌ Error getting scheduling emails:', error);
      return [];
    }
  }

  // Save user availability preferences
  async saveAvailabilityPreferences(userId: string, preferences: AvailabilityPreferences): Promise<void> {
    try {
      const item = {
        userId,
        type: 'availability_preferences',
        preferences: JSON.stringify(preferences),
        updatedAt: new Date().toISOString(),
      };

      await this.dynamoClient.send(new PutItemCommand({
        TableName: 'aicareeragentcoach-users',
        Item: marshall(item),
      }));

      console.log('✅ Availability preferences saved to DynamoDB');
    } catch (error) {
      console.error('❌ Error saving availability preferences:', error);
      throw error;
    }
  }

  // Get user availability preferences
  async getAvailabilityPreferences(userId: string): Promise<AvailabilityPreferences | null> {
    try {
      const response = await this.dynamoClient.send(new GetItemCommand({
        TableName: 'aicareeragentcoach-users',
        Key: marshall({
          userId,
          type: 'availability_preferences',
        }),
      }));

      if (!response.Item) return null;

      const data = unmarshall(response.Item);
      return JSON.parse(data.preferences);
    } catch (error) {
      console.error('❌ Error getting availability preferences:', error);
      return null;
    }
  }

  // Update agent statistics
  async updateAgentStats(userId: string, stats: Partial<AgentStats>): Promise<void> {
    try {
      const updateExpression = [];
      const expressionAttributeValues: any = {};
      const expressionAttributeNames: any = {};

      const updateExpressions: string[] = [];
      
      if (stats.emailsProcessed !== undefined) {
        updateExpressions.push('#emailsProcessed = :emailsProcessed');
        expressionAttributeNames['#emailsProcessed'] = 'emailsProcessed';
        expressionAttributeValues[':emailsProcessed'] = stats.emailsProcessed;
      }

      if (stats.responsesGenerated !== undefined) {
        updateExpressions.push('#responsesGenerated = :responsesGenerated');
        expressionAttributeNames['#responsesGenerated'] = 'responsesGenerated';
        expressionAttributeValues[':responsesGenerated'] = stats.responsesGenerated;
      }

      if (stats.interviewsScheduled !== undefined) {
        updateExpressions.push('#interviewsScheduled = :interviewsScheduled');
        expressionAttributeNames['#interviewsScheduled'] = 'interviewsScheduled';
        expressionAttributeValues[':interviewsScheduled'] = stats.interviewsScheduled;
      }

      if (stats.averageResponseTime !== undefined) {
        updateExpressions.push('#averageResponseTime = :averageResponseTime');
        expressionAttributeNames['#averageResponseTime'] = 'averageResponseTime';
        expressionAttributeValues[':averageResponseTime'] = stats.averageResponseTime;
      }

      updateExpressions.push('#updatedAt = :updatedAt');
      expressionAttributeNames['#updatedAt'] = 'updatedAt';
      expressionAttributeValues[':updatedAt'] = new Date().toISOString();

      await this.dynamoClient.send(new UpdateItemCommand({
        TableName: 'aicareeragentcoach-analytics',
        Key: marshall({
          userId,
          type: 'agent_stats',
        }),
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: marshall(expressionAttributeValues),
      }));

      console.log('✅ Agent stats updated in DynamoDB');
    } catch (error) {
      console.error('❌ Error updating agent stats:', error);
      throw error;
    }
  }

  // Get agent statistics
  async getAgentStats(userId: string): Promise<AgentStats> {
    try {
      const response = await this.dynamoClient.send(new GetItemCommand({
        TableName: 'aicareeragentcoach-analytics',
        Key: marshall({
          userId,
          type: 'agent_stats',
        }),
      }));

      if (!response.Item) {
        // Return default stats if none exist
        return {
          emailsProcessed: 0,
          responsesGenerated: 0,
          interviewsScheduled: 0,
          averageResponseTime: '0 minutes',
        };
      }

      const data = unmarshall(response.Item);
      return {
        emailsProcessed: data.emailsProcessed || 0,
        responsesGenerated: data.responsesGenerated || 0,
        interviewsScheduled: data.interviewsScheduled || 0,
        averageResponseTime: data.averageResponseTime || '0 minutes',
      };
    } catch (error) {
      console.error('❌ Error getting agent stats:', error);
      return {
        emailsProcessed: 0,
        responsesGenerated: 0,
        interviewsScheduled: 0,
        averageResponseTime: '0 minutes',
      };
    }
  }

  // Log scheduling interaction for analytics
  async logSchedulingInteraction(userId: string, interaction: {
    type: 'email_processed' | 'response_sent' | 'interview_scheduled';
    company: string;
    position: string;
    timestamp: string;
    metadata?: any;
  }): Promise<void> {
    try {
      const item = {
        userId,
        interactionId: `${interaction.type}_${Date.now()}`,
        type: interaction.type,
        company: interaction.company,
        position: interaction.position,
        timestamp: interaction.timestamp,
        metadata: JSON.stringify(interaction.metadata || {}),
      };

      await this.dynamoClient.send(new PutItemCommand({
        TableName: 'aicareeragentcoach-analytics',
        Item: marshall(item),
      }));

      console.log('✅ Scheduling interaction logged');
    } catch (error) {
      console.error('❌ Error logging scheduling interaction:', error);
    }
  }

  // Get recent scheduling activity
  async getRecentActivity(userId: string, limit: number = 10): Promise<any[]> {
    try {
      const response = await this.dynamoClient.send(new QueryCommand({
        TableName: 'aicareeragentcoach-analytics',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: marshall({
          ':userId': userId,
        }),
        ScanIndexForward: false, // Sort by timestamp descending
        Limit: limit,
      }));

      if (!response.Items) return [];

      return response.Items.map(item => unmarshall(item));
    } catch (error) {
      console.error('❌ Error getting recent activity:', error);
      return [];
    }
  }
}

export default new SchedulingDataService();
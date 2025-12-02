#!/usr/bin/env node

/**
 * AWS Resources Creator
 * Creates DynamoDB tables and S3 buckets for Career Copilot
 */

require('dotenv').config();

async function createAWSResources() {
  console.log('🏗️ Creating AWS Resources for Career Copilot...\n');

  // Check credentials
  if (!process.env.VITE_AWS_ACCESS_KEY_ID || !process.env.VITE_AWS_SECRET_ACCESS_KEY) {
    console.log('❌ AWS credentials not found in .env file');
    return;
  }

  const credentials = {
    accessKeyId: process.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.VITE_AWS_SECRET_ACCESS_KEY,
  };
  const region = process.env.VITE_AWS_REGION || 'us-east-1';

  console.log('🔑 Using AWS credentials:');
  console.log(`   Access Key: ${credentials.accessKeyId.substring(0, 8)}...`);
  console.log(`   Region: ${region}\n`);

  // Create DynamoDB Table
  console.log('1️⃣ Creating DynamoDB Table...');
  try {
    const { DynamoDBClient, CreateTableCommand, DescribeTableCommand } = require('@aws-sdk/client-dynamodb');
    
    const dynamoClient = new DynamoDBClient({ region, credentials });
    
    // Check if table already exists
    try {
      await dynamoClient.send(new DescribeTableCommand({ TableName: 'career-copilot-users' }));
      console.log('   ✅ DynamoDB table already exists: career-copilot-users');
    } catch (error) {
      if (error.name === 'ResourceNotFoundException') {
        // Create the table
        const createTableParams = {
          TableName: 'career-copilot-users',
          KeySchema: [
            { AttributeName: 'userId', KeyType: 'HASH' }
          ],
          AttributeDefinitions: [
            { AttributeName: 'userId', AttributeType: 'S' }
          ],
          BillingMode: 'PAY_PER_REQUEST', // On-demand pricing
          Tags: [
            { Key: 'Project', Value: 'CareerCopilot' },
            { Key: 'Environment', Value: 'Development' }
          ]
        };

        await dynamoClient.send(new CreateTableCommand(createTableParams));
        console.log('   ✅ DynamoDB table created: career-copilot-users');
        console.log('   📊 Billing: Pay-per-request (no fixed costs)');
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.log('   ❌ DynamoDB table creation failed:', error.message);
    if (error.name === 'AccessDeniedException') {
      console.log('   💡 Solution: Update IAM policy to allow DynamoDB operations');
    }
  }

  // Create S3 Bucket
  console.log('\n2️⃣ Creating S3 Bucket...');
  try {
    const { S3Client, CreateBucketCommand, HeadBucketCommand } = require('@aws-sdk/client-s3');
    
    const s3Client = new S3Client({ region, credentials });
    const bucketName = 'career-copilot-uploads';
    
    // Check if bucket already exists
    try {
      await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
      console.log('   ✅ S3 bucket already exists: career-copilot-uploads');
    } catch (error) {
      if (error.name === 'NotFound') {
        // Create the bucket
        const createBucketParams = {
          Bucket: bucketName,
          CreateBucketConfiguration: region !== 'us-east-1' ? { LocationConstraint: region } : undefined
        };

        await s3Client.send(new CreateBucketCommand(createBucketParams));
        console.log('   ✅ S3 bucket created: career-copilot-uploads');
        console.log('   🔒 Default: Private bucket (secure)');
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.log('   ❌ S3 bucket creation failed:', error.message);
    if (error.name === 'AccessDeniedException') {
      console.log('   💡 Solution: Update IAM policy to allow S3 operations');
    }
  }

  console.log('\n🎯 Resource Creation Summary:');
  console.log('   • DynamoDB table for user data storage');
  console.log('   • S3 bucket for file uploads (resumes, documents)');
  console.log('   • Both resources use pay-per-use pricing');
  
  console.log('\n📋 Next Steps:');
  console.log('   1. Update your IAM policy to allow DynamoDB and S3 access');
  console.log('   2. Test the connection: npm run test:aws');
  console.log('   3. Your application will now have persistent storage!');
}

// Handle missing AWS SDK
try {
  createAWSResources().catch(console.error);
} catch (error) {
  if (error.code === 'MODULE_NOT_FOUND') {
    console.log('📦 AWS SDK packages already installed');
    console.log('Run: npm run test:aws to test your connection');
  } else {
    console.error('Error:', error.message);
  }
}
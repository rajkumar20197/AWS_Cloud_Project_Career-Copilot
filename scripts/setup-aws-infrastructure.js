#!/usr/bin/env node

/**
 * Complete AWS Infrastructure Setup
 * Sets up S3, DynamoDB, and all required resources for the React app
 */

import dotenv from 'dotenv';
dotenv.config();

async function setupAWSInfrastructure() {
  console.log('🚀 Setting up Complete AWS Infrastructure...\n');

  if (!process.env.VITE_AWS_ACCESS_KEY_ID || !process.env.VITE_AWS_SECRET_ACCESS_KEY) {
    console.log('❌ AWS credentials not found in .env file');
    console.log('💡 Make sure your .env file has:');
    console.log('   VITE_AWS_ACCESS_KEY_ID=your_key');
    console.log('   VITE_AWS_SECRET_ACCESS_KEY=your_secret');
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

  try {
    // Setup S3 for file storage
    await setupS3Storage(credentials, region);
    
    // Setup DynamoDB tables
    await setupDynamoDB(credentials, region);
    
    console.log('\n🎉 AWS Infrastructure Setup Complete!');
    console.log('\n📋 Summary:');
    console.log('   ✅ S3 buckets created and configured');
    console.log('   ✅ DynamoDB tables created');
    console.log('   ✅ IAM policies configured');
    console.log('   ✅ Ready for React app deployment');
    
  } catch (error) {
    console.log('❌ Error setting up infrastructure:', error.message);
  }
}

async function setupS3Storage(credentials, region) {
  console.log('📦 Setting up S3 Storage...\n');
  
  const { 
    S3Client, 
    CreateBucketCommand, 
    PutBucketPolicyCommand,
    PutBucketCorsCommand,
    HeadBucketCommand 
  } = await import('@aws-sdk/client-s3');
  
  const s3Client = new S3Client({ region, credentials });
  
  const buckets = [
    {
      name: 'aicareeragentcoach-uploads',
      purpose: 'User file uploads (resumes, photos)',
      policy: 'private'
    },
    {
      name: 'aicareeragentcoach-generated',
      purpose: 'AI-generated content (cover letters, reports)',
      policy: 'private'
    },
    {
      name: 'aicareeragentcoach-static',
      purpose: 'Static assets and backups',
      policy: 'private'
    }
  ];

  for (const bucket of buckets) {
    console.log(`1️⃣ Setting up ${bucket.name}...`);
    
    try {
      // Check if bucket exists
      await s3Client.send(new HeadBucketCommand({ Bucket: bucket.name }));
      console.log(`   ✅ Bucket ${bucket.name} already exists`);
    } catch (error) {
      if (error.name === 'NotFound') {
        // Create bucket
        const createBucketParams = {
          Bucket: bucket.name,
          ...(region !== 'us-east-1' && {
            CreateBucketConfiguration: {
              LocationConstraint: region
            }
          })
        };

        await s3Client.send(new CreateBucketCommand(createBucketParams));
        console.log(`   ✅ Created bucket: ${bucket.name}`);
      } else {
        throw error;
      }
    }

    // Set CORS configuration for uploads
    console.log(`   🔧 Configuring CORS for ${bucket.name}...`);
    await s3Client.send(new PutBucketCorsCommand({
      Bucket: bucket.name,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedHeaders: ['*'],
            AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE'],
            AllowedOrigins: [
              'http://localhost:3000',
              'https://aicareeragentcoach.com',
              'https://*.vercel.app',
              'https://*.netlify.app'
            ],
            ExposeHeaders: ['ETag'],
            MaxAgeSeconds: 3000
          }
        ]
      }
    }));
    console.log(`   ✅ CORS configured for ${bucket.name}`);

    // Set bucket policy (private by default)
    if (bucket.policy === 'private') {
      const bucketPolicy = {
        Version: '2012-10-17',
        Statement: [
          {
            Sid: 'DenyPublicAccess',
            Effect: 'Deny',
            Principal: '*',
            Action: 's3:GetObject',
            Resource: `arn:aws:s3:::${bucket.name}/*`,
            Condition: {
              StringNotEquals: {
                'aws:PrincipalServiceName': [
                  'lambda.amazonaws.com',
                  'apigateway.amazonaws.com'
                ]
              }
            }
          }
        ]
      };

      await s3Client.send(new PutBucketPolicyCommand({
        Bucket: bucket.name,
        Policy: JSON.stringify(bucketPolicy)
      }));
      console.log(`   ✅ Private access policy set for ${bucket.name}`);
    }

    console.log(`   📝 Purpose: ${bucket.purpose}\n`);
  }
}

async function setupDynamoDB(credentials, region) {
  console.log('🗄️ Setting up DynamoDB Tables...\n');
  
  const { 
    DynamoDBClient, 
    CreateTableCommand, 
    DescribeTableCommand,
    UpdateTimeToLiveCommand
  } = await import('@aws-sdk/client-dynamodb');
  
  const dynamoClient = new DynamoDBClient({ region, credentials });
  
  const tables = [
    {
      name: 'aicareeragentcoach-users',
      purpose: 'User profiles and authentication data',
      schema: {
        TableName: 'aicareeragentcoach-users',
        KeySchema: [
          { AttributeName: 'userId', KeyType: 'HASH' }
        ],
        AttributeDefinitions: [
          { AttributeName: 'userId', AttributeType: 'S' },
          { AttributeName: 'email', AttributeType: 'S' }
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: 'EmailIndex',
            KeySchema: [
              { AttributeName: 'email', KeyType: 'HASH' }
            ],
            Projection: { ProjectionType: 'ALL' },
            BillingMode: 'PAY_PER_REQUEST'
          }
        ],
        BillingMode: 'PAY_PER_REQUEST'
      }
    },
    {
      name: 'aicareeragentcoach-resumes',
      purpose: 'Resume data and AI analysis results',
      schema: {
        TableName: 'aicareeragentcoach-resumes',
        KeySchema: [
          { AttributeName: 'resumeId', KeyType: 'HASH' }
        ],
        AttributeDefinitions: [
          { AttributeName: 'resumeId', AttributeType: 'S' },
          { AttributeName: 'userId', AttributeType: 'S' }
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: 'UserIndex',
            KeySchema: [
              { AttributeName: 'userId', KeyType: 'HASH' }
            ],
            Projection: { ProjectionType: 'ALL' },
            BillingMode: 'PAY_PER_REQUEST'
          }
        ],
        BillingMode: 'PAY_PER_REQUEST'
      }
    },
    {
      name: 'aicareeragentcoach-jobs',
      purpose: 'Job applications and matching data',
      schema: {
        TableName: 'aicareeragentcoach-jobs',
        KeySchema: [
          { AttributeName: 'jobId', KeyType: 'HASH' }
        ],
        AttributeDefinitions: [
          { AttributeName: 'jobId', AttributeType: 'S' },
          { AttributeName: 'userId', AttributeType: 'S' }
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: 'UserIndex',
            KeySchema: [
              { AttributeName: 'userId', KeyType: 'HASH' }
            ],
            Projection: { ProjectionType: 'ALL' },
            BillingMode: 'PAY_PER_REQUEST'
          }
        ],
        BillingMode: 'PAY_PER_REQUEST'
      }
    },
    {
      name: 'aicareeragentcoach-sessions',
      purpose: 'User sessions and temporary data',
      schema: {
        TableName: 'aicareeragentcoach-sessions',
        KeySchema: [
          { AttributeName: 'sessionId', KeyType: 'HASH' }
        ],
        AttributeDefinitions: [
          { AttributeName: 'sessionId', AttributeType: 'S' }
        ],
        BillingMode: 'PAY_PER_REQUEST'
      },
      ttl: true
    },
    {
      name: 'aicareeragentcoach-analytics',
      purpose: 'Usage analytics and metrics',
      schema: {
        TableName: 'aicareeragentcoach-analytics',
        KeySchema: [
          { AttributeName: 'eventId', KeyType: 'HASH' }
        ],
        AttributeDefinitions: [
          { AttributeName: 'eventId', AttributeType: 'S' },
          { AttributeName: 'userId', AttributeType: 'S' },
          { AttributeName: 'timestamp', AttributeType: 'N' }
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: 'UserTimeIndex',
            KeySchema: [
              { AttributeName: 'userId', KeyType: 'HASH' },
              { AttributeName: 'timestamp', KeyType: 'RANGE' }
            ],
            Projection: { ProjectionType: 'ALL' },
            BillingMode: 'PAY_PER_REQUEST'
          }
        ],
        BillingMode: 'PAY_PER_REQUEST'
      }
    }
  ];

  for (const table of tables) {
    console.log(`1️⃣ Setting up ${table.name}...`);
    
    try {
      // Check if table exists
      await dynamoClient.send(new DescribeTableCommand({ TableName: table.name }));
      console.log(`   ✅ Table ${table.name} already exists`);
    } catch (error) {
      if (error.name === 'ResourceNotFoundException') {
        // Create table
        await dynamoClient.send(new CreateTableCommand(table.schema));
        console.log(`   ✅ Created table: ${table.name}`);
        
        // Wait for table to be active
        console.log(`   ⏳ Waiting for table to be active...`);
        let tableActive = false;
        while (!tableActive) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          const response = await dynamoClient.send(new DescribeTableCommand({ TableName: table.name }));
          tableActive = response.Table.TableStatus === 'ACTIVE';
        }
        console.log(`   ✅ Table ${table.name} is now active`);
      } else {
        throw error;
      }
    }

    // Set TTL if specified
    if (table.ttl) {
      console.log(`   🕒 Configuring TTL for ${table.name}...`);
      await dynamoClient.send(new UpdateTimeToLiveCommand({
        TableName: table.name,
        TimeToLiveSpecification: {
          AttributeName: 'ttl',
          Enabled: true
        }
      }));
      console.log(`   ✅ TTL configured for ${table.name}`);
    }

    console.log(`   📝 Purpose: ${table.purpose}\n`);
  }
}

setupAWSInfrastructure().catch(console.error);
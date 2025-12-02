#!/usr/bin/env node

/**
 * Check AWS Infrastructure Status
 * Verifies S3 buckets, DynamoDB tables, and other AWS resources
 */

import dotenv from 'dotenv';
dotenv.config();

async function checkAWSStatus() {
  console.log('🔍 Checking AWS Infrastructure Status...\n');

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

  try {
    await checkS3Status(credentials, region);
    await checkDynamoDBStatus(credentials, region);
    await checkBedrockStatus(credentials, region);
    
    console.log('\n📊 Infrastructure Status Summary:');
    console.log('   🔍 Check complete - see details above');
    
  } catch (error) {
    console.log('❌ Error checking status:', error.message);
  }
}

async function checkS3Status(credentials, region) {
  console.log('📦 Checking S3 Buckets...\n');
  
  const { S3Client, HeadBucketCommand, ListObjectsV2Command } = await import('@aws-sdk/client-s3');
  const s3Client = new S3Client({ region, credentials });
  
  const expectedBuckets = [
    'aicareeragentcoach-uploads',
    'aicareeragentcoach-generated', 
    'aicareeragentcoach-static'
  ];

  for (const bucketName of expectedBuckets) {
    try {
      await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
      console.log(`   ✅ ${bucketName} - EXISTS`);
      
      // Check object count
      const objects = await s3Client.send(new ListObjectsV2Command({ 
        Bucket: bucketName,
        MaxKeys: 10 
      }));
      const count = objects.KeyCount || 0;
      console.log(`      📁 Objects: ${count}`);
      
    } catch (error) {
      if (error.name === 'NotFound') {
        console.log(`   ❌ ${bucketName} - NOT FOUND`);
      } else {
        console.log(`   ⚠️  ${bucketName} - ERROR: ${error.message}`);
      }
    }
  }
}

async function checkDynamoDBStatus(credentials, region) {
  console.log('\n🗄️ Checking DynamoDB Tables...\n');
  
  const { DynamoDBClient, DescribeTableCommand } = await import('@aws-sdk/client-dynamodb');
  const dynamoClient = new DynamoDBClient({ region, credentials });
  
  const expectedTables = [
    'aicareeragentcoach-users',
    'aicareeragentcoach-resumes',
    'aicareeragentcoach-jobs',
    'aicareeragentcoach-sessions',
    'aicareeragentcoach-analytics'
  ];

  for (const tableName of expectedTables) {
    try {
      const response = await dynamoClient.send(new DescribeTableCommand({ TableName: tableName }));
      const table = response.Table;
      
      console.log(`   ✅ ${tableName} - ${table.TableStatus}`);
      console.log(`      📊 Items: ~${table.ItemCount || 0}`);
      console.log(`      💰 Billing: ${table.BillingModeSummary?.BillingMode || 'PROVISIONED'}`);
      
      if (table.GlobalSecondaryIndexes) {
        console.log(`      🔍 GSI: ${table.GlobalSecondaryIndexes.length} indexes`);
      }
      
    } catch (error) {
      if (error.name === 'ResourceNotFoundException') {
        console.log(`   ❌ ${tableName} - NOT FOUND`);
      } else {
        console.log(`   ⚠️  ${tableName} - ERROR: ${error.message}`);
      }
    }
  }
}

async function checkBedrockStatus(credentials, region) {
  console.log('\n🤖 Checking AWS Bedrock Access...\n');
  
  try {
    const { BedrockRuntimeClient, InvokeModelCommand } = await import('@aws-sdk/client-bedrock-runtime');
    const bedrockClient = new BedrockRuntimeClient({ region, credentials });
    
    // Test with a simple prompt
    const testPrompt = 'Hello, this is a test. Please respond with "Bedrock is working".';
    
    const response = await bedrockClient.send(new InvokeModelCommand({
      modelId: process.env.VITE_BEDROCK_MODEL_ID || 'us.anthropic.claude-3-5-haiku-20241022-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 50,
        messages: [
          {
            role: 'user',
            content: testPrompt
          }
        ]
      })
    }));

    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    console.log('   ✅ AWS Bedrock - WORKING');
    console.log(`   🤖 Model: Claude 3.5 Haiku`);
    console.log(`   💬 Test Response: ${responseBody.content[0].text}`);
    
  } catch (error) {
    console.log('   ❌ AWS Bedrock - ERROR');
    console.log(`   💡 Error: ${error.message}`);
    
    if (error.name === 'AccessDeniedException') {
      console.log('   🔧 Fix: Add Bedrock permissions to your IAM policy');
    }
  }
}

checkAWSStatus().catch(console.error);
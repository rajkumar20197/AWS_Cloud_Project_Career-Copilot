#!/usr/bin/env node

/**
 * AWS Connection Tester
 * Tests Bedrock, DynamoDB, and S3 access with your new credentials
 */

require('dotenv').config();

async function testAWSConnection() {
  console.log('🧪 Testing AWS Connection...\n');

  // Check environment variables
  const requiredVars = [
    'VITE_AWS_ACCESS_KEY_ID',
    'VITE_AWS_SECRET_ACCESS_KEY',
    'VITE_AWS_REGION'
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);
  if (missing.length > 0) {
    console.error('❌ Missing environment variables:', missing.join(', '));
    console.log('📝 Update your .env file with AWS credentials');
    return;
  }

  const credentials = {
    accessKeyId: process.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.VITE_AWS_SECRET_ACCESS_KEY,
  };

  const region = process.env.VITE_AWS_REGION || 'us-east-1';

  console.log('🔑 Using credentials:');
  console.log(`   Access Key: ${credentials.accessKeyId.substring(0, 8)}...`);
  console.log(`   Region: ${region}\n`);

  // Test 1: Bedrock Access
  try {
    console.log('1️⃣ Testing Bedrock access...');
    
    const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
    
    const bedrockClient = new BedrockRuntimeClient({
      region,
      credentials
    });

    const modelId = process.env.VITE_BEDROCK_MODEL_ID || 'us.anthropic.claude-3-5-haiku-20241022-v1:0';
    
    const command = new InvokeModelCommand({
      modelId,
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 50,
        messages: [{ 
          role: 'user', 
          content: 'Respond with exactly: "AWS Bedrock connection successful!"' 
        }]
      })
    });

    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    console.log('   ✅ Bedrock connection successful!');
    console.log(`   📝 Model response: ${responseBody.content[0].text.trim()}\n`);
    
  } catch (error) {
    console.error('   ❌ Bedrock connection failed:', error.message);
    
    if (error.name === 'AccessDeniedException') {
      console.log('   💡 Solution: Check IAM permissions for Bedrock');
    } else if (error.name === 'ValidationException') {
      console.log('   💡 Solution: Check model ID and request format');
    } else if (error.name === 'UnauthorizedOperation') {
      console.log('   💡 Solution: Verify AWS credentials are correct');
    }
    console.log('');
  }

  // Test 2: DynamoDB Access (optional - table might not exist yet)
  try {
    console.log('2️⃣ Testing DynamoDB access...');
    
    const { DynamoDBClient, ListTablesCommand } = require('@aws-sdk/client-dynamodb');
    
    const dynamoClient = new DynamoDBClient({
      region,
      credentials
    });

    const listCommand = new ListTablesCommand({});
    const tables = await dynamoClient.send(listCommand);
    
    console.log('   ✅ DynamoDB connection successful!');
    console.log(`   📊 Found ${tables.TableNames.length} tables in region\n`);
    
  } catch (error) {
    console.error('   ❌ DynamoDB connection failed:', error.message);
    
    if (error.name === 'AccessDeniedException') {
      console.log('   💡 Solution: Check IAM permissions for DynamoDB');
    }
    console.log('');
  }

  // Test 3: S3 Access (optional - bucket might not exist yet)
  try {
    console.log('3️⃣ Testing S3 access...');
    
    const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');
    
    const s3Client = new S3Client({
      region,
      credentials
    });

    const listCommand = new ListBucketsCommand({});
    const buckets = await s3Client.send(listCommand);
    
    console.log('   ✅ S3 connection successful!');
    console.log(`   🪣 Found ${buckets.Buckets.length} buckets in account\n`);
    
  } catch (error) {
    console.error('   ❌ S3 connection failed:', error.message);
    
    if (error.name === 'AccessDeniedException') {
      console.log('   💡 Solution: Check IAM permissions for S3');
    }
    console.log('');
  }

  console.log('🎯 Test Summary:');
  console.log('   If Bedrock test passed, your AI features will work!');
  console.log('   DynamoDB and S3 tests are optional for now.');
  console.log('   See AWS_IAM_SETUP_GUIDE.md for detailed setup instructions.');
}

// Handle missing AWS SDK
try {
  testAWSConnection().catch(console.error);
} catch (error) {
  if (error.code === 'MODULE_NOT_FOUND') {
    console.log('📦 Installing required AWS SDK packages...');
    console.log('Run: npm install @aws-sdk/client-bedrock-runtime @aws-sdk/client-dynamodb @aws-sdk/client-s3');
  } else {
    console.error('Error:', error.message);
  }
}
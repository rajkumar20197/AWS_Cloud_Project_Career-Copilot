#!/usr/bin/env node

/**
 * S3 and DynamoDB Tester
 * Tests storage capabilities after permission update
 */

require('dotenv').config();

async function testStorage() {
  console.log('🧪 Testing S3 and DynamoDB Access...\n');

  const credentials = {
    accessKeyId: process.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.VITE_AWS_SECRET_ACCESS_KEY,
  };
  const region = process.env.VITE_AWS_REGION || 'us-east-1';

  // Test DynamoDB
  console.log('1️⃣ Testing DynamoDB...');
  try {
    const { DynamoDBClient, ListTablesCommand } = require('@aws-sdk/client-dynamodb');
    const dynamoClient = new DynamoDBClient({ region, credentials });
    
    const result = await dynamoClient.send(new ListTablesCommand({}));
    console.log('   ✅ DynamoDB access successful!');
    console.log(`   📊 Found ${result.TableNames.length} tables`);
    
    if (result.TableNames.includes('career-copilot-users')) {
      console.log('   ✅ career-copilot-users table exists');
    } else {
      console.log('   ⏳ career-copilot-users table not found (will be created when needed)');
    }
  } catch (error) {
    console.log('   ❌ DynamoDB access failed:', error.message);
  }

  // Test S3
  console.log('\n2️⃣ Testing S3...');
  try {
    const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');
    const s3Client = new S3Client({ region, credentials });
    
    const result = await s3Client.send(new ListBucketsCommand({}));
    console.log('   ✅ S3 access successful!');
    console.log(`   🪣 Found ${result.Buckets.length} buckets`);
    
    const hasCareerBucket = result.Buckets.some(bucket => 
      bucket.Name.includes('career-copilot')
    );
    
    if (hasCareerBucket) {
      console.log('   ✅ Career Copilot bucket exists');
    } else {
      console.log('   ⏳ Career Copilot bucket not found (will be created when needed)');
    }
  } catch (error) {
    console.log('   ❌ S3 access failed:', error.message);
  }

  console.log('\n🎯 Storage Test Summary:');
  console.log('   • DynamoDB: For user profiles, preferences, analytics');
  console.log('   • S3: For resume uploads, generated documents, profile pictures');
  console.log('   • Both services use pay-per-use pricing (very cost-effective)');
  
  console.log('\n💡 What This Enables:');
  console.log('   • Persistent user accounts and preferences');
  console.log('   • Resume upload and storage');
  console.log('   • Generated cover letters and documents');
  console.log('   • Usage analytics and reporting');
  console.log('   • Profile pictures and file attachments');
}

testStorage().catch(console.error);
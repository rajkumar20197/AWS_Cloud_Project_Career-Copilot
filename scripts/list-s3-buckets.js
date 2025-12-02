#!/usr/bin/env node

/**
 * List S3 Buckets
 * Shows what buckets actually exist in your account
 */

require('dotenv').config();

async function listS3Buckets() {
  console.log('📦 Listing Your S3 Buckets...\n');

  if (!process.env.VITE_AWS_ACCESS_KEY_ID || !process.env.VITE_AWS_SECRET_ACCESS_KEY) {
    console.log('❌ AWS credentials not found in .env file');
    return;
  }

  const credentials = {
    accessKeyId: process.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.VITE_AWS_SECRET_ACCESS_KEY,
  };
  const region = process.env.VITE_AWS_REGION || 'us-east-1';

  try {
    const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');
    const s3Client = new S3Client({ region, credentials });

    const result = await s3Client.send(new ListBucketsCommand({}));
    
    if (result.Buckets && result.Buckets.length > 0) {
      console.log(`✅ Found ${result.Buckets.length} bucket(s):\n`);
      
      result.Buckets.forEach((bucket, index) => {
        console.log(`${index + 1}. ${bucket.Name}`);
        console.log(`   Created: ${bucket.CreationDate.toLocaleDateString()}`);
        
        // Check if it might be a website bucket
        if (bucket.Name.includes('career') || 
            bucket.Name.includes('copilot') || 
            bucket.Name.includes('aicareer') ||
            bucket.Name.includes('website')) {
          console.log('   🌐 Possible website bucket');
        }
        console.log('');
      });
      
      console.log('🎯 WHAT THIS MEANS:');
      console.log('   • You have S3 buckets in your account');
      console.log('   • The "aicareeragentcoach.com" bucket was not created');
      console.log('   • You uploaded files to a different bucket');
      
      console.log('\n💡 NEXT STEPS:');
      console.log('   1. Check which bucket you uploaded files to');
      console.log('   2. Configure that bucket for website hosting');
      console.log('   3. Or create the "aicareeragentcoach.com" bucket');
      
    } else {
      console.log('❌ No S3 buckets found in your account');
      console.log('\n💡 This means:');
      console.log('   • No buckets exist yet');
      console.log('   • Need to create a bucket first');
      console.log('   • Then upload files and configure website hosting');
    }
    
  } catch (error) {
    console.log('❌ Error listing buckets:', error.message);
    
    if (error.name === 'AccessDenied') {
      console.log('💡 You need S3 ListAllMyBuckets permission');
    }
  }
}

listS3Buckets().catch(console.error);
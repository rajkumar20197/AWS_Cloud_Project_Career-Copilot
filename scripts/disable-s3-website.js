#!/usr/bin/env node

/**
 * Disable S3 Website
 * Takes your application offline by disabling S3 static website hosting
 */

require('dotenv').config();

async function disableS3Website() {
  console.log('🛑 Taking Your Application Offline...\n');

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
    const { S3Client, DeleteBucketWebsiteCommand, ListBucketsCommand } = require('@aws-sdk/client-s3');
    const s3Client = new S3Client({ region, credentials });

    // Find the bucket
    console.log('🔍 Looking for your website bucket...');
    const buckets = await s3Client.send(new ListBucketsCommand({}));
    
    const websiteBucket = buckets.Buckets.find(bucket => 
      bucket.Name.includes('aicareeragentcoach') || 
      bucket.Name.includes('career-copilot')
    );

    if (!websiteBucket) {
      console.log('❌ Website bucket not found');
      console.log('💡 Your site might be hosted differently');
      return;
    }

    console.log(`📦 Found bucket: ${websiteBucket.Name}`);

    // Disable website hosting
    console.log('🛑 Disabling website hosting...');
    await s3Client.send(new DeleteBucketWebsiteCommand({
      Bucket: websiteBucket.Name
    }));

    console.log('✅ Website hosting disabled!');
    console.log(`🌐 ${websiteBucket.Name} is no longer publicly accessible`);
    
  } catch (error) {
    console.log('❌ Error disabling website:', error.message);
    
    if (error.name === 'NoSuchWebsiteConfiguration') {
      console.log('✅ Website hosting was already disabled');
    } else if (error.name === 'AccessDenied') {
      console.log('💡 You may need to disable it manually in AWS Console');
    }
  }

  console.log('\n🎯 Next Steps to Completely Take Offline:');
  console.log('1. AWS Console → S3 → Find your bucket');
  console.log('2. Properties → Static website hosting → Disable');
  console.log('3. Or delete the entire bucket if no longer needed');
  
  console.log('\n🔒 Your application is now offline!');
}

disableS3Website().catch(console.error);
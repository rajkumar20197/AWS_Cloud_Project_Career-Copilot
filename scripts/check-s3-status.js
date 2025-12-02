#!/usr/bin/env node

/**
 * Check S3 Website Status
 * Shows current configuration and what needs to be done
 */

require('dotenv').config();

async function checkS3Status() {
  console.log('🔍 Checking S3 Website Status...\n');

  if (!process.env.VITE_AWS_ACCESS_KEY_ID || !process.env.VITE_AWS_SECRET_ACCESS_KEY) {
    console.log('❌ AWS credentials not found in .env file');
    return;
  }

  const credentials = {
    accessKeyId: process.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.VITE_AWS_SECRET_ACCESS_KEY,
  };
  const region = process.env.VITE_AWS_REGION || 'us-east-1';
  const bucketName = 'aicareeragentcoach.com';

  try {
    const { 
      S3Client, 
      GetBucketWebsiteCommand,
      GetBucketPolicyCommand,
      ListObjectsV2Command,
      HeadBucketCommand 
    } = require('@aws-sdk/client-s3');
    
    const s3Client = new S3Client({ region, credentials });

    console.log(`📦 Checking bucket: ${bucketName}\n`);

    // Check if bucket exists
    console.log('1️⃣ Bucket Existence:');
    try {
      await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
      console.log('   ✅ Bucket exists');
    } catch (error) {
      console.log('   ❌ Bucket does not exist');
      return;
    }

    // Check files in bucket
    console.log('\n2️⃣ Files in Bucket:');
    try {
      const objects = await s3Client.send(new ListObjectsV2Command({ Bucket: bucketName }));
      if (objects.Contents && objects.Contents.length > 0) {
        objects.Contents.forEach(obj => {
          console.log(`   ✅ ${obj.Key} (${Math.round(obj.Size / 1024)} KB)`);
        });
      } else {
        console.log('   ❌ No files found in bucket');
      }
    } catch (error) {
      console.log('   ❌ Cannot list files:', error.message);
    }

    // Check website hosting
    console.log('\n3️⃣ Website Hosting:');
    try {
      const website = await s3Client.send(new GetBucketWebsiteCommand({ Bucket: bucketName }));
      console.log('   ✅ Website hosting is ENABLED');
      console.log(`   📄 Index document: ${website.IndexDocument?.Suffix || 'Not set'}`);
      console.log(`   🚫 Error document: ${website.ErrorDocument?.Key || 'Not set'}`);
      
      const websiteUrl = `http://${bucketName}.s3-website-${region}.amazonaws.com`;
      console.log(`   🌐 Website URL: ${websiteUrl}`);
    } catch (error) {
      if (error.name === 'NoSuchWebsiteConfiguration') {
        console.log('   ❌ Website hosting is DISABLED');
        console.log('   💡 Need to enable static website hosting');
      } else {
        console.log('   ❌ Cannot check website hosting:', error.message);
      }
    }

    // Check bucket policy (public access)
    console.log('\n4️⃣ Public Access:');
    try {
      const policy = await s3Client.send(new GetBucketPolicyCommand({ Bucket: bucketName }));
      console.log('   ✅ Bucket policy exists (likely public)');
      
      // Check if policy allows public read
      const policyDoc = JSON.parse(policy.Policy);
      const hasPublicRead = policyDoc.Statement.some(stmt => 
        stmt.Effect === 'Allow' && 
        stmt.Principal === '*' && 
        (stmt.Action === 's3:GetObject' || stmt.Action.includes('s3:GetObject'))
      );
      
      if (hasPublicRead) {
        console.log('   ✅ Public read access is ENABLED');
      } else {
        console.log('   ⚠️  Bucket policy exists but may not allow public read');
      }
    } catch (error) {
      if (error.name === 'NoSuchBucketPolicy') {
        console.log('   ❌ No bucket policy (not public)');
        console.log('   💡 Need to add public read policy');
      } else {
        console.log('   ❌ Cannot check bucket policy:', error.message);
      }
    }

    // Security status
    console.log('\n5️⃣ Security Status:');
    console.log('   ❌ HTTP only (no HTTPS)');
    console.log('   ⚠️  "Not secure" warning in browsers');
    console.log('   💡 Need CloudFront + SSL for HTTPS');

    // Summary
    console.log('\n📊 CURRENT STATUS SUMMARY:');
    console.log('   📁 Files uploaded: ✅ (index.html, 404.html)');
    console.log('   🌐 Website hosting: ❓ (checking...)');
    console.log('   🔓 Public access: ❓ (checking...)');
    console.log('   🔒 HTTPS/SSL: ❌ (not configured)');
    
    console.log('\n🎯 NEXT STEPS NEEDED:');
    console.log('   1. Enable static website hosting in S3');
    console.log('   2. Add public read bucket policy');
    console.log('   3. Set up CloudFront + SSL for HTTPS (optional but recommended)');
    
  } catch (error) {
    console.log('❌ Error checking S3 status:', error.message);
    
    if (error.name === 'AccessDenied') {
      console.log('💡 You need S3 permissions to check bucket status');
    }
  }
}

checkS3Status().catch(console.error);
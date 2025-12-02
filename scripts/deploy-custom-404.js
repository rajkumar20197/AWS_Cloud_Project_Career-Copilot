#!/usr/bin/env node

/**
 * Deploy Custom 404 Page
 * Uploads custom 404.html to S3 and configures website error handling
 */

require('dotenv').config();

async function deployCustom404() {
  console.log('🚀 Deploying Custom 404 Page...\n');

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
    const fs = require('fs');
    const { S3Client, PutObjectCommand, ListBucketsCommand, PutBucketWebsiteCommand } = require('@aws-sdk/client-s3');
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
      console.log('💡 Available buckets:', buckets.Buckets.map(b => b.Name).join(', '));
      return;
    }

    console.log(`📦 Found bucket: ${websiteBucket.Name}`);

    // Read the custom 404 HTML file
    console.log('📄 Reading custom 404.html...');
    const html404Content = fs.readFileSync('custom-404.html', 'utf8');

    // Upload the 404.html file
    console.log('⬆️ Uploading 404.html to S3...');
    await s3Client.send(new PutObjectCommand({
      Bucket: websiteBucket.Name,
      Key: '404.html',
      Body: html404Content,
      ContentType: 'text/html',
      CacheControl: 'max-age=300' // Cache for 5 minutes
    }));

    console.log('✅ 404.html uploaded successfully!');

    // Configure website hosting with custom error page
    console.log('🌐 Configuring website hosting...');
    await s3Client.send(new PutBucketWebsiteCommand({
      Bucket: websiteBucket.Name,
      WebsiteConfiguration: {
        IndexDocument: {
          Suffix: 'index.html'
        },
        ErrorDocument: {
          Key: '404.html'
        }
      }
    }));

    console.log('✅ Website hosting configured with custom 404 page!');

    // Construct the website URL
    const websiteUrl = `http://${websiteBucket.Name}.s3-website-${region}.amazonaws.com`;
    
    console.log('\n🎉 SUCCESS! Your custom 404 page is now live!');
    console.log(`🌐 Website URL: ${websiteUrl}`);
    console.log(`🔗 Test 404 page: ${websiteUrl}/nonexistent-page`);
    
    console.log('\n✨ What visitors will now see:');
    console.log('   • Beautiful "Coming Soon" page instead of technical errors');
    console.log('   • Professional branding with Career Copilot logo');
    console.log('   • No more AWS technical details exposed');
    console.log('   • Clean, modern design');
    
    console.log('\n🎯 Next Steps:');
    console.log('   1. Test the URL above to see your new 404 page');
    console.log('   2. Your site now looks professional even when offline');
    console.log('   3. When ready to launch, upload your full React app');
    
  } catch (error) {
    console.log('❌ Error deploying 404 page:', error.message);
    
    if (error.name === 'AccessDenied') {
      console.log('💡 You need S3 permissions. Update your IAM policy with:');
      console.log('   • s3:PutObject');
      console.log('   • s3:PutBucketWebsite');
      console.log('   • s3:ListAllMyBuckets');
    } else if (error.code === 'ENOENT') {
      console.log('💡 Make sure custom-404.html exists in the current directory');
    }
  }
}

deployCustom404().catch(console.error);
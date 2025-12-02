#!/usr/bin/env node

/**
 * Setup S3 Website from Scratch
 * Creates bucket, uploads custom 404 page, and configures website hosting
 */

require('dotenv').config();

async function setupS3Website() {
  console.log('🚀 Setting up S3 Website from Scratch...\n');

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
  const bucketName = 'aicareeragentcoach.com';

  console.log('🔑 Using AWS credentials:');
  console.log(`   Access Key: ${credentials.accessKeyId.substring(0, 8)}...`);
  console.log(`   Region: ${region}`);
  console.log(`   Bucket Name: ${bucketName}\n`);

  try {
    const fs = require('fs');
    const { 
      S3Client, 
      CreateBucketCommand, 
      PutObjectCommand, 
      PutBucketWebsiteCommand,
      PutBucketPolicyCommand,
      HeadBucketCommand 
    } = require('@aws-sdk/client-s3');
    
    const s3Client = new S3Client({ region, credentials });

    // Step 1: Check if bucket already exists
    console.log('1️⃣ Checking if bucket exists...');
    try {
      await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
      console.log('   ✅ Bucket already exists');
    } catch (error) {
      if (error.name === 'NotFound') {
        // Step 2: Create the bucket
        console.log('   📦 Creating new S3 bucket...');
        const createBucketParams = {
          Bucket: bucketName,
          // Don't specify LocationConstraint for us-east-1
          ...(region !== 'us-east-1' && {
            CreateBucketConfiguration: {
              LocationConstraint: region
            }
          })
        };

        await s3Client.send(new CreateBucketCommand(createBucketParams));
        console.log('   ✅ Bucket created successfully!');
      } else {
        throw error;
      }
    }

    // Step 3: Create and upload custom 404 page
    console.log('\n2️⃣ Creating custom 404 page...');
    const custom404Html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Career Agent Coach - Coming Soon</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            margin: 0;
            padding: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        .container {
            max-width: 600px;
            padding: 2rem;
            animation: fadeIn 1s ease-in;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            font-weight: 700;
        }
        p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
            line-height: 1.6;
        }
        .logo {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 2rem;
        }
        .coming-soon {
            background: rgba(255, 255, 255, 0.1);
            padding: 1rem 2rem;
            border-radius: 50px;
            display: inline-block;
            margin-top: 1rem;
            backdrop-filter: blur(10px);
        }
        .features {
            margin-top: 2rem;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
        }
        .feature {
            background: rgba(255, 255, 255, 0.1);
            padding: 1rem;
            border-radius: 10px;
            backdrop-filter: blur(5px);
        }
        .emoji {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🚀 AI Career Agent Coach</div>
        <h1>Coming Soon</h1>
        <p>We're building something amazing to help you advance your career with AI-powered tools and intelligent guidance.</p>
        
        <div class="features">
            <div class="feature">
                <div class="emoji">🤖</div>
                <div>AI Resume Analysis</div>
            </div>
            <div class="feature">
                <div class="emoji">💼</div>
                <div>Smart Job Matching</div>
            </div>
            <div class="feature">
                <div class="emoji">📝</div>
                <div>Cover Letter Generator</div>
            </div>
            <div class="feature">
                <div class="emoji">🎯</div>
                <div>Interview Preparation</div>
            </div>
        </div>
        
        <div class="coming-soon">
            AI-Powered Career Advancement Platform
        </div>
    </div>
</body>
</html>`;

    // Upload 404.html
    console.log('   📄 Uploading 404.html...');
    await s3Client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: '404.html',
      Body: custom404Html,
      ContentType: 'text/html',
      CacheControl: 'max-age=300'
    }));
    console.log('   ✅ 404.html uploaded successfully!');

    // Upload index.html (same content for now)
    console.log('   📄 Uploading index.html...');
    await s3Client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: 'index.html',
      Body: custom404Html,
      ContentType: 'text/html',
      CacheControl: 'max-age=300'
    }));
    console.log('   ✅ index.html uploaded successfully!');

    // Step 4: Configure website hosting
    console.log('\n3️⃣ Configuring website hosting...');
    await s3Client.send(new PutBucketWebsiteCommand({
      Bucket: bucketName,
      WebsiteConfiguration: {
        IndexDocument: {
          Suffix: 'index.html'
        },
        ErrorDocument: {
          Key: '404.html'
        }
      }
    }));
    console.log('   ✅ Website hosting configured!');

    // Step 5: Set bucket policy for public read access
    console.log('\n4️⃣ Setting public read policy...');
    const bucketPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicReadGetObject',
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: `arn:aws:s3:::${bucketName}/*`
        }
      ]
    };

    await s3Client.send(new PutBucketPolicyCommand({
      Bucket: bucketName,
      Policy: JSON.stringify(bucketPolicy)
    }));
    console.log('   ✅ Public read policy set!');

    // Step 6: Success message
    const websiteUrl = `http://${bucketName}.s3-website-${region}.amazonaws.com`;
    
    console.log('\n🎉 SUCCESS! Your website is now live!');
    console.log(`🌐 Website URL: ${websiteUrl}`);
    console.log(`🔗 Test 404 page: ${websiteUrl}/nonexistent-page`);
    
    console.log('\n✨ What visitors will see:');
    console.log('   • Beautiful "Coming Soon" page with Career Copilot branding');
    console.log('   • Professional gradient design with animations');
    console.log('   • Feature highlights (AI Resume, Job Matching, etc.)');
    console.log('   • No technical AWS errors');
    console.log('   • Same page for both main site and 404 errors');
    
    console.log('\n🎯 Next Steps:');
    console.log('   1. Visit the URL above to see your live site');
    console.log('   2. Your site now looks professional and intentional');
    console.log('   3. When ready to launch, replace with your React build');
    console.log('   4. The custom 404 page will handle any missing pages');
    
  } catch (error) {
    console.log('❌ Error setting up website:', error.message);
    
    if (error.name === 'AccessDenied') {
      console.log('\n💡 You need additional S3 permissions. Update your IAM policy with:');
      console.log('   • s3:CreateBucket');
      console.log('   • s3:PutObject');
      console.log('   • s3:PutBucketWebsite');
      console.log('   • s3:PutBucketPolicy');
      console.log('   • s3:GetBucketLocation');
    } else if (error.name === 'BucketAlreadyExists') {
      console.log('💡 Bucket name already taken. Try a different name.');
    }
  }
}

setupS3Website().catch(console.error);
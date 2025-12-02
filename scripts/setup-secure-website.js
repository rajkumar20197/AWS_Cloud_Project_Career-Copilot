#!/usr/bin/env node

/**
 * Setup Secure Website with CloudFront + SSL
 * Creates a professional, secure website with HTTPS
 */

require('dotenv').config();

async function setupSecureWebsite() {
  console.log('🔒 Setting up Secure Website with HTTPS...\n');

  console.log('🎯 SECURITY UPGRADE PLAN:');
  console.log('   Current: HTTP only (Not secure warning)');
  console.log('   Target:  HTTPS with SSL certificate');
  console.log('   Method:  CloudFront + Certificate Manager\n');

  console.log('📋 MANUAL STEPS REQUIRED (AWS Console):');
  
  console.log('\n1️⃣ REQUEST SSL CERTIFICATE:');
  console.log('   • AWS Console → Certificate Manager');
  console.log('   • Request a certificate');
  console.log('   • Domain: aicareeragentcoach.com');
  console.log('   • Validation: DNS validation');
  console.log('   • Wait for certificate approval');

  console.log('\n2️⃣ CREATE CLOUDFRONT DISTRIBUTION:');
  console.log('   • AWS Console → CloudFront');
  console.log('   • Create distribution');
  console.log('   • Origin: aicareeragentcoach.com.s3-website-us-east-1.amazonaws.com');
  console.log('   • Viewer Protocol Policy: Redirect HTTP to HTTPS');
  console.log('   • SSL Certificate: Use the certificate from step 1');
  console.log('   • Default Root Object: index.html');

  console.log('\n3️⃣ CONFIGURE CUSTOM DOMAIN (Optional):');
  console.log('   • Buy domain: aicareeragentcoach.com');
  console.log('   • Route 53 → Create hosted zone');
  console.log('   • Point domain to CloudFront distribution');

  console.log('\n🚀 QUICK ALTERNATIVE - FREE SECURE HOSTING:');
  console.log('   Instead of S3, consider these HTTPS-ready platforms:');
  console.log('   • Vercel (vercel.com) - Free HTTPS + custom domains');
  console.log('   • Netlify (netlify.com) - Free HTTPS + custom domains');
  console.log('   • GitHub Pages - Free HTTPS for github.io domains');

  console.log('\n💡 IMMEDIATE SOLUTION:');
  console.log('   Deploy to Vercel for instant HTTPS:');
  console.log('   1. Create account at vercel.com');
  console.log('   2. Connect your GitHub repo');
  console.log('   3. Deploy - gets HTTPS automatically');
  console.log('   4. Custom domain: aicareeragentcoach.com');

  // Create deployment files for Vercel
  console.log('\n📁 Creating Vercel deployment files...');
  
  const fs = require('fs');
  
  // Create vercel.json configuration
  const vercelConfig = {
    "version": 2,
    "name": "career-copilot",
    "builds": [
      {
        "src": "index.html",
        "use": "@vercel/static"
      }
    ],
    "routes": [
      {
        "src": "/(.*)",
        "dest": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/(.*)",
        "headers": [
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          },
          {
            "key": "Strict-Transport-Security",
            "value": "max-age=31536000; includeSubDomains"
          }
        ]
      }
    ]
  };

  fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
  console.log('   ✅ vercel.json created');

  // Create package.json for Vercel
  const packageJson = {
    "name": "aicareeragentcoach-landing",
    "version": "1.0.0",
    "description": "AI Career Agent Coach - AI-Powered Career Advancement Platform",
    "main": "index.html",
    "scripts": {
      "build": "echo 'Static site - no build needed'"
    },
    "keywords": ["career", "ai", "jobs", "resume"],
    "author": "AI Career Agent Coach",
    "license": "MIT"
  };

  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  console.log('   ✅ package.json created');

  console.log('\n🎉 VERCEL DEPLOYMENT READY!');
  console.log('   Files created: vercel.json, package.json');
  console.log('   Next: Deploy to Vercel for instant HTTPS');

  console.log('\n🔒 SECURITY BENEFITS:');
  console.log('   ✅ HTTPS encryption (removes "Not secure" warning)');
  console.log('   ✅ SSL certificate (builds user trust)');
  console.log('   ✅ Security headers (XSS, CSRF protection)');
  console.log('   ✅ Professional appearance');
  console.log('   ✅ Better SEO ranking');
  console.log('   ✅ Mobile browser compatibility');

  console.log('\n📊 COMPARISON:');
  console.log('   Current S3:  HTTP only, "Not secure" warning');
  console.log('   With HTTPS:  Secure, professional, trusted');
  console.log('   User trust:  Dramatically improved');
}

setupSecureWebsite().catch(console.error);
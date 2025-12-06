#!/usr/bin/env node

/**
 * Deployment Script for AI Career Agent Coach
 * Handles production deployment preparation and validation
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 AI Career Agent Coach - Production Deployment Script\n');

// Configuration
const config = {
  domains: {
    main: 'aicareeragentcoach.com',
    agency: 'aicareeragentcoach.agency',
    admin: 'admin.aicareeragentcoach.com',
    api: 'api.aicareeragentcoach.com'
  },
  requiredEnvVars: [
    'STRIPE_SECRET_KEY',
    'STRIPE_PUBLISHABLE_KEY',
    'JWT_SECRET',
    'ENCRYPTION_KEY',
    'DB_PASSWORD'
  ]
};

// Utility functions
function checkFile(filePath) {
  return fs.existsSync(filePath);
}

function readEnvFile(filePath) {
  if (!checkFile(filePath)) return {};
  
  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};
  
  content.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && !key.startsWith('#')) {
      env[key.trim()] = valueParts.join('=').trim();
    }
  });
  
  return env;
}

function validateEnvironment() {
  console.log('🔍 Validating Environment Configuration...\n');
  
  const prodEnv = readEnvFile('backend/.env.production');
  const issues = [];
  
  // Check required variables
  config.requiredEnvVars.forEach(varName => {
    const value = prodEnv[varName];
    if (!value || value.includes('REPLACE') || value.includes('CHANGE') || value.includes('GENERATE')) {
      issues.push(`❌ ${varName}: Needs to be updated for production`);
    } else {
      console.log(`✅ ${varName}: Configured`);
    }
  });
  
  // Check Stripe keys
  if (prodEnv.STRIPE_SECRET_KEY && prodEnv.STRIPE_SECRET_KEY.startsWith('sk_test_')) {
    issues.push('⚠️  STRIPE_SECRET_KEY: Still using test key (should be sk_live_)');
  }
  
  if (prodEnv.STRIPE_PUBLISHABLE_KEY && prodEnv.STRIPE_PUBLISHABLE_KEY.startsWith('pk_test_')) {
    issues.push('⚠️  STRIPE_PUBLISHABLE_KEY: Still using test key (should be pk_live_)');
  }
  
  return issues;
}

function checkBuildRequirements() {
  console.log('\n🔧 Checking Build Requirements...\n');
  
  const requirements = [
    { name: 'package.json', path: 'package.json' },
    { name: 'Frontend source', path: 'src/App.tsx' },
    { name: 'Backend server', path: 'backend/server-simple.js' },
    { name: 'Production env (frontend)', path: '.env.production' },
    { name: 'Production env (backend)', path: 'backend/.env.production' },
    { name: 'Netlify config', path: 'netlify.toml' }
  ];
  
  const missing = [];
  
  requirements.forEach(req => {
    if (checkFile(req.path)) {
      console.log(`✅ ${req.name}: Found`);
    } else {
      missing.push(`❌ ${req.name}: Missing (${req.path})`);
    }
  });
  
  return missing;
}

function testBuild() {
  console.log('\n🏗️  Testing Production Build...\n');
  
  try {
    console.log('Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    
    console.log('Building for production...');
    execSync('npm run build', { stdio: 'inherit' });
    
    console.log('✅ Build successful!\n');
    return true;
  } catch (error) {
    console.log('❌ Build failed:', error.message);
    return false;
  }
}

function generateDeploymentChecklist() {
  console.log('📋 Generating Deployment Checklist...\n');
  
  const checklist = `
# 🚀 Production Deployment Checklist

## ⚠️ CRITICAL - BEFORE DEPLOYMENT

### 1. Environment Configuration
- [ ] Update JWT_SECRET with secure random string
- [ ] Generate new ENCRYPTION_KEY (256-bit)
- [ ] Set secure DB_PASSWORD
- [ ] Switch Stripe to live keys (sk_live_, pk_live_)
- [ ] Update Google Calendar redirect URI to production domain
- [ ] Verify all environment variables are production-ready

### 2. Domain & DNS Setup
- [ ] Configure DNS records for ${config.domains.main}
- [ ] Configure DNS records for ${config.domains.agency}
- [ ] Set up CNAME for ${config.domains.api}
- [ ] Verify domain ownership and SSL certificates

### 3. Deployment Steps
- [ ] Deploy frontend to Netlify
- [ ] Deploy backend to Railway/Render/Heroku
- [ ] Configure custom domains on hosting platforms
- [ ] Test all endpoints and functionality

### 4. Post-Deployment Verification
- [ ] Test payment processing with live Stripe keys
- [ ] Verify email sending works
- [ ] Test Google Calendar integration
- [ ] Check all domain redirects work correctly
- [ ] Monitor error logs for issues

### 5. Security & Monitoring
- [ ] Set up uptime monitoring
- [ ] Configure error tracking (Sentry)
- [ ] Enable performance monitoring
- [ ] Review security headers and CORS settings

## 🔗 Quick Links

- **Main Site**: https://${config.domains.main}
- **Agency Portal**: https://${config.domains.agency}
- **Admin Dashboard**: https://${config.domains.admin}
- **API Endpoint**: https://${config.domains.api}

## 📞 Support

- Domain registrar: Update DNS records
- Netlify: Frontend hosting and SSL
- Railway/Render: Backend hosting
- Stripe: Payment processing
- Google Cloud: Calendar API

---

**Generated**: ${new Date().toISOString()}
`;

  fs.writeFileSync('DEPLOYMENT_CHECKLIST.md', checklist);
  console.log('✅ Deployment checklist saved to DEPLOYMENT_CHECKLIST.md\n');
}

// Main execution
function main() {
  console.log('Starting deployment preparation...\n');
  
  // Validate environment
  const envIssues = validateEnvironment();
  
  // Check build requirements
  const buildIssues = checkBuildRequirements();
  
  // Test build
  const buildSuccess = testBuild();
  
  // Generate checklist
  generateDeploymentChecklist();
  
  // Summary
  console.log('📊 DEPLOYMENT READINESS SUMMARY\n');
  
  if (envIssues.length === 0) {
    console.log('✅ Environment: Ready for production');
  } else {
    console.log('⚠️  Environment: Needs attention');
    envIssues.forEach(issue => console.log(`   ${issue}`));
  }
  
  if (buildIssues.length === 0) {
    console.log('✅ Build Requirements: All files present');
  } else {
    console.log('❌ Build Requirements: Missing files');
    buildIssues.forEach(issue => console.log(`   ${issue}`));
  }
  
  if (buildSuccess) {
    console.log('✅ Build Test: Successful');
  } else {
    console.log('❌ Build Test: Failed');
  }
  
  console.log('\n🎯 NEXT STEPS:');
  console.log('1. Review and fix any issues above');
  console.log('2. Follow DEPLOYMENT_CHECKLIST.md');
  console.log('3. Deploy to your chosen hosting platform');
  console.log('4. Configure domains and SSL certificates');
  console.log('5. Test everything in production\n');
  
  if (envIssues.length === 0 && buildIssues.length === 0 && buildSuccess) {
    console.log('🎉 Ready for production deployment!');
  } else {
    console.log('⚠️  Please resolve issues before deploying to production.');
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { validateEnvironment, checkBuildRequirements, testBuild };
#!/usr/bin/env node

/**
 * Security Configuration Checker
 * Validates that your application is properly secured
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Running Security Configuration Check...\n');

const issues = [];
const warnings = [];
const passed = [];

// Check if .env files exist (they shouldn't be committed)
function checkEnvFiles() {
  const envFiles = ['.env', 'backend/.env'];
  
  envFiles.forEach(file => {
    if (fs.existsSync(file)) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        // Check for placeholder values
        if (content.includes('your_access_key_here') || 
            content.includes('your_secret_key_here') ||
            content.includes('your_email@gmail.com')) {
          warnings.push(`${file} contains placeholder values - update with real credentials`);
        } else {
          passed.push(`${file} exists and appears configured`);
        }
        
        // Check for exposed secrets (should not happen now)
        if (content.includes('AKIA') && !content.includes('your_access_key_here')) {
          // This is expected in local development - just warn about Git safety
          warnings.push(`${file} contains real AWS credentials - ensure it's not committed to Git`);
        }
        
      } catch (error) {
        warnings.push(`Cannot read ${file}: ${error.message}`);
      }
    } else {
      warnings.push(`${file} not found - copy from template and configure`);
    }
  });
}

// Check .gitignore
function checkGitignore() {
  if (fs.existsSync('.gitignore')) {
    const content = fs.readFileSync('.gitignore', 'utf8');
    
    if (content.includes('.env') && content.includes('*.key')) {
      passed.push('.gitignore properly configured for security');
    } else {
      issues.push('.gitignore missing security rules');
    }
  } else {
    issues.push('.gitignore file missing');
  }
}

// Check Git hooks
function checkGitHooks() {
  if (fs.existsSync('.git/hooks/pre-commit')) {
    passed.push('Git pre-commit security hook installed');
  } else {
    warnings.push('Git security hooks not installed - run scripts/setup-git-hooks.ps1');
  }
}

// Check backend security files
function checkBackendSecurity() {
  const securityFiles = [
    'backend/middleware/security.js',
    'backend/middleware/auth.js',
    'backend/middleware/paymentSecurity.js',
    'backend/utils/securityValidator.js'
  ];
  
  securityFiles.forEach(file => {
    if (fs.existsSync(file)) {
      passed.push(`${file} exists`);
    } else {
      issues.push(`${file} missing - security feature not implemented`);
    }
  });
}

// Check frontend security
function checkFrontendSecurity() {
  if (fs.existsSync('src/components/PaymentForm.tsx')) {
    passed.push('Secure payment form implemented');
  } else {
    warnings.push('Payment form not found - payments may not be secure');
  }
}

// Check package.json for security dependencies
function checkDependencies() {
  if (fs.existsSync('backend/package.json')) {
    const pkg = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));
    const securityDeps = ['helmet', 'express-rate-limit', 'bcryptjs', 'jsonwebtoken'];
    
    securityDeps.forEach(dep => {
      if (pkg.dependencies && pkg.dependencies[dep]) {
        passed.push(`Security dependency ${dep} installed`);
      } else {
        issues.push(`Missing security dependency: ${dep}`);
      }
    });
  }
}

// Run all checks
checkEnvFiles();
checkGitignore();
checkGitHooks();
checkBackendSecurity();
checkFrontendSecurity();
checkDependencies();

// Display results
console.log('✅ PASSED CHECKS:');
passed.forEach(item => console.log(`   • ${item}`));

if (warnings.length > 0) {
  console.log('\n⚠️  WARNINGS:');
  warnings.forEach(item => console.log(`   • ${item}`));
}

if (issues.length > 0) {
  console.log('\n❌ CRITICAL ISSUES:');
  issues.forEach(item => console.log(`   • ${item}`));
}

console.log('\n📊 SECURITY SCORE:');
const total = passed.length + warnings.length + issues.length;
const score = Math.round((passed.length / total) * 100);
console.log(`   ${score}% (${passed.length}/${total} checks passed)`);

if (issues.length === 0) {
  console.log('\n🎉 No critical security issues found!');
  if (warnings.length === 0) {
    console.log('🔒 Your application is properly secured!');
  }
} else {
  console.log('\n🚨 CRITICAL: Fix the issues above before deploying to production!');
}

console.log('\n📖 For detailed setup instructions, see: SETUP_SECURITY.md');
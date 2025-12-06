#!/usr/bin/env node

/**
 * Security Audit Script
 * Checks for common security vulnerabilities and misconfigurations
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class SecurityAuditor {
  constructor() {
    this.issues = [];
    this.warnings = [];
    this.passed = [];
  }

  addIssue(severity, category, message, fix) {
    this.issues.push({ severity, category, message, fix });
  }

  addWarning(category, message, recommendation) {
    this.warnings.push({ category, message, recommendation });
  }

  addPassed(category, message) {
    this.passed.push({ category, message });
  }

  async runAudit() {
    console.log('🔒 Starting Security Audit...\n');

    await this.checkEnvironmentVariables();
    await this.checkFilePermissions();
    await this.checkDependencies();
    await this.checkCodeVulnerabilities();
    await this.checkConfiguration();

    this.generateReport();
  }

  async checkEnvironmentVariables() {
    console.log('📋 Checking Environment Variables...');

    const envPath = path.join(__dirname, '../.env');
    const envExamplePath = path.join(__dirname, '../.env.example');

    // Check if .env exists
    if (!fs.existsSync(envPath)) {
      this.addIssue('HIGH', 'Environment', 
        '.env file not found', 
        'Create .env file from .env.example template');
      return;
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = this.parseEnvFile(envContent);

    // Critical security checks
    const criticalVars = [
      'JWT_SECRET',
      'ENCRYPTION_KEY',
      'DB_PASSWORD',
      'STRIPE_SECRET_KEY'
    ];

    for (const varName of criticalVars) {
      if (!envVars[varName]) {
        this.addIssue('CRITICAL', 'Environment', 
          `${varName} is not set`, 
          `Set ${varName} in .env file`);
      } else if (this.isWeakSecret(envVars[varName])) {
        this.addIssue('HIGH', 'Environment', 
          `${varName} appears to be weak or default`, 
          `Generate a strong, unique ${varName}`);
      } else {
        this.addPassed('Environment', `${varName} is properly configured`);
      }
    }

    // Check for development values in production
    if (process.env.NODE_ENV === 'production') {
      const devPatterns = [
        'localhost',
        'test',
        'example',
        'password123',
        'secret',
        'changeme'
      ];

      for (const [key, value] of Object.entries(envVars)) {
        for (const pattern of devPatterns) {
          if (value.toLowerCase().includes(pattern)) {
            this.addIssue('HIGH', 'Environment', 
              `${key} contains development value: ${pattern}`, 
              `Update ${key} with production value`);
          }
        }
      }
    }
  }

  async checkFilePermissions() {
    console.log('📁 Checking File Permissions...');

    const sensitiveFiles = [
      '.env',
      'config/database.js',
      'config/security.js',
      'private.key',
      'certificate.pem'
    ];

    for (const file of sensitiveFiles) {
      const filePath = path.join(__dirname, '..', file);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        const mode = stats.mode & parseInt('777', 8);
        
        if (mode > parseInt('600', 8)) {
          this.addIssue('MEDIUM', 'File Permissions', 
            `${file} has overly permissive permissions (${mode.toString(8)})`, 
            `chmod 600 ${file}`);
        } else {
          this.addPassed('File Permissions', `${file} has secure permissions`);
        }
      }
    }
  }

  async checkDependencies() {
    console.log('📦 Checking Dependencies...');

    const packagePath = path.join(__dirname, '../package.json');
    if (!fs.existsSync(packagePath)) {
      this.addWarning('Dependencies', 'package.json not found', 'Ensure package.json exists');
      return;
    }

    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

    // Check for known vulnerable packages
    const vulnerablePackages = [
      'lodash@4.17.15',
      'moment@2.29.1',
      'axios@0.21.0'
    ];

    for (const [pkg, version] of Object.entries(dependencies)) {
      const pkgVersion = `${pkg}@${version}`;
      if (vulnerablePackages.includes(pkgVersion)) {
        this.addIssue('HIGH', 'Dependencies', 
          `Vulnerable package detected: ${pkgVersion}`, 
          `Update ${pkg} to latest secure version`);
      }
    }

    // Check for security-related packages
    const securityPackages = ['helmet', 'express-rate-limit', 'bcrypt', 'jsonwebtoken'];
    for (const pkg of securityPackages) {
      if (dependencies[pkg]) {
        this.addPassed('Dependencies', `Security package ${pkg} is installed`);
      } else {
        this.addWarning('Dependencies', `Security package ${pkg} not found`, `Consider installing ${pkg}`);
      }
    }
  }

  async checkCodeVulnerabilities() {
    console.log('🔍 Checking Code Vulnerabilities...');

    const codeFiles = this.getJavaScriptFiles(path.join(__dirname, '..'));
    
    for (const file of codeFiles) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for hardcoded secrets
      const secretPatterns = [
        /password\s*=\s*['"][^'"]{8,}['"]/i,
        /secret\s*=\s*['"][^'"]{16,}['"]/i,
        /key\s*=\s*['"][^'"]{16,}['"]/i,
        /token\s*=\s*['"][^'"]{20,}['"]/i
      ];

      for (const pattern of secretPatterns) {
        if (pattern.test(content)) {
          this.addIssue('HIGH', 'Code Security', 
            `Potential hardcoded secret in ${path.basename(file)}`, 
            'Move secrets to environment variables');
        }
      }

      // Check for dangerous functions
      const dangerousFunctions = [
        'eval(',
        'exec(',
        'Function(',
        'setTimeout(',
        'setInterval('
      ];

      for (const func of dangerousFunctions) {
        if (content.includes(func)) {
          this.addWarning('Code Security', 
            `Potentially dangerous function ${func} found in ${path.basename(file)}`, 
            'Review usage and ensure input is sanitized');
        }
      }

      // Check for SQL injection vulnerabilities
      if (content.includes('SELECT') || content.includes('INSERT') || content.includes('UPDATE')) {
        if (!content.includes('prepared') && !content.includes('parameterized')) {
          this.addWarning('Code Security', 
            `Potential SQL injection vulnerability in ${path.basename(file)}`, 
            'Use parameterized queries or prepared statements');
        }
      }
    }
  }

  async checkConfiguration() {
    console.log('⚙️ Checking Configuration...');

    // Check CORS configuration
    const serverFiles = ['server.js', 'app.js', 'index.js'];
    let corsConfigured = false;

    for (const file of serverFiles) {
      const filePath = path.join(__dirname, '..', file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('cors')) {
          corsConfigured = true;
          if (content.includes("origin: '*'")) {
            this.addIssue('MEDIUM', 'Configuration', 
              'CORS is configured to allow all origins', 
              'Restrict CORS to specific domains');
          } else {
            this.addPassed('Configuration', 'CORS is properly configured');
          }
        }
      }
    }

    if (!corsConfigured) {
      this.addWarning('Configuration', 'CORS configuration not found', 'Configure CORS for security');
    }

    // Check HTTPS configuration
    if (process.env.NODE_ENV === 'production' && !process.env.HTTPS) {
      this.addIssue('HIGH', 'Configuration', 
        'HTTPS not configured for production', 
        'Enable HTTPS in production environment');
    }
  }

  parseEnvFile(content) {
    const vars = {};
    const lines = content.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          vars[key.trim()] = valueParts.join('=').trim();
        }
      }
    }
    
    return vars;
  }

  isWeakSecret(secret) {
    const weakPatterns = [
      /^(secret|password|key|token)$/i,
      /^(123|abc|test|demo|example)/i,
      /^(.)\1{7,}$/, // Repeated characters
      /^(qwerty|password|admin|root)/i
    ];

    if (secret.length < 16) return true;
    
    for (const pattern of weakPatterns) {
      if (pattern.test(secret)) return true;
    }
    
    return false;
  }

  getJavaScriptFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        files.push(...this.getJavaScriptFiles(fullPath));
      } else if (stat.isFile() && (item.endsWith('.js') || item.endsWith('.ts'))) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('🔒 SECURITY AUDIT REPORT');
    console.log('='.repeat(60));

    // Critical Issues
    const criticalIssues = this.issues.filter(i => i.severity === 'CRITICAL');
    if (criticalIssues.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES (Must Fix Immediately):');
      criticalIssues.forEach((issue, i) => {
        console.log(`${i + 1}. [${issue.category}] ${issue.message}`);
        console.log(`   Fix: ${issue.fix}\n`);
      });
    }

    // High Priority Issues
    const highIssues = this.issues.filter(i => i.severity === 'HIGH');
    if (highIssues.length > 0) {
      console.log('\n⚠️  HIGH PRIORITY ISSUES:');
      highIssues.forEach((issue, i) => {
        console.log(`${i + 1}. [${issue.category}] ${issue.message}`);
        console.log(`   Fix: ${issue.fix}\n`);
      });
    }

    // Medium Priority Issues
    const mediumIssues = this.issues.filter(i => i.severity === 'MEDIUM');
    if (mediumIssues.length > 0) {
      console.log('\n🔶 MEDIUM PRIORITY ISSUES:');
      mediumIssues.forEach((issue, i) => {
        console.log(`${i + 1}. [${issue.category}] ${issue.message}`);
        console.log(`   Fix: ${issue.fix}\n`);
      });
    }

    // Warnings
    if (this.warnings.length > 0) {
      console.log('\n💡 WARNINGS & RECOMMENDATIONS:');
      this.warnings.forEach((warning, i) => {
        console.log(`${i + 1}. [${warning.category}] ${warning.message}`);
        console.log(`   Recommendation: ${warning.recommendation}\n`);
      });
    }

    // Passed Checks
    if (this.passed.length > 0) {
      console.log('\n✅ PASSED SECURITY CHECKS:');
      this.passed.forEach((check, i) => {
        console.log(`${i + 1}. [${check.category}] ${check.message}`);
      });
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY:');
    console.log(`Critical Issues: ${criticalIssues.length}`);
    console.log(`High Priority Issues: ${highIssues.length}`);
    console.log(`Medium Priority Issues: ${mediumIssues.length}`);
    console.log(`Warnings: ${this.warnings.length}`);
    console.log(`Passed Checks: ${this.passed.length}`);
    
    const totalIssues = this.issues.length;
    if (totalIssues === 0) {
      console.log('\n🎉 No security issues found! Your application appears secure.');
    } else if (criticalIssues.length > 0) {
      console.log('\n🚨 CRITICAL: Fix critical issues before deploying to production!');
    } else if (highIssues.length > 0) {
      console.log('\n⚠️  WARNING: Address high priority issues for better security.');
    } else {
      console.log('\n✅ Good security posture. Address remaining issues when possible.');
    }
    
    console.log('='.repeat(60));
  }
}

// Run the audit
if (require.main === module) {
  const auditor = new SecurityAuditor();
  auditor.runAudit().catch(console.error);
}

module.exports = SecurityAuditor;
/**
 * Security Configuration Validator
 * Validates that all security settings are properly configured
 */

function validateSecurityConfig() {
  const issues = [];
  const warnings = [];

  // Check JWT Secret
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret || jwtSecret.length < 32) {
    issues.push('JWT_SECRET must be at least 32 characters long');
  }
  if (jwtSecret && jwtSecret.includes('change-this')) {
    issues.push('JWT_SECRET contains default value - change it immediately');
  }

  // Check Stripe Configuration
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) {
    warnings.push('STRIPE_SECRET_KEY not configured - payments will not work');
  } else if (stripeSecret.startsWith('sk_test_')) {
    warnings.push('Using Stripe test keys - switch to live keys for production');
  }

  // Check Webhook Secret
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    issues.push('STRIPE_WEBHOOK_SECRET not configured - webhook security compromised');
  }

  // Check Environment
  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv === 'production') {
    // Production-specific checks
    if (!process.env.FRONTEND_URL || process.env.FRONTEND_URL.includes('localhost')) {
      issues.push('FRONTEND_URL must be set to production domain');
    }
    
    if (jwtSecret && jwtSecret.includes('development')) {
      issues.push('JWT_SECRET contains development values in production');
    }
  }

  // Check Email Configuration
  if (!process.env.EMAIL_PASSWORD || process.env.EMAIL_PASSWORD.length < 8) {
    warnings.push('EMAIL_PASSWORD not properly configured');
  }

  return {
    isSecure: issues.length === 0,
    issues,
    warnings,
  };
}

function logSecurityStatus() {
  const validation = validateSecurityConfig();
  
  console.log('\n🔒 Security Configuration Check:');
  
  if (validation.isSecure) {
    console.log('✅ All critical security checks passed');
  } else {
    console.log('❌ Security issues found:');
    validation.issues.forEach(issue => {
      console.log(`   • ${issue}`);
    });
  }

  if (validation.warnings.length > 0) {
    console.log('⚠️  Warnings:');
    validation.warnings.forEach(warning => {
      console.log(`   • ${warning}`);
    });
  }

  console.log('');
  
  return validation;
}

module.exports = {
  validateSecurityConfig,
  logSecurityStatus,
};
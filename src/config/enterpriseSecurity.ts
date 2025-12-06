export interface SecurityConfig {
  encryption: {
    algorithm: string;
    keyLength: number;
    saltRounds: number;
  };
  authentication: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
    requireMFA: boolean;
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
      maxAge: number;
    };
  };
  authorization: {
    roles: string[];
    permissions: Record<string, string[]>;
  };
  audit: {
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    retentionDays: number;
    sensitiveFields: string[];
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
    skipSuccessfulRequests: boolean;
  };
  cors: {
    allowedOrigins: string[];
    allowedMethods: string[];
    allowedHeaders: string[];
    credentials: boolean;
  };
  headers: {
    contentSecurityPolicy: string;
    strictTransportSecurity: string;
    xFrameOptions: string;
    xContentTypeOptions: string;
    referrerPolicy: string;
  };
}

export const enterpriseSecurityConfig: SecurityConfig = {
  encryption: {
    algorithm: 'AES-256-GCM',
    keyLength: 256,
    saltRounds: 12,
  },
  authentication: {
    sessionTimeout: 3600000, // 1 hour
    maxLoginAttempts: 5,
    lockoutDuration: 900000, // 15 minutes
    requireMFA: true,
    passwordPolicy: {
      minLength: 12,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      maxAge: 7776000000, // 90 days
    },
  },
  authorization: {
    roles: ['super_admin', 'admin', 'moderator', 'user', 'guest'],
    permissions: {
      super_admin: ['*'],
      admin: [
        'users:read',
        'users:write',
        'users:delete',
        'payments:read',
        'payments:write',
        'system:read',
        'system:write',
        'security:read',
        'security:write',
      ],
      moderator: [
        'users:read',
        'users:write',
        'security:read',
      ],
      user: [
        'profile:read',
        'profile:write',
        'applications:read',
        'applications:write',
      ],
      guest: [
        'public:read',
      ],
    },
  },
  audit: {
    logLevel: 'info',
    retentionDays: 365,
    sensitiveFields: [
      'password',
      'ssn',
      'creditCard',
      'bankAccount',
      'apiKey',
      'token',
    ],
  },
  rateLimit: {
    windowMs: 900000, // 15 minutes
    maxRequests: 100,
    skipSuccessfulRequests: false,
  },
  cors: {
    allowedOrigins: [
      'https://aicareeragentcoach.com',
      'https://agency.aicareeragentcoach.com',
      'https://admin.aicareeragentcoach.com',
    ],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'X-CSRF-Token',
    ],
    credentials: true,
  },
  headers: {
    contentSecurityPolicy: `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://maps.googleapis.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      font-src 'self' https://fonts.gstatic.com;
      img-src 'self' data: https: blob:;
      connect-src 'self' https://api.stripe.com https://bedrock-runtime.*.amazonaws.com wss:;
      frame-src 'self' https://js.stripe.com https://hooks.stripe.com;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
    `.replace(/\s+/g, ' ').trim(),
    strictTransportSecurity: 'max-age=31536000; includeSubDomains; preload',
    xFrameOptions: 'DENY',
    xContentTypeOptions: 'nosniff',
    referrerPolicy: 'strict-origin-when-cross-origin',
  },
};

export class SecurityValidator {
  static validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const policy = enterpriseSecurityConfig.authentication.passwordPolicy;

    if (password.length < policy.minLength) {
      errors.push(`Password must be at least ${policy.minLength} characters long`);
    }

    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (policy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (policy.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (policy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/['"]/g, '') // Remove quotes
      .trim();
  }

  static maskSensitiveData(data: any): any {
    const masked = { ...data };
    const sensitiveFields = enterpriseSecurityConfig.audit.sensitiveFields;

    for (const field of sensitiveFields) {
      if (masked[field]) {
        masked[field] = '***MASKED***';
      }
    }

    return masked;
  }

  static validatePermission(userRole: string, requiredPermission: string): boolean {
    const permissions = enterpriseSecurityConfig.authorization.permissions[userRole];
    if (!permissions) return false;

    return permissions.includes('*') || permissions.includes(requiredPermission);
  }
}

export const securityHeaders = {
  'Content-Security-Policy': enterpriseSecurityConfig.headers.contentSecurityPolicy,
  'Strict-Transport-Security': enterpriseSecurityConfig.headers.strictTransportSecurity,
  'X-Frame-Options': enterpriseSecurityConfig.headers.xFrameOptions,
  'X-Content-Type-Options': enterpriseSecurityConfig.headers.xContentTypeOptions,
  'Referrer-Policy': enterpriseSecurityConfig.headers.referrerPolicy,
  'X-XSS-Protection': '1; mode=block',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
};
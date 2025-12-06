import { SecurityValidator, enterpriseSecurityConfig } from '../config/enterpriseSecurity';

interface SecurityEvent {
  id: string;
  timestamp: Date;
  type: 'login' | 'logout' | 'failed_login' | 'permission_denied' | 'data_access' | 'system_change';
  userId?: string;
  userEmail?: string;
  ipAddress: string;
  userAgent: string;
  details: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface ThreatDetection {
  suspiciousActivity: boolean;
  riskScore: number;
  reasons: string[];
  recommendedActions: string[];
}

class SecurityService {
  private events: SecurityEvent[] = [];
  private failedAttempts: Map<string, { count: number; lastAttempt: Date }> = new Map();

  async logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): Promise<void> {
    const securityEvent: SecurityEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: new Date(),
      details: SecurityValidator.maskSensitiveData(event.details),
    };

    this.events.push(securityEvent);

    // In production, send to security monitoring service
    if (process.env.NODE_ENV === 'production') {
      await this.sendToSecurityMonitoring(securityEvent);
    }

    console.log('Security Event:', securityEvent);
  }

  async validateLoginAttempt(email: string, ipAddress: string): Promise<{ allowed: boolean; reason?: string }> {
    const key = `${email}:${ipAddress}`;
    const attempts = this.failedAttempts.get(key);
    const config = enterpriseSecurityConfig.authentication;

    if (attempts && attempts.count >= config.maxLoginAttempts) {
      const timeSinceLastAttempt = Date.now() - attempts.lastAttempt.getTime();
      if (timeSinceLastAttempt < config.lockoutDuration) {
        await this.logSecurityEvent({
          type: 'failed_login',
          userEmail: email,
          ipAddress,
          userAgent: 'Unknown',
          details: { reason: 'Account locked due to too many failed attempts' },
          severity: 'high',
        });

        return {
          allowed: false,
          reason: `Account locked. Try again in ${Math.ceil((config.lockoutDuration - timeSinceLastAttempt) / 60000)} minutes.`,
        };
      } else {
        // Reset attempts after lockout period
        this.failedAttempts.delete(key);
      }
    }

    return { allowed: true };
  }

  async recordFailedLogin(email: string, ipAddress: string): Promise<void> {
    const key = `${email}:${ipAddress}`;
    const attempts = this.failedAttempts.get(key) || { count: 0, lastAttempt: new Date() };
    
    attempts.count++;
    attempts.lastAttempt = new Date();
    this.failedAttempts.set(key, attempts);

    await this.logSecurityEvent({
      type: 'failed_login',
      userEmail: email,
      ipAddress,
      userAgent: 'Unknown',
      details: { attemptCount: attempts.count },
      severity: attempts.count >= 3 ? 'high' : 'medium',
    });
  }

  async recordSuccessfulLogin(userId: string, email: string, ipAddress: string, userAgent: string): Promise<void> {
    const key = `${email}:${ipAddress}`;
    this.failedAttempts.delete(key); // Clear failed attempts on successful login

    await this.logSecurityEvent({
      type: 'login',
      userId,
      userEmail: email,
      ipAddress,
      userAgent,
      details: { loginMethod: 'password' },
      severity: 'low',
    });
  }

  async detectThreats(userId: string, ipAddress: string, userAgent: string): Promise<ThreatDetection> {
    const recentEvents = this.events.filter(
      event => event.userId === userId && 
      event.timestamp.getTime() > Date.now() - 3600000 // Last hour
    );

    let riskScore = 0;
    const reasons: string[] = [];
    const recommendedActions: string[] = [];

    // Check for multiple failed logins
    const failedLogins = recentEvents.filter(event => event.type === 'failed_login');
    if (failedLogins.length > 3) {
      riskScore += 30;
      reasons.push('Multiple failed login attempts');
      recommendedActions.push('Enable additional authentication factors');
    }

    // Check for unusual IP addresses
    const uniqueIPs = new Set(recentEvents.map(event => event.ipAddress));
    if (uniqueIPs.size > 3) {
      riskScore += 25;
      reasons.push('Access from multiple IP addresses');
      recommendedActions.push('Verify user location and device');
    }

    // Check for suspicious user agent patterns
    if (userAgent.includes('bot') || userAgent.includes('crawler')) {
      riskScore += 40;
      reasons.push('Suspicious user agent detected');
      recommendedActions.push('Block automated access attempts');
    }

    // Check for rapid successive requests
    const rapidRequests = recentEvents.filter(
      event => event.timestamp.getTime() > Date.now() - 300000 // Last 5 minutes
    );
    if (rapidRequests.length > 50) {
      riskScore += 35;
      reasons.push('Unusually high request frequency');
      recommendedActions.push('Implement rate limiting');
    }

    return {
      suspiciousActivity: riskScore > 50,
      riskScore,
      reasons,
      recommendedActions,
    };
  }

  async auditDataAccess(userId: string, resource: string, action: string, ipAddress: string): Promise<void> {
    await this.logSecurityEvent({
      type: 'data_access',
      userId,
      ipAddress,
      userAgent: 'Unknown',
      details: { resource, action },
      severity: 'low',
    });
  }

  async validatePermission(userId: string, userRole: string, requiredPermission: string): Promise<boolean> {
    const hasPermission = SecurityValidator.validatePermission(userRole, requiredPermission);

    if (!hasPermission) {
      await this.logSecurityEvent({
        type: 'permission_denied',
        userId,
        ipAddress: 'Unknown',
        userAgent: 'Unknown',
        details: { requiredPermission, userRole },
        severity: 'medium',
      });
    }

    return hasPermission;
  }

  async getSecurityEvents(filters?: {
    userId?: string;
    type?: string;
    severity?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<SecurityEvent[]> {
    let filteredEvents = [...this.events];

    if (filters) {
      if (filters.userId) {
        filteredEvents = filteredEvents.filter(event => event.userId === filters.userId);
      }
      if (filters.type) {
        filteredEvents = filteredEvents.filter(event => event.type === filters.type);
      }
      if (filters.severity) {
        filteredEvents = filteredEvents.filter(event => event.severity === filters.severity);
      }
      if (filters.startDate) {
        filteredEvents = filteredEvents.filter(event => event.timestamp >= filters.startDate!);
      }
      if (filters.endDate) {
        filteredEvents = filteredEvents.filter(event => event.timestamp <= filters.endDate!);
      }
    }

    return filteredEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async generateSecurityReport(): Promise<{
    summary: {
      totalEvents: number;
      criticalEvents: number;
      highRiskEvents: number;
      uniqueUsers: number;
      uniqueIPs: number;
    };
    topThreats: string[];
    recommendations: string[];
  }> {
    const events = await this.getSecurityEvents();
    const criticalEvents = events.filter(event => event.severity === 'critical');
    const highRiskEvents = events.filter(event => event.severity === 'high');
    const uniqueUsers = new Set(events.map(event => event.userId).filter(Boolean));
    const uniqueIPs = new Set(events.map(event => event.ipAddress));

    const threatCounts = events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topThreats = Object.entries(threatCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([threat]) => threat);

    const recommendations = [
      'Enable multi-factor authentication for all admin accounts',
      'Implement IP whitelisting for admin access',
      'Regular security audits and penetration testing',
      'Monitor and alert on suspicious login patterns',
      'Keep all systems and dependencies updated',
    ];

    return {
      summary: {
        totalEvents: events.length,
        criticalEvents: criticalEvents.length,
        highRiskEvents: highRiskEvents.length,
        uniqueUsers: uniqueUsers.size,
        uniqueIPs: uniqueIPs.size,
      },
      topThreats,
      recommendations,
    };
  }

  private generateEventId(): string {
    return `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async sendToSecurityMonitoring(event: SecurityEvent): Promise<void> {
    // In production, integrate with security monitoring services like:
    // - AWS CloudWatch
    // - Splunk
    // - DataDog
    // - Custom SIEM solution
    
    try {
      // Example implementation
      await fetch('/api/security/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error('Failed to send security event to monitoring service:', error);
    }
  }
}

export const securityService = new SecurityService();
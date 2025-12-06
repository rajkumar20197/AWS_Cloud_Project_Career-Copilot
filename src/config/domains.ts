export interface DomainConfig {
  name: string;
  url: string;
  type: 'consumer' | 'agency' | 'admin' | 'api';
  features: string[];
  theme: {
    primaryColor: string;
    secondaryColor: string;
    logo: string;
    favicon: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  analytics: {
    googleAnalyticsId?: string;
    facebookPixelId?: string;
    linkedInInsightTag?: string;
  };
}

export const domainConfigs: Record<string, DomainConfig> = {
  consumer: {
    name: 'AI Career Agent Coach',
    url: 'https://aicareeragentcoach.com',
    type: 'consumer',
    features: [
      'job-search',
      'resume-optimization',
      'interview-prep',
      'salary-negotiation',
      'career-coaching',
      'application-tracking',
    ],
    theme: {
      primaryColor: '#030213',
      secondaryColor: '#6366f1',
      logo: '/logo-consumer.svg',
      favicon: '/favicon-consumer.ico',
    },
    seo: {
      title: 'AI Career Agent Coach - Your Personal Career Assistant',
      description: 'Transform your career with AI-powered job search, resume optimization, interview preparation, and personalized career coaching.',
      keywords: [
        'AI career coach',
        'job search assistant',
        'resume optimization',
        'interview preparation',
        'career development',
        'job application tracking',
        'salary negotiation',
      ],
    },
    analytics: {
      googleAnalyticsId: 'G-XXXXXXXXXX',
      facebookPixelId: 'XXXXXXXXXX',
      linkedInInsightTag: 'XXXXXXXXXX',
    },
  },
  agency: {
    name: 'AI Career Agent Coach - Agency Portal',
    url: 'https://agency.aicareeragentcoach.com',
    type: 'agency',
    features: [
      'client-management',
      'bulk-operations',
      'white-label-branding',
      'analytics-dashboard',
      'team-collaboration',
      'custom-workflows',
    ],
    theme: {
      primaryColor: '#1e40af',
      secondaryColor: '#3b82f6',
      logo: '/logo-agency.svg',
      favicon: '/favicon-agency.ico',
    },
    seo: {
      title: 'AI Career Agent Coach - Agency Portal',
      description: 'Empower your recruitment agency with AI-driven tools for client management, candidate screening, and placement optimization.',
      keywords: [
        'recruitment agency software',
        'AI recruiting tools',
        'candidate management',
        'placement optimization',
        'recruitment automation',
        'agency dashboard',
      ],
    },
    analytics: {
      googleAnalyticsId: 'G-YYYYYYYYYY',
    },
  },
  admin: {
    name: 'AI Career Agent Coach - Admin Console',
    url: 'https://admin.aicareeragentcoach.com',
    type: 'admin',
    features: [
      'user-management',
      'system-monitoring',
      'security-controls',
      'payment-processing',
      'analytics-reporting',
      'configuration-management',
    ],
    theme: {
      primaryColor: '#dc2626',
      secondaryColor: '#ef4444',
      logo: '/logo-admin.svg',
      favicon: '/favicon-admin.ico',
    },
    seo: {
      title: 'AI Career Agent Coach - Admin Console',
      description: 'Administrative console for managing the AI Career Agent Coach platform.',
      keywords: ['admin', 'management', 'console'],
    },
    analytics: {
      googleAnalyticsId: 'G-ZZZZZZZZZZ',
    },
  },
  api: {
    name: 'AI Career Agent Coach API',
    url: 'https://api.aicareeragentcoach.com',
    type: 'api',
    features: [
      'rest-api',
      'graphql',
      'webhooks',
      'rate-limiting',
      'authentication',
      'documentation',
    ],
    theme: {
      primaryColor: '#059669',
      secondaryColor: '#10b981',
      logo: '/logo-api.svg',
      favicon: '/favicon-api.ico',
    },
    seo: {
      title: 'AI Career Agent Coach API',
      description: 'Developer API for integrating AI career coaching capabilities.',
      keywords: ['API', 'developer', 'integration', 'career coaching'],
    },
    analytics: {},
  },
};

export class DomainManager {
  static getCurrentDomain(): string {
    if (typeof window === 'undefined') return 'consumer';
    
    const hostname = window.location.hostname;
    
    if (hostname.includes('agency.')) return 'agency';
    if (hostname.includes('admin.')) return 'admin';
    if (hostname.includes('api.')) return 'api';
    
    return 'consumer';
  }

  static getCurrentConfig(): DomainConfig {
    const domain = this.getCurrentDomain();
    return domainConfigs[domain];
  }

  static getFeatures(): string[] {
    return this.getCurrentConfig().features;
  }

  static hasFeature(feature: string): boolean {
    return this.getFeatures().includes(feature);
  }

  static getTheme() {
    return this.getCurrentConfig().theme;
  }

  static getSEO() {
    return this.getCurrentConfig().seo;
  }

  static getAnalytics() {
    return this.getCurrentConfig().analytics;
  }

  static isConsumerDomain(): boolean {
    return this.getCurrentDomain() === 'consumer';
  }

  static isAgencyDomain(): boolean {
    return this.getCurrentDomain() === 'agency';
  }

  static isAdminDomain(): boolean {
    return this.getCurrentDomain() === 'admin';
  }

  static isAPIDomain(): boolean {
    return this.getCurrentDomain() === 'api';
  }

  static getNavigationItems() {
    const domain = this.getCurrentDomain();
    
    switch (domain) {
      case 'consumer':
        return [
          { label: 'Dashboard', href: '/dashboard', icon: 'home' },
          { label: 'Job Search', href: '/jobs', icon: 'search' },
          { label: 'Resume', href: '/resume', icon: 'file-text' },
          { label: 'Interviews', href: '/interviews', icon: 'video' },
          { label: 'Applications', href: '/applications', icon: 'briefcase' },
          { label: 'Settings', href: '/settings', icon: 'settings' },
        ];
      
      case 'agency':
        return [
          { label: 'Dashboard', href: '/dashboard', icon: 'home' },
          { label: 'Clients', href: '/clients', icon: 'users' },
          { label: 'Candidates', href: '/candidates', icon: 'user-check' },
          { label: 'Placements', href: '/placements', icon: 'target' },
          { label: 'Analytics', href: '/analytics', icon: 'bar-chart' },
          { label: 'Settings', href: '/settings', icon: 'settings' },
        ];
      
      case 'admin':
        return [
          { label: 'Dashboard', href: '/dashboard', icon: 'home' },
          { label: 'Users', href: '/users', icon: 'users' },
          { label: 'Security', href: '/security', icon: 'shield' },
          { label: 'Payments', href: '/payments', icon: 'credit-card' },
          { label: 'System', href: '/system', icon: 'server' },
          { label: 'Settings', href: '/settings', icon: 'settings' },
        ];
      
      default:
        return [];
    }
  }

  static getCrossDomainLinks() {
    const currentDomain = this.getCurrentDomain();
    const links = [];

    if (currentDomain !== 'consumer') {
      links.push({
        label: 'Consumer Portal',
        url: domainConfigs.consumer.url,
        description: 'Individual career coaching platform',
      });
    }

    if (currentDomain !== 'agency') {
      links.push({
        label: 'Agency Portal',
        url: domainConfigs.agency.url,
        description: 'Recruitment agency management tools',
      });
    }

    return links;
  }
}
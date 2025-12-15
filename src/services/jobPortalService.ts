// Real Job Portal Integration Service
// Connects to actual job APIs instead of mock data

interface JobPortalConfig {
  name: string;
  apiUrl: string;
  apiKey?: string;
  enabled: boolean;
}

interface RealJobData {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: { min: number; max: number };
  description: string;
  requirements: string[];
  postedDate: string;
  source: string;
  url: string;
}

class JobPortalService {
  private portals: JobPortalConfig[] = [
    {
      name: 'Indeed',
      apiUrl: 'https://api.indeed.com/ads/apisearch',
      enabled: true,
    },
    {
      name: 'LinkedIn',
      apiUrl: 'https://api.linkedin.com/v2/jobSearch',
      enabled: false, // Requires LinkedIn API access
    },
    {
      name: 'Glassdoor',
      apiUrl: 'https://api.glassdoor.com/api/api.htm',
      enabled: false, // Requires Glassdoor API key
    },
    {
      name: 'GitHub Jobs',
      apiUrl: 'https://jobs.github.com/positions.json',
      enabled: true,
    },
    {
      name: 'RemoteOK',
      apiUrl: 'https://remoteok.io/api',
      enabled: true,
    },
  ];

  async searchJobs(query: {
    keywords: string;
    location?: string;
    remote?: boolean;
    salaryMin?: number;
  }): Promise<RealJobData[]> {
    const allJobs: RealJobData[] = [];

    // Search across enabled portals
    for (const portal of this.portals.filter(p => p.enabled)) {
      try {
        const jobs = await this.searchPortal(portal, query);
        allJobs.push(...jobs);
      } catch (error) {
        console.warn(`Failed to search ${portal.name}:`, error);
      }
    }

    return this.deduplicateJobs(allJobs);
  }

  private async searchPortal(portal: JobPortalConfig, query: any): Promise<RealJobData[]> {
    switch (portal.name) {
      case 'Indeed':
        return this.searchIndeed(query);
      case 'GitHub Jobs':
        return this.searchGitHubJobs(query);
      case 'RemoteOK':
        return this.searchRemoteOK(query);
      default:
        return [];
    }
  }

  private async searchIndeed(query: any): Promise<RealJobData[]> {
    // Indeed API search (requires publisher ID)
    const params = new URLSearchParams({
      publisher: process.env.REACT_APP_INDEED_PUBLISHER_ID || 'demo',
      q: query.keywords,
      l: query.location || '',
      format: 'json',
      limit: '10',
      fromage: '7', // Last 7 days
    });

    try {
      const response = await fetch(`https://api.indeed.com/ads/apisearch?${params}`);
      const data = await response.json();
      
      return (data.results || []).map((job: any) => ({
        id: `indeed-${job.jobkey}`,
        title: job.jobtitle,
        company: job.company,
        location: job.formattedLocation,
        description: job.snippet,
        requirements: [],
        postedDate: job.date,
        source: 'Indeed',
        url: job.url,
      }));
    } catch (error) {
      console.error('Indeed API error:', error);
      return [];
    }
  }

  private async searchGitHubJobs(query: any): Promise<RealJobData[]> {
    // GitHub Jobs API (free, no auth required)
    const params = new URLSearchParams({
      description: query.keywords,
      location: query.location || '',
    });

    try {
      const response = await fetch(`https://jobs.github.com/positions.json?${params}`);
      const jobs = await response.json();
      
      return jobs.slice(0, 10).map((job: any) => ({
        id: `github-${job.id}`,
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        requirements: [],
        postedDate: job.created_at,
        source: 'GitHub Jobs',
        url: job.url,
      }));
    } catch (error) {
      console.error('GitHub Jobs API error:', error);
      return [];
    }
  }

  private async searchRemoteOK(query: any): Promise<RealJobData[]> {
    // RemoteOK API (free, no auth required)
    try {
      const response = await fetch('https://remoteok.io/api');
      const jobs = await response.json();
      
      // Filter jobs based on query
      const filteredJobs = jobs
        .filter((job: any) => job.position && job.company)
        .filter((job: any) => 
          query.keywords.toLowerCase().split(' ').some((keyword: string) =>
            job.position.toLowerCase().includes(keyword) ||
            job.tags?.some((tag: string) => tag.toLowerCase().includes(keyword))
          )
        )
        .slice(0, 10);

      return filteredJobs.map((job: any) => ({
        id: `remoteok-${job.id}`,
        title: job.position,
        company: job.company,
        location: 'Remote',
        salary: job.salary_min && job.salary_max ? {
          min: job.salary_min,
          max: job.salary_max
        } : undefined,
        description: job.description || '',
        requirements: job.tags || [],
        postedDate: new Date(job.date * 1000).toISOString(),
        source: 'RemoteOK',
        url: job.url,
      }));
    } catch (error) {
      console.error('RemoteOK API error:', error);
      return [];
    }
  }

  private deduplicateJobs(jobs: RealJobData[]): RealJobData[] {
    const seen = new Set();
    return jobs.filter(job => {
      const key = `${job.title}-${job.company}`.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  getConnectedPortals(): JobPortalConfig[] {
    return this.portals.filter(p => p.enabled);
  }

  async testConnection(portalName: string): Promise<boolean> {
    const portal = this.portals.find(p => p.name === portalName);
    if (!portal) return false;

    try {
      const testJobs = await this.searchPortal(portal, { keywords: 'software engineer' });
      return testJobs.length > 0;
    } catch {
      return false;
    }
  }
}

export const jobPortalService = new JobPortalService();
export type { RealJobData, JobPortalConfig };
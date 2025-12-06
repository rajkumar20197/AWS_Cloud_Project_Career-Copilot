import salaryNegotiationAgent from './salaryNegotiationAgent';
import applicationStatusBot from './applicationStatusBot';
import followUpAgent from './followUpAgent';
import interviewPrepAgent from './interviewPrepAgent';

interface AgentConfig {
  id: string;
  name: string;
  type: 'salary_negotiation' | 'application_status' | 'follow_up' | 'interview_prep';
  enabled: boolean;
  schedule: {
    frequency: 'hourly' | 'daily' | 'weekly';
    time?: string; // For daily/weekly schedules
    days?: number[]; // For weekly schedules (0-6, Sunday-Saturday)
  };
  settings: Record<string, any>;
}

interface AgentStatus {
  id: string;
  name: string;
  type: 'salary_negotiation' | 'application_status' | 'follow_up' | 'interview_prep';
  status: 'active' | 'paused' | 'error';
  lastRun: Date;
  nextRun: Date;
  tasksCompleted: number;
  tasksTotal: number;
  successRate: number;
  errorMessage?: string;
}

interface AgentTask {
  id: string;
  agentId: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  data: Record<string, any>;
  result?: Record<string, any>;
  error?: string;
}

class AgentManager {
  private agents: Map<string, AgentConfig> = new Map();
  private agentStatus: Map<string, AgentStatus> = new Map();
  private tasks: Map<string, AgentTask> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.initializeDefaultAgents();
  }

  private initializeDefaultAgents() {
    const defaultAgents: AgentConfig[] = [
      {
        id: 'salary-negotiation-agent',
        name: 'Salary Negotiation Agent',
        type: 'salary_negotiation',
        enabled: true,
        schedule: {
          frequency: 'daily',
          time: '09:00',
        },
        settings: {
          minSalaryIncrease: 0.1, // 10%
          maxNegotiationRounds: 3,
          followUpDelay: 48, // hours
        },
      },
      {
        id: 'application-status-bot',
        name: 'Application Status Bot',
        type: 'application_status',
        enabled: true,
        schedule: {
          frequency: 'daily',
          time: '10:00',
        },
        settings: {
          checkInterval: 24, // hours
          maxRetries: 3,
          notifyOnStatusChange: true,
        },
      },
      {
        id: 'follow-up-agent',
        name: 'Follow Up Agent',
        type: 'follow_up',
        enabled: true,
        schedule: {
          frequency: 'daily',
          time: '14:00',
        },
        settings: {
          initialFollowUpDelay: 72, // hours
          subsequentFollowUpDelay: 168, // hours (1 week)
          maxFollowUps: 3,
        },
      },
      {
        id: 'interview-prep-agent',
        name: 'Interview Prep Agent',
        type: 'interview_prep',
        enabled: true,
        schedule: {
          frequency: 'daily',
          time: '08:00',
        },
        settings: {
          prepTimeBeforeInterview: 24, // hours
          practiceSessionDuration: 30, // minutes
          generateCustomQuestions: true,
        },
      },
    ];

    defaultAgents.forEach(agent => {
      this.agents.set(agent.id, agent);
      this.initializeAgentStatus(agent);
    });
  }

  private initializeAgentStatus(agent: AgentConfig) {
    const status: AgentStatus = {
      id: agent.id,
      name: agent.name,
      type: agent.type,
      status: agent.enabled ? 'active' : 'paused',
      lastRun: new Date(Date.now() - 3600000), // 1 hour ago
      nextRun: this.calculateNextRun(agent.schedule),
      tasksCompleted: Math.floor(Math.random() * 50) + 10,
      tasksTotal: Math.floor(Math.random() * 60) + 50,
      successRate: Math.floor(Math.random() * 30) + 70, // 70-100%
    };

    this.agentStatus.set(agent.id, status);

    if (agent.enabled) {
      this.scheduleAgent(agent);
    }
  }

  private calculateNextRun(schedule: AgentConfig['schedule']): Date {
    const now = new Date();
    const nextRun = new Date();

    switch (schedule.frequency) {
      case 'hourly':
        nextRun.setHours(now.getHours() + 1, 0, 0, 0);
        break;
      case 'daily':
        if (schedule.time) {
          const [hours, minutes] = schedule.time.split(':').map(Number);
          nextRun.setHours(hours, minutes, 0, 0);
          if (nextRun <= now) {
            nextRun.setDate(nextRun.getDate() + 1);
          }
        } else {
          nextRun.setDate(now.getDate() + 1);
        }
        break;
      case 'weekly':
        // Implementation for weekly scheduling
        nextRun.setDate(now.getDate() + 7);
        break;
    }

    return nextRun;
  }

  private scheduleAgent(agent: AgentConfig) {
    const executeAgent = async () => {
      try {
        await this.executeAgent(agent.id);
      } catch (error) {
        console.error(`Error executing agent ${agent.id}:`, error);
        this.updateAgentStatus(agent.id, { status: 'error', errorMessage: error instanceof Error ? error.message : 'Unknown error' });
      }
    };

    let interval: NodeJS.Timeout;

    switch (agent.schedule.frequency) {
      case 'hourly':
        interval = setInterval(executeAgent, 3600000); // 1 hour
        break;
      case 'daily':
        // Calculate milliseconds until next run, then set daily interval
        const nextRun = this.calculateNextRun(agent.schedule);
        const msUntilNextRun = nextRun.getTime() - Date.now();
        
        setTimeout(() => {
          executeAgent();
          interval = setInterval(executeAgent, 86400000); // 24 hours
          this.intervals.set(agent.id, interval);
        }, msUntilNextRun);
        return;
      case 'weekly':
        interval = setInterval(executeAgent, 604800000); // 1 week
        break;
    }

    this.intervals.set(agent.id, interval);
  }

  private async executeAgent(agentId: string): Promise<void> {
    const agent = this.agents.get(agentId);
    const status = this.agentStatus.get(agentId);

    if (!agent || !status || status.status !== 'active') {
      return;
    }

    this.updateAgentStatus(agentId, { 
      status: 'active',
      lastRun: new Date(),
      nextRun: this.calculateNextRun(agent.schedule)
    });

    try {
      let result;
      
      switch (agent.type) {
        case 'salary_negotiation':
          result = await salaryNegotiationAgent.execute(agent.settings);
          break;
        case 'application_status':
          result = await applicationStatusBot.execute(agent.settings);
          break;
        case 'follow_up':
          result = await followUpAgent.execute(agent.settings);
          break;
        case 'interview_prep':
          result = await interviewPrepAgent.execute(agent.settings);
          break;
        default:
          throw new Error(`Unknown agent type: ${agent.type}`);
      }

      // Update success metrics
      const currentStatus = this.agentStatus.get(agentId)!;
      this.updateAgentStatus(agentId, {
        tasksCompleted: currentStatus.tasksCompleted + (result.tasksCompleted || 1),
        successRate: Math.min(100, currentStatus.successRate + 1),
      });

    } catch (error) {
      console.error(`Agent ${agentId} execution failed:`, error);
      this.updateAgentStatus(agentId, { 
        status: 'error',
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private updateAgentStatus(agentId: string, updates: Partial<AgentStatus>) {
    const currentStatus = this.agentStatus.get(agentId);
    if (currentStatus) {
      this.agentStatus.set(agentId, { ...currentStatus, ...updates });
    }
  }

  async getAllAgentStatus(): Promise<AgentStatus[]> {
    return Array.from(this.agentStatus.values());
  }

  async getAgentStatus(agentId: string): Promise<AgentStatus | null> {
    return this.agentStatus.get(agentId) || null;
  }

  async startAgent(agentId: string): Promise<void> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    agent.enabled = true;
    this.updateAgentStatus(agentId, { status: 'active' });
    this.scheduleAgent(agent);
  }

  async pauseAgent(agentId: string): Promise<void> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    agent.enabled = false;
    this.updateAgentStatus(agentId, { status: 'paused' });
    
    const interval = this.intervals.get(agentId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(agentId);
    }
  }

  async updateAgentConfig(agentId: string, config: Partial<AgentConfig>): Promise<void> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    Object.assign(agent, config);

    // Restart agent if it's active and schedule changed
    if (agent.enabled && config.schedule) {
      await this.pauseAgent(agentId);
      await this.startAgent(agentId);
    }
  }

  async getAgentConfig(agentId: string): Promise<AgentConfig | null> {
    return this.agents.get(agentId) || null;
  }

  async createTask(agentId: string, type: string, data: Record<string, any>): Promise<string> {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const task: AgentTask = {
      id: taskId,
      agentId,
      type,
      status: 'pending',
      createdAt: new Date(),
      data,
    };

    this.tasks.set(taskId, task);
    return taskId;
  }

  async getTask(taskId: string): Promise<AgentTask | null> {
    return this.tasks.get(taskId) || null;
  }

  async getAgentTasks(agentId: string): Promise<AgentTask[]> {
    return Array.from(this.tasks.values()).filter(task => task.agentId === agentId);
  }

  async getAgentAnalytics(agentId: string, timeRange: 'day' | 'week' | 'month' = 'week'): Promise<{
    totalTasks: number;
    completedTasks: number;
    failedTasks: number;
    successRate: number;
    averageExecutionTime: number;
    tasksByType: Record<string, number>;
  }> {
    const tasks = await this.getAgentTasks(agentId);
    const now = Date.now();
    const timeRangeMs = {
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
    }[timeRange];

    const recentTasks = tasks.filter(task => 
      now - task.createdAt.getTime() <= timeRangeMs
    );

    const completedTasks = recentTasks.filter(task => task.status === 'completed');
    const failedTasks = recentTasks.filter(task => task.status === 'failed');

    const tasksByType = recentTasks.reduce((acc, task) => {
      acc[task.type] = (acc[task.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const executionTimes = completedTasks
      .filter(task => task.completedAt)
      .map(task => task.completedAt!.getTime() - task.createdAt.getTime());

    const averageExecutionTime = executionTimes.length > 0
      ? executionTimes.reduce((sum, time) => sum + time, 0) / executionTimes.length
      : 0;

    return {
      totalTasks: recentTasks.length,
      completedTasks: completedTasks.length,
      failedTasks: failedTasks.length,
      successRate: recentTasks.length > 0 ? (completedTasks.length / recentTasks.length) * 100 : 0,
      averageExecutionTime,
      tasksByType,
    };
  }

  // Cleanup method
  destroy(): void {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();
  }
}

export const agentManager = new AgentManager();
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  Bot, 
  MessageSquare, 
  DollarSign, 
  Calendar, 
  FileText, 
  TrendingUp,
  Play,
  Pause,
  Settings,
  Activity,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { agentManager } from '../services/agentManager';

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
}

export const AgentDashboard: React.FC = () => {
  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  useEffect(() => {
    loadAgentData();
    const interval = setInterval(loadAgentData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadAgentData = async () => {
    try {
      const agentData = await agentManager.getAllAgentStatus();
      setAgents(agentData);
    } catch (error) {
      console.error('Failed to load agent data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAgentToggle = async (agentId: string, currentStatus: string) => {
    try {
      if (currentStatus === 'active') {
        await agentManager.pauseAgent(agentId);
      } else {
        await agentManager.startAgent(agentId);
      }
      await loadAgentData();
    } catch (error) {
      console.error('Failed to toggle agent:', error);
    }
  };

  const getAgentIcon = (type: string) => {
    switch (type) {
      case 'salary_negotiation': return <DollarSign className="h-5 w-5" />;
      case 'application_status': return <FileText className="h-5 w-5" />;
      case 'follow_up': return <MessageSquare className="h-5 w-5" />;
      case 'interview_prep': return <Calendar className="h-5 w-5" />;
      default: return <Bot className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'paused': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'paused': return <Clock className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatAgentName = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') + ' Agent';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Agent Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage your AI career agents</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          {agents.filter(a => a.status === 'active').length} Active Agents
        </Badge>
      </div>

      {/* Agent Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {agents.map((agent) => (
          <Card 
            key={agent.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedAgent === agent.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedAgent(agent.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getAgentIcon(agent.type)}
                  <CardTitle className="text-sm">{formatAgentName(agent.type)}</CardTitle>
                </div>
                <Badge 
                  variant="outline" 
                  className={`flex items-center gap-1 ${getStatusColor(agent.status)}`}
                >
                  {getStatusIcon(agent.status)}
                  {agent.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{agent.tasksCompleted}/{agent.tasksTotal}</span>
                </div>
                <Progress 
                  value={(agent.tasksCompleted / agent.tasksTotal) * 100} 
                  className="h-2"
                />
              </div>
              
              <div className="space-y-1 text-xs text-muted-foreground">
                <div>Success Rate: {agent.successRate}%</div>
                <div>Last Run: {new Date(agent.lastRun).toLocaleString()}</div>
                <div>Next Run: {new Date(agent.nextRun).toLocaleString()}</div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={agent.status === 'active' ? 'outline' : 'default'}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAgentToggle(agent.id, agent.status);
                  }}
                  className="flex-1"
                >
                  {agent.status === 'active' ? (
                    <>
                      <Pause className="h-3 w-3 mr-1" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3 mr-1" />
                      Start
                    </>
                  )}
                </Button>
                <Button size="sm" variant="outline">
                  <Settings className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Agent View */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Agent Performance</CardTitle>
                <CardDescription>Success rates and completion metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agents.map((agent) => (
                    <div key={agent.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getAgentIcon(agent.type)}
                        <span className="text-sm font-medium">
                          {formatAgentName(agent.type)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={agent.successRate} className="w-20 h-2" />
                        <span className="text-sm text-muted-foreground w-12">
                          {agent.successRate}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest agent actions and results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { agent: 'Salary Negotiation', action: 'Sent negotiation email', time: '2 minutes ago', status: 'success' },
                    { agent: 'Follow Up', action: 'Scheduled interview reminder', time: '15 minutes ago', status: 'success' },
                    { agent: 'Application Status', action: 'Checked application status', time: '1 hour ago', status: 'pending' },
                    { agent: 'Interview Prep', action: 'Generated practice questions', time: '2 hours ago', status: 'success' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === 'success' ? 'bg-green-500' : 
                        activity.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{activity.agent}</div>
                        <div className="text-xs text-muted-foreground">{activity.action}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Detailed log of all agent activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Activity log will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Configuration</CardTitle>
              <CardDescription>Configure agent behavior and schedules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Agent settings will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>Detailed analytics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Analytics dashboard will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
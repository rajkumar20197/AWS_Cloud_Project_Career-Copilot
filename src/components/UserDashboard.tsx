import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { 
  User, 
  FileText, 
  Calendar, 
  Target, 
  TrendingUp, 
  Mail, 
  Settings,
  Upload,
  CheckCircle,
  Clock,
  Star,
  Briefcase
} from 'lucide-react';

interface UserProfile {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  experience: string;
  goals: string[];
  subscription: {
    plan: string;
    status: string;
    startDate: string;
  };
  profile: {
    completionScore: number;
    resumeUploaded: boolean;
    calendarConnected: boolean;
    firstLogin: boolean;
  };
}

const UserDashboard: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        throw new Error('Failed to fetch profile');
      }
    } catch (err) {
      setError('Failed to load profile');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('rememberUser');
    window.location.href = '/login';
  };

  const getCompletionTasks = () => {
    if (!user) return [];
    
    return [
      {
        id: 'resume',
        title: 'Upload Resume',
        description: 'Get AI-powered resume analysis and feedback',
        completed: user.profile.resumeUploaded,
        points: 25,
        action: () => console.log('Upload resume')
      },
      {
        id: 'calendar',
        title: 'Connect Calendar',
        description: 'Sync your calendar for interview scheduling',
        completed: user.profile.calendarConnected,
        points: 20,
        action: () => console.log('Connect calendar')
      },
      {
        id: 'goals',
        title: 'Set Career Goals',
        description: 'Define your career objectives and timeline',
        completed: user.goals.length > 0,
        points: 15,
        action: () => console.log('Set goals')
      },
      {
        id: 'subscription',
        title: 'Choose Plan',
        description: 'Upgrade to unlock premium features',
        completed: user.subscription.plan !== 'free',
        points: 30,
        action: () => console.log('Choose plan')
      }
    ];
  };

  const getRecentActivities = () => [
    {
      id: 1,
      type: 'account',
      title: 'Account Created',
      description: 'Welcome to AI Career Coach!',
      timestamp: new Date().toISOString(),
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'profile',
      title: 'Profile Setup',
      description: 'Basic information completed',
      timestamp: new Date().toISOString(),
      icon: User,
      color: 'text-blue-600'
    }
  ];

  const getQuickActions = () => [
    {
      id: 'resume-analysis',
      title: 'Resume Analysis',
      description: 'Get instant AI feedback',
      icon: FileText,
      color: 'bg-blue-500',
      action: () => console.log('Resume analysis')
    },
    {
      id: 'job-search',
      title: 'Job Matching',
      description: 'Find perfect opportunities',
      icon: Briefcase,
      color: 'bg-green-500',
      action: () => console.log('Job search')
    },
    {
      id: 'interview-prep',
      title: 'Interview Prep',
      description: 'Practice with AI coach',
      icon: Target,
      color: 'bg-purple-500',
      action: () => console.log('Interview prep')
    },
    {
      id: 'salary-negotiation',
      title: 'Salary Negotiation',
      description: 'Get negotiation strategies',
      icon: TrendingUp,
      color: 'bg-orange-500',
      action: () => console.log('Salary negotiation')
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            {error || 'Failed to load dashboard'}. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const completionTasks = getCompletionTasks();
  const completedTasks = completionTasks.filter(task => task.completed).length;
  const totalPoints = completionTasks.filter(task => task.completed).reduce((sum, task) => sum + task.points, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user.firstName}! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Ready to advance your career? Let's get started.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant={user.subscription.plan === 'free' ? 'outline' : 'default'}>
              {user.subscription.plan.toUpperCase()} Plan
            </Badge>
            <Button variant="outline" onClick={handleLogout}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Welcome Message for First Login */}
        {user.profile.firstLogin && (
          <Alert>
            <Star className="h-4 w-4" />
            <AlertDescription>
              🎉 Welcome to AI Career Coach! Complete your profile setup below to unlock all features and get personalized career guidance.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.profile.completionScore}%</div>
              <Progress value={user.profile.completionScore} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTasks}/4</div>
              <p className="text-xs text-muted-foreground">Setup tasks</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Points Earned</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPoints}</div>
              <p className="text-xs text-muted-foreground">Total points</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Career Goals</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.goals.length}</div>
              <p className="text-xs text-muted-foreground">Active goals</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Completion */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Complete Your Profile</CardTitle>
              <CardDescription>
                Finish setting up your profile to unlock all AI career coaching features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {completionTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      task.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {task.completed ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-gray-600">{task.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">+{task.points} pts</Badge>
                    {!task.completed && (
                      <Button size="sm" onClick={task.action}>
                        Start
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Jump into AI-powered career tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {getQuickActions().map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                  onClick={action.action}
                >
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mr-3`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm text-gray-600">{action.description}</div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest career coaching activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getRecentActivities().map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center ${activity.color}`}>
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{activity.title}</h4>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
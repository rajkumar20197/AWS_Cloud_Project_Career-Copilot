import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  Search,
  FileText,
  TrendingUp,
  Mail,
  Target,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  Calendar,
  Award,
  Zap,
  Heart,
  Briefcase,
  Mic,
  Scale,
} from 'lucide-react';
import type { NavigationPage } from '../types';

interface InteractiveDashboardProps {
  onNavigate: (page: NavigationPage) => void;
  userData?: any;
}

export function InteractiveDashboard({ onNavigate, userData }: InteractiveDashboardProps) {
  const stats = [
    {
      label: 'AI Job Matches',
      value: '6',
      subtitle: 'New this week',
      icon: Sparkles,
      color: 'from-blue-500 to-blue-600',
      trend: '+3',
      trendUp: true,
    },
    {
      label: 'Applications',
      value: '12',
      subtitle: '2 interviews scheduled',
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      trend: '+4',
      trendUp: true,
    },
    {
      label: 'Resume Score',
      value: '82',
      subtitle: 'Good! Can improve',
      icon: Award,
      color: 'from-green-500 to-green-600',
      trend: '+5',
      trendUp: true,
    },
    {
      label: 'Profile Views',
      value: '45',
      subtitle: '+12% this week',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      trend: '+12%',
      trendUp: true,
    },
  ];

  const quickActions = [
    {
      title: 'Browse AI Job Matches',
      description: 'Discover 6 new jobs with 90+ compatibility scores',
      icon: Search,
      badge: '6 new matches',
      badgeColor: 'bg-blue-100 text-blue-700',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      borderColor: 'hover:border-blue-500',
      page: 'job-search' as NavigationPage,
    },
    {
      title: 'Swipe Through Jobs',
      description: 'Tinder-style job matching • Like or pass on 12 opportunities',
      icon: Heart,
      badge: '12 new',
      badgeColor: 'bg-pink-100 text-pink-700',
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-600',
      borderColor: 'hover:border-pink-500',
      page: 'job-swiper' as NavigationPage,
    },
    {
      title: 'Track Applications',
      description: 'Manage 12 applications with visual Kanban board',
      icon: Briefcase,
      badge: '12 active',
      badgeColor: 'bg-blue-100 text-blue-700',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      borderColor: 'hover:border-blue-500',
      page: 'application-tracker' as NavigationPage,
    },
    {
      title: 'Optimize Your Resume',
      description: 'AI suggests 5 improvements to boost ATS score to 90+',
      icon: FileText,
      badge: 'Improve',
      badgeColor: 'bg-orange-100 text-orange-700',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      borderColor: 'hover:border-purple-500',
      page: 'resume' as NavigationPage,
    },
    {
      title: 'Generate Cover Letter',
      description: 'Create tailored cover letters in seconds with AI',
      icon: Sparkles,
      badge: 'AI Powered',
      badgeColor: 'bg-purple-100 text-purple-700',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      borderColor: 'hover:border-purple-500',
      page: 'cover-letter' as NavigationPage,
    },
    {
      title: 'Practice Mock Interview',
      description: 'AI-powered interview simulator with real-time feedback',
      icon: Mic,
      badge: 'New',
      badgeColor: 'bg-green-100 text-green-700',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      borderColor: 'hover:border-purple-500',
      page: 'mock-interview' as NavigationPage,
    },
    {
      title: 'Analyze Skill Gaps',
      description: 'Find missing skills and get personalized learning paths',
      icon: Target,
      badge: '4 skills',
      badgeColor: 'bg-blue-100 text-blue-700',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      borderColor: 'hover:border-blue-500',
      page: 'skill-gap' as NavigationPage,
    },
    {
      title: 'Compare Job Offers',
      description: 'Evaluate and compare multiple offers side-by-side',
      icon: Scale,
      badge: '2 offers',
      badgeColor: 'bg-green-100 text-green-700',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      borderColor: 'hover:border-green-500',
      page: 'offer-comparison' as NavigationPage,
    },
    {
      title: 'Market Intelligence',
      description: 'Software Engineer salaries in SF up 8.5% • React +15.2%',
      icon: TrendingUp,
      badge: '+8.5% avg',
      badgeColor: 'bg-green-100 text-green-700',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      borderColor: 'hover:border-green-500',
      page: 'market-intelligence' as NavigationPage,
    },
    {
      title: 'Interview Invitations',
      description: 'AI detected 2 new interview invitations in Gmail',
      icon: Mail,
      badge: '3 new',
      badgeColor: 'bg-orange-100 text-orange-700',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      borderColor: 'hover:border-orange-500',
      page: 'gmail' as NavigationPage,
    },
  ];

  const recentActivity = [
    {
      icon: CheckCircle2,
      color: 'text-green-500',
      title: 'Job Application Sent',
      description: 'Senior Frontend Engineer at Tech Corp',
      time: '2 hours ago',
    },
    {
      icon: Calendar,
      color: 'text-blue-500',
      title: 'Interview Scheduled',
      description: 'Technical interview on Dec 28, 2:00 PM',
      time: '5 hours ago',
    },
    {
      icon: Sparkles,
      color: 'text-purple-500',
      title: 'New Job Match',
      description: '95% compatibility • React Developer',
      time: '1 day ago',
    },
    {
      icon: Award,
      color: 'text-orange-500',
      title: 'Resume Optimized',
      description: 'ATS score improved from 75 to 82',
      time: '2 days ago',
    },
  ];

  const upcomingTasks = [
    {
      title: 'Prepare for Tech Corp Interview',
      dueDate: 'Dec 28',
      priority: 'high',
      completed: false,
    },
    {
      title: 'Follow up with StartupXYZ',
      dueDate: 'Dec 26',
      priority: 'medium',
      completed: false,
    },
    {
      title: 'Update portfolio with new project',
      dueDate: 'Dec 27',
      priority: 'medium',
      completed: false,
    },
    {
      title: 'Review AI job matches',
      dueDate: 'Today',
      priority: 'high',
      completed: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl mb-2">
          Welcome Back, {userData?.name || 'User'}! 👋
        </h1>
        <p className="text-lg text-slate-600">
          Here's your career progress overview
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="cursor-pointer"
          >
            <Card className={`bg-gradient-to-r ${stat.color} text-white p-6 border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden relative`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm opacity-90">{stat.label}</p>
                  <stat.icon className="w-5 h-5 opacity-80" />
                </div>
                <div className="flex items-end gap-2 mb-1">
                  <p className="text-4xl">{stat.value}</p>
                  <div className={`flex items-center gap-1 text-sm pb-1 ${stat.trendUp ? '' : 'opacity-70'}`}>
                    {stat.trendUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {stat.trend}
                  </div>
                </div>
                <p className="text-sm opacity-75">{stat.subtitle}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {quickActions.map((action, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
            onClick={() => onNavigate(action.page)}
            className={`bg-white rounded-2xl p-6 border-2 border-slate-200 ${action.borderColor} cursor-pointer transition-all hover:shadow-xl group`}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${action.iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <action.icon className={`w-6 h-6 ${action.iconColor}`} />
              </div>
              <Badge className={action.badgeColor}>{action.badge}</Badge>
            </div>
            <h3 className="text-xl mb-2 group-hover:text-blue-600 transition-colors">
              {action.title}
            </h3>
            <p className="text-slate-600 mb-4">{action.description}</p>
            <Button className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
              View Details →
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl">Recent Activity</h2>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 1 + i * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <div className={`w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <activity.icon className={`w-5 h-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium group-hover:text-blue-600 transition-colors">
                      {activity.title}
                    </p>
                    <p className="text-sm text-slate-600">{activity.description}</p>
                  </div>
                  <div className="text-xs text-slate-500 whitespace-nowrap flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Upcoming Tasks */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <Card className="p-6 sticky top-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl">Tasks</h2>
              <Button variant="ghost" size="sm">
                <Zap className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {upcomingTasks.map((task, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 1.2 + i * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    className="mt-1 rounded"
                    readOnly
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium group-hover:text-blue-600 transition-colors">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500">{task.dueDate}</span>
                      {task.priority === 'high' && (
                        <Badge className="bg-red-100 text-red-700 text-xs px-2 py-0">
                          High
                        </Badge>
                      )}
                      {task.priority === 'medium' && (
                        <Badge className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0">
                          Medium
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline">
              Add New Task
            </Button>
          </Card>
        </motion.div>
      </div>

      {/* Career Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.4 }}
      >
        <Card className="p-6">
          <h2 className="text-2xl mb-6">Career Journey Progress</h2>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Job Search Progress</span>
                <span className="text-sm text-slate-600">75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Resume Optimization</span>
                <span className="text-sm text-slate-600">82%</span>
              </div>
              <Progress value={82} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Interview Readiness</span>
                <span className="text-sm text-slate-600">60%</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Network Building</span>
                <span className="text-sm text-slate-600">45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
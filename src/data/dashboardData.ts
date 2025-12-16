import {
    Search,
    FileText,
    TrendingUp,
    Mail,
    Target,
    Sparkles,
    Award,
    Heart,
    Briefcase,
    Mic,
    Scale,
    CheckCircle2,
    Calendar,
    Clock,
    LucideIcon,
} from 'lucide-react';
import type { NavigationPage } from '../types';

export interface DashboardStat {
    label: string;
    value: string;
    subtitle: string;
    icon: LucideIcon;
    color: string;
    trend: string;
    trendUp: boolean;
}

export interface QuickAction {
    title: string;
    description: string;
    icon: LucideIcon;
    badge: string;
    badgeColor: string;
    iconBg: string;
    iconColor: string;
    borderColor: string;
    page: NavigationPage;
}

export interface Activity {
    icon: LucideIcon;
    color: string;
    title: string;
    description: string;
    time: string;
}

export interface Task {
    title: string;
    dueDate: string;
    priority: 'high' | 'medium' | 'low';
    completed: boolean;
}

export interface ProgressItem {
    label: string;
    value: number;
}

export const dashboardStats: DashboardStat[] = [
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

export const quickActions: QuickAction[] = [
    {
        title: 'Browse AI Job Matches',
        description: 'Discover 6 new jobs with 90+ compatibility scores',
        icon: Search,
        badge: '6 new matches',
        badgeColor: 'bg-blue-100 text-blue-700',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        borderColor: 'hover:border-blue-500',
        page: 'job-search',
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
        page: 'job-swiper',
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
        page: 'application-tracker',
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
        page: 'resume',
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
        page: 'cover-letter',
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
        page: 'mock-interview',
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
        page: 'skill-gap',
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
        page: 'offer-comparison',
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
        page: 'market-intelligence',
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
        page: 'gmail',
    },
];

export const recentActivity: Activity[] = [
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

export const upcomingTasks: Task[] = [
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

export const progressItems: ProgressItem[] = [
    { label: 'Job Search Progress', value: 75 },
    { label: 'Resume Optimization', value: 82 },
    { label: 'Interview Readiness', value: 60 },
    { label: 'Network Building', value: 45 },
];

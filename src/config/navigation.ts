import type { NavigationPage } from '../types';
import {
    Home,
    Search,
    FileText,
    TrendingUp,
    Mail,
    Settings,
    Heart,
    Briefcase,
    Mic,
    Target,
    Scale,
    Sparkles,
    Calendar,
    Bot,
    Clock,
    Wrench,
} from 'lucide-react';

export interface NavigationItem {
    id: NavigationPage;
    label: string;
    icon: any;
    badge: string | number | null;
}

export const getNavigationItems = (notificationCount?: number): NavigationItem[] => [
    { id: 'dashboard' as NavigationPage, label: 'Dashboard', icon: Home, badge: null },
    { id: 'morning-dashboard' as NavigationPage, label: 'Morning Brief', icon: Clock, badge: '3 today' },
    { id: 'scheduling-dashboard' as NavigationPage, label: 'AI Scheduler', icon: Bot, badge: 'Active' },
    { id: 'availability-settings' as NavigationPage, label: 'Availability', icon: Calendar, badge: null },
    { id: 'application-tracking' as NavigationPage, label: 'App Tracking', icon: TrendingUp, badge: '12 active' },
    { id: 'job-search' as NavigationPage, label: 'Job Search', icon: Search, badge: '6 new' },
    { id: 'job-swiper' as NavigationPage, label: 'Job Swiper', icon: Heart, badge: '12 new' },
    { id: 'application-tracker' as NavigationPage, label: 'Applications', icon: Briefcase, badge: null },
    { id: 'resume' as NavigationPage, label: 'Resume Optimizer', icon: FileText, badge: null },
    { id: 'cover-letter' as NavigationPage, label: 'Cover Letter', icon: Sparkles, badge: null },
    { id: 'mock-interview' as NavigationPage, label: 'Mock Interview', icon: Mic, badge: null },
    { id: 'skill-gap' as NavigationPage, label: 'Skill Gap', icon: Target, badge: null },
    { id: 'offer-comparison' as NavigationPage, label: 'Offers', icon: Scale, badge: null },
    { id: 'market-intelligence' as NavigationPage, label: 'Market Intel', icon: TrendingUp, badge: null },
    { id: 'gmail' as NavigationPage, label: 'Gmail & Calendar', icon: Mail, badge: null },
    { id: 'settings' as NavigationPage, label: 'Settings', icon: Settings, badge: null },
    // Development/Testing pages - hidden in production
    // { id: 'test-components' as NavigationPage, label: '🧪 Test Components', icon: Sparkles, badge: 'NEW' },
    // { id: 'system-tests' as NavigationPage, label: '🔧 System Tests', icon: Wrench, badge: 'TEST' },
];

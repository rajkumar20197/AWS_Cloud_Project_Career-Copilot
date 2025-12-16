import {
    Brain,
    Calendar,
    TrendingUp,
    Zap,
    Target,
    Sparkles,
    CheckCircle2,
} from 'lucide-react';

export interface LoginFeature {
    icon: any;
    title: string;
    description: string;
    color: string;
}

export interface LoginStep {
    icon: any;
    text: string;
}

export interface LoginStat {
    label: string;
    value: string;
}

export interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
}

export const loginFeatures: LoginFeature[] = [
    {
        icon: Brain,
        title: 'AI-Powered Matching',
        description: '0-100 compatibility scores using AWS Bedrock',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        icon: Calendar,
        title: 'Auto-Scheduling',
        description: 'Gmail scanning + automatic interview booking',
        color: 'from-purple-500 to-pink-500',
    },
    {
        icon: TrendingUp,
        title: 'Market Intelligence',
        description: 'Real-time salary trends and career insights',
        color: 'from-orange-500 to-red-500',
    },
    {
        icon: Zap,
        title: '24/7 Automation',
        description: 'Set and forget - AI works while you study',
        color: 'from-green-500 to-emerald-500',
    },
];

export const loginSteps: LoginStep[] = [
    { icon: Target, text: 'Set graduation date' },
    { icon: Sparkles, text: 'AI scans job portals' },
    { icon: Brain, text: 'Smart job matching' },
    { icon: CheckCircle2, text: 'Land dream job!' },
];

export const loginStats: LoginStat[] = [
    { label: 'AI Accuracy', value: '92%' },
    { label: 'Time Saved', value: '10hrs/wk' },
    { label: 'Job Matches', value: '100+' },
];

export const generateParticles = (count: number = 20): Particle[] =>
    Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5,
    }));

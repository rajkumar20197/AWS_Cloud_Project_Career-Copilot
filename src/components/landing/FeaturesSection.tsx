import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import {
    Brain,
    Calendar,
    TrendingUp,
    Mail,
    Target,
    Zap,
    LucideIcon,
} from 'lucide-react';

interface Feature {
    icon: LucideIcon;
    title: string;
    description: string;
    color: string;
    delay: number;
}

const features: Feature[] = [
    {
        icon: Brain,
        title: 'Agentic AI Workflows',
        description: 'Reducing manual effort by 95% using RAG and AWS Bedrock Claude 3.5 Haiku',
        color: 'from-blue-500 to-cyan-500',
        delay: 0.1,
    },
    {
        icon: Calendar,
        title: 'Auto-Scheduling',
        description: 'Gmail scanning with automatic interview booking on your calendar',
        color: 'from-purple-500 to-pink-500',
        delay: 0.2,
    },
    {
        icon: TrendingUp,
        title: 'Market Intelligence',
        description: 'Real-time salary trends and skill demand forecasting',
        color: 'from-orange-500 to-red-500',
        delay: 0.3,
    },
    {
        icon: Mail,
        title: 'Autonomous AI Agent',
        description: 'Real-time Autonomous Interview Detection and response management',
        color: 'from-green-500 to-emerald-500',
        delay: 0.4,
    },
    {
        icon: Target,
        title: 'Resume Optimizer',
        description: 'ATS-optimized resumes with AI-powered suggestions',
        color: 'from-indigo-500 to-purple-500',
        delay: 0.5,
    },
    {
        icon: Zap,
        title: '24/7 Automation',
        description: 'Continuous job scanning across LinkedIn, Indeed, Glassdoor',
        color: 'from-yellow-500 to-orange-500',
        delay: 0.6,
    },
];

/**
 * Features Section Component
 * Displays the 6 core platform features with animations
 */
export function FeaturesSection() {
    return (
        <div id="features" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <Badge className="mb-4">Features</Badge>
                    <h2 className="text-5xl font-bold mb-4">Everything You Need to Succeed</h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Six powerful features working together to automate your entire career journey
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: feature.delay }}
                        >
                            <Card className="p-6 h-full hover:shadow-2xl transition-all hover:-translate-y-2 border-slate-200 group cursor-pointer overflow-hidden relative">
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-600">{feature.description}</p>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

import { motion, useScroll, useTransform } from 'motion/react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
    Sparkles,
    ArrowRight,
    Rocket,
    Play,
    Shield,
    CheckCircle2,
    Star,
    Users,
    Award,
    Clock,
} from 'lucide-react';

interface HeroSectionProps {
    onGetStarted: () => void;
    onWatchDemo: () => void;
}

const stats = [
    { icon: Users, value: '10K+', label: 'Jobs Matched', color: 'text-blue-500' },
    { icon: Award, value: '92%', label: 'AI Accuracy', color: 'text-purple-500' },
    { icon: Clock, value: '10hrs', label: 'Time Saved/Week', color: 'text-green-500' },
    { icon: Rocket, value: '2.5x', label: 'Faster Hiring', color: 'text-orange-500' },
];

/**
 * Hero Section Component
 * Features parallax scrolling, animated stats, and CTA buttons
 */
export function HeroSection({ onGetStarted, onWatchDemo }: HeroSectionProps) {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    style={{ y }}
                    className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
                />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl" />
            </div>

            <motion.div
                style={{ opacity }}
                className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
            >
                <div className="text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-4 py-2 text-sm mb-6">
                            <Sparkles className="w-4 h-4 mr-2 inline" />
                            Agentic AI Workflows
                        </Badge>
                    </motion.div>

                    <motion.h1
                        className="text-6xl md:text-7xl lg:text-8xl tracking-tight max-w-5xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        From Graduation to
                        <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Dream Job
                        </span>
                        <span className="block text-5xl md:text-6xl lg:text-7xl mt-4 text-slate-600">
                            ✨
                        </span>
                    </motion.h1>

                    <motion.p
                        className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        Autonomous AI system that reduces manual effort by 95% using RAG architecture.
                        Let Agentic AI handle job search, applications, and interview detection—automatically.
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <Button
                            size="lg"
                            onClick={onGetStarted}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg group"
                        >
                            Start Your Career Journey
                            <Rocket className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>

                        <Button
                            size="lg"
                            variant="outline"
                            className="px-8 py-6 text-lg group"
                            onClick={onWatchDemo}
                        >
                            <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                            Watch 3-Minute Demo
                        </Button>
                    </motion.div>

                    {/* Stats Grid */}
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all hover:-translate-y-1"
                                whileHover={{ scale: 1.05 }}
                            >
                                <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
                                <div className={`text-4xl ${stat.color} mb-1`}>{stat.value}</div>
                                <div className="text-sm text-slate-600">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Trust Badges */}
                    <motion.div
                        className="flex flex-wrap items-center justify-center gap-6 pt-12 text-sm text-slate-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 1 }}
                    >
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-green-500" />
                            <span>AWS Secure</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span>GDPR Compliant</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span>4.9/5 Rating</span>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <div className="flex flex-col items-center gap-2 text-slate-400">
                    <span className="text-sm">Scroll to explore</span>
                    <ArrowRight className="w-5 h-5 rotate-90" />
                </div>
            </motion.div>
        </div>
    );
}

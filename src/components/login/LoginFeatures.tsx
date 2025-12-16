import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Logo } from '../Logo';
import { loginSteps, loginStats } from '../../config/loginConfig';

interface LoginFeaturesProps {
    onBackToLanding?: () => void;
}

export function LoginFeatures({ onBackToLanding }: LoginFeaturesProps) {
    return (
        <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Logo size="lg" variant="full" className="mb-8" onClick={onBackToLanding} />

                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="space-y-4"
                >
                    <h1 className="text-6xl text-white leading-tight">
                        From Graduation
                        <br />
                        to Dream Job
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            {' '}Automatically
                        </span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-md">
                        AI-powered career agent that works 24/7 using AWS Bedrock.
                        Set your date, let AI handle everything.
                    </p>
                </motion.div>

                {/* How It Works */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-12"
                >
                    <h3 className="text-sm uppercase tracking-wider text-slate-400 mb-6">
                        How It Works
                    </h3>
                    <div className="space-y-4">
                        {loginSteps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + index * 0.1 }}
                                className="flex items-center gap-4 group cursor-pointer"
                            >
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm flex items-center justify-center border border-white/10 group-hover:border-white/30 transition-all group-hover:scale-110">
                                    <step.icon className="w-5 h-5 text-blue-400" />
                                </div>
                                <div className="flex items-center gap-3 flex-1">
                                    <span className="text-2xl font-bold text-white/20 group-hover:text-white/40 transition-colors">
                                        {index + 1}
                                    </span>
                                    <span className="text-slate-300 group-hover:text-white transition-colors">
                                        {step.text}
                                    </span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="grid grid-cols-3 gap-6"
            >
                {loginStats.map((stat, i) => (
                    <div
                        key={i}
                        className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all hover:scale-105"
                    >
                        <div className="text-3xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            {stat.value}
                        </div>
                        <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

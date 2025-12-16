import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface ProfileSection {
    id: string;
    label: string;
    completed: boolean;
    weight: number; // Percentage contribution
    action?: () => void;
}

interface ProfileCompletenessProps {
    sections: ProfileSection[];
    onSectionClick?: (sectionId: string) => void;
}

export function ProfileCompleteness({ sections, onSectionClick }: ProfileCompletenessProps) {
    // Calculate completion percentage
    const completedWeight = sections
        .filter(s => s.completed)
        .reduce((sum, s) => sum + s.weight, 0);
    const totalWeight = sections.reduce((sum, s) => sum + s.weight, 0);
    const percentage = Math.round((completedWeight / totalWeight) * 100);

    // Get color based on percentage
    const getColor = (pct: number) => {
        if (pct < 25) return { ring: 'stroke-red-500', bg: 'bg-red-500', text: 'text-red-600' };
        if (pct < 50) return { ring: 'stroke-orange-500', bg: 'bg-orange-500', text: 'text-orange-600' };
        if (pct < 75) return { ring: 'stroke-yellow-500', bg: 'bg-yellow-500', text: 'text-yellow-600' };
        return { ring: 'stroke-green-500', bg: 'bg-green-500', text: 'text-green-600' };
    };

    const colors = getColor(percentage);
    const incompleteSections = sections.filter(s => !s.completed);

    // SVG circle calculations
    const size = 120;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <Card className="p-6">
            <div className="flex items-start gap-6">
                {/* Progress Ring */}
                <div className="relative flex-shrink-0">
                    <svg width={size} height={size} className="transform -rotate-90">
                        {/* Background circle */}
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            stroke="currentColor"
                            strokeWidth={strokeWidth}
                            fill="none"
                            className="text-slate-200"
                        />
                        {/* Progress circle */}
                        <motion.circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            stroke="currentColor"
                            strokeWidth={strokeWidth}
                            fill="none"
                            strokeLinecap="round"
                            className={colors.ring}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: offset }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            style={{
                                strokeDasharray: circumference,
                            }}
                        />
                    </svg>
                    {/* Percentage Text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className={`text-2xl font-bold ${colors.text}`}>
                                {percentage}%
                            </div>
                            <div className="text-xs text-slate-600">Complete</div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        <h3 className="text-lg font-semibold">Profile Strength</h3>
                    </div>

                    <p className="text-sm text-slate-600 mb-4">
                        {percentage < 50
                            ? "Let's build a strong profile to attract better opportunities!"
                            : percentage < 75
                                ? "You're making great progress! Just a few more steps."
                                : percentage < 100
                                    ? "Almost there! Complete your profile to unlock all features."
                                    : "🎉 Congratulations! Your profile is complete!"}
                    </p>

                    {/* Incomplete Sections */}
                    {incompleteSections.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                <TrendingUp className="w-4 h-4" />
                                <span>Complete these to reach 100%:</span>
                            </div>
                            <div className="space-y-1.5">
                                {incompleteSections.slice(0, 5).map((section) => (
                                    <motion.button
                                        key={section.id}
                                        onClick={() => onSectionClick?.(section.id)}
                                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors group text-left"
                                        whileHover={{ x: 4 }}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Circle className="w-4 h-4 text-slate-400" />
                                            <span className="text-sm text-slate-700">{section.label}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-500">+{section.weight}%</span>
                                            <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                            {incompleteSections.length > 5 && (
                                <p className="text-xs text-slate-500 mt-2">
                                    +{incompleteSections.length - 5} more items
                                </p>
                            )}
                        </div>
                    )}

                    {/* Completed Sections */}
                    {percentage === 100 && (
                        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center gap-2 text-green-700 mb-2">
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="font-medium">Profile Complete!</span>
                            </div>
                            <p className="text-sm text-green-600">
                                Your profile is now optimized for maximum visibility and better job matches.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}

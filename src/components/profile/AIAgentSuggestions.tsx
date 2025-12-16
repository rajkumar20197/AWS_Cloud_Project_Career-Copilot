import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Check, ChevronRight, Lightbulb, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { toast } from 'sonner';

export interface AISuggestion {
    id: string;
    title: string;
    description: string;
    reason: string;
    impact: 'high' | 'medium' | 'low';
    category: 'profile' | 'skills' | 'experience' | 'preferences';
    action: () => void;
    icon?: string;
}

interface AIAgentSuggestionsProps {
    suggestions: AISuggestion[];
    onDismiss?: (id: string) => void;
    onApply?: (id: string) => void;
}

const impactColors = {
    high: {
        badge: 'bg-green-100 text-green-700 border-green-200',
        icon: 'text-green-600',
    },
    medium: {
        badge: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        icon: 'text-yellow-600',
    },
    low: {
        badge: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: 'text-blue-600',
    },
};

export function AIAgentSuggestions({
    suggestions,
    onDismiss,
    onApply,
}: AIAgentSuggestionsProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

    const visibleSuggestions = suggestions.filter(s => !dismissedIds.has(s.id));

    const handleDismiss = (id: string) => {
        setDismissedIds(prev => new Set([...prev, id]));
        onDismiss?.(id);
        toast.info('Suggestion dismissed');
    };

    const handleApply = (suggestion: AISuggestion) => {
        suggestion.action();
        onApply?.(suggestion.id);
        toast.success('Applied suggestion!');
    };

    if (visibleSuggestions.length === 0) {
        return null;
    }

    return (
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900">AI Career Coach</h3>
                    <p className="text-sm text-slate-600">
                        {visibleSuggestions.length} smart suggestion{visibleSuggestions.length !== 1 ? 's' : ''} to boost your profile
                    </p>
                </div>
            </div>

            {/* Suggestions List */}
            <div className="space-y-3">
                <AnimatePresence>
                    {visibleSuggestions.map((suggestion, index) => (
                        <motion.div
                            key={suggestion.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                                {/* Suggestion Header */}
                                <div
                                    className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                                    onClick={() => setExpandedId(expandedId === suggestion.id ? null : suggestion.id)}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Icon */}
                                        <div className="flex-shrink-0 mt-0.5">
                                            {suggestion.icon ? (
                                                <span className="text-2xl">{suggestion.icon}</span>
                                            ) : (
                                                <Lightbulb className={`w-5 h-5 ${impactColors[suggestion.impact].icon}`} />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <h4 className="font-medium text-slate-900">{suggestion.title}</h4>
                                                <div className="flex items-center gap-1">
                                                    <span
                                                        className={`px-2 py-0.5 text-xs font-medium rounded-full border ${impactColors[suggestion.impact].badge
                                                            }`}
                                                    >
                                                        {suggestion.impact === 'high' ? '+10%' : suggestion.impact === 'medium' ? '+5%' : '+3%'}
                                                    </span>
                                                    <ChevronRight
                                                        className={`w-4 h-4 text-slate-400 transition-transform ${expandedId === suggestion.id ? 'rotate-90' : ''
                                                            }`}
                                                    />
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-600">{suggestion.description}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                <AnimatePresence>
                                    {expandedId === suggestion.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="border-t border-slate-200"
                                        >
                                            <div className="p-4 bg-slate-50">
                                                <div className="flex items-start gap-2 mb-3">
                                                    <TrendingUp className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                                                    <p className="text-sm text-slate-700">
                                                        <span className="font-medium">Why this matters:</span> {suggestion.reason}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        onClick={() => handleApply(suggestion)}
                                                        size="sm"
                                                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                                                    >
                                                        <Check className="w-4 h-4 mr-1" />
                                                        Apply Suggestion
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleDismiss(suggestion.id)}
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        <X className="w-4 h-4 mr-1" />
                                                        Dismiss
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Footer */}
            {visibleSuggestions.length > 3 && (
                <div className="mt-4 pt-4 border-t border-purple-200">
                    <p className="text-xs text-slate-600 text-center">
                        💡 Tip: Complete high-impact suggestions first for maximum visibility
                    </p>
                </div>
            )}
        </Card>
    );
}

import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { QuickAction } from '../../data/dashboardData';
import type { NavigationPage } from '../../types';

interface QuickActionsGridProps {
    actions: QuickAction[];
    onNavigate: (page: NavigationPage) => void;
}

/**
 * Quick Actions Grid Component
 * Displays clickable action cards for main dashboard features
 */
export function QuickActionsGrid({ actions, onNavigate }: QuickActionsGridProps) {
    return (
        <div className="grid md:grid-cols-2 gap-6">
            {actions.map((action, i) => (
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
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                        {action.title}
                    </h3>
                    <p className="text-slate-600 mb-4">{action.description}</p>
                    <Button className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
                        View Details →
                    </Button>
                </motion.div>
            ))}
        </div>
    );
}

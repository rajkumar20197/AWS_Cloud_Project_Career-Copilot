import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Clock } from 'lucide-react';
import type { Activity } from '../../data/dashboardData';

interface RecentActivityWidgetProps {
    activities: Activity[];
}

/**
 * Recent Activity Widget Component
 * Displays recent user activities with icons and timestamps
 */
export function RecentActivityWidget({ activities }: RecentActivityWidgetProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="lg:col-span-2"
        >
            <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Recent Activity</h2>
                    <Button variant="ghost" size="sm">
                        View All
                    </Button>
                </div>
                <div className="space-y-4">
                    {activities.map((activity, i) => (
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
    );
}

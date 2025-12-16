import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import type { ProgressItem } from '../../data/dashboardData';

interface ProgressWidgetProps {
    items: ProgressItem[];
}

/**
 * Progress Widget Component
 * Displays career journey progress with progress bars
 */
export function ProgressWidget({ items }: ProgressWidgetProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.4 }}
        >
            <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">Career Journey Progress</h2>
                <div className="space-y-6">
                    {items.map((item, i) => (
                        <div key={i}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">{item.label}</span>
                                <span className="text-sm text-slate-600">{item.value}%</span>
                            </div>
                            <Progress value={item.value} className="h-2" />
                        </div>
                    ))}
                </div>
            </Card>
        </motion.div>
    );
}

import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Zap } from 'lucide-react';
import type { Task } from '../../data/dashboardData';

interface TasksWidgetProps {
    tasks: Task[];
}

/**
 * Tasks Widget Component
 * Displays upcoming tasks with priority badges
 */
export function TasksWidget({ tasks }: TasksWidgetProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
        >
            <Card className="p-6 sticky top-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Tasks</h2>
                    <Button variant="ghost" size="sm">
                        <Zap className="w-4 h-4" />
                    </Button>
                </div>
                <div className="space-y-3">
                    {tasks.map((task, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 1.2 + i * 0.1 }}
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                        >
                            <input
                                type="checkbox"
                                checked={task.completed}
                                className="mt-1 rounded"
                                readOnly
                            />
                            <div className="flex-1">
                                <p className="text-sm font-medium group-hover:text-blue-600 transition-colors">
                                    {task.title}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-slate-500">{task.dueDate}</span>
                                    {task.priority === 'high' && (
                                        <Badge className="bg-red-100 text-red-700 text-xs px-2 py-0">
                                            High
                                        </Badge>
                                    )}
                                    {task.priority === 'medium' && (
                                        <Badge className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0">
                                            Medium
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <Button className="w-full mt-4" variant="outline">
                    Add New Task
                </Button>
            </Card>
        </motion.div>
    );
}

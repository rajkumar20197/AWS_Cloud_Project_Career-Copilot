import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { DashboardStat } from '../../data/dashboardData';

interface DashboardStatsProps {
    stats: DashboardStat[];
}

/**
 * Dashboard Stats Component
 * Displays key metrics in gradient cards with trends
 */
export function DashboardStats({ stats }: DashboardStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="cursor-pointer"
                >
                    <Card className={`bg-gradient-to-r ${stat.color} text-white p-6 border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden relative`}>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm opacity-90">{stat.label}</p>
                                <stat.icon className="w-5 h-5 opacity-80" />
                            </div>
                            <div className="flex items-end gap-2 mb-1">
                                <p className="text-4xl font-bold">{stat.value}</p>
                                <div className={`flex items-center gap-1 text-sm pb-1 ${stat.trendUp ? '' : 'opacity-70'}`}>
                                    {stat.trendUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                    {stat.trend}
                                </div>
                            </div>
                            <p className="text-sm opacity-75">{stat.subtitle}</p>
                        </div>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}

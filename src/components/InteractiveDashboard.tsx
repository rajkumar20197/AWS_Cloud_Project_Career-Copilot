/**
 * Agentic AI Career Coach
 * Copyright (c) 2025 Agentic AI Career Coach | By Rajkumar Thota
 *
 * This file is part of the Agentic AI Career Coach project.
 * Licensed under the MIT License - see LICENSE file for details.
 *
 * @author Rajkumar Thota <rajkumarthota20197@gmail.com>
 * @created January 11, 2026
 */

import { motion } from 'motion/react';
import { DashboardStats } from './dashboard/DashboardStats';
import { QuickActionsGrid } from './dashboard/QuickActionsGrid';
import { RecentActivityWidget } from './dashboard/RecentActivityWidget';
import { TasksWidget } from './dashboard/TasksWidget';
import { ProgressWidget } from './dashboard/ProgressWidget';
import {
  dashboardStats,
  quickActions,
  recentActivity,
  upcomingTasks,
  progressItems,
} from '../data/dashboardData';
import type { NavigationPage } from '../types';

interface InteractiveDashboardProps {
  onNavigate: (page: NavigationPage) => void;
  userData?: any;
}

/**
 * Interactive Dashboard Component
 * Main dashboard with stats, quick actions, activity feed, tasks, and progress
 */
export function InteractiveDashboard({ onNavigate, userData }: InteractiveDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-2">
          Welcome Back, {userData?.name || 'User'}! 👋
        </h1>
        <p className="text-lg text-slate-600">
          Here's your career progress overview
        </p>
      </motion.div>

      {/* Quick Stats */}
      <DashboardStats stats={dashboardStats} />

      {/* Quick Actions Grid */}
      <QuickActionsGrid actions={quickActions} onNavigate={onNavigate} />

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <RecentActivityWidget activities={recentActivity} />

        {/* Upcoming Tasks */}
        <TasksWidget tasks={upcomingTasks} />
      </div>

      {/* Career Progress */}
      <ProgressWidget items={progressItems} />
    </div>
  );
}
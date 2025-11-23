import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Trophy, 
  Star, 
  Target, 
  Zap, 
  Award,
  Flame,
  CheckCircle2,
  TrendingUp,
  Briefcase,
  FileText,
  Mail,
  Calendar,
  Lock
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  total?: number;
}

interface AchievementBadgesProps {
  userProgress: {
    profileComplete: boolean;
    jobsApplied: number;
    interviewsScheduled: number;
    resumeOptimized: boolean;
    coverLettersGenerated: number;
    daysActive: number;
    skillsAdded: number;
  };
}

export function AchievementBadges({ userProgress }: AchievementBadgesProps) {
  const achievements: Achievement[] = [
    {
      id: 'first-steps',
      title: 'First Steps',
      description: 'Complete your profile',
      icon: CheckCircle2,
      color: 'from-green-500 to-emerald-500',
      unlocked: userProgress.profileComplete,
      unlockedAt: userProgress.profileComplete ? new Date().toISOString() : undefined,
    },
    {
      id: 'job-hunter',
      title: 'Job Hunter',
      description: 'Apply to 5 jobs',
      icon: Briefcase,
      color: 'from-blue-500 to-cyan-500',
      unlocked: userProgress.jobsApplied >= 5,
      progress: userProgress.jobsApplied,
      total: 5,
    },
    {
      id: 'interview-ready',
      title: 'Interview Ready',
      description: 'Schedule your first interview',
      icon: Calendar,
      color: 'from-purple-500 to-pink-500',
      unlocked: userProgress.interviewsScheduled >= 1,
      progress: userProgress.interviewsScheduled,
      total: 1,
    },
    {
      id: 'resume-master',
      title: 'Resume Master',
      description: 'Optimize your resume',
      icon: FileText,
      color: 'from-orange-500 to-red-500',
      unlocked: userProgress.resumeOptimized,
    },
    {
      id: 'cover-letter-pro',
      title: 'Cover Letter Pro',
      description: 'Generate 3 cover letters',
      icon: Mail,
      color: 'from-indigo-500 to-purple-500',
      unlocked: userProgress.coverLettersGenerated >= 3,
      progress: userProgress.coverLettersGenerated,
      total: 3,
    },
    {
      id: 'week-warrior',
      title: 'Week Warrior',
      description: 'Active for 7 days',
      icon: Flame,
      color: 'from-yellow-500 to-orange-500',
      unlocked: userProgress.daysActive >= 7,
      progress: userProgress.daysActive,
      total: 7,
    },
    {
      id: 'skill-collector',
      title: 'Skill Collector',
      description: 'Add 10 skills to profile',
      icon: Star,
      color: 'from-pink-500 to-rose-500',
      unlocked: userProgress.skillsAdded >= 10,
      progress: userProgress.skillsAdded,
      total: 10,
    },
    {
      id: 'career-champion',
      title: 'Career Champion',
      description: 'Complete all achievements',
      icon: Trophy,
      color: 'from-yellow-400 to-yellow-600',
      unlocked: false, // Calculate based on all others
    },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">🏆 Achievements</h2>
            <p className="text-white/90">
              {unlockedCount} of {totalCount} unlocked
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{completionPercentage}%</div>
            <div className="text-sm text-white/80">Complete</div>
          </div>
        </div>
        <div className="mt-4 bg-white/20 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-white rounded-full"
          />
        </div>
      </Card>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`
                p-6 relative overflow-hidden transition-all
                ${achievement.unlocked 
                  ? 'border-2 border-green-500 shadow-lg hover:shadow-xl' 
                  : 'opacity-60 hover:opacity-80'
                }
              `}
            >
              {/* Background Gradient */}
              {achievement.unlocked && (
                <div className={`absolute inset-0 bg-gradient-to-br ${achievement.color} opacity-10`} />
              )}

              {/* Lock Icon for Locked Achievements */}
              {!achievement.unlocked && (
                <div className="absolute top-4 right-4">
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
              )}

              {/* Unlocked Badge */}
              {achievement.unlocked && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", duration: 0.6 }}
                  className="absolute top-4 right-4"
                >
                  <Badge className="bg-green-500 text-white">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Unlocked
                  </Badge>
                </motion.div>
              )}

              <div className="relative space-y-4">
                {/* Icon */}
                <div className={`
                  w-16 h-16 rounded-full flex items-center justify-center
                  ${achievement.unlocked 
                    ? `bg-gradient-to-br ${achievement.color}` 
                    : 'bg-slate-200'
                  }
                `}>
                  <achievement.icon className={`
                    w-8 h-8
                    ${achievement.unlocked ? 'text-white' : 'text-slate-400'}
                  `} />
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-bold text-lg mb-1">{achievement.title}</h3>
                  <p className="text-sm text-slate-600">{achievement.description}</p>
                </div>

                {/* Progress Bar */}
                {achievement.progress !== undefined && achievement.total && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Progress</span>
                      <span>{achievement.progress} / {achievement.total}</span>
                    </div>
                    <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-full bg-gradient-to-r ${achievement.color}`}
                      />
                    </div>
                  </div>
                )}

                {/* Unlocked Date */}
                {achievement.unlockedAt && (
                  <p className="text-xs text-slate-500">
                    Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Motivational Message */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <div className="flex items-center gap-4">
          <div className="bg-purple-500 p-3 rounded-full">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-purple-900 mb-1">Keep Going!</h3>
            <p className="text-sm text-purple-700">
              {unlockedCount === 0 && "Start your journey by completing your profile!"}
              {unlockedCount > 0 && unlockedCount < 3 && "Great start! Keep unlocking achievements!"}
              {unlockedCount >= 3 && unlockedCount < 6 && "You're on fire! 🔥 Keep it up!"}
              {unlockedCount >= 6 && unlockedCount < totalCount && "Almost there! Just a few more to go!"}
              {unlockedCount === totalCount && "🎉 Amazing! You've unlocked everything!"}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

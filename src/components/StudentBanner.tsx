import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { GraduationCap, Calendar, TrendingUp, Award } from 'lucide-react';

interface StudentBannerProps {
  major: string;
  semester: number;
  graduationDate: string;
  points?: number;
  level?: number;
  streak?: number;
}

export function StudentBanner({ 
  major, 
  semester, 
  graduationDate,
  points = 0,
  level = 1,
  streak = 0
}: StudentBannerProps) {
  // Calculate days until graduation
  const calculateDaysUntilGraduation = () => {
    const today = new Date();
    const gradDate = new Date(graduationDate);
    const diffTime = gradDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Calculate progress percentage (assuming 8 semesters)
  const calculateProgress = () => {
    const totalSemesters = 8;
    return Math.min(100, ((semester / totalSemesters) * 100));
  };

  const daysUntilGrad = calculateDaysUntilGraduation();
  const progressPercentage = calculateProgress();

  // Format graduation date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-6 mb-6 overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="w-8 h-8" />
              <h2 className="text-3xl font-bold">Student Journey</h2>
            </div>
            <p className="text-lg opacity-90">
              {major} • Semester {semester}
            </p>
          </div>
          
          {/* Countdown */}
          <div className="text-right bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-4xl font-bold">{daysUntilGrad}</div>
            <div className="text-sm opacity-90">days until graduation</div>
            <div className="text-xs opacity-75 mt-1">{formatDate(graduationDate)}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2 opacity-90">
            <span>Academic Progress</span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
          <div className="bg-white/20 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-white h-full rounded-full transition-all duration-500 ease-out shadow-lg"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs opacity-75">Level</span>
            </div>
            <div className="text-2xl font-bold">{level}</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4" />
              <span className="text-xs opacity-75">Points</span>
            </div>
            <div className="text-2xl font-bold">{points.toLocaleString()}</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-xs opacity-75">Streak</span>
            </div>
            <div className="text-2xl font-bold">{streak} 🔥</div>
          </div>
        </div>
      </div>
    </Card>
  );
}

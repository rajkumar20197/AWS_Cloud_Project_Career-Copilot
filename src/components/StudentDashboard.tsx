import { StudentBanner } from './StudentBanner';
import { DailyQuestionCard } from './DailyQuestionCard';
import { StudyMaterialsCard } from './StudyMaterialsCard';
import { InteractiveDashboard } from './InteractiveDashboard';
import type { NavigationPage } from '../types';

interface StudentDashboardProps {
  onNavigate: (page: NavigationPage) => void;
  userData?: {
    isStudent?: boolean;
    studentProfile?: {
      major?: string;
      currentSemester?: number;
      graduationDate?: string;
    };
    progress?: {
      totalPoints?: number;
      level?: number;
      currentStreak?: number;
    };
  };
}

export function StudentDashboard({ onNavigate, userData }: StudentDashboardProps) {
  const isStudent = userData?.isStudent || false;
  const studentProfile = userData?.studentProfile;
  const progress = userData?.progress;

  return (
    <div className="space-y-6">
      {/* Student Banner - Only show for students */}
      {isStudent && studentProfile?.graduationDate && (
        <StudentBanner
          major={studentProfile.major || 'Computer Science'}
          semester={studentProfile.currentSemester || 1}
          graduationDate={studentProfile.graduationDate}
          points={progress?.totalPoints || 0}
          level={progress?.level || 1}
          streak={progress?.currentStreak || 0}
        />
      )}

      {/* Daily Interview Question - Only show for students */}
      {isStudent && (
        <DailyQuestionCard />
      )}

      {/* Study Materials - Only show for students */}
      {isStudent && studentProfile?.major && (
        <StudyMaterialsCard major={studentProfile.major} />
      )}

      {/* Regular Dashboard */}
      <InteractiveDashboard onNavigate={onNavigate} userData={userData} />
    </div>
  );
}

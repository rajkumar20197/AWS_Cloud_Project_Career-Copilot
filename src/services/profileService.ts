const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

export interface UserProfile {
  userId: string;
  email: string;
  name: string;
  profile?: {
    currentRole?: string;
    targetRole?: string;
    skills?: string[];
    experience?: string;
    graduationDate?: string;
    location?: string;
    salaryExpectation?: number;
  };
  isStudent?: boolean;
  studentProfile?: {
    graduationDate?: string;
    major?: string;
    university?: string;
    currentSemester?: number;
    studyGoalsPerWeek?: number;
  };
  progress?: {
    totalPoints?: number;
    currentStreak?: number;
    level?: number;
    questionsAttempted?: number;
    questionsSolved?: number;
  };
  referralCode?: string;
  referralCount?: number;
  referralCredits?: number;
}

export class ProfileService {
  /**
   * Save user profile to backend
   */
  static async saveProfile(userId: string, profileData: Partial<UserProfile>): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          email: profileData.email,
          name: profileData.name,
          profile: profileData.profile,
          isStudent: profileData.isStudent,
          major: profileData.studentProfile?.major,
          university: profileData.studentProfile?.university,
          currentSemester: profileData.studentProfile?.currentSemester,
          graduationDate: profileData.studentProfile?.graduationDate,
          studyGoalsPerWeek: profileData.studentProfile?.studyGoalsPerWeek,
          totalPoints: profileData.progress?.totalPoints || 0,
          currentStreak: profileData.progress?.currentStreak || 0,
          level: profileData.progress?.level || 1,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save profile');
      }

      const data = await response.json();
      console.log('✅ Profile saved successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error saving profile:', error);
      throw error;
    }
  }

  /**
   * Get user profile from backend
   */
  static async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const response = await fetch(`${API_URL}/users/profile/${userId}`);

      if (!response.ok) {
        if (response.status === 404) {
          console.log('Profile not found for user:', userId);
          return null;
        }
        throw new Error('Failed to get profile');
      }

      const data = await response.json();
      console.log('✅ Profile loaded:', data.user);
      return data.user;
    } catch (error) {
      console.error('❌ Error getting profile:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/users/profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      console.log('✅ Profile updated:', data);
      return data;
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      throw error;
    }
  }

  /**
   * Generate unique user ID
   */
  static generateUserId(): string {
    return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get user ID from localStorage or generate new
   */
  static getUserId(): string {
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = this.generateUserId();
      localStorage.setItem('userId', userId);
    }
    return userId;
  }

  /**
   * Clear user session
   */
  static clearSession(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('userProfile');
  }
}

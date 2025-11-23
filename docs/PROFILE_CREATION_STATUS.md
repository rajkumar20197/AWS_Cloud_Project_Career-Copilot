# 📋 Profile Creation Status & Implementation

## ✅ Current Status

### Backend (Complete)

- ✅ DynamoDB tables exist (`ai-career-users`, `ai-career-jobs`, `ai-career-applications`)
- ✅ Profile API routes created (`server/routes/users.js`)
- ✅ DynamoDB service with CRUD operations (`server/services/dynamoService.js`)
- ✅ Student fields added to schema
- ✅ Progress tracking fields added
- ✅ Server running on port 3001

### Frontend (Partially Complete)

- ✅ Onboarding component with student fields
- ✅ Student data collected (major, semester, graduation date)
- ⚠️ **MISSING:** API call to save profile to backend
- ⚠️ **MISSING:** Profile persistence after onboarding

---

## 🔴 Issue: Profile Not Being Saved

**Problem:** When users complete onboarding, their profile data is NOT saved to DynamoDB.

**Why:** The `onComplete` callback in `Onboarding.tsx` only passes data to `App.tsx`, but doesn't call the backend API.

**Impact:**

- User data is lost on page refresh
- Student features don't persist
- QR codes can't access user data
- No profile to display

---

## 🔧 Solution: Add Profile API Service

### Step 1: Create API Service (5 min)

**File:** `src/services/profileService.ts`

```typescript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

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
}

export class ProfileService {
  /**
   * Save user profile
   */
  static async saveProfile(
    userId: string,
    profileData: Partial<UserProfile>
  ): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/users/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error saving profile:", error);
      throw error;
    }
  }

  /**
   * Get user profile
   */
  static async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const response = await fetch(`${API_URL}/users/profile/${userId}`);

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error("Failed to get profile");
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error("Error getting profile:", error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    userId: string,
    updates: Partial<UserProfile>
  ): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/users/profile/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }

  /**
   * Generate unique user ID
   */
  static generateUserId(): string {
    return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

### Step 2: Update App.tsx to Save Profile (10 min)

**File:** `src/App.tsx`

```typescript
import { ProfileService } from "./services/profileService";

// Update handleOnboardingComplete
const handleOnboardingComplete = async (data: any) => {
  console.log("User data:", data);

  try {
    // Generate user ID (or get from auth)
    const userId = ProfileService.generateUserId();

    // Format user data for student dashboard
    const formattedData = {
      userId,
      email: data.email,
      name: data.name,
      profile: {
        currentRole: data.currentRole,
        targetRole: data.targetRole,
        skills: data.skills,
        experience: data.experience,
        location: data.locations?.[0],
        salaryExpectation: data.salaryMin,
      },
      isStudent: data.careerStage === "student",
      studentProfile:
        data.careerStage === "student"
          ? {
              major: data.major,
              currentSemester: data.currentSemester,
              graduationDate: data.graduationDate,
              studyGoalsPerWeek: 10,
            }
          : null,
      progress: {
        totalPoints: 0,
        level: 1,
        currentStreak: 0,
      },
    };

    // Save to backend
    await ProfileService.saveProfile(userId, formattedData);

    // Save to state
    setUserData(formattedData);

    // Save userId to localStorage
    localStorage.setItem("userId", userId);

    setIsOnboarded(true);
    setCurrentPage("dashboard");

    toast.success("Profile saved successfully!");
  } catch (error) {
    console.error("Error saving profile:", error);
    toast.error("Failed to save profile. Please try again.");
  }
};
```

### Step 3: Load Profile on App Start (5 min)

**File:** `src/App.tsx`

```typescript
// Add to checkAuthStatus
const checkAuthStatus = async () => {
  try {
    const isAuth = await AuthService.isAuthenticated();
    if (isAuth) {
      setIsLoggedIn(true);

      // Load user profile
      const userId = localStorage.getItem("userId");
      if (userId) {
        const profile = await ProfileService.getProfile(userId);
        if (profile) {
          setUserData(profile);
          setIsOnboarded(true);
          setCurrentPage("dashboard");
        }
      }
    }
  } catch (error) {
    console.error("Auth check error:", error);
  } finally {
    setIsCheckingAuth(false);
  }
};
```

---

## 🧪 Testing Profile Creation

### Test 1: Save Profile

```bash
# Test profile creation
curl -X POST http://localhost:3001/api/users/profile \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "email": "test@example.com",
    "name": "Test User",
    "profile": {
      "currentRole": "Student",
      "targetRole": "Software Engineer",
      "skills": ["JavaScript", "React"]
    },
    "isStudent": true,
    "major": "Computer Science",
    "currentSemester": 3,
    "graduationDate": "2025-05-15"
  }'
```

### Test 2: Get Profile

```bash
# Get profile
curl http://localhost:3001/api/users/profile/test-user-123
```

### Test 3: Update Profile

```bash
# Update profile
curl -X PUT http://localhost:3001/api/users/profile/test-user-123 \
  -H "Content-Type: application/json" \
  -d '{
    "progress": {
      "totalPoints": 100,
      "currentStreak": 5,
      "level": 2
    }
  }'
```

---

## 📊 Profile Data Flow

```
User Completes Onboarding
    ↓
Generate User ID
    ↓
Format Profile Data
    ↓
POST /api/users/profile
    ↓
Save to DynamoDB
    ↓
Return Success
    ↓
Save to App State
    ↓
Save userId to localStorage
    ↓
Redirect to Dashboard
```

---

## 🎯 What Gets Saved

### Basic Info

- userId (generated)
- email
- name

### Profile

- currentRole
- targetRole
- skills
- experience
- location
- salaryExpectation

### Student Info (if student)

- isStudent: true
- studentProfile:
  - major
  - currentSemester
  - graduationDate
  - university
  - studyGoalsPerWeek

### Progress

- totalPoints: 0
- currentStreak: 0
- level: 1
- questionsAttempted: 0
- questionsSolved: 0

---

## 🔧 Quick Fix (30 minutes)

### Option 1: Implement Full Solution

1. Create `src/services/profileService.ts` (10 min)
2. Update `App.tsx` to save profile (10 min)
3. Update `App.tsx` to load profile (5 min)
4. Test the flow (5 min)

### Option 2: Quick Test

1. Test API endpoints with curl (5 min)
2. Verify DynamoDB tables (2 min)
3. Check if data persists (3 min)

---

## 🚨 Current Issues

1. **No API Call** - Onboarding doesn't save to backend
2. **No Persistence** - Data lost on refresh
3. **No User ID** - No way to identify users
4. **No Loading** - Can't restore user session

---

## ✅ After Implementation

**What Will Work:**

- ✅ Profile saved to DynamoDB
- ✅ Data persists across sessions
- ✅ Student features work
- ✅ QR codes have user data
- ✅ Progress tracking works
- ✅ Analytics work

---

## 💡 Recommendation

**Implement the full solution (30 minutes):**

1. Create ProfileService
2. Update App.tsx
3. Test the flow
4. Verify persistence

**This will make your app production-ready!**

---

**Want me to implement this now?** I can:

1. Create the ProfileService
2. Update App.tsx
3. Test the integration
4. Verify it works

Let me know! 🚀

# 🚀 Student Learning Journey - Implementation Plan

## Quick Start Implementation (2-3 Days)

This plan will get the core student features working quickly.

---

## 📋 Phase 1: Core Setup (Day 1 - 4 hours)

### 1. Update User Profile Schema

**File:** `infrastructure/users-table.json`

Add student fields:

```json
{
  "userId": "string",
  "email": "string",
  "name": "string",

  // NEW: Student fields
  "isStudent": "boolean",
  "courseStartDate": "string (ISO date)",
  "graduationDate": "string (ISO date)",
  "currentSemester": "number",
  "major": "string",
  "university": "string",
  "studyGoalsPerWeek": "number",

  // Progress tracking
  "totalStudyHours": "number",
  "questionsAttempted": "number",
  "questionsSolved": "number",
  "currentStreak": "number",
  "totalPoints": "number",
  "level": "number"
}
```

### 2. Create New DynamoDB Tables

**A. Study Materials Table**

```bash
aws dynamodb create-table \
  --table-name ai-career-study-materials \
  --attribute-definitions \
    AttributeName=materialId,AttributeType=S \
    AttributeName=category,AttributeType=S \
  --key-schema \
    AttributeName=materialId,KeyType=HASH \
    AttributeName=category,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

**B. Interview Questions Table**

```bash
aws dynamodb create-table \
  --table-name ai-career-interview-questions \
  --attribute-definitions \
    AttributeName=questionId,AttributeType=S \
    AttributeName=difficulty,AttributeType=S \
  --key-schema \
    AttributeName=questionId,KeyType=HASH \
    AttributeName=difficulty,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

**C. Student Progress Table**

```bash
aws dynamodb create-table \
  --table-name ai-career-student-progress \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
    AttributeName=date,AttributeType=S \
  --key-schema \
    AttributeName=userId,KeyType=HASH \
    AttributeName=date,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

### 3. Update Onboarding Form

**File:** `src/components/OnboardingPage.tsx`

Add student-specific questions:

```tsx
// Add after existing fields
{
  isStudent && (
    <>
      <div>
        <label>Course Start Date</label>
        <input
          type="date"
          value={courseStartDate}
          onChange={(e) => setCourseStartDate(e.target.value)}
        />
      </div>

      <div>
        <label>Expected Graduation Date</label>
        <input
          type="date"
          value={graduationDate}
          onChange={(e) => setGraduationDate(e.target.value)}
        />
      </div>

      <div>
        <label>Major/Field of Study</label>
        <input
          type="text"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
          placeholder="e.g., Computer Science"
        />
      </div>

      <div>
        <label>Current Semester</label>
        <select value={semester} onChange={(e) => setSemester(e.target.value)}>
          <option value="1">1st Semester</option>
          <option value="2">2nd Semester</option>
          {/* ... up to 8 */}
        </select>
      </div>

      <div>
        <label>Study Goals (hours per week)</label>
        <input
          type="number"
          value={studyGoals}
          onChange={(e) => setStudyGoals(e.target.value)}
          min="5"
          max="40"
        />
      </div>
    </>
  );
}
```

---

## 📋 Phase 2: Study Materials (Day 1 - 3 hours)

### 1. Create Study Materials Service

**File:** `server/services/studyMaterialsService.js`

```javascript
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

class StudyMaterialsService {
  constructor() {
    this.tableName = "ai-career-study-materials";
  }

  // Get materials by category
  async getMaterialsByCategory(category, limit = 10) {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: "CategoryIndex",
      KeyConditionExpression: "category = :category",
      ExpressionAttributeValues: {
        ":category": category,
      },
      Limit: limit,
    });

    const response = await docClient.send(command);
    return response.Items || [];
  }

  // Get personalized materials using AI
  async getPersonalizedMaterials(userId, studentProfile) {
    const { major, currentSemester, graduationDate, skills } = studentProfile;

    // Calculate days until graduation
    const daysUntilGrad = Math.floor(
      (new Date(graduationDate) - new Date()) / (1000 * 60 * 60 * 24)
    );

    // AI prompt for recommendations
    const prompt = `
    Student Profile:
    - Major: ${major}
    - Current Semester: ${currentSemester}
    - Days until graduation: ${daysUntilGrad}
    - Current skills: ${skills.join(", ")}
    
    Recommend 5 study topics for this week with:
    1. Topic name
    2. Why it's important
    3. Estimated study time (hours)
    4. Difficulty level (Beginner/Intermediate/Advanced)
    5. Key concepts to learn
    
    Return as JSON array.
    `;

    // Call Bedrock AI
    const recommendations = await this.callBedrockForRecommendations(prompt);

    return recommendations;
  }

  // Seed initial materials (run once)
  async seedMaterials() {
    const materials = [
      {
        materialId: "mat-001",
        category: "Data Structures",
        title: "Arrays and Strings Fundamentals",
        description: "Master the basics of arrays and string manipulation",
        url: "https://leetcode.com/explore/learn/card/array-and-string/",
        difficulty: "Beginner",
        estimatedTime: 4,
        topics: ["Arrays", "Strings", "Two Pointers"],
        rating: 4.5,
      },
      {
        materialId: "mat-002",
        category: "Algorithms",
        title: "Sorting and Searching",
        description: "Learn essential sorting and searching algorithms",
        url: "https://www.geeksforgeeks.org/sorting-algorithms/",
        difficulty: "Intermediate",
        estimatedTime: 6,
        topics: ["Sorting", "Binary Search", "Complexity"],
        rating: 4.7,
      },
      // Add more materials...
    ];

    for (const material of materials) {
      await docClient.send(
        new PutCommand({
          TableName: this.tableName,
          Item: material,
        })
      );
    }
  }
}

module.exports = new StudyMaterialsService();
```

### 2. Create API Routes

**File:** `server/routes/student.js`

```javascript
const express = require("express");
const router = express.Router();
const StudyMaterialsService = require("../services/studyMaterialsService");
const InterviewQuestionsService = require("../services/interviewQuestionsService");
const ProgressService = require("../services/progressService");

// Get personalized study plan
router.get("/study-plan/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user profile
    const profile = await getUserProfile(userId);

    // Get AI recommendations
    const materials = await StudyMaterialsService.getPersonalizedMaterials(
      userId,
      profile
    );

    res.json({
      success: true,
      studyPlan: materials,
      daysUntilGraduation: calculateDaysUntilGrad(profile.graduationDate),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get daily interview question
router.get("/daily-question/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await getUserProfile(userId);

    const question = await InterviewQuestionsService.getDailyQuestion(
      profile.level,
      profile.major
    );

    res.json({
      success: true,
      question,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Track study session
router.post("/track-session", async (req, res) => {
  try {
    const { userId, topic, duration, completed } = req.body;

    await ProgressService.trackSession({
      userId,
      topic,
      duration,
      completed,
      date: new Date().toISOString(),
    });

    // Update streak and points
    const updatedProfile = await ProgressService.updateProgress(userId);

    res.json({
      success: true,
      profile: updatedProfile,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

---

## 📋 Phase 3: Interview Questions (Day 2 - 3 hours)

### 1. Create Interview Questions Service

**File:** `server/services/interviewQuestionsService.js`

```javascript
class InterviewQuestionsService {
  constructor() {
    this.tableName = "ai-career-interview-questions";
  }

  // Get daily question based on student level
  async getDailyQuestion(level, major) {
    // Determine difficulty based on level
    const difficulty = level < 3 ? "Easy" : level < 5 ? "Medium" : "Hard";

    // Get random question of appropriate difficulty
    const questions = await this.getQuestionsByDifficulty(difficulty);
    const randomIndex = Math.floor(Math.random() * questions.length);

    return questions[randomIndex];
  }

  // Seed interview questions (run once)
  async seedQuestions() {
    const questions = [
      {
        questionId: "q-001",
        difficulty: "Easy",
        question:
          "Two Sum: Given an array of integers, return indices of two numbers that add up to a target.",
        company: "Amazon",
        topic: ["Arrays", "Hash Table"],
        askedDate: new Date().toISOString(),
        solution: "Use hash map to store complements...",
        hints: [
          "Think about using a hash map",
          "Store the complement of each number",
          "Check if current number exists in map",
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
      },
      {
        questionId: "q-002",
        difficulty: "Medium",
        question: "Longest Substring Without Repeating Characters",
        company: "Google",
        topic: ["Strings", "Sliding Window"],
        askedDate: new Date().toISOString(),
        solution: "Use sliding window technique...",
        hints: [
          "Use sliding window approach",
          "Track characters in current window",
          "Move left pointer when duplicate found",
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(min(m,n))",
      },
      // Add 50+ more questions...
    ];

    for (const question of questions) {
      await docClient.send(
        new PutCommand({
          TableName: this.tableName,
          Item: question,
        })
      );
    }
  }
}

module.exports = new InterviewQuestionsService();
```

---

## 📋 Phase 4: Study Breaks & Gamification (Day 2 - 4 hours)

### 1. Create Break Activities Component

**File:** `src/components/BreakActivity.tsx`

```tsx
import React, { useState, useEffect } from "react";

interface BreakActivityProps {
  onComplete: () => void;
  duration: number; // minutes
}

export const BreakActivity: React.FC<BreakActivityProps> = ({
  onComplete,
  duration,
}) => {
  const [activity, setActivity] = useState(null);
  const [timeLeft, setTimeLeft] = useState(duration * 60);

  useEffect(() => {
    // Fetch random break activity
    fetchBreakActivity();

    // Start countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const activities = {
    brainTeaser: <BrainTeaserGame />,
    codeGolf: <CodeGolfChallenge />,
    techTrivia: <TechTriviaQuiz />,
    breathingExercise: <BreathingExercise />,
  };

  return (
    <div className="break-activity-modal">
      <h2>🎮 Break Time!</h2>
      <p>
        Time remaining: {Math.floor(timeLeft / 60)}:{timeLeft % 60}
      </p>

      {activity && activities[activity.type]}

      <button onClick={onComplete}>Back to Study 📚</button>
    </div>
  );
};
```

### 2. Create Progress Dashboard

**File:** `src/components/StudentDashboard.tsx`

```tsx
import React, { useEffect, useState } from "react";

export const StudentDashboard: React.FC = () => {
  const [profile, setProfile] = useState(null);
  const [studyPlan, setStudyPlan] = useState([]);
  const [dailyQuestion, setDailyQuestion] = useState(null);
  const [showBreak, setShowBreak] = useState(false);

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = async () => {
    // Fetch student profile
    const profileData = await fetch(`/api/student/profile/${userId}`);
    setProfile(await profileData.json());

    // Fetch study plan
    const planData = await fetch(`/api/student/study-plan/${userId}`);
    setStudyPlan(await planData.json());

    // Fetch daily question
    const questionData = await fetch(`/api/student/daily-question/${userId}`);
    setDailyQuestion(await questionData.json());
  };

  return (
    <div className="student-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>🎓 Welcome back, {profile?.name}!</h1>
        <div className="stats">
          <div>📅 {daysUntilGraduation} days until graduation</div>
          <div>🔥 {profile?.currentStreak} day streak</div>
          <div>⭐ Level {profile?.level}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <h2>Your Journey</h2>
        <ProgressBar current={profile?.progressPercentage} total={100} />
      </div>

      {/* Today's Plan */}
      <div className="study-plan">
        <h2>📚 Today's Learning Plan</h2>
        {studyPlan.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            onComplete={() => markComplete(topic.id)}
          />
        ))}
      </div>

      {/* Daily Question */}
      <div className="daily-question">
        <h2>💡 Daily Interview Question</h2>
        <QuestionCard
          question={dailyQuestion}
          onAttempt={() => openCodeEditor()}
        />
      </div>

      {/* Break Suggestion */}
      {showBreak && (
        <BreakActivity onComplete={() => setShowBreak(false)} duration={5} />
      )}
    </div>
  );
};
```

---

## 📋 Phase 5: Testing (Day 3 - 2 hours)

### Test Checklist

- [ ] Student can set graduation date in onboarding
- [ ] Dashboard shows days until graduation
- [ ] Study materials are personalized
- [ ] Daily question appears
- [ ] Study session tracking works
- [ ] Break activities trigger after 25 minutes
- [ ] Points and streak update correctly
- [ ] Progress bar shows accurate percentage

---

## 🚀 Quick Implementation Commands

```bash
# 1. Create DynamoDB tables
cd infrastructure
./create-student-tables.sh

# 2. Install dependencies
cd server
npm install

# 3. Seed initial data
node scripts/seedStudyMaterials.js
node scripts/seedInterviewQuestions.js

# 4. Start servers
npm start  # Backend
cd .. && npm run dev  # Frontend

# 5. Test
curl http://localhost:3001/api/student/study-plan/test-user-123
```

---

## 📊 Success Metrics

After implementation, track:

- Student signup rate
- Daily active students
- Average study time per session
- Questions attempted per day
- Study streak retention
- Break activity completion rate

---

## 💡 Quick Wins

**Day 1:**

- ✅ Add graduation date to profile
- ✅ Show countdown on dashboard
- ✅ Display basic study materials

**Day 2:**

- ✅ Add daily interview question
- ✅ Implement study session tracking
- ✅ Add simple break reminder

**Day 3:**

- ✅ Add points and levels
- ✅ Implement study streak
- ✅ Polish UI

---

**Ready to start?** Let me know which phase you want to implement first!

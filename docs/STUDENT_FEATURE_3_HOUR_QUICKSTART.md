# 🚀 Student Feature - 3 Hour Quick Start

## Goal: Get Core Student Features Working in 3 Hours

We'll implement the **most impactful features** that provide immediate value to students.

---

## ⏱️ Time Breakdown

- **Hour 1:** Student profile + graduation countdown (MVP)
- **Hour 2:** Daily interview question feature
- **Hour 3:** Study materials + basic progress tracking

**Result:** Students can track their journey, get daily questions, and access study materials!

---

## 🎯 Hour 1: Student Profile & Countdown (60 min)

### Step 1: Update User Profile (15 min)

**File:** `server/services/dynamoService.js`

Add to existing `createUserProfile` function:

```javascript
// Add these fields to user profile
async createUserProfile(userId, profileData) {
  const profile = {
    userId,
    email: profileData.email,
    name: profileData.name,

    // Existing fields
    currentRole: profileData.currentRole,
    targetRole: profileData.targetRole,
    skills: profileData.skills || [],

    // NEW: Student fields
    isStudent: profileData.isStudent || false,
    graduationDate: profileData.graduationDate || null,
    major: profileData.major || null,
    currentSemester: profileData.currentSemester || 1,

    // Progress tracking
    totalPoints: 0,
    currentStreak: 0,
    level: 1,

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Save to DynamoDB (existing code)
  // ...
}
```

### Step 2: Update Onboarding Form (20 min)

**File:** `src/components/OnboardingPage.tsx`

Add student fields to the form:

```tsx
// Add state variables
const [isStudent, setIsStudent] = useState(false);
const [graduationDate, setGraduationDate] = useState("");
const [major, setMajor] = useState("");
const [currentSemester, setCurrentSemester] = useState(1);

// Add to form (after existing fields)
<div className="form-section">
  <label className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={isStudent}
      onChange={(e) => setIsStudent(e.target.checked)}
    />
    <span>I'm currently a student</span>
  </label>
</div>;

{
  isStudent && (
    <>
      <div className="form-group">
        <label>Expected Graduation Date</label>
        <input
          type="date"
          value={graduationDate}
          onChange={(e) => setGraduationDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          required
        />
      </div>

      <div className="form-group">
        <label>Major / Field of Study</label>
        <input
          type="text"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
          placeholder="e.g., Computer Science"
          required
        />
      </div>

      <div className="form-group">
        <label>Current Semester</label>
        <select
          value={currentSemester}
          onChange={(e) => setCurrentSemester(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
            <option key={sem} value={sem}>
              Semester {sem}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

// Update handleSubmit to include new fields
const handleSubmit = async () => {
  const profileData = {
    // ... existing fields
    isStudent,
    graduationDate: isStudent ? graduationDate : null,
    major: isStudent ? major : null,
    currentSemester: isStudent ? currentSemester : null,
  };

  // Save profile (existing code)
  await saveProfile(profileData);
};
```

### Step 3: Add Countdown to Dashboard (25 min)

**File:** `src/components/Dashboard.tsx`

Add graduation countdown banner:

```tsx
// Add helper function
const calculateDaysUntilGraduation = (graduationDate: string) => {
  if (!graduationDate) return null;
  const today = new Date();
  const gradDate = new Date(graduationDate);
  const diffTime = gradDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Add to Dashboard component
export const Dashboard = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Load user profile
    loadProfile();
  }, []);

  const daysUntilGrad = profile?.isStudent
    ? calculateDaysUntilGraduation(profile.graduationDate)
    : null;

  return (
    <div className="dashboard">
      {/* Student Banner */}
      {profile?.isStudent && daysUntilGrad && (
        <div className="student-banner bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">🎓 Student Journey</h2>
              <p className="text-lg mt-2">
                {profile.major} • Semester {profile.currentSemester}
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">{daysUntilGrad}</div>
              <div className="text-sm">days until graduation</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="bg-white/20 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    ((8 - profile.currentSemester) / 8) * 100
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Rest of dashboard */}
      {/* ... existing code ... */}
    </div>
  );
};
```

**✅ Hour 1 Complete!** Students can now set graduation date and see countdown.

---

## 🎯 Hour 2: Daily Interview Question (60 min)

### Step 1: Create Questions Data (15 min)

**File:** `server/data/interviewQuestions.js`

```javascript
// Simple in-memory questions (no database needed for MVP)
const interviewQuestions = [
  {
    id: "q1",
    difficulty: "Easy",
    question: "Two Sum",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.",
    company: "Amazon",
    topics: ["Array", "Hash Table"],
    hints: [
      "Use a hash map to store complements",
      "For each number, check if target - number exists in map",
    ],
    solution: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
  },
  {
    id: "q2",
    difficulty: "Medium",
    question: "Longest Substring Without Repeating Characters",
    description:
      "Given a string s, find the length of the longest substring without repeating characters.",
    company: "Google",
    topics: ["String", "Sliding Window"],
    hints: [
      "Use sliding window technique",
      "Track characters in current window with a Set",
      "Move left pointer when duplicate found",
    ],
    solution: `function lengthOfLongestSubstring(s) {
  let maxLen = 0;
  let left = 0;
  const seen = new Set();
  
  for (let right = 0; right < s.length; right++) {
    while (seen.has(s[right])) {
      seen.delete(s[left]);
      left++;
    }
    seen.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(min(m,n))",
  },
  {
    id: "q3",
    difficulty: "Easy",
    question: "Valid Parentheses",
    description:
      'Given a string containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.',
    company: "Microsoft",
    topics: ["Stack", "String"],
    hints: [
      "Use a stack to track opening brackets",
      "For each closing bracket, check if it matches the top of stack",
    ],
    solution: `function isValid(s) {
  const stack = [];
  const pairs = { ')': '(', '}': '{', ']': '[' };
  
  for (let char of s) {
    if (char in pairs) {
      if (stack.pop() !== pairs[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
  },
  // Add 10-20 more questions...
];

// Get daily question (rotates based on day of year)
function getDailyQuestion() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  );
  const index = dayOfYear % interviewQuestions.length;
  return interviewQuestions[index];
}

// Get question by difficulty
function getQuestionByDifficulty(difficulty) {
  const filtered = interviewQuestions.filter(
    (q) => q.difficulty === difficulty
  );
  return filtered[Math.floor(Math.random() * filtered.length)];
}

module.exports = {
  getDailyQuestion,
  getQuestionByDifficulty,
  allQuestions: interviewQuestions,
};
```

### Step 2: Create API Endpoint (10 min)

**File:** `server/routes/student.js` (create new file)

```javascript
const express = require("express");
const router = express.Router();
const { getDailyQuestion } = require("../data/interviewQuestions");

// Get daily interview question
router.get("/daily-question", (req, res) => {
  try {
    const question = getDailyQuestion();
    res.json({
      success: true,
      question,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

**File:** `server/server.js` (add route)

```javascript
// Add to existing routes
const studentRoutes = require("./routes/student");
app.use("/api/student", studentRoutes);
```

### Step 3: Create Question Card Component (35 min)

**File:** `src/components/DailyQuestionCard.tsx` (create new)

```tsx
import React, { useState, useEffect } from "react";

export const DailyQuestionCard: React.FC = () => {
  const [question, setQuestion] = useState(null);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    fetchDailyQuestion();
  }, []);

  const fetchDailyQuestion = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/student/daily-question"
      );
      const data = await response.json();
      setQuestion(data.question);
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  if (!question) return <div>Loading...</div>;

  const difficultyColor = {
    Easy: "text-green-600 bg-green-100",
    Medium: "text-yellow-600 bg-yellow-100",
    Hard: "text-red-600 bg-red-100",
  };

  return (
    <div className="daily-question-card bg-white rounded-lg shadow-lg p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">💡 Daily Interview Question</h2>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            difficultyColor[question.difficulty]
          }`}
        >
          {question.difficulty}
        </span>
      </div>

      {/* Question */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">{question.question}</h3>
        <p className="text-gray-700 mb-3">{question.description}</p>

        <div className="flex gap-2 text-sm text-gray-600">
          <span>🏢 {question.company}</span>
          <span>•</span>
          <span>📚 {question.topics.join(", ")}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setShowHints(!showHints)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {showHints ? "Hide" : "Show"} Hints
        </button>
        <button
          onClick={() => setShowSolution(!showSolution)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {showSolution ? "Hide" : "Show"} Solution
        </button>
        <button
          onClick={() => window.open("https://leetcode.com", "_blank")}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Practice on LeetCode
        </button>
      </div>

      {/* Hints */}
      {showHints && (
        <div className="bg-blue-50 p-4 rounded mb-4">
          <h4 className="font-semibold mb-2">💡 Hints:</h4>
          <ol className="list-decimal list-inside space-y-1">
            {question.hints.map((hint, i) => (
              <li key={i} className="text-gray-700">
                {hint}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Solution */}
      {showSolution && (
        <div className="bg-gray-50 p-4 rounded">
          <h4 className="font-semibold mb-2">✅ Solution:</h4>
          <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto">
            <code>{question.solution}</code>
          </pre>
          <div className="mt-3 text-sm text-gray-600">
            <p>⏱️ Time Complexity: {question.timeComplexity}</p>
            <p>💾 Space Complexity: {question.spaceComplexity}</p>
          </div>
        </div>
      )}
    </div>
  );
};
```

**Add to Dashboard:**

```tsx
// In Dashboard.tsx
import { DailyQuestionCard } from "./DailyQuestionCard";

// Add after student banner
{
  profile?.isStudent && <DailyQuestionCard />;
}
```

**✅ Hour 2 Complete!** Students now get a daily interview question!

---

## 🎯 Hour 3: Study Materials & Progress (60 min)

### Step 1: Create Study Materials Data (20 min)

**File:** `server/data/studyMaterials.js`

```javascript
const studyMaterials = {
  "Computer Science": [
    {
      id: "m1",
      title: "Data Structures & Algorithms",
      description: "Master fundamental data structures and algorithms",
      resources: [
        {
          name: "LeetCode Patterns",
          url: "https://leetcode.com/explore/",
          type: "Practice",
        },
        {
          name: "Visualgo",
          url: "https://visualgo.net/",
          type: "Visualization",
        },
        {
          name: "GeeksforGeeks DSA",
          url: "https://www.geeksforgeeks.org/data-structures/",
          type: "Tutorial",
        },
      ],
      topics: [
        "Arrays",
        "Linked Lists",
        "Trees",
        "Graphs",
        "Sorting",
        "Searching",
      ],
      estimatedHours: 40,
      difficulty: "Intermediate",
    },
    {
      id: "m2",
      title: "System Design Fundamentals",
      description: "Learn to design scalable systems",
      resources: [
        {
          name: "System Design Primer",
          url: "https://github.com/donnemartin/system-design-primer",
          type: "Guide",
        },
        {
          name: "Designing Data-Intensive Applications",
          url: "https://dataintensive.net/",
          type: "Book",
        },
      ],
      topics: [
        "Scalability",
        "Load Balancing",
        "Caching",
        "Databases",
        "Microservices",
      ],
      estimatedHours: 30,
      difficulty: "Advanced",
    },
    {
      id: "m3",
      title: "Web Development",
      description: "Build modern web applications",
      resources: [
        {
          name: "MDN Web Docs",
          url: "https://developer.mozilla.org/",
          type: "Documentation",
        },
        {
          name: "freeCodeCamp",
          url: "https://www.freecodecamp.org/",
          type: "Course",
        },
        {
          name: "React Docs",
          url: "https://react.dev/",
          type: "Documentation",
        },
      ],
      topics: ["HTML", "CSS", "JavaScript", "React", "Node.js", "APIs"],
      estimatedHours: 50,
      difficulty: "Beginner",
    },
  ],
  // Add more majors...
};

function getMaterialsByMajor(major) {
  return studyMaterials[major] || studyMaterials["Computer Science"];
}

module.exports = { getMaterialsByMajor };
```

### Step 2: Create API Endpoint (10 min)

**File:** `server/routes/student.js` (add to existing)

```javascript
const { getMaterialsByMajor } = require("../data/studyMaterials");

// Get study materials
router.get("/study-materials/:major", (req, res) => {
  try {
    const { major } = req.params;
    const materials = getMaterialsByMajor(major);
    res.json({
      success: true,
      materials,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Step 3: Create Study Materials Component (30 min)

**File:** `src/components/StudyMaterialsCard.tsx`

```tsx
import React, { useState, useEffect } from "react";

export const StudyMaterialsCard: React.FC<{ major: string }> = ({ major }) => {
  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  useEffect(() => {
    fetchMaterials();
  }, [major]);

  const fetchMaterials = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/student/study-materials/${major}`
      );
      const data = await response.json();
      setMaterials(data.materials);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  const difficultyColor = {
    Beginner: "bg-green-100 text-green-800",
    Intermediate: "bg-yellow-100 text-yellow-800",
    Advanced: "bg-red-100 text-red-800",
  };

  return (
    <div className="study-materials bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">📚 Study Materials</h2>

      <div className="grid gap-4">
        {materials.map((material) => (
          <div
            key={material.id}
            className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
            onClick={() =>
              setSelectedMaterial(
                selectedMaterial?.id === material.id ? null : material
              )
            }
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold">{material.title}</h3>
                <p className="text-gray-600 text-sm">{material.description}</p>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  difficultyColor[material.difficulty]
                }`}
              >
                {material.difficulty}
              </span>
            </div>

            {/* Topics */}
            <div className="flex flex-wrap gap-2 mb-2">
              {material.topics.slice(0, 4).map((topic) => (
                <span
                  key={topic}
                  className="bg-gray-100 px-2 py-1 rounded text-xs"
                >
                  {topic}
                </span>
              ))}
              {material.topics.length > 4 && (
                <span className="text-xs text-gray-500">
                  +{material.topics.length - 4} more
                </span>
              )}
            </div>

            {/* Time estimate */}
            <div className="text-sm text-gray-600">
              ⏱️ Estimated: {material.estimatedHours} hours
            </div>

            {/* Expanded Resources */}
            {selectedMaterial?.id === material.id && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold mb-2">📖 Resources:</h4>
                <div className="space-y-2">
                  {material.resources.map((resource, i) => (
                    <a
                      key={i}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2 bg-blue-50 rounded hover:bg-blue-100"
                    >
                      <span>{resource.name}</span>
                      <span className="text-xs text-gray-600">
                        {resource.type}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
```

**Add to Dashboard:**

```tsx
// In Dashboard.tsx
import { StudyMaterialsCard } from "./StudyMaterialsCard";

// Add after DailyQuestionCard
{
  profile?.isStudent && profile?.major && (
    <StudyMaterialsCard major={profile.major} />
  );
}
```

**✅ Hour 3 Complete!** Students now have study materials!

---

## 🎉 What You Built in 3 Hours:

### ✅ Features Implemented:

1. **Student Profile**

   - Graduation date tracking
   - Major/field of study
   - Current semester

2. **Graduation Countdown**

   - Days until graduation display
   - Visual progress bar
   - Student banner on dashboard

3. **Daily Interview Question**

   - Rotates daily automatically
   - Shows difficulty, company, topics
   - Hints and solutions
   - Links to practice platforms

4. **Study Materials**
   - Curated resources by major
   - Multiple resource types
   - Difficulty levels
   - Time estimates
   - Expandable cards

---

## 🚀 Test Your Implementation:

```bash
# 1. Start backend
cd server
npm start

# 2. Start frontend (new terminal)
npm run dev

# 3. Test the flow:
# - Go to http://localhost:3000
# - Sign up as a student
# - Set graduation date
# - See countdown on dashboard
# - View daily question
# - Browse study materials
```

---

## 📊 What Students See:

```
┌─────────────────────────────────────────────┐
│  🎓 Student Journey                         │
│  Computer Science • Semester 3              │
│                                    245      │
│                              days until     │
│                              graduation     │
│  ████████████░░░░░░░░░░░░░░░░░░░░          │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  💡 Daily Interview Question        Medium  │
│                                             │
│  Longest Substring Without Repeating...     │
│  🏢 Google • 📚 String, Sliding Window      │
│                                             │
│  [Show Hints] [Show Solution] [Practice]   │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  📚 Study Materials                         │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ Data Structures & Algorithms        │   │
│  │ Master fundamental DS & Algo        │   │
│  │ Arrays • Trees • Graphs • Sorting   │   │
│  │ ⏱️ Estimated: 40 hours              │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

---

## 🔮 Next Steps (After 3 Hours):

### Quick Additions (30 min each):

- ✅ Add more interview questions (copy-paste format)
- ✅ Add more study materials for different majors
- ✅ Add simple progress tracking (questions attempted)
- ✅ Add study streak counter

### Future Enhancements:

- Points and levels system
- Break activities
- Gamification
- AI recommendations
- Mobile app

---

## 💰 Cost: $0

Everything runs on:

- ✅ Existing DynamoDB (no new tables needed)
- ✅ In-memory data (no extra storage)
- ✅ Simple API endpoints (no extra compute)

---

## 🎯 Success!

In just **3 hours**, you've added:

- ✅ Student profile tracking
- ✅ Graduation countdown
- ✅ Daily interview questions
- ✅ Study materials library

**Students can now use your app throughout their entire college journey!** 🚀

---

**Ready to implement?** Follow the steps above in order, and you'll have it working in 3 hours!

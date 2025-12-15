# 🏗️ Component Architecture Diagram

**AI Career Agent Platform - Component Tree Structure**  
**Date:** December 15, 2024  
**Purpose:** Visual representation of all component connections and relationships

---

## 📊 **Application Architecture Overview**

```
┌─────────────────────────────────────────────────────────────────────┐
│                           index.html                                 │
│                               ↓                                      │
│                           main.tsx                                   │
│                               ↓                                      │
│                           App.tsx (ROOT)                             │
│                     State Management Hub                             │
│          [currentPage, isLoggedIn, isOnboarded, userData]           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🌳 **FULL COMPONENT TREE**

```
App.tsx (Root Component)
│
├─── 🎨 UI Components (Global)
│    ├── Logo.tsx
│    ├── Toaster (from ui/sonner)
│    └── ui/* (48 shadcn/ui components)
│
├─── 📄 PUBLIC PAGES (No Authentication Required)
│    │
│    ├── 🏠 Landing Flow
│    │   └── EnhancedLandingPage.tsx
│    │       ├── Logo.tsx
│    │       ├── Button (ui/button)
│    │       ├── Badge (ui/badge)
│    │       ├── HowItWorksVisual.tsx
│    │       ├── StudentBanner.tsx
│    │       ├── Copyright.tsx
│    │       └── CookieConsent.tsx
│    │
│    ├── 🔐 Authentication Flow
│    │   ├── LoginPage.tsx
│    │   │   ├── Logo.tsx
│    │   │   ├── Button (ui/button)
│    │   │   ├── Input (ui/input)
│    │   │   ├── Card (ui/card)
│    │   │   ├── Tabs (ui/tabs)
│    │   │   ├── AWS Cognito Integration
│    │   │   ├── Google OAuth
│    │   │   ├── GitHub OAuth
│    │   │   └── ErrorMessage.tsx
│    │   │
│    │   └── PasswordReset.tsx
│    │       └── ErrorMessage.tsx
│    │
│    ├── 📋 Legal & Support Pages
│    │   ├── Contact.tsx
│    │   │   ├── Logo.tsx
│    │   │   ├── Button (ui/button)
│    │   │   ├── Input (ui/input)
│    │   │   └── Textarea (ui/textarea)
│    │   │
│    │   ├── PrivacyPolicy.tsx
│    │   │   └── Logo.tsx
│    │   │
│    │   ├── TermsOfService.tsx
│    │   │   └── Logo.tsx
│    │   │
│    │   ├── FAQ.tsx
│    │   │   ├── Logo.tsx
│    │   │   └── Accordion (ui/accordion)
│    │   │
│    │   ├── HelpCenter.tsx
│    │   │   ├── Logo.tsx
│    │   │   ├── Tabs (ui/tabs)
│    │   │   └── Card (ui/card)
│    │   │
│    │   └── SupportPage.tsx
│    │       ├── Tabs (ui/tabs)
│    │       ├── Card (ui/card)
│    │       └── Button (ui/button)
│    │
│    └── ⚠️ Error Pages
│        ├── NotFound.tsx (404)
│        ├── ServerError.tsx (500)
│        ├── Unauthorized.tsx (401)
│        ├── RateLimitExceeded.tsx (429)
│        ├── Maintenance.tsx
│        ├── Offline.tsx
│        └── ComingSoon.tsx
│
│
├─── 🔒 PROTECTED PAGES (Authentication Required)
│    │
│    ├── 🛡️ AuthGuard.tsx (Wrapper for all protected routes)
│    │   └── Checks authentication state
│    │
│    ├── 🎯 Onboarding Flow
│    │   └── Onboarding.tsx
│    │       ├── Card (ui/card)
│    │       ├── Button (ui/button)
│    │       ├── Input (ui/input)
│    │       ├── Select (ui/select)
│    │       ├── Slider (ui/slider)
│    │       ├── Progress (ui/progress)
│    │       └── AvatarUpload.tsx
│    │           └── Avatar (ui/avatar)
│    │
│    └── 📱 Main Application (Dashboard Layout)
│        │
│        ├─── 🎨 LAYOUT COMPONENTS
│        │    │
│        │    ├── Sidebar Navigation
│        │    │   ├── Logo.tsx (icon/full variants)
│        │    │   ├── Navigation Items (15 items)
│        │    │   ├── Badge (ui/badge)
│        │    │   ├── Separator (ui/separator)
│        │    │   └── User Profile Section
│        │    │       ├── Avatar (ui/avatar)
│        │    │       └── Logout Button
│        │    │
│        │    └── Header Bar
│        │        ├── Menu Toggle Button
│        │        ├── App Title + Copyright
│        │        └── Notification Bell
│        │            └── Badge (notification count)
│        │
│        └─── 📊 DASHBOARD PAGES (Main Content Area)
│             │
│             ├── 🏠 Main Dashboard
│             │   └── InteractiveDashboard.tsx
│             │       ├── Card (ui/card)
│             │       ├── Button (ui/button)
│             │       ├── Badge (ui/badge)
│             │       ├── Progress (ui/progress)
│             │       ├── Tabs (ui/tabs)
│             │       ├── Chart components
│             │       └── Quick action cards
│             │
│             ├── ☀️ Morning Dashboard
│             │   └── MorningDashboard.jsx
│             │       ├── Calendar view
│             │       ├── Today's tasks
│             │       ├── Weather widget
│             │       └── Quick stats
│             │
│             ├── 🤖 AI Scheduling
│             │   ├── SchedulingDashboard.jsx
│             │   │   ├── Calendar (ui/calendar)
│             │   │   ├── Card (ui/card)
│             │   │   ├── Button (ui/button)
│             │   │   └── AI scheduling logic
│             │   │
│             │   └── AvailabilitySettings.jsx
│             │       ├── TimePicker
│             │       ├── Switch (ui/switch)
│             │       ├── Card (ui/card)
│             │       └── Availability grid
│             │
│             ├── 📈 Application Tracking
│             │   ├── ApplicationTrackingDashboard.jsx
│             │   │   ├── Table (ui/table)
│             │   │   ├── Card (ui/card)
│             │   │   ├── Badge (ui/badge)
│             │   │   ├── Progress (ui/progress)
│             │   │   └── Chart components
│             │   │
│             │   └── ApplicationTracker.tsx
│             │       ├── Kanban board
│             │       ├── Card (ui/card)
│             │       ├── Button (ui/button)
│             │       ├── Badge (ui/badge)
│             │       └── Drag-and-drop interface
│             │
│             ├── 🔍 Job Search & Discovery
│             │   ├── JobSearchDashboard.tsx
│             │   │   ├── Search (ui/input)
│             │   │   ├── Filter (ui/select)
│             │   │   ├── Card (ui/card)
│             │   │   ├── Badge (ui/badge)
│             │   │   ├── Button (ui/button)
│             │   │   └── Job listing cards
│             │   │
│             │   └── JobSwiper.tsx
│             │       ├── Card (ui/card)
│             │       ├── Button (ui/button)
│             │       ├── Badge (ui/badge)
│             │       ├── Swipe gestures
│             │       └── Like/Dislike actions
│             │
│             ├── 📄 Resume & Cover Letter
│             │   ├── ResumeOptimizer.tsx
│             │   │   ├── Card (ui/card)
│             │   │   ├── Button (ui/button)
│             │   │   ├── Textarea (ui/textarea)
│             │   │   ├── Progress (ui/progress)
│             │   │   ├── Badge (ui/badge)
│             │   │   ├── AI analysis engine
│             │   │   └── ATS score calculator
│             │   │
│             │   └── CoverLetterGenerator.tsx
│             │       ├── Card (ui/card)
│             │       ├── Button (ui/button)
│             │       ├── Textarea (ui/textarea)
│             │       ├── Select (ui/select)
│             │       └── AI generation engine
│             │
│             ├── 🎤 Interview Preparation
│             │   └── AIMockInterview.tsx
│             │       ├── Card (ui/card)
│             │       ├── Button (ui/button)
│             │       ├── Badge (ui/badge)
│             │       ├── Progress (ui/progress)
│             │       ├── VideoModal.tsx
│             │       ├── Audio recording
│             │       ├── AI feedback engine
│             │       └── Question bank
│             │
│             ├── 🎯 Skill Development
│             │   └── SkillGapAnalyzer.tsx
│             │       ├── Card (ui/card)
│             │       ├── Button (ui/button)
│             │       ├── Badge (ui/badge)
│             │       ├── Progress (ui/progress)
│             │       ├── Chart components
│             │       ├── Skill recommendations
│             │       └── Learning resources
│             │
│             ├── ⚖️ Offer Management
│             │   └── OfferComparison.tsx
│             │       ├── Card (ui/card)
│             │       ├── Button (ui/button)
│             │       ├── Input (ui/input)
│             │       ├── Table (ui/table)
│             │       ├── Comparison matrix
│             │       └── Decision calculator
│             │
│             ├── 📊 Market Intelligence
│             │   └── MarketIntelligence.tsx
│             │       ├── Card (ui/card)
│             │       ├── Tabs (ui/tabs)
│             │       ├── Chart components
│             │       ├── Badge (ui/badge)
│             │       ├── Salary trends
│             │       ├── Skill demand data
│             │       └── Market insights
│             │
│             ├── 📧 Gmail & Calendar Integration
│             │   └── GmailIntegration.tsx
│             │       ├── Card (ui/card)
│             │       ├── Button (ui/button)
│             │       ├── Badge (ui/badge)
│             │       ├── Tabs (ui/tabs)
│             │       ├── Email list
│             │       ├── Calendar view
│             │       ├── CalendarIntegration.tsx
│             │       └── Google API integration
│             │
│             ├── ⚙️ Settings & Configuration
│             │   └── SettingsPage.tsx
│             │       ├── Tabs (ui/tabs)
│             │       ├── Card (ui/card)
│             │       ├── Button (ui/button)
│             │       ├── Input (ui/input)
│             │       ├── Switch (ui/switch)
│             │       ├── Select (ui/select)
│             │       ├── AvatarUpload.tsx
│             │       ├── SubscriptionSettings.tsx
│             │       │   ├── Card (ui/card)
│             │       │   ├── Button (ui/button)
│             │       │   ├── Badge (ui/badge)
│             │       │   └── SubscriptionModal.tsx
│             │       │       ├── Dialog (ui/dialog)
│             │       │       ├── PaymentForm.tsx
│             │       │       └── Stripe integration
│             │       ├── QRHub.tsx
│             │       │   ├── Tabs (ui/tabs)
│             │       │   ├── ProfileQRCode.tsx
│             │       │   │   └── CustomQRCode.tsx
│             │       │   ├── ReferralQRCode.tsx
│             │       │   │   └── CustomQRCode.tsx
│             │       │   ├── QRCodeGenerator.tsx
│             │       │   │   └── CustomQRCode.tsx
│             │       │   └── QRAnalytics.tsx
│             │       │       └── Chart components
│             │       └── Notification preferences
│             │
│             └── 🧪 Testing & Development
│                 ├── TestComponents.tsx (pages/)
│                 │   └── All UI component demos
│                 │
│                 ├── ComponentTest.tsx (components/)
│                 │   └── Component testing interface
│                 │
│                 └── TestPage.tsx (root)
│                     └── System testing interface
│
│
└─── 🔧 UTILITY & ADMIN COMPONENTS (Not in main flow)
     │
     ├── Admin Components
     │   ├── AdminDashboard.tsx
     │   │   ├── Card (ui/card)
     │   │   ├── Table (ui/table)
     │   │   ├── Badge (ui/badge)
     │   │   └── Admin controls
     │   │
     │   ├── AdminLogin.tsx
     │   │   └── Separate admin auth
     │   │
     │   └── AdminServiceConfig.tsx
     │       ├── Tabs (ui/tabs)
     │       ├── Card (ui/card)
     │       ├── Switch (ui/switch)
     │       └── Service configuration
     │
     ├── User Management
     │   ├── UserDashboard.tsx
     │   ├── UserLogin.tsx
     │   ├── UserRegistration.tsx
     │   └── StudentDashboard.tsx
     │
     ├── Payment Components
     │   ├── PaymentForm.tsx
     │   ├── PaymentSuccess.tsx
     │   ├── PaymentFailed.tsx
     │   └── PricingPage.tsx
     │
     ├── Utility Components
     │   ├── ErrorBoundary.tsx
     │   ├── ErrorMessage.tsx
     │   ├── DebugPanel.tsx
     │   ├── AWSConfigStatus.tsx
     │   ├── JobPortalStatus.tsx
     │   ├── PageTransition.tsx
     │   ├── UniversalHeader.tsx
     │   ├── UpgradeButton.tsx
     │   ├── ContinueOnMobile.tsx
     │   └── EnhancedCountdownTimer.tsx
     │
     ├── Gamification
     │   ├── AchievementBadges.tsx
     │   ├── DailyQuestionCard.tsx
     │   └── StudyMaterialsCard.tsx
     │
     ├── Agent Features
     │   ├── AgentDashboard.tsx
     │   ├── AIWorkflowGuide.tsx
     │   └── DemoActivator.jsx
     │
     └── Figma Integration
         └── figma/
             └── FigmaEmbed.tsx
```

---

## 🔄 **DATA FLOW DIAGRAM**

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER JOURNEY                              │
└─────────────────────────────────────────────────────────────────┘

1️⃣ LANDING → LOGIN → ONBOARDING → DASHBOARD
   ↓           ↓         ↓            ↓
   Public    Auth      Profile     Protected
   Page      Flow      Setup       Content

┌─────────────────────────────────────────────────────────────────┐
│                     STATE MANAGEMENT                             │
└─────────────────────────────────────────────────────────────────┘

App.tsx (Root State)
├── currentPage: NavigationPage
├── isLoggedIn: boolean
├── isOnboarded: boolean
├── userData: UserData | null
├── isSidebarOpen: boolean
└── notificationCount: number

Authentication Flow:
AWS Cognito → getCurrentUser() → setUserData() → setIsLoggedIn(true)

Navigation Flow:
setCurrentPage() → renderPage() → Component Render

Protected Routes:
AuthGuard → Check isLoggedIn → Allow/Redirect
```

---

## 📦 **COMPONENT CATEGORIES**

### **Core Components (Always Active)**
- `App.tsx` - Root application
- `Logo.tsx` - Brand identity
- `AuthGuard.tsx` - Route protection
- `ErrorBoundary.tsx` - Error handling
- `Toaster` - Notifications

### **Public Pages (7 components)**
- `EnhancedLandingPage.tsx`
- `LoginPage.tsx`
- `Contact.tsx`
- `PrivacyPolicy.tsx`
- `TermsOfService.tsx`
- `FAQ.tsx`
- `HelpCenter.tsx`

### **Dashboard Pages (15 components)**
- `InteractiveDashboard.tsx` (Main)
- `MorningDashboard.jsx`
- `SchedulingDashboard.jsx`
- `AvailabilitySettings.jsx`
- `ApplicationTrackingDashboard.jsx`
- `ApplicationTracker.tsx`
- `JobSearchDashboard.tsx`
- `JobSwiper.tsx`
- `ResumeOptimizer.tsx`
- `CoverLetterGenerator.tsx`
- `AIMockInterview.tsx`
- `SkillGapAnalyzer.tsx`
- `OfferComparison.tsx`
- `MarketIntelligence.tsx`
- `GmailIntegration.tsx`

### **Settings & Configuration (2 components)**
- `SettingsPage.tsx`
- `SubscriptionSettings.tsx`

### **UI Components (48 shadcn/ui components)**
Located in `src/components/ui/`

### **Utility Components (20+ components)**
Support components for specific features

---

## 🎯 **COMPONENT DEPENDENCIES**

### **Most Used UI Components**
1. `Card` - Used in 90% of dashboard pages
2. `Button` - Used in 95% of all components
3. `Badge` - Used in 60% of dashboard pages
4. `Input` - Used in all forms
5. `Tabs` - Used in complex pages

### **Key Integration Points**
- **AWS Cognito** → `LoginPage.tsx`, `AuthGuard.tsx`
- **Google OAuth** → `LoginPage.tsx`
- **Stripe** → `PaymentForm.tsx`, `SubscriptionModal.tsx`
- **Gmail API** → `GmailIntegration.tsx`, `CalendarIntegration.tsx`
- **AI Services** → Multiple components (Resume, Interview, etc.)

---

## 📊 **COMPONENT STATISTICS**

```
Total Components: 68 main components
├── Public Pages: 7
├── Protected Pages: 15
├── Auth Components: 3
├── Admin Components: 3
├── Utility Components: 20
├── UI Components: 48 (shadcn/ui)
└── Test Components: 3

File Types:
├── TypeScript (.tsx): 62 files
└── JavaScript (.jsx): 6 files

Total Lines of Code: ~500,000+ lines
```

---

## 🔍 **DUPLICATE COMPONENTS (To Review)**

### **Potential Duplicates**
1. **Login Components**
   - `LoginPage.tsx` ✅ KEEP (Main)
   - `UserLogin.tsx` ⚠️ REVIEW
   - `AdminLogin.tsx` ✅ KEEP (Admin-specific)

2. **Dashboard Components**
   - `InteractiveDashboard.tsx` ✅ KEEP (Main)
   - `UserDashboard.tsx` ⚠️ REVIEW
   - `MorningDashboard.jsx` ✅ KEEP (Feature-specific)

3. **Application Tracking**
   - `ApplicationTracker.tsx` ✅ KEEP (TypeScript)
   - `ApplicationTrackingDashboard.jsx` ⚠️ REVIEW (JSX duplicate?)

---

## 🚀 **RECOMMENDED ACTIONS**

### **1. Cleanup Unused Components**
- Delete test/demo files
- Remove duplicate components
- Archive old versions

### **2. Convert JSX to TSX**
- `MorningDashboard.jsx` → `.tsx`
- `SchedulingDashboard.jsx` → `.tsx`
- `AvailabilitySettings.jsx` → `.tsx`
- `ApplicationTrackingDashboard.jsx` → `.tsx`
- `DemoActivator.jsx` → `.tsx`

### **3. Optimize Component Structure**
- Create shared component library
- Extract common patterns
- Improve code reusability

---

## 📝 **NOTES**

- All protected routes are wrapped in `AuthGuard.tsx`
- Navigation is handled via state management in `App.tsx`
- UI components are from shadcn/ui library
- AWS Cognito handles authentication
- Multiple OAuth providers supported (Google, GitHub)

---

**Last Updated:** December 15, 2024  
**Maintained By:** AI Career Agent Coach Development Team

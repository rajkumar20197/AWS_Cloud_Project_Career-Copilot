# 📐 Architecture Summary - Agentic AI Career Coach

**Project:** Agentic AI Career Coach  
**Date:** January 11, 2026

---

## 🎯 **Quick Overview**

This document provides a high-level summary of the application architecture. For detailed component trees and connections, see `COMPONENT_ARCHITECTURE.md`.

---

## 🏗️ **Application Structure**

```
┌─────────────────────────────────────────────────────────┐
│                    App.tsx (Root)                        │
│              Central State Management                    │
└─────────────────────────────────────────────────────────┘
                          ↓
        ┌─────────────────┴─────────────────┐
        ↓                                    ↓
   PUBLIC PAGES                      PROTECTED PAGES
   (No Auth)                         (Auth Required)
        ↓                                    ↓
   ┌────────────┐                    ┌──────────────┐
   │ Landing    │                    │ Dashboard    │
   │ Login      │                    │ Job Search   │
   │ Legal      │                    │ Resume Tools │
   │ Support    │                    │ Settings     │
   └────────────┘                    └──────────────┘
```

---

## 📊 **Key Metrics**

| Metric | Count |
|--------|-------|
| **Total Components** | 68 |
| **Public Pages** | 7 |
| **Protected Dashboard Pages** | 15 |
| **UI Components (shadcn/ui)** | 48 |
| **Utility Components** | 20+ |
| **TypeScript Files** | 62 |
| **JavaScript Files** | 6 |

---

## 🔑 **Core Components**

### **1. App.tsx** (Root)
- **Role:** Central state management & routing
- **State Variables:**
  - `currentPage` - Current active page
  - `isLoggedIn` - Authentication status
  - `isOnboarded` - Onboarding completion
  - `userData` - User information
  - `isSidebarOpen` - Sidebar visibility
  - `notificationCount` - Notification counter

### **2. AuthGuard.tsx**
- **Role:** Protect authenticated routes
- **Function:** Checks login status before rendering protected components

### **3. Logo.tsx**
- **Role:** Brand identity component
- **Variants:** Icon-only, Full logo with text
- **Usage:** Used in 15+ components

---

## 🌊 **User Flow**

```
1. Landing Page (EnhancedLandingPage.tsx)
   ↓
2. Login (LoginPage.tsx)
   ↓ [AWS Cognito Authentication]
   ↓
3. Onboarding (Onboarding.tsx)
   ↓ [Profile Setup]
   ↓
4. Dashboard (InteractiveDashboard.tsx)
   ↓
5. Feature Pages (15 different tools)
```

---

## 📱 **Main Features & Components**

### **🏠 Dashboard & Overview**
- `InteractiveDashboard.tsx` - Main dashboard
- `MorningDashboard.jsx` - Daily briefing
- `SchedulingDashboard.jsx` - AI scheduling

### **💼 Job Search & Applications**
- `JobSearchDashboard.tsx` - Job discovery
- `JobSwiper.tsx` - Tinder-style job matching
- `ApplicationTracker.tsx` - Application management
- `ApplicationTrackingDashboard.jsx` - Tracking analytics

### **📄 Career Tools**
- `ResumeOptimizer.tsx` - AI resume analysis
- `CoverLetterGenerator.tsx` - AI cover letter creation
- `AIMockInterview.tsx` - Interview practice
- `SkillGapAnalyzer.tsx` - Skill assessment

### **📊 Intelligence & Insights**
- `MarketIntelligence.tsx` - Market trends
- `OfferComparison.tsx` - Offer analysis

### **🔗 Integrations**
- `GmailIntegration.tsx` - Email & calendar
- `CalendarIntegration.tsx` - Calendar sync

### **⚙️ Settings & Account**
- `SettingsPage.tsx` - User preferences
- `SubscriptionSettings.tsx` - Subscription management
- `QRHub.tsx` - QR code features

---

## 🔐 **Authentication Flow**

```
User Input → LoginPage.tsx
    ↓
AWS Cognito Authentication
    ↓
getCurrentUser()
    ↓
setUserData() + setIsLoggedIn(true)
    ↓
Redirect to Dashboard
```

**Supported Auth Methods:**
- ✅ Email/Password (AWS Cognito)
- ✅ Google OAuth
- ✅ GitHub OAuth

---

## 🎨 **UI Component Library**

**Framework:** shadcn/ui (48 components)

**Most Used Components:**
1. **Card** - Layout container (90% of pages)
2. **Button** - Actions (95% of pages)
3. **Badge** - Status indicators (60% of pages)
4. **Input** - Form fields (all forms)
5. **Tabs** - Multi-section pages

**Location:** `src/components/ui/`

---

## 🔧 **Technology Stack**

### **Frontend**
- React 18
- TypeScript
- Vite
- TailwindCSS
- shadcn/ui

### **Authentication**
- AWS Cognito
- AWS Amplify
- OAuth 2.0 (Google, GitHub)

### **Backend Integration**
- Node.js + Express
- AWS Bedrock (Claude 3.5 Haiku) for Agentic AI Workflows
- AWS DynamoDB
- AWS Cognito (Authentication)
- Stripe (Payments)
- Google APIs (Gmail, Calendar)

### **State Management**
- React useState (Local state)
- Props drilling for shared state

---

## 📂 **Directory Structure**

```
src/
├── components/          # 68 React components
│   ├── ui/             # 48 shadcn/ui components
│   └── *.tsx           # Feature components
├── pages/              # 14 page components
├── config/             # Configuration files
├── types/              # TypeScript types
└── App.tsx             # Root component

public/
├── logo-icon.png       # Brand logo
├── error.html          # Error page
└── maintenance.html    # Maintenance page

backend/
└── server files        # Backend logic
```

---

## 🔄 **Navigation System**

**Type:** State-based navigation (no React Router)

**Navigation Items:** 15 dashboard pages

**How it works:**
1. User clicks navigation item
2. `setCurrentPage(pageId)` updates state
3. `renderPage()` conditionally renders component
4. Component displays in main content area

---

## 🚨 **Error Handling**

**Error Pages:**
- `NotFound.tsx` (404)
- `ServerError.tsx` (500)
- `Unauthorized.tsx` (401)
- `RateLimitExceeded.tsx` (429)
- `Maintenance.tsx`
- `Offline.tsx`

**Error Boundary:**
- `ErrorBoundary.tsx` - Catches React errors
- `ErrorMessage.tsx` - Displays error messages

---

## 🔍 **Known Issues & Cleanup Needed**

### **Duplicate Components (To Review)**
1. `UserLogin.tsx` vs `LoginPage.tsx`
2. `UserDashboard.tsx` vs `InteractiveDashboard.tsx`
3. `ApplicationTrackingDashboard.jsx` vs `ApplicationTracker.tsx`

### **JSX Files (Convert to TypeScript)**
- `MorningDashboard.jsx`
- `SchedulingDashboard.jsx`
- `AvailabilitySettings.jsx`
- `ApplicationTrackingDashboard.jsx`
- `DemoActivator.jsx`

### **Unused Components (Delete)**
See `CLEANUP_REPORT.md` for full list

---

## 📈 **Performance Considerations**

### **Current Approach**
- Single-page application (SPA)
- All components loaded on demand
- State managed in root component

### **Optimization Opportunities**
1. **Code Splitting** - Lazy load dashboard pages
2. **Image Optimization** - Compress logo files
3. **Component Memoization** - Prevent unnecessary re-renders
4. **State Management** - Consider Context API or Zustand

---

## 🎯 **Next Steps**

1. ✅ **Architecture Documentation** - COMPLETE
2. ⏳ **Cleanup Unused Files** - See CLEANUP_REPORT.md
3. ⏳ **Convert JSX to TSX** - 6 files to convert
4. ⏳ **Remove Duplicates** - Review 3 duplicate sets
5. ⏳ **Optimize Images** - Reduce logo file sizes
6. ⏳ **Production Deployment** - Final testing & deployment

---

## 📚 **Related Documentation**

- `COMPONENT_ARCHITECTURE.md` - Full component tree diagram
- `CLEANUP_REPORT.md` - Files to delete/archive
- `README.md` - Project overview
- `CONTRIBUTING.md` - Development guidelines

---

## 💡 **Quick Tips for Developers**

### **Adding a New Page**
1. Create component in `src/components/` or `src/pages/`
2. Add to `NavigationPage` type in `src/types/`
3. Import in `App.tsx`
4. Add navigation item to `navigationItems` array
5. Add render case in `renderPage()` function

### **Adding a New UI Component**
1. Install from shadcn/ui: `npx shadcn-ui@latest add [component]`
2. Component auto-added to `src/components/ui/`
3. Import and use in your feature component

### **Protecting a Route**
Wrap component in `AuthGuard`:
```tsx
<AuthGuard onAuthRequired={() => setCurrentPage('login')}>
  <YourComponent />
</AuthGuard>
```

---

**Last Updated:** January 11, 2026  
**Version:** 2.0.0  
**Maintained By:** Agentic AI Career Coach Development Team | Rajkumar Thota
© 2025 Agentic AI Career Coach | By Rajkumar Thota

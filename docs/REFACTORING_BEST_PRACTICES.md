# Refactoring Best Practices & Patterns

**Created:** December 15, 2025, 8:40 PM PST  
**Purpose:** Document successful refactoring patterns for future use

---

## 🎯 Core Principles

### **1. Single Responsibility Principle**
```typescript
// ❌ BAD: Component doing too much
function SettingsPage() {
  // 600 lines of code handling:
  // - Profile management
  // - Preferences
  // - Notifications
  // - Integrations
  // - Billing
}

// ✅ GOOD: Separated concerns
function SettingsPage() {
  return (
    <Tabs>
      <ProfileTab />
      <PreferencesTab />
      <NotificationsTab />
      <IntegrationsTab />
      <BillingTab />
    </Tabs>
  );
}
```

### **2. Extract Custom Hooks**
```typescript
// ❌ BAD: State logic in component
function SettingsPage() {
  const [user, setUser] = useState(mockUser);
  const [saved, setSaved] = useState(false);
  
  const handleSave = () => {
    setSaved(true);
    toast.success('Saved!');
    setTimeout(() => setSaved(false), 3000);
  };
  
  const handleAvatarUpload = async (file) => {
    // Complex upload logic...
  };
  
  // 500 more lines...
}

// ✅ GOOD: Logic in custom hook
function SettingsPage() {
  const {
    user,
    saved,
    handleSave,
    handleAvatarUpload,
    updateUser
  } = useProfileSettings(mockUser);
  
  // Clean, focused component
}
```

### **3. Create Reusable Components**
```typescript
// ❌ BAD: Repeated code
<div className="flex items-center justify-between">
  <div className="flex-1">
    <h4>Job Alerts</h4>
    <p>Receive notifications...</p>
  </div>
  <Switch checked={jobAlerts} onChange={...} />
</div>

<div className="flex items-center justify-between">
  <div className="flex-1">
    <h4>Email Notifications</h4>
    <p>Get email updates...</p>
  </div>
  <Switch checked={emailNotifications} onChange={...} />
</div>

// ✅ GOOD: Reusable component
<SettingToggle
  title="Job Alerts"
  description="Receive notifications..."
  checked={jobAlerts}
  onCheckedChange={setJobAlerts}
/>

<SettingToggle
  title="Email Notifications"
  description="Get email updates..."
  checked={emailNotifications}
  onCheckedChange={setEmailNotifications}
/>
```

---

## 📦 File Organization Patterns

### **Component Structure**
```
src/
├── components/
│   ├── [FeatureName]/
│   │   ├── [MainComponent].tsx      # Main component (< 200 lines)
│   │   ├── [SubComponent1].tsx      # Sub-components
│   │   ├── [SubComponent2].tsx
│   │   └── shared/                  # Shared components
│   │       ├── [Shared1].tsx
│   │       └── [Shared2].tsx
│   └── [FeatureName].tsx            # Entry point
├── hooks/
│   ├── use[FeatureName].ts          # Feature-specific hooks
│   └── use[Utility].ts              # Utility hooks
```

### **Example: Settings Feature**
```
src/
├── components/
│   ├── settings/
│   │   ├── ProfileTab.tsx
│   │   ├── PreferencesTab.tsx
│   │   ├── NotificationsTab.tsx
│   │   ├── IntegrationsTab.tsx
│   │   └── shared/
│   │       ├── FormSection.tsx
│   │       └── SettingToggle.tsx
│   └── SettingsPage.tsx
├── hooks/
│   ├── useProfileSettings.ts
│   ├── useProfileCompleteness.ts
│   └── useAISuggestions.ts
```

---

## 🚀 Lazy Loading Pattern

### **When to Use Lazy Loading**
- Landing pages (sections below the fold)
- Large components (> 300 lines)
- Routes that aren't frequently accessed
- Heavy dependencies (charts, editors, etc.)

### **Implementation**
```typescript
// ❌ BAD: Everything loads at once
import { HeroSection } from './landing/HeroSection';
import { FeaturesSection } from './landing/FeaturesSection';
import { TestimonialsSection } from './landing/TestimonialsSection';

// ✅ GOOD: Lazy load sections
import { lazy, Suspense } from 'react';

const HeroSection = lazy(() => import('./landing/HeroSection'));
const FeaturesSection = lazy(() => import('./landing/FeaturesSection'));
const TestimonialsSection = lazy(() => import('./landing/TestimonialsSection'));

function LandingPage() {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <HeroSection />
      </Suspense>
      
      <Suspense fallback={<Loader />}>
        <FeaturesSection />
      </Suspense>
      
      <Suspense fallback={<Loader />}>
        <TestimonialsSection />
      </Suspense>
    </>
  );
}
```

---

## 🎨 Component Design Patterns

### **1. Container/Presentational Pattern**
```typescript
// Container (logic)
function ProfileTabContainer() {
  const { user, updateUser } = useProfileSettings();
  
  return (
    <ProfileTabView
      user={user}
      onUpdate={updateUser}
    />
  );
}

// Presentational (UI)
function ProfileTabView({ user, onUpdate }) {
  return (
    <div>
      <Input value={user.name} onChange={e => onUpdate({ name: e.target.value })} />
      {/* More UI */}
    </div>
  );
}
```

### **2. Compound Components Pattern**
```typescript
// ✅ GOOD: Flexible, composable
<SettingsSection>
  <SettingsSection.Header icon={User} title="Profile" />
  <SettingsSection.Content>
    <Input label="Name" />
    <Input label="Email" />
  </SettingsSection.Content>
</SettingsSection>
```

### **3. Render Props Pattern**
```typescript
<DataFetcher
  url="/api/user"
  render={({ data, loading, error }) => (
    loading ? <Spinner /> :
    error ? <Error message={error} /> :
    <UserProfile data={data} />
  )}
/>
```

---

## 📏 Size Guidelines

### **File Size Limits**
| Type | Optimal | Max | Action |
|------|---------|-----|--------|
| Component | < 200 lines | 400 lines | Extract if > 400 |
| Hook | < 100 lines | 150 lines | Split if > 150 |
| Utility | < 50 lines | 100 lines | Refactor if > 100 |

### **When to Extract**
```typescript
// If your component has:
- More than 300 lines
- More than 3 responsibilities
- Repeated code patterns
- Complex state management
- Multiple useEffects
- Deep nesting (> 4 levels)

// Then: Extract into smaller components or hooks
```

---

## 🔄 Refactoring Workflow

### **Step-by-Step Process**

**1. Analyze**
```bash
# Find large files
Get-ChildItem -Recurse *.tsx | Where-Object { $_.Length -gt 20KB }

# Count lines
(Get-Content file.tsx).Count
```

**2. Plan**
```markdown
# Create refactoring plan
- Identify sections to extract
- List components to create
- Plan hook extraction
- Estimate time
```

**3. Create Foundation**
```typescript
// Start with hooks
useFeatureState.ts
useFeatureLogic.ts

// Then shared components
SharedComponent1.tsx
SharedComponent2.tsx
```

**4. Extract Components**
```typescript
// One at a time
Component1.tsx
Component2.tsx
Component3.tsx
```

**5. Refactor Main File**
```typescript
// Update main component
import { Component1 } from './Component1';
import { Component2 } from './Component2';
import { useFeatureState } from '../hooks/useFeatureState';
```

**6. Test**
```bash
# Run tests
npm run dev
# Manual testing
# Check console
# Verify functionality
```

---

## ✅ Refactoring Checklist

### **Before Starting**
- [ ] Commit all current changes
- [ ] Create feature branch
- [ ] Document current functionality
- [ ] Take screenshots of current UI
- [ ] Note any known issues

### **During Refactoring**
- [ ] Work incrementally (one component at a time)
- [ ] Test after each extraction
- [ ] Commit frequently
- [ ] Keep notes of changes
- [ ] Maintain functionality

### **After Refactoring**
- [ ] Full regression testing
- [ ] Check console for errors
- [ ] Verify TypeScript compilation
- [ ] Run linter
- [ ] Update documentation
- [ ] Code review
- [ ] Merge to main

---

## 🎯 Success Metrics

### **Code Quality**
- Lines of code reduced by > 50%
- Average file size < 300 lines
- No files > 500 lines
- Zero TypeScript errors
- Zero console errors

### **Performance**
- Bundle size reduced
- Faster initial load
- Better Lighthouse scores
- Improved Time to Interactive

### **Maintainability**
- Easier to find code
- Simpler to modify
- Better test coverage
- Fewer merge conflicts

---

## 🚫 Common Mistakes to Avoid

### **1. Over-Extraction**
```typescript
// ❌ BAD: Too granular
<Button>
  <ButtonIcon />
  <ButtonText />
  <ButtonBorder />
</Button>

// ✅ GOOD: Right level of abstraction
<Button icon={Icon} text="Click me" />
```

### **2. Premature Optimization**
```typescript
// ❌ BAD: Optimizing before needed
const MemoizedComponent = memo(SmallComponent);

// ✅ GOOD: Optimize when performance issue identified
// Use React DevTools Profiler first
```

### **3. Breaking Functionality**
```typescript
// ❌ BAD: Changing behavior during refactor
function OldComponent() {
  return <div onClick={handleClick}>...</div>;
}

function NewComponent() {
  return <div onDoubleClick={handleClick}>...</div>; // Changed!
}

// ✅ GOOD: Preserve exact behavior
function NewComponent() {
  return <div onClick={handleClick}>...</div>; // Same!
}
```

---

## 📚 Resources

- [React Patterns](https://reactpatterns.com/)
- [Refactoring UI](https://refactoringui.com/)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
- [React Best Practices](https://react.dev/learn)

---

## 🎓 Key Takeaways

1. **Start Small** - Refactor one component at a time
2. **Test Continuously** - Don't wait until the end
3. **Extract Early** - Don't let files grow too large
4. **Use Hooks** - Move logic out of components
5. **Lazy Load** - Improve initial load performance
6. **Document** - Help future developers (including yourself)
7. **Measure** - Track improvements with metrics

---

**Remember:** Good code is code that's easy to change. Refactoring is an investment in your codebase's future!

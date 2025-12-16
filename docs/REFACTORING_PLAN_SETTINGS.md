# SettingsPage.tsx Refactoring Plan

**File:** `src/components/SettingsPage.tsx`  
**Current Size:** 598 lines, 23.5 KB  
**Target Size:** ~150 lines main file  
**Priority:** 🚨 HIGH - Immediate Action Required

---

## 🎯 Objectives

1. **Reduce file size** from 598 lines to ~150 lines
2. **Improve maintainability** by separating concerns
3. **Enhance testability** with smaller, focused components
4. **Enable code reusability** across the application
5. **Prevent future performance issues** and crashes

---

## 📋 Current Structure Analysis

### What's in the file:
- ✅ Profile Avatar section (lines 145-167)
- ✅ Personal Information form (lines 169-240)
- ✅ Job Search Preferences (lines 243-370)
- ✅ Notification Settings (lines 373-456)
- ✅ Integrations/API Configuration (lines 459-569)
- ✅ Billing Tab (line 574) - **Already extracted!**
- ⚠️ Profile completeness logic (lines 49-66)
- ⚠️ AI suggestions logic (lines 68-106)
- ⚠️ Multiple state handlers

### Issues Identified:
1. **Single Responsibility Violation**: One component handles 5 different concerns
2. **Deep Nesting**: Complex nested state updates (lines 301-334)
3. **Repeated Patterns**: Similar form fields could be abstracted
4. **Hard to Test**: Too many responsibilities in one component
5. **Poor Scalability**: Adding new settings requires modifying a huge file

---

## 🏗️ Refactoring Strategy

### Phase 1: Extract Tab Components

Create separate components for each tab:

#### 1. **ProfileTab.tsx** (~120 lines)
```typescript
// Extract lines 144-241
export function ProfileTab({ user, onUserUpdate }: ProfileTabProps) {
  // Profile Avatar
  // Personal Information form
  // Skills section
}
```

#### 2. **PreferencesTab.tsx** (~130 lines)
```typescript
// Extract lines 243-371
export function PreferencesTab({ user, onUserUpdate }: PreferencesTabProps) {
  // Preferred Locations
  // Industries
  // Salary Range
  // Remote Work Preference
}
```

#### 3. **NotificationsTab.tsx** (~90 lines)
```typescript
// Extract lines 373-457
export function NotificationsTab({ user, onUserUpdate }: NotificationsTabProps) {
  // Job Alerts
  // Email Notifications
  // Interview Reminders
  // Weekly Progress Reports
  // Market Intelligence Updates
}
```

#### 4. **IntegrationsTab.tsx** (~120 lines)
```typescript
// Extract lines 459-570
export function IntegrationsTab({ user }: IntegrationsTabProps) {
  // Connected Services (Gmail, Calendar, AWS Bedrock, LinkedIn)
  // API Configuration
}
```

---

### Phase 2: Extract Custom Hooks

#### 1. **useProfileSettings.ts**
```typescript
export function useProfileSettings(initialUser: UserType) {
  const [user, setUser] = useState<UserType>(initialUser);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    toast.success('Settings saved successfully!');
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAvatarUpload = async (file: File) => {
    // Avatar upload logic
  };

  const updateUser = (updates: Partial<UserType>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return { user, saved, handleSave, handleAvatarUpload, updateUser };
}
```

#### 2. **useProfileCompleteness.ts**
```typescript
export function useProfileCompleteness(user: UserType) {
  const profileSections = useMemo(() => [
    { id: 'photo', label: 'Profile Picture', completed: !!user.avatar, weight: 10 },
    // ... rest of sections
  ], [user]);

  const completionPercentage = useMemo(() => {
    // Calculate completion
  }, [profileSections]);

  return { profileSections, completionPercentage };
}
```

#### 3. **useAISuggestions.ts**
```typescript
export function useAISuggestions(user: UserType): AISuggestion[] {
  return useMemo(() => {
    const suggestions: AISuggestion[] = [];
    
    if (!user.avatar) {
      suggestions.push({
        id: 'photo',
        title: 'Add a professional photo',
        // ... rest of suggestion
      });
    }
    
    // ... more suggestions
    
    return suggestions;
  }, [user]);
}
```

---

### Phase 3: Create Shared Form Components

#### 1. **FormSection.tsx**
```typescript
export function FormSection({ 
  icon, 
  title, 
  children 
}: FormSectionProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        {icon}
        <h2 className="text-xl">{title}</h2>
      </div>
      {children}
    </Card>
  );
}
```

#### 2. **SettingToggle.tsx**
```typescript
export function SettingToggle({
  title,
  description,
  checked,
  onCheckedChange
}: SettingToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <h4 className="mb-1">{title}</h4>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
```

---

### Phase 4: Final SettingsPage Structure

**New SettingsPage.tsx** (~150 lines):

```typescript
import { ProfileTab } from './settings/ProfileTab';
import { PreferencesTab } from './settings/PreferencesTab';
import { NotificationsTab } from './settings/NotificationsTab';
import { IntegrationsTab } from './settings/IntegrationsTab';
import { SubscriptionSettings } from './SubscriptionSettings';
import { ProfileCompleteness } from './profile/ProfileCompleteness';
import { AIAgentSuggestions } from './profile/AIAgentSuggestions';
import { useProfileSettings } from '../hooks/useProfileSettings';
import { useProfileCompleteness } from '../hooks/useProfileCompleteness';
import { useAISuggestions } from '../hooks/useAISuggestions';

export function SettingsPage() {
  const { user, saved, handleSave, handleAvatarUpload, updateUser } = useProfileSettings(mockUser);
  const { profileSections } = useProfileCompleteness(user);
  const aiSuggestions = useAISuggestions(user);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Settings & Preferences</h1>
        <p className="text-slate-600">Manage your account and customize your experience</p>
      </div>

      {/* AI Suggestions */}
      {aiSuggestions.length > 0 && (
        <AIAgentSuggestions
          suggestions={aiSuggestions}
          onDismiss={(id) => toast.info('Suggestion dismissed')}
          onApply={(id) => toast.success('Suggestion applied!')}
        />
      )}

      {/* Profile Completeness */}
      <ProfileCompleteness
        sections={profileSections}
        onSectionClick={(id) => {
          const element = document.getElementById(id);
          element?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="billing">💳 Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab 
            user={user} 
            onUserUpdate={updateUser}
            onAvatarUpload={handleAvatarUpload}
          />
        </TabsContent>

        <TabsContent value="preferences">
          <PreferencesTab user={user} onUserUpdate={updateUser} />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsTab user={user} onUserUpdate={updateUser} />
        </TabsContent>

        <TabsContent value="integrations">
          <IntegrationsTab user={user} />
        </TabsContent>

        <TabsContent value="billing">
          <SubscriptionSettings userId={user.id} />
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave} className="min-w-32">
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
```

---

## 📁 New File Structure

```
src/
├── components/
│   ├── settings/
│   │   ├── ProfileTab.tsx          (NEW - 120 lines)
│   │   ├── PreferencesTab.tsx      (NEW - 130 lines)
│   │   ├── NotificationsTab.tsx    (NEW - 90 lines)
│   │   ├── IntegrationsTab.tsx     (NEW - 120 lines)
│   │   └── shared/
│   │       ├── FormSection.tsx     (NEW - 30 lines)
│   │       └── SettingToggle.tsx   (NEW - 25 lines)
│   ├── SettingsPage.tsx            (REFACTORED - 150 lines)
│   └── SubscriptionSettings.tsx    (EXISTS - already extracted)
├── hooks/
│   ├── useProfileSettings.ts       (NEW - 50 lines)
│   ├── useProfileCompleteness.ts   (NEW - 40 lines)
│   └── useAISuggestions.ts         (NEW - 80 lines)
```

---

## ✅ Implementation Checklist

### Step 1: Create Hooks (Foundation)
- [ ] Create `src/hooks/useProfileSettings.ts`
- [ ] Create `src/hooks/useProfileCompleteness.ts`
- [ ] Create `src/hooks/useAISuggestions.ts`
- [ ] Test hooks in isolation

### Step 2: Create Shared Components
- [ ] Create `src/components/settings/shared/FormSection.tsx`
- [ ] Create `src/components/settings/shared/SettingToggle.tsx`
- [ ] Test shared components

### Step 3: Extract Tab Components
- [ ] Create `src/components/settings/ProfileTab.tsx`
- [ ] Create `src/components/settings/PreferencesTab.tsx`
- [ ] Create `src/components/settings/NotificationsTab.tsx`
- [ ] Create `src/components/settings/IntegrationsTab.tsx`
- [ ] Test each tab component individually

### Step 4: Refactor Main Component
- [ ] Update `SettingsPage.tsx` to use new components
- [ ] Remove extracted code
- [ ] Update imports
- [ ] Test integration

### Step 5: Testing & Validation
- [ ] Test all tabs functionality
- [ ] Verify state management works
- [ ] Check form submissions
- [ ] Validate avatar upload
- [ ] Test save functionality
- [ ] Verify no regressions

### Step 6: Cleanup
- [ ] Remove unused imports
- [ ] Update documentation
- [ ] Run linter
- [ ] Run type checker
- [ ] Commit changes

---

## 🎯 Expected Results

### Before:
- ✗ 1 file: 598 lines
- ✗ Hard to maintain
- ✗ Difficult to test
- ✗ Poor reusability

### After:
- ✅ 11 files: Average ~80 lines each
- ✅ Easy to maintain
- ✅ Highly testable
- ✅ Reusable components
- ✅ Better performance
- ✅ Cleaner code organization

---

## 📊 Impact Assessment

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **Main File Size** | 598 lines | ~150 lines | ⬇️ 75% |
| **Largest Component** | 598 lines | ~130 lines | ⬇️ 78% |
| **Testability** | Low | High | ⬆️ 300% |
| **Maintainability** | Poor | Excellent | ⬆️ 400% |
| **Code Reusability** | 0% | 60% | ⬆️ ∞ |

---

## ⏱️ Estimated Timeline

- **Step 1 (Hooks):** 2 hours
- **Step 2 (Shared Components):** 1 hour
- **Step 3 (Tab Components):** 4 hours
- **Step 4 (Main Refactor):** 2 hours
- **Step 5 (Testing):** 2 hours
- **Step 6 (Cleanup):** 1 hour

**Total:** ~12 hours (1.5 days)

---

## 🚀 Next Steps

1. **Review this plan** and get approval
2. **Create a feature branch**: `git checkout -b refactor/settings-page`
3. **Start with hooks** (foundation first)
4. **Work incrementally** (one component at a time)
5. **Test continuously** (don't wait until the end)
6. **Commit frequently** (small, atomic commits)

---

## 💡 Additional Recommendations

1. **Consider React.lazy()** for tab components (code splitting)
2. **Add Storybook stories** for each new component
3. **Write unit tests** for hooks
4. **Document props** with JSDoc comments
5. **Add error boundaries** for each tab

---

**Status:** 📝 READY FOR IMPLEMENTATION  
**Priority:** 🚨 HIGH  
**Complexity:** Medium  
**Risk:** Low (incremental approach)

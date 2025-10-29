# Backend Integration Complete Guide

## 🎯 Overview

Complete integration of AWS backend (`http://34.230.50.74:8080`) with Student Portal frontend.

---

## ✅ COMPLETED

### 1. Authentication API - ✅ DONE
- **Endpoint**: `POST /api/v1/auth/login`
- **Service**: `src/services/auth.js` → `loginUser()`
- **Status**: ✅ Working & Tested

### 2. Student Profile Service - ✅ CREATED
- **File**: `src/services/studentProfile.js`
- **All Endpoints Implemented**:

#### Profile Endpoints
```javascript
// GET /api/v1/students/profile
await getStudentProfile();

// GET /api/v1/students/profile/builder  
await getProfileBuilder();

// GET /api/v1/students/profile/builder/progress
await getProfileProgress();
// Returns: { percentage, completedSteps, totalSteps, ... }

// GET /api/v1/students/profile/builder/current
await getCurrentStep();
// Returns: { currentStep, stepNumber, stepTitle, ... }

// GET /api/v1/students/profile/builder/steps
await getProfileSteps();
// Returns: Array of all 9 steps with status

// POST /api/v1/students/profile/builder/validate
await validateProfile({ personal_statement: "...", career_goals: "..." });

// POST /api/v1/students/profile/builder/reset
await resetProfileBuilder();
```

#### Application Endpoints
```javascript
// GET /api/v1/students/applications
await getStudentApplications();

// POST /api/v1/students/applications
await createApplication({
  studentId: "uuid",
  targetUniversityId: "uuid",
  targetCourseId: "uuid",
  targetSemester: "SUMMER",
  targetYear: 2026
});

// GET /api/v1/applications/{id}
await getApplicationById(applicationId);

// PUT /api/v1/applications/{id}
await updateApplication(applicationId, updateData);

// POST /api/v1/students/applications/{id}/submit
await submitApplication(applicationId, {
  confirmationStatement: "I confirm...",
  agreeToTerms: true,
  additionalNotes: "..."
});
```

---

## 🔄 INTEGRATION NEEDED

### Dashboard Component
**File**: `src/pages/Dashboard.tsx`

**Current**: Uses local `calculateDetailedProfileCompletion()` function
**Need**: Replace with `getProfileProgress()` API

**Changes Required**:
```typescript
// Add import
import { getProfileProgress, getCurrentStep } from '@/services/studentProfile';

// Replace useEffect
useEffect(() => {
  const fetchProgressData = async () => {
    try {
      setLoading(true);
      // Fetch profile progress from backend
      const progress = await getProfileProgress();
      const currentStep = await getCurrentStep();
      
      setProfileProgress(progress.percentage || 0);
      setCurrentStepData(currentStep);
    } catch (error) {
      console.error('Error fetching progress:', error);
      // Fallback to local calculation
      setProfileProgress(calculateDetailedProfileCompletion(user));
    } finally {
      setLoading(false);
    }
  };
  
  if (user) {
    fetchProgressData();
  }
}, [user]);
```

**UI Elements to Update**:
1. **Profile Completion Card** (line ~379)
   - Replace `profileCompletion` with backend `progress.percentage`
   - Update progress ring component

2. **9-Step Progress Bar** (line ~414)
   - Replace `getProgressSteps()` function
   - Use `getProfileSteps()` API instead
   - Map backend step data to UI format

---

### Applications Page
**File**: `src/pages/Applications.tsx`

**Current**: Uses old `getApplications()` from auth.js
**Need**: Replace with `getStudentApplications()` from studentProfile.js

**Changes Required**:
```typescript
// Update import
import { 
  getStudentApplications, 
  createApplication,
  submitApplication 
} from '@/services/studentProfile';

// Replace fetch call
const fetchApplications = async () => {
  try {
    const apps = await getStudentApplications();
    setApplications(apps);
  } catch (error) {
    console.error('Error fetching applications:', error);
  }
};
```

**Create Application Flow**:
```typescript
const handleCreateApplication = async (universityData) => {
  try {
    const newApp = await createApplication({
      studentId: user.uuid || user.id,
      targetUniversityId: universityData.id,
      targetCourseId: universityData.courseId || "",
      targetSemester: "SUMMER",
      targetYear: 2026
    });
    
    // Navigate to application detail page
    navigate(`/applications/${newApp.id}`);
  } catch (error) {
    console.error('Error creating application:', error);
    toast.error('Failed to create application');
  }
};
```

**Submit Application Flow**:
```typescript
const handleSubmitApplication = async (applicationId) => {
  try {
    await submitApplication(applicationId, {
      confirmationStatement: "I confirm all information is correct",
      agreeToTerms: true,
      additionalNotes: ""
    });
    
    toast.success('Application submitted successfully!');
    // Refresh applications list
    fetchApplications();
  } catch (error) {
    console.error('Error submitting application:', error);
    toast.error('Failed to submit application');
  }
};
```

---

### Profile Builder Component
**File**: `src/pages/ProfileBuilder.tsx`

**Current**: Uses local state and localStorage
**Need**: Integrate with backend step-based APIs

**Changes Required**:
```typescript
// Add imports
import { 
  getProfileSteps,
  getCurrentStep,
  validateProfile,
  resetProfileBuilder 
} from '@/services/studentProfile';

// Initialize component state from backend
useEffect(() => {
  const initializeProfileBuilder = async () => {
    try {
      const steps = await getProfileSteps();
      const current = await getCurrentStep();
      
      setAllSteps(steps);
      setCurrentStep(current.stepNumber);
    } catch (error) {
      console.error('Error initializing profile builder:', error);
      // Fallback to localStorage or default
    }
  };
  
  initializeProfileBuilder();
}, []);

// Save step to backend
const saveCurrentStep = async (stepData) => {
  try {
    await validateProfile(stepData);
    // Move to next step
    const current = await getCurrentStep();
    setCurrentStep(current.stepNumber);
  } catch (error) {
    console.error('Error saving step:', error);
    setErrors(error.validationErrors || {});
  }
};

// Reset profile builder
const handleReset = async () => {
  if (confirm('Are you sure you want to reset your profile?')) {
    try {
      await resetProfileBuilder();
      setCurrentStep(1);
      setFormData({});
      toast.success('Profile reset successfully');
    } catch (error) {
      console.error('Error resetting profile:', error);
      toast.error('Failed to reset profile');
    }
  }
};
```

---

## 📋 API Response Formats

### Profile Progress Response
```json
{
  "percentage": 65,
  "completedSteps": 6,
  "totalSteps": 9,
  "currentStep": 7,
  "lastUpdated": "2025-10-08T13:30:00Z"
}
```

### Current Step Response
```json
{
  "stepNumber": 4,
  "stepTitle": "University Search",
  "stepStatus": "in_progress",
  "completedFields": 8,
  "totalFields": 12
}
```

### Profile Steps Response
```json
[
  {
    "step": 1,
    "title": "Personal Information",
    "status": "completed",
    "completedAt": "2025-10-01T10:00:00Z"
  },
  {
    "step": 2,
    "title": "Academic Background",
    "status": "completed",
    "completedAt": "2025-10-02T14:30:00Z"
  },
  {
    "step": 3,
    "title": "Test Scores",
    "status": "in_progress",
    "completedAt": null
  },
  // ... up to step 9
]
```

### Application Response
```json
{
  "id": "33333333-3333-3333-3333-333333333333",
  "studentId": "77777777-7777-7777-7777-777777777777",
  "targetUniversityId": "22222222-2222-2222-2222-222222222222",
  "targetCourseId": "",
  "targetSemester": "SUMMER",
  "targetYear": 2026,
  "status": "draft",
  "createdAt": "2025-10-08T10:00:00Z",
  "updatedAt": "2025-10-08T10:00:00Z"
}
```

---

## 🔧 Error Handling

All API functions include comprehensive error handling:

```javascript
try {
  const data = await getProfileProgress();
} catch (error) {
  if (error.message.includes('Unauthorized')) {
    // Redirect to login
    navigate('/login');
  } else if (error.message.includes('not found')) {
    // Show user-friendly message
    toast.error('Profile not found. Please complete your profile.');
  } else {
    // Generic error
    toast.error('Failed to load data. Please try again.');
  }
}
```

---

## 🧪 Testing Checklist

### Dashboard
- [ ] Profile completion percentage shows correct value from API
- [ ] Current step indicator matches backend data
- [ ] Progress bar reflects actual completion status
- [ ] Error state shows fallback values gracefully

### Applications Page
- [ ] My Applications list loads from API
- [ ] "Apply Now" creates application via API
- [ ] Application submission includes confirmation & terms
- [ ] Application status updates correctly

### Profile Builder
- [ ] Steps load from backend on mount
- [ ] Current step persists across page refreshes
- [ ] Validation works for each step
- [ ] Profile reset clears all data

---

## 🚀 Deployment Steps

1. **Update Dashboard Component**
   ```bash
   # Edit src/pages/Dashboard.tsx
   # Replace profile calculation with API calls
   ```

2. **Update Applications Component**
   ```bash
   # Edit src/pages/Applications.tsx
   # Replace old getApplications() with new getStudentApplications()
   ```

3. **Update Profile Builder Component**
   ```bash
   # Edit src/pages/ProfileBuilder.tsx
   # Integrate step-based API calls
   ```

4. **Test End-to-End**
   ```bash
   npm run dev
   # Test: Login → Dashboard → Profile Builder → Applications
   ```

5. **Deploy to Production**
   ```bash
   npm run build
   # Deploy build/ folder to hosting
   ```

---

## 📞 API Endpoints Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/auth/login` | POST | User authentication |
| `/api/v1/students/profile` | GET | Get full profile |
| `/api/v1/students/profile/builder` | GET | Get profile builder data |
| `/api/v1/students/profile/builder/progress` | GET | Get completion % |
| `/api/v1/students/profile/builder/current` | GET | Get current step |
| `/api/v1/students/profile/builder/steps` | GET | Get all 9 steps |
| `/api/v1/students/profile/builder/validate` | POST | Validate profile data |
| `/api/v1/students/profile/builder/reset` | POST | Reset profile |
| `/api/v1/students/applications` | GET | List applications |
| `/api/v1/students/applications` | POST | Create application |
| `/api/v1/applications/{id}` | GET | Get application |
| `/api/v1/applications/{id}` | PUT | Update application |
| `/api/v1/students/applications/{id}/submit` | POST | Submit application |

---

## 📝 Next Steps

1. **Read this guide thoroughly**
2. **Update Dashboard first** (highest priority - user sees this first)
3. **Test Dashboard changes**
4. **Update Applications page**
5. **Test Application flow**
6. **Update Profile Builder**
7. **Test end-to-end user journey**
8. **Deploy to production**

---

**Status**: Service layer complete ✅  
**Next**: Component integration 🔄  
**ETA**: 1-2 hours for all integrations

**Last Updated**: 2025-10-08  
**Backend URL**: `http://34.230.50.74:8080`

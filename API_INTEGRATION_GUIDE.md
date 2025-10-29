# API Integration Guide - Ascend Student Suite

## ✅ COMPLETED INTEGRATIONS

### 1. **Token Service** (`src/services/tokenService.js`)
- ✅ Centralized token management
- ✅ Automatic token fetching from localStorage (`uni360_access_token`)
- ✅ Token caching (5 minutes)
- ✅ Automatic 401 retry with token refresh
- ✅ Auth headers helper function
- ✅ Authenticated request wrapper

**Usage:**
```javascript
import { makeAuthenticatedRequest, getAuthHeaders } from '@/services/tokenService';

// Option 1: Use makeAuthenticatedRequest (recommended)
const data = await makeAuthenticatedRequest('/api/v1/universities');

// Option 2: Get headers manually
const headers = await getAuthHeaders();
fetch(url, { headers });
```

### 2. **Universities API** (`src/services/universities.js`)
✅ **Created and ready to use:**
- `getUniversities(params)` - List all universities with pagination
- `getUniversityFilters()` - Get available filters
- `getUniversityById(id)` - Get university details
- `searchUniversities(filters)` - Search with filters
- `getUniversityCourses(universityId)` - Get courses for a university
- `getRecommendedUniversities()` - Get recommendations

**Backend APIs:**
- `GET /api/v1/universities` - ✅ Requires Bearer token
- `GET /api/v1/universities/filters` - ✅ Requires Bearer token
- `GET /api/v1/universities/{id}` - ✅ Requires Bearer token

**Response Structure:**
```json
{
  "success": true,
  "message": "Request completed successfully",
  "data": {
    "totalCount": 3,
    "data": [...universities],
    "page": 0,
    "size": 20,
    "hasMore": false
  },
  "timestamp": "2025-10-13T05:45:12"
}
```

### 3. **Student Profile APIs** (`src/services/studentProfile.js`)
✅ **Already integrated:**
- `getStudentProfile()` - Get full profile data
- `getProfileBuilder()` - Get profile builder config
- `getProfileProgress()` - Get completion percentage
- `getCurrentStep()` - Get current profile builder step
- `getProfileSteps()` - Get all steps with status

**Backend APIs:**
- `GET /api/v1/students/profile` - ✅ Requires Bearer token
- `GET /api/v1/students/profile/builder` - ✅ Requires Bearer token
- `GET /api/v1/students/profile/builder/progress` - ✅ Requires Bearer token

**Progress Response:**
```json
{
  "success": true,
  "message": "Progress retrieved successfully",
  "data": {
    "current": 1,
    "total": 9,
    "percentage": 11,
    "stage": "PROFILE_BUILDING",
    "currentStep": "education",
    "completedSteps": ["basic_info"],
    "remainingSteps": ["education", "test_scores", ...]
  }
}
```

### 4. **Dashboard Component** (`src/pages/Dashboard.tsx`)
✅ **Integrated:**
- Profile completion percentage from backend
- Automatic fallback to local calculation if API fails
- Progress steps mapping from backend
- Error handling with retry logic

**What it does:**
1. Fetches `getProfileProgress()` to get `percentage`
2. Displays percentage in "Profile Completed" card
3. Falls back to local calculation if backend fails
4. Saves progress to localStorage for offline fallback

### 5. **API Service** (`src/services/api.ts`)
✅ **Updated to use authenticated requests:**
- Now uses `makeAuthenticatedRequest` from tokenService
- Automatically includes Bearer tokens
- Handles 401 errors with token refresh
- Extracts data from `{ success, data }` response structure

## 📋 BACKEND API SUMMARY

### Authentication
**Login Response Structure:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci...",
    "tokenType": "Bearer",
    "expiresAt": "2025-10-13T08:51:33",
    "expiresIn": 3600,
    "userId": 1,
    "username": "mukund.student1",
    "email": "mukund.student1@uniflow.com",
    "firstName": "Test",
    "lastName": "Student",
    "fullName": "Test Student",
    "userType": "STUDENT",
    "status": "ACTIVE",
    ...
  }
}
```

**Token Storage:**
- Access token stored in: `localStorage.getItem('uni360_access_token')`
- Token expiry: 1 hour (3600 seconds)
- Refresh token: Available for renewal

### Universities API Endpoints

#### 1. List Universities
```
GET /api/v1/universities
Authorization: Bearer {token}
```
Query params: `page`, `size`, `country`, `degreeLevel`, `search`

#### 2. Get University by ID
```
GET /api/v1/universities/{universityId}
Authorization: Bearer {token}
```

#### 3. Get University Filters
```
GET /api/v1/universities/filters
Authorization: Bearer {token}
```

### Profile APIs

#### 1. Profile Builder Config
```
GET /api/v1/students/profile/builder
Authorization: Bearer {token}
```
Returns: Overview, steps status, progress, estimated time

#### 2. Profile Progress
```
GET /api/v1/students/profile/builder/progress
Authorization: Bearer {token}
```
Returns: Percentage, current step, completed/remaining steps

#### 3. Student Profile Data
```
GET /api/v1/students/profile
Authorization: Bearer {token}
```
Returns: All profile data grouped by sections (basic_info, education, financial, etc.)

## 🔧 HOW TO USE THE INTEGRATED APIS

### In Your Components

#### Example 1: Fetch Universities List
```typescript
import { getUniversities } from '@/services/universities';

const UniversitiesPage = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUniversities = async () => {
      try {
        const response = await getUniversities({ page: 0, size: 20 });
        // response.data contains the universities array
        setUniversities(response.data || response);
      } catch (error) {
        console.error('Failed to load universities:', error);
      } finally {
        setLoading(false);
      }
    };
    loadUniversities();
  }, []);

  return <div>{/* Render universities */}</div>;
};
```

#### Example 2: Get Profile Completion
```typescript
import { getProfileProgress } from '@/services/studentProfile';

const ProfileCard = () => {
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const response = await getProfileProgress();
        // Extract percentage from response
        const progressData = response.data || response;
        setCompletion(progressData.percentage || 0);
      } catch (error) {
        console.error('Failed to load progress:', error);
        setCompletion(0);
      }
    };
    loadProgress();
  }, []);

  return <div>Profile {completion}% Complete</div>;
};
```

#### Example 3: Get University Details
```typescript
import { getUniversityById } from '@/services/universities';

const UniversityDetail = ({ universityId }) => {
  const [university, setUniversity] = useState(null);

  useEffect(() => {
    const loadUniversity = async () => {
      try {
        const response = await getUniversityById(universityId);
        // response.data contains university details
        setUniversity(response.data || response);
      } catch (error) {
        console.error('Failed to load university:', error);
      }
    };
    loadUniversity();
  }, [universityId]);

  return <div>{/* Render university details */}</div>;
};
```

## ⚠️ IMPORTANT NOTES

### Token Expiry
- **Access tokens expire after 1 hour**
- The `tokenService` automatically handles 401 errors and refreshes
- If you see 401 errors, ensure the user is logged in with a fresh token
- Users need to log in again if both access and refresh tokens expire

### Response Structure
All backend APIs return data in this format:
```json
{
  "success": true,
  "message": "...",
  "data": { ... },
  "timestamp": "..."
}
```

The API services automatically extract `data` from the response, so you get the actual data directly.

### Error Handling
```typescript
try {
  const data = await getUniversities();
  // data is already extracted from response.data
} catch (error) {
  // Handle error
  if (error.message.includes('401')) {
    // Token expired, redirect to login
  }
}
```

## 🔄 WHAT'S NEXT

### Frontend Integration Needed:

#### 1. **Universities Page** (`src/pages/Universities.tsx`)
- ✅ Already imports `universityAPI` from `api.ts`
- ✅ `api.ts` now uses authenticated requests
- ✅ Should work automatically with backend

**Just verify it fetches data correctly:**
```typescript
// Current code in Universities.tsx uses:
universityAPI.getUniversities(params)
universityAPI.getUniversityCourses(universityId)

// These now use authentication automatically!
```

#### 2. **Profile Builder** (`src/pages/ProfileBuilder.tsx`)
- ✅ Already imports `getProfileSteps`, `getCurrentStep`, etc.
- ✅ Should work with backend
- ⚠️ **IMPORTANT:** Backend fields may differ from frontend form fields

**Current Frontend Fields:**
```typescript
formData = {
  personal: { firstName, lastName, email, phone, dateOfBirth, nationality },
  academics: { educationLevel, fieldOfStudy, institution, graduationYear, gpa, gradingSystem },
  testScores: { ieltsOverall, toeflTotal, greTotal, gmatTotal, ... },
  experience: { workExperience, internships, projects, certifications },
  preferences: { targetCountries, preferredPrograms, studyLevel, intakePreference }
}
```

**Backend Fields (from `/api/v1/students/profile`):**
```typescript
data = {
  basic_info: { phone, nationality, date_of_birth, current_location },
  education: { ... },
  test_scores: { ... },
  preferences: { ... },
  financial: { ... },
  compliance: { gdpr_consent, terms_accepted, ... },
  workflow_flags: { ... }
}
```

**⚠️ ACTION REQUIRED:**
- Map frontend field names to backend field names
- Or update backend to accept frontend field structure
- Coordinate with backend engineer

#### 3. **Applications Page**
- Should use APIs from `studentProfile.js`:
  - `getStudentApplications()`
  - `createApplication(data)`
  - `getApplicationById(id)`

## 🎯 TESTING CHECKLIST

### 1. Test Login Flow
- [ ] Log in with test credentials
- [ ] Verify token is saved to localStorage
- [ ] Check console for `[TokenService] Using user login token`

### 2. Test Dashboard
- [ ] Profile completion card shows correct percentage
- [ ] If API fails, falls back to local calculation
- [ ] Retry button works if there's an error

### 3. Test Universities Page
- [ ] Universities list loads with authentication
- [ ] University details page works
- [ ] Courses modal loads courses with authentication
- [ ] No 401 errors in console

### 4. Test Profile Builder
- [ ] Form loads with existing data
- [ ] Save updates profile via backend
- [ ] Progress updates on backend

### 5. Test Token Expiry
- [ ] Wait 1 hour after login
- [ ] Make an API request
- [ ] Should auto-refresh token or redirect to login

## 📞 BACKEND COORDINATION NEEDED

### Tell your backend engineer:

1. **Field Mapping Issues:**
   - Frontend uses camelCase: `firstName`, `lastName`
   - Backend uses snake_case: `first_name`, `last_name`
   - **Solution:** Either standardize or add mapping layer

2. **Profile Builder Steps:**
   - Frontend expects specific step structure
   - Backend provides: `stepId`, `title`, `completed`, `required`, `order`
   - Need to verify all fields are present

3. **Missing Endpoints (if needed):**
   - `POST /api/v1/students/profile/builder/update` - Save form data
   - `PUT /api/v1/students/profile/{section}` - Update specific section

## 🎉 SUMMARY

**What's Working:**
✅ Centralized token management
✅ All APIs use authentication automatically
✅ Dashboard shows backend profile progress
✅ Universities API ready to use
✅ Profile APIs integrated
✅ Automatic token refresh on 401

**What Needs Attention:**
⚠️ Field name mapping between frontend and backend
⚠️ Verify all APIs return expected data structure
⚠️ Test with real backend (currently uses placeholders)
⚠️ Add save/update endpoints for profile builder

**No UI/UX Changes:**
✅ All existing UI remains the same
✅ Only backend integration added
✅ Graceful fallbacks if APIs fail

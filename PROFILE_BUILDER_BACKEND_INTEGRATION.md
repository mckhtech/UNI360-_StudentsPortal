# Profile Builder Backend Integration

## Overview
The ProfileBuilder component has been updated to load profile data from the backend API on initialization and save profile data to the backend API whenever the user saves or completes a step.

## Changes Made

### 1. **Added New Import**
```typescript
import { 
  getProfileSteps, 
  getCurrentStep, 
  validateProfile, 
  resetProfileBuilder, 
  getProfileProgress, 
  saveProfileData,      // NEW
  loadProfileData       // NEW
} from "@/services/studentProfile";
```

### 2. **Added New State Variable**
```typescript
const [backendDataLoaded, setBackendDataLoaded] = useState(false);
```
This tracks whether profile data has been loaded from the backend to prevent duplicate loads.

### 3. **Updated Initialization (useEffect)**

**Before:** 
- The component loaded data only from localStorage
- Backend was only queried for steps and progress, not profile data

**After:**
- The component now loads profile data from the backend using `loadProfileData()`
- Profile data is fetched in parallel with steps, progress, and current step
- Backend data is mapped to the frontend form structure automatically
- Only falls back to localStorage if backend fails

**Key Code Addition:**
```typescript
const [steps, current, progressResponse, profileData] = await Promise.all([
  getProfileSteps(),
  getCurrentStep(),
  getProfileProgress(),
  loadProfileData(),  // NEW - loads profile from backend
]);

// Map loaded profile data to form structure
if (profileData) {
  const mappedFormData: FormData = {
    personal: {
      firstName: (user as User).firstName || '',
      lastName: (user as User).lastName || '',
      email: (user as User).email || '',
      phone: profileData.phone || '',
      dateOfBirth: profileData.dateOfBirth || '',
      nationality: profileData.nationality || '',
    },
    // ... rest of the mapping
  };
  
  setFormData(mappedFormData);
}
```

### 4. **Updated `nextStep()` Function**

**Before:**
- Only validated the current step
- Moved to the next step
- Saved to localStorage only

**After:**
- Validates the current step
- **Saves profile data to backend using `saveProfileData()`**
- Then moves to the next step
- Still saves to localStorage for backup

**Key Code Addition:**
```typescript
const nextStep = async () => {
  if (!validateCurrentStep()) {
    return;
  }

  if (currentStep < steps.length) {
    // Save to backend before moving to next step
    setIsSaving(true);
    try {
      const profileData = {
        phone: formData.personal.phone || '',
        dateOfBirth: formData.personal.dateOfBirth || '',
        // ... all other fields
      };

      await saveProfileData(profileData);  // NEW - saves to backend
      console.log('ProfileBuilder: Profile data saved to backend');
    } catch (error) {
      console.error('Error saving profile to backend:', error);
      // Continue to next step even if save fails
    } finally {
      setIsSaving(false);
    }
    
    // Then proceed to next step
    // ...
  }
};
```

### 5. **Updated `completeProfile()` Function**

**Before:**
- Called `updateUserProfile()` only (for user context)
- Cleared localStorage

**After:**
- **Calls `saveProfileData()` to save to backend first**
- Then calls `updateUserProfile()` for user context (firstName, lastName, profileCompleted flag)
- Backend is now the source of truth

**Key Code Changes:**
```typescript
// Save to backend using saveProfileData
await saveProfileData(profileData);

// Also update user profile context (for firstName, lastName, email)
await updateUserProfile({
  firstName: formData.personal.firstName || "",
  lastName: formData.personal.lastName || "",
  name: `${formData.personal.firstName || ""} ${formData.personal.lastName || ""}`.trim(),
  profileCompleted: true,
});
```

### 6. **Removed Duplicate localStorage Initialization**
The component previously had duplicate logic for loading from localStorage AND backend. The localStorage loading after backend fetch has been removed to avoid overwriting backend data.

## Data Flow

### On Load:
1. Component initializes
2. Fetches profile data from backend via `loadProfileData()`
3. Maps backend data (snake_case) to frontend format (camelCase)
4. Populates form fields with backend data
5. If backend fails, falls back to localStorage (graceful degradation)

### On Save (Next Step):
1. User clicks "Next" button
2. Validates current step
3. **Saves current form data to backend via `saveProfileData()`**
4. Proceeds to next step
5. Also saves to localStorage as backup

### On Complete:
1. User completes all steps
2. Validates final step
3. **Saves all profile data to backend via `saveProfileData()`**
4. Updates user context via `updateUserProfile()`
5. Marks profile as complete
6. Clears localStorage

## Backend API Integration

The component uses these functions from `studentProfile.js`:

### `loadProfileData()`
- **Endpoint:** `GET /api/v1/students/profile`
- **Returns:** Profile data in frontend format (camelCase)
- **Mapping:** Automatically converts backend `snake_case` to frontend `camelCase`

### `saveProfileData(profileData)`
- **Endpoint:** `PUT /api/v1/students/profile`
- **Accepts:** Profile data in frontend format (camelCase)
- **Mapping:** Automatically converts frontend `camelCase` to backend `snake_case`

Both functions handle authentication automatically using the centralized token service.

## Field Mapping

| Frontend (FormData)           | Backend API                    |
|-------------------------------|--------------------------------|
| `phone`                       | `basic_info.phone`             |
| `dateOfBirth`                 | `basic_info.date_of_birth`     |
| `nationality`                 | `basic_info.nationality`       |
| `educationLevel`              | `education.education_level`    |
| `fieldOfStudy`                | `education.field_of_study`     |
| `institution`                 | `education.institution`        |
| `graduationYear`              | `education.graduation_year`    |
| `gpa`                         | `education.gpa`                |
| `gradingSystem`               | `education.grading_system`     |
| `ieltsOverall`                | `test_scores.ielts_overall`    |
| `ieltsListening`              | `test_scores.ielts_listening`  |
| `ieltsReading`                | `test_scores.ielts_reading`    |
| `ieltsWriting`                | `test_scores.ielts_writing`    |
| `ieltsSpeaking`               | `test_scores.ielts_speaking`   |
| `toeflTotal`                  | `test_scores.toefl_total`      |
| `greTotal`                    | `test_scores.gre_total`        |
| `gmatTotal`                   | `test_scores.gmat_total`       |
| `targetCountries`             | `preferences.target_countries` |
| `preferredPrograms`           | `preferences.preferred_programs`|
| `studyLevel`                  | `preferences.study_level`      |
| `intakePreference`            | `preferences.intake_preference`|
| `workExperience`              | `experience.work_experience`   |
| `internships`                 | `experience.internships`       |
| `projects`                    | `experience.projects`          |
| `certifications`              | `experience.certifications`    |

**Note:** `firstName`, `lastName`, and `email` are NOT stored in the profile endpoint. They are stored in the user context and fetched from the `user` object.

## Error Handling

- If backend load fails: Falls back to localStorage gracefully
- If backend save fails: Logs error but continues to next step (doesn't block user progress)
- All errors are logged to console for debugging
- User is never blocked from proceeding due to backend issues

## localStorage Usage

localStorage is now used as a **backup/cache** only:
- Saves on every form change for recovery in case of page refresh
- Backend is the authoritative source of truth
- Can be safely cleared after profile completion

## Testing Recommendations

1. **Test Backend Load:**
   - Open ProfileBuilder page
   - Check console for "Backend profile data loaded and mapped to form"
   - Verify form fields are populated with backend data

2. **Test Backend Save:**
   - Fill out a step
   - Click "Next"
   - Check console for "Profile data saved to backend"
   - Check network tab for PUT request to `/api/v1/students/profile`

3. **Test Complete:**
   - Complete all steps
   - Click "Complete Profile"
   - Check console for "Profile completed and saved to backend successfully"
   - Verify profile data in backend

4. **Test Fallback:**
   - Disconnect from backend or use invalid token
   - Check that component still works with localStorage
   - Verify error handling

## Future Improvements

1. Add a "Save Draft" button for explicit saves
2. Show save status indicator (saving, saved, error)
3. Add conflict resolution if backend data differs from local data
4. Implement optimistic updates for better UX
5. Add retry logic for failed saves
6. Show user-friendly error messages on save failures

## Notes

- Backend authentication is handled automatically by `makeAuthenticatedRequest()`
- Token expiry is handled by the centralized token service
- All API errors are caught and logged
- User progress is never blocked by backend issues
- The component maintains backward compatibility with localStorage

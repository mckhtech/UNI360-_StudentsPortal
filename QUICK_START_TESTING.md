# Quick Start - Testing the Backend Integration

## 🚀 Quick Test Steps

### 1. Login and Verify Token
```bash
# Open browser console (F12) and run:
localStorage.getItem('uni360_access_token')

# You should see a JWT token like:
# "eyJhbGciOiJIUzUxMiJ9..."
```

### 2. Test Dashboard (Profile Progress)
1. Navigate to `/dashboard`
2. Look for the **"Profile XX% Complete"** card (first card on left if profile < 100%)
3. Open browser console (F12)
4. Look for logs:
   ```
   [Dashboard] Profile progress response: {...}
   [Dashboard] Profile completion percentage: 11
   ```

**Expected Result:**
- Card shows percentage from backend (e.g., "Profile 11% Complete")
- If backend API fails, falls back to local calculation
- Console shows the API response with `data.percentage`

### 3. Test Universities Page
1. Navigate to `/universities`
2. Open browser console (F12)
3. Look for logs:
   ```
   [TokenService] Using user login token
   [Universities] Fetching universities list: /api/v1/universities
   [API] Making authenticated request to: /api/v1/universities
   ```

**Expected Result:**
- Universities list loads with authentication
- No 401 errors in console
- Universities display correctly

### 4. Test University Details
1. Click on any university card
2. Modal opens with university details
3. Console shows:
   ```
   [Universities] Fetching university: {universityId}
   [API] Response from /api/v1/universities/{id}: {...}
   ```

**Expected Result:**
- University details load
- Courses list appears in modal
- All data displays correctly

## 🔍 Debugging Common Issues

### Issue 1: "401 Unauthorized" Errors
**Cause:** Token expired (tokens expire after 1 hour)

**Fix:**
1. Log out and log back in to get a fresh token
2. Check console for:
   ```
   [TokenService] 401 Unauthorized - Refreshing token...
   ```
3. If refresh fails, you'll need to login again

**Quick Check:**
```javascript
// In browser console:
const token = localStorage.getItem('uni360_access_token');
const payload = JSON.parse(atob(token.split('.')[1]));
const expiryDate = new Date(payload.exp * 1000);
console.log('Token expires at:', expiryDate);
console.log('Is expired?', expiryDate < new Date());
```

### Issue 2: "No access token available"
**Cause:** Not logged in or token not stored

**Fix:**
1. Navigate to `/login`
2. Log in with your credentials
3. Verify token is stored:
   ```javascript
   localStorage.getItem('uni360_access_token') !== null
   ```

### Issue 3: Backend returns different fields
**Cause:** Field name mismatch between frontend and backend

**Example:**
- Frontend expects: `firstName`, `lastName`
- Backend returns: `first_name`, `last_name`

**Fix:**
1. Check `API_INTEGRATION_GUIDE.md` for field mappings
2. Coordinate with backend engineer to standardize
3. Or add mapping layer in frontend

## 🧪 Test with Browser Console

### Test Universities API
```javascript
// Import the service (if using module console)
import { getUniversities } from '@/services/universities';

// Or test directly
const testUniversities = async () => {
  try {
    const response = await fetch('http://34.230.50.74:8080/api/v1/universities', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('uni360_access_token')}`,
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      }
    });
    const data = await response.json();
    console.log('Universities:', data);
  } catch (error) {
    console.error('Error:', error);
  }
};
testUniversities();
```

### Test Profile Progress API
```javascript
const testProgress = async () => {
  try {
    const response = await fetch('http://34.230.50.74:8080/api/v1/students/profile/builder/progress', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('uni360_access_token')}`,
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      }
    });
    const data = await response.json();
    console.log('Progress:', data);
    console.log('Percentage:', data.data.percentage);
  } catch (error) {
    console.error('Error:', error);
  }
};
testProgress();
```

### Test Profile Data API
```javascript
const testProfile = async () => {
  try {
    const response = await fetch('http://34.230.50.74:8080/api/v1/students/profile', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('uni360_access_token')}`,
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      }
    });
    const data = await response.json();
    console.log('Profile:', data);
  } catch (error) {
    console.error('Error:', error);
  }
};
testProfile();
```

## ✅ Success Indicators

### Dashboard Loaded Successfully
- ✅ Profile completion card shows percentage
- ✅ Console shows: `[Dashboard] Profile completion percentage: XX`
- ✅ No 401 errors

### Universities Loaded Successfully
- ✅ List of universities displays
- ✅ Console shows: `[API] Response from /api/v1/universities`
- ✅ Can click on university to see details
- ✅ Courses load in modal

### Profile Builder Working
- ✅ Form loads existing data
- ✅ Can navigate between steps
- ✅ Progress updates on backend

## 🎯 What to Check

### 1. Network Tab (F12 → Network)
- Look for requests to `/api/v1/universities`, `/api/v1/students/profile`
- Check request headers include: `Authorization: Bearer ...`
- Check response status: Should be 200, not 401 or 500

### 2. Console Tab (F12 → Console)
- Look for `[TokenService]`, `[API]`, `[Dashboard]` logs
- Check for errors (red text)
- Verify API responses are logged

### 3. Application Tab (F12 → Application → Local Storage)
- Check `uni360_access_token` exists
- Check `uni360_refresh_token` exists
- Check `uni360_user` exists (contains user data)

## 🐛 Report Issues

When reporting issues to your backend engineer, include:

1. **What you did:** "I clicked on Universities page"
2. **What happened:** "Got 401 error"
3. **Console logs:** Copy the error from console
4. **Network request:** Screenshot of Network tab showing the failed request
5. **Token info:** 
   ```javascript
   const token = localStorage.getItem('uni360_access_token');
   console.log('Token exists:', !!token);
   console.log('Token length:', token?.length);
   ```

## 📝 Testing Checklist

**Before Testing:**
- [ ] Backend server is running at `http://34.230.50.74:8080`
- [ ] You have valid login credentials
- [ ] Browser console is open (F12)

**Login Test:**
- [ ] Can log in successfully
- [ ] Token is stored in localStorage
- [ ] User data is stored in localStorage

**Dashboard Test:**
- [ ] Dashboard loads without errors
- [ ] Profile completion card shows percentage
- [ ] Progress bar displays correctly
- [ ] No 401 errors in console

**Universities Test:**
- [ ] Universities list loads
- [ ] Can search/filter universities
- [ ] Can view university details
- [ ] Courses load for each university
- [ ] No authentication errors

**Profile Builder Test:**
- [ ] Form loads with existing data (if any)
- [ ] Can fill in form fields
- [ ] Can navigate between steps
- [ ] Progress saves to backend

## 🎉 All Tests Passed?

If all tests pass:
1. ✅ Backend integration is working
2. ✅ Authentication is set up correctly
3. ✅ APIs are returning expected data
4. ✅ UI is displaying backend data

**Next Steps:**
- Test with more user interactions
- Fill out complete profile and verify data persistence
- Create applications and verify they're saved
- Test edge cases (expired tokens, network errors, etc.)

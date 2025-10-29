# 🔧 Fix Profile Data Not Loading Issue

You're logged in but profile data isn't loading. Let's diagnose this quickly!

---

## 🚀 QUICK FIX - Do This NOW:

### Step 1: Open Browser Console
1. Press **F12** on your keyboard (or right-click → Inspect)
2. Click the **Console** tab

### Step 2: Run Diagnostic Script
1. Open the file: **`BROWSER_CONSOLE_TEST.js`**
2. Copy ALL the code from that file
3. Paste it into the browser console
4. Press Enter

### Step 3: Check the Results

The script will tell you:
- ✅ If your token exists
- ✅ If your token is valid or expired
- ✅ If the backend accepts your token
- ✅ If API calls are working

---

## 📊 What the Results Mean:

### ✅ **If you see "API CALL SUCCESSFUL"**
Your code is working! The issue might be:
- Network latency
- Backend returning empty data
- Frontend error handling catching the data

**Solution:** Check the Network tab (F12 → Network) to see the actual response.

---

### ❌ **If you see "Token is expired" or "401 Error"**
Your token expired or is invalid.

**Solution:**
1. Log out of the student portal
2. Log back in
3. Try again

---

### ❌ **If you see "NO TOKEN FOUND"**
You're not actually logged in (token wasn't saved).

**Solution:**
Check if login is working:
1. Go to Network tab (F12 → Network)
2. Log in again
3. Look for the `/api/v1/auth/login` request
4. Check if response contains `accessToken`
5. If yes, but not saved → login code has a bug
6. If no → backend isn't returning token

---

## 🔍 Alternative: Manual Check

Run these commands in the console one by one:

```javascript
// Check if token exists
console.log('Token:', localStorage.getItem('uni360_access_token'));

// If token exists, test it
const token = localStorage.getItem('uni360_access_token');
fetch('http://34.230.50.74:8080/api/v1/students/profile/builder/steps', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'X-Client-ID': 'uniflow',
    'Content-Type': 'application/json'
  }
}).then(r => r.json()).then(d => console.log('Success:', d)).catch(e => console.error('Error:', e));
```

---

## 🎯 Most Likely Issues:

### 1. **Token Expired** (Most Common)
- JWT tokens expire after some time (usually 1-24 hours)
- **Fix:** Log out and log back in

### 2. **Token Not Saved During Login**
- Login might be succeeding but token not stored
- **Check:** `src/services/auth.js` line 207: `setTokens(data.accessToken, data.refreshToken);`
- **Fix:** Make sure this line runs after successful login

### 3. **Backend Returning Different Token Format**
- Backend might return token in different field name
- **Check:** Network tab → `/api/v1/auth/login` response
- **Look for:** `accessToken`, `token`, `access_token`

### 4. **CORS or Network Issues**
- Browser blocking requests
- **Check:** Console for CORS errors
- **Fix:** Backend needs to enable CORS

---

## 🛠️ If Token Exists But API Fails:

### Check Token Format
```javascript
const token = localStorage.getItem('uni360_access_token');
console.log('Token:', token);

// Decode it
try {
  const parts = token.split('.');
  const payload = JSON.parse(atob(parts[1]));
  console.log('Decoded:', payload);
  console.log('Expires:', new Date(payload.exp * 1000));
} catch(e) {
  console.error('Token is not a valid JWT:', e);
}
```

### Check What's Being Sent
```javascript
// Monitor fetch requests
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('Fetch:', args[0]);
  console.log('Headers:', args[1]?.headers);
  return originalFetch.apply(this, args);
};
```

Then reload the page and see what requests are being made.

---

## 🎓 Understanding Your Frontend Code

Your code flow (from `Dashboard.tsx`):

```javascript
// Dashboard tries to fetch profile data
useEffect(() => {
  const fetchDashboardData = async () => {
    // Line 146: Calls getProfileProgress()
    const progress = await getProfileProgress();
    
    // Line 147: Calls getCurrentStep()
    const current = await getCurrentStep();
    
    // Line 148: Calls getProfileSteps()
    const steps = await getProfileSteps();
  };
  
  fetchDashboardData();
}, [user]);
```

These functions (from `studentProfile.js`):
```javascript
const apiRequest = async (endpoint, options = {}) => {
  // Line 13: Gets token
  const token = getToken();
  
  // Line 14-16: Checks if token exists
  if (!token) {
    throw new Error('No authentication token found. Please log in.');
  }
  
  // Line 24: Adds Authorization header
  config.headers = {
    'Authorization': `Bearer ${token}`,  // ✅ This is correct!
    'X-Client-ID': 'uniflow',
  };
  
  // Line 38: Makes request
  const response = await fetch(url, config);
};
```

**Your code is correct!** If it's not working, it's because:
1. Token doesn't exist → You need to log in
2. Token is expired → Log out and log back in
3. Token is wrong format → Check login response
4. Backend is rejecting token → Check backend logs

---

## ✅ Quick Checklist:

- [ ] Run `BROWSER_CONSOLE_TEST.js` script
- [ ] Check if token exists in localStorage
- [ ] Check if token is expired
- [ ] Try logging out and back in
- [ ] Check Network tab for actual API responses
- [ ] Check Console for any JavaScript errors
- [ ] Verify backend is returning `accessToken` on login

---

## 📞 Still Not Working?

Send me:
1. Screenshot of browser console after running diagnostic script
2. Screenshot of Network tab showing the API request
3. Any error messages you see

The script will tell us exactly what's wrong!

---

**TL;DR:**
1. Open console (F12)
2. Run `BROWSER_CONSOLE_TEST.js` script
3. Follow the results
4. Most likely: Token expired → Log out and back in

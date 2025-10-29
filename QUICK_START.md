# 🚀 Quick Start - Centralized Token System

## ⚡ 3-Minute Setup

### Step 1: Add Your Backend Token

Open `.env` file and add:
```env
VITE_STATIC_ACCESS_TOKEN=your_backend_access_token_here
```

Replace `your_backend_access_token_here` with the actual token from your backend.

### Step 2: Restart Dev Server

```bash
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 3: Test It!

1. Open your app in browser
2. Press F12 (open console)
3. You should see:
   ```
   [TokenService] Using static token from environment
   [TokenService] Making authenticated request to: ...
   ```

4. No more 401 errors! ✅

---

## 🎯 That's It!

Your entire application now:
- ✅ Automatically fetches token from backend/environment
- ✅ Adds Authorization headers to all API requests
- ✅ Works on all pages (Dashboard, Documents, Universities, etc.)
- ✅ Auto-refreshes if token expires
- ✅ Single source of truth for authentication

---

## 🔍 Verify It's Working

### Check 1: Console Logs
Look for these in browser console:
```
[TokenService] Using static token from environment
[StudentProfile] API Request: GET /api/v1/students/profile/builder/steps
[TokenService] Making authenticated request to: http://34.230.50.74:8080/...
```

### Check 2: Network Tab
1. Press F12 → Network tab
2. Reload page
3. Click on any API request
4. Check Headers section
5. You should see: `Authorization: Bearer your_token`

### Check 3: No More 401 Errors
Navigate to:
- Dashboard → Should load profile data ✅
- Documents → Should load documents ✅
- Universities → Should load universities ✅
- Profile Builder → Should load steps ✅

---

## 🛠️ If Something's Not Working

### Problem: Still getting 401 errors

**Solution 1:** Check if token is set correctly
```bash
# In browser console
console.log(import.meta.env.VITE_STATIC_ACCESS_TOKEN);
```

**Solution 2:** Make sure you restarted the dev server after adding to .env

**Solution 3:** Check token is valid
- Get the token from backend team
- Make sure it's not expired
- Verify format (should be a long string)

### Problem: Console shows "Using user login token"

This means it's not finding the static token. Check:
1. Did you add `VITE_STATIC_ACCESS_TOKEN` to `.env`?
2. Did you restart the dev server?
3. Is the token value correct (no quotes needed in .env)?

---

## 📝 Example .env File

```env
# Your complete .env file should look like:
VITE_API_BASE_URL=http://34.230.50.74:8080
VITE_STATIC_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# MakeMyTrip API Configuration
VITE_MMT_API_BASE_URL=https://api.makemytrip.com
VITE_MMT_PARTNER_API_KEY=your_partner_api_key_here
VITE_MMT_CLIENT_CODE=your_client_code_here
```

---

## 🎓 What Changed?

### Before:
```javascript
// Every file had this:
const token = getToken();
if (!token) throw new Error('No token');
fetch(url, { headers: { Authorization: `Bearer ${token}` } });
```

### After:
```javascript
// Now just:
import { makeAuthenticatedRequest } from '@/services/tokenService';
await makeAuthenticatedRequest('/api/v1/students/profile');
// Token handled automatically!
```

---

## ✅ Success Checklist

- [ ] Added `VITE_STATIC_ACCESS_TOKEN` to `.env`
- [ ] Restarted dev server
- [ ] Opened browser console
- [ ] See `[TokenService]` logs
- [ ] Dashboard loads without 401 errors
- [ ] Documents page works
- [ ] Profile data loads
- [ ] **All working!** 🎉

---

## 📚 For More Details

Read `CENTRALIZED_TOKEN_SYSTEM.md` for:
- Complete technical documentation
- Advanced configuration options
- Troubleshooting guide
- Code examples

---

**Need Help?**
1. Check browser console for `[TokenService]` logs
2. Check Network tab → Headers
3. Verify token in .env is correct
4. Make sure dev server was restarted

**Status:** ✅ Ready to use immediately!

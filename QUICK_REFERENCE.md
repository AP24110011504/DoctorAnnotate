# 🚀 Quick Reference Card

## Start Servers (Pick One)

### Method 1: Auto-Start Both ⭐ RECOMMENDED
```powershell
.\start-all.ps1
```
Opens both backend & frontend in new terminals automatically.

### Method 2: Manual Start (More Control)

**Terminal 1 - Backend:**
```powershell
cd backend
npm install  # (first time only)
npm run dev
# Should show: Server running on port 5000
```

**Terminal 2 - Frontend:**
```powershell
npm install  # (first time only)
npm run dev
# Should show: Listening on http://localhost:3000
```

---

## Test Signup Form

1. Open http://localhost:3000
2. Click "Create Account"
3. Fill in:
   - Username: `testdoc` (or anything unique)
   - Email: `testdoc@gmail.com` (must end with @gmail.com)
   - Password: `Pass@123` (6+ chars, at least 1 special char)
4. Click "Create Account"
5. **Expected**: Success → Redirects to /annotate
6. **Check Console** (F12): Look for `✅ Registration successful`

---

## Verify It's Working

### Test Backend Health
```powershell
curl http://localhost:5000/api/health
```
Should return JSON with "ok" status.

### Test Register Endpoint
```powershell
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{"username":"testuser","email":"test@gmail.com","password":"Pass@123"}'
```
Should return 201 with user data.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Failed to fetch" in UI | Backend not running. Check backend terminal for errors |
| Backend won't start | Check MongoDB is running: `mongod` |
| Port already in use | Port 5000/3000 taken. Kill process or change port |
| Module errors | Run `npm install` in both folder |
| Video clear? | Browser cache. Press F5 or Ctrl+Shift+Delete to clear |

---

## Files Changed

✅ `backend/routes/auth.js` - Added `/register` route  
✅ `app/page.tsx` - Better error handling  
✅ `SIGNUP_DEBUG_GUIDE.md` - Full reference (read if stuck)  
✅ `FIXES_APPLIED.md` - Summary of changes  
✅ `run-backend.ps1`, `run-frontend.ps1`, `start-all.ps1` - Helper scripts  

---

## Key Improvements

### Before ❌
- Both signup & login used same endpoint
- Generic "Failed to fetch" error
- No detection if backend was down
- Unclear what went wrong

### After ✅
- Signup uses `/register` endpoint
- Login uses `/login` endpoint
- Clear error messages: "Username exists", "Server down", etc.
- Auto-detects if backend is running
- Shows meaningful feedback in UI

---

## Database

Ensure **MongoDB is running** before starting backend:

```powershell
# Check MongoDB status
netstat -ano | findstr :27017

# Start MongoDB if not running
mongod

# OR (if installed as service)
Get-Service MongoDB | Start-Service
```

---

## Next Steps After Success

1. ✅ Test signup (see "Test Signup Form" above)
2. ✅ Try duplicate username (should show error)
3. ✅ Try duplicate email (should show error)
4. ✅ Try login with created account
5. ✅ Check annotations page loads
6. ✅ Deploy when confident

---

## 📚 Full Guides

- **Complete Setup**: `SIGNUP_DEBUG_GUIDE.md`
- **Changes Made**: `FIXES_APPLIED.md`
- **Architecture**: See `BACKEND_INTEGRATION.md` (if needed)

---

## 💡 Pro Tips

- Keep both terminals visible during testing
- Use browser console (F12) to see detailed logs
- Backend logs show MongoDB connection status
- Password needs: 6+ chars AND 1 special char (!@#$%^&*)
- Email must be @gmail.com
- Username must be unique

---

## ⏱️ Typical Startup Time

- Backend: 2-3 seconds (+ MongoDB startup)
- Frontend: 5-8 seconds (Next.js compilation)
- **Total**: ~10-15 seconds from cold start

---

**Ready? Run: `.\start-all.ps1`** 🎉

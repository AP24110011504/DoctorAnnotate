# Signup "Failed to Fetch" - Complete Debug & Fix Guide

## 🎯 What Was Fixed

### Backend (`/backend/routes/auth.js`)
✅ Added dedicated `/api/auth/register` endpoint (POST)  
✅ Separated signup logic from login logic  
✅ Proper validation and error codes (400, 409, 500)  
✅ Checks for duplicate username (409 Conflict)  
✅ Checks for duplicate email (409 Conflict)  
✅ Returns user data + JWT token on success  

### Frontend (`/app/page.tsx`)
✅ Uses `/api/auth/register` for signup  
✅ Uses `/api/auth/login` for login  
✅ Added `checkBackendHealth()` function  
✅ Added `getErrorMessage()` function for user-friendly errors  
✅ Robust try-catch with detailed logging  
✅ Detects if backend is not running  
✅ Shows specific errors: "Username exists", "Email exists", "Server not running", etc.  

### CORS & Headers
✅ Backend already has proper CORS setup  
✅ Frontend sends `Content-Type: application/json`  
✅ Backend accepts requests from localhost:3000  

---

## 🚀 How to Run (Complete Steps)

### Step 1: Start MongoDB (Required)
```powershell
# Option A: If MongoDB is installed locally
mongod

# Option B: If using MongoDB Atlas or remote
# Ensure MONGODB_URI is set in /backend/.env
```

### Step 2: Start Backend Server (Terminal 1)
```powershell
# Navigate to backend folder
cd "c:\Users\chiti\OneDrive\Desktop\Innovate_x\backend"

# Install dependencies (first time only)
npm install

# Start with nodemon (auto-reload on changes)
npm run dev

# OR use direct node
npm start

# Expected output:
# ✅ MongoDB connected successfully
# 🚀 Server running on port 5000
# 📍 http://localhost:5000
# 🏥 Medical Annotation Backend v1.0
```

### Step 3: Start Frontend Server (Terminal 2)
```powershell
# Navigate to root folder
cd "c:\Users\chiti\OneDrive\Desktop\Innovate_x"

# Install dependencies (first time only)
npm install

# Start Next.js dev server
npm run dev

# Expected output:
# ▲ Next.js 14.0.0
# - Local: http://localhost:3000
```

### Step 4: Open in Browser
```
http://localhost:3000
```

---

## ✅ Testing Checklist

### Test 1: Backend Health Check
```powershell
# Run this in any terminal to check if backend is running
curl http://localhost:5000/api/health
```
**Expected Response:**
```json
{
  "status": "ok",
  "message": "Medical Annotation Backend is running",
  "timestamp": "2026-04-11T..."
}
```

### Test 2: Check Username Endpoint
```powershell
curl -X POST http://localhost:5000/api/auth/check-username `
  -H "Content-Type: application/json" `
  -d '{"username":"testuser"}'
```
**Expected Response:**
```json
{
  "exists": false
}
```

### Test 3: Register New Account (Signup)
```powershell
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{
    "username": "doctorsmith",
    "email": "doctor.smith@gmail.com",
    "password": "Pass@123"
  }'
```
**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "token": "eyJhbGc...",
  "user": {
    "userId": "507f1f77bcf86cd799439011",
    "username": "doctorsmith",
    "email": "doctor.smith@gmail.com",
    "doctorVerified": true
  }
}
```

### Test 4: Try Duplicate Username (Should Fail)
```powershell
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{
    "username": "doctorsmith",
    "email": "different@gmail.com",
    "password": "Pass@456"
  }'
```
**Expected Response (409 Conflict):**
```json
{
  "error": "Username Exists",
  "message": "Username already taken. Please choose a different one"
}
```

### Test 5: Try Duplicate Email (Should Fail)
```powershell
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{
    "username": "newdoctor",
    "email": "doctor.smith@gmail.com",
    "password": "Pass@789"
  }'
```
**Expected Response (409 Conflict):**
```json
{
  "error": "Email Exists",
  "message": "Email already registered. Please use a different email or login"
}
```

### Test 6: Login with Existing Account
```powershell
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{
    "username": "doctorsmith",
    "email": "doctor.smith@gmail.com",
    "password": "Pass@123"
  }'
```
**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "userId": "507f1f77bcf86cd799439011",
    "username": "doctorsmith",
    "email": "doctor.smith@gmail.com",
    "doctorVerified": true
  }
}
```

### Test 7: Frontend Signup Form
1. Go to http://localhost:3000
2. Click "Create Account"
3. Fill in:
   - Username: `testdoctor`
   - Email: `testdoctor@gmail.com`
   - Password: `SecurePass!1`
4. Click "Create Account"
5. **Should see**: Success message → redirects to /annotate page
6. **Check browser console** (F12 → Console tab):
   ```
   🔄 Calling REGISTER: http://localhost:5000/api/auth/register
   📊 Response Status: 201 Created
   ✅ Registration successful
   ```

### Test 8: Frontend Login Form
1. Go to http://localhost:3000
2. Click "Sign In"
3. Fill in:
   - Username: `testdoctor`
   - Email: `testdoctor@gmail.com`
   - Password: `SecurePass!1`
4. Click "Sign In"
5. **Should see**: Success → redirects to /annotate page

### Test 9: Error Messages in UI
1. Try signup with wrong email format (not @gmail.com)
   - **Expected**: Red error below email field
2. Try signup with duplicate username
   - **Expected**: "Username already exists" message
3. Try signup with duplicate email
   - **Expected**: "Email already exists" message
4. Try signup with password < 6 chars
   - **Expected**: "Minimum 6 characters..." message

### Test 10: Backend Not Running Error
1. Stop backend server
2. Try to signup
3. **Expected error in UI**:
   ```
   ❌ Cannot reach backend server. 
   Make sure:
   1. Backend is running (npm run dev in /backend)
   2. Port 5000 is correct
   3. MongoDB is running
   ```

---

## 📋 Common Causes & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "Failed to fetch" | Backend not running | Run `npm run dev` in /backend folder |
| "Failed to fetch" | Wrong port | Check backend is on 5000, frontend on 3000 |
| "Failed to fetch" | CORS blocked | Verify CORS config in server.js includes localhost:3000 |
| "Invalid API endpoint" | Wrong URL in fetch() | Check frontend uses `http://localhost:5000/api/auth/register` |
| "Email already exists" | Email in DB | Use different email or login instead |
| "Username already exists" | Username in DB | Use different username |
| "Cannot connect" | MongoDB not running | Start MongoDB or set MONGODB_URI in .env |
| 500 Server Error | Code exception | Check backend console for error details |
| HTTPS/HTTP Mismatch | Protocol mismatch | Use http:// for localhost (not https://) |

---

## 🔍 Debug Checklist

- [ ] MongoDB is running (`mongod` is active)
- [ ] Backend starts without errors (shows "Server running on port 5000")
- [ ] Frontend starts without errors (shows "http://localhost:3000")
- [ ] `curl http://localhost:5000/api/health` returns 200 OK
- [ ] Browser DevTools Console shows no CORS errors
- [ ] Network tab shows `/api/auth/register` request and response
- [ ] Response status is 201 for successful signup
- [ ] Response status is 409 for duplicate username/email
- [ ] User data stored in localStorage (check Storage tab)
- [ ] Can navigate to /annotate after signup

---

## 📝 Backend Code (Complete `/register` Route)

**File**: `backend/routes/auth.js`

```javascript
// POST /api/auth/register - User registration (create account)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Username, email, and password are required',
      });
    }

    // Validate email format
    if (!email.endsWith('@gmail.com')) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Email must be a Gmail address',
      });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({
        error: 'Username Exists',
        message: 'Username already taken. Please choose a different one',
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({
        error: 'Email Exists',
        message: 'Email already registered. Please use a different email or login',
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
    });
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        userId: user._id,
        username: user.username,
        email: user.email,
        doctorVerified: user.doctorVerified,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration Failed',
      message: error.message || 'An error occurred during registration',
    });
  }
});
```

---

## 📝 Frontend Error Handling Code (Key Additions)

**File**: `app/page.tsx`

### New Helper Functions:

```typescript
// Check if backend is running
const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:5000/api/health', {
      method: 'GET',
      timeout: 5000,
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Get user-friendly error message
const getErrorMessage = (error: any, apiUrl: string): string => {
  // Network/CORS errors
  if (error instanceof TypeError) {
    if (error.message.includes('Failed to fetch')) {
      return '❌ Server is not running. Make sure backend is started on http://localhost:5000';
    }
    if (error.message.includes('CORS')) {
      return '❌ CORS error - Backend CORS configuration issue';
    }
    if (error.message.includes('Connection refused')) {
      return '❌ Cannot connect to server. Is it running on port 5000?';
    }
    return `❌ Network error: ${error.message}`;
  }

  // Invalid API endpoint
  if (error.status === 404) {
    return `❌ Invalid API endpoint: ${apiUrl}`;
  }

  // Validation errors
  if (error.status === 400) {
    return error.message || '❌ Invalid input data';
  }

  // Conflict errors
  if (error.status === 409) {
    return error.message || '❌ Username or email already exists';
  }

  // Server errors
  if (error.status === 500) {
    return `❌ Server error: ${error.message || 'Something went wrong'}`;
  }

  return '❌ Unknown error. Please check console for details';
};
```

### Updated handleSubmit for Signup/Login:

```typescript
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    // Determine endpoint based on mode
    const isLoginMode = mode === "login";
    const apiUrl = isLoginMode 
      ? 'http://localhost:5000/api/auth/login'
      : 'http://localhost:5000/api/auth/register';

    console.log(`🔄 Calling ${isLoginMode ? 'LOGIN' : 'REGISTER'}: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      }),
    });

    console.log(`📊 Response Status: ${response.status}`);

    // Parse response
    let responseData;
    try {
      responseData = await response.json();
    } catch (parseError) {
      setError(`❌ Invalid response from server. Status: ${response.status}`);
      setLoading(false);
      return;
    }

    // Handle error responses
    if (!response.ok) {
      const errorMsg = responseData.message || responseData.error || 'Unknown error';
      console.error(`❌ ${isLoginMode ? 'Login' : 'Registration'} failed:`, responseData);
      setError(errorMsg);
      setLoading(false);
      return;
    }

    // Success!
    console.log(`✅ ${isLoginMode ? 'Login' : 'Registration'} successful`);

    // Store user
    const user: User = {
      username: responseData.user.username,
      email: responseData.user.email,
      password: formData.password,
      doctorVerified: responseData.user.doctorVerified ?? true,
    };
    setLoggedInUser(user);
    
    // Redirect to annotate page
    setTimeout(() => {
      router.push("/annotate");
    }, 500);

  } catch (err) {
    console.error('❌ API Error:', err);
    
    // Check if backend is running
    const backendHealthy = await checkBackendHealth();
    
    if (!backendHealthy) {
      setError(
        '❌ Cannot reach backend server. Make sure:\n' +
        '1. Backend is running (npm run dev in /backend)\n' +
        '2. Port 5000 is correct\n' +
        '3. MongoDB is running'
      );
    } else {
      setError(getErrorMessage(err, 'http://localhost:5000/api/auth/' + (mode === "login" ? 'login' : 'register')));
    }
  } finally {
    setLoading(false);
  }
};
```

---

## 🔗 API Endpoints Summary

| Endpoint | Method | Body | Response | Code |
|----------|--------|------|----------|------|
| `/api/auth/register` | POST | username, email, password | User + token | 201/400/409/500 |
| `/api/auth/login` | POST | username, email, password | User + token | 200/400/401/500 |
| `/api/auth/check-username` | POST | username | {exists: bool} | 200/400/500 |
| `/api/auth/verify` | POST | (requires token) | User data | 200/404/500 |
| `/api/health` | GET | (none) | Status message | 200 |

---

## 🎯 Next Steps

1. **Start both servers** (backend on 5000, frontend on 3000)
2. **Test registration** using the checklist above
3. **Check browser console** for detailed logs
4. **Verify MongoDB** is running
5. **Test error cases** (duplicate username, invalid email, etc.)
6. **Deploy** when confident everything works

---

## 📞 Troubleshooting Commands

```powershell
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill process on port 5000 (if needed)
Get-Process | Where-Object {$_.handles -like '*5000*'} | Stop-Process

# Test backend directly
curl http://localhost:5000/api/health

# Check MongoDB status
mongod --version

# View MongoDB logs (if running as service)
Get-Service MongoDB | Start-Service
```

---

## ✨ Success Indicators

✅ Backend logs show "Server running on port 5000"  
✅ Frontend shows "http://localhost:3000"  
✅ Signup creates account successfully  
✅ Console shows no CORS errors  
✅ User redirects to /annotate page  
✅ User data persists in browser storage  
✅ Error messages are clear and helpful  

**You're done!** 🎉

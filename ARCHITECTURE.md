# 🏗️ Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      USER BROWSER                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         React Frontend (localhost:3000)                │ │
│  │ ┌──────────────────────────────────────────────────┐  │ │
│  │ │  app/page.tsx                                    │  │ │
│  │ │  - Login Form                                    │  │ │
│  │ │  - Signup Form                                   │  │ │
│  │ │  - Error Handlers                                │  │ │
│  │ │  - checkBackendHealth()                          │  │ │
│  │ │  - getErrorMessage()                             │  │ │
│  │ └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
            ▼                                  ▼
    [POST /login]                    [POST /register]
            │                                  │
            └──────────────┬───────────────────┘
                           │
        HTTP Request with JSON body
        Headers: Content-Type: application/json
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  NETWORK/INTERNET                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Can fail with: CORS, Network Error, Timeout          │ │
│  │  Frontend detects and shows: "Backend not running"    │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                 Express Backend Server                       │
│             (localhost:5000, Node.js)                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  backend/server.js                                    │ │
│  │  - CORS Middleware (allows localhost:3000)           │ │
│  │  - Express Routes Setup                              │ │
│  │  - MongoDB Connection                                │ │
│  │  - Error Handler Middleware                          │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  backend/routes/auth.js                               │ │
│  │                                                        │ │
│  │  /login (POST)                                        │ │
│  │  - Validates input ─────────────────┐               │ │
│  │  - Finds user by email              │               │ │
│  │  - Auto-creates if not exists       │               │ │
│  │  - Returns: 200 + token             │               │ │
│  │                                     │               │ │
│  │  /register (POST) ◄─── NEW          │               │ │
│  │  - Validates input                  │               │ │
│  │  - Check username NOT in DB ────────┼─── Goes to   │ │
│  │  - Check email NOT in DB ───────────┤    MongoDB    │ │
│  │  - Creates new user                 │               │ │
│  │  - Returns: 201 + token             │               │ │
│  │                                     └─────────────┐ │ │
│  │  Error Codes:                                   │ │ │
│  │  - 400: Bad input                              │ │ │
│  │  - 401: Wrong password                         │ │ │
│  │  - 409: Username/Email exists   Returns ────►  │ │ │
│  │  - 500: Server error                          │ │ │
│  │                                                │ │ │
│  └────────────────────────────────────────────────┼─┘ │
│  ┌────────────────────────────────────────────────┼───┐ │
│  │  Models/User.js                                │   │ │
│  │  - Schema definition                           │   │ │
│  │  - Validation                                  │   │ │
│  │  - Password hashing (bcrypt)                   │   │ │
│  └────────────────────────────────────────────────┼───┘ │
└─────────────────────────────────────────────────────────────┘
                           ▲
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     MongoDB Database                         │
│             (stores username, email, password)              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Collections: users, annotations, images, etc.        │ │
│  │  Document: {                                          │ │
│  │    _id: ObjectId,                                     │ │
│  │    username: "doctorsmith",                           │ │
│  │    email: "doctor@gmail.com",                         │ │
│  │    password: "hashed_password_bcrypt",                │ │
│  │    doctorVerified: true,                              │ │
│  │    createdAt: Date                                    │ │
│  │  }                                                    │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Signup Flow (Step by Step)

```
1. USER FILLS FORM
   └─► Email: user@gmail.com
   └─► Password: MyPass!123
   └─► Username: doctorsmith

2. FRONTEND VALIDATION (JavaScript)
   └─► Email ends with @gmail.com? ✓
   └─► Password has 6+ chars + special char? ✓
   └─► Username not empty? ✓
   └─► All fields filled? ✓
   └─► Shows real-time error hints if invalid

3. USER CLICKS "CREATE ACCOUNT"
   └─► handleSubmit() is called
   └─► setLoading(true) - Disable button

4. DOMAIN VALIDATION (Conditional)
   └─► Is signup? (not login)
   └─► Calls GET /check-username API
   └─► If exists → Show "Username already exists"
   └─► If doesn't exist → Continue

5. API CALL (Main)
   └─► POST http://localhost:5000/api/auth/register
   └─► Headers: Content-Type: application/json
   └─► Body: {
         username: "doctorsmith",
         email: "user@gmail.com",
         password: "MyPass!123"
       }
   └─► Logs: "🔄 CALLING REGISTER..."

6. NETWORK ATTEMPT
   ├─► Success? Go to step 7
   ├─► Failed? Go to step 8
   └─► Timeout? Go to step 8

7. BACKEND VALIDATION & PROCESSING
   ├─► Email ends with @gmail.com?
   │   └─► No → Return 400 "Email must be Gmail"
   │
   ├─► Username already exists?
   │   └─► Yes → Return 409 "Username taken"
   │
   ├─► Email already exists?
   │   └─► Yes → Return 409 "Email registered"
   │
   ├─► Create user in MongoDB
   └─► Generate JWT token
   └─► Return 201 {success: true, token, user}

8. RESPONSE HANDLING
   ├─► Parse JSON response
   │   └─► Error parsing? → Show "Invalid response"
   │
   ├─► Check status code
   │   ├─► 201? → Success! Go to step 9
   │   ├─► 400? → Show validation error
   │   ├─► 409? → Show "Already exists" error
   │   └─► 500? → Show "Server error"
   │
   └─► On error → Show message, stop here

9. ERROR HANDLING (If Network Failed)
   ├─► Check backend health: GET /api/health
   │   ├─► Backend responds? → Network/CORS issue
   │   └─► Backend down? → Show "Cannot reach server"
   │
   └─► Show helpful error message

10. SUCCESS PATH
    ├─► Save user to localStorage
    │   └─► setLoggedInUser(user)
    │
    ├─► Clear form & errors
    │   └─► setError("")
    │
    ├─► Log success
    │   └─► Console: "✅ Registration successful"
    │
    └─► Redirect to /annotate page
        └─► router.push("/annotate")

11. UI SHOWS
    └─► "Account created! Redirecting..."
    └─► Success indicator
    └─► Then redirect happens automatically
```

---

## Error Detection Flow

```
User clicks "Create Account"
│
├─► Try API call
│   │
│   └─── Network Error?
│        │
│        ├─► TypeError: "Failed to fetch"
│        │   └─► Call checkBackendHealth()
│        │       │
│        │       ├─► Backend responds?
│        │       │   └─► CORS/Network issue
│        │       │       Show: "CORS error"
│        │       │
│        │       └─► Backend doesn't respond?
│        │           └─► Backend is DOWN
│        │               Show: "Server not running at port 5000"
│        │
│        └─── Success (got response)
│             └─► Go to Response Parsing
│
└─► Response Status Check
    │
    ├─► 201 Created?
    │   └─► SUCCESS! Redirect to /annotate ✓
    │
    ├─► 400 Bad Request?
    │   └─► Show: "Invalid email" / "Username required"
    │
    ├─► 409 Conflict?
    │   └─► Show: "Username already taken"
    │        Or: "Email already registered"
    │
    ├─► 401 Unauthorized?
    │   └─► Show: "Invalid password"
    │
    ├─► 404 Not Found?
    │   └─► Show: "Invalid API endpoint"
    │       (Means backend route doesn't exist)
    │
    └─► 500 Server Error?
        └─► Show: "Server error: " + message
            (Backend crashed or exception occurred)
```

---

## File Structure

```
Innovate_x/
│
├── 📄 app/                     (Frontend - Next.js/React)
│   ├── page.tsx               ◄─── MODIFIED: Error handling
│   ├── layout.tsx
│   └── annotate/
│       └── page.tsx
│
├── 📄 backend/                (Backend - Node.js/Express)
│   ├── server.js              ◄─── Already correct (CORS setup)
│   ├── routes/
│   │   └── auth.js            ◄─── MODIFIED: Added /register endpoint
│   ├── models/
│   │   └── User.js
│   ├── middleware/
│   │   └── auth.js
│   └── package.json
│
├── 📄 lib/                     (Frontend utilities)
│   ├── api.ts
│   ├── storage.ts
│   └── types.ts
│
├── 📄 public/                  (Static files)
│
├── 📄 STARTUP SCRIPTS           ◄─--- NEW ADDITIONS
│   ├── start-all.ps1          ◄─── Start both servers
│   ├── run-backend.ps1        ◄─── Start backend only
│   └── run-frontend.ps1       ◄─── Start frontend only
│
└── 📄 DOCUMENTATION            ◄─--- NEW ADDITIONS
    ├── SIGNUP_DEBUG_GUIDE.md   ◄─── Complete reference
    ├── FIXES_APPLIED.md        ◄─── Summary of changes
    ├── QUICK_REFERENCE.md      ◄─── One-page quickstart
    ├── FINAL_SUMMARY.md        ◄─── This report
    └── ARCHITECTURE.md         ◄─── (This file)
```

---

## Communication Ports & URLs

```
FRONTEND (React/Next.js)
├─► Runs on: http://localhost:3000
├─► Dev server: npm run dev
├─► Calls API: fetch('http://localhost:5000/api/auth/...')
└─► Stores data: localStorage

BACKEND (Express)
├─► Runs on: http://localhost:5000
├─► Dev server: npm run dev
├─► CORS: Allows http://localhost:3000
├─► Database: http://localhost:27017 (MongoDB)
└─► Routes:
    ├─► POST /api/auth/register ◄─── NEW
    ├─► POST /api/auth/login
    ├─► POST /api/auth/check-username
    ├─► GET /api/health
    └─► More routes...

DATABASE (MongoDB)
├─► Runs on: http://localhost:27017 (default)
├─► Start: mongod
├─► Collections: users, annotations, images, etc.
└─► Connection: backend/server.js connects automatically
```

---

## Key Improvements Summary

```
BEFORE                              AFTER
═════════════════════════════════════════════════════════════

No error detection              ──►  Detects backend down
Generic "Failed to fetch"       ──►  "Server not running..."
Single endpoint                 ──►  Separate /register & /login
No logging                      ──►  Console logs with emojis
Silent failures                 ──►  Shows specific errors
Confusing error messages        ──►  User-friendly messages
No validation separation        ──►  Frontend + backend validation
Auto-create users on login      ──►  Proper signup/login flow
No duplicate checking           ──►  Checks username & email
```

---

## Success Indicators

✅ Browser shows http://localhost:3000  
✅ Backend logs show "Server running on port 5000"  
✅ Can visit http://localhost:5000/api/health (returns JSON)  
✅ Signup form submits without "Failed to fetch"  
✅ Network tab shows 201 status on successful signup  
✅ Console shows blue/green emoji logs  
✅ Shows "Username already exists" for duplicates  
✅ Shows "Email already registered" for duplicate emails  
✅ User redirects to /annotate page after signup  
✅ Stopping backend shows "Server not running" error  

---

## Troubleshooting by Port

```
Port 3000 (Frontend)
├─► Check: http://localhost:3000 loads?
├─► Fix: npm run dev (in root folder)
└─► Issue: "Cannot connect" → Frontend not running

Port 5000 (Backend)
├─► Check: curl http://localhost:5000/api/health returns JSON?
├─► Fix: npm run dev (in backend folder)
└─► Issue: "Failed to fetch" → Backend not running

Port 27017 (MongoDB)
├─► Check: mongod is running in a terminal?
├─► Fix: Run mongod in a separate terminal
└─► Issue: MongoDB connection error → Database not running
```

---

**Architecture and flow diagram complete!**  
*For more details, see SIGNUP_DEBUG_GUIDE.md*

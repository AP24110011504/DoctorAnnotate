# Frontend-Backend Integration Guide

## Overview

This guide shows how to connect the frontend Next.js app to the Node.js Express backend. The frontend stores user tokens in localStorage and makes API calls to the backend for authentication, image assignment, and annotation storage.

## Architecture

```
┌─────────────────────────────────┐
│   Frontend (Next.js + React)    │
│   - Login page                  │
│   - Annotation page             │
│   - Dataset view                │
└────────┬────────────────────────┘
         │ HTTP/JSON
         │ (fetch API)
┌────────▼────────────────────────┐
│   Backend (Express + Node.js)   │
│   - Auth routes                 │
│   - Image routes                │
│   - Annotation routes           │
│   - Dataset routes              │
└────────┬────────────────────────┘
         │ MongoDB driver
         │
┌────────▼────────────────────────┐
│  Database (MongoDB)             │
│  - Users collection             │
│  - Annotations collection       │
└─────────────────────────────────┘
```

## Setup Steps

### Step 1: Configure Frontend API URL

Create `.env.local` in root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Or in production:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Configure Backend

Copy and edit `.env`:
```bash
cp .env.example .env
```

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/medical-annotation
JWT_SECRET=your-secret-key-here
FRONTEND_URL=http://localhost:3000
```

### Step 4: Start MongoDB

**Local MongoDB:**
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo service mongod start
```

**Or use MongoDB Atlas (cloud)** - Update `MONGODB_URI` in `.env`

### Step 5: Start Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Output: Server running on port 5000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# Output: ▲ Next.js 14.x
#         - Local:        http://localhost:3000
```

### Step 6: Test Connection

Visit `http://localhost:3000` and try login. Check browser console (F12) for API calls.

---

## Code Integration

### 1. Login Flow

**Before (localStorage only):**
```typescript
// Old way - stored locally only
const user = { username, email, password };
localStorage.setItem('currentUser', JSON.stringify(user));
```

**After (with backend):**
```typescript
// New way - uses backend API
import { auth } from '@/lib/api';

try {
  const response = await auth.login(username, email, password);
  // Token stored automatically
  // User can now make API calls
} catch (error) {
  setMessage({ type: 'error', text: error.message });
}
```

### 2. Getting Images

**Before (from local dataset array):**
```typescript
// Old way
const firstImage = getImageByIndex(0);
```

**After (from backend):**
```typescript
// New way - backend assigns next unannotated image
import { images } from '@/lib/api';

const response = await images.getNextImage();
const { path, index } = response.image;
const { total, completed } = response.progress;
```

### 3. Saving Annotations

**Before (localStorage only):**
```typescript
// Old way
addAnnotation({
  doctor: user.username,
  image_path: currentImagePath,
  // ... other fields
});
```

**After (backend persistence):**
```typescript
// New way - saves to MongoDB
import { annotations } from '@/lib/api';

await annotations.save({
  image_path: currentImagePath,
  image_index: currentImageIndex,
  disease: diagnosis.disease,
  // ... other fields
});
```

### 4. Getting Annotations

**Before (from localStorage):**
```typescript
// Old way
const annotations = getAnnotations();
```

**After (from backend):**
```typescript
// New way - fetches from MongoDB
import { annotations } from '@/lib/api';

const allAnnotations = await annotations.getAll();
```

### 5. Exporting Data

**Before (export from localStorage):**
```typescript
// Old way - exports only local data
exportAnnotationsAsJSON(annotations);
```

**After (export from backend - all doctors data):**
```typescript
// New way - exports all data to CSV/JSON
import { dataset } from '@/lib/api';

// Export as JSON
const json = await dataset.exportJSON();

// Or as CSV
const csv = await dataset.exportCSV();
```

---

## Required Frontend Changes

### File: `app/page.tsx` (Login Page)

**Update login handler:**
```typescript
import { auth } from '@/lib/api';

const handleLogin = async (username, email, password) => {
  try {
    await auth.login(username, email, password);
    router.push('/annotate');
  } catch (error) {
    setMessage({ 
      type: 'error', 
      text: error.message 
    });
  }
};
```

### File: `app/annotate/page.tsx` (Main App)

**Key changes needed:**

1. **Load first image from backend:**
```typescript
useEffect(() => {
  const loggedInUser = getLoggedInUser();
  if (!loggedInUser) {
    router.push("/");
    return;
  }
  setUser(loggedInUser);

  // NEW: Get first image from backend
  const loadFirstImage = async () => {
    try {
      const response = await images.getNextImage();
      if (response.image) {
        setCurrentImagePath(response.image.path);
        setCurrentImageIndex(response.image.index);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  loadFirstImage();
  setLoading(false);
}, [router]);
```

2. **Save annotation to backend:**
```typescript
const handleSubmit = async () => {
  try {
    // NEW: Save to backend instead of localStorage
    await annotations.save({
      image_path: currentImagePath,
      image_index: currentImageIndex,
      disease: diagnosis.disease,
      case_type: diagnosis.caseType,
      severity: diagnosis.severity,
      description: diagnosis.description,
      confidence: diagnosis.confidence,
      modality: metadata.modality,
      body_part: metadata.bodyPart,
      age_group: metadata.ageGroup,
      review_required: metadata.review,
      box: compiledBox,
    });

    setMessage({ 
      type: 'success', 
      text: 'Annotation saved!' 
    });

    // Load next image after delay
    setTimeout(() => loadNextImage(), 1500);
  } catch (error) {
    setMessage({ 
      type: 'error', 
      text: error.message 
    });
  }
};
```

3. **Load annotations for display:**
```typescript
// In useEffect or on demand
const loadAnnotations = async () => {
  try {
    const allAnnotations = await annotations.getAll();
    setAnnotations(allAnnotations);
  } catch (error) {
    console.error('Failed to load annotations:', error);
  }
};
```

### File: `lib/storage.ts` (Storage Layer)

Keep this file for backward compatibility, but calls now go to backend via `lib/api.ts`

---

## API Response Handling

### Structure of API Responses

**Success (2xx):**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error (4xx/5xx):**
```json
{
  "error": "Error Type",
  "message": "Detailed error message"
}
```

### Error Handling Pattern

```typescript
try {
  const response = await annotations.save(data);
  // Handle success
} catch (error) {
  // Error text from backend or network error
  setMessage({ 
    type: 'error', 
    text: error.message 
  });
}
```

---

## Hybrid Mode (Gradual Migration)

If you want to gradually migrate from localStorage to backend:

```typescript
// lib/storage.ts - Add hybrid support

export const getAnnotations = async (): Annotation[] => {
  try {
    // Try backend first
    const backendAnnotations = await annotations.getAll();
    return backendAnnotations;
  } catch {
    // Fall back to localStorage
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("annotations");
    return stored ? JSON.parse(stored) : [];
  }
};
```

---

## Debugging

### Check API Connection

In browser console (F12):
```javascript
// Test if backend is running
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(d => console.log(d));
```

### View Network Requests

1. Open DevTools (F12)
2. Go to Network tab
3. Try login
4. See all API calls and responses

### Check Token

In browser console:
```javascript
console.log(localStorage.getItem('token'));
```

### MongoDB Verify

```bash
# Connect to MongoDB
mongosh

# List databases
show databases

# Use medical database
use medical-annotation

# View collections
show collections

# View users
db.users.find()

# View annotations
db.annotations.find()
```

---

## Environment Variables

### Frontend (.env.local)

```env
# Backend URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# Or production
# NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/medical-annotation

# Security
JWT_SECRET=your-super-secret-key-change-this

# CORS
FRONTEND_URL=http://localhost:3000

# Debug
DEBUG=true
```

---

## Common Issues & Solutions

### Issue: CORS Error

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solutions:**
1. Check backend is running on port 5000
2. Verify `FRONTEND_URL` in backend `.env`
3. Ensure API_URL is correct in frontend `.env.local`

```javascript
// Test CORS
fetch('http://localhost:5000/api/health')
```

### Issue: Token Expired

**Error:** `Invalid or expired token`

**Solution:** Login again to get fresh token

```javascript
// Force login
localStorage.removeItem('token');
router.push('/');
```

### Issue: MongoDB Connection Failed

**Error:** `MongoDB connection failed`

**Solutions:**
1. Check MongoDB service is running
2. Verify MongoDB URI in `.env`
3. Test connection: `mongosh mongodb://localhost:27017`

### Issue: 401 Unauthorized

**Error:** API returns 401

**Problems:**
- Token missing from header
- Token invalid/expired
- Authorization header format wrong

```typescript
// Correct format
headers: {
  'Authorization': `Bearer ${token}`  // With space after "Bearer"
}
```

### Issue: Annotation not saving

**Error:** `Failed to save annotation`

**Debug steps:**
1. Check form validation (disease name, box)
2. Verify token is valid
3. Check browser console for full error
4. Check backend logs
5. Verify MongoDB is running

---

## Testing Workflow

### 1. Manual Testing

1. Start backend: `npm run dev` (in backend folder)
2. Start frontend: `npm run dev` (in root)
3. Visit `http://localhost:3000`
4. Login with: `username: test`, `email: test@gmail.com`, `password: test123`
5. Verify annotation workflow works
6. Check MongoDB: `mongosh mongodb://localhost:27017`
7. View data: `use medical-annotation; db.annotations.find()`

### 2. Postman Testing

1. Import backend `.env` as Postman environment
2. Create collection with requests
3. Add `{{BACKEND_URL}}` variable
4. After login, add `{{token}}` to headers
5. Test each endpoint

### 3. Browser DevTools Testing

1. Open DevTools (F12)
2. Go to Network tab
3. Perform actions
4. Click on each request
5. View Request and Response
6. Check status codes and JSON

---

## Performance Optimization

### Reduce API Calls

```typescript
// Bad: Multiple calls to get same data
const ann1 = await annotations.getAll();
const ann2 = await annotations.getAll();

// Good: Cache result
const [annotations, setAnnotations] = useState([]);
useEffect(() => {
  annotations.getAll().then(setAnnotations);
}, []);
```

### Use Loading States

```typescript
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async () => {
  setIsLoading(true);
  try {
    await annotations.save(data);
  } finally {
    setIsLoading(false);
  }
};
```

### Add Timeouts

```typescript
const fetchWithTimeout = (url, options = {}, timeout = 5000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    ),
  ]);
};
```

---

## Next Steps

1. ✅ Setup backend server
2. ✅ Configure MongoDB
3. ✅ Start both servers
4. ✅ Test API endpoints
5. ✅ Update frontend to use backend
6. ✅ Test full workflow
7. ✅ Deploy to production

---

## Reference

- [Fetch API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Express.js API](https://expressjs.com/api.html)
- [MongoDB CRUD](https://docs.mongodb.com/manual/crud/)
- [JWT.io](https://jwt.io)

---

**Version:** 1.0  
**Last Updated:** 2024  
**Status:** Complete ✅

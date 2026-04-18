# Medical Image Annotation Platform - Backend API

## Overview

Complete Node.js + Express + MongoDB backend for the Medical Image Annotation Platform. This backend handles user authentication, image assignment, annotation storage, and dataset management.

## Architecture

```
backend/
├── server.js              # Express server & middleware setup
├── package.json           # Dependencies
├── .env.example          # Environment configuration template
│
├── models/               # MongoDB schemas
│   ├── User.js          # Doctor user schema
│   └── Annotation.js    # Annotation data schema
│
├── routes/              # API routes
│   ├── auth.js          # Login/verification
│   ├── images.js        # Image assignment
│   ├── annotations.js   # Annotation CRUD
│   └── dataset.js       # Dataset export & stats
│
├── middleware/          # Express middleware
│   └── auth.js         # JWT authentication
│
└── dataset/            # X-ray images storage
    └── (add images here)
```

## Technology Stack

- **Framework:** Express.js 4.18
- **Database:** MongoDB 7.5
- **Authentication:** JWT + Bcrypt
- **CORS:** Enabled for frontend communication
- **Environment:** Dotenv for configuration

## API Endpoints

### Authentication Routes

#### POST `/api/auth/login`
**User login / account creation**

**Request:**
```json
{
  "username": "dr_smith",
  "email": "dr.smith@gmail.com",
  "password": "securepassword"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": "507f1f77bcf86cd799439011",
    "username": "dr_smith",
    "email": "dr.smith@gmail.com"
  }
}
```

**Requirements:**
- Email must end with `@gmail.com`
- Password minimum 6 characters
- Username will be created if not exists
- Creates account or returns existing credentials

#### POST `/api/auth/verify`
**Verify JWT token validity**

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Token is valid",
  "user": {
    "userId": "507f1f77bcf86cd799439011",
    "username": "dr_smith",
    "email": "dr.smith@gmail.com",
    "annotationsCount": 3
  }
}
```

#### POST `/api/auth/logout`
**User logout (invalidate token on frontend)**

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### Image Routes

#### GET `/api/image`
**Get next unannotated image for current doctor**

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "image": {
    "path": "/dataset/xray_001.png",
    "index": 0
  },
  "progress": {
    "total": 10,
    "completed": 0
  }
}
```

**When all images annotated:**
```json
{
  "success": true,
  "message": "All images have been annotated",
  "image": null,
  "progress": {
    "total": 10,
    "completed": 10
  }
}
```

#### GET `/api/image/dataset`
**Get full dataset information**

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "dataset": {
    "total": 10,
    "images": [
      { "path": "/dataset/xray_001.png", "index": 0 },
      { "path": "/dataset/xray_002.png", "index": 1 }
    ]
  }
}
```

---

### Annotation Routes

#### POST `/api/annotation`
**Save new annotation**

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "image_path": "/dataset/xray_001.png",
  "image_index": 0,
  "disease": "Pneumonia",
  "case_type": "Abnormal",
  "severity": "Moderate",
  "description": "Infiltrate in left lower lobe",
  "confidence": 85,
  "modality": "X-ray",
  "body_part": "Chest",
  "age_group": "Adult (20-65)",
  "review_required": false,
  "box": {
    "x1": 100,
    "y1": 50,
    "x2": 300,
    "y2": 200
  }
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Annotation saved successfully",
  "annotation": {
    "_id": "507f1f77bcf86cd799439011",
    "image_path": "/dataset/xray_001.png",
    "disease": "Pneumonia",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Cases:**
- 400: Missing required fields
- 409: Doctor already annotated this image
- 500: Database error

#### GET `/api/annotation`
**Get all annotations for current doctor**

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "count": 3,
  "annotations": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "doctor": "dr_smith",
      "image_path": "/dataset/xray_001.png",
      "disease": "Pneumonia",
      "case_type": "Abnormal",
      "severity": "Moderate",
      "confidence": 85,
      "box": { "x1": 100, "y1": 50, "x2": 300, "y2": 200 },
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### GET `/api/annotation/:id`
**Get specific annotation by ID**

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "annotation": { ... }
}
```

**Error Cases:**
- 404: Annotation not found
- 403: Not authorized to view

#### PUT `/api/annotation/:id`
**Update annotation**

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:** (any updatable fields)
```json
{
  "disease": "Tuberculosis",
  "severity": "Severe",
  "confidence": 92
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Annotation updated successfully",
  "annotation": { ... }
}
```

#### DELETE `/api/annotation/:id`
**Delete annotation**

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Annotation deleted successfully"
}
```

---

### Dataset Routes

#### GET `/api/dataset`
**Get all annotations with statistics**

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "dataset": {
    "annotations": [ ... ],
    "users": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "username": "dr_smith",
        "email": "dr.smith@gmail.com",
        "annotationsCount": 3,
        "createdAt": "2024-01-10T08:00:00.000Z",
        "lastLogin": "2024-01-15T10:30:00.000Z"
      }
    ],
    "stats": {
      "totalAnnotations": 15,
      "totalDoctors": 3,
      "totalImages": 10,
      "diseaseDistribution": {
        "Pneumonia": 5,
        "Tuberculosis": 3,
        "Normal": 7
      },
      "doctorStats": {
        "dr_smith": {
          "count": 3,
          "diseases": ["Pneumonia", "Normal"]
        }
      }
    }
  }
}
```

#### GET `/api/dataset/export/json`
**Export all annotations as JSON file**

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response:** Downloads JSON file with structure:
```json
{
  "metadata": {
    "exportedAt": "2024-01-15T10:30:00.000Z",
    "totalAnnotations": 15,
    "exportedBy": "dr_smith"
  },
  "annotations": [ ... ]
}
```

#### GET `/api/dataset/export/csv`
**Export all annotations as CSV file**

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response:** Downloads CSV file with columns:
```
Doctor,Image Index,Image Path,Disease,Case Type,Severity,Confidence,Modality,Body Part,Age Group,Box X1,Box Y1,Box X2,Box Y2,Review Required,Timestamp
```

#### GET `/api/dataset/stats`
**Get detailed statistics**

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "stats": {
    "totalAnnotations": 15,
    "casesNormal": 7,
    "casesAbnormal": 8,
    "severityDistribution": {
      "Mild": 3,
      "Moderate": 7,
      "Severe": 5
    },
    "diseaseDistribution": {
      "Pneumonia": 5,
      "Tuberculosis": 3,
      "Normal": 7
    },
    "averageConfidence": 82,
    "reviewRequired": 2
  }
}
```

---

### Health Check

#### GET `/api/health`
**Check if backend is running**

**Response (Success - 200):**
```json
{
  "status": "ok",
  "message": "Medical Annotation Backend is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Installation & Setup

### Prerequisites
- Node.js 14+ 
- MongoDB (local or Atlas)
- npm or yarn

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Environment

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` with your settings:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/medical-annotation
JWT_SECRET=your-secret-key-here
```

### Step 3: Setup MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB service
# On Windows: net start MongoDB
# On Mac: brew services start mongodb-community
# On Linux: sudo service mongod start
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Create database user
4. Get connection string
5. Update `MONGODB_URI` in `.env`

### Step 4: Start Backend

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Expected output:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
📍 http://localhost:5000
🏥 Medical Annotation Backend v1.0
```

### Step 5: Verify Backend

Test health endpoint:
```bash
curl http://localhost:5000/api/health
```

---

## MongoDB Collections

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique, @gmail.com),
  password: String (hashed),
  createdAt: Date,
  lastLogin: Date,
  annotationsCount: Number,
  __v: Number
}
```

**Indexes:**
- username (unique)
- email (unique)

### Annotations Collection
```javascript
{
  _id: ObjectId,
  doctor: String,
  image_path: String,
  image_index: Number,
  disease: String,
  case_type: String (Normal|Abnormal),
  severity: String (Mild|Moderate|Severe),
  description: String,
  confidence: Number (0-100),
  modality: String,
  body_part: String,
  age_group: String,
  review_required: Boolean,
  box: {
    x1: Number,
    y1: Number,
    x2: Number,
    y2: Number
  },
  timestamp: Date,
  createdAt: Date,
  updatedAt: Date,
  __v: Number
}
```

**Indexes:**
- doctor, image_path (composite)
- timestamp
- doctor

---

## Frontend Integration

### Getting Started

Frontend now connects to backend instead of localStorage.

#### 1. Set Backend URL
In frontend `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

#### 2. Update Login Handler
```typescript
// Old: localStorage.setItem('currentUser', user)
// New: POST /api/auth/login with token response

const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, email, password })
});

const data = await response.json();
localStorage.setItem('token', data.token);
```

#### 3. Add Token to Requests
```typescript
const token = localStorage.getItem('token');
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
};
```

#### 4. Get Next Image
```typescript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/image`, {
  headers
});
const { image, progress } = await response.json();
```

#### 5. Save Annotation
```typescript
await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/annotation`, {
  method: 'POST',
  headers,
  body: JSON.stringify(annotationData)
});
```

---

## Security Considerations

### Password Security
- Passwords hashed with bcrypt (salt rounds: 10)
- Never stored in plain text
- Never returned in API responses

### JWT Authentication
- Tokens expire in 24 hours
- Validated on every protected endpoint
- Secret key should be strong in production

### Input Validation
- Email must be @gmail.com
- Password minimum 6 characters
- Bounding box coordinates validated
- Disease name required

### Authorization
- Doctors can only access their own annotations
- Doctors can only modify/delete their own annotations
- Admin features available in future versions

### CORS
- Frontend origin must match `FRONTEND_URL` in production
- Currently allows all origins in development

---

## Error Handling

### Common Error Responses

**400 Bad Request**
```json
{
  "error": "Validation Error",
  "message": "Missing required fields"
}
```

**401 Unauthorized**
```json
{
  "error": "Access token required",
  "message": "Please provide a valid token"
}
```

**403 Forbidden**
```json
{
  "error": "Forbidden",
  "message": "You do not have permission"
}
```

**404 Not Found**
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

**500 Internal Server Error**
```json
{
  "error": "Operation Failed",
  "message": "Error details"
}
```

---

## Development Tips

### Enable Debug Logging
Set in `.env`:
```
DEBUG=true
```

### MongoDB Compass
Visual MongoDB client for debugging:
```bash
# Connect to local MongoDB
mongodb://localhost:27017
```

### Testing API Endpoints
Use Postman or Thunder Client:
1. Create new collection
2. Add environment variable: `BACKEND_URL=http://localhost:5000`
3. Create requests for each endpoint
4. After login, add `Authorization: Bearer {{token}}` header

### Common Database Issues

**Connection refused:**
```
Solution: Start MongoDB service or update MONGODB_URI
```

**Duplicate key error:**
```
Solution: Email/username already exists
```

**Token expired:**
```
Solution: Login again to get new token
```

---

## Production Deployment

### Prepare for Production

1. **Update environment variables:**
   ```
   NODE_ENV=production
   PORT=80 or 443
   JWT_SECRET=strong-random-key
   MONGODB_URI=atlas-connection-string
   FRONTEND_URL=your-domain.com
   ```

2. **Enable HTTPS:**
   - Use SSL certificate
   - Configure reverse proxy (Nginx)

3. **Security Headers:**
   - Add CORS properly
   - Validate all inputs
   - Use helmet middleware

4. **Database Backup:**
   - MongoDB Atlas automatic backups
   - Regular export of annotations

### Deployment Platforms

**Heroku:**
```bash
heroku create medical-annotation
git push heroku main
heroku config:set JWT_SECRET=your-key
```

**DigitalOcean:**
1. Create droplet
2. Install Node.js
3. Clone repository
4. Install PM2 for process management
5. Configure Nginx reverse proxy

**AWS:**
1. EC2 instance
2. Elastic Beanstalk for Node.js
3. RDS for MongoDB or Atlas

---

## Troubleshooting

### Backend won't start
```bash
# Check port is available
lsof -i :5000

# Check MongoDB connection
mongosh mongodb://localhost:27017

# Check .env file exists
ls -la backend/.env
```

### Login fails
- Ensure email ends with @gmail.com
- Check MongoDB is running
- Verify MONGODB_URI in .env

### Annotations not saving
- Check token is valid
- Verify MongoDB connection
- Check request body format

### CORS errors
- Verify FRONTED_URL in .env
- Check Authorization header format
- Ensure token is not expired

---

## API Testing

### Using cURL

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"dr_smith","email":"dr.smith@gmail.com","password":"pass123"}'
```

**Get Image:**
```bash
curl -X GET http://localhost:5000/api/image \
  -H "Authorization: Bearer <token>"
```

**Save Annotation:**
```bash
curl -X POST http://localhost:5000/api/annotation \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"image_path":"/dataset/xray_001.png",...}'
```

### Using JavaScript Fetch

See Frontend Integration section above.

---

## Performance Optimization

### Database Indexing
- Indexed doctor + image_path for quick lookups
- Indexed timestamp for sorting
- Queries optimized for common operations

### Caching
- Consider Redis for frequently accessed data
- Cache dataset info for performance

### Pagination
Future enhancement: Add pagination to dataset queries
```javascript
// Example
GET /api/annotation?skip=0&limit=10
```

---

## Future Enhancements

- [ ] Admin dashboard for viewing all annotations
- [ ] Pagination for large datasets
- [ ] Redis caching layer
- [ ] WebSocket for real-time updates
- [ ] Advanced analytics
- [ ] Role-based access control (RBAC)
- [ ] Audit logging
- [ ] Rate limiting
- [ ] Image upload to backend
- [ ] Automatic backup scheduling

---

## Support & Documentation

- [Express.js Docs](https://expressjs.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [JWT.io](https://jwt.io)
- [Bcrypt Package](https://www.npmjs.com/package/bcrypt)

---

**Backend Version:** 1.0.0  
**Last Updated:** 2024  
**Status:** Production Ready ✅

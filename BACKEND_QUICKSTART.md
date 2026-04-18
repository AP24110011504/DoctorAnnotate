# Backend Quick Start (5 Minutes)

## What You'll Have

✅ Working Express.js server  
✅ MongoDB connected  
✅ 4 API routes ready  
✅ User authentication working  
✅ Annotations saving to database  

---

## Prerequisites

- Node.js 14+ installed
- MongoDB (local or Atlas account)
- 5 minutes of time

---

## Step 1: Install Backend

```bash
cd backend
npm install
```

**Expected output:**
```
added XX packages
audited YY packages
found 0 vulnerabilities
```

---

## Step 2: Setup `.env` File

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/medical-annotation
JWT_SECRET=change-this-to-random-key-in-production
NODE_ENV=development
```

**For MongoDB Atlas (cloud):**

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Replace MONGODB_URI with: `mongodb+srv://user:pass@cluster.mongodb.net/medical-annotation?retryWrites=true&w=majority`

---

## Step 3: Start MongoDB

**Windows:**
```bash
net start MongoDB
```

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo service mongod start
```

**Using MongoDB Atlas?** Skip this - cloud handles it.

---

## Step 4: Start Backend Server

```bash
npm run dev
```

**Expected output:**
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
📍 http://localhost:5000
🏥 Medical Annotation Backend v1.0
```

---

## Step 5: Test Backend

Open another terminal and test health endpoint:

```bash
curl http://localhost:5000/api/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "Medical Annotation Backend is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Test Login Flow

In another terminal or using Postman:

```bash
# 1. Login (creates account)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "dr_smith",
    "email": "dr.smith@gmail.com",
    "password": "test123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "userId": "507f1f77bcf86cd799439011",
    "username": "dr_smith",
    "email": "dr.smith@gmail.com"
  }
}
```

**Copy the token!**

```bash
# 2. Get next image
curl -X GET http://localhost:5000/api/image \
  -H "Authorization: Bearer eyJhbGc..."
```

**Response:**
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

```bash
# 3. Save annotation
curl -X POST http://localhost:5000/api/annotation \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "image_path": "/dataset/xray_001.png",
    "image_index": 0,
    "disease": "Pneumonia",
    "case_type": "Abnormal",
    "severity": "Moderate",
    "description": "Left lower lobe infiltrate",
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
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Annotation saved successfully",
  "annotation": {
    "_id": "507f1f77bcf86cd799439012",
    "image_path": "/dataset/xray_001.png",
    "disease": "Pneumonia",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## Verify Data in MongoDB

```bash
# Open MongoDB shell
mongosh

# List databases
show databases

# Use medical database
use medical-annotation

# View users
db.users.find()

# View annotations
db.annotations.find()

# Count annotations
db.annotations.countDocuments()
```

---

## Connect Frontend

1. **Start frontend in another terminal:**
   ```bash
   npm run dev
   # Frontend runs on http://localhost:3000
   ```

2. **Create `.env.local` in root:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

3. **Backend & Frontend running:**
   - Backend: http://localhost:5000
   - Frontend: http://localhost:3000
   - Both connected! ✅

---

## Common Issues

### MongoDB won't start
```bash
# Check if service exists
sc query MongoDB

# Check if port available
lsof -i :27017
```

### Port 5000 in use
```bash
# Windows
netstat -ano | findstr :5000

# macOS/Linux
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Connection refused error
- Check `.env` MONGODB_URI
- Check MongoDB is running
- Test: `mongosh mongodb://localhost:27017`

### CORS errors
- Check frontend `.env.local` has correct API URL
- Make sure `NEXT_PUBLIC_API_URL=http://localhost:5000`

---

## API Documentation

See [backend/README.md](backend/README.md) for complete API docs.

### Quick Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /api/auth/login | Login/signup |
| GET | /api/image | Get next image |
| POST | /api/annotation | Save annotation |
| GET | /api/dataset | Get all data |
| GET | /api/health | Health check |

---

## Next Steps

1. ✅ Backend running on port 5000
2. ✅ MongoDB connected
3. ✅ Health check successful
4. ✅ Test login flow
5. ✅ Frontend connected
6. Next: Deploy to production

---

## Environment Check

Quick verification script:

```bash
# Check Node.js
node --version

# Check npm
npm --version

# Check MongoDB
mongosh --version

# Check backend installation
cd backend && npm list | head -20
```

---

## Production Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to random string
- [ ] Set NODE_ENV=production
- [ ] Use MongoDB Atlas for database
- [ ] Enable HTTPS
- [ ] Setup CORS for your domain
- [ ] Add .env to .gitignore
- [ ] Configure firewall
- [ ] Setup error monitoring
- [ ] Enable database backups
- [ ] Test all API endpoints

---

## Getting Help

1. Check [backend/README.md](backend/README.md) for full API docs
2. Check [BACKEND_INTEGRATION.md](BACKEND_INTEGRATION.md) for frontend integration
3. Review error messages in terminal
4. Check browser console (F12) for frontend errors
5. Check MongoDB: `mongosh` and query collections

---

## Success! 🎉

Your backend is now:
- ✅ Running on port 5000
- ✅ Connected to MongoDB
- ✅ Ready for frontend integration
- ✅ Ready for production deployment

**Time to full integration: ~15 minutes**

Next: Connect frontend and test full annotation workflow!

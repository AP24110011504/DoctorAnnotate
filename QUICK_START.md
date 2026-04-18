# Quick Start Guide

## Getting Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Run Development Server
```bash
npm run dev
```

### Step 3: Open in Browser
Go to `http://localhost:3000`

---

## Demo Account

**Use these credentials to test:**
- **Username:** doctor
- **Email:** doctor@gmail.com
- **Password:** password

---

## First Annotation

1. **Login** with demo credentials
2. **Upload** a medical image (any image file)
3. **Draw** a bounding box on the image by clicking and dragging
4. **Fill** the diagnosis form:
   - Disease name (required)
   - Case type (Normal/Abnormal)
   - Severity level
   - Optional notes
   - Confidence percentage
5. **Select** metadata:
   - Imaging modality (X-ray, CT, MRI, etc.)
   - Body part examined
   - Patient age group
   - Mark for review if needed
6. **Click** "Submit Annotation"
7. **View** your annotation in the dataset table below

---

## Features Overview

### Drawing Bounding Box
- Click and drag on the image to draw a rectangle
- Rectangle appears in blue while drawing
- Final rectangle shown in red with corners
- Click "Clear Annotation" to redraw

### Form Validation
- All required fields must be filled
- Email must end with @gmail.com during login
- Image must be uploaded before annotation
- Bounding box must be drawn

### Data Storage
- All data saved in browser's localStorage
- Data persists across sessions
- Click "Export Data" to download JSON file
- Data saved per browser/device

### Dataset View
- Table shows all annotations
- Click "View" to see full details
- Shows image name, disease, doctor, timestamp
- Sortable and scrollable

---

## Keyboard Shortcuts (Future)

- **Ctrl+S**: Save annotation
- **Ctrl+Z**: Undo
- **Ctrl+Y**: Redo
- **Delete**: Clear bounding box

---

## Troubleshooting

### Image Not Loading
- Check image format (PNG, JPG, GIF supported)
- Ensure file is not corrupted
- Try with a smaller file

### Bounding Box Not Appearing
- Make sure image is loaded first
- Click and drag on the image canvas
- Box must be at least 10x10 pixels

### Data Not Saving
- Check browser localStorage is enabled
- Check browser console for errors
- Verify all required fields are filled

### Login Issues
- Email must end with @gmail.com
- Password must be at least 6 characters
- Check caps lock is off

---

## File Management

### Supported Image Formats
- PNG
- JPG/JPEG
- GIF
- WebP

### Maximum File Size
- 10MB per image

### File Naming
- Automatic file names are used
- Original filename shown in dataset

---

## Exporting Data

### JSON Export
1. Go to annotation page
2. Click "Export Data" button
3. File downloads automatically
4. Filename: `annotations_[timestamp].json`

### Data Structure
```json
[
  {
    "image": "filename.jpg",
    "disease": "Pneumonia",
    "case_type": "Abnormal",
    "severity": "Moderate",
    "description": "Clinical notes",
    "confidence": 85,
    "modality": "X-ray",
    "body_part": "Chest",
    "age_group": "Adult (20-65)",
    "review_required": false,
    "box": [100, 150, 300, 400],
    "doctor": "doctor_username",
    "timestamp": 1234567890000
  }
]
```

---

## Common Tasks

### Create New Account
1. Click login page
2. Enter username, @gmail.com email, password (6+ chars)
3. Click "Sign In"
4. Account created automatically

### Switch User
1. Click "Logout" button
2. Login with different credentials
3. Each user has separate session

### Clear All Data
1. Open browser DevTools (F12)
2. Go to Application → LocalStorage
3. Delete entries with keys starting with "annotations" or "currentUser"
4. Refresh page

### View Annotation Details
1. In dataset table, click "View" on any row
2. Expands to show full details
3. Click "Hide" to collapse

---

## Performance Tips

- Keep images under 5MB for best performance
- Close unused tabs to free memory
- Clear browser cache if app slows down
- Use recent browser version

---

## Support Resources

- **Documentation:** See README.md
- **Code:** Check GitHub repository structure
- **Issues:** Check browser console (F12)
- **Data Location:** DevTools → Application → LocalStorage

---

## Test Checklist

- [ ] Can login with valid credentials
- [ ] Rejects invalid email formats
- [ ] Can upload image
- [ ] Can draw bounding box
- [ ] Can fill all form fields
- [ ] Submission shows success message
- [ ] Annotation appears in dataset
- [ ] Can export data as JSON
- [ ] Can logout and login again
- [ ] Prev annotations still visible after logout/login
- [ ] Responsive on mobile devices

---

**Happy Annotating!** 🎉

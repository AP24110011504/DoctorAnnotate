# Quick Start - Medical Image Annotation Platform

## Installation (3 Steps)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Prepare Dataset
Place X-ray images in:
```
public/dataset/
```

Then update `lib/dataset.ts`:
```typescript
export const XRAY_DATASET = [
  "/dataset/image1.png",
  "/dataset/image2.png",
  "/dataset/image3.png",
];
```

### Step 3: Run Development Server
```bash
npm run dev
```

## Access the App

Open browser: `http://localhost:3000`

---

## Demo Account

**Use these credentials to test:**
- **Username:** doctor
- **Email:** doctor@gmail.com  
- **Password:** password

---

## First Annotation (5 Minutes)

### 1. Login
- Enter credentials above
- Click "Sign In"

### 2. View First Image
- System loads first X-ray automatically
- Shows: "Image 1 of N"
- Progress bar displayed

### 3. Draw Bounding Box
- Click and drag on image
- Draw rectangle around area of interest
- Red border confirms box drawn

### 4. Fill Diagnosis Form
- **Disease name** (required)
- Case type: Normal or Abnormal
- Severity: Mild, Moderate, or Severe
- Optional: Description and notes

### 5. Select Metadata
- Modality: X-ray, CT, MRI, etc.
- Body part: Chest, Abdomen, Head, etc.
- Age group: Pediatric to Senior
- Optional: Mark for review

### 6. Submit
- Click "Submit Annotation"
- System saves automatically
- Next image loads automatically

### 7. Repeat
- Continue annotating images
- Progress updates in real-time
- No manual image selection needed

---

## User Interface Overview

### Left Side Panel
```
┌─────────────────────┐
│  Progress: 2/10     │
│  [████░░░░░░░░░░]   │
│  Image 2 of 10      │
├─────────────────────┤
│  Assigned X-ray     │
│  ┌───────────────┐  │
│  │   [image]     │  │
│  │   (canvas)    │  │
│  └───────────────┘  │
├─────────────────────┤
│ [✓ Box drawn]       │
│ [Clear Annotation]  │
└─────────────────────┘
```

### Right Side Panel
```
┌─────────────────────┐
│  Disease Form       │
│  [Disease: ___]     │
│  [Normal/Abnormal]  │
│  [Mild/Mod/Severe]  │
│  [Description...]   │
│  [Confidence: 50%]  │
├─────────────────────┤
│  Metadata Form      │
│  [Modality:]        │
│  [Body Part:]       │
│  [Age Group:]       │
│  [☐ Review]         │
├─────────────────────┤
│  [Submit]           │
└─────────────────────┘
```

---

## Key Features

### ✅ Sequential Image Loading
- No upload button
- System assigns images automatically
- One image at a time
- Sequential progression

### ✅ Progress Tracking
- Visual progress bar
- Image counter (e.g., "3 of 10")
- Real-time updates
- Completion percentage

### ✅ Auto-Progression
- Submit → Next image loads
- No manual selection
- Continuous workflow
- Form auto-clears

### ✅ Data Management
- All annotations saved locally
- Export as JSON
- Doctor attribution
- Timestamps included

---

## Common Tasks

### Create New User Account
1. Go to login page
2. Enter new username
3. Enter @gmail.com email
4. Enter password (6+ chars)
5. Click "Sign In"
6. Account created automatically

### Switch Users
1. Click "Logout" button
2. Login with different credentials
3. Each user has separate session

### Annotate Multiple Images
1. Login as doctor
2. Image 1 appears automatically
3. Annotate and submit
4. Image 2 loads automatically
5. Repeat until all done
6. "All images annotated!" message

### Export All Annotations
1. In annotation page
2. Click "Export Data" button
3. JSON file downloads
4. Contains all annotations

### View Annotation History
1. Scroll to "Dataset" section
2. Table shows all annotations
3. Click "View" to expand
4. See full details of each annotation

---

## Troubleshooting

### "No image assigned"
- Check `lib/dataset.ts` has image paths
- Verify images exist in `public/dataset/`
- Check file paths match exactly
- Use forward slashes: `/dataset/image.png`

### Image appears blank
- Image file may not exist
- Check file path is correct
- Try PNG instead of JPG
- Check file size < 10MB
- Clear form and reload

### Can't submit annotation
- Ensure bounding box is drawn (red border)
- Ensure disease name is entered
- Check browser console for errors
- Verify all required fields filled

### Email validation error
- Email must end with `@gmail.com`
- Cannot use other providers
- System rejects non-gmail emails

### Data not saving
- Check localStorage is enabled
- Try different browser
- Check browser console (F12)
- Verify form is completely filled

---

## Test Workflow

```bash
# 1. Install
npm install

# 2. Prepare sample images (create or add to public/dataset/)

# 3. Update dataset.ts with image paths

# 4. Start dev server
npm run dev

# 5. Login with demo account (doctor / doctor@gmail.com / password)

# 6. Annotate first image

# 7. Check dataset table at bottom

# 8. Export JSON to verify data
```

---

## File Organization

Your project should look like:

```
Medical-Annotation-Platform/
├── public/
│   └── dataset/
│       ├── xray1.png
│       ├── xray2.png
│       └── ...
├── lib/
│   ├── dataset.ts          ← Update this with image paths
│   ├── types.ts
│   ├── storage.ts
│   └── ...
├── components/
│   ├── BoundingBoxCanvas.tsx
│   ├── DiagnosisForm.tsx
│   ├── MetadataForm.tsx
│   └── DatasetView.tsx
├── app/
│   ├── page.tsx            ← Login page
│   └── annotate/
│       └── page.tsx        ← Annotation page
└── ...
```

---

## Data Structure

Each annotation saved looks like:

```json
{
  "image_path": "/dataset/xray1.png",
  "image_index": 0,
  "disease": "Pneumonia",
  "case_type": "Abnormal",
  "severity": "Moderate",
  "description": "Infiltrates in right lung",
  "confidence": 85,
  "modality": "X-ray",
  "body_part": "Chest",
  "age_group": "Adult (36-65)",
  "review_required": false,
  "box": [100, 150, 300, 400],
  "doctor": "doctor_username",
  "timestamp": 1711612345000
}
```

---

## Keyboard Tips

- **Tab**: Navigate between fields
- **Shift+Tab**: Navigate backwards
- **Enter**: Submit form (when focused on submit button)

---

## Mobile Access

- Responsive design works on mobile
- Touch to draw bounding box
- Pinch to zoom image
- Optimized form layout
- Full functionality on tablets

---

## Next Steps

1. ✅ Install dependencies (`npm install`)
2. ✅ Add X-ray images to `public/dataset/`
3. ✅ Update `lib/dataset.ts` with image paths
4. ✅ Run `npm run dev`
5. ✅ Login and start annotating
6. ✅ Export data when done

---

## Tips for Best Performance

- Use PNG images for best quality
- Keep images < 10MB for fast loading
- Draw boxes on significant areas
- Use consistent terminology across team
- Regular exports to backup data
- Clear browser cache if slow

---

## Production Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t annotation-platform .
docker run -p 3000:3000 annotation-platform
```

### Self-Hosted
```bash
npm run build
npm run start
# Deploy .next folder to Node.js server
```

---

## Support

- **Issues?** Check browser console (F12)
- **Documentation:** Read README_PLATFORM.md
- **Code examples:** Check lib/ folder
- **Detailed setup:** See SETUP.md

---

**Ready to annotate!** 🏥

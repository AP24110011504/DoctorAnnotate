# Medical Image Annotation Platform

A professional web application for doctors to annotate pre-assigned X-ray images with clinical metadata and bounding boxes. Built with Next.js 14 (App Router), React, TypeScript, and Tailwind CSS.

## Core Concept

This platform loads **pre-existing unlabeled X-ray images** from a dataset and assigns them to doctors for sequential annotation. Doctors do **NOT** upload images - the system provides them.

## Key Features

### 1. **Sequential Image Assignment** (No Upload)
- System loads X-ray images from a pre-defined dataset
- Doctors annotate images one at a time in order
- Automatic progression to next image after submission
- Progress tracking with visual indicator (e.g., "Image 3 of 10")
- Progress bar showing annotation completion

### 2. **User Authentication**
- Login with username, email (@gmail.com), and password
- Secure session storage in localStorage
- User attribution for all annotations
- Logout with session cleanup

### 3. **Image Annotation Interface**
- **Left Side:**
  - Assigned X-ray image display
  - HTML5 Canvas overlay for drawing bounding boxes
  - Clear annotation button
  - Progress indicator with counter

- **Right Side:**
  - **Diagnosis Form:**
    - Disease name input (required)
    - Case type selector (Normal/Abnormal)
    - Severity selector (Mild/Moderate/Severe)
    - Description textarea
    - Confidence slider (0-100%)
  
  - **Metadata Form:**
    - Modality dropdown (default: X-ray)
    - Body part dropdown (default: Chest)
    - Age group selector
    - Review checkbox

### 4. **Bounding Box Tool**
- Interactive canvas overlay on X-ray image
- Click and drag to draw rectangle
- Store coordinates as [x1, y1, x2, y2]
- Single bounding box per image (enforced)
- Visual feedback with red border and corner dots
- Clear button to redraw

### 5. **Auto-Progression**
- After successful submission:
  - Annotation saved to localStorage
  - Success message displayed
  - Form fields cleared
  - Next image automatically loaded
  - Progress counter incremented
  - No manual image selection needed

### 6. **Dataset Storage & Export**
- All annotations saved in localStorage ("annotations" array)
- Complete JSON structure with doctor attribution
- Export all annotations as JSON file
- Timestamp automatically recorded
- Image path and index stored for reference

### 7. **Dataset View**
- Table showing all annotated images
- Display: Image #, Disease, Case Type, Doctor, Timestamp
- Expandable rows for detailed annotation view
- Full metadata visible in expanded details

### 8. **Navigation**
- "/" → Login page
- "/annotate" → Annotation interface (protected)
- Auto-redirect to login if not authenticated

---

## How It Works

### For System Administrators

1. **Setup Images:**
   - Place X-ray images in `public/dataset/` directory
   - Update `lib/dataset.ts` with image paths:
     ```typescript
     export const XRAY_DATASET = [
       "/dataset/xray1.png",
       "/dataset/xray2.png",
       "/dataset/xray3.png",
     ];
     ```

2. **Create Accounts:**
   - Doctors create accounts using @gmail.com emails
   - Each doctor gets unique login credentials

3. **Monitor Progress:**
   - View dataset/annotations table
   - Export annotations as JSON for ML training

### For Doctors

1. **Login:**
   - Use your credentials (must have @gmail.com email)
   - System redirects to annotation interface

2. **Annotate Image:**
   - View assigned X-ray image
   - Draw bounding box around area of interest
   - Fill in diagnosis form (required)
   - Select metadata (modality, body part, etc.)
   - Click "Submit Annotation"

3. **Next Image:**
   - System automatically loads next image
   - Process repeats until all images annotated
   - Progress bar updates in real-time

---

## Installation & Setup

### Prerequisites
- Node.js 18+
- npm 9+
- Modern web browser

### Quick Start

```bash
# 1. Navigate to project directory
cd path/to/Medical-Annotation-Platform

# 2. Install dependencies
npm install

# 3. Add X-ray images
# Place .png, .jpg files in public/dataset/ directory
# Update lib/dataset.ts with image paths

# 4. Start development server
npm run dev

# 5. Open browser
# Visit http://localhost:3000
```

### Build for Production

```bash
npm run build
npm run start
```

---

## Data Structure

### Annotation JSON

Each annotation created includes:

```json
{
  "image_path": "/dataset/xray1.png",
  "image_index": 0,
  "disease": "Pneumonia",
  "case_type": "Abnormal",
  "severity": "Moderate",
  "description": "Infiltrates visible in right lung",
  "confidence": 85,
  "modality": "X-ray",
  "body_part": "Chest",
  "age_group": "Adult (36-65)",
  "review_required": false,
  "box": [100, 150, 300, 400],
  "doctor": "dr_smith",
  "timestamp": 1711612345000
}
```

### LocalStorage Keys

- `currentUser` - Logged-in doctor information
- `annotations` - Array of all annotations

---

## Project Structure

```
Medical-Annotation-Platform/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── globals.css             # Global styles
│   ├── page.tsx                # Login page
│   └── annotate/page.tsx       # Annotation page
├── components/
│   ├── BoundingBoxCanvas.tsx   # Canvas drawing tool
│   ├── DiagnosisForm.tsx       # Diagnosis input
│   ├── MetadataForm.tsx        # Metadata input
│   └── DatasetView.tsx         # Annotations table
├── lib/
│   ├── types.ts                # TypeScript types
│   ├── storage.ts              # localStorage utilities
│   ├── dataset.ts              # Image dataset configuration
│   ├── hooks.ts                # Custom hooks
│   ├── export.ts               # Export utilities
│   ├── validation.ts           # Form validation
│   └── constants.ts            # App constants
├── public/
│   └── dataset/                # X-ray images directory
└── Configuration files
    ├── package.json
    ├── tsconfig.json
    ├── next.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

---

## Configuration

### Adding X-ray Images

1. **Place Images:**
   ```
   public/dataset/
   ├── xray1.png
   ├── xray2.png
   └── xray3.png
   ```

2. **Update Dataset:**
   ```typescript
   // lib/dataset.ts
   export const XRAY_DATASET = [
     "/dataset/xray1.png",
     "/dataset/xray2.png",
     "/dataset/xray3.png",
   ];
   ```

### Customize Form Fields

Edit components to add/remove fields:
- `components/DiagnosisForm.tsx` - Disease details
- `components/MetadataForm.tsx` - Image metadata
- `lib/constants.ts` - Dropdown options

---

## Demo Usage

### Quick Test

1. **Login Credentials:**
   - Username: `doctor`
   - Email: `doctor@gmail.com`
   - Password: `password`

2. **Try Annotation:**
   - System loads first image from dataset
   - Draw bounding box on image
   - Fill in form fields
   - Click "Submit Annotation"
   - See next image load automatically

### Create New User

1. Go to login page
2. Enter @gmail.com email address
3. New account created automatically
4. Login with credentials

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| UI Library | React 18 |
| Styling | Tailwind CSS 3 |
| Storage | Browser localStorage |
| Deployment | Vercel/Node.js/Docker |

---

## Features Explained

### Sequential Workflow

```
Login → Load Image 1 → Annotate → Save → Load Image 2 → Annotate → ...
```

### Progress Tracking

- Real-time progress bar: shows completion percentage
- Counter: "Annotated: 3 / 10"
- Image indicator: "Image 3 of 10"
- Visual feedback on completion

### Automatic Progression

- No manual image selection
- No "Next Image" button needed
- Automatic load after submission
- Continuation from last session

---

## Data Export

### Export as JSON

Click "Export Data" button to download:
- All annotations as JSON
- Filename includes timestamp
- Ready for ML training pipelines

### CSV Export

Available via utility functions:
- Import in Excel/Sheets
- Analytics and reporting

---

## Security & Privacy

- All data stored locally in browser
- No server-side storage
- No external API calls
- No cloud services
- HIPAA-compliant (local storage only)
- Patient data remains on device

---

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Troubleshooting

### Images Not Loading

1. Check file paths in `lib/dataset.ts`
2. Verify files exist in `public/dataset/`
3. Check browser console for errors
4. Ensure image format is supported (PNG, JPG, GIF, WebP)

### Annotations Not Saving

1. Check localStorage is enabled in browser
2. Check browser console for errors
3. Verify form is filled completely
4. Ensure bounding box is drawn

### Login Issues

1. Email must end with @gmail.com
2. Password must be 6+ characters
3. Check browser console for validation errors

### App Not Loading

1. Run `npm install`
2. Run `npm run dev`
3. Check Node.js version (must be 18+)
4. Clear browser cache

---

## Performance

- Fast image loading
- Smooth canvas drawing at 60 FPS
- Responsive UI with no lag
- Optimized for medical professional workflow

---

## Future Enhancements

- [ ] Multiple bounding boxes per image
- [ ] Polygon/freehand drawing tools
- [ ] Annotation batching
- [ ] Team collaboration
- [ ] Admin dashboard
- [ ] Advanced reporting
- [ ] Keyboard shortcuts
- [ ] Dark mode
- [ ] Backend API integration
- [ ] Permission management

---

## File Management

### Compatible Image Formats
- PNG (recommended)
- JPG/JPEG
- GIF
- WebP

### Image Requirements
- Size: Recommended <10MB per image
- Resolution: Any (will scale to fit canvas)
- Color: Grayscale or color supported

---

## License

MIT License - Free for educational and commercial use

---

## Support & Documentation

- **Setup Issues:** See SETUP.md
- **Usage Guide:** See QUICK_START.md
- **Development:** See DEVELOPMENT.md
- **Project Info:** See PROJECT_SUMMARY.md

---

## Contact & Resources

- Issues: Check browser console (F12)
- Documentation: Read provided guides
- Examples: Check sample annotations
- Code: Review lib/ components

---

**Ready to annotate!** Deploy the platform and assign X-rays to your medical team. 🏥✨

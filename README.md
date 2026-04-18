# Medical Image Annotation Web App

A comprehensive web application for medical image annotation with local storage, built with Next.js 14 (App Router), React, TypeScript, and Tailwind CSS.

## Features

### 1. **Login Page**
- User authentication with username, email, and password
- Email validation (must end with @gmail.com)
- Secure password storage in localStorage
- Easy login flow with error validation

### 2. **Annotation Page**
- **Left Side:**
  - Image upload button with drag & drop support
  - Image preview
  - HTML Canvas overlay for drawing bounding boxes
  - Clear annotation button

- **Right Side:**
  - **Diagnosis Form:**
    - Disease name input
    - Case type selector (Normal/Abnormal)
    - Severity selector (Mild/Moderate/Severe)
    - Description textarea
    - Confidence slider (0-100%)
  
  - **Metadata Form:**
    - Modality dropdown (X-ray, CT, MRI, etc.)
    - Body part dropdown (Chest, Abdomen, etc.)
    - Age group dropdown
    - Review checkbox

### 3. **Bounding Box Tool**
- Draw rectangles on medical images
- Interactive canvas with mouse drag
- Store coordinates as [x1, y1, x2, y2]
- Support for one bounding box per image
- Visual feedback with red dashed border

### 4. **Submit & Storage**
- Comprehensive validation before submission
- JSON data storage in localStorage
- Automatic annotation numbering
- Success/error notifications

### 5. **Dataset View**
- Display all saved annotations in a table
- Show image name, disease, case type, doctor, timestamp
- Expandable rows for detailed information
- View complete annotation metadata

## Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Steps

1. **Clone or navigate to the project folder:**
   ```bash
   cd path/to/Medical-Annotation-App
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Navigate to `http://localhost:3000`

## Usage

### First Time Login
1. Use demo credentials:
   - Username: `doctor`
   - Email: `doctor@gmail.com`
   - Password: `password`

2. Or create your own account with a @gmail.com email

### Annotating Images
1. Upload a medical image (PNG, JPG, GIF)
2. Draw a bounding box on the affected area
3. Fill in the diagnosis form
4. Select appropriate metadata
5. Click "Submit Annotation"
6. View your annotation in the Dataset section

### Data Storage
- All data is stored in browser's localStorage
- Survives page refreshes
- Data persists until browser cache is cleared
- User session stored in "currentUser" key
- Annotations stored in "annotations" array

## Project Structure

```
Medical-Annotation-App/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── globals.css             # Global styles
│   ├── page.tsx                # Login page
│   └── annotate/
│       └── page.tsx            # Annotation page
├── components/
│   ├── BoundingBoxCanvas.tsx   # Canvas for drawing boxes
│   ├── DiagnosisForm.tsx       # Diagnosis input form
│   ├── MetadataForm.tsx        # Metadata input form
│   └── DatasetView.tsx         # Annotations display
├── lib/
│   ├── types.ts                # TypeScript interfaces
│   ├── storage.ts              # localStorage utilities
│   └── hooks.ts                # Custom React hooks
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── tailwind.config.js          # Tailwind CSS config
├── postcss.config.js           # PostCSS config
├── next.config.js              # Next.js config
└── .env.local                  # Environment variables
```

## Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **UI Framework:** React 18
- **Styling:** Tailwind CSS 3
- **Storage:** Browser localStorage
- **Build Tool:** Next.js (Webpack)

## Features Explained

### 1. Email Validation
- Only @gmail.com emails are accepted
- Error message shown if invalid
- Prevents incorrect email formats

### 2. Bounding Box Drawing
- Click and drag on canvas to draw
- Blue preview while drawing
- Red final box when complete
- Coordinates stored as [x1, y1, x2, y2]
- Only one box per annotation

### 3. Data Export
Complete annotation JSON structure:
```json
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
```

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Data Privacy

- All data stored locally in browser
- No server-side storage
- No external API calls
- No Firebase or cloud services
- Data only accessible on this device

## Development

### Build for production:
```bash
npm run build
npm run start
```

### Lint code:
```bash
npm run lint
```

## Future Enhancements

- Export annotations as CSV/JSON files
- Multiple bounding boxes per image
- Polygon/freehand drawing tools
- Batch image upload
- Undo/Redo functionality
- Dark mode support
- Multi-language support
- Backend API integration

## License

MIT License

## Support

For issues or questions, please check:
- Browser console for errors
- localStorage data in DevTools
- Network tab in DevTools (should be empty)

---

**Note:** This is a local-first application. All data stays in your browser until explicitly cleared.

# Platform Testing Checklist

## Pre-Deployment Testing

### ✅ Setup & Installation
- [ ] `npm install` completes without errors
- [ ] `npm run dev` starts dev server
- [ ] Browser opens to `http://localhost:3000`
- [ ] No console errors on startup

### ✅ Dataset Configuration
- [ ] X-ray images placed in `public/dataset/`
- [ ] `lib/dataset.ts` updated with correct paths
- [ ] Image file paths match exactly
- [ ] File paths use forward slashes: `/dataset/image.png`
- [ ] At least 3-5 test images configured

### ✅ Login Page
- [ ] Login page displays correctly
- [ ] All form fields visible and functional
- [ ] Email validation shows error for non-gmail addresses
- [ ] Password validation shows error if < 6 characters
- [ ] Demo account works: doctor@gmail.com / password
- [ ] New user account creation works
- [ ] Login redirects to /annotate page
- [ ] Error messages display properly

### ✅ Authentication
- [ ] Direct access to /annotate redirects to login
- [ ] Logout clears session
- [ ] User data persists after page refresh
- [ ] Only logged-in users can access annotation page

### ✅ Image Loading
- [ ] First image loads automatically on page load
- [ ] Image displays in the preview area
- [ ] Image counter shows "Image 1 of N"
- [ ] All configured images load when navigated
- [ ] Image loading error handled gracefully

### ✅ Bounding Box Tool
- [ ] Canvas initializes correctly
- [ ] Mouse cursor shows as crosshair
- [ ] Click and drag creates rectangle
- [ ] Rectangle shows with blue color while drawing
- [ ] Final box shows with red color after release
- [ ] Box coordinates stored as [x1, y1, x2, y2]
- [ ] Clear button removes the box
- [ ] Only one box allowed per image
- [ ] Box size validation works (min 10x10 pixels)

### ✅ Diagnosis Form
- [ ] Disease name field accepts input
- [ ] Disease name validation: field required
- [ ] Case type selector works (Normal/Abnormal)
- [ ] Severity selector works (Mild/Moderate/Severe)
- [ ] Description textarea accepts multi-line text
- [ ] Confidence slider works (0-100)
- [ ] Slider displays current value
- [ ] Form data persists while on same image

### ✅ Metadata Form
- [ ] Modality dropdown works (default: X-ray)
- [ ] All modality options available
- [ ] Body part dropdown works (default: Chest)
- [ ] All body part options available
- [ ] Age group dropdown works
- [ ] Review checkbox toggles properly
- [ ] Form data persists while on same image

### ✅ Submission
- [ ] Submit button disabled until bounding box drawn
- [ ] Submit button disabled if no image loaded
- [ ] Clicking submit with valid data saves annotation
- [ ] Success message displays after submission
- [ ] Annotation saved to localStorage
- [ ] JSON structure includes all required fields
- [ ] Doctor name attributed correctly
- [ ] Timestamp recorded correctly

### ✅ Sequential Progression
- [ ] After submit, next image loads automatically
- [ ] Form fields clear on next image
- [ ] Bounding box clears on next image
- [ ] Progress counter increments: "2/10"
- [ ] Progress bar updates visually
- [ ] Last image shows completion message
- [ ] Smooth transition between images

### ✅ Progress Display
- [ ] Progress section visible on left side
- [ ] Counter shows "X / Total"
- [ ] Progress bar fills correctly
- [ ] Image indicator shows "Image N of Total"
- [ ] Updates in real-time after submission
- [ ] Colors display correctly (blue gradient)

### ✅ Export Functionality
- [ ] Export button visible after first annotation
- [ ] Export downloads JSON file
- [ ] Filename includes timestamp
- [ ] JSON contains all annotations
- [ ] JSON structure is valid and formatted
- [ ] All required fields present in JSON
- [ ] Image path and index included
- [ ] Doctor attribution included
- [ ] Timestamps included

### ✅ Dataset View
- [ ] Dataset table displays all annotations
- [ ] Table shows: Image#, Disease, Case Type, Doctor, Timestamp
- [ ] Expandable rows work (View/Hide buttons)
- [ ] Expanded view shows all metadata
- [ ] Image path visible in expanded view
- [ ] Bounding box coordinates visible
- [ ] Description visible in expanded view
- [ ] Modality, body part, age group visible
- [ ] Review status visible

### ✅ UI/UX
- [ ] Layout is responsive (desktop & mobile)
- [ ] Colors are consistent and professional
- [ ] Text is readable
- [ ] Spacing is appropriate
- [ ] Buttons are clickable and provide feedback
- [ ] Error messages are clear
- [ ] Success messages are clear
- [ ] Loading states visible
- [ ] Header shows logged-in user info

### ✅ Data Persistence
- [ ] Annotations save to localStorage
- [ ] Annotations persist after page refresh
- [ ] Annotations persist after logout/login
- [ ] localStorage key "annotations" contains array
- [ ] localStorage key "currentUser" contains user
- [ ] Data can be exported as JSON
- [ ] No server calls made (all local)

### ✅ Error Handling
- [ ] Missing image shows error gracefully
- [ ] Missing disease name shows error
- [ ] Missing bounding box shows error
- [ ] Invalid email shows error
- [ ] Weak password shows error
- [ ] Empty username shows error
- [ ] All error messages are helpful

### ✅ Browser Compatibility
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge
- [ ] Mobile responsive (tested on mobile device)
- [ ] Touch input works on mobile
- [ ] Canvas drawing works on mobile

### ✅ Performance
- [ ] Images load within 2 seconds
- [ ] Canvas drawing is smooth (60 FPS)
- [ ] Forms respond instantly to input
- [ ] Submission completes in <1 second
- [ ] No UI lag or janky animations
- [ ] Memory usage stable after multiple annotations

### ✅ Navigation
- [ ] "/" route shows login page
- [ ] "/annotate" route shows annotation page
- [ ] Navbar/header visible on all pages
- [ ] Logout button works from annotation page
- [ ] Back button behavior correct
- [ ] Refresh page maintains state appropriately

---

## Edge Cases Testing

### ✅ Single Image Dataset
- [ ] Works with just 1 image
- [ ] Shows "1 of 1" correctly
- [ ] Progress bar shows 100% on completion
- [ ] Completion message displays

### ✅ Large Dataset
- [ ] Works with 50+ images
- [ ] Performance remains acceptable
- [ ] Progress tracking accurate
- [ ] No memory leaks

### ✅ Multiple Users
- [ ] Each user has separate session
- [ ] Annotations attributed to correct doctor
- [ ] No data mixing between users
- [ ] Logout prevents cross-user access

### ✅ Form Validation
- [ ] Very long disease names handling
- [ ] Very long descriptions handling
- [ ] Special characters in text fields
- [ ] Multiple annotations with same disease
- [ ] Annotations with all optional fields empty
- [ ] Annotations with all optional fields filled

### ✅ Bounding Box Edge Cases
- [ ] Very small boxes (minimum 10x10)
- [ ] Large boxes (entire image)
- [ ] Boxes in corners
- [ ] Boxes along edges
- [ ] Multiple box attempts (clear and redraw)
- [ ] Rapid clicks while drawing

### ✅ Canvas Rendering
- [ ] Images with different aspect ratios
- [ ] Very large images (5000x5000)
- [ ] Very small images (100x100)
- [ ] Portrait orientation
- [ ] Landscape orientation
- [ ] Various image formats (PNG, JPG, GIF)

---

## Data Quality Testing

### ✅ Annotation Data
- [ ] Disease names logged correctly
- [ ] Case types recorded (Normal/Abnormal)
- [ ] Severity levels stored correctly
- [ ] Confidence values in 0-100 range
- [ ] Bounding box coordinates reasonable
- [ ] Image paths reference correct files
- [ ] Image indices sequential
- [ ] Timestamps monotonically increasing

### ✅ Export Data
- [ ] Exported JSON is valid JSON
- [ ] Can import/parse exported JSON
- [ ] No data lost in export
- [ ] All fields present in export
- [ ] Array properly formatted
- [ ] Timestamps are Unix milliseconds
- [ ] Coordinates are numbers

---

## Security & Privacy Testing

### ✅ Data Security
- [ ] Passwords not displayed plaintext
- [ ] Passwords not logged/stored insecurely
- [ ] No sensitive data in console logs
- [ ] No API calls to external services
- [ ] All data stays in browser
- [ ] No cookies sent to servers
- [ ] localStorage accessible only by app

### ✅ Session Management
- [ ] Logout clears user session
- [ ] Logout clears sensitive data
- [ ] New login creates new session
- [ ] Session not shared across tabs
- [ ] Refresh maintains session

---

## Deployment Testing

### ✅ Production Build
- [ ] `npm run build` completes successfully
- [ ] Build creates `.next` directory
- [ ] No errors during build
- [ ] `npm run start` works
- [ ] App runs on production server
- [ ] Performance acceptable

### ✅ Static Export (if needed)
- [ ] `next export` works (if configured)
- [ ] Can be hosted on static services
- [ ] All routes work in static mode

---

## Regression Testing

### ✅ No Regressions
- [ ] Login still works as before
- [ ] Forms still work as before
- [ ] Canvas still works as before
- [ ] Export still works as before
- [ ] No features broken in updates
- [ ] Database format compatible

---

## Documentation Review

### ✅ Documentation
- [ ] README_PLATFORM.md accurate
- [ ] QUICK_START_PLATFORM.md accurate
- [ ] SETUP.md reflects changes
- [ ] Examples match actual implementation
- [ ] Instructions are clear and complete
- [ ] Troubleshooting covers common issues

---

## Final Checklist

Before deployment, verify:

- [ ] All tests above passed ✅
- [ ] No console errors
- [ ] No console warnings
- [ ] Responsive design working
- [ ] Documentation complete
- [ ] Code committed to version control
- [ ] No hardcoded secrets in code
- [ ] Environment variables properly set
- [ ] Performance acceptable
- [ ] Accessibility reasonable
- [ ] Mobile experience good
- [ ] Cross-browser compatibility verified
- [ ] Data export working
- [ ] Backup and recovery plan ready

---

## Sign-Off

- [ ] QA Tester: __________________ Date: __________
- [ ] Developer: __________________ Date: __________
- [ ] Project Manager: __________________ Date: __________

---

**Platform Ready for Deployment** ✅

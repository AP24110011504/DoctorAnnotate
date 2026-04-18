# X-ray Dataset Directory

Add your X-ray images here for annotation.

## Instructions

1. **Place Images**: Add your X-ray image files (.png, .jpg, .gif) to this directory
2. **Update Dataset**: Edit `lib/dataset.ts` to add the image paths
3. **Example**: 
   ```
   /dataset/xray1.png
   /dataset/xray2.png
   /dataset/patient_001.jpg
   ```

## Image Requirements

- Format: PNG, JPG, GIF, WebP
- Size: Recommended maximum 10MB per image
- Resolution: Any resolution (will be scaled to fit canvas)
- Color: Grayscale or color X-rays supported

## Adding Images to Dataset

Edit `lib/dataset.ts`:

```typescript
export const XRAY_DATASET = [
  "/dataset/chest_xray_1.png",
  "/dataset/chest_xray_2.png",
  "/dataset/patient_001_frontal.jpg",
  "/dataset/patient_002_lateral.jpg",
  // Add more images...
];
```

## Organizing Images

We recommend organizing by imaging type or patient:

```
dataset/
├── chest/
│   ├── patient_001_frontal.png
│   ├── patient_001_lateral.png
│   └── patient_002.png
├── abdomen/
│   ├── patient_003.png
│   └── patient_004.png
└── extremities/
    └── patient_005.png
```

Then update dataset.ts with the correct paths:

```typescript
export const XRAY_DATASET = [
  "/dataset/chest/patient_001_frontal.png",
  "/dataset/chest/patient_001_lateral.png",
  "/dataset/chest/patient_002.png",
  "/dataset/abdomen/patient_003.png",
  "/dataset/abdomen/patient_004.png",
  "/dataset/extremities/patient_005.png",
];
```

## Sample Images

For testing/demo purposes, you can:

1. Use placeholder images from free medical imaging databases
2. Create simple PNG/JPG test images
3. Use the system with existing images already in this directory

## Privacy & Compliance

- Ensure all images comply with HIPAA/GDPR regulations
- Anonymize patient data
- Store with appropriate access controls
- Keep backup copies as needed

## Troubleshooting

If images don't appear:
1. Check the file path is correct
2. Ensure file format is supported (PNG, JPG, GIF, WebP)
3. Check file permissions (must be readable)
4. Look for browser console errors
5. Verify path uses forward slashes (/)

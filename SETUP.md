# Setup Instructions

## Prerequisites

Before you start, ensure you have:

- **Node.js** 18.17 or higher ([Download](https://nodejs.org/))
- **npm** 9 or higher (comes with Node.js)
- **Git** (optional, for version control)
- A modern web browser (Chrome, Firefox, Safari, Edge)

### Check Your Versions

```bash
node --version
npm --version
```

---

## Installation Steps

### 1. Navigate to Project Directory

```bash
cd path/to/Medical-Annotation-App
```

Or if you just extracted the files:

```bash
cd "Desktop\Innovate_x"
```

### 2. Install Dependencies

This will install all required packages:

```bash
npm install
```

**What gets installed:**
- Next.js 14 (React framework)
- React and React DOM
- TypeScript (for type safety)
- Tailwind CSS (for styling)
- PostCSS and Autoprefixer (for CSS processing)

### 3. Start Development Server

```bash
npm run dev
```

**Expected output:**
```
> next dev

  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  ▲ ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### 4. Open in Browser

- Go to `http://localhost:3000`
- Should see login page
- You're ready to use the app!

### 5. Stop Server

Press `Ctrl + C` in terminal to stop development server

---

## Running the Application

### Development Mode

For active development with hot reload:

```bash
npm run dev
```

### Production Build

To create optimized production build:

```bash
npm run build
npm run start
```

### Linting

To check code for issues:

```bash
npm run lint
```

---

## Directory Structure

```
Medical-Annotation-App/
│
├── app/                                 # Next.js App Router
│   ├── layout.tsx                      # Root layout component
│   ├── globals.css                     # Global styles
│   ├── page.tsx                        # Login page (/)
│   └── annotate/
│       └── page.tsx                    # Annotation page (/annotate)
│
├── components/                          # Reusable React components
│   ├── BoundingBoxCanvas.tsx           # Canvas for drawing boxes
│   ├── DiagnosisForm.tsx               # Diagnosis input form
│   ├── MetadataForm.tsx                # Metadata input form
│   └── DatasetView.tsx                 # Saved annotations view
│
├── lib/                                 # Utility functions and hooks
│   ├── types.ts                        # TypeScript interfaces
│   ├── storage.ts                      # localStorage operations
│   ├── hooks.ts                        # Custom React hooks
│   ├── export.ts                       # Data export utilities
│   ├── validation.ts                   # Form validation
│   └── constants.ts                    # App constants
│
├── public/                              # Static assets (if any)
│
├── Configuration Files
│   ├── package.json                    # Dependencies and scripts
│   ├── tsconfig.json                   # TypeScript config
│   ├── tailwind.config.js              # Tailwind CSS config
│   ├── postcss.config.js               # PostCSS config
│   ├── next.config.js                  # Next.js config
│   ├── .env.local                      # Environment variables
│   └── .gitignore                      # Git ignore rules
│
└── Documentation
    ├── README.md                       # Full documentation
    ├── QUICK_START.md                  # Quick start guide
    ├── SETUP.md                        # This file
    └── API_DOCS.md                     # (Optional) API reference
```

---

## Environment Variables

The app has minimal environment configuration. Edit `.env.local` if needed:

```env
# Optional: App name for display
NEXT_PUBLIC_APP_NAME=Medical Image Annotation
```

**Next.js automatically recognizes:**
- `NEXT_PUBLIC_*` variables (accessible in browser)
- Other variables only accessible on server

---

## Database/Storage

This app uses **browser localStorage** for data persistence:

- **Location:** Browser Developer Tools → Application → LocalStorage
- **Keys:**
  - `currentUser` - logged-in user data
  - `annotations` - all saved annotations
- **Data persists:** Until browser cache is cleared
- **Scope:** Per browser, per device

### View Stored Data

1. Open DevTools: `F12` or `Ctrl + Shift + I`
2. Go to Application Tab
3. Select LocalStorage
4. Click domain URL
5. See all stored data

### Export Data from Browser

1. In app, click "Export Data" button
2. JSON file downloads automatically
3. Can be imported into other tools

---

## Troubleshooting

### Port Already in Use

If `npm run dev` fails with port error:

```bash
# Use different port
npm run dev -- -p 3001
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json  # On Mac/Linux
rmdir /s node_modules                   # On Windows

npm install
```

### TypeScript Errors

```bash
# Rebuild TypeScript
npm run build
```

### Browser Shows Blank Page

1. Check browser console (F12) for errors
2. Check terminal for build errors
3. Try hard refresh: `Ctrl + Shift + R`
4. Clear browser cache

### Image Upload Not Working

- Check file is actual image (not renamed)
- Try different image format
- Check file size < 10MB

---

## Building for Production

### Create Optimized Build

```bash
npm run build
```

Output files in `.next` directory

### Start Production Server

```bash
npm run start
```

Runs optimized production build

### Deploy to Hosting

The build is ready for deployment to:
- Vercel (recommended for Next.js)
- Netlify
- Manual server hosting
- Docker containers

**Build output:** `.next/` directory (can be deployed)

---

## Development Tips

### Enable Source Maps

Add to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "sourceMap": true
  }
}
```

### Add Console.log Debugging

Open DevTools Console tab (`F12`) to see console logs

### Hot Module Replacement

Changes to files automatically reload in browser (with `npm run dev`)

### Browser DevTools

- **Elements:** Inspect HTML structure
- **Console:** JavaScript errors and logs
- **Application:** View localStorage, cookies
- **Network:** Check API calls
- **Performance:** Analyze load times

---

## Next Steps After Setup

1. **Create an Account**
   - Use demo (doctor@gmail.com) or create new
   - Email must end with @gmail.com

2. **Test Annotation Flow**
   - Upload sample medical image
   - Draw bounding box
   - Fill forms
   - Save annotation

3. **Explore Features**
   - Multiple annotations
   - Export data
   - View dataset
   - Switch users

4. **Customize (Optional)**
   - Edit colors in `tailwind.config.js`
   - Add new form fields in components
   - Extend validation rules

---

## Performance Optimization

### Optimize Images

```bash
# Install image optimizer
npm install sharp
```

### Enable Compression

```bash
# In next.config.js
compression: true
```

### Code Splitting

Next.js automatically splits code - already optimized

---

## Security Considerations

⚠️ **This is a local app. For production:**

- Add backend authentication
- Use HTTPS only
- Implement proper password hashing
- Add CSRF protection
- Validate all inputs server-side
- Use environment variables for secrets

---

## Support & Resources

### Official Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs)

### Troubleshooting
- Check error messages in browser console
- Read build output in terminal
- Check .next directory for build artifacts

### Getting Help
1. Search existing issues
2. Check browser console for errors
3. Review Quick Start guide
4. Check main README.md

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| npm: command not found | Install Node.js |
| Port 3000 in use | Use `npm run dev -- -p 3001` |
| Module not found | Run `npm install` |
| TypeScript errors | Run `npm run build` to check |
| Blank page | Hard refresh with `Ctrl+Shift+R` |
| Image not loading | Check file format and size |
| Data not saving | Check localStorage in DevTools |

---

## System Requirements by OS

### Windows 10/11
- Node.js 18+
- PowerShell or Command Prompt
- 500MB disk space

### macOS
- Node.js 18+
- Terminal application
- 500MB disk space

### Linux
- Node.js 18+
- Bash shell
- 500MB disk space

---

## Next: Getting Started

Once setup is complete:

1. Read [QUICK_START.md](QUICK_START.md) for demo walkthrough
2. Check [README.md](README.md) for full documentation
3. Start with login page and create account
4. Try annotating a sample image

**Enjoy using the Medical Image Annotation App!** 🎉

---

## Support

For issues or questions:
- Check browser console (F12)
- Review environment variables
- Check file permissions
- Try clearing browser cache
- Reinstall dependencies if needed

---

**Version:** 1.0.0  
**Last Updated:** 2024

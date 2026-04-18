# Development & Customization Guide

## Overview for Developers

This guide helps developers understand the app architecture, make modifications, and extend functionality.

---

## Architecture

### Technology Stack

```
Frontend: Next.js 14 (App Router)
Language: TypeScript
Styling: Tailwind CSS
Storage: Browser localStorage
State: React hooks (useState, useEffect)
```

### Data Flow

```
User Input → Component → Validation → Storage → Display
   ↓
 Login
   ↓
Auth Check → Redirect
   ↓
Annotation Page
   ↓
Form Input → localStorage → Dataset View
```

---

## File Organization

### Components (`components/`)

Each component is a reusable piece of UI:

```typescript
// BoundingBoxCanvas.tsx
- Handles image canvas rendering
- Mouse event tracking for drawing
- Bounding box coordinate storage
- Props: image, onBoxChange
```

```typescript
// DiagnosisForm.tsx
- Diagnosis input fields
- Form state management
- Data validation feedback
- Props: data, onChange
```

```typescript
// MetadataForm.tsx
- Dropdown selections
- Metadata input collection
- Checkbox handling
- Props: data, onChange
```

```typescript
// DatasetView.tsx
- Display all annotations
- Expandable rows for details
- Table formatting
- Props: annotations
```

### Utilities (`lib/`)

Helper functions and hooks:

- **types.ts** - TypeScript interfaces
- **storage.ts** - localStorage operations
- **hooks.ts** - Custom React hooks
- **export.ts** - Data export functions
- **validation.ts** - Form validation
- **constants.ts** - App configuration

---

## Component Development

### Creating New Component

```typescript
// components/MyComponent.tsx
"use client"; // Required for client-side features

import React from "react";

interface MyComponentProps {
  data: string;
  onChange: (value: string) => void;
}

export default function MyComponent({ data, onChange }: MyComponentProps) {
  return (
    <div className="space-y-4">
      {/* Component content */}
    </div>
  );
}
```

### Component Guidelines

1. **Use "use client"** if component uses hooks/events
2. **Keep components focused** - single responsibility
3. **Use TypeScript** for props interface
4. **Document props** with JSDoc comments
5. **Use Tailwind classes** for styling
6. **Handle loading/error states**

### Example: Adding New Field to Diagnosis Form

```typescript
// In components/DiagnosisForm.tsx

interface DiagnosisFormProps {
  data: {
    disease: string;
    caseType: "Normal" | "Abnormal";
    severity: "Mild" | "Moderate" | "Severe";
    description: string;
    confidence: number;
    newField: string; // NEW
  };
  onChange: (data: any) => void;
}

export default function DiagnosisForm({ data, onChange }: DiagnosisFormProps) {
  // ... existing code ...

  // Add new input field
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      New Field
    </label>
    <input
      type="text"
      value={data.newField}
      onChange={(e) => handleChange("newField", e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
}
```

---

## Adding New Features

### Feature: Disease Suggestions

```typescript
// lib/diseases.ts
export const DISEASE_SUGGESTIONS = [
  "Pneumonia",
  "Tuberculosis",
  "COVID-19",
  "Bronchitis",
  // ... more diseases
];

// components/DiagnosisForm.tsx
import { DISEASE_SUGGESTIONS } from "@/lib/diseases";

// In component
<input
  list="diseases"
  {/* ... other props ... */}
/>
<datalist id="diseases">
  {DISEASE_SUGGESTIONS.map((disease) => (
    <option key={disease} value={disease} />
  ))}
</datalist>
```

### Feature: Annotation History

```typescript
// lib/storage.ts
export const getAnnotationHistory = (doctor: string): Annotation[] => {
  const annotations = getAnnotations();
  return annotations.filter((a) => a.doctor === doctor);
};

// app/annotate/page.tsx
const docHistory = getAnnotationHistory(user.username);
```

### Feature: Search Annotations

```typescript
// lib/search.ts
export const searchAnnotations = (query: string): Annotation[] => {
  const annotations = getAnnotations();
  return annotations.filter((a) =>
    a.disease.toLowerCase().includes(query.toLowerCase()) ||
    a.doctor.toLowerCase().includes(query.toLowerCase())
  );
};
```

---

## Styling Customization

### Tailwind Configuration

Edit `tailwind.config.js`:

```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        secondary: "#64748b",
      },
      spacing: {
        "safe": "env(safe-area-inset-left)",
      },
    },
  },
};
```

### Common Tailwind Classes

```css
/* Spacing */
p-4    /* Padding all sides */
m-2    /* Margin all sides */
px-4   /* Padding horizontal */
mb-2   /* Margin bottom */

/* Colors */
bg-red-600     /* Background */
text-gray-700  /* Text color */
border-blue-300 /* Border color */

/* Layout */
flex       /* Flexbox */
grid       /* Grid layout */
w-full     /* Full width */
h-64       /* Height */

/* Responsive */
md:flex    /* Flex on medium screens up */
lg:grid    /* Grid on large screens up */
```

---

## State Management Patterns

### Local Component State

```typescript
const [value, setValue] = useState("");
```

### Multiple Related States

```typescript
const [formData, setFormData] = useState({
  name: "",
  email: "",
  age: 0,
});

const handleChange = (field: string, value: any) => {
  setFormData(prev => ({
    ...prev,
    [field]: value,
  }));
};
```

### Effects for Side Effects

```typescript
useEffect(() => {
  // Runs on component mount
  const user = getLoggedInUser();
  setUser(user);
}, []); // Empty dependency array = only once

useEffect(() => {
  // Runs when dependencies change
  console.log("User changed:", user);
}, [user]); // Dependency array
```

---

## Form Validation

### Add Custom Validation

```typescript
// lib/validation.ts
export function validateCustomField(value: string): boolean {
  // Your validation logic
  return value.length > 3;
}

// In component
const [error, setError] = useState("");

const handleSubmit = () => {
  if (!validateCustomField(data.customField)) {
    setError("Field must be longer than 3 characters");
    return;
  }
  // Proceed with submission
};
```

### Validation Best Practices

1. Validate on blur for better UX
2. Show error messages immediately
3. Clear errors when user corrects input
4. Server-side validation too (when backend added)

---

## Working with Canvas

### Drawing on Canvas

```typescript
const canvas = canvasRef.current;
const ctx = canvas.getContext("2d");

// Draw image
ctx.drawImage(image, 0, 0);

// Draw rectangle
ctx.strokeStyle = "#FF0000";
ctx.strokeRect(x, y, width, height);

// Draw circle
ctx.beginPath();
ctx.arc(x, y, radius, 0, 2 * Math.PI);
ctx.fill();
```

### Mouse Events

```typescript
const handleMouseDown = (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  // Handle start of drawing
};

const handleMouseMove = (e) => {
  // Draw preview while moving
};

const handleMouseUp = (e) => {
  // Finalize drawing
};
```

---

## localStorage Operations

### Save Data

```typescript
const data = { key: "value" };
localStorage.setItem("myData", JSON.stringify(data));
```

### Retrieve Data

```typescript
const data = JSON.parse(localStorage.getItem("myData") || "{}");
```

### Delete Data

```typescript
localStorage.removeItem("myData");
localStorage.clear(); // Clear all
```

### Type-Safe Storage Helper

```typescript
export interface StorageData {
  annotations: Annotation[];
  currentUser: User;
}

const getTypedData = <T,>(key: string): T | null => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};
```

---

## API Integration (Future)

### Adding Backend API

```typescript
// lib/api.ts
export async function saveAnnotation(data: Annotation) {
  const response = await fetch("/api/annotations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

// In component
const handleSubmit = async () => {
  try {
    await saveAnnotation(annotation);
    showSuccess("Saved to server!");
  } catch (err) {
    showError("Server error");
  }
};
```

---

## Testing Patterns

### Unit Tests Example

```typescript
// __tests__/validation.test.ts
import { validateEmail } from "@/lib/validation";

describe("validateEmail", () => {
  it("should accept valid gmail", () => {
    expect(validateEmail("user@gmail.com")).toBe(true);
  });

  it("should reject non-gmail", () => {
    expect(validateEmail("user@yahoo.com")).toBe(false);
  });
});
```

### Component Tests Example

```typescript
// __tests__/components/DiagnosisForm.test.tsx
import { render, screen } from "@testing-library/react";
import DiagnosisForm from "@/components/DiagnosisForm";

describe("DiagnosisForm", () => {
  it("should render form fields", () => {
    render(<DiagnosisForm data={{...}} onChange={() => {}} />);
    expect(screen.getByLabelText("Disease Name")).toBeInTheDocument();
  });
});
```

---

## Performance Optimization

### Code Splitting

```typescript
// Load component only when needed
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("@/components/Heavy"));

export default function Page() {
  return <HeavyComponent />;
}
```

### Image Optimization

```typescript
import Image from "next/image";

<Image
  src="/image.jpg"
  alt="Description"
  width={400}
  height={300}
/>
```

### Memoization

```typescript
import { memo } from "react";

const ExpensiveComponent = memo(function Component({ data }) {
  // Only re-renders if props change
  return <div>{data}</div>;
});
```

---

## Debugging

### Console Logging

```typescript
console.log("Simple log", value);
console.table(array); // Table format
console.time("label"); // Time code
console.timeEnd("label");
```

### DevTools Usage

```javascript
// In browser console
// View all annotations
JSON.parse(localStorage.getItem('annotations'))

// View current user
JSON.parse(localStorage.getItem('currentUser'))

// Clear all data
localStorage.clear()
```

### Debugging with Breakpoints

1. Open DevTools (F12)
2. Go to Sources tab
3. Click line number to set breakpoint
4. Refresh page
5. Step through code with buttons

---

## Common Modifications

### Change Primary Color

```javascript
// tailwind.config.js
colors: {
  primary: "#FF6B6B", // Change this
}

// Then use in components:
className="bg-primary"
```

### Change App Title

```typescript
// app/layout.tsx
export const metadata = {
  title: "New Title",
};
```

### Add New Dropdown Option

```typescript
// lib/constants.ts
export const MODALITIES = [
  "X-ray",
  "CT",
  "New Modality", // Add here
];
```

---

## Extending Features

### Add User Roles

```typescript
// lib/types.ts
interface User {
  username: string;
  email: string;
  role: "doctor" | "admin" | "reviewer";
}

// In components
{user.role === "admin" && <AdminPanel />}
```

### Add Annotation Status

```typescript
interface Annotation {
  // ... existing fields ...
  status: "draft" | "submitted" | "reviewed" | "approved";
}
```

### Add Collaboration Features

```typescript
interface Annotation {
  // ... existing fields ...
  reviewedBy?: string;
  reviewComments?: string;
  approvedAt?: number;
}
```

---

## Best Practices

1. **Keep components small** - single responsibility
2. **Use TypeScript** - better type safety
3. **Handle errors gracefully** - show user-friendly messages
4. **Optimize re-renders** - use memo, useMemo
5. **Write accessible code** - proper labels, ARIA
6. **Test thoroughly** - unit and integration tests
7. **Document code** - JSDoc comments
8. **Use constants** - avoid magic numbers
9. **Validate inputs** - both client and server
10. **Follow conventions** - consistent naming

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Hooks Guide](https://react.dev/reference/react)
- [Tailwind CSS Reference](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request
5. Document changes
6. Update CHANGELOG

---

**Happy coding!** 🚀

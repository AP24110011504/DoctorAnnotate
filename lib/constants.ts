// Application Constants and Configuration

export const APP_NAME = "Medical Image Annotation";

// Image Upload Config
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const SUPPORTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"];
export const SUPPORTED_IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".webp"];

// Form Options
export const CASE_TYPES = ["Normal", "Abnormal"] as const;
export const SEVERITY_LEVELS = ["Mild", "Moderate", "Severe"] as const;
export const MODALITIES = [
  "X-ray",
  "CT",
  "MRI",
  "Ultrasound",
  "PET",
  "Fluoroscopy",
  "Mammography",
  "Digital Radiography",
] as const;

export const BODY_PARTS = [
  "Chest",
  "Abdomen",
  "Head",
  "Neck",
  "Thorax",
  "Limbs",
  "Spine",
  "Pelvis",
  "Extremities",
  "Whole Body",
  "Other",
] as const;

export const AGE_GROUPS = [
  "Pediatric (0-5)",
  "Child (6-12)",
  "Adolescent (13-19)",
  "Young Adult (20-35)",
  "Adult (36-65)",
  "Senior (65+)",
  "Unknown",
] as const;

// LocalStorage Keys
export const LS_KEYS = {
  CURRENT_USER: "currentUser",
  ANNOTATIONS: "annotations",
  USER_SESSIONS: "userSessions",
} as const;

// Validation Rules
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MIN_USERNAME_LENGTH: 2,
  MAX_USERNAME_LENGTH: 50,
  EMAIL_DOMAIN: "@gmail.com",
  MIN_BOX_SIZE: 10, // pixels
} as const;

// UI Configuration
export const UI = {
  ANIMATION_DURATION: 200, // ms
  MESSAGE_DISPLAY_TIME: 3000, // ms
  CANVAS_BORDER_WIDTH: 3, // pixels
  CANVAS_DASH_PATTERN: [5, 5],
} as const;

// Default Form Values
export const DEFAULT_DIAGNOSIS = {
  disease: "",
  caseType: "Normal" as const,
  severity: "Mild" as const,
  description: "",
  confidence: 50,
};

export const DEFAULT_METADATA = {
  modality: "X-ray",
  bodyPart: "Chest",
  ageGroup: "Adult (36-65)",
  review: false,
};

// Canvas Colors
export const CANVAS_COLORS = {
  PREVIEW_BOX: "#3B82F6", // Blue
  FINAL_BOX: "#EF4444", // Red
  CORNER_DOT: "#EF4444", // Red
  BACKGROUND: "#FFFFFF", // White
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_EMAIL: "Email must end with @gmail.com",
  INVALID_PASSWORD: `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`,
  MISSING_USERNAME: "Username is required",
  MISSING_EMAIL: "Email is required",
  MISSING_PASSWORD: "Password is required",
  MISSING_IMAGE: "Please upload an image",
  MISSING_BOUNDING_BOX: "Please draw a bounding box",
  MISSING_DISEASE: "Please enter disease name",
  INVALID_IMAGE_TYPE: "Please select a valid image file",
  IMAGE_TOO_LARGE: `Image size must be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB`,
  SAVE_FAILED: "Failed to save annotation",
  LOGIN_REQUIRED: "Please login first",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Login successful!",
  ANNOTATION_SAVED: "Annotation saved successfully!",
  DATA_EXPORTED: "Data exported successfully!",
  LOGOUT_SUCCESS: "Logged out successfully!",
} as const;

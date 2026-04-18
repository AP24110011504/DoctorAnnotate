import { VALIDATION, SUPPORTED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "./constants";

export function validateEmail(email: string): boolean {
  // Must be valid email format and end with @gmail.com
  const emailRegex = /^[^\s@]+@gmail\.com$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  return password.length >= VALIDATION.MIN_PASSWORD_LENGTH;
}

export function validateUsername(username: string): boolean {
  return (
    username.length >= VALIDATION.MIN_USERNAME_LENGTH &&
    username.length <= VALIDATION.MAX_USERNAME_LENGTH
  );
}

export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  // Check file type
  if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid image format. Supported: PNG, JPG, GIF, WebP`,
    };
  }

  // Check file size
  if (file.size > MAX_IMAGE_SIZE) {
    return {
      valid: false,
      error: `Image too large. Maximum size: ${MAX_IMAGE_SIZE / 1024 / 1024}MB`,
    };
  }

  return { valid: true };
}

export function validateBoundingBox(box: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}): boolean {
  const width = Math.abs(box.x2 - box.x1);
  const height = Math.abs(box.y2 - box.y1);
  return width >= VALIDATION.MIN_BOX_SIZE && height >= VALIDATION.MIN_BOX_SIZE;
}

export function validateDiseaseName(disease: string): boolean {
  return disease.trim().length > 0 && disease.trim().length <= 100;
}

export function validateConfidence(confidence: number): boolean {
  return confidence >= 0 && confidence <= 100 && Number.isInteger(confidence);
}

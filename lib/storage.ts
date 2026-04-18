import { User, Annotation } from "./types";

// User management
export const getLoggedInUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
};

export const setLoggedInUser = (user: User) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("currentUser", JSON.stringify(user));
};

export const logout = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("currentUser");
};

export const isUserLoggedIn = (): boolean => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("currentUser");
};

// Annotations management
export const getAnnotations = (): Annotation[] => {
  if (typeof window === "undefined") return [];
  const annotations = localStorage.getItem("annotations");
  return annotations ? JSON.parse(annotations) : [];
};

export const addAnnotation = (annotation: Annotation) => {
  if (typeof window === "undefined") return;
  const annotations = getAnnotations();
  annotations.push(annotation);
  localStorage.setItem("annotations", JSON.stringify(annotations));
};

export const clearAnnotations = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("annotations");
};

export interface User {
  username: string;
  email: string;
  password: string;
  doctorVerified?: boolean;
}

export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Annotation {
  image_path: string;
  image_index: number;
  disease: string;
  case_type: "Normal" | "Abnormal";
  severity: "Mild" | "Moderate" | "Severe";
  description: string;
  confidence: number;
  modality: string;
  body_part: string;
  age_group: string;
  review_required: boolean;
  box: [number, number, number, number];
  doctor: string;
  timestamp: number;
}

import { Annotation } from "./types";
import { getAnnotations } from "./storage";

export function exportAnnotationsAsJSON(): string {
  const annotations = getAnnotations();
  return JSON.stringify(annotations, null, 2);
}

export function exportAnnotationsAsCSV(): string {
  const annotations = getAnnotations();
  
  if (annotations.length === 0) {
    return "No annotations to export";
  }

  // CSV Headers
  const headers = [
    "Image Index",
    "Image Path",
    "Disease",
    "Case Type",
    "Severity",
    "Confidence",
    "Modality",
    "Body Part",
    "Age Group",
    "Review Required",
    "Bounding Box",
    "Doctor",
    "Timestamp",
    "Description",
  ];

  // Escape CSV values
  const escapeCSV = (value: any): string => {
    const stringValue = String(value);
    if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  // Build CSV rows
  const rows = annotations.map((ann) => [
    escapeCSV(ann.image_index + 1),
    escapeCSV(ann.image_path),
    escapeCSV(ann.disease),
    escapeCSV(ann.case_type),
    escapeCSV(ann.severity),
    escapeCSV(ann.confidence),
    escapeCSV(ann.modality),
    escapeCSV(ann.body_part),
    escapeCSV(ann.age_group),
    escapeCSV(ann.review_required ? "Yes" : "No"),
    escapeCSV(`[${ann.box.join(", ")}]`),
    escapeCSV(ann.doctor),
    escapeCSV(new Date(ann.timestamp).toISOString()),
    escapeCSV(ann.description),
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  return csvContent;
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const element = document.createElement("a");
  element.setAttribute("href", `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`);
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export function getStatistics() {
  const annotations = getAnnotations();
  
  if (annotations.length === 0) {
    return {
      totalAnnotations: 0,
      normalCases: 0,
      abnormalCases: 0,
      averageConfidence: 0,
      activeAnnotators: 0,
      diseaseDistribution: {},
      modalityDistribution: {},
    };
  }

  const normalCases = annotations.filter((a) => a.case_type === "Normal").length;
  const abnormalCases = annotations.filter((a) => a.case_type === "Abnormal").length;
  const averageConfidence =
    annotations.reduce((sum, a) => sum + a.confidence, 0) / annotations.length;
  const activeAnnotators = new Set(annotations.map((a) => a.doctor)).size;

  const diseaseDistribution: Record<string, number> = {};
  const modalityDistribution: Record<string, number> = {};

  annotations.forEach((a) => {
    diseaseDistribution[a.disease] = (diseaseDistribution[a.disease] || 0) + 1;
    modalityDistribution[a.modality] = (modalityDistribution[a.modality] || 0) + 1;
  });

  return {
    totalAnnotations: annotations.length,
    normalCases,
    abnormalCases,
    averageConfidence: Math.round(averageConfidence * 100) / 100,
    activeAnnotators,
    diseaseDistribution,
    modalityDistribution,
  };
}

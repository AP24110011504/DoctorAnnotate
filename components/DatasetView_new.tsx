"use client";

import { Annotation } from "@/lib/types";
import { useState, useEffect } from "react";

interface DatasetViewProps {
  annotations: Annotation[];
}

export default function DatasetView({ annotations }: DatasetViewProps) {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const toggleExpand = (index: number) => {
    const newSet = new Set(expandedIds);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setExpandedIds(newSet);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  if (annotations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500">No annotations saved yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <h2 className="text-xl font-bold text-gray-900">
          Dataset ({annotations.length} annotations)
        </h2>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header Row */}
          <div className="grid grid-cols-6 gap-4 items-center bg-gray-100 border-b border-gray-200 p-4 font-semibold">
            <div className="text-left text-sm text-gray-700">Image</div>
            <div className="text-left text-sm text-gray-700">Disease</div>
            <div className="text-left text-sm text-gray-700">Case Type</div>
            <div className="text-left text-sm text-gray-700">Doctor</div>
            <div className="text-left text-sm text-gray-700">Timestamp</div>
            <div className="text-center text-sm text-gray-700">Action</div>
          </div>

          {/* Data Rows */}
          {annotations.map((annotation, index) => (
            <div key={index}>
              <div className="grid grid-cols-6 gap-4 items-center border-b border-gray-200 hover:bg-gray-50 transition p-4">
                <div className="text-sm text-gray-900">Image {annotation.image_index + 1}</div>
                <div className="text-sm text-gray-900">{annotation.disease}</div>
                <div className="text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      annotation.case_type === "Normal"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {annotation.case_type}
                  </span>
                </div>
                <div className="text-sm text-gray-900">{annotation.doctor}</div>
                <div className="text-sm text-gray-600">{formatDate(annotation.timestamp)}</div>
                <div className="text-center">
                  <button
                    onClick={() => toggleExpand(index)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    {expandedIds.has(index) ? "Hide" : "View"}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedIds.has(index) && (
                <div className="bg-blue-50 border-b border-gray-200 p-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-700 uppercase mb-1">
                        Image Path
                      </p>
                      <p className="text-sm text-gray-900 font-mono">
                        {annotation.image_path}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-700 uppercase">
                          Severity
                        </p>
                        <p className="text-sm text-gray-900">
                          {annotation.severity}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-700 uppercase">
                          Confidence
                        </p>
                        <p className="text-sm text-gray-900">
                          {annotation.confidence}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-700 uppercase">
                          Modality
                        </p>
                        <p className="text-sm text-gray-900">
                          {annotation.modality}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-700 uppercase">
                          Body Part
                        </p>
                        <p className="text-sm text-gray-900">
                          {annotation.body_part}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-700 uppercase">
                          Age Group
                        </p>
                        <p className="text-sm text-gray-900">
                          {annotation.age_group}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-700 uppercase">
                          Review Required
                        </p>
                        <p className="text-sm text-gray-900">
                          {annotation.review_required ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-700 uppercase mb-1">
                        Description
                      </p>
                      <p className="text-sm text-gray-900">
                        {annotation.description || "No description"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-700 uppercase mb-1">
                        Bounding Box
                      </p>
                      <p className="text-sm text-gray-900 font-mono">
                        [{annotation.box.join(", ")}]
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

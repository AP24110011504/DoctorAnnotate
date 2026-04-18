"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getLoggedInUser, getAnnotations, addAnnotation, logout } from "@/lib/storage";
import { BoundingBox, Annotation, User } from "@/lib/types";
import { exportAnnotationsAsJSON, downloadFile } from "@/lib/export";
import { XRAY_DATASET, getDatasetSize, getImageByIndex, hasNextImage } from "@/lib/dataset";
import BoundingBoxCanvas from "@/components/BoundingBoxCanvas";
import DiagnosisForm from "@/components/DiagnosisForm";
import MetadataForm from "@/components/MetadataForm";
import DatasetView from "@/components/DatasetView";

export default function AnnotatePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [box, setBox] = useState<BoundingBox | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [datasetSize, setDatasetSize] = useState(10);
  const [completedCount, setCompletedCount] = useState(0);

  const [diagnosis, setDiagnosis] = useState({
    disease: "",
    caseType: "Normal" as "Normal" | "Abnormal",
    severity: "Mild" as "Mild" | "Moderate" | "Severe",
    description: "",
    confidence: 50,
  });

  const [metadata, setMetadata] = useState({
    modality: "X-ray",
    bodyPart: "Chest",
    ageGroup: "Adult (20-65)",
    review: false,
  });

  useEffect(() => {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) {
      router.push("/");
      return;
    }
    setUser(loggedInUser);
    const savedAnnotations = getAnnotations();
    setAnnotations(savedAnnotations);
    setCompletedCount(savedAnnotations.length);

    // Load first image from backend API
    const loadFirstImage = async () => {
      try {
        setImageLoading(true);
        setImageUrl(null);
        
        const res = await fetch('http://localhost:5000/api/image', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`API Error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        console.log('Image Response:', data);

        if (data?.image?.path) {
          setImageUrl(data.image.path);
          setCurrentImageIndex(data.image.index ?? 0);
          setDatasetSize(data.progress?.total ?? 10);
          setMessage(null);
        } else {
          setImageUrl(null);
          setMessage({
            type: "success",
            text: "All images annotated! Great work! 🎉",
          });
        }
      } catch (error) {
        console.error('Failed to load image:', error);
        setImageUrl(null);
        setMessage({
          type: "error",
          text: `Failed to load image: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      } finally {
        setImageLoading(false);
      }
    };

    loadFirstImage();
    setLoading(false);
  }, [router]);

  const loadNextImage = async () => {
    try {
      setImageLoading(true);
      setImageUrl(null);
      
      const res = await fetch('http://localhost:5000/api/image', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      if (data?.image?.path) {
        setCurrentImageIndex(data.image.index ?? 0);
        setImageUrl(data.image.path);
        setBox(null);
        setMessage(null);
        // Reset form
        setDiagnosis({
          disease: "",
          caseType: "Normal",
          severity: "Mild",
          description: "",
          confidence: 50,
        });
      } else {
        setImageUrl(null);
        setMessage({
          type: "success",
          text: "All images annotated! Great work! 🎉",
        });
      }
    } catch (error) {
      console.error('Failed to load next image:', error);
      setImageUrl(null);
      setMessage({
        type: "error",
        text: `Failed to load next image: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setImageLoading(false);
    }
  };

  const handleSubmit = async () => {
    setMessage(null);

    // Validation
    if (!user) {
      setMessage({ type: "error", text: "User not logged in" });
      return;
    }

    if (!imageUrl) {
      setMessage({ type: "error", text: "No image loaded" });
      return;
    }

    if (!box) {
      setMessage({ type: "error", text: "Please draw a bounding box" });
      return;
    }

    if (!diagnosis.disease.trim()) {
      setMessage({ type: "error", text: "Please enter disease name" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Check for duplicate annotation for current image
      const existingAnnotation = annotations.find(
        (a) => a.image_index === currentImageIndex
      );

      if (existingAnnotation) {
        setMessage({
          type: "error",
          text: "This image has already been annotated. Moving to next image...",
        });
        setIsSubmitting(false);
        setTimeout(() => {
          loadNextImage();
        }, 1500);
        return;
      }

      const annotation: Annotation = {
        image_path: imageUrl,
        image_index: currentImageIndex,
        disease: diagnosis.disease,
        case_type: diagnosis.caseType,
        severity: diagnosis.severity,
        description: diagnosis.description,
        confidence: diagnosis.confidence,
        modality: metadata.modality,
        body_part: metadata.bodyPart,
        age_group: metadata.ageGroup,
        review_required: metadata.review,
        box: [box.x1, box.y1, box.x2, box.y2],
        doctor: user.username,
        timestamp: Date.now(),
      };

      addAnnotation(annotation);

      // Update annotations display and progress count
      const updatedAnnotations = getAnnotations();
      setAnnotations(updatedAnnotations);
      setCompletedCount((prev) => prev + 1);

      // Show success and move to next image
      setMessage({
        type: "success",
        text: `Image ${currentImageIndex + 1} annotated! Moving to next...`,
      });

      // Wait briefly then load next image
      setTimeout(() => {
        loadNextImage();
      }, 1500);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save annotation" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleExportData = () => {
    const jsonData = exportAnnotationsAsJSON();
    downloadFile(
      jsonData,
      `annotations_${Date.now()}.json`,
      "application/json"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#D6F0FF] text-gray-800 shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <Link href="/" className="text-xl font-semibold text-gray-800 hover:text-gray-600 transition">
              DoctorAnnotate
            </Link>
            {user && (
              <div className="flex items-center gap-3">
                <p className="text-sm text-gray-800">
                  Welcome, {user.username} ({user.email})
                </p>
                {user.doctorVerified && (
                  <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                    ✔ Verified Doctor
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {annotations.length > 0 && (
              <button
                onClick={handleExportData}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
              >
                Export Data
              </button>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message Display */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 border border-green-400 text-green-700"
                : "bg-red-100 border border-red-400 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Side - Image Assignment and Canvas */}
          <div className="lg:col-span-1 space-y-4">
            {/* Progress Section */}
            <div className="bg-[#D6F0FF] text-gray-800 rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold">Progress</h2>
                <span className="text-2xl font-bold">{completedCount}/{datasetSize}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-white/80 h-full transition-all duration-300"
                  style={{ width: `${(completedCount / datasetSize) * 100}%` }}
                />
              </div>
              <p className="text-sm text-gray-700 mt-3">
                Image {currentImageIndex + 1} of {datasetSize}
              </p>
            </div>

            {/* Assigned Image */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Assigned X-ray
              </h2>
              <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100 h-64 flex items-center justify-center">
                {imageLoading ? (
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                    <p className="text-gray-600 text-sm">Loading image...</p>
                  </div>
                ) : imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={`X-ray ${currentImageIndex + 1}`}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const errorDiv = document.createElement("div");
                      errorDiv.className = "text-gray-500 text-center";
                      errorDiv.textContent = "Image failed to load";
                    }}
                  />
                ) : (
                  <p className="text-gray-500">No image assigned</p>
                )}
              </div>
            </div>

            {/* Canvas */}
            <BoundingBoxCanvas image={imageUrl} onBoxChange={setBox} />
          </div>

          {/* Right Side - Forms */}
          <div className="lg:col-span-2 space-y-6">
            <DiagnosisForm data={diagnosis} onChange={setDiagnosis} />
            <MetadataForm data={metadata} onChange={setMetadata} />

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || imageLoading || !imageUrl}
              className="w-full py-3 bg-[#D6F0FF] hover:bg-[#C6E8FA] text-gray-800 font-medium rounded-lg transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {isSubmitting ? "Saving..." : imageLoading ? "Loading..." : "Submit Annotation"}
            </button>
          </div>
        </div>

        {/* Dataset View */}
        <div className="mt-12">
          <DatasetView annotations={annotations} />
        </div>
      </main>
    </div>
  );
}

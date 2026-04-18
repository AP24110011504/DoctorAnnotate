"use client";

import { useEffect, useRef, useState } from "react";
import { BoundingBox } from "@/lib/types";

interface BoundingBoxCanvasProps {
  image: string | null;
  onBoxChange: (box: BoundingBox | null) => void;
}

export default function BoundingBoxCanvas({ image, onBoxChange }: BoundingBoxCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [box, setBox] = useState<BoundingBox | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!image) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    imageRef.current = img;

    img.onload = () => {
      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image
      ctx.drawImage(img, 0, 0);

      // Draw existing bounding box if any
      if (box) {
        drawBoundingBox(ctx, box);
      }
    };

    img.onerror = () => {
      console.error("Failed to load image");
    };

    img.src = image;
  }, [image, box]);

  const drawBoundingBox = (ctx: CanvasRenderingContext2D, bbox: BoundingBox) => {
    ctx.strokeStyle = "#EF4444";
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    const width = bbox.x2 - bbox.x1;
    const height = bbox.y2 - bbox.y1;
    ctx.strokeRect(bbox.x1, bbox.y1, width, height);
    ctx.setLineDash([]);

    // Draw corner circles
    ctx.fillStyle = "#EF4444";
    const radius = 5;
    ctx.beginPath();
    ctx.arc(bbox.x1, bbox.y1, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(bbox.x2, bbox.y1, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(bbox.x1, bbox.y2, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(bbox.x2, bbox.y2, radius, 0, 2 * Math.PI);
    ctx.fill();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!image || !imageRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setStartPos({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !image || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Redraw image
    ctx.drawImage(imageRef.current, 0, 0);

    // Draw preview box
    ctx.strokeStyle = "#3B82F6";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    const width = x - startPos.x;
    const height = y - startPos.y;
    ctx.strokeRect(startPos.x, startPos.y, width, height);
    ctx.setLineDash([]);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !image) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    const newBox: BoundingBox = {
      x1: Math.min(startPos.x, endX),
      y1: Math.min(startPos.y, endY),
      x2: Math.max(startPos.x, endX),
      y2: Math.max(startPos.y, endY),
    };

    // Only set box if it has reasonable size
    if (Math.abs(newBox.x2 - newBox.x1) > 10 && Math.abs(newBox.y2 - newBox.y1) > 10) {
      setBox(newBox);
      onBoxChange(newBox);
    }

    setIsDrawing(false);
  };

  const handleClearBox = () => {
    setBox(null);
    onBoxChange(null);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx && imageRef.current) {
      ctx.drawImage(imageRef.current, 0, 0);
    }
  };

  return (
    <div className="space-y-3">
      <div className="bg-white rounded-lg border border-gray-300 overflow-hidden shadow-sm">
        {image ? (
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="w-full h-auto max-h-96 border-gray-300 cursor-crosshair"
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
            <p className="text-gray-500 text-center">Image preview will appear here</p>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {box && (
          <button
            onClick={handleClearBox}
            className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
          >
            Clear Annotation
          </button>
        )}
        {box && (
          <div className="flex-1 bg-green-50 border border-green-300 rounded-lg p-2 text-xs text-green-700 flex items-center justify-center">
            ✓ Bounding box drawn
          </div>
        )}
      </div>
    </div>
  );
}

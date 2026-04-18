"use client";

interface MetadataFormProps {
  data: {
    modality: string;
    bodyPart: string;
    ageGroup: string;
    review: boolean;
  };
  onChange: (data: any) => void;
}

export default function MetadataForm({ data, onChange }: MetadataFormProps) {
  const handleChange = (field: string, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const ageGroups = [
    "Pediatric (0-12)",
    "Adolescent (13-19)",
    "Adult (20-65)",
    "Senior (65+)",
  ];

  const bodyParts = [
    "Chest",
    "Abdomen",
    "Head",
    "Neck",
    "Limbs",
    "Spine",
    "Pelvis",
    "Other",
  ];

  const modalities = [
    "X-ray",
    "CT",
    "MRI",
    "Ultrasound",
    "PET",
    "Fluoroscopy",
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Image Metadata</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Modality*
        </label>
        <select
          value={data.modality}
          onChange={(e) => handleChange("modality", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {modalities.map((mod) => (
            <option key={mod} value={mod}>
              {mod}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Body Part*
        </label>
        <select
          value={data.bodyPart}
          onChange={(e) => handleChange("bodyPart", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {bodyParts.map((part) => (
            <option key={part} value={part}>
              {part}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Age Group*
        </label>
        <select
          value={data.ageGroup}
          onChange={(e) => handleChange("ageGroup", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {ageGroups.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="review"
          checked={data.review}
          onChange={(e) => handleChange("review", e.target.checked)}
          className="rounded w-4 h-4 text-blue-600 border-gray-300 cursor-pointer"
        />
        <label htmlFor="review" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
          Mark for Review
        </label>
      </div>
    </div>
  );
}

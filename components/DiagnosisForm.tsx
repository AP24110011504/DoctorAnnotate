"use client";

interface DiagnosisFormProps {
  data: {
    disease: string;
    caseType: "Normal" | "Abnormal";
    severity: "Mild" | "Moderate" | "Severe";
    description: string;
    confidence: number;
  };
  onChange: (data: any) => void;
}

export default function DiagnosisForm({ data, onChange }: DiagnosisFormProps) {
  const handleChange = (field: string, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Diagnosis</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Disease Name*
        </label>
        <input
          type="text"
          value={data.disease}
          onChange={(e) => handleChange("disease", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Pneumonia, Tuberculosis"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Case Type*
          </label>
          <select
            value={data.caseType}
            onChange={(e) =>
              handleChange(
                "caseType",
                e.target.value as "Normal" | "Abnormal"
              )
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Normal">Normal</option>
            <option value="Abnormal">Abnormal</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Severity*
          </label>
          <select
            value={data.severity}
            onChange={(e) =>
              handleChange(
                "severity",
                e.target.value as "Mild" | "Moderate" | "Severe"
              )
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Mild">Mild</option>
            <option value="Moderate">Moderate</option>
            <option value="Severe">Severe</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={data.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
          placeholder="Additional clinical notes..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confidence: {data.confidence}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={data.confidence}
          onChange={(e) => handleChange("confidence", parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#D6F0FF]"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}

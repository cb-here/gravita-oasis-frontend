import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { Download } from "lucide-react";

const PreviewTab: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-4 p-4 md:p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        <h1 className="text-gray-900 dark:text-gray-100 text-lg font-semibold">
          Task Summary
        </h1>
        <Badge className="text-sm" color="warning" variant="light">
          Review in Progress
        </Badge>
      </div>

      {/* Top Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex flex-col gap-2">
          {[
            { label: "MRN", value: "14800" },
            { label: "Chart Type", value: "SOC" },
            { label: "Assigned To", value: "Chakradhar" },
          ].map((item) => (
            <div key={item.label} className="flex justify-between text-sm sm:text-base">
              <span className="text-gray-500 dark:text-gray-400">{item.label}</span>
              <span className="text-gray-900 dark:text-gray-100">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex flex-col gap-2">
          {[
            { label: "Patient Name", value: "Byrd Kamau" },
            { label: "Coding Date", value: "7/5/2023" },
            { label: "QA By", value: "Sunitha" },
          ].map((item) => (
            <div key={item.label} className="flex justify-between text-sm sm:text-base">
              <span className="text-gray-500 dark:text-gray-400">{item.label}</span>
              <span className="text-gray-900 dark:text-gray-100">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* QA Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Internal QA */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
          <div className="font-semibold text-xs text-gray-700 dark:text-gray-300 mb-2">
            Internal QA Score
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-full h-5 bg-gray-200 dark:bg-gray-700 rounded-full flex-1">
              <div className="h-5 bg-orange-400 rounded-full" style={{ width: "84%" }}></div>
            </div>
            <span className="px-3 py-1 rounded-[8px] text-xs font-medium bg-orange-500 text-white">
              84%
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { label: "Coding", value: "88%" },
              { label: "OASIS", value: "88%" },
              { label: "POC", value: "94%" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex-1 min-w-[80px] h-12 bg-gray-100 dark:bg-gray-700 flex flex-col items-center justify-center rounded-md"
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{item.label}</div>
                <div className="text-xs text-green-600 dark:text-green-400">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* External QA */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
          <div className="font-semibold text-xs text-gray-700 dark:text-gray-300 mb-2">
            External QA Score
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-full h-5 bg-gray-200 dark:bg-gray-700 rounded-full flex-1">
              <div className="h-5 bg-green-500 rounded-full" style={{ width: "88%" }}></div>
            </div>
            <span className="px-3 py-1 rounded-[8px] text-xs font-medium bg-green-600 text-white">
              88%
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="flex-1 min-w-[120px] h-12 bg-gray-100 dark:bg-gray-700 flex flex-col items-start justify-center px-2 rounded-md">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">External QA Status</div>
              <span className="text-orange-500 dark:text-orange-400 text-sm">Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Summary */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm space-y-4">
        <div className="text-gray-900 dark:text-gray-100 font-semibold text-base">Error Summary</div>

        {["Coding Errors", "OASIS Errors", "POC Errors"].map((section) => (
          <div key={section} className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg space-y-2">
            <div className="font-semibold text-sm text-gray-500 dark:text-gray-400">{section}</div>
            <div className="text-sm text-gray-700 dark:text-gray-100">
              {/* Example content */}
              Example content for {section}.
            </div>
          </div>
        ))}
      </div>

      {/* QA Comments */}
      <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
        <div className="font-semibold text-gray-500 dark:text-gray-300 text-sm mb-2">QA Comments</div>
        <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-200 space-y-1">
          <li>Ensure all secondary diagnoses are coded.</li>
          <li>Better listing of wound types and procedures.</li>
          <li>The wound care worksheet is missing QA section.</li>
          <li>Review the goals section to ensure alignment.</li>
        </ul>
      </div>

      {/* External QA Comments + Download */}
      <div className="flex flex-col gap-2">
        <div className="font-semibold text-gray-500 dark:text-gray-300 text-sm">External QA Comments</div>
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center text-sm text-gray-700 dark:text-gray-200">
          No external QA comments provided
        </div>
        <Button className="self-end flex items-center gap-2 px-3 py-2 rounded-md text-brand-primary text-sm font-semibold mt-2">
          <Download className="w-5 h-5" />
          Download PDF Report
        </Button>
      </div>
    </div>
  );
};

export default PreviewTab;

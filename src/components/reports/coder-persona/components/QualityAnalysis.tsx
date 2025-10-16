import { Award } from "lucide-react";

const ProgressBar = ({ label, value }: { label: string; value: number }) => (
  <div>
    <div className="flex justify-between items-center mb-2 bg-gray-100 dark:bg-gray-700 px-3 py-3 rounded-lg">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>
      <span className="text-sm font-bold text-gray-800 dark:text-white">
        {value}%
      </span>
    </div>
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
      <div
        className="bg-success-600 dark:bg-success-500 h-2 rounded-full"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

const MetricCard = ({ value, label }: { value: string; label: string }) => (
  <div className="text-center">
    <div className="text-2xl font-bold text-purple-900 dark:text-purple-200">
      {value}
    </div>
    <div className="text-xs text-purple-700 dark:text-purple-300 mt-1">
      {label}
    </div>
  </div>
);

export default function QualityAnalysis() {
  const sections = [
    { label: "Coding Section", value: 93.2 },
    { label: "OASIS Section", value: 90.8 },
    { label: "POC Section", value: 90.5 },
  ];

  const metrics = [
    { value: "87.5%", label: "First Pass Rate" },
    { value: "12.5%", label: "Revert Rate" },
    { value: "0.15", label: "Avg Reverts" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
      <div className="flex items-center gap-3 mb-4">
        <Award className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          Quality Analysis by Section
        </h3>
      </div>
      <div className="space-y-4">
        {sections.map((section, index) => (
          <ProgressBar key={index} {...section} />
        ))}
        <div className="grid grid-cols-3 gap-3 mt-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
      </div>
    </div>
  );
}
import { AlertTriangle } from "lucide-react";

const ErrorCard = ({ count, title, points }: { 
  count: number; 
  title: string; 
  points: string; 
}) => (
  <div className="p-5 bg-gradient-to-br from-warning-50 to-warning-100 dark:from-warning-900/30 dark:to-warning-900/30 rounded-xl border border-warning-200 dark:border-warning-700 text-center hover:shadow-lg transition-shadow">
    <div className="text-3xl font-bold text-warning-700 dark:text-warning-300 mb-2">
      {count}
    </div>
    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
      {title}
    </div>
    <div className="text-xs text-gray-600 dark:text-gray-400">
      {points}
    </div>
  </div>
);

export default function CommonErrors() {
  const errors = [
    { count: 8, title: "DX Missing", points: "32 points" },
    { count: 12, title: "M Items", points: "36 points" },
    { count: 7, title: "Process Error", points: "28 points" },
    { count: 6, title: "Goals & Interventions", points: "36 points" },
    { count: 12, title: "Other", points: "24 points" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-colors">
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          Most Common Errors
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {errors.map((error, index) => (
          <ErrorCard key={index} {...error} />
        ))}
      </div>
    </div>
  );
}
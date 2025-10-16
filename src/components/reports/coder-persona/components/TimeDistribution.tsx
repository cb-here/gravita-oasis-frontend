import { Hourglass } from "lucide-react";

export default function TimeDistribution() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
      <div className="flex items-center gap-3 mb-4">
        <Hourglass className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          Time Distribution
        </h3>
      </div>
      <div className="h-72 mt-[80px]">
        <canvas id="timeChart"></canvas>
      </div>
    </div>
  );
}

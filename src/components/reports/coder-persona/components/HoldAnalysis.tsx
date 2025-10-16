import { PauseCircle } from "lucide-react";

const HoldStatCard = ({ 
  count, 
  label, 
  percentage, 
  type 
}: {
  count: number;
  label: string;
  percentage: string;
  type: "valid" | "invalid";
}) => {
  const styles = {
    valid: {
      gradient: "from-green-100 to-emerald-200 dark:from-green-900/40 dark:to-emerald-900/40",
      border: "border-green-500 dark:border-green-600",
      text: "text-green-900 dark:text-green-200",
      subtext: "text-green-800 dark:text-green-300",
      percentage: "text-green-600 dark:text-green-400"
    },
    invalid: {
      gradient: "from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-900/40",
      border: "border-red-500 dark:border-red-600",
      text: "text-red-900 dark:text-red-200",
      subtext: "text-red-800 dark:text-red-300",
      percentage: "text-red-600 dark:text-red-400"
    }
  };

  const style = styles[type];

  return (
    <div className={`p-5 bg-gradient-to-br ${style.gradient} rounded-xl border-2 ${style.border}`}>
      <div className={`text-3xl font-bold ${style.text}`}>
        {count}
      </div>
      <div className={`${style.subtext} font-semibold mt-1`}>
        {label}
      </div>
      <div className={`${style.percentage} text-xs mt-1`}>
        {percentage}
      </div>
    </div>
  );
};

export default function HoldAnalysis() {
  const holdStats = [
    { count: 16, label: "Valid Holds", percentage: "88.9%", type: "valid" as const },
    { count: 2, label: "Invalid Holds", percentage: "11.1%", type: "invalid" as const },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
      <div className="flex items-center gap-3 mb-4">
        <PauseCircle className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          Hold Analysis
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-5">
        {holdStats.map((stat, index) => (
          <HoldStatCard key={index} {...stat} />
        ))}
      </div>
      <div className="h-48">
        <canvas id="holdChart"></canvas>
      </div>
    </div>
  );
}
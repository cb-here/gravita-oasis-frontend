import {
  CheckSquare,
  Star,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendDirection 
}: {
  title: string;
  value: string;
  icon: any;
  trend: string;
  trendDirection: "up" | "down";
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
        {title}
      </span>
      <Icon className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
    </div>
    <div className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
      {value}
    </div>
    <div className={`flex items-center gap-2 ${
      trendDirection === "up" 
        ? "text-green-600 dark:text-green-400" 
        : "text-red-600 dark:text-red-400"
    }`}>
      {trendDirection === "up" ? (
        <TrendingUp className="w-4 h-4" />
      ) : (
        <TrendingDown className="w-4 h-4" />
      )}
      <span className="text-sm font-medium">{trend}</span>
    </div>
  </div>
);

export default function StatsGrid() {
  const stats = [
    {
      title: "Tasks Completed",
      value: "127",
      icon: CheckSquare,
      trend: "12 vs last month",
      trendDirection: "up" as const,
    },
    {
      title: "Quality Score",
      value: "91.5%",
      icon: Star,
      trend: "1.2% vs last month",
      trendDirection: "up" as const,
    },
    {
      title: "Productive Hours",
      value: "156.3h",
      icon: Clock,
      trend: "3.5h vs last month",
      trendDirection: "down" as const,
    },
    {
      title: "Revenue",
      value: "$15,875",
      icon: DollarSign,
      trend: "$1,250 vs last month",
      trendDirection: "up" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
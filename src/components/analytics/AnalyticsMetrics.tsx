import React from "react";
import {
  ClipboardList,
  AlertTriangle,
  TrendingUp,
  Users,
  Calendar,
  Clock,
  CalendarDays,
  AlertCircle,
} from "lucide-react";

const AnalyticsMetrics: React.FC = () => {
  const mainMetricsData = [
    {
      title: "Total Tasks",
      value: "124",
      subValue: "9E",
      icon: ClipboardList,
      iconColor: "text-blue-500 dark:text-blue-400",
    },
    {
      title: "Backlogs",
      value: "16",
      variant: "error" as const,
      icon: AlertTriangle,
      iconColor: "text-red-500 dark:text-red-400",
    },
    {
      title: "Capacity Utilization",
      value: "78%",
      subValue: "+12% from last week",
      variant: "success" as const,
      icon: TrendingUp,
      iconColor: "text-green-500 dark:text-green-400",
    },
    {
      title: "Active Coders",
      value: "12",
      icon: Users,
      iconColor: "text-purple-500 dark:text-purple-400",
    },
  ];

  const timelineMetricsData = [
    {
      title: "0-10 Days",
      value: "32",
      icon: Calendar,
      iconColor: "text-green-500 dark:text-green-400",
    },
    {
      title: "11-14 Days",
      value: "48",
      icon: Clock,
      iconColor: "text-yellow-500 dark:text-yellow-400",
    },
    {
      title: "15-20 Days",
      value: "28",
      icon: CalendarDays,
      iconColor: "text-orange-500 dark:text-orange-400",
    },
    {
      title: "20+ Days",
      value: "16",
      variant: "error" as const,
      icon: AlertCircle,
      iconColor: "text-red-500 dark:text-red-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Row - Main Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mainMetricsData.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.title}
              className={`rounded-2xl border border-gray-200 dark:border-gray-800 p-5 ${
                item.variant === "error"
                  ? "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400"
                  : item.variant === "success"
                  ? "bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400"
                  : "bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-2xl font-bold">{item.value}</h4>
                <IconComponent className={`h-5 w-5 ${item.iconColor}`} />
              </div>
              <p
                className={`text-sm ${
                  item.variant === "error"
                    ? "text-red-600 dark:text-red-400"
                    : item.variant === "success"
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {item.title}
              </p>
              {item.subValue && (
                <p
                  className={`text-xs mt-1 ${
                    item.variant === "success"
                      ? "text-green-500 dark:text-green-400"
                      : "text-gray-500 dark:text-gray-500"
                  }`}
                >
                  {item.subValue}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Row - Timeline Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {timelineMetricsData.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.title}
              className={`rounded-2xl border border-gray-200 dark:border-gray-800 p-5 ${
                item.variant === "error"
                  ? "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400"
                  : "bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-2xl font-bold">{item.value}</h4>
                <IconComponent className={`h-5 w-5 ${item.iconColor}`} />
              </div>
              <p
                className={`text-sm ${
                  item.variant === "error"
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {item.title}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnalyticsMetrics;
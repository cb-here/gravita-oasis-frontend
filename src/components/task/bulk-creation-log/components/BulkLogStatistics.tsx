import {
  TrendingUpIcon,
  TrendingDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  FileTextIcon,
  ClockIcon,
  PlayCircleIcon,
  StopCircleIcon,
} from "lucide-react";

// Status options for processing_status field
const statusOptions = {
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    icon: <CheckCircleIcon className="w-3 h-3 mr-1" />,
  },
  processing: {
    label: "Processing",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    icon: <PlayCircleIcon className="w-3 h-3 mr-1" />,
  },
  pending: {
    label: "Pending",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    icon: <ClockIcon className="w-3 h-3 mr-1" />,
  },
  failed: {
    label: "Failed",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    icon: <XCircleIcon className="w-3 h-3 mr-1" />,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    icon: <StopCircleIcon className="w-3 h-3 mr-1" />,
  },
};

// Sample data with different statuses for demonstration
export const sampleBulkLogData = [
  {
    id: 1,
    total_tasks: 150,
    success_tasks: 145,
    failed_tasks: 5,
    processing_status: "completed",
  },
  {
    id: 2,
    total_tasks: 200,
    success_tasks: 85,
    failed_tasks: 15,
    processing_status: "processing",
  },
  {
    id: 3,
    total_tasks: 80,
    success_tasks: 0,
    failed_tasks: 0,
    processing_status: "pending",
  },
  {
    id: 4,
    total_tasks: 100,
    success_tasks: 0,
    failed_tasks: 100,
    processing_status: "failed",
  },
  {
    id: 5,
    total_tasks: 50,
    success_tasks: 0,
    failed_tasks: 0,
    processing_status: "cancelled",
  },
];

interface BulkLogStatisticsProps {
  data: {
    total_tasks: number;
    success_tasks: number;
    failed_tasks: number;
    processing_status?: string;
  };
  isCompact?: boolean;
  showDetails?: boolean;
}

export default function BulkLogStatistics({
  data,
  isCompact = false,
  showDetails = true,
}: BulkLogStatisticsProps) {
  const successRate =
    data.total_tasks > 0 ? (data.success_tasks / data.total_tasks) * 100 : 0;
  const failureRate =
    data.total_tasks > 0 ? (data.failed_tasks / data.total_tasks) * 100 : 0;
  const currentStatus = data.processing_status || "completed";
  const statusConfig =
    statusOptions[currentStatus as keyof typeof statusOptions];

  if (isCompact) {
    return (
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          icon={<FileTextIcon className="w-4 h-4" />}
          label="Total"
          value={data.total_tasks}
          color="text-gray-700"
          bgColor="bg-gray-50"
          size="sm"
        />
        <StatCard
          icon={<CheckCircleIcon className="w-4 h-4" />}
          label="Success"
          value={data.success_tasks}
          color="text-green-700"
          bgColor="bg-green-50"
          size="sm"
        />
        <StatCard
          icon={<XCircleIcon className="w-4 h-4" />}
          label="Failed"
          value={data.failed_tasks}
          color="text-red-700"
          bgColor="bg-red-50"
          size="sm"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Compact Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 rounded-lg p-3 border border-blue-200/50 dark:border-blue-800/30">
          <div className="flex items-center gap-2 mb-1">
            <FileTextIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Total Tasks
            </span>
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {data.total_tasks.toLocaleString()}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10 rounded-lg p-3 border border-green-200/50 dark:border-green-800/30">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircleIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Success
            </span>
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {data.success_tasks.toLocaleString()}
          </div>
          <div className="text-xs text-green-600 dark:text-green-400 font-medium mt-0.5">
            {successRate.toFixed(1)}%
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/10 rounded-lg p-3 border border-red-200/50 dark:border-red-800/30">
          <div className="flex items-center gap-2 mb-1">
            <XCircleIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Failed
            </span>
          </div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {data.failed_tasks.toLocaleString()}
          </div>
          <div className="text-xs text-red-600 dark:text-red-400 font-medium mt-0.5">
            {failureRate.toFixed(1)}%
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10 rounded-lg p-3 border border-purple-200/50 dark:border-purple-800/30">
          <div className="flex items-center gap-2 mb-1">
            <ClockIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Status
            </span>
          </div>
          {statusConfig && (
            <div
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${statusConfig.color} mt-1`}
            >
              {statusConfig.icon}
              {statusConfig.label}
            </div>
          )}
        </div>
      </div>

      {/* Compact Progress Bar */}
      {showDetails && data.total_tasks > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Processing Results
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {data.total_tasks} total
            </span>
          </div>

          <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
              style={{ width: `${successRate}%` }}
            />
            {data.failed_tasks > 0 && (
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500"
                style={{ width: `${failureRate}%`, left: `${successRate}%` }}
              />
            )}
          </div>

          <div className="flex justify-between items-center mt-2 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-300">
                {data.success_tasks} ({successRate.toFixed(1)}%)
              </span>
            </div>
            {data.failed_tasks > 0 && (
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-300">
                  {data.failed_tasks} ({failureRate.toFixed(1)}%)
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
  darkBgColor?: string;
  subtitle?: string;
  size?: "sm" | "md";
  isStatus?: boolean;
  statusConfig?: {
    label: string;
    color: string;
    icon: React.ReactNode;
  };
}

function StatCard({
  icon,
  label,
  value,
  color,
  bgColor,
  darkBgColor,
  subtitle,
  size = "md",
  isStatus = false,
  statusConfig,
}: StatCardProps) {
  const displayValue =
    isStatus && statusConfig
      ? statusConfig.label
      : typeof value === "number"
      ? value.toLocaleString()
      : value;

  return (
    <div
      className={`${bgColor} ${
        darkBgColor || "dark:bg-gray-800"
      } rounded-xl p-4 shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-0.5`}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className={`${color} p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg`}>{icon}</div>
        <h4
          className={`${
            size === "sm" ? "text-xs" : "text-sm"
          } font-semibold text-gray-700 dark:text-gray-300`}
        >
          {label}
        </h4>
      </div>

      <div
        className={`${
          size === "sm" ? "text-2xl" : "text-3xl"
        } font-bold ${color} mb-1`}
      >
        {displayValue}
      </div>

      {subtitle && (
        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
          {subtitle}
        </p>
      )}

      {isStatus && statusConfig && (
        <div className="mt-3">
          <div
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${statusConfig.color} shadow-sm`}
          >
            {statusConfig.icon}
            {displayValue}
          </div>
        </div>
      )}
    </div>
  );
}

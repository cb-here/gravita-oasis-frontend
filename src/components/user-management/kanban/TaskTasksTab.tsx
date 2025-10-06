import React, { useState, useEffect } from "react";

interface Column {
  name: string;
  icon: string;
  color: string;
  lightColor: string;
}

interface TaskTasksTabProps {
  readOnly?: boolean;
}

type FormData = Record<string, number>;

const columns: Column[] = [
  {
    name: "Nursing",
    icon: "🏥",
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
  },
  {
    name: "All Therapy",
    icon: "🤲",
    color: "bg-purple-500",
    lightColor: "bg-purple-50",
  },
  { name: "PT", icon: "🏃", color: "bg-green-500", lightColor: "bg-green-50" },
  {
    name: "OT",
    icon: "✋",
    color: "bg-orange-500",
    lightColor: "bg-orange-50",
  },
  { name: "ST", icon: "💬", color: "bg-pink-500", lightColor: "bg-pink-50" },
  {
    name: "HHA",
    icon: "🏠",
    color: "bg-indigo-500",
    lightColor: "bg-indigo-50",
  },
  { name: "MSW", icon: "👥", color: "bg-teal-500", lightColor: "bg-teal-50" },
  {
    name: "Orders",
    icon: "📋",
    color: "bg-yellow-500",
    lightColor: "bg-yellow-50",
  },
  { name: "Comm", icon: "💬", color: "bg-cyan-500", lightColor: "bg-cyan-50" },
  { name: "Misc", icon: "⚙️", color: "bg-gray-500", lightColor: "bg-gray-50" },
  {
    name: "Total",
    icon: "📊",
    color: "bg-brand-500",
    lightColor: "bg-brand-50",
  },
];

const initialData: FormData = {
  Nursing: 6,
  AllTherapy: 8,
  PT: 1,
  OT: 0,
  ST: 0,
  HHA: 0,
  MSW: 0,
  Orders: 0,
  Comm: 0,
  Misc: 0,
  Total: 15,
};

const TaskTasksTab: React.FC<TaskTasksTabProps> = ({ readOnly }) => {
  const [form, setForm] = useState<FormData>(initialData);
  const [animatedCounts, setAnimatedCounts] = useState<FormData>({});
  console.log("🚀 ~ TaskTasksTab ~ animatedCounts:", animatedCounts);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedCounts(form);
    }, 300);
    return () => clearTimeout(timer);
  }, [form]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setForm((prev) => ({ ...prev, [key]: value === "" ? 0 : Number(value) }));
  };

  const getTotalTasks = (): number => {
    return Object.entries(form)
      .filter(([key]) => key !== "Total")
      .reduce((sum, [, value]) => sum + Number(value), 0);
  };

  const getProgressPercentage = (value: number): number => {
    const total = getTotalTasks();
    return total > 0 ? (value / total) * 100 : 0;
  };

  return (
    <div className="pt-[20px] pb-2">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <div className="space-y-6">
            {/* Header with stats */}
            <div className="flex items-center justify-between">
              <h2 className="text-[20px] leading-[30px] font-bold text-gray-900 dark:text-white">
                Task Distribution
              </h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-brand-50 dark:bg-brand-900/20 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></div>
                  <span className="text-sm font-medium text-brand-primary dark:text-brand-primary-300">
                    {getTotalTasks()} Total Tasks
                  </span>
                </div>
              </div>
            </div>

            {/* Modern card layout */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 overflow-hidden shadow-lg backdrop-blur-sm">
              {/* Gradient header */}
              <div className="relative bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 px-6 py-6">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 dark:to-black/10"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Task Management
                    </h3>
                    <p className="text-brand-100 dark:text-brand-200 text-sm mt-1">
                      Track and manage task distribution
                    </p>
                  </div>
                  <div className="bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-full p-3">
                    <div className="text-2xl">📋</div>
                  </div>
                </div>
              </div>

              {/* Task items */}
              <div className="divide-y divide-gray-100/50 dark:divide-gray-700/50">
                {columns.map((col) => {
                  const key = col.name.replace(/\s/g, "");
                  const value = form[key as keyof FormData];
                  const isTotal = col.name === "Total";
                  const progress = isTotal
                    ? 100
                    : getProgressPercentage(Number(value));

                  return (
                    <div
                      key={col.name}
                      className={`group relative transition-all duration-300 hover:bg-gradient-to-r hover:from-gray-25 dark:hover:from-gray-700/50 hover:to-transparent hover:shadow-sm ${
                        isTotal
                          ? "bg-gradient-to-r from-brand-25 to-brand-50/30 dark:from-brand-900/30 dark:to-brand-900/50"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between px-6 py-4">
                        {/* Left section - Task info */}
                        <div className="flex items-center space-x-4 flex-1">
                          <div
                            className={`w-10 h-10 rounded-xl ${
                              col.lightColor
                            } dark:${col.lightColor.replace(
                              "bg-",
                              "bg-"
                            )}/20 flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}
                          >
                            <span className="text-lg">{col.icon}</span>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <span
                                className={`font-semibold transition-colors duration-200 ${
                                  isTotal
                                    ? "text-brand-primary text-lg"
                                    : "text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white"
                                }`}
                              >
                                {col.name}
                              </span>

                              {isTotal && (
                                <div className="flex items-center space-x-1">
                                  <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></div>
                                  <span className="text-xs font-medium text-brand-100 uppercase tracking-wide">
                                    Summary
                                  </span>
                                </div>
                              )}
                            </div>

                            {!isTotal && value > 0 && (
                              <div className="mt-1 w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`h-full ${col.color} rounded-full transition-all duration-500 ease-out`}
                                  style={{
                                    width: `${Math.min(progress, 100)}%`,
                                  }}
                                ></div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right section - Input */}
                        <div className="flex items-center space-x-3">
                          {!isTotal && value > 0 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium"></div>
                          )}

                          <div className="relative">
                            <input
                              id={key.toLowerCase()}
                              type="text"
                              className={`w-16 h-10 px-3 rounded-xl border-2 text-center font-bold transition-all duration-200 focus:outline-none focus:scale-105 ${
                                isTotal
                                  ? "border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 focus:border-brand-400 focus:bg-brand-100 dark:focus:bg-brand-900/30"
                                  : "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500 focus:border-brand-400 focus:bg-white dark:focus:bg-gray-600 group-hover:bg-white dark:group-hover:bg-gray-600"
                              }`}
                              value={value}
                              onChange={(e) => handleChange(e, key)}
                              readOnly={isTotal || readOnly}
                            />

                            {isTotal && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-500 rounded-full flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Enhanced footer */}
              <div className="bg-gradient-to-r from-gray-25 dark:from-gray-700/50 to-gray-50 dark:to-gray-800/50 px-6 py-4 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        Live tracking
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      •
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Updated {new Date().toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Active:{" "}
                      <span className="font-semibold text-brand-600 dark:text-brand-400">
                        {Object.values(form).filter((v) => v > 0).length - 1}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-1 h-1 rounded-full bg-brand-400"></div>
                      <div className="w-1 h-1 rounded-full bg-brand-500"></div>
                      <div className="w-1 h-1 rounded-full bg-brand-600"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TaskTasksTab);

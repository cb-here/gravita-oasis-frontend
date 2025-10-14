"use client";

import { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";
import {
  CheckSquare,
  Star,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
  LineChart,
  PieChart,
  Award,
  PauseCircle,
  Hourglass,
  Banknote,
  List,
  AlertTriangle,
  FileText,
  FileSpreadsheet,
  Printer,
} from "lucide-react";
import Button from "@/components/ui/button/Button";
import CommonTable, { HeaderType } from "@/components/common/CommonTable";
import DatePicker from "@/components/form/date-picker";
import Badge from "@/components/ui/badge/Badge";

// Fixed interface definitions
interface TooltipFontConfig {
  size: number;
  weight: "normal" | "bold" | "lighter" | "bolder" | number;
}

interface CommonTooltipConfig {
  backgroundColor: string;
  titleColor: string;
  bodyColor: string;
  borderColor: string;
  borderWidth: number;
  cornerRadius: number;
  displayColors: boolean;
  padding: number;
  titleFont: Partial<TooltipFontConfig>;
  bodyFont: Partial<TooltipFontConfig>;
  callbacks: {
    title: (context: any[]) => string;
    label: (context: any) => string;
  };
}

export default function CoderPersona() {
  const [, setStartDate] = useState("2025-10-01");
  const [, setEndDate] = useState("2025-10-13");
  
  // Refs to store chart instances
  const chartRefs = useRef<{
    productivity?: Chart;
    taskDistribution?: Chart;
    hold?: Chart;
    time?: Chart;
    revenue?: Chart;
  }>({});

  useEffect(() => {
    const currentTimeElement = document.getElementById("currentTime");
    if (currentTimeElement) {
      currentTimeElement.textContent = new Date().toLocaleString();
    }

    // Set global font family for charts
    Chart.defaults.font.family = "Outfit, sans-serif";

    // Chart colors
    const colors = {
      primary: "#667eea",
      success: "#10b981",
      warning: "#f59e0b",
      danger: "#ef4444",
      info: "#3b82f6",
      gray: "#6b7280",
    };

    // Common tooltip configuration for all charts
    const commonTooltipConfig: CommonTooltipConfig = {
      backgroundColor: "rgba(25, 25, 50, 0.95)",
      titleColor: "#ffffff",
      bodyColor: "#e5e7eb",
      borderColor: "rgba(99, 102, 241, 0.5)",
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: false,
      padding: 12,
      titleFont: {
        size: 14,
        weight: "bold",
      },
      bodyFont: {
        size: 13,
        weight: "normal",
      },
      callbacks: {
        title: function (context: any[]) {
          return context[0].label;
        },
        label: function (context: any) {
          let label = context.dataset.label || "";
          if (label) {
            label += ": ";
          }
          if (context.parsed !== null) {
            label += context.parsed.y?.toLocaleString() || context.parsed.toLocaleString();
          }
          return label;
        },
      },
    };

    // Destroy existing charts before creating new ones
    Object.values(chartRefs.current).forEach(chart => {
      if (chart) {
        chart.destroy();
      }
    });

    // Productivity Chart
    const productivityCtx = document.getElementById("productivityChart") as HTMLCanvasElement;
    if (productivityCtx) {
      chartRefs.current.productivity = new Chart(productivityCtx.getContext("2d")!, {
        type: "line",
        data: {
          labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
          datasets: [
            {
              label: "Tasks Completed",
              data: [98, 105, 112, 118, 115, 115, 127],
              borderColor: colors.info,
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              tension: 0.4,
              fill: true,
              yAxisID: "y",
            },
            {
              label: "Quality Score (%)",
              data: [88.5, 89.2, 90.1, 90.8, 90.2, 90.3, 91.5],
              borderColor: colors.success,
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              tension: 0.4,
              fill: true,
              yAxisID: "y1",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: "index" as const,
            intersect: false,
          },
          plugins: {
            legend: {
              position: "bottom" as const,
              labels: {
                padding: 15,
                usePointStyle: true,
              },
            },
            tooltip: {
              ...commonTooltipConfig,
              mode: "index" as const,
              intersect: false,
              callbacks: {
                ...commonTooltipConfig.callbacks,
                afterLabel: function (context: any) {
                  if (context.datasetIndex === 1) {
                    return "(%)";
                  }
                  return "";
                },
              },
            },
          },
          scales: {
            y: {
              type: "linear" as const,
              display: true,
              position: "left" as const,
              title: {
                display: true,
                text: "Tasks",
              },
            },
            y1: {
              type: "linear" as const,
              display: true,
              position: "right" as const,
              title: {
                display: true,
                text: "Quality Score (%)",
              },
              grid: {
                drawOnChartArea: false,
              },
              min: 85,
              max: 100,
            },
          },
        },
      });
    }

    // Task Distribution Chart
    const taskDistCtx = document.getElementById("taskDistributionChart") as HTMLCanvasElement;
    if (taskDistCtx) {
      chartRefs.current.taskDistribution = new Chart(taskDistCtx.getContext("2d")!, {
        type: "doughnut",
        data: {
          labels: ["SOC", "ROC", "RECERT", "Assessment"],
          datasets: [
            {
              data: [45, 38, 32, 12],
              backgroundColor: [
                colors.info,
                colors.success,
                colors.warning,
                colors.danger,
              ],
              borderWidth: 3,
              borderColor: "#fff",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom" as const,
              labels: {
                padding: 15,
                usePointStyle: true,
              },
            },
            tooltip: {
              ...commonTooltipConfig,
              callbacks: {
                ...commonTooltipConfig.callbacks,
                label: function (context: any) {
                  const total = (context.dataset.data as number[]).reduce(
                    (a, b) => a + b,
                    0
                  );
                  const percentage = ((context.parsed / total) * 100).toFixed(1);
                  return `${context.label}: ${context.parsed} (${percentage}%)`;
                },
              },
            },
          },
        },
      });
    }

    // Hold Chart
    const holdCtx = document.getElementById("holdChart") as HTMLCanvasElement;
    if (holdCtx) {
      chartRefs.current.hold = new Chart(holdCtx.getContext("2d")!, {
        type: "bar",
        data: {
          labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
          datasets: [
            {
              label: "Valid Holds",
              data: [18, 17, 17, 16, 17, 18, 16],
              backgroundColor: colors.success,
              borderRadius: 6,
            },
            {
              label: "Invalid Holds",
              data: [4, 3, 2, 2, 2, 2, 2],
              backgroundColor: colors.danger,
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true,
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              position: "bottom" as const,
              labels: {
                padding: 15,
                usePointStyle: true,
              },
            },
            tooltip: {
              ...commonTooltipConfig,
              mode: "index" as const,
              intersect: false,
            },
          },
        },
      });
    }

    // Time Distribution Chart - Using Doughnut like Task Distribution
    const timeCtx = document.getElementById("timeChart") as HTMLCanvasElement;
    if (timeCtx) {
      chartRefs.current.time = new Chart(timeCtx.getContext("2d")!, {
        type: "doughnut",
        data: {
          labels: ["Coding", "OASIS", "POC", "Hold Time"],
          datasets: [
            {
              data: [62.5, 46.9, 31.3, 15.6],
              backgroundColor: [
                colors.info,
                colors.success,
                colors.warning,
                colors.gray,
              ],
              borderWidth: 3,
              borderColor: "#fff",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom" as const,
              labels: {
                padding: 15,
                usePointStyle: true,
              },
            },
            tooltip: {
              ...commonTooltipConfig,
              callbacks: {
                ...commonTooltipConfig.callbacks,
                label: function (context: any) {
                  const total = (context.dataset.data as number[]).reduce(
                    (a, b) => a + b,
                    0
                  );
                  const percentage = ((context.parsed / total) * 100).toFixed(1);
                  return `${context.label}: ${context.parsed}h (${percentage}%)`;
                },
              },
            },
          },
        },
      });
    }

    // Revenue Chart
    const revenueCtx = document.getElementById("revenueChart") as HTMLCanvasElement;
    if (revenueCtx) {
      chartRefs.current.revenue = new Chart(revenueCtx.getContext("2d")!, {
        type: "bar",
        data: {
          labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
          datasets: [
            {
              label: "Revenue ($)",
              data: [12250, 13125, 14000, 14750, 14375, 14625, 15875],
              backgroundColor: "#465FFF",
              borderRadius: 8,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              ...commonTooltipConfig,
              callbacks: {
                ...commonTooltipConfig.callbacks,
                label: function (context: any) {
                  return `Revenue: $${context.parsed.y.toLocaleString()}`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return "$" + value.toLocaleString();
                },
              },
            },
          },
        },
      });
    }

    // Cleanup function
    return () => {
      Object.values(chartRefs.current).forEach(chart => {
        if (chart) {
          chart.destroy();
        }
      });
      chartRefs.current = {};
    };
  }, []); // Empty dependency array means this runs once on mount

  // Rest of your component code remains the same...
  type HoldReasonData = {
    holdReason: string;
    total: number;
    valid: number;
    avgResolution: number;
    validityPercent: number;
  };

  const holdReasonsData: HoldReasonData[] = [
    {
      holdReason: "Need Clinical Follow-up",
      total: 7,
      valid: 7,
      avgResolution: 18.5,
      validityPercent: 100,
    },
    {
      holdReason: "Missing Documentation",
      total: 5,
      valid: 5,
      avgResolution: 12.3,
      validityPercent: 100,
    },
    {
      holdReason: "Need NOC",
      total: 4,
      valid: 3,
      avgResolution: 24.2,
      validityPercent: 75,
    },
    {
      holdReason: "Other",
      total: 2,
      valid: 1,
      avgResolution: 8.5,
      validityPercent: 50,
    },
  ];

  const holdReasonsHeaders: HeaderType<HoldReasonData>[] = [
    {
      label: "Hold Reason",
      render: (item) => item.holdReason,
      width: 250,
    },
    {
      label: "Total",
      render: (item) => item.total,
      width: 120,
    },
    {
      label: "Valid",
      render: (item) => (
        <span className="font-bold text-green-600 dark:text-green-400">
          {item.valid}
        </span>
      ),
      width: 120,
    },
    {
      label: "Avg Resolution (hrs)",
      render: (item) => item.avgResolution,
      width: 180,
    },
    {
      label: "Validity %",
      render: (item) => {
        const color =
          item.validityPercent === 100
            ? "success"
            : item.validityPercent >= 75
            ? "warning"
            : "error";
        return (
          <Badge color={color} size="sm">
            {item.validityPercent}%
          </Badge>
        );
      },
      width: 150,
    },
  ];


  return (
    <div className="p-6  min-h-screen transition-colors">
      {/* Header Section */}
      <div className="flex flex-col gap-6 mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-6">
            <img
              src="https://i.pravatar.cc/150?img=47"
              alt="User Avatar"
              className="w-24 h-24 rounded-full border-4 border-indigo-200 dark:border-indigo-600 shadow-md"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
                Sarah Mitchell
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                Senior Medical Coder
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Cardiology Coding Team • ID: MC-2023-047
              </p>
              <p className="mt-2">
                <Badge className="inline-flex items-center " color="success">
                  Active
                </Badge>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-full max-w-md">
              <DatePicker
                id="dateRange"
                mode="range"
                placeholder="Select date range..."
                onChange={(selectedDates: Date[]) => {
                  if (selectedDates.length === 2) {
                    setStartDate(selectedDates[0].toISOString().split("T")[0]);
                    setEndDate(selectedDates[1].toISOString().split("T")[0]);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
              Tasks Completed
            </span>
            <CheckSquare className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
          </div>
          <div className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            127
          </div>
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">12 vs last month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
              Quality Score
            </span>
            <Star className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
          </div>
          <div className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            91.5%
          </div>
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">1.2% vs last month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
              Productive Hours
            </span>
            <Clock className="w-6 h-6 text-blue-500 dark:text-blue-400" />
          </div>
          <div className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            156.3h
          </div>
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <TrendingDown className="w-4 h-4" />
            <span className="text-sm font-medium">3.5h vs last month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
              Revenue
            </span>
            <DollarSign className="w-6 h-6 text-green-500 dark:text-green-400" />
          </div>
          <div className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            $15,875
          </div>
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">$1,250 vs last month</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Productivity Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <LineChart className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Productivity & Quality Trend
            </h3>
          </div>
          <div className="h-64">
            <canvas id="productivityChart"></canvas>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <PieChart className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Task Type Distribution
            </h3>
          </div>
          <div className="h-64">
            <canvas id="taskDistributionChart"></canvas>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Quality Analysis by Section
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2 bg-gray-100 dark:bg-gray-700 px-3 py-3 rounded-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Coding Section
                </span>
                <span className="text-sm font-bold text-gray-800 dark:text-white">
                  93.2%
                </span>
              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-success-600 dark:bg-success-500 h-2 rounded-full"
                  style={{ width: "93.2%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 bg-gray-100 dark:bg-gray-700 px-3 py-3 rounded-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  OASIS Section
                </span>
                <span className="text-sm font-bold text-gray-800 dark:text-white">
                  90.8%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-success-600 dark:bg-success-500 h-2 rounded-full"
                  style={{ width: "90.8%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 bg-gray-100 dark:bg-gray-700 px-3 py-3 rounded-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  POC Section
                </span>
                <span className="text-sm font-bold text-gray-800 dark:text-white">
                  90.5%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-success-600 dark:bg-success-500 h-2 rounded-full"
                  style={{ width: "90.5%" }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-200">
                  87.5%
                </div>
                <div className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                  First Pass Rate
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-200">
                  12.5%
                </div>
                <div className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                  Revert Rate
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-200">
                  0.15
                </div>
                <div className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                  Avg Reverts
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hold Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <PauseCircle className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Hold Analysis
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="p-5 bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/40 dark:to-emerald-900/40 rounded-xl border-2 border-green-500 dark:border-green-600">
              <div className="text-3xl font-bold text-green-900 dark:text-green-200">
                16
              </div>
              <div className="text-green-800 dark:text-green-300 font-semibold mt-1">
                Valid Holds
              </div>
              <div className="text-green-600 dark:text-green-400 text-xs mt-1">
                88.9%
              </div>
            </div>
            <div className="p-5 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-900/40 rounded-xl border-2 border-red-500 dark:border-red-600">
              <div className="text-3xl font-bold text-red-900 dark:text-red-200">
                2
              </div>
              <div className="text-red-800 dark:text-red-300 font-semibold mt-1">
                Invalid Holds
              </div>
              <div className="text-red-600 dark:text-red-400 text-xs mt-1">
                11.1%
              </div>
            </div>
          </div>
          <div className="h-48">
            <canvas id="holdChart"></canvas>
          </div>
        </div>

        {/* Time Distribution - Now using Doughnut chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <Hourglass className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Time Distribution
            </h3>
          </div>
          <div className="h-48 mb-4">
            <canvas id="timeChart"></canvas>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 px-3 py-3 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Coding
              </span>
              <span className="text-sm font-semibold text-gray-800 dark:text-white">
                62.5h (40%)
              </span>
            </div>
            <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 px-3 py-3 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                OASIS
              </span>
              <span className="text-sm font-semibold text-gray-800 dark:text-white">
                46.9h (30%)
              </span>
            </div>
            <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 px-3 py-3 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                POC
              </span>
              <span className="text-sm font-semibold text-gray-800 dark:text-white">
                31.3h (20%)
              </span>
            </div>
            <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 px-3 py-3 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Hold Time
              </span>
              <span className="text-sm font-semibold text-gray-800 dark:text-white">
                15.6h (10%)
              </span>
            </div>
          </div>
        </div>

        {/* Revenue Contribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <Banknote className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Revenue Contribution
            </h3>
          </div>
          <div className="h-[300px] mb-4">
            <canvas id="revenueChart"></canvas>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-900/30 rounded-lg">
              <div className="text-sm text-purple-600 dark:text-purple-300 mb-1">
                Avg per Task
              </div>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-200">
                $125
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg">
              <div className="text-sm text-green-600 dark:text-green-300 mb-1">
                Quality Bonus
              </div>
              <div className="text-2xl font-bold text-green-900 dark:text-green-200">
                $1,250
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors mb-8 p-2 ">
        <div className="py-4 border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <List className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Hold Reasons Breakdown
            </h3>
          </div>
        </div>
        <CommonTable
          headers={holdReasonsHeaders}
          data={holdReasonsData}
          className={"mb-6"}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-colors">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            Most Common Errors
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { count: 8, title: "DX Missing", points: "32 points" },
            { count: 12, title: "M Items", points: "36 points" },
            { count: 7, title: "Process Error", points: "28 points" },
            { count: 6, title: "Goals & Interventions", points: "36 points" },
            { count: 12, title: "Other", points: "24 points" },
          ].map((item, i) => (
            <div
              key={i}
              className="p-5 bg-gradient-to-br from-warning-50 to-warning-100 dark:from-warning-900/30 dark:to-warning-900/30 
        rounded-xl border border-warning-200 dark:border-warning-700 text-center 
        hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl font-bold text-warning-700 dark:text-warning-300 mb-2">
                {item.count}
              </div>
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {item.title}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {item.points}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col sm:flex-row justify-between items-center gap-4 transition-colors">
        <div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Last updated:{" "}
            <span
              id="currentTime"
              className="font-semibold text-gray-700 dark:text-gray-200"
            ></span>
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
            Generated by Task Management System
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button className=" flex items-center" variant="outline">
            <FileText className="w-4 h-4" />
            Export PDF
          </Button>
          <Button variant="primary">
            <FileSpreadsheet className="w-4 h-4" />
            Export Excel
          </Button>
          <Button
            onClick={() => {
              window.print();
            }}
          >
            <Printer className="w-4 h-4" />
            Print Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
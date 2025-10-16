"use client";

import { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";
import { Sun, Calendar, BarChart3, PieChart } from "lucide-react";

import HeaderSection from "./components/HeaderSection";
import StatsGrid from "./components/StatsGrid";
import ProductivityChart from "./components/ProductivityChart";
import QualityAnalysis from "./components/QualityAnalysis";
import HoldAnalysis from "./components/HoldAnalysis";
import TimeDistribution from "./components/TimeDistribution";
import RevenueContribution from "./components/RevunueContribution";
import HoldReasonsTable from "./components/HoldReasonTable";
import CommonErrors from "./components/CommonErrors";
import FooterSection from "./components/FooterSection";

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
  const [activeTab, setActiveTab] = useState("daily");

  const chartRefs = useRef<{
    taskDistribution?: Chart;
    hold?: Chart;
    time?: Chart;
    revenue?: Chart;
  }>({});

  // Data for different time periods
  const productivityData = {
    daily: {
      labels: Array.from({ length: 20 }, (_, i) => `Oct ${i + 1}`),
      tasks: Array.from(
        { length: 20 },
        () => Math.floor(Math.random() * 10) + 5
      ),
      quality: Array.from({ length: 20 }, () => 85 + Math.random() * 15),
    },
    weekly: {
      labels: Array.from({ length: 10 }, (_, i) => `Week ${i + 1}`),
      tasks: Array.from(
        { length: 10 },
        () => Math.floor(Math.random() * 30) + 20
      ),
      quality: Array.from({ length: 10 }, () => 85 + Math.random() * 15),
    },
    monthly: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      tasks: [98, 105, 112, 118, 115, 115, 127, 125, 130, 135, 128, 140],
      quality: [
        88.5, 89.2, 90.1, 90.8, 90.2, 90.3, 91.5, 91.8, 92.1, 92.5, 91.9, 93.2,
      ],
    },
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

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
            label +=
              context.parsed.y?.toLocaleString() ||
              context.parsed.toLocaleString();
          }
          return label;
        },
      },
    };

    // Destroy existing charts before creating new ones
    Object.values(chartRefs.current).forEach((chart) => {
      if (chart) {
        chart.destroy();
      }
    });

    // Task Distribution Chart
    const taskDistCtx = document.getElementById(
      "taskDistributionChart"
    ) as HTMLCanvasElement;
    if (taskDistCtx) {
      chartRefs.current.taskDistribution = new Chart(
        taskDistCtx.getContext("2d")!,
        {
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
            cutout: "55%",
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
                    const percentage = ((context.parsed / total) * 100).toFixed(
                      1
                    );
                    return `${context.label}: ${context.parsed} (${percentage}%)`;
                  },
                },
              },
            },
          },
        }
      );
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

    // Time Distribution Chart
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
          cutout: "55%",
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
                  const percentage = ((context.parsed / total) * 100).toFixed(
                    1
                  );
                  return `${context.label}: ${context.parsed}h (${percentage}%)`;
                },
              },
            },
          },
        },
      });
    }

    // Revenue Chart
    const revenueCtx = document.getElementById(
      "revenueChart"
    ) as HTMLCanvasElement;
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
      Object.values(chartRefs.current).forEach((chart) => {
        if (chart) {
          chart.destroy();
        }
      });
      chartRefs.current = {};
    };
  }, []);

  const tabGroups = [
    { name: "Daily", icon: Sun, key: "daily" },
    { name: "Weekly", icon: Calendar, key: "weekly" },
    { name: "Monthly", icon: BarChart3, key: "monthly" },
  ];

  return (
    <div>
      <HeaderSection setStartDate={setStartDate} setEndDate={setEndDate} />

      <StatsGrid />

      <div className="grid grid-cols-1 gap-6 mb-8">
        <ProductivityChart
          activeTab={activeTab}
          tabGroups={tabGroups}
          onTabChange={handleTabChange}
          productivityData={productivityData}
        />

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <PieChart className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Task Type Distribution
            </h3>
          </div>
          <div className="h-72">
            <canvas id="taskDistributionChart"></canvas>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <QualityAnalysis />
        <HoldAnalysis />
        <TimeDistribution />
        <RevenueContribution />
      </div>

      <HoldReasonsTable />
      <CommonErrors />
      <FooterSection />
    </div>
  );
}

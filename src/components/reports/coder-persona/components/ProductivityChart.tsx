"use client";

import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { LineChart } from "lucide-react";
import Tabs from "@/components/common/tabs/Tabs";
import ReactDatePicker from "@/components/common/DateRangePicker";

interface ProductivityChartProps {
  activeTab: string;
  tabGroups: any[];
  onTabChange: (tab: string) => void;
  productivityData: any;
}

export default function ProductivityChart({
  activeTab,
  tabGroups,
  onTabChange,
  productivityData,
}: ProductivityChartProps) {
  const chartRef = useRef<Chart | null>(null);
  const [formData, setFormData] = useState({
    dateStart: "2025-10-01",
    dateEnd: "2025-10-13",
  });

  useEffect(() => {
    const updateChart = () => {
      const currentData =
        productivityData[activeTab as keyof typeof productivityData];
      const ctx = document.getElementById(
        "productivityChart"
      ) as HTMLCanvasElement;

      if (!ctx) return;

      // Destroy existing chart
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      // Create new chart
      chartRef.current = new Chart(ctx.getContext("2d")!, {
        type: "line",
        data: {
          labels: currentData.labels,
          datasets: [
            {
              label: "Tasks Completed",
              data: currentData.tasks,
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              tension: 0.4,
              fill: true,
              yAxisID: "y",
            },
            {
              label: "Quality Score (%)",
              data: currentData.quality,
              borderColor: "#10b981",
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
          interaction: { mode: "index", intersect: false },
          plugins: {
            legend: {
              position: "bottom",
              labels: { padding: 15, usePointStyle: true },
            },
          },
          scales: {
            y: {
              type: "linear",
              display: true,
              position: "left",
              title: { display: true, text: "Tasks" },
            },
            y1: {
              type: "linear",
              display: true,
              position: "right",
              title: { display: true, text: "Quality Score (%)" },
              grid: { drawOnChartArea: false },
              min: 85,
              max: 100,
            },
          },
        },
      });
    };

    updateChart();

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [activeTab, productivityData]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
      <div className="flex items-center gap-3 mb-4 justify-between flex-col md:flex-row">
        <div className="flex items-center gap-3">
          <LineChart className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            Productivity & Quality Trend
          </h3>
        </div>
        <div className="flex items-center gap-4">
          <Tabs
            tabGroups={tabGroups}
            selectedTabGroup={activeTab}
            setSelectedTabGroup={onTabChange}
          />
          {activeTab === "daily" && (
            <div className="w-64">
              <ReactDatePicker
                formData={formData}
                setFormData={setFormData}
                isFilter={true}
                max={20}
              />
            </div>
          )}
        </div>
      </div>
      <div className="h-80">
        <canvas id="productivityChart"></canvas>
      </div>
    </div>
  );
}

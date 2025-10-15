import { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface LineChartComponentProps {
  data: any[];
  teams: any[];
  title: string;
}

const COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#06b6d4",
  "#6366f1",
];

export const LineChartComponent = ({
  data,
  teams,
  title,
}: LineChartComponentProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use displayDate for x-axis labels
  const categories = data.map(d => d.displayDate || d.date);

  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    colors: COLORS,
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      fontSize: "14px",
    },
    markers: {
      size: 0,
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          fontSize: "12px",
        },
        rotate: data.length > 10 ? -45 : 0,
      },
    },
    yaxis: {
      labels: {
        formatter: (value: number) => `$${(value / 1000).toFixed(0)}k`,
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) => `$${value.toLocaleString()}`,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
  };

  const series = teams.map((team) => ({
    name: team,
    data: data.map((d) => d[team] || 0),
  }));

  if (!isMounted) {
    return <div className="h-[350px] bg-muted animate-pulse rounded-lg" />;
  }

  return (
    <div className="rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-800">
      <h2 className="font-semibold text-heading mb-4">{title}</h2>
      <div className="max-w-full overflow-x-auto no-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <ReactApexChart
            options={options}
            series={series}
            type="line"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};
import { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";

import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface PieChartComponentProps {
  data: any[];
  title: string;
  labelKey: string;
  valueKey: string;
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

export const PieChartComponent = ({
  data,
  title,
  labelKey,
  valueKey,
}: PieChartComponentProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const options: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "inherit",
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    labels: data.map((d) => d[labelKey]),
    colors: COLORS,
    legend: {
      position: "bottom",
      fontSize: "14px",
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`,
      style: {
        fontSize: "14px",
        fontWeight: 600,
      },
      dropShadow: {
        enabled: false,
      },
    },
    tooltip: {
      y: {
        formatter: (value) => {
          return `$${value.toLocaleString()} (${(
            (value / data.reduce((sum, d) => sum + d[valueKey], 0)) *
            100
          ).toFixed(1)}%)`;
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "16px",
              fontWeight: 600,
            },
            value: {
              show: true,
              fontSize: "24px",
              fontWeight: 700,
              formatter: (val) => `$${(Number(val) / 1000).toFixed(0)}k`,
            },
            total: {
              show: true,
              label: "Total Revenue",
              fontSize: "14px",
              fontWeight: 600,
              formatter: (w) => {
                const total = w.globals.seriesTotals.reduce(
                  (a: number, b: number) => a + b,
                  0
                );
                return `$${(total / 1000).toFixed(0)}k`;
              },
            },
          },
        },
      },
    },
    states: {
      hover: {
        filter: {
          type: "lighten",
        },
      },
      active: {
        filter: {
          type: "none",
        },
      },
    },
  };

  const series = data.map((d) => d[valueKey]);

  if (!isMounted) {
    return <div className="h-[350px] bg-muted animate-pulse rounded-lg" />;
  }

  return (
    <div className="rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-800">
      <h2 className="text-heading font-semibold mb-4">{title}</h2>
      <ReactApexChart
        options={options}
        series={series}
        type="donut"
        height={350}
      />
    </div>
  );
};

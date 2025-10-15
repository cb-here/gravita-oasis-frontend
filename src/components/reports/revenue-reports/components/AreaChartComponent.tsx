"use client";
import React from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface AreaChartComponentProps {
  data: Array<{
    date: string;
    revenue: number;
    projected: number;
    displayDate?: string;
  }>;
  title: string;
}

export const AreaChartComponent = ({
  data,
  title,
}: AreaChartComponentProps) => {
  // Use displayDate for x-axis labels
  const categories = data.map(d => d.displayDate || d.date);

  const series = [
    {
      name: "Actual Revenue",
      data: data.map((item) => item.revenue),
    },
    {
      name: "Projected Revenue",
      data: data.map((item) => item.projected),
    },
  ];

  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
    },
    colors: ["#465FFF", "#10B981"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 335,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "straight",
      width: [1, 1],
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    xaxis: {
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          fontSize: "12px",
        },
        rotate: data.length > 10 ? -45 : 0,
      },
    },
    yaxis: {
      labels: {
        formatter: function (value: number) {
          return `$${value / 1000}k`;
        },
      },
    },
    tooltip: {
      y: {
        formatter: function (value: number) {
          return `$${value?.toLocaleString()}`;
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
  };

  return (
    <div className="rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-800">
      <h2 className="text-heading mb-4">{title}</h2>
      <div className="max-w-full overflow-x-auto no-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={335}
          />
        </div>
      </div>
    </div>
  );
};
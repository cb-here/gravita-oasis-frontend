"use client";

import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

import { ApexOptions } from "apexcharts";

export default function StatusDistribution() {
  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 300,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        distributed: true,
        borderRadius: 6,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 1,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Unassigned",
        "Coding",
        "Under QA",
        "Hold",
        "Rehold",
        "Submission",
        "Backlogs",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "Outfit",
          colors: "#6b7280",
        },
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: { text: undefined },
    },
    grid: {
      padding: { left: 10, right: 10 },
      yaxis: { lines: { show: true } },
    },
    fill: { opacity: 1 },
    tooltip: {
      x: { show: false },
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  };

  const series = [
    {
      name: "Tasks",
      data: [168, 385, 201, 298, 187, 195, 160],
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6 w-full">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Task Distribution by Status
        </h3>
      </div>
      <div className="w-full" id="chartDarkStyle">
        <ReactApexChart
          className="w-full"
          options={options}
          series={series}
          type="bar"
          height={300}
        />
      </div>
    </div>
  );
}

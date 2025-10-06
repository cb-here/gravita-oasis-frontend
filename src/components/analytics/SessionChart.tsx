"use client";
import React from "react";
import { ApexOptions } from "apexcharts";

import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function SessionChart() {
  const options: ApexOptions = {
    colors: ["#3641f5", "#7592ff", "#dde9ff", "#1b2cc1"],
    labels: ["Medium", "Low", "High", "Critical"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "donut",
      width: 445,
      height: 290,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          background: "transparent",
          labels: {
            show: true,
            value: {
              show: true,
              offsetY: 0,
            },
          },
        },
      },
    },
    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "darken",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: false,
    },
    stroke: {
      show: false,
      width: 4, // Creates a gap between the series
    },

    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      fontFamily: "Outfit",
      fontSize: "14px",
      fontWeight: 400,
      markers: {
        size: 4,
        shape: "circle",
        strokeWidth: 0,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 0,
      },
      labels: {
        useSeriesColors: true, // Optional: this makes each label color match the corresponding segment color
      },
    },

    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 370,
            height: 290,
          },
        },
      },
    ],
  };
  const series = [45, 65, 25, 56];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex items-center justify-between mb-9">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Task Distribution by Status
        </h3>
      </div>
      <div>
        <div className="flex justify-center mx-auto" id="chartDarkStyle">
          <ReactApexChart
            options={options}
            series={series}
            type="donut"
            height={290}
          />
        </div>
      </div>
    </div>
  );
}

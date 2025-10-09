"use client";
import React, { useMemo } from "react";
import { ApexOptions } from "apexcharts";

import dynamic from "next/dynamic";
import { ChartBarBigIcon } from "lucide-react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type CategoryDistributionProps = {
  data: Array<{
    id: number;
    person: string;
    team: string;
    category: string;
    date: string;
    count: number;
  }>;
};

export default function CategoryDistribution({
  data,
}: CategoryDistributionProps) {
  const { categoryData, categoryPercentages } = useMemo(() => {
    const aggregated: Record<string, number> = {};

    data.forEach((item) => {
      if (!aggregated[item.category]) {
        aggregated[item.category] = 0;
      }
      aggregated[item.category] += item.count;
    });

    const total = Object.values(aggregated).reduce((sum, val) => sum + val, 0);
    const percentages: Record<string, number> = {};

    Object.entries(aggregated).forEach(([category, count]) => {
      percentages[category] = total > 0 ? (count / total) * 100 : 0;
    });

    return {
      categoryData: aggregated,
      categoryPercentages: percentages,
      totalCount: total,
    };
  }, [data]);

  const categories = Object.keys(categoryData);
  const values = Object.values(categoryPercentages);

  const numCategories = categories.length;
  const spacePerCategory = 50;
  const chartWidth = Math.max(numCategories * spacePerCategory, 800);

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 500,
      width: chartWidth,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadius: 5,
        borderRadiusApplication: "end",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
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
        rotate: -45,
        rotateAlways: categories.length > 10,
        style: {
          fontSize: "11px",
        },
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },

    tooltip: {
      x: {
        show: true,
      },
      y: {
        formatter: (val: number, opts: any) => {
          const categoryName = categories[opts.dataPointIndex];
          const count = categoryData[categoryName];
          return `${val.toFixed(2)}% (Count: ${count})`;
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => `${val.toFixed(1)}%`,
      },
    },
  };

  const series = [
    {
      // name: "Percentage",
      data: values,
    },
  ];
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <ChartBarBigIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            Overall Category Distribution
          </h2>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 pl-2">
          {" "}
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
}

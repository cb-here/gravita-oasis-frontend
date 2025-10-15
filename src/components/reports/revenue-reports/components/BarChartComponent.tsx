import { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";

import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface BarChartComponentProps {
  data: any[];
  title: string;
  dataKey: string;
  categoryKey: string;
  horizontal?: boolean;
}

export const BarChartComponent = ({
  data,
  title,
  categoryKey,
  horizontal = false,
}: BarChartComponentProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 400,
      toolbar: {
        show: false,
      },
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
      fontFamily: "inherit",
    },
    plotOptions: {
      bar: {
        horizontal: horizontal,
        borderRadius: 12,
        borderRadiusApplication: "end",
        columnWidth: "50%",
        barHeight: "80%",
        dataLabels: {
          position: "top",
        },
      },
    },
    colors: ["#0ba5ec", "#3641f5"],
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      fontSize: "14px",
    },
    xaxis: {
      categories: data.map((d) => d[categoryKey]),
      labels: {
        formatter: horizontal
          ? (value) => `$${(Number(value) / 1000).toFixed(0)}k`
          : undefined,
        style: {
          fontSize: "12px",
        },
        rotate: -45,
        rotateAlways: false,
      },
    },
    yaxis: {
      labels: {
        formatter: !horizontal
          ? (value) => `$${(value / 1000).toFixed(0)}k`
          : undefined,
        style: {
          fontSize: "12px",
        },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => `$${value.toLocaleString()}`,
      },
    },
    grid: {
      borderColor: "#e2e8f0",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: !horizontal,
        },
      },
      yaxis: {
        lines: {
          show: horizontal,
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
          type: "darken",
        },
      },
    },
  };

  const series = [
    {
      name: "Actual Revenue",
      data: data.map((d) => d.revenue || 0),
    },
    {
      name: "Projected Revenue",
      data: data.map((d) => d.projected || d.projectedRevenue || 0),
    },
  ];

  if (!isMounted) {
    return <div className="h-[400px] bg-muted animate-pulse rounded-lg" />;
  }

  return (
    <div className="rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-800">
      <h2 className="text-heading font-semibold mb-4">{title}</h2>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={400}
      />
    </div>
  );
};

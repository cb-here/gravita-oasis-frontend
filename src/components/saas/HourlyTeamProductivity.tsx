"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import React, { useState, useCallback } from "react";
import SearchableSelect from "../form/SearchableSelect";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

// Sample data structure - replace with your actual data source
const productivityData: any = {
  "Team 1": {
    aggregate: [44, 55, 41, 67, 22, 43, 55, 41],
    users: {
      "User A": [10, 12, 9, 15, 5, 10, 12, 11],
      "User B": [8, 10, 11, 12, 6, 9, 10, 9],
      "User C": [12, 11, 8, 13, 4, 11, 13, 12],
      "User D": [5, 9, 6, 10, 3, 5, 8, 4],
      "User E": [3, 4, 2, 5, 1, 3, 4, 2],
      "User F": [2, 3, 1, 4, 2, 2, 3, 1],
      "User G": [1, 2, 1, 3, 0, 1, 2, 1],
      "User H": [3, 4, 3, 5, 1, 2, 3, 1],
    },
  },
  "Team 2": {
    aggregate: [13, 23, 20, 8, 13, 27, 13, 23],
    users: {
      "User I": [3, 5, 4, 2, 3, 6, 3, 5],
      "User J": [2, 4, 3, 1, 2, 5, 2, 4],
      "User K": [4, 6, 5, 3, 4, 7, 4, 6],
      "User L": [1, 2, 1, 0, 1, 2, 1, 2],
      "User M": [2, 3, 2, 1, 2, 3, 2, 3],
      "User N": [0, 1, 0, 0, 0, 1, 0, 1],
      "User O": [1, 2, 1, 1, 1, 2, 1, 2],
      "User P": [0, 0, 4, 0, 0, 1, 0, 0],
    },
  },
  "Team 3": {
    aggregate: [11, 17, 15, 15, 21, 14, 18, 20],
    users: {
      "User Q": [2, 3, 3, 3, 4, 3, 4, 4],
      "User R": [3, 4, 2, 4, 5, 2, 3, 5],
      "User S": [1, 2, 4, 2, 3, 4, 2, 3],
      "User T": [2, 3, 1, 3, 4, 1, 3, 4],
      "User U": [1, 2, 2, 1, 2, 2, 3, 2],
      "User V": [0, 1, 1, 0, 1, 0, 1, 1],
      "User W": [1, 1, 1, 1, 1, 1, 1, 0],
      "User X": [1, 1, 1, 1, 1, 1, 1, 1],
    },
  },
  "Team 4": {
    aggregate: [21, 7, 25, 13, 22, 8, 18, 20],
    users: {
      "User Y": [5, 2, 6, 3, 5, 2, 4, 5],
      "User Z": [4, 1, 5, 2, 4, 1, 3, 4],
      "User AA": [3, 0, 4, 1, 3, 0, 2, 3],
      "User AB": [2, 1, 3, 2, 2, 1, 2, 2],
      "User AC": [1, 1, 2, 1, 1, 1, 1, 1],
      "User AD": [2, 0, 1, 1, 2, 0, 1, 2],
      "User AE": [3, 1, 2, 2, 3, 1, 2, 3],
      "User AF": [1, 1, 2, 1, 2, 2, 3, 0],
    },
  },
  "Team 5": {
    aggregate: [30, 25, 28, 32, 20, 35, 22, 28],
    users: {
      "User AG": [6, 5, 6, 7, 4, 7, 5, 6],
      "User AH": [5, 4, 5, 6, 3, 6, 4, 5],
      "User AI": [7, 6, 7, 8, 5, 8, 6, 7],
      "User AJ": [4, 3, 4, 5, 2, 5, 3, 4],
      "User AK": [3, 2, 3, 4, 1, 4, 2, 3],
      "User AL": [2, 2, 1, 1, 2, 2, 1, 2],
      "User AM": [1, 1, 0, 0, 1, 1, 0, 0],
      "User AN": [2, 2, 2, 1, 2, 2, 1, 1],
    },
  },
};

const hours = ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM"];

const colors = [
  "#3B82F6", // Blue-600
  "#8B5CF6", // Violet-500
  "#A855F7", // Violet-500 lighter
  "#C084FC", // Violet-400
  "#EC4899", // Pink-500 muted
  "#F472B6", // Pink-400
  "#6EE7B7", // Emerald-300
  "#34D399", // Emerald-400
  "#10B981", // Emerald-600
  "#059669", // Emerald-700
];

export default function HourlyTeamProductivity() {
  const [selectedTeam, setSelectedTeam] = useState("");

  const teamOptions = React.useMemo(() => {
    return Object.keys(productivityData).map((team: string) => ({
      name: team,
      _id: team,
    }));
  }, []);

  const handleTeamChange = useCallback((option: any) => {
    setSelectedTeam(option?.value || "");
  }, []);

  const isTeamView = !selectedTeam;

  let series: any[] = [];
  if (isTeamView) {
    const teams = Object.keys(productivityData);
    series = teams.map((team: string) => ({
      name: team,
      data: productivityData[team].aggregate,
    }));
  } else {
    const usersData = productivityData[selectedTeam]?.users || {};
    series = Object.keys(usersData).map((user: string) => ({
      name: user,
      data: usersData[user],
    }));
  }

  const options: ApexOptions = {
    colors,
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      stacked: true,
      height: 315,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 10,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: hours,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
      fontSize: "14px",
      fontWeight: 400,
      markers: {
        size: 5,
        shape: "circle",
        strokeWidth: 0,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 0,
      },
    },
    yaxis: {
      title: {
        text: undefined,
      },
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
        show: false,
      },
      y: {
        formatter: (val: number) => val.toString(),
      },
    },
  };

  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6 flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Hourly Team Productivity
          </h3>
        </div>
        <SearchableSelect
          dataProps={{
            optionData: teamOptions,
          }}
          selectionProps={{
            selectedValue: selectedTeam,
          }}
          displayProps={{
            placeholder: "All Teams",
            id: "team-select",
            isClearable: true,
            layoutProps: {
              className: "min-w-[200px] h-11",
            },
          }}
          eventHandlers={{
            onChange: handleTeamChange,
          }}
        />
      </div>
      <div className="overflow-x-auto custom-scrollbar pl-2">
        <ReactApexChart
          className="-ml-5 min-w-[700px] xl:min-w-full"
          options={options}
          series={series}
          type="bar"
          height={315}
        />
      </div>
    </div>
  );
}
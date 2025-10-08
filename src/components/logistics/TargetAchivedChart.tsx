"use client";
import React, { useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import SearchableSelect from "../form/SearchableSelect";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const teamData: any = {
  "Team 1": [
    { name: "User A", target: 80, achieved: 75 },
    { name: "User B", target: 90, achieved: 85 },
    { name: "User C", target: 70, achieved: 65 },
    { name: "User D", target: 85, achieved: 80 },
    { name: "User E", target: 92, achieved: 88 },
    { name: "User F", target: 78, achieved: 72 },
    { name: "User G", target: 65, achieved: 60 },
    { name: "User H", target: 88, achieved: 85 },
  ],
  "Team 2": [
    { name: "User I", target: 75, achieved: 70 },
    { name: "User J", target: 95, achieved: 90 },
    { name: "User K", target: 60, achieved: 55 },
    { name: "User L", target: 88, achieved: 82 },
    { name: "User M", target: 82, achieved: 78 },
    { name: "User N", target: 67, achieved: 62 },
    { name: "User O", target: 92, achieved: 88 },
    { name: "User P", target: 78, achieved: 73 },
  ],
  "Team 3": [
    { name: "User Q", target: 82, achieved: 78 },
    { name: "User R", target: 67, achieved: 62 },
    { name: "User S", target: 92, achieved: 88 },
    { name: "User T", target: 78, achieved: 73 },
    { name: "User U", target: 85, achieved: 80 },
    { name: "User V", target: 70, achieved: 65 },
    { name: "User W", target: 90, achieved: 85 },
    { name: "User X", target: 75, achieved: 70 },
  ],
  "Team 4": [
    { name: "User Y", target: 85, achieved: 82 },
    { name: "User Z", target: 72, achieved: 68 },
    { name: "User AA", target: 95, achieved: 92 },
    { name: "User AB", target: 68, achieved: 63 },
    { name: "User AC", target: 88, achieved: 84 },
    { name: "User AD", target: 79, achieved: 75 },
    { name: "User AE", target: 91, achieved: 87 },
    { name: "User AF", target: 74, achieved: 69 },
  ],
  "Team 5": [
    { name: "User AG", target: 83, achieved: 79 },
    { name: "User AH", target: 69, achieved: 64 },
    { name: "User AI", target: 94, achieved: 90 },
    { name: "User AJ", target: 76, achieved: 71 },
    { name: "User AK", target: 87, achieved: 83 },
    { name: "User AL", target: 81, achieved: 77 },
    { name: "User AM", target: 66, achieved: 61 },
    { name: "User AN", target: 89, achieved: 85 },
  ],
};

export default function TargetAchievedChart() {
  const [selectedTeam, setSelectedTeam] = useState("");

  const teamOptions = React.useMemo(() => {
    return Object.keys(teamData).map((team) => ({
      name: team,
      _id: team,
    }));
  }, []);

  const handleTeamChange = (option: any) => {
    setSelectedTeam(option?.value || "");
  };

  const isTeamView = !selectedTeam;

  let categories: string[];
  let series: { name: string; data: number[] }[];

  if (isTeamView) {
    const teams = Object.keys(teamData);
    categories = teams;
    const targetData = teams.map((team) => {
      const users = teamData[team];
      return Math.round(
        users.reduce((sum: any, u: any) => sum + u.target, 0) / users.length
      );
    });
    const achievedData = teams.map((team) => {
      const users = teamData[team];
      return Math.round(
        users.reduce((sum: any, u: any) => sum + u.achieved, 0) / users.length
      );
    });
    series = [
      { name: "Target", data: targetData },
      { name: "Achieved", data: achievedData },
    ];
  } else {
    const users = teamData[selectedTeam] || [];
    categories = users.map((user: any) => user.name);
    series = [
      { name: "Target", data: users.map((user: any) => user.target) },
      { name: "Achieved", data: users.map((user: any) => user.achieved) },
    ];
  }

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 265,
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadius: 4,
        borderRadiusApplication: "end",
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
    colors: ["#465FFF", "#C2D6FF"],
    xaxis: {
      categories,
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => `${val}%`,
        style: { fontSize: "12px", colors: "#344054" },
      },
      max: 100,
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}%`,
      },
    },
    legend: { show: false },
    grid: {
      borderColor: "#F2F4F7",
      strokeDashArray: 0,
    },
    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
      active: {
        filter: {
          type: "none",
        },
      },
    },
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
      <div className="flex items-center justify-between gap-5">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Target Vs Achieved
          </h3>
          <p className="dark:text-gray-40 text-sm text-gray-500"></p>
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

      <div>
        <div className="flex items-center gap-5 pt-5">
          <div className="flex items-center gap-1.5">
            <div className="bg-brand-500 h-2.5 w-2.5 rounded-full"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Target</p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="bg-brand-200 h-2.5 w-2.5 rounded-full"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Achieved</p>
          </div>
        </div>
        <div id="chartTargetAchieved" className="h-[265px] w-full">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={265}
          />
        </div>
      </div>
    </div>
  );
}

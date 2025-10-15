import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Download, Users, AlertCircle, TrendingUp } from "lucide-react";
import Button from "@/components/ui/button/Button";
import DatePicker from "@/components/form/date-picker";
import SearchableSelect from "@/components/form/SearchableSelect";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectItem {
  _id: string;
  name: string;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
}

interface Team {
  id: number;
  name: string;
  members: TeamMember[];
}

interface MockData {
  teams: Team[];
  errorCategories: string[];
  errors: {
    [key: string]: string[];
  };
}

interface ErrorData {
  [category: string]: {
    [error: string]: number;
  };
}

interface ChartData {
  type: "team" | "all";
  title: string;
  data: Array<{
    name: string;
    [key: string]: string | number;
  }>;
}

const mockData: MockData = {
  teams: [
    {
      id: 1,
      name: "Team Pramod",
      members: [
        { id: 101, name: "John Doe", role: "Senior Dev" },
        { id: 102, name: "Jane Smith", role: "Dev" },
        { id: 103, name: "Alice Johnson", role: "Dev" },
        { id: 104, name: "Bob Brown", role: "Junior Dev" },
        { id: 105, name: "Charlie Wilson", role: "Senior Dev" },
        { id: 106, name: "David Lee", role: "Dev" },
      ],
    },
    {
      id: 2,
      name: "Team Shijo",
      members: [
        { id: 201, name: "Ivy Walker", role: "Lead Dev" },
        { id: 202, name: "Jack Hall", role: "Senior Dev" },
        { id: 203, name: "Karen Allen", role: "Dev" },
        { id: 204, name: "Liam Young", role: "Dev" },
        { id: 205, name: "Mia King", role: "Junior Dev" },
        { id: 206, name: "Noah Wright", role: "Senior Dev" },
      ],
    },
    {
      id: 3,
      name: "Team Amira",
      members: [
        { id: 301, name: "Aaron Morgan", role: "Lead Dev" },
        { id: 302, name: "Bella Rogers", role: "Senior Dev" },
        { id: 303, name: "Cody Sanders", role: "Dev" },
        { id: 304, name: "Diana Hunt", role: "Dev" },
        { id: 305, name: "Ethan Cole", role: "Junior Dev" },
        { id: 306, name: "Fiona Price", role: "QA Engineer" },
      ],
    },
  ],
  errorCategories: ["Coding", "POC", "Oasis"],
  errors: {
    Coding: [
      "PDX Error",
      "Process Error",
      "Gender Discrepancy",
      "Failure to Query",
      "Covention Error",
      "Dx Mission",
    ],
    POC: [
      "Demograph",
      "Statement",
      "Goals and Interventions",
      "Medication",
      "F2F Data & MD",
      "Other",
    ],
    Oasis: [
      "Wound care worksheet",
      "IV/Catheter/Ostemy/Other care",
      "Goals and Interventions",
      "Medication Profile",
      "M item",
      "Other Items",
      "POC Locators",
    ],
  },
};
const ErrorReportSystem = () => {
  const [, setStartDate] = useState("2025-10-01");
  const [, setEndDate] = useState("2025-10-08");

  const generateErrorData = (teamId: number, userId: number): ErrorData => {
    console.log("🚀 ~ generateErrorData ~ userId:", userId);
    console.log("🚀 ~ generateErrorData ~ teamId:", teamId);
    const data: ErrorData = {};
    mockData.errorCategories.forEach((category) => {
      data[category] = {};
      mockData.errors[category].forEach((error) => {
        data[category][error] = Math.floor(Math.random() * 20);
      });
    });
    return data;
  };

  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  // Get team options
  const teamOptions = useMemo(() => {
    return mockData.teams.map((team) => ({
      label: team.name,
      value: team.id.toString(),
    })) as SelectOption[];
  }, []);

  // Get member options based on selected team
  const memberOptions = useMemo(() => {
    if (!selectedTeam) return [];
    const team = mockData.teams.find((t) => t.id === parseInt(selectedTeam));
    if (!team) return [];
    return team.members.map((member) => ({
      label: member.name,
      value: member.id.toString(),
    })) as SelectOption[];
  }, [selectedTeam]);

  // Prepare chart data based on selections
  const chartData = useMemo((): ChartData => {
    if (selectedMember && selectedTeam) {
      // Show only one member's data with 3 bars (Coding, POC, Oasis)
      const team = mockData.teams.find((t) => t.id === parseInt(selectedTeam));
      const member = team?.members.find(
        (m) => m.id === parseInt(selectedMember)
      );

      if (!member || !team) {
        return {
          type: "all",
          title: "All Teams - Error Report",
          data: [],
        };
      }

      const errorData = generateErrorData(team.id, member.id);
      const memberData: { [key: string]: number } = {};
      mockData.errorCategories.forEach((category) => {
        memberData[category] = Object.values(errorData[category]).reduce(
          (a, b) => a + b,
          0
        );
      });

      // Create one row with 3 bars for each category
      return {
        type: "team",
        title: `${member.name} - Error Report`,
        data: mockData.errorCategories.map((category) => ({
          name: category,
          [category]: memberData[category],
        })),
      };
    } else if (selectedTeam) {
      const team = mockData.teams.find((t) => t.id === parseInt(selectedTeam));
      if (!team) {
        return {
          type: "all",
          title: "All Teams - Error Report",
          data: [],
        };
      }

      const teamData = team.members.map((member) => {
        const errorData = generateErrorData(team.id, member.id);
        const totals: { [key: string]: number } = {};
        mockData.errorCategories.forEach((category) => {
          totals[category] = Object.values(errorData[category]).reduce(
            (a, b) => a + b,
            0
          );
        });
        return {
          name: member.name,
          ...totals,
        };
      });

      return {
        type: "team",
        title: `${team.name} - Error Report`,
        data: teamData,
      };
    } else {
      const allTeamsData = mockData.teams.map((team) => {
        const teamTotal: { [key: string]: number } = {};
        mockData.errorCategories.forEach((category) => {
          let sum = 0;
          team.members.forEach((member) => {
            const errorData = generateErrorData(team.id, member.id);
            sum += Object.values(errorData[category]).reduce(
              (a, b) => a + b,
              0
            );
          });
          teamTotal[category] = sum;
        });
        return {
          name: team.name,
          ...teamTotal,
        };
      });

      return {
        type: "all",
        title: "All Teams - Error Report",
        data: allTeamsData,
      };
    }
  }, [selectedTeam, selectedMember]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    let totalErrors = 0;
    const categoryBreakdown: { [key: string]: number } = {};

    mockData.errorCategories.forEach((cat) => (categoryBreakdown[cat] = 0));

    chartData.data.forEach((item) => {
      mockData.errorCategories.forEach((category) => {
        const value = (item[category] as number) || 0;
        totalErrors += value;
        categoryBreakdown[category] += value;
      });
    });

    return { totalErrors, categoryBreakdown };
  }, [chartData]);

  const COLORS = [
    "#465fff",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
  ];

  // Chart styling for dark mode
  const chartTheme = {
    textColor: "rgb(100 116 139)", // slate-500
    gridColor: "rgb(226 232 240)", // slate-200
    dark: {
      textColor: "rgb(148 163 184)", // slate-400
      gridColor: "rgb(51 65 85)", // slate-700
      tooltipBg: "rgb(30 41 59)", // slate-800
      tooltipBorder: "rgb(51 65 85)", // slate-700
    },
  };

  const handleDownload = () => {
    const dataStr = JSON.stringify(chartData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `error-report-${Date.now()}.json`;
    link.click();
  };

  const handleReset = () => {
    setSelectedTeam(null);
    setSelectedMember(null);
  };

  return (
    <div className="min-h-screen p- transition-colors duration-200">
      <div className="">
        {/* Header Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6 transition-colors duration-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg transition-colors duration-200">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 transition-colors duration-200">
                  Error Report Dashboard
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors duration-200">
                  Analyze team and individual error metrics
                </p>
              </div>
            </div>
            <Button
              onClick={handleDownload}
              className="flex items-center"
              variant="primary"
            >
              <Download className="w-4 h-4" />
              Download Report
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div className="w-full">
              <SearchableSelect
                dataProps={{
                  optionData: teamOptions?.map((opt) => ({
                    _id: opt.value,
                    name: opt.label,
                  })) as SelectItem[],
                }}
                selectionProps={{
                  selectedValue: selectedTeam
                    ? {
                        _id: selectedTeam,
                        name:
                          teamOptions.find((t) => t.value === selectedTeam)
                            ?.label || selectedTeam,
                      }
                    : null,
                }}
                displayProps={{
                  placeholder: "Select team...",
                  id: "team",
                  isClearable: true,
                  layoutProps: {
                    className: "w-full",
                  },
                }}
                eventHandlers={{
                  onChange: (selected: SelectItem | null) => {
                    setSelectedTeam(selected ? selected._id : null);
                    setSelectedMember(null); // Reset member when team changes
                  },
                }}
              />
            </div>

            <div className="w-full">
              <SearchableSelect
                dataProps={{
                  optionData: memberOptions?.map((opt) => ({
                    _id: opt.value,
                    name: opt.label,
                  })) as SelectItem[],
                }}
                selectionProps={{
                  selectedValue: selectedMember
                    ? {
                        _id: selectedMember,
                        name:
                          memberOptions.find((m) => m.value === selectedMember)
                            ?.label || selectedMember,
                      }
                    : null,
                }}
                displayProps={{
                  placeholder: selectedTeam
                    ? "Select member..."
                    : "Select team first...",
                  id: "member",
                  isClearable: true,
                  disabled: !selectedTeam,
                  layoutProps: {
                    className: "w-full",
                  },
                }}
                eventHandlers={{
                  onChange: (selected: SelectItem | null) => {
                    setSelectedMember(selected ? selected._id : null);
                  },
                }}
              />
            </div>

            <div className="w-full">
              <DatePicker
                id="dateRange"
                mode="range"
                placeholder="Select date range..."
                onChange={(selectedDates: Date[]) => {
                  if (selectedDates.length === 2) {
                    setStartDate(selectedDates[0].toISOString().split("T")[0]);
                    setEndDate(selectedDates[1].toISOString().split("T")[0]);
                  }
                }}
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleReset}
                variant="outline"
                className="w-[300px] h-11"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 transition-colors duration-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1 transition-colors duration-200">
                  Total Errors
                </p>
                <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 transition-colors duration-200">
                  {summaryStats.totalErrors}
                </p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg transition-colors duration-200">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          {mockData.errorCategories.map((category, idx) => (
            <div
              key={category}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 transition-colors duration-200 space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1 transition-colors duration-200">
                    {category} Errors
                  </p>
                  <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 transition-colors duration-200">
                    {summaryStats.categoryBreakdown[category]}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-lg transition-colors duration-200`}
                  style={{ backgroundColor: COLORS[idx] + "20" }}
                >
                  <Users className="w-6 h-6" style={{ color: COLORS[idx] }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Bar Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6 transition-colors duration-200">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 transition-colors duration-200">
            {chartData.title}
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData.data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={chartTheme.gridColor}
                className="dark:[&>line]:stroke-slate-700"
              />
              <XAxis
                dataKey="name"
                stroke={chartTheme.textColor}
                className="dark:[&>line]:stroke-slate-400 dark:[&>text]:fill-slate-400"
              />
              <YAxis
                stroke={chartTheme.textColor}
                className="dark:[&>line]:stroke-slate-400 dark:[&>text]:fill-slate-400"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: chartTheme.dark.tooltipBg,
                  border: `1px solid ${chartTheme.dark.tooltipBorder}`,
                  borderRadius: "8px",
                  color: "rgb(248 250 252)",
                }}
                cursor={false}
                itemStyle={{ color: "rgb(248 250 252)" }}
                labelStyle={{ color: "rgb(248 250 252)" }}
              />
              <Legend />
              {mockData.errorCategories.map((category, idx) => (
                <Bar
                  key={category}
                  dataKey={category}
                  fill={COLORS[idx]}
                  radius={[8, 8, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {mockData.errorCategories.map((category, catIdx) => {
            const errorCounts: { [key: string]: number } = {};
            mockData.errors[category].forEach((error) => {
              errorCounts[error] = 0;
            });

            chartData.data.forEach(() => {
              const errorData =
                chartData.type === "team"
                  ? generateErrorData(
                      parseInt(selectedTeam || "0"),
                      Math.floor(Math.random() * 1000)
                    )
                  : generateErrorData(
                      Math.floor(Math.random() * 100),
                      Math.floor(Math.random() * 1000)
                    );

              Object.entries(errorData[category] || {}).forEach(
                ([error, count]) => {
                  errorCounts[error] = (errorCounts[error] || 0) + count;
                }
              );
            });

            const categoryErrorData = Object.entries(errorCounts).map(
              ([error, count]) => ({ error, count })
            );
            const categoryTotal = categoryErrorData.reduce(
              (sum, item) => sum + item.count,
              0
            );

            const errorBreakdown = categoryErrorData
              .map((item) => ({
                ...item,
                percentage:
                  categoryTotal > 0
                    ? ((item.count / categoryTotal) * 100).toFixed(1)
                    : 0,
              }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 7);
            const otherData = categoryErrorData
              .filter(
                (item) => !errorBreakdown.some((d) => d.error === item.error)
              )
              .reduce((sum, item) => sum + item.count, 0);

            if (otherData > 0) {
              errorBreakdown.push({
                error: "Other",
                count: otherData,
                percentage: ((otherData / categoryTotal) * 100).toFixed(1),
              });
            }

            return (
              <div
                key={category}
                className="transition-colors duration-200 space-y-6"
              >
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 transition-colors duration-200">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: COLORS[catIdx] }}
                      ></div>
                      {category} Errors Breakdown
                    </h3>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 transition-colors duration-200">
                        {categoryTotal}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-200">
                        Total Errors
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 transition-colors duration-200">
                      Error Distribution
                    </h4>
                    <ResponsiveContainer
                      width="100%"
                      height={300}
                      className="-ml-5"
                    >
                      <BarChart data={errorBreakdown} layout="vertical">
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={chartTheme.gridColor}
                          className="dark:[&>line]:stroke-slate-700"
                        />
                        <XAxis
                          type="number"
                          stroke={chartTheme.textColor}
                          className="dark:[&>line]:stroke-slate-400 dark:[&>text]:fill-slate-400"
                        />
                        <YAxis
                          dataKey="error"
                          type="category"
                          width={150}
                          stroke={chartTheme.textColor}
                          style={{ fontSize: "11px" }}
                          className="dark:[&>line]:stroke-slate-400 dark:[&>text]:fill-slate-400"
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: chartTheme.dark.tooltipBg,
                            border: `1px solid ${chartTheme.dark.tooltipBorder}`,
                            borderRadius: "8px",
                            color: "rgb(248 250 252)",
                          }}
                          cursor={false}
                          itemStyle={{ color: "rgb(248 250 252)" }}
                          labelStyle={{ color: "rgb(248 250 252)" }}
                          formatter={(value, name) => {
                            if (name === "count") {
                              const item = errorBreakdown.find(
                                (e) => e.count === value
                              );
                              return [
                                `${value} (${item?.percentage}%)`,
                                "Count",
                              ];
                            }
                            return [value, name];
                          }}
                        />
                        <Bar
                          dataKey="count"
                          fill={COLORS[catIdx]}
                          radius={[0, 8, 8, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Card - Scrollable Content */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 flex flex-col max-h-[500px]">
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 transition-colors duration-200">
                      Detailed Breakdown
                    </h4>

                    {/* Scrollable Section */}
                    <div className="space-y-2 overflow-y-auto pr-2 flex-1">
                      {errorBreakdown.slice(0, -1).map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 transition-colors duration-200"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors duration-200">
                              {item.error}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-800 dark:text-slate-100 transition-colors duration-200">
                                {item.count}
                              </span>
                              <span className="text-xs font-semibold text-white bg-slate-600 dark:bg-slate-500 px-2 py-1 rounded transition-colors duration-200">
                                {item.percentage}%
                              </span>
                            </div>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 transition-colors duration-200">
                            <div
                              className="h-2 rounded-full transition-all duration-500"
                              style={{
                                width: `${item.percentage}%`,
                                backgroundColor: COLORS[catIdx],
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Card */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 flex flex-col max-h-[500px]">
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 text-center transition-colors duration-200">
                      Top Errors Distribution
                    </h4>

                    <div className="flex flex-col items-center gap-4 flex-1">
                      <div className="w-80 h-80 flex justify-center items-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={errorBreakdown}
                              cx="50%"
                              cy="50%"
                              startAngle={100}
                              endAngle={-270}
                              innerRadius={65}
                              outerRadius={120}
                              paddingAngle={0}
                              dataKey="count"
                              nameKey="error"
                            >
                              {errorBreakdown.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: chartTheme.dark.tooltipBg,
                                border: `1px solid ${chartTheme.dark.tooltipBorder}`,
                                borderRadius: "8px",
                                color: "rgb(248 250 252)",
                              }}
                              itemStyle={{ color: "rgb(248 250 252)" }}
                              labelStyle={{ color: "rgb(248 250 252)" }}
                              formatter={(value, name, props) => [
                                `${value} (${props.payload.percentage}%)`,
                                name,
                              ]}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="w-full max-w-md">
                        <div className="flex flex-wrap grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 justify-items-center">
                          {errorBreakdown.map((entry, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-1 text-center"
                            >
                              <div
                                className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{
                                  backgroundColor:
                                    COLORS[index % COLORS.length],
                                }}
                              />
                              <span className="text-xs text-slate-700 dark:text-slate-300 line-clamp-1 transition-colors duration-200">
                                {entry.error}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mt-6 transition-colors duration-200">
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 transition-colors duration-200">
              Error Category Distribution
            </h2>

            <div className="w-96 h-96 flex justify-center items-center mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Object.entries(summaryStats.categoryBreakdown).map(
                      ([name, value]) => ({ name, value })
                    )}
                    cx="50%"
                    cy="50%"
                    startAngle={90}
                    endAngle={-270}
                    innerRadius={65}
                    outerRadius={120}
                    paddingAngle={0}
                    dataKey="value"
                    nameKey="name"
                  >
                    {Object.keys(summaryStats.categoryBreakdown).map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: chartTheme.dark.tooltipBg,
                      border: `1px solid ${chartTheme.dark.tooltipBorder}`,
                      borderRadius: "8px",
                      color: "rgb(248 250 252)",
                    }}
                    itemStyle={{ color: "rgb(248 250 252)" }}
                    labelStyle={{ color: "rgb(248 250 252)" }}
                    formatter={(value) => [value, "Errors"]}
                    labelFormatter={(name) => `${name} Category`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-center gap-6">
              {Object.entries(summaryStats.categoryBreakdown).map(
                ([name, value], index) => (
                  <div key={name} className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors duration-200">
                      {name}
                    </span>
                    <span className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-200">
                      ({value})
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorReportSystem;

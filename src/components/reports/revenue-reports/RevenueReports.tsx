"use client";

import { useState, useMemo } from "react";
import { AreaChartComponent } from "./components/AreaChartComponent";
import { LineChartComponent } from "./components/LineChartComponent";
import { BarChartComponent } from "./components/BarChartComponent";
import { PieChartComponent } from "./components/PieChartComponent";
import { formatCurrency, generateSampleData } from "./sampleData";
import { DashboardFilters } from "./components/DashboardFilters";
import { projectOptions } from "@/components/user-management/user-list/MainComponent";
import { Card } from "@/components/ui/card";
import CommonTable, { HeaderType } from "@/components/common/CommonTable";
import { BarChart3, Calendar, Sun } from "lucide-react";

// Types
interface TeamOption {
  label: string;
  value: string;
}

interface GroupOption {
  value: string;
  label: string;
}

interface TimeFrameOption {
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

interface AggregatedDataItem {
  periodKey: string;
  timestamp: number;
  revenue: number;
  projected: number;
  displayDate: string;
  date: string;
  [key: string]: any; // For dynamic team properties
}

interface TeamRevenueData {
  team: string;
  revenue: number;
  projected: number;
  count: number;
}

interface ProjectRevenueData {
  project: string;
  revenue: number;
  projected: number;
}

interface IndividualRevenueData {
  name: string;
  team: string;
  revenue: number;
  projects: number;
  rank: number;
  serial: number;
}

interface Metrics {
  totalRevenue: number;
  totalProjected: number;
  activeProjects: number;
  activeTeams: number;
  growth: number;
  avgRevenuePerDay: number;
}

const groupOptions: GroupOption[] = [
  { value: "overview", label: "Overview" },
  { value: "individual", label: "Individual Contributors" },
  { value: "project", label: "Project Analysis" },
  { value: "team", label: "Team Performance" },
];

const teamOptions: TeamOption[] = [
  { label: "Team Pramod", value: "Team Pramod" },
  { label: "Team Shijo", value: "Team Shijo" },
  { label: "Team Amira", value: "Team Amira" },
];

const timeFrames: TimeFrameOption[] = [
  { value: "daily", icon: Sun, label: "Daily" },
  { value: "weekly", icon: Calendar, label: "Weekly" },
  { value: "monthly", icon: BarChart3, label: "Monthly" },
];

const RevenueReports = () => {
  const allData = useMemo(() => generateSampleData(), []);

  const [timeFrame, setTimeFrame] = useState<string>("daily");
  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [selectedGroup, setSelectedGroup] = useState<string>("overview");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Reset to overview when team/project filters are cleared
  const handleTeamChange = (team: string | null) => {
    const newTeam = team || "all";
    setSelectedTeam(newTeam);
    if (newTeam === "all" && selectedGroup !== "overview") {
      setSelectedGroup("overview");
    }
  };

  const handleProjectChange = (project: string | null) => {
    const newProject = project || "all";
    setSelectedProject(newProject);
    if (newProject === "all" && selectedGroup !== "overview") {
      setSelectedGroup("overview");
    }
  };

  const handleGroupChange = (group: string | null) => {
    const newGroup = group || "overview";
    setSelectedGroup(newGroup);
    if (newGroup === "overview") {
      setSelectedTeam("all");
      setSelectedProject("all");
      setSelectedDate(null);
    }
  };

  // const handleDateChange = (dateStr: string | null) => {
  //   setSelectedDate(dateStr);

  //   if (dateStr && selectedGroup !== "overview") {
  //     setSelectedGroup("overview");
  //   }
  // };

  const teams: any = useMemo(
    () => ["all", ...new Set(allData.map((d: any) => d.team))],
    [allData]
  );

  const filteredData = useMemo(() => {
    return allData.filter((item: any) => {
      const teamMatch = selectedTeam === "all" || item.team === selectedTeam;
      const projectMatch =
        selectedProject === "all" || item.project === selectedProject;
      
      // Date filtering logic
      let dateMatch = true;
      if (selectedDate) {
        const itemDate = new Date(item.date);
        const selectedDateObj = new Date(selectedDate);
        // For daily view, match exact date
        // For weekly/monthly, match the period
        if (timeFrame === "daily") {
          dateMatch = itemDate.toISOString().split("T")[0] === selectedDate;
        } else if (timeFrame === "weekly") {
          // Match week
          const itemWeekStart = new Date(itemDate);
          itemWeekStart.setDate(itemDate.getDate() - itemDate.getDay() + 1);
          const selectedWeekStart = new Date(selectedDateObj);
          selectedWeekStart.setDate(selectedDateObj.getDate() - selectedDateObj.getDay() + 1);
          dateMatch = itemWeekStart.toISOString().split("T")[0] === selectedWeekStart.toISOString().split("T")[0];
        } else {
          // Monthly - match year and month
          dateMatch = 
            itemDate.getFullYear() === selectedDateObj.getFullYear() &&
            itemDate.getMonth() === selectedDateObj.getMonth();
        }
      }

      return teamMatch && projectMatch && dateMatch;
    });
  }, [allData, selectedTeam, selectedProject, selectedDate, timeFrame]);

  const getAggregatedData = useMemo((): AggregatedDataItem[] => {
    // If a specific date is selected and timeframe is daily, just use that day's data
    if (selectedDate && timeFrame === "daily") {
      const dateData = filteredData.filter((item: any) => 
        new Date(item.date).toISOString().split("T")[0] === selectedDate
      );
      
      if (dateData.length > 0) {
        const dateObj = new Date(selectedDate);
        return [{
          periodKey: selectedDate,
          timestamp: dateObj.getTime(),
          revenue: dateData.reduce((sum: number, item: any) => sum + item.revenue, 0),
          projected: dateData.reduce((sum: number, item: any) => sum + item.projectedRevenue, 0),
          displayDate: dateObj.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
          }),
          date: selectedDate,
          ...teams.reduce((acc: any, team: any) => {
            if (team !== "all") {
              acc[team] = dateData
                .filter((d: any) => d.team === team)
                .reduce((sum: number, item: any) => sum + item.revenue, 0);
            }
            return acc;
          }, {})
        }];
      }
    }

    // Fallback to original aggregation logic for broader timeframes or no date selected
    const grouped: Record<string, AggregatedDataItem> = {};

    filteredData.forEach((item: any) => {
      let periodKey: string;
      let timestamp: number;
      const date = new Date(item.date);

      if (timeFrame === "daily") {
        periodKey = date.toISOString().split("T")[0];
        timestamp = date.getTime();
      } else if (timeFrame === "weekly") {
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const days = Math.floor(
          (date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)
        );
        const weekNumber = Math.ceil((days + 1) / 7);
        periodKey = `${date.getFullYear()}-W${weekNumber.toString().padStart(2, "0")}`;
        const monday = new Date(date);
        monday.setDate(date.getDate() - date.getDay() + 1);
        timestamp = monday.getTime();
      } else {
        periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        timestamp = new Date(date.getFullYear(), date.getMonth(), 15).getTime();
      }

      if (!grouped[periodKey]) {
        grouped[periodKey] = {
          periodKey,
          timestamp,
          revenue: 0,
          projected: 0,
          displayDate: "",
          date: "",
        };
        teams
          .filter((t: any) => t !== "all")
          .forEach((team: any) => {
            grouped[periodKey][team] = 0;
          });
      }

      grouped[periodKey].revenue += item.revenue;
      grouped[periodKey].projected += item.projectedRevenue;
      grouped[periodKey][item.team] =
        (grouped[periodKey][item.team] || 0) + item.revenue;
    });

    let aggregatedData = Object.values(grouped).sort(
      (a: AggregatedDataItem, b: AggregatedDataItem) =>
        a.timestamp - b.timestamp
    );

    // Apply date filtering constraints
    if (selectedDate) {
      const selectedDateObj = new Date(selectedDate);
      aggregatedData = aggregatedData.filter((item: AggregatedDataItem) => {
        const itemDate = new Date(item.timestamp);
        if (timeFrame === "daily") {
          return item.periodKey === selectedDate;
        } else if (timeFrame === "weekly") {
          const itemWeekStart = new Date(itemDate);
          itemWeekStart.setDate(itemDate.getDate() - itemDate.getDay() + 1);
          const selectedWeekStart = new Date(selectedDateObj);
          selectedWeekStart.setDate(selectedDateObj.getDate() - selectedDateObj.getDay() + 1);
          return itemWeekStart.toISOString().split("T")[0] === selectedWeekStart.toISOString().split("T")[0];
        } else {
          return itemDate.getFullYear() === selectedDateObj.getFullYear() && 
                 itemDate.getMonth() === selectedDateObj.getMonth();
        }
      });
    }

    // Limit data points based on time frame
    if (timeFrame === "daily" && aggregatedData.length > 20) {
      aggregatedData = aggregatedData.slice(-20);
    } else if (timeFrame === "weekly" && aggregatedData.length > 10) {
      aggregatedData = aggregatedData.slice(-10);
    } else if (timeFrame === "monthly" && aggregatedData.length > 12) {
      aggregatedData = aggregatedData.slice(-12);
    }

    return aggregatedData.map((item: AggregatedDataItem, index: number) => {
      let displayDate: string;

      if (timeFrame === "daily") {
        const date = new Date(item.timestamp);
        displayDate = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      } else if (timeFrame === "weekly") {
        const weekNumber = index + 1;
        displayDate = `Week ${weekNumber}`;
      } else {
        const date = new Date(item.timestamp);
        displayDate = date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
      }

      return {
        ...item,
        displayDate,
        date: item.timestamp.toString(),
      };
    });
  }, [filteredData, teams, timeFrame, selectedDate]);

  const metrics: Metrics = useMemo(() => {
    const totalRevenue = filteredData.reduce(
      (sum: any, item: any) => sum + item.revenue,
      0
    );
    const totalProjected = filteredData.reduce(
      (sum: any, item: any) => sum + item.projectedRevenue,
      0
    );
    const activeProjects = new Set(filteredData.map((d: any) => d.project))
      .size;
    const activeTeams = new Set(filteredData.map((d: any) => d.team)).size;

    const recentRevenue = filteredData.reduce(
      (sum: any, item: any) => sum + item.revenue,
      0
    );
    const olderRevenue = filteredData.reduce(
      (sum: any, item: any) => sum + item.revenue,
      0
    );

    const growth =
      olderRevenue > 0
        ? ((recentRevenue - olderRevenue) / olderRevenue) * 100
        : 0;

    return {
      totalRevenue,
      totalProjected,
      activeProjects,
      activeTeams,
      growth,
      avgRevenuePerDay: totalRevenue / Math.max(1, filteredData.length),
    };
  }, [filteredData]);

  const dailyRevenueData = useMemo(() => {
    return getAggregatedData;
  }, [getAggregatedData]);

  const teamRevenueData = useMemo((): TeamRevenueData[] => {
    const grouped: Record<string, TeamRevenueData> = {};
    filteredData.forEach((item: any) => {
      if (!grouped[item.team]) {
        grouped[item.team] = {
          team: item.team,
          revenue: 0,
          projected: 0,
          count: 0,
        };
      }
      grouped[item.team].revenue += item.revenue;
      grouped[item.team].projected += item.projectedRevenue;
      grouped[item.team].count += 1;
    });
    return Object.values(grouped).sort(
      (a: TeamRevenueData, b: TeamRevenueData) => b.revenue - a.revenue
    );
  }, [filteredData]);

  const projectRevenueData = useMemo((): ProjectRevenueData[] => {
    const grouped: Record<string, ProjectRevenueData> = {};
    filteredData.forEach((item: any) => {
      if (!grouped[item.project]) {
        grouped[item.project] = {
          project: item.project,
          revenue: 0,
          projected: 0,
        };
      }
      grouped[item.project].revenue += item.revenue;
      grouped[item.project].projected += item.projectedRevenue;
    });
    return Object.values(grouped).sort(
      (a: ProjectRevenueData, b: ProjectRevenueData) => b.revenue - a.revenue
    );
  }, [filteredData]);

  const individualRevenueData = useMemo((): any[] => {
    const grouped: Record<string, IndividualRevenueData & { projects: any }> =
      {};

    filteredData.forEach((item: any) => {
      const key = `${item.team}-${item.member}`;
      if (!grouped[key]) {
        grouped[key] = {
          name: item.member,
          team: item.team,
          revenue: 0,
          projects: new Set(),
          rank: 0,
          serial: 0,
        } as any;
      }
      grouped[key].revenue += item.revenue;
      grouped[key].projects.add(item.project);
    });

    const rankedData = Object.values(grouped)
      .map((item) => ({
        ...item,
        projects: item.projects.size,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
      .map((item, index) => ({
        ...item,
        rank: index + 1,
        serial: index + 1,
      }));

    return rankedData;
  }, [filteredData]);

  // Safe variance calculation function to prevent NaN
  const calculateVariance = (projected: number, revenue: number): string => {
    if (revenue === 0 || projected === 0) return "0.0%";
    const variance = (projected / revenue - 1) * 100;
    return `${variance.toFixed(1)}%`;
  };

  const teamTableHeaders: HeaderType<TeamRevenueData>[] = [
    {
      label: "Team",
      render: (item) => item.team,
    },
    {
      label: "Actual Revenue",
      render: (item) => formatCurrency(item.revenue),
    },
    {
      label: "Projected Revenue",
      render: (item) => formatCurrency(item.projected),
    },
    {
      label: "Variance",
      render: (item) => calculateVariance(item.projected, item.revenue),
      className:
        "text-center font-medium text-success-600 dark:text-success-500",
    },
  ];

  const individualTableHeaders: HeaderType<IndividualRevenueData>[] = [
    {
      label: "Rank",
      render: (item) => item.serial,
      className: "text-left",
    },
    {
      label: "Name",
      render: (item) => item.name,
      className: "text-left",
    },
    {
      label: "Team",
      render: (item) => item.team,
      className: "text-left",
    },
    {
      label: "Revenue",
      render: (item) => formatCurrency(item.revenue),
      className: "text-right font-semibold",
    },
    {
      label: "Projects",
      render: (item) => item.projects,
    },
  ];

  const projectTableHeaders: HeaderType<ProjectRevenueData>[] = [
    {
      label: "Project",
      render: (item) => item.project,
      className: "text-left",
    },
    {
      label: "Actual Revenue",
      render: (item) => formatCurrency(item.revenue),
    },
    {
      label: "Projected Revenue",
      render: (item) => formatCurrency(item.projected),
    },
    {
      label: "Variance",
      render: (item) => calculateVariance(item.projected, item.revenue),
      className: "text-center font-medium text-success-600",
    },
  ];

  // Safe percentage calculation for the achievement section
  const achievementPercentage =
    metrics.totalProjected > 0
      ? (metrics.totalRevenue / metrics.totalProjected) * 100
      : 0;

  return (
    <div className="p-6">
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-white">
            Revenue Analytics Dashboard
          </h1>
          <p className="text-gray-700 dark:text-gray-300">
            Comprehensive revenue tracking and analysis
          </p>
        </div>

        <DashboardFilters
          selectedTeam={selectedTeam}
          setSelectedTeam={handleTeamChange}
          selectedProject={selectedProject}
          setSelectedProject={handleProjectChange}
          selectedGroup={selectedGroup}
          setSelectedGroup={handleGroupChange}
          teamOptions={teamOptions}
          projectOptions={projectOptions}
          groupOptions={groupOptions}
          timeFrames={timeFrames}
          setTimeFrame={setTimeFrame}
          timeFrame={timeFrame}
          
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card
            title="Total Revenue"
            value={formatCurrency(metrics.totalRevenue)}
            subtitle={`${metrics.growth > 0 ? "+" : ""}${metrics.growth.toFixed(
              1
            )}% from previous period`}
            variant="primary"
          />
          <Card
            title="Projected Revenue"
            value={formatCurrency(metrics.totalProjected)}
            subtitle={`${calculateVariance(
              metrics.totalProjected,
              metrics.totalRevenue
            )} above actual`}
            variant="secondary"
          />
          <Card
            title="Active Projects"
            value={metrics.activeProjects.toString()}
            subtitle={`Across ${metrics.activeTeams} teams`}
            variant="accent"
          />
          <Card
            title="Avg Daily Revenue"
            value={formatCurrency(metrics.avgRevenuePerDay)}
            variant="warning"
          />
        </div>

        {selectedGroup === "overview" && (
          <>
            <div className="mb-6">
              <AreaChartComponent
                data={dailyRevenueData}
                title={`Revenue Trend: Actual vs Projected (${
                  timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)
                })`}
              />
            </div>

            <div className="mb-6">
              <LineChartComponent
                data={dailyRevenueData}
                teams={teams.filter((t: any) => t !== "all")}
                title={`Team-wise Revenue Trend (${
                  timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)
                })`}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 mb-6">
              <BarChartComponent
                data={projectRevenueData}
                title="Revenue by Project"
                dataKey="revenue"
                categoryKey="project"
              />
              <PieChartComponent
                data={teamRevenueData}
                title="Team Distribution"
                labelKey="team"
                valueKey="revenue"
              />
            </div>
          </>
        )}

        {selectedGroup === "team" && (
          <>
            <div className="mb-6">
              <BarChartComponent
                data={teamRevenueData}
                title="Team Performance Comparison"
                dataKey="revenue"
                categoryKey="team"
                horizontal={true}
              />
            </div>

            <div className="mb-6">
              <PieChartComponent
                data={teamRevenueData}
                title="Team Revenue Distribution"
                labelKey="team"
                valueKey="revenue"
              />
            </div>

            <div className="mb-6">
              <h3 className="text-heading font-semibold mb-4">
                Team Performance Details
              </h3>
              <CommonTable
                data={teamRevenueData}
                headers={teamTableHeaders}
                emptyState="No team data available"
              />
            </div>
          </>
        )}

        {selectedGroup === "project" && (
          <>
            <div className="mb-6">
              <BarChartComponent
                data={projectRevenueData}
                title="Project Performance Comparison"
                dataKey="revenue"
                categoryKey="project"
              />
            </div>

            <div className="mb-6">
              <PieChartComponent
                data={projectRevenueData}
                title="Project Revenue Distribution"
                labelKey="project"
                valueKey="revenue"
              />
            </div>

            <div className="mb-6">
              <h3 className="text-heading font-semibold mb-4">
                Project Performance Details
              </h3>
              <CommonTable
                data={projectRevenueData}
                headers={projectTableHeaders}
                emptyState="No project data available"
              />
            </div>
          </>
        )}

        {selectedGroup === "individual" && (
          <>
            <div className="mb-6">
              <BarChartComponent
                data={individualRevenueData}
                title="Top Individual Contributors"
                dataKey="revenue"
                categoryKey="name"
              />
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">
                Individual Performance Rankings
              </h3>
              <CommonTable
                data={individualRevenueData}
                headers={individualTableHeaders}
                emptyState="No individual performance data available"
              />
            </div>
          </>
        )}

        <div className="bg-gradient-to-bl from-[#00C6FF] to-[#9B5FFF] rounded-xl shadow-glow p-6 ">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-heading text-white mb-1">
                Revenue Achievement
              </h3>
              <p className="text-subtitle text-white">
                Current performance vs projected targets
              </p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-white">
                {achievementPercentage.toFixed(1)}%
              </p>
              <p className="text-subtitle text-white">of projected revenue</p>
            </div>
          </div>
          <div className="mt-4 bg-brand-200/20 rounded-full h-3 overflow-hidden">
            <div
              className="bg-success-500 h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(achievementPercentage, 100)}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueReports;

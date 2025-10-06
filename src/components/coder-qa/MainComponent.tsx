"use client";

import AnalyticsMetrics from "@/components/analytics/AnalyticsMetrics";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import Button from "../ui/button/Button";
import SearchableSelect from "../form/SearchableSelect";
import { teams } from "../user-management/user-list/modals/UserListModal";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card1/card";
import { PieChartIcon } from "@/icons";
import { useMemo, useState } from "react";
import { BarChart3Icon, Download } from "lucide-react";
import TargetAchievedChart from "../logistics/TargetAchivedChart";
import HourlyTeamProductivity from "../saas/HourlyTeamProductivity";

export default function MainComponent() {
  const [timeFilter, setTimeFilter] = useState<
    "all" | "day" | "week" | "month"
  >("all");

  const priorityDistribution = useMemo(
    () => [
      { name: "Medium", value: 42, color: "#3b82f6" },
      { name: "Low", value: 15, color: "#6b7280" },
      { name: "High", value: 31, color: "#f59e0b" },
      { name: "Critical", value: 13, color: "#ef4444" },
    ],
    []
  );

  const taskStatusDistribution = useMemo(
    () => [
      { name: "Unassigned", value: 20, color: "#6b7280" },
      { name: "Coding", value: 50, color: "#3b82f6" },
      { name: "Under QA", value: 35, color: "#f59e0b" },
      { name: "Hold", value: 10, color: "#ef4444" },
      { name: "Rehold", value: 5, color: "#f97316" },
      { name: "Submission", value: 20, color: "#10b981" },
    ],
    []
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-4 space-y-4 md:space-y-0">
        <div className="flex flex-col gap-1 w-full md:w-auto">
          <h5 className="text-gray-600 dark:text-gray-500 text-base md:text-lg font-medium">
            Dashboard / Coder QA
          </h5>
          <h1 className="text-gray-500 dark:text-gray-400 font-small text-xs">
            Own Your Day with Effortless Planning.
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-[179px]">
            <SearchableSelect
              dataProps={{
                optionData: teams?.map((opt) => ({
                  _id: opt.value,
                  name: opt.label,
                })),
              }}
              selectionProps={{}}
              displayProps={{
                placeholder: "Select team...",
                id: "team",
                isClearable: true,
              }}
              eventHandlers={{}}
            />
          </div>
          <Button variant="outline" className="w-full sm:w-[179px]">
            <Download className="h-5 w-5" />
            <span>Download Data</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <AnalyticsMetrics />
        </div>

        <div className="col-span-12 xl:col-span-12 gap-2 space-y-4">
          <HourlyTeamProductivity />
          <TargetAchievedChart />
        </div>

        <div className="col-span-12 lg:col-span-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <BarChart3Icon className="h-5 w-5 text-purple-500" />
                Task Distribution by Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={taskStatusDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                    {taskStatusDistribution.map((entry, index) => (
                      <Cell key={`bar-cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-12 lg:col-span-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <PieChartIcon className="text-success-500" />
                Task Distribution by Priority
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300} className="border-none outline-none">
                <PieChart>
                  <Pie
                    data={priorityDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {priorityDistribution.map((entry, index) => (
                      <Cell key={`priority-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, `Tasks`]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

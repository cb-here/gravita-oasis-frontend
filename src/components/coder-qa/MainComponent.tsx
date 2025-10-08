"use client";

import AnalyticsMetrics from "@/components/analytics/AnalyticsMetrics";
import Button from "../ui/button/Button";
import SearchableSelect from "../form/SearchableSelect";
import { teams } from "../user-management/user-list/modals/UserListModal";
import TargetAchievedChart from "../logistics/TargetAchivedChart";
import HourlyTeamProductivity from "../saas/HourlyTeamProductivity";
import SessionChart from "../analytics/SessionChart";
import StatusDistribution from "./charts/StatusDistribution";
import { Download } from "lucide-react";

export default function MainComponent() {
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
          <Button variant="outline" className="w-full sm:w-[179px] h-11">
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
          <StatusDistribution />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <SessionChart />
        </div>
      </div>
    </div>
  );
}

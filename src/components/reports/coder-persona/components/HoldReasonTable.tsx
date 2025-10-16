import { List } from "lucide-react";
import CommonTable, { HeaderType } from "@/components/common/CommonTable";
import Badge from "@/components/ui/badge/Badge";

type HoldReasonData = {
  holdReason: string;
  total: number;
  valid: number;
  avgResolution: number;
  validityPercent: number;
};

export default function HoldReasonsTable() {
  const holdReasonsData: HoldReasonData[] = [
    {
      holdReason: "Need Clinical Follow-up",
      total: 7,
      valid: 7,
      avgResolution: 18.5,
      validityPercent: 100,
    },
    {
      holdReason: "Missing Documentation",
      total: 5,
      valid: 5,
      avgResolution: 12.3,
      validityPercent: 100,
    },
    {
      holdReason: "Need NOC",
      total: 4,
      valid: 3,
      avgResolution: 24.2,
      validityPercent: 75,
    },
    {
      holdReason: "Other",
      total: 2,
      valid: 1,
      avgResolution: 8.5,
      validityPercent: 50,
    },
  ];

  const holdReasonsHeaders: HeaderType<HoldReasonData>[] = [
    {
      label: "Hold Reason",
      render: (item) => item.holdReason,
      width: 250,
    },
    {
      label: "Total",
      render: (item) => item.total,
      width: 120,
    },
    {
      label: "Valid",
      render: (item) => (
        <span className="font-bold text-green-600 dark:text-green-400">
          {item.valid}
        </span>
      ),
      width: 120,
    },
    {
      label: "Avg Resolution (hrs)",
      render: (item) => item.avgResolution,
      width: 180,
    },
    {
      label: "Validity %",
      render: (item) => {
        const color =
          item.validityPercent === 100
            ? "success"
            : item.validityPercent >= 75
            ? "warning"
            : "error";
        return (
          <Badge color={color} size="sm">
            {item.validityPercent}%
          </Badge>
        );
      },
      width: 150,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors mb-8 p-2">
      <div className="py-4 border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <List className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            Hold Reasons Breakdown
          </h3>
        </div>
      </div>
      <CommonTable
        headers={holdReasonsHeaders}
        data={holdReasonsData}
        className="mb-6"
      />
    </div>
  );
}
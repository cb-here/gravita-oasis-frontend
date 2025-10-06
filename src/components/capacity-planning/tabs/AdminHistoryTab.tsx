import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { SubmissionRecord } from "../types/planning";
import FilterButton from "@/components/common/filter/FilterButton";
import FilterModal from "@/components/common/filter/FilterModal";
import Search from "@/components/common/Search";
import CommonTable, { HeaderType } from "@/components/common/CommonTable";
import TableFooter from "@/components/common/TableFooter";
import ExportButton from "@/components/ui/button/ExportButton";
import { getStatusBadge } from "./AdminApprovalTab";

interface AdminHistoryTabProps {
  submissions: SubmissionRecord[];
}

export const AdminHistoryTab: React.FC<AdminHistoryTabProps> = ({
  submissions,
}) => {
  const initParams = {
    search: "",
    page: 1,
    limit: 10,
    status: "",
    team: "",
  };

  const [historyParams, setHistoryParams] = useState(initParams);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  // const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Filter only processed submissions
  const processedSubmissions = submissions.filter(
    (sub) => sub.status === "approved" || sub.status === "rejected"
  );

  // Get unique teams for filter
  const uniqueTeams = Array.from(
    new Set(processedSubmissions.map((sub) => sub.teamName))
  );

  // Apply filters
  const filteredSubmissions = useMemo(() => {
    return processedSubmissions.filter((submission) => {
      const matchesSearch =
        submission.teamName
          .toLowerCase()
          .includes(historyParams.search.toLowerCase()) ||
        submission.raisedBy
          .toLowerCase()
          .includes(historyParams.search.toLowerCase()) ||
        (submission.adminApproval?.comments || "")
          .toLowerCase()
          .includes(historyParams.search.toLowerCase());

      const matchesStatus =
        !historyParams.status || submission.status === historyParams.status;
      const matchesTeam =
        !historyParams.team || submission.teamName === historyParams.team;

      return matchesSearch && matchesStatus && matchesTeam;
    });
  }, [processedSubmissions, historyParams]);

  // Pagination
  const totalPages = Math.ceil(
    filteredSubmissions.length / historyParams.limit
  );
  const startIndex = (historyParams.page - 1) * historyParams.limit;
  const endIndex = Math.min(
    startIndex + historyParams.limit,
    filteredSubmissions.length
  );
  const paginatedSubmissions = filteredSubmissions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setHistoryParams((prev) => ({ ...prev, page }));
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value, 10);
    setHistoryParams((prev) => ({ ...prev, page: 1, limit: newLimit }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHistoryParams((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setHistoryParams((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    setHistoryParams((prev) => ({ ...prev, page: 1 }));
    setIsFilterModalOpen(false);
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const csvContent = [
        [
          "Team Name",
          "Raised By",
          "Submission Date",
          "Decision Date",
          "Status",
          "Approver",
          "Comments",
          "Coding Tasks",
          "QA Capacity",
          "Total Targets",
        ],
        ...filteredSubmissions.map((sub) => [
          sub.teamName,
          sub.raisedBy,
          format(sub.timestamp, "yyyy-MM-dd HH:mm"),
          sub.adminApproval
            ? format(sub.adminApproval.approvedAt, "yyyy-MM-dd HH:mm")
            : "",
          sub.status,
          sub.adminApproval?.approvedBy || "",
          sub.adminApproval?.comments || "",
          sub.metrics.totalCodingTasks.toString(),
          sub.metrics.totalQACapacity.toString(),
          sub.metrics.totalTargets.toString(),
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `admin-approval-history-${format(
        new Date(),
        "yyyy-MM-dd"
      )}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setExportLoading(false);
    }
  };

  // Table headers
  const historyHeaders: HeaderType<SubmissionRecord>[] = [
    {
      label: "Team",
      render: (item) => <span className="font-medium">{item.teamName}</span>,
      width: 180,
    },
    {
      label: "Raised By",
      render: (item) => item.raisedBy,
      width: 180,
    },
    {
      label: "Submitted",
      render: (item) => format(item.timestamp, "MMM dd, yyyy HH:mm"),
      width: 180,
    },
    {
      label: "Decision Date",
      render: (item) =>
        item.adminApproval
          ? format(item.adminApproval.approvedAt, "MMM dd, yyyy HH:mm")
          : "-",
      width: 180,
    },
    {
      label: "Status",
      render: (item) => getStatusBadge(item.status),
      width: 150,
    },
    {
      label: "Approver",
      render: (item) => item.adminApproval?.approvedBy || "-",
      width: 180,
    },
    {
      label: "Comments",
      render: (item) => (
        <span
          className="max-w-xs truncate block"
          title={item.adminApproval?.comments}
        >
          {item.adminApproval?.comments || "-"}
        </span>
      ),
      width: 250,
    },
    {
      label: "Metrics",
      render: (item) => (
        <div className="text-xs space-y-1 font-medium">
          <div className="text-blue-600">
            Coding: {item.metrics.totalCodingTasks}
          </div>
          <div className="text-green-600">
            QA: {item.metrics.totalQACapacity}
          </div>
          <div className="text-purple-600">
            Targets: {item.metrics.totalTargets}
          </div>
        </div>
      ),
      width: 160,
    },
  ];

  return (
    <div className="space-y-6 mt-6">
      {/* Header with Search and Actions */}
      <div className="flex flex-col items-center justify-between gap-2 md:flex-row w-full">
        <Search
          className="w-full md:w-auto xl:w-[400px]"
          placeholder="Search by team, raised by, or comments..."
          value={historyParams.search}
          onChange={handleSearch}
        />
        <div className="flex flex-col items-center gap-3 md:flex-row w-full justify-end">
          <FilterModal
            isOpen={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
            title="Filter History"
            description="Filter approval history based on your criteria"
            filters={[
              {
                key: "status",
                label: "Status",
                options: [
                  { label: "Approved", value: "approved" },
                  { label: "Rejected", value: "rejected" },
                ],
              },
              {
                key: "team",
                label: "Team",
                options: uniqueTeams.map((team) => ({
                  label: team,
                  value: team,
                })),
              },
            ]}
            filterValues={historyParams as any}
            onFilterChange={handleFilterChange}
            onApply={handleApplyFilters}
            className="max-w-[600px]"
          />
          <FilterButton
            onClick={() => setIsFilterModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2"
          />
          <ExportButton loading={exportLoading} onClick={handleExport} />
        </div>
      </div>

      {/* History Table */}
      <CommonTable
        headers={historyHeaders}
        data={paginatedSubmissions}
        rowIdAccessor="id"
        emptyState="No approval history found"
      />

      <TableFooter
        rowsPerPage={historyParams.limit}
        handleRowsPerPageChange={handleRowsPerPageChange}
        currentPage={historyParams.page}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        totalEntries={filteredSubmissions.length}
        startIndex={startIndex}
        endIndex={endIndex}
      />
    </div>
  );
};

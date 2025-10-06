"use client";

import CommonTable from "@/components/common/CommonTable";
import FilterButton from "@/components/common/filter/FilterButton";
import FilterModal from "@/components/common/filter/FilterModal";
import Search from "@/components/common/Search";
import AvatarText from "@/components/ui/avatar/AvatarText";
import Badge from "@/components/ui/badge/Badge";
import ExportButton from "@/components/ui/button/ExportButton";
import { Tooltip } from "@/components/ui/tooltip/Tooltip";
import { useModal } from "@/hooks/useModal";
import { DownloadIcon } from "@/icons";
import { format } from "date-fns";
import { InfoIcon } from "lucide-react";
import { useState, useRef } from "react";
import DownloadModal from "./modals/DownloadModal";
import TableFooter from "@/components/common/TableFooter";
import ViewBulkModal from "./modals/ViewBulkModal";

export default function MainComponent() {
  const mainModal = useModal();
  const downloadModal = useModal();
  const safeRender = (value: any): string => {
    if (value === null || value === undefined) return "";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  const [bulkData, setBulkData] = useState<any>({
    totalRecords: 8,
    BulkCreationData: [
      {
        id: 1,
        serial_number: 1,
        file_name: "tasks_batch_01.csv",
        upload_date: "2025-09-25T10:15:00Z",
        created_by: "Alice Johnson",
        total_tasks: 150,
        success_tasks: 145,
        failed_tasks: 5,
      },
      {
        id: 2,
        serial_number: 2,
        file_name: "marketing_leads.xlsx",
        upload_date: "2025-09-26T09:30:00Z",
        created_by: "Bob Smith",
        total_tasks: 200,
        success_tasks: 200,
        failed_tasks: 0,
      },
      {
        id: 3,
        serial_number: 3,
        file_name: "sales_q3_upload.csv",
        upload_date: "2025-09-27T13:45:00Z",
        created_by: "Charlie Davis",
        total_tasks: 320,
        success_tasks: 315,
        failed_tasks: 5,
      },
      {
        id: 4,
        serial_number: 4,
        file_name: "onboarding_users.json",
        upload_date: "2025-09-28T08:20:00Z",
        created_by: "Diana Prince",
        total_tasks: 100,
        success_tasks: 98,
        failed_tasks: 2,
      },
      {
        id: 5,
        serial_number: 5,
        file_name: "inactive_cleanup.csv",
        upload_date: "2025-09-29T11:10:00Z",
        created_by: "Ethan Brown",
        total_tasks: 75,
        success_tasks: 74,
        failed_tasks: 1,
      },
      {
        id: 6,
        serial_number: 6,
        file_name: "newsletter_emails.xlsx",
        upload_date: "2025-09-30T14:00:00Z",
        created_by: "Fiona White",
        total_tasks: 500,
        success_tasks: 495,
        failed_tasks: 5,
      },
      {
        id: 7,
        serial_number: 7,
        file_name: "app_bug_reports.csv",
        upload_date: "2025-10-01T16:30:00Z",
        created_by: "George Miller",
        total_tasks: 220,
        success_tasks: 210,
        failed_tasks: 10,
      },
      {
        id: 8,
        serial_number: 8,
        file_name: "customer_feedback.json",
        upload_date: "2025-10-02T09:50:00Z",
        created_by: "Hannah Lee",
        total_tasks: 180,
        success_tasks: 180,
        failed_tasks: 0,
      },
    ],
  });

  const initParams = {
    search: "",
    page: 1,
    limit: 10,
    status: "",
    endDate: "",
    startDate: "",
  };

  const [bulkParams, setBulkParams] = useState<any>(initParams);

  const [loading, setLoading] = useState(false);

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const totalPages = Math.ceil(bulkData?.totalRecords / bulkParams?.limit);
  const startIndex = (bulkParams?.page - 1) * bulkParams?.limit;
  const endIndex = Math.min(
    startIndex + bulkParams?.limit,
    bulkData?.totalRecords
  );

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [exportLoading, setExportLoading] = useState(false);

  const getBulkData = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    setLoading(true);
    try {
      const res = await {
        page: params?.page ?? bulkParams?.page,
        limit: params?.limit ?? bulkParams?.limit,
        search: params?.search ?? bulkParams?.search,
        status: params?.status ?? bulkParams?.status,
        startDate: params?.startDate ?? bulkParams?.startDate,
        endDate: params?.endDate ?? bulkParams?.endDate,
      };
      setBulkData(res);
    } catch (err) {
      console.error("Failed to fetch bulk creation logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    setBulkParams((prev: any) => ({ ...prev, page: page }));
    await getBulkData({ page });
  };

  const handleRowsPerPageChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newRowsPerPage = parseInt(e.target.value, 10);
    setBulkParams((prev: any) => ({
      ...prev,
      page: 1,
      limit: newRowsPerPage,
    }));
    await getBulkData({ page: 1, limit: newRowsPerPage });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBulkParams((prev: any) => ({ ...prev, search: value }));
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    setLoading(true);
    searchTimeout.current = setTimeout(async () => {
      await getBulkData({ page: 1, search: value });
      setBulkParams((prev: any) => ({ ...prev, page: 1 }));
      setLoading(false);
    }, 1000);
  };

  const handleFilterChange = async (key: string, value: string) => {
    setBulkParams((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = async (filters: any) => {
    await getBulkData(filters);
    setIsFilterModalOpen(false);
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
    } catch (error: unknown) {
      console.log("🚀 ~ handleExport ~ error:", error);
    } finally {
      setExportLoading(false);
    }
  };

  const headers = [
    {
      label: "Sr. No.",
      render: (item: any) => (
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {safeRender(item.serial_number)}
        </span>
      ),
      className: "w-[100px] max-w-[100px]",
      width: 100,
    },
    {
      label: "File Name",
      sortable: true,
      render: (item: any) => (
        <div
          className="cursor-pointer text-brand-500 hover:underline hover:text-brand-700"
          onClick={() => {
            setSelectedItem(item);
            mainModal.openModal();
          }}
        >
          {safeRender(item?.file_name)}
        </div>
      ),
    },
    {
      label: "Upload Date",
      sortable: true,
      render: (item: any) => (
        <span>
          {item?.upload_date
            ? format(new Date(item.upload_date), "MMM d, yyyy, hh:mm a")
            : "Unknown Date"}
        </span>
      ),
    },
    {
      label: "Created By",
      render: (item: any) => (
        <div className="flex items-center gap-3">
          <AvatarText name={String(item?.created_by || "Unknown")} />
          <div>
            <span className="mb-0.5 block text-theme-sm font-medium text-gray-700 dark:text-gray-400">
              {String(item?.created_by || "Unknown")}
            </span>
          </div>
        </div>
      ),
    },
    {
      label: "Total Tasks",
      sortable: true,
      render: (item: any) => <span>{safeRender(item?.total_tasks)}</span>,
      className: "w-[100px] max-w-[100px]",
      
    },
    {
      label: "Success Tasks",
      render: (item: any) => (
        <Badge variant="light" color="success" size="sm">
          {safeRender(item?.success_tasks)}
        </Badge>
      ),
      
    },
    {
      label: "Failed Tasks",
      render: (item: any) => (
        <Badge
          variant="light"
          color={item?.failed_tasks > 0 ? "error" : "success"}
          size="sm"
        >
          {item?.failed_tasks !== 0
            ? `${safeRender(item?.failed_tasks)} Failed`
            : "No Errors"}
        </Badge>
      ),
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="flex flex-col gap-1 w-full md:w-auto">
        <h2 className="text-heading">Bulk Creation Log</h2>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-2 space-y-2 md:space-y-0">
        <div className="flex flex-col items-center justify-between gap-2 mb-3 md:flex-row w-full">
          <Search
            className="w-full md:w-auto xl:w-[400px]"
            placeholder="Search..."
            value={bulkParams?.search}
            onChange={handleSearch}
          />
          <div className="flex flex-col items-center gap-3 md:flex-row w-full justify-end">
            <FilterModal
              isOpen={isFilterModalOpen}
              onClose={() => setIsFilterModalOpen(false)}
              title="Filter Bulk Creation Logs"
              description="Filter items based on your criteria"
              filters={[
                {
                  key: "status",
                  label: "Status",
                  options: [
                    { label: "Active", value: "Active" },
                    { label: "Inactive", value: "Inactive" },
                  ],
                },
                {
                  key: "date",
                  label: "Date Range",
                  type: "dateRange",
                },
              ]}
              filterValues={bulkParams}
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
      </div>

      <CommonTable
        headers={headers}
        data={bulkData?.BulkCreationData || []}
        loading={loading}
        actions={(item: any) => (
          <>
            <Tooltip content="Info" position="left">
              <button
                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90"
                onClick={() => {
                  setSelectedItem(item);
                  mainModal.openModal();
                }}
              >
                <InfoIcon />
              </button>
            </Tooltip>
            <Tooltip content="Download" position="left">
              <button
                className="text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-500"
                onClick={() => {
                  setSelectedItem(item);
                  downloadModal.openModal();
                }}
              >
                <DownloadIcon />
              </button>
            </Tooltip>
          </>
        )}
      />
      <TableFooter
        rowsPerPage={bulkParams?.limit}
        handleRowsPerPageChange={handleRowsPerPageChange}
        currentPage={bulkParams?.page}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        totalEntries={bulkData?.totalRecords}
        startIndex={startIndex}
        endIndex={endIndex}
      />
      <ViewBulkModal
        isOpen={mainModal.isOpen}
        closeModal={mainModal.closeModal}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
      />
      <DownloadModal
        isOpen={downloadModal.isOpen}
        closeModal={downloadModal.closeModal}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
      />
    </div>
  );
}

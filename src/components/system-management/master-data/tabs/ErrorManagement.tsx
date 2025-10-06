"use client";

import CommonTable from "@/components/common/CommonTable";
import FilterButton from "@/components/common/filter/FilterButton";
import FilterModal from "@/components/common/filter/FilterModal";
import Search from "@/components/common/Search";
import TableFooter from "@/components/common/TableFooter";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import ExportButton from "@/components/ui/button/ExportButton";
import { Tooltip } from "@/components/ui/tooltip/Tooltip";
import { useModal } from "@/hooks/useModal";
import { PencilIcon, TrashBinIcon } from "@/icons";
import React, { useState, useRef } from "react";
import Tabs from "@/components/common/tabs/Tabs";
import Switch from "@/components/form/switch/Switch";
import ErrorCategoryManagementModal from "../modals/ErrorCategoryManagementModal";
import FilterAndSortPills from "@/components/common/filter/FilterAndSortPills";

const sectionGroups = [
  { name: "Coding", key: "coding" },
  { name: "Oasis", key: "oasis" },
  { name: "POC", key: "poc" },
];

export default function ErrorManagement() {
  const mainModal = useModal();

  const [errorData, setErrorData] = useState<any>({
    totalRecords: 6,
    Errors: [
      {
        id: 1,
        name: "UI Bug",
        displayName: "Button Misalignment",
        pointValue: 5,
        description:
          "The submit button on the login page is not aligned properly.",
        status: "Active",
      },
      {
        id: 2,
        name: "Backend Error",
        displayName: "API Timeout",
        pointValue: 8,
        description: "User data API sometimes times out under heavy load.",
        status: "Active",
      },
      {
        id: 3,
        name: "Performance Issue",
        displayName: "Slow Loading Dashboard",
        pointValue: 7,
        description: "Dashboard takes more than 5 seconds to load on average.",
        status: "Inactive",
      },
      {
        id: 4,
        name: "Security Flaw",
        displayName: "XSS Vulnerability",
        pointValue: 10,
        description: "Reflected XSS found on the feedback form.",
        status: "Active",
      },
      {
        id: 5,
        name: "Database Issue",
        displayName: "Duplicate Records",
        pointValue: 6,
        description: "Some orders are being inserted twice into the database.",
        status: "Pending",
      },
      {
        id: 6,
        name: "UI Enhancement",
        displayName: "Tooltip Missing",
        pointValue: 3,
        description: "Add tooltip on hover for icons in the dashboard.",
        status: "Active",
      },
      {
        id: 7,
        name: "Integration Bug",
        displayName: "Payment Gateway",
        pointValue: 9,
        description: "Transactions fail intermittently on PayPal integration.",
        status: "Inactive",
      },
      {
        id: 8,
        name: "Accessibility Issue",
        displayName: "Screen Reader",
        pointValue: 4,
        description:
          "Screen reader cannot properly read the forms on the signup page.",
        status: "Active",
      },
    ],
  });

  const initParams = {
    search: "",
    page: 1,
    limit: 10,
    status: "",
    section: "coding",
  };

  const [errorParams, setErrorParams] = useState<any>(initParams);

  const [loading, setLoading] = useState(false);

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const totalPages = Math.ceil(errorData?.totalRecords / errorParams?.limit);
  const startIndex = (errorParams?.page - 1) * errorParams?.limit;
  const endIndex = Math.min(
    startIndex + errorParams?.limit,
    errorData?.totalRecords
  );

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedError, setSelectedError] = useState<any>(null);
  const [modalType, setModalType] = useState<any>("");
  const [exportLoading, setExportLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("coding");

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
  };

  const getErrors = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    section?: string;
  }) => {
    setLoading(true);
    try {
      const res = await {
        page: params?.page ?? errorParams?.page,
        limit: params?.limit ?? errorParams?.limit,
        search: params?.search ?? errorParams?.search,
        status: params?.status ?? errorParams?.status,
        section: params?.section ?? errorParams?.section,
      };
      setErrorData(res);
    } catch (err) {
      console.error("Failed to fetch teams:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    setErrorParams((prev: any) => ({ ...prev, page: page }));
    await getErrors({ page });
  };

  const handleRowsPerPageChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newRowsPerPage = parseInt(e.target.value, 10);
    setErrorParams((prev: any) => ({
      ...prev,
      page: 1,
      limit: newRowsPerPage,
    }));
    await getErrors({ page: 1, limit: newRowsPerPage });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setErrorParams((prev: any) => ({ ...prev, search: value }));
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    setLoading(true);
    searchTimeout.current = setTimeout(async () => {
      await getErrors({ page: 1, search: value });
      setErrorParams((prev: any) => ({ ...prev, page: 1 }));
      setLoading(false);
    }, 1000);
  };

  const handleFilterChange = async (key: string, value: string) => {
    setErrorParams((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = async (filters: any) => {
    await getErrors(filters);
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
      label: "Name",
      sortable: true,
      render: (row: any) => (
        <div className="flex flex-col">
          <span>{row.name}</span>
          <span className="text-sm text-gray-500">{row.displayName}</span>
        </div>
      ),
    },
    {
      label: "Point Value",
      sortable: true,
      render: (row: any) => (
        <span className="font-medium">{row.pointValue}</span>
      ),
    },
    {
      label: "Description",
      sortable: true,
      render: (row: any) => (
        <span className="font-medium">{row.description}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row: any) => (
        <Badge
          className={`px-2 py-1 rounded text-xs font-semibold`}
          color={row.status === "Active" ? "success" : "error"}
        >
          {row.status}
        </Badge>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col items-center justify-between gap-2 mb-3 md:flex-row w-full">
        <Search
          className="w-full md:w-auto xl:w-[400px]"
          placeholder="Search Errors..."
          value={errorParams?.search}
          onChange={handleSearch}
        />
        <div className="flex flex-col items-center gap-3 md:flex-row w-full justify-end">
          <Button
            className="sm:w-auto w-full"
            onClick={() => {
              setSelectedError(null);
              setModalType("add");
              mainModal.openModal();
            }}
          >
            Add New Error Category
          </Button>
          <FilterModal
            isOpen={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
            title="Filter Errors..."
            description="Filter errors based on your criteria"
            filters={[
              {
                key: "status",
                label: "Status",
                options: [
                  { label: "Active", value: "Active" },
                  { label: "Inactive", value: "Inactive" },
                ],
              },
            ]}
            filterValues={errorParams}
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
      <div className="w-fit">
        <Tabs
          tabGroups={sectionGroups}
          selectedTabGroup={activeTab}
          onClick={handleTabClick}
        />
      </div>
      <div className="-mt-6">
        <FilterAndSortPills filters={errorParams} onRemoveFilter={() => {}} />
      </div>
      <CommonTable
        headers={headers}
        data={errorData?.Errors || []}
        actions={(item: any) => (
          <div className="flex items-center gap-1">
            <Switch
              checked={item.status === "Active"}
              onChange={(checked: boolean) => {
                setErrorData((prev: any) => {
                  const newErrors = prev.Errors.map((e: any) =>
                    e.id === item.id
                      ? { ...e, status: checked ? "Active" : "Inactive" }
                      : e
                  );
                  return { ...prev, Errors: newErrors };
                });
              }}
            />

            <Tooltip content="Edit" position="left">
              <button
                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90"
                onClick={() => {
                  setModalType("edit");
                  setSelectedError(item);
                  mainModal.openModal();
                }}
              >
                <PencilIcon />
              </button>
            </Tooltip>
            <Tooltip content="Delete" position="left">
              <button
                className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500"
                onClick={() => {
                  setModalType("delete");
                  setSelectedError(item);
                  mainModal.openModal();
                }}
              >
                <TrashBinIcon />
              </button>
            </Tooltip>
          </div>
        )}
        loading={loading}
      />
      <TableFooter
        rowsPerPage={errorParams?.limit}
        handleRowsPerPageChange={handleRowsPerPageChange}
        currentPage={errorParams?.page}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        totalEntries={errorData?.totalRecords}
        startIndex={startIndex}
        endIndex={endIndex}
      />

      <ErrorCategoryManagementModal
        isOpen={mainModal.isOpen}
        closeModal={mainModal.closeModal}
        modelType={modalType}
        setModelType={setModalType}
        selectedError={selectedError}
        setSelectedError={setSelectedError}
      />
    </div>
  );
}

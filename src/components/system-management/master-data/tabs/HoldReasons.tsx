"use client";

import CommonTable from "@/components/common/CommonTable";
import FilterButton from "@/components/common/filter/FilterButton";
import FilterModal from "@/components/common/filter/FilterModal";
import Search from "@/components/common/Search";
import TableFooter from "@/components/common/TableFooter";
import AvatarText from "@/components/ui/avatar/AvatarText";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import ExportButton from "@/components/ui/button/ExportButton";
import { Tooltip } from "@/components/ui/tooltip/Tooltip";
import { useModal } from "@/hooks/useModal";
import { PencilIcon, TrashBinIcon } from "@/icons";
import React, { useState, useRef } from "react";
import FilterAndSortPills from "@/components/common/filter/FilterAndSortPills";
import ReasonModal from "../modals/ReasonModal";
import Switch from "@/components/form/switch/Switch";

export default function HoldReasons() {
  const mainModal = useModal();

  const [reasons, setReasons] = useState<any>({
    totalRecords: 8,
    Reasons: [
      {
        id: 1,
        fullName: "Awaiting Customer Response",
        description: "The customer has not replied to recent communication.",
        status: "Active",
      },
      {
        id: 2,
        fullName: "Missing Documentation",
        description:
          "Required documents or verification details are pending from the customer.",
        status: "Active",
      },
      {
        id: 3,
        fullName: "Payment Pending",
        description:
          "The customer has not completed the payment or deposit required to proceed.",
        status: "Active",
      },
      {
        id: 4,
        fullName: "Internal Review Required",
        description:
          "The case is under review by compliance or management before moving forward.",
        status: "Pending",
      },
      {
        id: 5,
        fullName: "Technical Issue",
        description:
          "A system or integration issue is preventing further processing.",
        status: "Active",
      },
      {
        id: 6,
        fullName: "Awaiting Third-Party Approval",
        description:
          "Waiting for confirmation or approval from an external vendor or partner.",
        status: "Pending",
      },
      {
        id: 7,
        fullName: "Customer Requested Hold",
        description: "The customer has asked to pause the process temporarily.",
        status: "Inactive",
      },
      {
        id: 8,
        fullName: "Resource Unavailable",
        description:
          "Internal resource or staff availability is delaying the process.",
        status: "Active",
      },
    ],
  });

  const initParams = {
    search: "",
    page: 1,
    limit: 10,
    status: "",
  };

  const [reasonParams, setReasonParams] = useState<any>(initParams);

  const [loading, setLoading] = useState(false);

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const totalPages = Math.ceil(reasons?.totalRecords / reasonParams?.limit);
  const startIndex = (reasonParams?.page - 1) * reasonParams?.limit;
  const endIndex = Math.min(
    startIndex + reasonParams?.limit,
    reasons?.totalRecords
  );

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState<any>(null);
  const [modalType, setModalType] = useState<any>("");
  const [exportLoading, setExportLoading] = useState(false);

  const getReasons = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => {
    setLoading(true);
    try {
      const res = await {
        page: params?.page ?? reasonParams?.page,
        limit: params?.limit ?? reasonParams?.limit,
        search: params?.search ?? reasonParams?.search,
        status: params?.status ?? reasonParams?.status,
      };
      setReasons(res);
    } catch (err) {
      console.error("Failed to fetch reasons:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    setReasonParams((prev: any) => ({ ...prev, page: page }));
    await getReasons({ page });
  };

  const handleRowsPerPageChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newRowsPerPage = parseInt(e.target.value, 10);
    setReasonParams((prev: any) => ({
      ...prev,
      page: 1,
      limit: newRowsPerPage,
    }));
    await getReasons({ page: 1, limit: newRowsPerPage });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setReasonParams((prev: any) => ({ ...prev, search: value }));
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    setLoading(true);
    searchTimeout.current = setTimeout(async () => {
      await getReasons({ page: 1, search: value });
      setReasonParams((prev: any) => ({ ...prev, page: 1 }));
      setLoading(false);
    }, 1000);
  };

  const handleFilterChange = async (key: string, value: string) => {
    setReasonParams((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = async (filters: any) => {
    await getReasons(filters);
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
      render: (row: any) => {
        const safeFullName =
          typeof row.fullName === "string" ? row.fullName : "Unknown User";
        return (
          <div className="flex items-center gap-2">
            <AvatarText name={safeFullName} />
            <span>{safeFullName}</span>
          </div>
        );
      },
    },
    {
      label: "Description",
      sortable: true,
      render: (row: any) => (
        <span>{row?.description ?? "No Description Available"}</span>
      ),
    },
    {
      label: "Status",
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center justify-center">
          <Badge
            className="text-xs"
            color={
              row?.status === "Active"
                ? "success"
                : row?.status === "Inactive"
                ? "error"
                : row?.status === "Pending"
                ? "warning"
                : "info"
            }
            variant="light">
            {row?.status ?? "Unknown"}
          </Badge>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col items-center justify-between gap-2 mb-3 md:flex-row w-full">
        <Search
          className="w-full md:w-auto xl:w-[400px]"
          placeholder="Search reasons"
          value={reasonParams?.search}
          onChange={handleSearch}
        />
        <div className="flex flex-col items-center gap-3 md:flex-row w-full justify-end">
          <Button
            className="sm:w-auto w-full"
            onClick={() => {
              setSelectedReason(null);
              setModalType("add");
              mainModal.openModal();
            }}>
            Add New Hold Reason
          </Button>
          <FilterModal
            isOpen={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
            title="Filter Hold Reasons"
            description="Filter hold reasons based on your criteria"
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
            filterValues={reasonParams}
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
      <FilterAndSortPills filters={reasonParams} onRemoveFilter={() => {}} />
      <CommonTable
        headers={headers}
        data={reasons?.Reasons || []}
        actions={(item: any) => (
          <>
            <Switch />
            <Tooltip content="Edit" position="left">
              <button
                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90"
                onClick={() => {
                  setModalType("edit");
                  setSelectedReason(item);
                  mainModal.openModal();
                }}>
                <PencilIcon />
              </button>
            </Tooltip>
            <Tooltip content="Delete" position="left">
              <button
                className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500"
                onClick={() => {
                  setModalType("delete");
                  setSelectedReason(item);
                  mainModal.openModal();
                }}>
                <TrashBinIcon />
              </button>
            </Tooltip>
          </>
        )}
        loading={loading}
      />
      <TableFooter
        rowsPerPage={reasonParams?.limit}
        handleRowsPerPageChange={handleRowsPerPageChange}
        currentPage={reasonParams?.page}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        totalEntries={reasons?.totalRecords}
        startIndex={startIndex}
        endIndex={endIndex}
      />

      <ReasonModal
        isOpen={mainModal.isOpen}
        closeModal={mainModal.closeModal}
        modelType={modalType}
        setModelType={setModalType}
        selectedReason={selectedReason}
        setSelectedReason={setSelectedReason}
      />
    </div>
  );
}

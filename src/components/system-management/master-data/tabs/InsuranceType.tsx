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
import InsuranceModal from "../modals/InsuranceModal";
import FilterAndSortPills from "@/components/common/filter/FilterAndSortPills";

export default function InsuranceType() {
  const mainModal = useModal();

  const [insurances, setInsurances] = useState<any>({
    totalRecords: 8,
    Insurances: [
      {
        id: 1,
        fullName: "Health Insurance",
        description: "Covers hospitalization, surgery, and medical expenses",
        status: "Active",
      },
      {
        id: 2,
        fullName: "Life Insurance",
        description: "Provides financial support to beneficiaries after death",
        status: "Inactive",
      },
      {
        id: 3,
        fullName: "Vehicle Insurance",
        description: "Covers accidental damage and third-party liability",
        status: "Active",
      },
      {
        id: 4,
        fullName: "Travel Insurance",
        description: "Protects against trip cancellations, medical emergencies",
        status: "Pending",
      },
      {
        id: 5,
        fullName: "Home Insurance",
        description: "Covers damages to house and belongings",
        status: "Active",
      },
      {
        id: 6,
        fullName: "Pet Insurance",
        description: "Helps cover vet bills and pet medical expenses",
        status: "Inactive",
      },
      {
        id: 7,
        fullName: "Business Insurance",
        description: "Covers risks for business operations and assets",
        status: "Active",
      },
      {
        id: 8,
        fullName: "Dental Insurance",
        description: "Covers dental treatments and preventive care",
        status: "Pending",
      },
    ],
  });

  const initParams = {
    search: "",
    page: 1,
    limit: 10,
    status: "",
  };

  const [insuranceParams, setInsuranceParams] = useState<any>(initParams);

  const [loading, setLoading] = useState(false);

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const totalPages = Math.ceil(
    insurances?.totalRecords / insuranceParams?.limit
  );
  const startIndex = (insuranceParams?.page - 1) * insuranceParams?.limit;
  const endIndex = Math.min(
    startIndex + insuranceParams?.limit,
    insurances?.totalRecords
  );

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedInsuranceType, setSelectedInsuranceType] = useState<any>(null);
  const [modalType, setModalType] = useState<any>("");
  const [exportLoading, setExportLoading] = useState(false);

  const getinsurances = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => {
    setLoading(true);
    try {
      const res = await {
        page: params?.page ?? insuranceParams?.page,
        limit: params?.limit ?? insuranceParams?.limit,
        search: params?.search ?? insuranceParams?.search,
        status: params?.status ?? insuranceParams?.status,
      };
      setInsurances(res);
    } catch (err) {
      console.error("Failed to fetch master data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    setInsuranceParams((prev: any) => ({ ...prev, page: page }));
    await getinsurances({ page });
  };

  const handleRowsPerPageChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newRowsPerPage = parseInt(e.target.value, 10);
    setInsuranceParams((prev: any) => ({
      ...prev,
      page: 1,
      limit: newRowsPerPage,
    }));
    await getinsurances({ page: 1, limit: newRowsPerPage });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInsuranceParams((prev: any) => ({ ...prev, search: value }));
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    setLoading(true);
    searchTimeout.current = setTimeout(async () => {
      await getinsurances({ page: 1, search: value });
      setInsuranceParams((prev: any) => ({ ...prev, page: 1 }));
      setLoading(false);
    }, 1000);
  };

  const handleFilterChange = async (key: string, value: string) => {
    setInsuranceParams((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = async (filters: any) => {
    await getinsurances(filters);
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
            variant="light"
          >
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
          placeholder="Search insurances"
          value={insuranceParams?.search}
          onChange={handleSearch}
        />
        <div className="flex flex-col items-center gap-3 md:flex-row w-full justify-end">
          <Button
            className="sm:w-auto w-full"
            onClick={() => {
              setSelectedInsuranceType(null);
              setModalType("add");
              mainModal.openModal();
            }}
          >
            Add New Insurance Type
          </Button>
          <FilterModal
            isOpen={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
            title="Filter User Lists"
            description="Filter user lists based on your criteria"
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
            filterValues={insuranceParams}
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
      <FilterAndSortPills filters={insuranceParams} onRemoveFilter={() => {}} />
      <CommonTable
        headers={headers}
        data={insurances?.Insurances || []}
        actions={(item: any) => (
          <>
            <Tooltip content="Edit" position="left">
              <button
                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90"
                onClick={() => {
                  setModalType("edit");
                  setSelectedInsuranceType(item);
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
                  setSelectedInsuranceType(item);
                  mainModal.openModal();
                }}
              >
                <TrashBinIcon />
              </button>
            </Tooltip>
          </>
        )}
        loading={loading}
      />
      <TableFooter
        rowsPerPage={insuranceParams?.limit}
        handleRowsPerPageChange={handleRowsPerPageChange}
        currentPage={insuranceParams?.page}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        totalEntries={insurances?.totalRecords}
        startIndex={startIndex}
        endIndex={endIndex}
      />

      <InsuranceModal
        isOpen={mainModal.isOpen}
        closeModal={mainModal.closeModal}
        modelType={modalType}
        setModelType={setModalType}
        selectedInsuranceType={selectedInsuranceType}
        setSelectedInsuranceType={setSelectedInsuranceType}
      />
    </div>
  );
}

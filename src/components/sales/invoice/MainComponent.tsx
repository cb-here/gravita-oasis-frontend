"use client";

import CommonTable from "@/components/common/CommonTable";
import FilterAndSortPills from "@/components/common/filter/FilterAndSortPills";
import FilterButton from "@/components/common/filter/FilterButton";
import FilterModal from "@/components/common/filter/FilterModal";
import Search from "@/components/common/Search";
import TableFooter from "@/components/common/TableFooter";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { Tooltip } from "@/components/ui/tooltip/Tooltip";
import { useModal } from "@/hooks/useModal";
import { PencilIcon, TrashBinIcon } from "@/icons";
import React, { useState, useRef } from "react";
import { MOCK_INVOICES } from "./constants/invoices";

export default function MainComponent() {
  const [invoicesData, ] = useState(MOCK_INVOICES || {
    totalRecords: 0,
    Invoices: [],
  });

  const initParams = {
    search: "",
    page: 1,
    limit: 10,
    status: "",
  };

  const [invoiceParams, setInvoiceParams] = useState<any>(initParams);
  const [loading, setLoading] = useState(false);

  const mainModal = useModal();

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const totalPages = Math.ceil(
    invoicesData?.totalRecords / invoiceParams?.limit
  );
  const startIndex = (invoiceParams?.page - 1) * invoiceParams?.limit;
  const endIndex = Math.min(
    startIndex + invoiceParams?.limit,
    invoicesData?.totalRecords
  );

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [, setSelectedProject] = useState<any>(null);
  const [, setModalType] = useState<any>("");

  const getInvoices = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => {
    setLoading(true);
    try {
      const res = await {
        page: params?.page ?? invoiceParams?.page,
        limit: params?.limit ?? invoiceParams?.limit,
        search: params?.search ?? invoiceParams?.search,
        status: params?.status ?? invoiceParams?.status,
      };
      console.log("🚀 ~ getInvoices ~ res:", res)
      // setInvoicesData(res);
    } catch (err) {
      console.error("Failed to fetch master data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    setInvoiceParams((prev: any) => ({ ...prev, page: page }));
    await getInvoices({ page });
  };

  const handleRowsPerPageChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newRowsPerPage = parseInt(e.target.value, 10);
    setInvoiceParams((prev: any) => ({
      ...prev,
      page: 1,
      limit: newRowsPerPage,
    }));
    await getInvoices({ page: 1, limit: newRowsPerPage });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInvoiceParams((prev: any) => ({ ...prev, search: value }));
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    setLoading(true);
    searchTimeout.current = setTimeout(async () => {
      await getInvoices({ page: 1, search: value });
      setInvoiceParams((prev: any) => ({ ...prev, page: 1 }));
      setLoading(false);
    }, 1000);
  };

  const handleFilterChange = async (key: string, value: string) => {
    setInvoiceParams((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = async (filters: any) => {
    await getInvoices(filters);
    setIsFilterModalOpen(false);
  };

  const headers = [
    {
      label: "Date",
      render: (item: any) => (
        <p className="text-gray-800 dark:text-gray-200">{item?.date}</p>
      ),
    },
    {
      label: "Invoice",
      render: (item: any) => (
        <p className="text-gray-800 dark:text-gray-200">{item?.invoice}</p>
      ),
    },
    {
      label: "Billed To",
      render: (item: any) => (
        <p className="text-gray-800 dark:text-gray-200">{item?.billedTo}</p>
      ),
    },
    {
      label: "Amount($)",
      render: (item: any) => (
        <p className="text-gray-800 dark:text-gray-200">{item?.amount}</p>
      ),
    },
    {
      label: "Status",
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
    {
      label: "Sub Total($)",
      render: (item: any) => (
        <p className="text-gray-800 dark:text-gray-200">{item?.subTotal}</p>
      ),
    },
    {
      label: "ID List",
      render: (item: any) => (
        <p className="text-gray-800 dark:text-gray-200">{item?.idList}</p>
      ),
    },
    {
      label: "Invoice Amount in INR",
      render: (item: any) => (
        <p className="text-gray-800 dark:text-gray-200">{item?.amountInr}</p>
      ),
    },
    {
      label: "Current Status",
      render: (row: any) => (
        <div className="flex items-center justify-center">
          <Badge
            className="text-xs"
            color={
              row?.currentStatus === "Active"
                ? "success"
                : row?.currentStatus === "Inactive"
                ? "error"
                : row?.currentStatus === "Pending"
                ? "warning"
                : "info"
            }
            variant="light"
          >
            {row?.currentStatus ?? "Unknown"}
          </Badge>
        </div>
      ),
    },
  ];
  
  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] lg:p-4 p-2">
      <div className="flex flex-col items-center justify-between gap-2 mb-3 md:flex-row w-full">
        <Search
          className="w-full md:w-auto xl:w-[400px]"
          placeholder="Search Invoices"
          value={invoiceParams?.search}
          onChange={handleSearch}
        />
        <div className="flex flex-col items-center gap-3 md:flex-row w-full justify-end">
          <Button
            className="sm:w-auto w-full"
            onClick={() => {
              setSelectedProject(null);
              setModalType("add");
              mainModal.openModal();
            }}
          >
            Add New Invoice
          </Button>
          <FilterModal
            isOpen={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
            title="Filter Invoice"
            description="Filter invoices based on your criteria"
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
                key: "project_name",
                label: "Project Type",
                options: [
                  { label: "Project 1", value: "Project 1" },
                  { label: "Project 2", value: "Project 2" },
                ],
              },
            ]}
            filterValues={invoiceParams}
            onFilterChange={handleFilterChange}
            onApply={handleApplyFilters}
            className="max-w-[600px]"
          />
          <FilterButton
            onClick={() => setIsFilterModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2"
          />
        </div>
      </div>
      <FilterAndSortPills filters={invoiceParams} onRemoveFilter={() => {}} />
      <CommonTable
        headers={headers}
        data={invoicesData?.Invoices || []}
        actions={(item: any) => (
          <>
            
            <Tooltip content="Edit" position="left">
              <button
                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90"
                onClick={() => {
                  setModalType("edit");
                  setSelectedProject(item);
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
                  setSelectedProject(item);
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
        rowsPerPage={invoiceParams?.limit}
        handleRowsPerPageChange={handleRowsPerPageChange}
        currentPage={invoiceParams?.page}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        totalEntries={invoicesData?.totalRecords}
        startIndex={startIndex}
        endIndex={endIndex}
      />
    </div>
  );
}

"use client";

import CommonTable from "@/components/common/CommonTable";
import FilterAndSortPills from "@/components/common/filter/FilterAndSortPills";
import FilterButton from "@/components/common/filter/FilterButton";
import FilterModal from "@/components/common/filter/FilterModal";
import Search from "@/components/common/Search";
import TableFooter from "@/components/common/TableFooter";
import Button from "@/components/ui/button/Button";
import { Tooltip } from "@/components/ui/tooltip/Tooltip";
import { useModal } from "@/hooks/useModal";
import { PencilIcon, TrashBinIcon } from "@/icons";
import React, { useState, useRef } from "react";
import { MOCK_CLIENTS } from "../constants/clients";
import { Mail, Phone } from "lucide-react";
import ClientModal from "./ClientModal";

export default function MainComponent() {
  const [clientsData, setClientsData] = useState<any>(
    MOCK_CLIENTS || {
      totalRecords: 0,
      Clients: [],
    }
  );

  const initParams = {
    search: "",
    page: 1,
    limit: 10,
  };

  const [clientParams, setClientParams] = useState<any>(initParams);
  const [loading, setLoading] = useState(false);

  const mainModal = useModal();

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const totalPages = Math.ceil(clientsData?.totalRecords / clientParams?.limit);
  const startIndex = (clientParams?.page - 1) * clientParams?.limit;
  const endIndex = Math.min(
    startIndex + clientParams?.limit,
    clientsData?.totalRecords
  );

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [modalType, setModalType] = useState<any>("");

  const getClients = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => {
    setLoading(true);
    try {
      const res = await {
        page: params?.page ?? clientParams?.page,
        limit: params?.limit ?? clientParams?.limit,
        search: params?.search ?? clientParams?.search,
        status: params?.status ?? clientParams?.status,
      };
        console.log("🚀 ~ getClients ~ res:", res)

      // setClientsData(res);
    } catch (err) {
      console.error("Failed to fetch master data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    setClientParams((prev: any) => ({ ...prev, page: page }));
    await getClients({ page });
  };

  const handleRowsPerPageChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newRowsPerPage = parseInt(e.target.value, 10);
    setClientParams((prev: any) => ({
      ...prev,
      page: 1,
      limit: newRowsPerPage,
    }));
    await getClients({ page: 1, limit: newRowsPerPage });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setClientParams((prev: any) => ({ ...prev, search: value }));
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    setLoading(true);
    searchTimeout.current = setTimeout(async () => {
      await getClients({ page: 1, search: value });
      setClientParams((prev: any) => ({ ...prev, page: 1 }));
      setLoading(false);
    }, 1000);
  };

  const handleFilterChange = async (key: string, value: string) => {
    setClientParams((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = async (filters: any) => {
    await getClients(filters);
    setIsFilterModalOpen(false);
  };

  const headers = [
    {
      label: "Name",
      render: (item: any) => (
        <p className="text-gray-800 dark:text-gray-200">{item?.clientName}</p>
      ),
    },
    {
      label: "Industry",
      render: (item: any) => (
        <p className="text-gray-800 dark:text-gray-200">{item?.industry}</p>
      ),
    },
    {
      label: "Contact Info",
      render: (item: any) => (
        <div className="space-y-1">
          {item?.phoneNo ? (
            <div className="flex items-center gap-2">
              <Phone className="text-gray-600 dark:text-gray-200 shrink-0 h-4 w-4" />
              <p className="text-sm text-gray-800 dark:text-gray-200">
                {item?.phoneNo}
              </p>
            </div>
          ) : null}
          {item?.email ? (
            <div className="flex items-center gap-2">
              <Mail className="text-gray-600 dark:text-gray-200 shrink-0  h-4 w-4" />
              <p className="text-sm text-gray-800 dark:text-gray-200">
                {item?.email}
              </p>
            </div>
          ) : null}
          {!item?.phoneNo && !item?.email && (
            <p className="text-sm text-gray-500 dark:text-gray-400">-</p>
          )}
        </div>
      ),
    },
    {
      label: "Country",
      render: (item: any) => (
        <p className="text-gray-800 dark:text-gray-200">{item?.countryCode}</p>
      ),
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] lg:p-4 p-2">
      <div className="space-y-4 mb-2">
        <h1 className="text-heading">Clients</h1>

      </div>
      <div className="flex flex-col items-center justify-between gap-2 mb-3 md:flex-row w-full">
        <Search
          className="w-full md:w-auto xl:w-[400px]"
          placeholder="Search Clients"
          value={clientParams?.search}
          onChange={handleSearch}
        />
        <div className="flex flex-col items-center gap-3 md:flex-row w-full justify-end">
          <Button
            className="sm:w-auto w-full"
            onClick={() => {
              setSelectedClient(null);
              setModalType("add");
              mainModal.openModal();
            }}
          >
            Add New Client
          </Button>
          <FilterModal
            isOpen={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
            title="Filter Client"
            description="Filter client based on your criteria"
            filters={[
              {
                key: "project_name",
                label: "Project Type",
                options: [
                  { label: "Project 1", value: "Project 1" },
                  { label: "Project 2", value: "Project 2" },
                ],
              },
            ]}
            filterValues={clientParams}
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
      <FilterAndSortPills filters={clientParams} onRemoveFilter={() => {}} />
      <CommonTable
        headers={headers}
        data={clientsData?.Clients || []}
        actions={(item: any) => (
          <>
            <Tooltip content="Edit" position="left">
              <button
                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90"
                onClick={() => {
                  setModalType("edit");
                  setSelectedClient(item);
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
                  setSelectedClient(item);
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
        rowsPerPage={clientParams?.limit}
        handleRowsPerPageChange={handleRowsPerPageChange}
        currentPage={clientParams?.page}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        totalEntries={clientsData?.totalRecords}
        startIndex={startIndex}
        endIndex={endIndex}
      />

      <ClientModal
        isOpen={mainModal.isOpen}
        closeModal={mainModal.closeModal}
        modelType={modalType}
        setModelType={setModalType}
        selectedClient={selectedClient}
        setSelectedClient={setSelectedClient}
        rowsPerPage={clientParams?.limit}
        setClients={setClientsData}
      />
    </div>
  );
}

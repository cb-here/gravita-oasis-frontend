"use client";
import React, { useRef, useState } from "react";
import { useModal } from "@/hooks/useModal";
import { Plus } from "lucide-react";
import { InfoIcon, PencilIcon, TrashBinIcon } from "@/icons";
import { formatDate } from "@/utils/formateDate";

import AccessGroupModel from "./modals/AccessGroupModel";
import Button from "@/components/ui/button/Button";
import Search from "@/components/common/Search";
import CommonTable from "@/components/common/CommonTable";
import { Tooltip } from "@/components/ui/tooltip/Tooltip";
import TableFooter from "@/components/common/TableFooter";

const headers = [
  {
    label: "Name",
    render: (item: any) => (
      <p className="text-sm text-gray-800 dark:text-white truncate">
        {item?.name}
      </p>
    ),
  },
  {
    label: "Description",
    render: (item: any) => (
      <div className="text-sm text-gray-600 dark:text-gray-300 pr-3 truncate">
        {item?.description}
      </div>
    ),
    className: "w-[200px]",
  },
  {
    label: "Created At",
    render: (item: any) => <span>{formatDate(item?.createdAt)}</span>,
  },
];

export default function MainComponent() {
  const { isOpen, openModal, closeModal } = useModal();

  const [accessGroupsData, setAccessGroupsData] = useState<any>({
    totalRecords: 8,
    AccessGroups: [
      {
        _id: "1",
        name: "Admins",
        description: "Full access to all modules and settings",
        createdAt: "2025-09-25T10:30:00Z",
      },
      {
        _id: "2",
        name: "Managers",
        description: "Manage teams, approve requests, view reports",
        createdAt: "2025-09-20T08:15:00Z",
      },
      {
        _id: "3",
        name: "Editors",
        description: "Can create and edit content, but no deletion rights",
        createdAt: "2025-09-18T12:00:00Z",
      },
      {
        _id: "4",
        name: "Viewers",
        description: "Read-only access to assigned sections",
        createdAt: "2025-09-15T09:45:00Z",
      },
      {
        _id: "5",
        name: "HR",
        description: "Access to employee data and HR tools",
        createdAt: "2025-09-10T14:20:00Z",
      },
      {
        _id: "6",
        name: "Finance",
        description: "Access to invoices, payroll, and reports",
        createdAt: "2025-09-05T11:10:00Z",
      },
      {
        _id: "7",
        name: "Support",
        description: "Handle customer queries and tickets",
        createdAt: "2025-09-03T16:40:00Z",
      },
      {
        _id: "8",
        name: "Guests",
        description: "Temporary access for external collaborators",
        createdAt: "2025-09-01T13:00:00Z",
      },
    ],
  });

  const initParams = {
    search: "",
    page: 1,
    limit: 10,
  };

  const [accessGroupParams, setAccessGroupParams] = useState<any>(initParams);
  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedAccessGroup, setSelectedAccessGroup] = useState<any>(null);

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const totalPages = Math.ceil(
    accessGroupsData?.totalRecords / accessGroupParams?.limit
  );
  const startIndex = (accessGroupParams?.page - 1) * accessGroupParams?.limit;
  const endIndex = Math.min(
    startIndex + accessGroupParams?.limit,
    accessGroupsData?.totalRecords
  );

  const getAccessGroups = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    setLoading(true);
    try {
      const res = await {
        page: params?.page ?? accessGroupParams?.page,
        limit: params?.limit ?? accessGroupParams?.limit,
        search: params?.search ?? accessGroupParams?.search,
      };
      setAccessGroupsData(res);
    } catch (err) {
      console.error("Failed to fetch deals:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    setAccessGroupParams((prev: any) => ({ ...prev, page: page }));
    await getAccessGroups({ page });
  };

  const handleRowsPerPageChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newRowsPerPage = parseInt(e.target.value, 10);
    setAccessGroupParams((prev: any) => ({
      ...prev,
      page: 1,
      limit: newRowsPerPage,
    }));
    await getAccessGroups({ page: 1, limit: newRowsPerPage });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAccessGroupParams((prev: any) => ({ ...prev, search: value }));
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    setLoading(true);
    searchTimeout.current = setTimeout(async () => {
      await getAccessGroups({ page: 1, search: value });
      setAccessGroupParams((prev: any) => ({ ...prev, page: 1 }));
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex items-center justify-between md:flex-row flex-col gap-2 mb-3">
          <h2 className="text-heading">Access Groups Management</h2>
          <Button
            onClick={() => {
              setSelectedAccessGroup(null);
              setModalType("add");
              openModal();
            }}
            className="w-full sm:w-auto whitespace-nowrap"
          >
            <Plus className="h-4 w-4 inline mr-1" />
            Create Access Group
          </Button>
        </div>
        <div className="flex flex-col-reverse w-full gap-5 sm:justify-between xl:flex-row xl:items-center mt-3">
          <Search
            value={accessGroupParams?.search}
            onChange={handleSearch}
            placeholder="Search access groups..."
            className="w-full sm:w-auto xl:w-[300px]"
          />
        </div>
        <CommonTable
          headers={headers}
          data={accessGroupsData?.AccessGroups || []}
          loading={loading}
          actions={(item: any) => (
            <>
              <Tooltip content="View" position="left">
                <button
                  onClick={() => {
                    setSelectedAccessGroup(item);
                    setModalType("read");
                    openModal();
                  }}
                  className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                >
                  <InfoIcon />
                </button>
              </Tooltip>
              <Tooltip content="Edit" position="left">
                <button
                  onClick={() => {
                    setSelectedAccessGroup(item);
                    setModalType("edit");
                    openModal();
                  }}
                  className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90"
                >
                  <PencilIcon />
                </button>
              </Tooltip>
              <Tooltip content="Delete" position="left">
                <button
                  onClick={() => {
                    setSelectedAccessGroup(item);
                    setModalType("delete");
                    openModal();
                  }}
                  className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500 "
                >
                  <TrashBinIcon />
                </button>
              </Tooltip>
            </>
          )}
        />

        <TableFooter
          rowsPerPage={accessGroupParams?.limit}
          handleRowsPerPageChange={handleRowsPerPageChange}
          currentPage={accessGroupParams?.page}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          totalEntries={accessGroupsData?.totalRecords}
          startIndex={startIndex}
          endIndex={endIndex}
        />
      </div>
      <AccessGroupModel
        isOpen={isOpen}
        closeModal={closeModal}
        modelType={modalType}
        setModelType={setModalType}
        setSelectedAccessGroup={setSelectedAccessGroup}
        selectedAccessGroup={selectedAccessGroup}
      />
    </>
  );
}

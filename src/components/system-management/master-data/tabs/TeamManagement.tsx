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
import TeamManagementModal from "../modals/TeamManagementModal";
import FilterAndSortPills from "@/components/common/filter/FilterAndSortPills";

export default function TeamManagement() {
  const mainModal = useModal();

  const [teamData, setTeamData] = useState<any>({
    totalRecords: 6,
    Teams: [
      {
        id: 1,
        name: "Frontend Team",
        description: "Handles UI/UX development for web apps",
        teamLead: { first_name: "Alice", last_name: "Johnson" },
        capacity: 8,
        currentLoad: 6,
        status: "Active",
      },
      {
        id: 2,
        name: "Backend Team",
        description: "Responsible for APIs and database architecture",
        teamLead: { first_name: "Bob", last_name: "Smith" },
        capacity: 10,
        currentLoad: 10,
        status: "Active",
      },
      {
        id: 3,
        name: "QA Team",
        description: "Ensures quality through automated/manual testing",
        teamLead: { first_name: "Clara", last_name: "Williams" },
        capacity: 6,
        currentLoad: 2,
        status: "Active",
      },
      {
        id: 4,
        name: "DevOps Team",
        description: "Manages CI/CD pipelines and cloud infrastructure",
        teamLead: { first_name: "David", last_name: "Brown" },
        capacity: 5,
        currentLoad: 5,
        status: "Inactive",
      },
      {
        id: 5,
        name: "AI Research Team",
        description: "Explores and develops AI/ML models",
        teamLead: { first_name: "Emma", last_name: "Davis" },
        capacity: 7,
        currentLoad: 3,
        status: "Pending",
      },
      {
        id: 6,
        name: "Security Team",
        description: "Handles penetration testing and vulnerability management",
        teamLead: { first_name: "Frank", last_name: "Miller" },
        capacity: 4,
        currentLoad: 4,
        status: "Active",
      },
      {
        id: 7,
        name: "Support Team",
        description: "Provides customer and technical support",
        teamLead: { first_name: "Grace", last_name: "Wilson" },
        capacity: 12,
        currentLoad: 9,
        status: "Active",
      },
      {
        id: 8,
        name: "Product Team",
        description: "Coordinates product roadmap and business requirements",
        teamLead: { first_name: "Henry", last_name: "Moore" },
        capacity: 6,
        currentLoad: 1,
        status: "Inactive",
      },
    ],
  });

  const initParams = {
    search: "",
    page: 1,
    limit: 10,
    status: "",
  };

  const [teamParams, setTeamParams] = useState<any>(initParams);

  const [loading, setLoading] = useState(false);

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const totalPages = Math.ceil(teamData?.totalRecords / teamParams?.limit);
  const startIndex = (teamParams?.page - 1) * teamParams?.limit;
  const endIndex = Math.min(
    startIndex + teamParams?.limit,
    teamData?.totalRecords
  );

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [modalType, setModalType] = useState<any>("");
  const [exportLoading, setExportLoading] = useState(false);

  const getTeams = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => {
    setLoading(true);
    try {
      const res = await {
        page: params?.page ?? teamParams?.page,
        limit: params?.limit ?? teamParams?.limit,
        search: params?.search ?? teamParams?.search,
        status: params?.status ?? teamParams?.status,
      };
      setTeamData(res);
    } catch (err) {
      console.error("Failed to fetch teams:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    setTeamParams((prev: any) => ({ ...prev, page: page }));
    await getTeams({ page });
  };

  const handleRowsPerPageChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newRowsPerPage = parseInt(e.target.value, 10);
    setTeamParams((prev: any) => ({
      ...prev,
      page: 1,
      limit: newRowsPerPage,
    }));
    await getTeams({ page: 1, limit: newRowsPerPage });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTeamParams((prev: any) => ({ ...prev, search: value }));
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    setLoading(true);
    searchTimeout.current = setTimeout(async () => {
      await getTeams({ page: 1, search: value });
      setTeamParams((prev: any) => ({ ...prev, page: 1 }));
      setLoading(false);
    }, 1000);
  };

  const handleFilterChange = async (key: string, value: string) => {
    setTeamParams((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = async (filters: any) => {
    await getTeams(filters);
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
      label: "Team Name",
      render: (row: any) => <span>{row?.name}</span>,
      sortable: true,
    },
    {
      label: "Description",
      render: (row: any) => (
        <span>{row?.description ?? "No description available"}</span>
      ),
      sortable: true,
    },
    {
      key: "teamLead",
      label: "Team Lead",
      sortable: true,
      render: (row: any) => {
        const teamLead = row.teamLead;

        return (
          <span className="text-sm text-gray-600">
            {`${teamLead.first_name} ${teamLead.last_name}`}
          </span>
        );
      },
    },
    {
      key: "capacity",
      label: "Capacity",
      sortable: true,
      render: (row: any) => (
        <span className="text-sm text-gray-600">
          {row.currentLoad}/{row.capacity}
        </span>
      ),
    },
    {
      key: "availableCapacity",
      label: "Available",
      sortable: true,
      render: (row: any) => {
        const available = Math.max(0, row.capacity - row.currentLoad);
        return (
          <Badge
            className={`px-2 py-1 rounded text-xs font-semibold`}
            color={
              available > 3 ? "success" : available > 0 ? "warning" : "error"
            }
          >
            {available}
          </Badge>
        );
      },
    },
    {
      label: "Status",
      sortable: true,
      render: (row: any) => (
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
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col items-center justify-between gap-2 mb-3 md:flex-row w-full">
        <Search
          className="w-full md:w-auto xl:w-[400px]"
          placeholder="Search Teams"
          value={teamParams?.search}
          onChange={handleSearch}
        />
        <div className="flex flex-col items-center gap-3 md:flex-row w-full justify-end">
          <Button
            className="sm:w-auto w-full"
            onClick={() => {
              setSelectedTeam(null);
              setModalType("add");
              mainModal.openModal();
            }}
          >
            Add New Team
          </Button>
          <FilterModal
            isOpen={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
            title="Filter Teams"
            description="Filter teams based on your criteria"
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
            filterValues={teamParams}
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
      <FilterAndSortPills filters={teamParams} onRemoveFilter={() => {}} />
      <CommonTable
        headers={headers}
        data={teamData?.Teams || []}
        actions={(item: any) => (
          <>
            <Tooltip content="Edit" position="left">
              <button
                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90"
                onClick={() => {
                  setModalType("edit");
                  setSelectedTeam(item);
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
                  setSelectedTeam(item);
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
        rowsPerPage={teamParams?.limit}
        handleRowsPerPageChange={handleRowsPerPageChange}
        currentPage={teamParams?.page}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        totalEntries={teamData?.totalRecords}
        startIndex={startIndex}
        endIndex={endIndex}
      />

      <TeamManagementModal
        isOpen={mainModal.isOpen}
        closeModal={mainModal.closeModal}
        modelType={modalType}
        setModelType={setModalType}
        selectedTeam={selectedTeam}
        setSelectedTeam={setSelectedTeam}
      />
    </div>
  );
}

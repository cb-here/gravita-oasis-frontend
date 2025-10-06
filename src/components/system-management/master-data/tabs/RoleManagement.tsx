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
import RoleManagementModal from "../modals/RoleManagementModal";
import FilterAndSortPills from "@/components/common/filter/FilterAndSortPills";

export default function RoleManagement() {
  const mainModal = useModal();

  const [teamRoleData, setTeamRoleData] = useState<any>({
    totalRecords: 6,
    TeamRoles: [
      {
        id: 1,
        name: "Admin",
        description: "Full system access with all permissions",
        permissions: ["manage_users", "manage_roles", "view_reports"],
        assignedUsersCount: 3,
        isSystemRole: true,
        isActive: true,
      },
      {
        id: 2,
        name: "Project Manager",
        description: "Can manage projects and assign tasks",
        permissions: ["create_project", "assign_tasks", "view_reports"],
        assignedUsersCount: 8,
        isSystemRole: false,
        isActive: true,
      },
      {
        id: 3,
        name: "Developer",
        description: "Has access to repositories and task board",
        permissions: ["commit_code", "update_tasks"],
        assignedUsersCount: 15,
        isSystemRole: false,
        isActive: true,
      },
      {
        id: 4,
        name: "Tester",
        description: "Can test features and log issues",
        permissions: ["log_bugs", "verify_fixes"],
        assignedUsersCount: 6,
        isSystemRole: false,
        isActive: true,
      },
      {
        id: 5,
        name: "HR Manager",
        description: "Manages employee data and leave approvals",
        permissions: ["manage_employees", "approve_leaves"],
        assignedUsersCount: 2,
        isSystemRole: false,
        isActive: true,
      },
      {
        id: 6,
        name: "Finance",
        description: "Handles invoices and payroll",
        permissions: ["view_financials", "process_payments"],
        assignedUsersCount: 1,
        isSystemRole: false,
        isActive: false,
      },
      {
        id: 7,
        name: "Support Agent",
        description: "Handles customer support tickets",
        permissions: ["view_tickets", "respond_tickets"],
        assignedUsersCount: 12,
        isSystemRole: false,
        isActive: true,
      },
      {
        id: 8,
        name: "Read-Only",
        description: "Can view data but not make changes",
        permissions: ["view_projects", "view_reports"],
        assignedUsersCount: 4,
        isSystemRole: true,
        isActive: false,
      },
    ],
  });

  const initParams = {
    search: "",
    page: 1,
    limit: 10,
    status: "",
  };

  const [teamRoleParams, setTeamRoleParams] = useState<any>(initParams);

  const [loading, setLoading] = useState(false);

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const totalPages = Math.ceil(
    teamRoleData?.totalRecords / teamRoleParams?.limit
  );
  const startIndex = (teamRoleParams?.page - 1) * teamRoleParams?.limit;
  const endIndex = Math.min(
    startIndex + teamRoleParams?.limit,
    teamRoleData?.totalRecords
  );

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [modalType, setModalType] = useState<any>("");
  const [exportLoading, setExportLoading] = useState(false);

  const getTeamRoles = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => {
    setLoading(true);
    try {
      const res = await {
        page: params?.page ?? teamRoleParams?.page,
        limit: params?.limit ?? teamRoleParams?.limit,
        search: params?.search ?? teamRoleParams?.search,
        status: params?.status ?? teamRoleParams?.status,
      };
      setTeamRoleData(res);
    } catch (err) {
      console.error("Failed to fetch team roles:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    setTeamRoleParams((prev: any) => ({ ...prev, page: page }));
    await getTeamRoles({ page });
  };

  const handleRowsPerPageChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newRowsPerPage = parseInt(e.target.value, 10);
    setTeamRoleParams((prev: any) => ({
      ...prev,
      page: 1,
      limit: newRowsPerPage,
    }));
    await getTeamRoles({ page: 1, limit: newRowsPerPage });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTeamRoleParams((prev: any) => ({ ...prev, search: value }));
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    setLoading(true);
    searchTimeout.current = setTimeout(async () => {
      await getTeamRoles({ page: 1, search: value });
      setTeamRoleParams((prev: any) => ({ ...prev, page: 1 }));
      setLoading(false);
    }, 1000);
  };

  const handleFilterChange = async (key: string, value: string) => {
    setTeamRoleParams((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = async (filters: any) => {
    await getTeamRoles(filters);
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
      label: "Role Name",
      render: (row: any) => (
        <span className="text-sm text-gray-600 max-w-xs truncate">
          {row.name}
        </span>
      ),
      sortable: true,
    },
    {
      label: "Description",
      sortable: true,
      render: (row: any) => (
        <span className="text-sm text-gray-600 max-w-xs truncate">
          {row.description}
        </span>
      ),
    },
    {
      label: "Permissions Count",
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center justify-center">
          <Badge
            className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700"
            color="primary"
            variant="light"
          >
            {row.permissions.length} permissions
          </Badge>
        </div>
      ),
    },
    {
      label: "Assigned Users",
      sortable: true,
      render: (row: any) => (
        <div className="text-sm text-gray-600 flex items-center justify-center">
          {row.assignedUsersCount || 0}
        </div>
      ),
    },
    {
      label: "Type",
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center justify-center">
          <Badge
            className={`px-2 py-1 rounded text-xs font-semibold `}
            color={row.isSystemRole ? "velvet" : "info"}
          >
            {row.isSystemRole ? "System" : "Custom"}
          </Badge>
        </div>
      ),
    },
    {
      label: "Status",
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center justify-center">
          <Badge
            className={`px-2 py-1 rounded text-xs font-semibold `}
            color={row.isActive ? "success" : "error"}
          >
            {row.isActive ? "Active" : "Inactive"}
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
          placeholder="Search Team Roles"
          value={teamRoleParams?.search}
          onChange={handleSearch}
        />
        <div className="flex flex-col items-center gap-3 md:flex-row w-full justify-end">
          <Button
            className="sm:w-auto w-full"
            onClick={() => {
              setSelectedRole(null);
              setModalType("add");
              mainModal.openModal();
            }}
          >
            Add New Role
          </Button>
          <FilterModal
            isOpen={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
            title="Filter Role"
            description="Filter role based on your criteria"
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
            filterValues={teamRoleParams}
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
      <FilterAndSortPills filters={teamRoleParams} onRemoveFilter={() => {}} />
      <CommonTable
        headers={headers}
        data={teamRoleData?.TeamRoles || []}
        actions={(item: any) => (
          <>
            <Tooltip content="Edit" position="left">
              <button
                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90"
                onClick={() => {
                  setModalType("edit");
                  setSelectedRole(item);
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
                  setSelectedRole(item);
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
        rowsPerPage={teamRoleParams?.limit}
        handleRowsPerPageChange={handleRowsPerPageChange}
        currentPage={teamRoleParams?.page}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        totalEntries={teamRoleData?.totalRecords}
        startIndex={startIndex}
        endIndex={endIndex}
      />

      <RoleManagementModal
        isOpen={mainModal.isOpen}
        closeModal={mainModal.closeModal}
        modelType={modalType}
        setModelType={setModalType}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
      />
    </div>
  );
}

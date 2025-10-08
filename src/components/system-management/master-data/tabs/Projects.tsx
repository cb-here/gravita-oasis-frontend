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
import ProjectsModal from "../modals/ProjectsModal";
import FilterAndSortPills from "@/components/common/filter/FilterAndSortPills";

export default function Projects() {
  const mainModal = useModal();

  const [projects, setProjects] = useState<any>({
    totalRecords: 5,
    Projects: [
      {
        id: 1,
        fullName: "Project J",
        description: "Some description about Project J",
        status: "Active",
        projectType: "Development",
      },
      {
        id: 2,
        fullName: "Origin",
        description: "Some description about Origin",
        status: "Pending",
        projectType: "Research",
      },
      {
        id: 3,
        fullName: "Jacksonville",
        description: "Some description about Jacksonville",
        status: "Active",
        projectType: "Logistics",
      },
      {
        id: 4,
        fullName: "Making Memories",
        description: "Some description about Making Memories",
        status: "Active",
        projectType: "Event Management",
      },
      {
        id: 5,
        fullName: "Metropolitan",
        description: "Some description about Metropolitan",
        status: "Inactive",
        projectType: "Urban Development",
      },
    ],
  });

  const initParams = {
    search: "",
    page: 1,
    limit: 10,
    status: "",
  };

  const [projectParams, setProjectParams] = useState<any>(initParams);

  const [loading, setLoading] = useState(false);

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const totalPages = Math.ceil(projects?.totalRecords / projectParams?.limit);
  const startIndex = (projectParams?.page - 1) * projectParams?.limit;
  const endIndex = Math.min(
    startIndex + projectParams?.limit,
    projects?.totalRecords
  );

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [modalType, setModalType] = useState<any>("");
  const [exportLoading, setExportLoading] = useState(false);

  const getProjects = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => {
    setLoading(true);
    try {
      const res = await {
        page: params?.page ?? projectParams?.page,
        limit: params?.limit ?? projectParams?.limit,
        search: params?.search ?? projectParams?.search,
        status: params?.status ?? projectParams?.status,
      };
      setProjects(res);
    } catch (err) {
      console.error("Failed to fetch master data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    setProjectParams((prev: any) => ({ ...prev, page: page }));
    await getProjects({ page });
  };

  const handleRowsPerPageChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newRowsPerPage = parseInt(e.target.value, 10);
    setProjectParams((prev: any) => ({
      ...prev,
      page: 1,
      limit: newRowsPerPage,
    }));
    await getProjects({ page: 1, limit: newRowsPerPage });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProjectParams((prev: any) => ({ ...prev, search: value }));
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    setLoading(true);
    searchTimeout.current = setTimeout(async () => {
      await getProjects({ page: 1, search: value });
      setProjectParams((prev: any) => ({ ...prev, page: 1 }));
      setLoading(false);
    }, 1000);
  };

  const handleFilterChange = async (key: string, value: string) => {
    setProjectParams((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = async (filters: any) => {
    await getProjects(filters);
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
      label: "Project Type",
      sortable: true,
      render: (row: any) => <span>{row?.projectType}</span>,
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
          placeholder="Search Projects"
          value={projectParams?.search}
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
            Add New Project
          </Button>
          <FilterModal
            isOpen={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
            title="Filter Projects"
            description="Filter projects based on your criteria"
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
            filterValues={projectParams}
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
      <FilterAndSortPills filters={projectParams} onRemoveFilter={() => {}} />
      <CommonTable
        headers={headers}
        data={projects?.Projects || []}
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
        rowsPerPage={projectParams?.limit}
        handleRowsPerPageChange={handleRowsPerPageChange}
        currentPage={projectParams?.page}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        totalEntries={projects?.totalRecords}
        startIndex={startIndex}
        endIndex={endIndex}
      />

      <ProjectsModal
        isOpen={mainModal.isOpen}
        closeModal={mainModal.closeModal}
        modelType={modalType}
        setModelType={setModalType}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
      />
    </div>
  );
}

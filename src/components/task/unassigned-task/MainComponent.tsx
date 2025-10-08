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
import React, { useState, useRef } from "react";
import { ArrowLeftRight, Flag, PackageIcon, Plus, UserPlus } from "lucide-react";
import BulkTaskModal from "../bulkTaskModals/BulkTaskModal";
import UnassignedModal from "../assigned-task/modals/UnassignedModal";
import TaskModal from "./modals/TaskModal";
import ViewModal from "../assigned-task/modals/ViewModal";
import CustomDateRange from "@/components/common/CustomDateRange";
import { formatDate } from "@/utils/formateDate";
import { projectOptions } from "@/components/user-management/user-list/MainComponent";
import MarkModal from "./modals/MarkModal";
import SwapModal from "./modals/SwapModal";

const getPriorityColor = (
  priority: string
): "error" | "warning" | "success" | "info" => {
  if (priority === "High") {
    return "error";
  } else if (priority === "Medium") {
    return "warning";
  } else if (priority === "Low") {
    return "success";
  }
  return "error";
};

export default function MainComponent() {
  const { isOpen, closeModal, openModal } = useModal();
  const mainModal = useModal();
  const bulkModal = useModal();
  const viewModal = useModal();
  const markModal = useModal();
  const swapModal = useModal();

  const [taskData, setTaskData] = useState<any>({
    totalRecords: 8,
    Tasks: [
      {
        _id: "1",
        mri_number: "MRN-1001",
        type_of_chart: "Fresh",
        target_date: "2025-10-10",
        task_name: "SOC",
        project_name: "Project J",
        age: 45,
        priority: "High",
        patient_name: "John Doe",
        insurance: "Blue Cross",
      },
      {
        _id: "2",
        mri_number: "MRN-1002",
        type_of_chart: "RTC",
        target_date: "2025-10-12",
        task_name: "SOC(PT)",
        project_name: "Origin",
        age: 34,
        priority: "Medium",
        patient_name: "Jane Smith",
        insurance: "Aetna",
      },
      {
        _id: "3",
        mri_number: "MRN-1003",
        type_of_chart: "Fresh",
        target_date: "2025-10-15",
        task_name: "SOC(OT)",
        project_name: "Metropolitan",
        age: 29,
        priority: "Low",
        patient_name: "Michael Johnson",
        insurance: "United Health",
      },
      {
        _id: "4",
        mri_number: "MRN-1004",
        type_of_chart: "RTC",
        target_date: "2025-10-20",
        task_name: "ROC",
        project_name: "Jacksonville",
        age: 52,
        priority: "High",
        patient_name: "Sarah Lee",
        insurance: "Cigna",
      },
      {
        _id: "5",
        mri_number: "MRN-1005",
        type_of_chart: "Fresh",
        target_date: "2025-10-22",
        task_name: "ROC(PT)",
        project_name: "Making Memories",
        age: 41,
        priority: "Medium",
        patient_name: "David Brown",
        insurance: "Humana",
      },
      {
        _id: "6",
        mri_number: "MRN-1006",
        type_of_chart: "RTC",
        target_date: "2025-10-25",
        task_name: "Recert",
        project_name: "Project J",
        age: 60,
        priority: "High",
        patient_name: "Emily Davis",
        insurance: "Kaiser",
      },
      {
        _id: "7",
        mri_number: "MRN-1007",
        type_of_chart: "Fresh",
        target_date: "2025-10-28",
        task_name: "Recert(OT)",
        project_name: "Origin",
        age: 38,
        priority: "Low",
        patient_name: "Robert Wilson",
        insurance: "Blue Shield",
      },
      {
        _id: "8",
        mri_number: "MRN-1008",
        type_of_chart: "RTC",
        target_date: "2025-10-30",
        task_name: "SN Assessment E",
        project_name: "Metropolitan",
        age: 27,
        priority: "Medium",
        patient_name: "Olivia Martinez",
        insurance: "Medicare",
      },
    ],
  });

  const initParams = {
    search: "",
    page: 1,
    limit: 10,
    priority: "",
    type_of_chart: "",
    project_name: "",
    insurance: "",
    target_date_from: "",
    target_date_to: "",
  };

  const [taskParams, setTaskParams] = useState<any>(initParams);

  const [loading, setLoading] = useState(false);

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const totalPages = Math.ceil(taskData?.totalRecords / taskParams?.limit);
  const startIndex = (taskParams?.page - 1) * taskParams?.limit;
  const endIndex = Math.min(
    startIndex + taskParams?.limit,
    taskData?.totalRecords
  );

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [modalType, setModalType] = useState<any>("");
  const [bulkModalType, setBulkModalType] = useState<any>("");
  const [selectedItems, setSelectedItems] = useState<any>();
  const [exportLoading, setExportLoading] = useState(false);

  const getTasks = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    priority?: string;
    type_of_chart?: string;
    project_name?: string;
    insurance?: string;
    target_date_from?: string;
    target_date_to?: string;
  }) => {
    setLoading(true);
    try {
      const res = await {
        page: params?.page ?? taskParams?.page,
        limit: params?.limit ?? taskParams?.limit,
        search: params?.search ?? taskParams?.search,
        priority: params?.priority ?? taskParams?.priority,
        type_of_chart: params?.type_of_chart ?? taskParams?.type_of_chart,
        project_name: params?.project_name ?? taskParams?.project_name,
        insurance: params?.insurance ?? taskParams?.insurance,
        target_date_from:
          params?.target_date_from ?? taskParams?.target_date_from,
        target_date_to: params?.target_date_to ?? taskParams?.target_date_to,
      };
      setTaskData(res);
    } catch (err) {
      console.error("Failed to fetch master data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    setTaskParams((prev: any) => ({ ...prev, page: page }));
    await getTasks({ page });
  };

  const handleRowsPerPageChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newRowsPerPage = parseInt(e.target.value, 10);
    setTaskParams((prev: any) => ({
      ...prev,
      page: 1,
      limit: newRowsPerPage,
    }));
    await getTasks({ page: 1, limit: newRowsPerPage });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTaskParams((prev: any) => ({ ...prev, search: value }));
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    setLoading(true);
    searchTimeout.current = setTimeout(async () => {
      await getTasks({ page: 1, search: value });
      setTaskParams((prev: any) => ({ ...prev, page: 1 }));
      setLoading(false);
    }, 1000);
  };

  const handleFilterChange = async (key: string, value: string) => {
    setTaskParams((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = async (filters: any) => {
    await getTasks(filters);
    setIsFilterModalOpen(false);
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      // Export logic here
    } catch (error: unknown) {
      console.log("🚀 ~ handleExport ~ error:", error);
    } finally {
      setExportLoading(false);
    }
  };

  const headers = [
    {
      label: "MRN",
      render: (item: any) => (
        <p
          className="cursor-pointer hover:underline hover:text-brand-600"
          onClick={() => {
            setSelectedTask(item);
            viewModal.openModal();
          }}>
          {item?.mri_number}
        </p>
      ),
      sortable: true,
      sortKey: "mri_number",
    },
    {
      label: "Type of Chart",
      render: (item: any) => (
        <div className="flex justify-center">
          <Badge
            className="text-xs"
            color={item?.type_of_chart === "Fresh" ? "success" : "error"}>
            {item.type_of_chart}
          </Badge>
        </div>
      ),
    },
    {
      label: "Target Date",
      render: (item: any) => (
        <span>
          {item?.target_date ? formatDate(new Date(item?.target_date)) : "N/A"}
        </span>
      ),
    },
    {
      label: "Task Name",
      render: (item: any) => <span>{item?.task_name}</span>,
      sortable: true,
      sortKey: "task_name",
    },
    {
      label: "Project Name",
      render: (item: any) => {
        const projectName = item?.project_name;

        return projectName ? (
          <Badge
            variant="light"
            color={item?.project_name ? "success" : "error"}
            size="sm">
            {item?.project_name}
          </Badge>
        ) : (
          <span>-</span>
        );
      },
    },
    {
      label: "Age",
      render: (item: any) => <span>{item?.age}</span>,
    },
    {
      label: "Priority",
      render: (item: any) => (
        <div className="flex justify-center">
          <Badge className="text-xs" color={getPriorityColor(item?.priority)}>
            {item.priority}
          </Badge>
        </div>
      ),
    },
    {
      label: "Patient Name",
      render: (item: any) => (
        <div className="flex items-center gap-1">
          <AvatarText name={item?.patient_name} />
          <span className="text-sm text-gray-500 dark:text-gray-300">
            {item?.patient_name}
          </span>
        </div>
      ),
    },
    {
      label: "Insurance",
      render: (item: any) => (
        <span className="text-sm text-gray-500 dark:text-gray-300">
          {item?.insurance}
        </span>
      ),
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="flex items-center justify-between gap-4 sm:flex-row flex-col mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-700 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-shadow">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span className="text-blue-600">Total Tasks:</span>
            <span className="font-bold text-blue-800 text-base">20</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 text-amber-700 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-shadow">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-amber-600">Unassigned:</span>
            <span className="font-bold text-amber-800 text-base">10</span>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:flex-row flex-col w-full sm:w-auto">
          <Button
            className="sm:w-auto w-full shadow-sm hover:shadow-md transition-shadow"
            onClick={() => {
              setSelectedTask(null);
              setModalType("add");
              openModal();
            }}>
            <Plus className="h-5 w-5" />
            Create New Task
          </Button>
          <CustomDateRange
            onDateChange={(type, range) => {
              if (range) {
                setTaskParams((prev: any) => ({
                  ...prev,
                  target_date_from: range.startDate.toISOString(),
                  target_date_to: range.endDate.toISOString(),
                }));
                getTasks({
                  ...taskParams,
                  target_date_from: range.startDate.toISOString(),
                  target_date_to: range.endDate.toISOString(),
                });
              }
            }}
          />
        </div>
      </div>
      <div className="flex flex-col items-center justify-between gap-2 mb-3 md:flex-row w-full">
        <Search
          className="w-full md:w-auto xl:w-[400px]"
          placeholder="Search..."
          value={taskParams?.search}
          onChange={handleSearch}
        />
        <div className="flex flex-col items-center gap-3 md:flex-row w-full justify-end">
          <FilterModal
            isOpen={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
            title="Filter Tasks"
            description="Filter Tasks based on your criteria"
            filters={[
              {
                key: "priority",
                label: "Priority",
                options: [
                  { label: "High", value: "High" },
                  { label: "Medium", value: "Medium" },
                  { label: "Low", value: "Low" },
                ],
              },
              {
                key: "type_of_chart",
                label: "Type of Chart",
                options: [
                  { label: "Fresh", value: "Fresh" },
                  { label: "RTC", value: "RTC" },
                ],
              },
              {
                key: "project_name",
                label: "Project Name",
                options: projectOptions,
              },
              {
                key: "insurance",
                label: "Insurance",
                options: [
                  { label: "Insurance 1", value: "Insurance 1" },
                  { label: "Insurance 2", value: "Insurance 2" },
                ],
              },
              {
                key: "target_date",
                label: "Target Date",
                type: "dateRange",
              },
            ]}
            filterValues={taskParams}
            onFilterChange={handleFilterChange}
            onApply={handleApplyFilters}
            className="max-w-[800px]"
          />
          <FilterButton
            onClick={() => setIsFilterModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2"
          />
          <ExportButton loading={exportLoading} onClick={handleExport} />
          <Button
            className="sm:w-auto w-full"
            onClick={() => {
              setBulkModalType("assign");
              bulkModal.openModal();
            }}
            disabled={!selectedItems || selectedItems.length === 0}>
            <PackageIcon className="w-4 h-4" />
            Bulk Assign
          </Button>
        </div>
      </div>
      <CommonTable
        headers={headers}
        data={taskData?.Tasks || []}
        showCheckbox={true}
        setSelectedItems={setSelectedItems}
        selectedItems={selectedItems}
        actions={(item: any) => (
          <div className="flex items-center gap-2">
            <Tooltip content="Edit" position="left">
              <button
                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90"
                onClick={() => {
                  setModalType("assign");
                  setSelectedTask(item);
                  mainModal.openModal();
                }}>
                <UserPlus className="w-5 h-5" />
              </button>
            </Tooltip>
            <Tooltip content="Mark" position="left">
              <button
                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90"
                onClick={() => {
                  setSelectedTask(item);
                  markModal.openModal();
                }}>
                <Flag className="w-5 h-5" />
              </button>
            </Tooltip>
            <Tooltip content="Swap" position="left">
              <button
                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90"
                onClick={() => {
                  setSelectedTask(item);
                  swapModal.openModal();
                }}>
                <ArrowLeftRight className="w-5 h-5" />
              </button>
            </Tooltip>
          </div>
        )}
        loading={loading}
      />
      <TableFooter
        rowsPerPage={taskParams?.limit}
        handleRowsPerPageChange={handleRowsPerPageChange}
        currentPage={taskParams?.page}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        totalEntries={taskData?.totalRecords}
        startIndex={startIndex}
        endIndex={endIndex}
      />

      <TaskModal
        isOpen={isOpen}
        closeModal={closeModal}
        modelType={modalType}
        setModelType={setModalType}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
      />

      <UnassignedModal
        isOpen={mainModal.isOpen}
        closeModal={mainModal.closeModal}
        modelType={modalType}
        setModelType={setModalType}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
      />

      <BulkTaskModal
        isOpen={bulkModal.isOpen}
        closeModal={bulkModal.closeModal}
        modelType={bulkModalType}
        setModelType={setBulkModalType}
        seletedItems={selectedItems}
        setSelectedItems={setSelectedItems}
      />

      <ViewModal
        isOpen={viewModal.isOpen}
        closeModal={viewModal.closeModal}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
      />
      <MarkModal
        isOpen={markModal.isOpen}
        closeModal={markModal.closeModal}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
      />
      <SwapModal
        isOpen={swapModal.isOpen}
        closeModal={swapModal.closeModal}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
      />
    </div>
  );
}

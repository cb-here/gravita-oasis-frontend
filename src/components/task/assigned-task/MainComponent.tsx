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
import { formatDate } from "@/utils/formateDate";
import React, { useState, useRef } from "react";
import { format } from "date-fns";
import { FileStackIcon, PauseCircle, RefreshCcw, UserPlus } from "lucide-react";
import BulkTaskModal from "../bulkTaskModals/BulkTaskModal";
import Tabs from "@/components/common/tabs/Tabs";
import UnassignedModal from "./modals/UnassignedModal";
import { Modal } from "@/components/ui/modal";
import NoteList from "@/components/user-management/kanban/components/NoteList";
import TaskModalTabs from "@/components/user-management/kanban/TaskModalTabs";
import TaskDetailsTab from "@/components/user-management/kanban/TaskDetailsTab";
import TaskEditTab from "@/components/user-management/kanban/TaskEditTab";
import TaskHistoryTab from "@/components/user-management/kanban/TaskHistoryTab";
import TaskTasksTab from "@/components/user-management/kanban/TaskTasksTab";
import TaskMoveToSection from "@/components/user-management/kanban/TaskMoveToSection";
import CustomDateRange from "@/components/common/CustomDateRange";

const tabToModalType: Record<string, string> = {
  assign: "unassign",
  hold: "hold",
  rehold: "rehold",
};

export const getPriorityColor = (
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
  const mainModal = useModal();
  const bulkModal = useModal();

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
        assigned_to: "Dr. Alice",
        assigned_date: "2025-10-05",
        held_by: "Admin Team",
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
        assigned_to: "Dr. Bob",
        assigned_date: "2025-10-06",
        held_by: "QA Team",
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
        assigned_to: "Dr. Carol",
        assigned_date: "2025-10-07",
        held_by: "Nursing Dept",
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
        assigned_to: "Dr. Daniel",
        assigned_date: "2025-10-08",
        held_by: "Medical Records",
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
        assigned_to: "Dr. Emily",
        assigned_date: "2025-10-09",
        held_by: "Lab Team",
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
        assigned_to: "Dr. Frank",
        assigned_date: "2025-10-10",
        held_by: "Cardiology Dept",
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
        assigned_to: "Dr. Grace",
        assigned_date: "2025-10-11",
        held_by: "Oncology Dept",
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
        assigned_to: "Dr. Henry",
        assigned_date: "2025-10-12",
        held_by: "Neuro Team",
      },
    ],
  });

  const initParams = {
    search: "",
    page: 1,
    limit: 10,
    priority: "",
  };

  const [taskParams, setTaskParams] = useState<any>(initParams);

  const [loading, setLoading] = useState(false);
  const [showSideModal, setShowSideModal] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState("Edit");
  const [activeEditSubTab, setActiveEditSubTab] = useState("Coding");
  const [selectedMove, setSelectedMove] = useState("Hold");
  const [readOnly, setReadOnly] = useState(false);

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
  const [exportLoading, setExportLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any>();
  const [activeTab, setActiveTab] = useState<any>("assign");

  const getTasks = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    priority?: string;
  }) => {
    setLoading(true);
    try {
      const res = await {
        page: params?.page ?? taskParams?.page,
        limit: params?.limit ?? taskParams?.limit,
        search: params?.search ?? taskParams?.search,
        priority: params?.priority ?? taskParams?.priority,
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
    } catch (error: unknown) {
      console.log("🚀 ~ handleExport ~ error:", error);
    } finally {
      setExportLoading(false);
    }
  };

  const handleSideModalClose = () => {
    setShowSideModal(false);
    setReadOnly(false);
  };

  const baseHeaders = [
    {
      label: "MRN",
      render: (item: any) => (
        <button
          className="cursor-pointer hover:underline hover:text-brand-600 text-left"
          onClick={() => {
            setSelectedTask(item);
            setReadOnly(true);
            setShowSideModal(true);
          }}>
          {item?.mri_number}
        </button>
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
      label: "Assigned To",
      sortable: false,
      render: (item: any) => <span>{item?.assigned_to}</span>,
    },
    {
      label: "Assigned Date",
      sortable: false,
      render: (item: any) => (
        <span>
          {item?.assigned_date
            ? format(new Date(item?.assigned_date), "dd-MM-yyyy")
            : "N/A"}
        </span>
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

  const headers =
    activeTab !== "assign"
      ? [
          ...baseHeaders.slice(0, 8),
          {
            label: "Held By",
            render: (item: any) => (
              <span className="text-sm text-gray-500 dark:text-gray-300">
                {item?.held_by ?? "-"}
              </span>
            ),
          },
          ...baseHeaders.slice(8),
        ]
      : baseHeaders;

  const tabGroups = [
    { key: "assign", name: "Assigned Task", icon: UserPlus },
    { key: "hold", name: "Task on Hold", icon: PauseCircle },
    { key: "rehold", name: "Re-hold Task", icon: RefreshCcw },
  ];

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="flex items-center justify-between gap-4 sm:flex-row flex-col mb-4">
        <Search
          className="w-full md:w-auto xl:w-[300px]"
          placeholder="Search..."
          value={taskParams?.search}
          onChange={handleSearch}
        />
        <div className="flex items-center gap-3 sm:flex-row flex-col w-full sm:w-auto">
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
        <div className="space-y-4 w-fit">
          <Tabs
            tabGroups={tabGroups}
            selectedTabGroup={activeTab}
            onClick={handleTabClick}
          />
        </div>
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
                  { label: "Old", value: "Old" },
                ],
              },
              {
                key: "project_name",
                label: "Project Name",
                options: [
                  { label: "Project 1", value: "Project 1" },
                  { label: "Project 2", value: "Project 2" },
                ],
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
            className="max-w-[700px]"
          />
          <FilterButton
            onClick={() => setIsFilterModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2"
          />
          <ExportButton loading={exportLoading} onClick={handleExport} />
          <Button
            className="sm:w-auto w-full"
            onClick={() => {
              setBulkModalType("unassign");
              bulkModal.openModal();
            }}
            disabled={!selectedItems || selectedItems.length === 0}>
            <FileStackIcon className="h-4 w-4" />
            Bulk Retrieval
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
          <>
            <Tooltip
              content={
                activeTab === "hold"
                  ? "Resolve Hold"
                  : activeTab === "rehold"
                  ? "Resolve Hold "
                  : "Unassign Task"
              }
              position="left">
              <button
                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90"
                onClick={() => {
                  setModalType(tabToModalType[activeTab]);
                  setSelectedTask(item);
                  mainModal.openModal();
                }}>
                {activeTab === "hold" && <PauseCircle className="w-5 h-5" />}
                {activeTab === "rehold" && <RefreshCcw className="w-5 h-5" />}
                {activeTab === "assign" && (
                  <svg
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 transition-transform duration-200 hover:scale-110 active:scale-95 cursor-pointer">
                    <g clipPath="url(#clip0_2776_45625)">
                      <path
                        d="M9.06641 19.3125C10.3632 21.5543 12.787 23.0625 15.563 23.0625C19.7052 23.0625 23.063 19.7047 23.063 15.5625C23.063 11.4203 19.7052 8.0625 15.563 8.0625H9.93805"
                        stroke="#5750F1"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14.0625 15.9375H8.4375C4.29534 15.9375 0.9375 12.5797 0.9375 8.4375C0.9375 4.29534 4.29534 0.9375 8.4375 0.9375C11.2136 0.9375 13.6373 2.44575 14.9341 4.6875"
                        stroke="#5750F1"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.51587 5.18799L6.81516 7.00838C6.50212 7.34344 6.31055 7.79339 6.31055 8.28811C6.31055 8.78283 6.50212 9.23279 6.81516 9.56785L8.51587 11.3882M15.4527 18.8453L17.1534 17.0249C17.4664 16.6898 17.658 16.2398 17.658 15.7451C17.658 15.2504 17.4664 14.8005 17.1534 14.4654L15.4527 12.645"
                        stroke="#5750F1"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_2776_45625">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                )}
              </button>
            </Tooltip>
          </>
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
      <Modal
        isOpen={showSideModal}
        onClose={handleSideModalClose}
        openFromRight={true}
        sidebarContent={<NoteList />}>
        <div className="p-2 w-full h-full flex flex-col">
          <TaskModalTabs
            activeTab={activeMainTab}
            onTabChange={setActiveMainTab}
          />
          <div className="flex-1 overflow-clip">
            {activeMainTab === "Details" && (
              <TaskDetailsTab
                task={{
                  id: "1",
                  mrn: "123456",
                  title: "SN Assessment E",
                  patient: "Jane Smith",
                  dueDate: "05-01-2023",
                  comments: 1,
                  assignee: "/images/user/user-01.jpg",
                  status: "workflow",
                  statusTags: [
                    { label: "Low", color: "green" },
                    { label: "Fresh", color: "blue" },
                  ],
                  category: { name: "Assessment", color: "orange" },
                }}
              />
            )}
            {activeMainTab === "Edit" && (
              <TaskEditTab
                activeSubTab={activeEditSubTab}
                onSubTabChange={setActiveEditSubTab}
                readOnly={readOnly}
              />
            )}
            {activeMainTab === "History" && <TaskHistoryTab />}
            {activeMainTab === "Tasks" && <TaskTasksTab readOnly={readOnly} />}
          </div>
          {!readOnly &&
          ((activeMainTab === "Edit" &&
            !["Preview"].includes(activeEditSubTab)) ||
            activeMainTab === "Tasks") ? (
            <div className="mt-auto pt-6 border-t flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-[10px] bg-[#EAECF0] text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                onClick={handleSideModalClose}>
                Cancel
              </button>
              <button
                className="px-5 py-2 rounded-[10px] bg-brand-primary text-white"
                onClick={() => {
                  setShowSideModal(false);
                }}>
                Save Changes
              </button>
            </div>
          ) : null}

          {!readOnly &&
          ((activeMainTab === "Edit" &&
            !["QA", "Preview"].includes(activeEditSubTab)) ||
            activeMainTab === "Tasks") ? (
            <TaskMoveToSection
              selected={selectedMove}
              onSelect={setSelectedMove}
            />
          ) : null}
        </div>
      </Modal>
    </div>
  );
}

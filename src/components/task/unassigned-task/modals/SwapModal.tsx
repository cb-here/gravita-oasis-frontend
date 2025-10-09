import React, { useState, useCallback } from "react";
import { Modal } from "@/components/ui/modal";
import Badge from "@/components/ui/badge/Badge";
import CommonTable from "@/components/common/CommonTable";
import { getPriorityColor } from "../../assigned-task/MainComponent";
import SearchableSelect from "@/components/form/SearchableSelect";
import SubmitModal from "@/components/common/common-modals/SubmitModal";
import { showToast } from "@/lib/toast";
import Button from "@/components/ui/button/Button";
import { ArrowLeftRight, ArrowLeftRightIcon } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip/Tooltip";

interface SwapModalProps {
  isOpen: boolean;
  closeModal: () => void;
  selectedTask: any;
  setSelectedTask: any;
  modelType: string;
  setModelType: any;
  selectedItems: any;
  setSelectedItems: any;
}

const initialUserList = [
  { _id: 1, fullName: "Alice Johnson", role: "Coder" },
  { _id: 2, fullName: "Michael Smith", role: "QA" },
  { _id: 3, fullName: "Emma Williams", role: "Coder/QA" },
  { _id: 4, fullName: "James Brown", role: "Coder" },
  { _id: 5, fullName: "Olivia Davis", role: "QA" },
  {
    _id: 6,
    fullName: "William Miller",
    role: "Coder/QA",
  },
];

const usersWithTasks: any = {
  1: [
    {
      _id: 101,
      mrn: "123456",
      type_of_chart: "Fresh",
      taskName: "SOC",
      priority: "High",
    },
    {
      _id: 102,
      mrn: "123457",
      type_of_chart: "RTC",
      taskName: "SOC_OT",
      priority: "Medium",
    },
  ],
  2: [
    {
      _id: 201,
      mrn: "234567",
      type_of_chart: "Fresh",
      taskName: "ROC(PT)",
      priority: "Low",
    },
    {
      _id: 202,
      mrn: "234568",
      type_of_chart: "Fresh",
      taskName: "ROC(PT)_2",
      priority: "High",
    },
    {
      _id: 203,
      mrn: "234569",
      type_of_chart: "RTC",
      taskName: "ROC(PT)_OT",
      priority: "Medium",
    },
  ],
  3: [
    {
      _id: 301,
      mrn: "345678",
      type_of_chart: "Fresh",
      taskName: "RECERT",
      priority: "High",
    },
  ],
  4: [
    {
      _id: 401,
      mrn: "456789",
      type_of_chart: "RTC",
      taskName: "SOC_OT",
      priority: "Low",
    },
    {
      _id: 402,
      mrn: "456790",
      type_of_chart: "Fresh",
      taskName: "SOC_OT_2",
      priority: "Medium",
    },
  ],
  5: [
    {
      _id: 501,
      mrn: "567890",
      type_of_chart: "Fresh",
      taskName: "RECERT_ST",
      priority: "High",
    },
    {
      _id: 502,
      mrn: "567891",
      type_of_chart: "RTC",
      taskName: "RECERT_ST_OT",
      priority: "Low",
    },
  ],
  6: [
    {
      _id: 601,
      mrn: "678901",
      type_of_chart: "Fresh",
      taskName: "SN_ASSESSMENT_E",
      priority: "Medium",
    },
    {
      _id: 602,
      mrn: "678902",
      type_of_chart: "Fresh",
      taskName: "SN_ASSESSMENT_E_2",
      priority: "High",
    },
    {
      _id: 603,
      mrn: "678903",
      type_of_chart: "RTC",
      taskName: "SN_ASSESSMENT_E_OT",
      priority: "Low",
    },
  ],
};

export default function SwapModal({
  isOpen,
  closeModal,
  selectedTask,
  setSelectedTask,
  modelType,
  setModelType,
  selectedItems,
  setSelectedItems,
}: SwapModalProps) {
  const [loading, setLoading] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedUserTask, setSelectedUserTask] = useState<any>(null);
  const [localSelected, setLocalSelected] = useState<any>({});

  const userOptions = initialUserList.map((user) => ({
    _id: user._id,
    name: user.fullName,
  }));

  const originalCount = selectedItems ? Object.keys(selectedItems).length : 0;
  const userSelectedCount = Object.values(localSelected).filter(Boolean).length;

  const handleSetLocalSelected = useCallback(
    (newSelected: any) => {
      if (Object.keys(newSelected).length > originalCount) {
        showToast(
          "warning",
          `You can only select up to ${originalCount} tasks.`
        );
        return;
      }
      setLocalSelected(newSelected);
    },
    [originalCount]
  );

  const handleUserChange = (selectedOption: any) => {
    const userId = selectedOption?.value;
    const user = initialUserList.find((u) => u._id === userId);
    setSelectedUser(user || null);
    setSelectedUserTask(null);
    if (modelType === "bulk") {
      setLocalSelected({});
    }
  };

  const getUserTasks = (user: any) => {
    return usersWithTasks[user._id] || [];
  };

  const handleSwapClick = (userTask: any) => {
    if (selectedUser) {
      setSelectedUserTask(userTask);
      setSubmitOpen(true);
    }
  };

  const handleBulkSwapClick = () => {
    if (selectedUser && userSelectedCount === originalCount) {
      setSubmitOpen(true);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSelectedTask(null);
      setSelectedUser(null);
      setSelectedUserTask(null);
      setLocalSelected({});
      setSelectedItems({});
      setModelType("");
      setLoading(false);
      closeModal();
    }
  };

  const handleSwapSubmit = async () => {
    if (modelType === "single" && !selectedTask) return;
    if (modelType === "bulk" && (!selectedItems || originalCount === 0)) return;

    setLoading(true);
    try {
      if (modelType === "single" && selectedTask && selectedUserTask) {
        setSelectedTask((prev: any) => ({
          ...prev,
          taskName: selectedUserTask.taskName,
          mrn: selectedUserTask.mrn,
          priority: selectedUserTask.priority,
        }));
        showToast(
          "success",
          `Tasks swapped successfully! Swapped with ${selectedUserTask.taskName}`
        );
      } else if (modelType === "bulk" && selectedItems) {
        setSelectedItems({});
        showToast(
          "success",
          `Bulk tasks swapped successfully with ${selectedUser.fullName}'s tasks!`
        );
      }
    } catch (error) {
      console.error("Swap error:", error);
    } finally {
      setLoading(false);
      setSubmitOpen(false);
      setSelectedUserTask(null);
      if (modelType === "bulk") {
        setLocalSelected({});
      }
    }
  };

  const baseHeaders = [
    {
      label: "MRN",
      sortable: true,
      render: (row: any) => <p>{row?.mrn}</p>,
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
      label: "Task Name",
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center justify-center">{row?.taskName}</div>
      ),
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
  ];

  const isSingleMode = modelType === "single";
  const isBulkMode = modelType === "bulk";

  const userTasks = selectedUser ? getUserTasks(selectedUser) : [];

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        className={`
         max-w-[1000px]
       p-5 lg:p-10 m-4`}>
        <div className="space-y-6">
          <div className="px-2">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Swap Task
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              Select a user from the list below to swap the selected task with
              one of their current tasks.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 rounded-lg">
            <h5 className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Task Details
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <strong className="text-gray-800 dark:text-gray-200 min-w-max">
                  Task Name:
                </strong>
                <span className="ml-0 sm:ml-2 mt-1 sm:mt-0 text-gray-900 dark:text-gray-100">
                  {selectedTask?.name || "SOC"}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <strong className="text-gray-800 dark:text-gray-200 min-w-max">
                  MRN:
                </strong>
                <span className="ml-0 sm:ml-2 mt-1 sm:mt-0 text-gray-900 dark:text-gray-100">
                  {selectedTask?.mrn || "345678"}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <strong className="text-gray-800 dark:text-gray-200 min-w-max">
                  Target Date:
                </strong>
                <span className="ml-0 sm:ml-2 mt-1 sm:mt-0 text-gray-900 dark:text-gray-100">
                  {selectedTask?.targetDate
                    ? new Date(selectedTask.targetDate).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <strong className="text-gray-800 dark:text-gray-200 min-w-max">
                  Project Name:
                </strong>
                <Badge
                  color="success"
                  className="ml-0 sm:ml-2 mt-1 sm:mt-0 text-gray-900 dark:text-gray-100">
                  {selectedTask?.projectName || "Project J"}
                </Badge>
              </div>
            </div>
          </div>

          <SearchableSelect
            dataProps={{
              optionData: userOptions,
            }}
            selectionProps={{
              selectedValue: selectedUser
                ? {
                    value: selectedUser._id,
                    label: selectedUser.fullName,
                  }
                : null,
            }}
            displayProps={{
              placeholder: "Search and select a user",
              id: "user-select-swap",
              layoutProps: "w-full",
            }}
            eventHandlers={{
              onChange: handleUserChange,
            }}
          />

          {selectedUser ? (
            <>
              <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
                Currently assigned tasks for {selectedUser.fullName}
              </h1>
              {userTasks.length > 0 ? (
                <>
                  {isBulkMode && (
                    <div className="flex items-center justify-end mb-4">
                      <Button
                        onClick={handleBulkSwapClick}
                        disabled={
                          loading ||
                          userSelectedCount === 0 ||
                          userSelectedCount !== originalCount
                        }>
                        <ArrowLeftRightIcon className="h-5 w-5" />
                        Swap
                      </Button>
                    </div>
                  )}
                  <CommonTable
                    headers={baseHeaders}
                    data={userTasks}
                    selectedItems={isBulkMode ? localSelected : {}}
                    setSelectedItems={
                      isBulkMode ? handleSetLocalSelected : undefined
                    }
                    showCheckbox={isBulkMode}
                    actions={
                      isSingleMode
                        ? (item: any) => (
                            <Tooltip content="Swap" position="left">
                              <button
                                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSwapClick(item);
                                }}>
                                <ArrowLeftRight className="w-5 h-5" />
                              </button>
                            </Tooltip>
                          )
                        : undefined
                    }
                  />
                </>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No tasks assigned to this user.
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Please select a user to view their assigned tasks.
            </p>
          )}
        </div>
      </Modal>

      <SubmitModal
        isOpen={submitOpen}
        closeModal={() => setSubmitOpen(false)}
        title="Confirm Task Swap"
        description={
          modelType === "single"
            ? `Are you sure you want to swap the task "${selectedTask?.name}" (MRN: ${selectedTask?.mrn}) with "${selectedUser?.fullName}'s task "${selectedUserTask?.taskName}" (MRN: ${selectedUserTask?.mrn})?`
            : `Are you sure you want to bulk swap the ${originalCount} selected tasks with ${selectedUser?.fullName}'s ${userSelectedCount} selected tasks?`
        }
        onSubmit={handleSwapSubmit}
        btnText={modelType === "single" ? "Swap Task" : "Swap Tasks"}
      />
    </>
  );
}

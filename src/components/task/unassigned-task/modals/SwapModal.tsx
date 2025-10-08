import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Badge from "@/components/ui/badge/Badge";
import CommonTable from "@/components/common/CommonTable";
import AvatarText from "@/components/ui/avatar/AvatarText";
import { getRoleColor } from "@/components/capacity-planning/tabs/PlanningTab";
import { getTagsColor } from "@/components/system-management/master-data/MainComponent";
import Search from "@/components/common/Search";
import { Tooltip } from "@/components/ui/tooltip/Tooltip";
import { ArrowLeftRight } from "lucide-react";
import FilterButton from "@/components/common/filter/FilterButton";
import SubmitModal from "@/components/common/common-modals/SubmitModal";
import { showToast } from "@/lib/toast";

interface SwapModalProps {
  isOpen: boolean;
  closeModal: () => void;
  selectedTask: any;
  setSelectedTask: any;
}

const initialUserList = [
  { id: 1, fullName: "Alice Johnson", task: "SOC", role: "Coder" },
  { id: 2, fullName: "Michael Smith", task: "ROC(PT)", role: "QA" },
  { id: 3, fullName: "Emma Williams", task: "RECERT", role: "Coder/QA" },
  { id: 4, fullName: "James Brown", task: "SOC_OT", role: "Coder" },
  { id: 5, fullName: "Olivia Davis", task: "RECERT_ST", role: "QA" },
  {
    id: 6,
    fullName: "William Miller",
    task: "SN_ASSESSMENT_E",
    role: "Coder/QA",
  },
];

export default function SwapModal({
  isOpen,
  closeModal,
  selectedTask,
  setSelectedTask,
}: SwapModalProps) {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userList, setUserList] = useState(initialUserList);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const filteredUsers = userList.filter((user) =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClose = () => {
    if (!loading) {
      setSelectedTask(null);
      setSelectedUser(null);
      setLoading(false);
      closeModal();
    }
  };

  const handleSwapClick = (user: any) => {
    setSelectedUser(user);
    setSubmitOpen(true);
  };

  const handleSwapSubmit = async () => {
    if (!selectedTask || !selectedUser) return;

    setLoading(true);
    try {
      setUserList((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id
            ? { ...u, task: selectedTask.name }
            : u.id === selectedTask.userId
            ? { ...u, task: selectedUser.task }
            : u
        )
      );

      showToast("success", `Tasks swapped successfully!`);
      setSelectedTask((prev: any) => ({ ...prev, task: selectedUser.task }));
    } catch (error) {
      console.error("Swap error:", error);
      throw error;
    } finally {
      setLoading(false);
      setSubmitOpen(false);
      setSelectedUser(null);
    }
  };

  const headers = [
    {
      label: "User",
      sortable: true,
      render: (row: any) => {
        const safeFullName =
          typeof row.fullName === "string" ? row.fullName : "Unknown User";
        const safeRole =
          typeof row.role === "string" ? row.role : "Unknown Role";
        return (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <AvatarText name={safeFullName} />
              <span>{safeFullName}</span>
            </div>
            <div>
              <Badge className="text-xs" color={getRoleColor(safeRole)}>
                {safeRole}
              </Badge>
            </div>
          </div>
        );
      },
    },
    {
      label: "Current Task",
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center justify-center">
          <Badge
            className="text-xs"
            color={getTagsColor(row.task)}
            variant="light">
            {row?.task ?? "Unknown"}
          </Badge>
        </div>
      ),
    },
  ];

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
              their current task.
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

          <div className="flex items-center justify-between">
            <Search
              placeholder="Search user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="!w-[330px]"
            />
            <FilterButton onClick={() => {}} />
          </div>

          <CommonTable
            headers={headers}
            data={filteredUsers}
            actions={(item: any) => (
              <Tooltip content="Swap" position="left">
                <button
                  className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90"
                  onClick={() => handleSwapClick(item)}
                  disabled={loading}>
                  <ArrowLeftRight className="w-5 h-5" />
                </button>
              </Tooltip>
            )}
          />
        </div>
      </Modal>

      <SubmitModal
        isOpen={submitOpen}
        closeModal={() => setSubmitOpen(false)}
        title="Confirm Task Swap"
        description={`Are you sure you want to swap the task "${selectedTask?.name}" with "${selectedUser?.fullName}'s current task "${selectedUser?.task}"?`}
        onSubmit={handleSwapSubmit}
        btnText="Swap Tasks"
      />
    </>
  );
}

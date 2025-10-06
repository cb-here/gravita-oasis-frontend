import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Badge from "@/components/ui/badge/Badge";
import { format } from "date-fns";
import Button from "@/components/ui/button/Button";
import {
  Printer,
  RefreshCw,
  Edit,
  UserRound,
  ClipboardList,
  UserCheck,
  Clock,
  Tags,
} from "lucide-react";
import TaskModal from "../../unassigned-task/modals/TaskModal";
import { useModal } from "@/hooks/useModal";

interface ViewModalProps {
  isOpen: boolean;
  closeModal: () => void;
  selectedTask: any;
  setSelectedTask: any;
}

export default function ViewModal({
  isOpen,
  closeModal,
  selectedTask,
  setSelectedTask,
}: ViewModalProps) {
  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState<any>("");
  const mainModal = useModal();

  const handleClose = () => {
    if (!loading) {
      setSelectedTask(null);
      setLoading(false);
      closeModal();
    }
  };

  if (!selectedTask) return null;

  const task = selectedTask;

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
      case "critical":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "info";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "success";
      case "in_progress":
        return "info";
      case "assigned":
        return "primary";
      case "unassigned":
        return "warning";
      default:
        return "info";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        openFromRight
        className="md:p-6 p-4"
      >
        <div className="space-y-6">
          <div className="space-y-4 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight truncate">
                  {task.task_name}
                </h2>
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  <span className="text-xs font-mono text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-md px-2.5 py-1">
                    ID: {task.id || "#56789fghjk67"}
                  </span>
                  <span className="text-xs font-mono text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-md px-2.5 py-1">
                    MRN: {task.mri_number || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Status:
                  </span>
                  <Badge
                    variant="light"
                    color={getStatusColor(task.status)}
                    className="capitalize"
                  >
                    {task.status?.replace("_", " ").toUpperCase() ||
                      "unassigned"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Priority:
                  </span>
                  <Badge color={getPriorityColor(task.priority)}>
                    {task.priority?.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  onClick={() => window.print()}
                  variant="outline"
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    // Add refresh logic here
                    console.log("Refreshing task:", task.id);
                  }}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white transition-all duration-200 hover:shadow-lg"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setModalType("edit");
                    mainModal.openModal();
                  }}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white transition-all duration-200 hover:shadow-lg"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 rounded-xl p-5 border border-blue-200/50 dark:border-blue-800/30">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <UserRound className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
                Patient Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Name
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {task.patient_name || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Age
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {task.age ? `${task.age} years old` : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Insurance
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {task.insurance || "Not specified"}
                  </span>
                </div>
              </div>
            </div>

            {/* Task Details */}
            <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10 rounded-xl p-5 border border-green-200/50 dark:border-green-800/30">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <ClipboardList className="w-5 h-5 mr-2 text-green-500 dark:text-green-400" />
                Task Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Task Name
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white text-right max-w-[200px] truncate">
                    {task.task_name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Type
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {task.type_of_chart || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Target Date
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatDate(task.target_date)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Project
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {task.project_name || "No project assigned"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10 rounded-xl p-5 border border-purple-200/50 dark:border-purple-800/30">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <UserCheck className="w-5 h-5 mr-2 text-purple-500 dark:text-purple-400" />
                Assignment Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Assigned To
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {task.assigned_to === "Unassigned" || !task.assigned_to ? (
                      <Badge color="info" size="sm">
                        Unassigned
                      </Badge>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {task.assigned_to.charAt(0).toUpperCase()}
                        </div>
                        <span>{task.assigned_to}</span>
                      </div>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Team
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {task.team || "No team assigned"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Assigned Date
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {task.assigned_date
                      ? formatDate(task.assigned_date)
                      : "Not assigned"}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/10 rounded-xl p-5 border border-orange-200/50 dark:border-orange-800/30">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-500 dark:text-orange-400" />
                Timeline
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Created
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatDate(task.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Last Updated
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatDate(task.updatedAt)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Days Since Created
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {Math.floor(
                      (new Date().getTime() -
                        new Date(task.createdAt).getTime()) /
                        (1000 * 60 * 60 * 24)
                    ) || "9"}{" "}
                    days
                  </span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-950/20 dark:to-indigo-900/10 rounded-xl p-5 border border-indigo-200/50 dark:border-indigo-800/30">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Tags className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag: string, index: number) => (
                    <Badge key={index} color="purple" variant="light" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
      <TaskModal
        isOpen={mainModal.isOpen}
        closeModal={mainModal.closeModal}
        modelType={modalType}
        setModelType={setModalType}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
      />
    </>
  );
}

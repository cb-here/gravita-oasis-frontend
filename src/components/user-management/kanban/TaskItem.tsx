import { useState } from "react";
import { Task } from "./types/types";
import TaskModalTabs from "./TaskModalTabs";
import TaskEditTab from "./TaskEditTab";
import TaskDetailsTab from "./TaskDetailsTab";
import TaskHistoryTab from "./TaskHistoryTab";
import TaskTasksTab from "./TaskTasksTab";
import { ChevronDownIcon, ChevronUpIcon } from "@/icons";
import CheckInModal from "./modals/CheckInModal";
import TaskMoveToSection from "./TaskMoveToSection";
import NoteList from "./components/NoteList";
import { AlarmClock, Calendar1Icon } from "lucide-react";
import Switch from "@/components/form/switch/Switch";
import { Modal } from "@/components/ui/modal";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { useModal } from "@/hooks/useModal";
import SubmitModal from "@/components/common/common-modals/SubmitModal";
import { showToast } from "@/lib/toast";

interface TaskItemProps {
  task: Task;
  index: number;
  moveTask: (dragIndex: number, hoverIndex: number) => void;
  changeTaskStatus: (taskId: string, newStatus: string) => void;
  showToggleButton?: boolean;
  selectedRole?: string | null;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  showToggleButton,
  selectedRole,
}) => {
  const [selectedMove, setSelectedMove] = useState("Hold");
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showSideModal, setShowSideModal] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState("Edit");
  const [activeEditSubTab, setActiveEditSubTab] = useState("Coding");
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const submitModal = useModal();

  const visibleSubTabs = (() => {
    if (selectedRole === "coder") {
      return ["Coding", "Oasis", "Poc", "Preview"];
    } else if (selectedRole === "qa") {
      return ["Coding", "Oasis", "Poc", "QA", "Preview"];
    } else if (selectedRole === "coderqa") {
      return ["Coding", "Oasis", "Poc", "QA", "Preview"];
    }
    return ["Coding", "Oasis", "Poc", "QA", "Preview"];
  })();

  const getTimeDisplay = () => {
    if (
      task.status === "workflow" ||
      task.status === "onHold" ||
      task.status === "rehold" ||
      task.status === "underQA" ||
      task.status === "completed"
    ) {
      return "In 20m";
    }
  };

  const handleToggle = (checked: boolean) => {
    if (checked) {
      setShowCheckInModal(true);
    } else {
      setIsCheckedIn(false);
    }
  };

  const handleCheckInModalClose = () => {
    setShowCheckInModal(false);
  };

  const handleCheckInSuccess = () => {
    setShowCheckInModal(false);
    setIsCheckedIn(true);
  };

  const handleSideModalClose = () => {
    setShowSideModal(false);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSideModal(true);
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleAccordionToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAccordionOpen(!isAccordionOpen);
  };

  return (
    <div
      className={`relative border dark:border-gray-700 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 ease-in-out`}>
      {!isAccordionOpen && (
        <div className={`p-2.5 cursor-pointer`} onClick={handleAccordionToggle}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm leading-[20px] font-medium text-brand-primary">
                MRN: {task.mrn}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-300">
                <AlarmClock className="w-3 h-3 text-gray-400" />
                {getTimeDisplay()}
              </div>
              <div className="transform transition-transform duration-300 ease-in-out">
                <ChevronDownIcon className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      )}

      {isAccordionOpen && (
        <div className="transition-all duration-300 ease-in-out">
          <div
            className={`p-2.5 border-b border-gray-200 dark:border-gray-600 cursor-pointer`}
            onClick={handleAccordionToggle}>
            <div className="flex items-center justify-between">
              <span className="text-sm leading-[20px] font-medium text-brand-primary">
                MRN: {task.mrn}
              </span>

              <div className="flex items-center gap-3">
                <div className="transform transition-transform duration-300 ease-in-out">
                  <ChevronUpIcon className="w-4 h-4 text-gray-500" />
                </div>
              </div>
            </div>
          </div>

          <div
            className={`p-2.5 cursor-pointer overflow-hidden transition-all duration-300 ease-in-out transform ${
              isAccordionOpen
                ? "max-h-[500px] opacity-100 translate-y-0"
                : "max-h-0 opacity-0 -translate-y-2"
            }`}
            onClick={handleCardClick}>
            <div className="flex items-center justify-between mb-[12px]">
              <h4 className="text-base text-gray-dark leading-[24px] font-medium">
                {task.title}
              </h4>
              {showToggleButton && (
                <div className="toggle-button" onClick={handleToggleClick}>
                  <Switch checked={isCheckedIn} onChange={handleToggle} />
                </div>
              )}
            </div>

            <div className="p-3 bg-[#F2F4F7] dark:bg-gray-600 rounded-[6px] mb-[8px]">
              <p className="text-sm text-gray-light leading-[20px]">
                Patient: {task.patient}
              </p>
            </div>

            <div className="flex flex-wrap gap-[12px] mb-[12px]">
              {task.statusTags &&
                task.statusTags.map(
                  (tag, idx) =>
                    tag.label && (
                      <Badge
                        key={idx}
                        className={`rounded-[6px] text-xs`}
                        color={getStatusTagColor(tag.color)}>
                        <span className="font-semibold">{tag.label}</span>
                      </Badge>
                    )
                )}
            </div>

            <div className="mt-[12px] flex items-center justify-between text-xs text-gray-500 dark:text-gray-300">
              <div className="flex items-center gap-1">
                <AlarmClock className="w-4 h-4 text-gray-400" />
                {getTimeDisplay()}
              </div>

              <div className="flex items-center gap-1">
                <Calendar1Icon className="w-4 h-4 text-gray-400" />
                {task.dueDate}
              </div>
            </div>
          </div>
        </div>
      )}

      {showCheckInModal && (
        <CheckInModal
          isOpen={showCheckInModal}
          onClose={handleCheckInModalClose}
          onCheckIn={handleCheckInSuccess}
          taskData={{
            taskId: task.id || "",
            taskName: task.title || "Task",
            patientName: task.patient || "",
            mrn: task.mrn || "",
            priority: task.statusTags?.[0]?.label || "Low",
          }}
        />
      )}

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
            {activeMainTab === "Details" && <TaskDetailsTab task={task} />}
            {activeMainTab === "Edit" && (
              <TaskEditTab
                activeSubTab={activeEditSubTab}
                onSubTabChange={setActiveEditSubTab}
                visibleSubTabs={visibleSubTabs}
              />
            )}
            {activeMainTab === "History" && <TaskHistoryTab />}
            {activeMainTab === "Tasks" && <TaskTasksTab />}
          </div>
          {(activeMainTab === "Edit" &&
            !["Preview"].includes(activeEditSubTab)) ||
          activeMainTab === "Tasks" ? (
            <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 mr-4 pb-6">
              <Button
                variant="outline"
                className="px-4 py-2 rounded-[10px] bg-[#EAECF0] text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                onClick={handleSideModalClose}>
                Cancel
              </Button>

              <Button
                variant="primary"
                className="px-5 py-2 rounded-[10px]"
                onClick={() => {
                  setShowSideModal(false);
                  setShowCheckInModal(true);
                }}>
                Save Changes
              </Button>
              {selectedRole === "qa" && (
                <Button
                  variant="gradient"
                  className="px-5 py-2 rounded-[10px]"
                  onClick={() => {
                    submitModal.openModal();
                  }}>
                  Submit
                </Button>
              )}
            </div>
          ) : null}

          {(activeMainTab === "Edit" &&
            !["QA", "Preview"].includes(activeEditSubTab)) ||
          activeMainTab === "Tasks" ? (
            <TaskMoveToSection
              selected={selectedMove}
              onSelect={setSelectedMove}
            />
          ) : null}
        </div>
      </Modal>
      <SubmitModal
        isOpen={submitModal.isOpen}
        closeModal={submitModal.closeModal}
        title="Submit Task for Review"
        description="You are about to submit this task for final review and approval. Once submitted, no further edits can be made by you. Please ensure all coding, QA checks, and required notes are complete before proceeding."
        onSubmit={async () => {
          showToast(
            "success",
            "Task submitted successfully!",
            "The task has been submitted for review."
          );
        }}
        btnText="Submit"
      />
    </div>
  );
};

const getStatusTagColor = (color: string) => {
  switch (color) {
    case "green":
      return "success";
    case "blue":
      return "primary";
    case "red":
      return "error";
    case "yellow":
      return "warning";
    default:
      return "info";
  }
};

export default TaskItem;

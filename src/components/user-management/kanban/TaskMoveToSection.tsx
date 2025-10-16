import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import TextArea from "@/components/form/input/TextArea";

interface TaskMoveToSectionProps {
  selected: string;
  onSelect: (value: string) => void;
}

const holdReasons = [
  "Vinod’s Open",
  "Under QA",
  "Ready for Vinod",
  "Pre-Coding Review",
  "Rushil",
  "Need NOC",
  "Need Eval",
  "High Priority",
  "Dx Verify",
  "Medication Queries",
  "Missing Chart Info",
  "Clerical Follow up",
  "Awaiting Clinician Response",
  "Need Nurse",
  "Audit Completed",
  "Orders/Foley and Other Notes",
  "Patient Discharged",
  "Coding Completed",
];

const TaskMoveToSection: React.FC<TaskMoveToSectionProps> = ({
  selected,
  onSelect,
}) => {
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [otherText, setOtherText] = useState("");
  const [holdCount, setHoldCount] = useState(0);

  const handleReasonClick = (reason: string) => {
    if (reason === "Other") {
      setSelectedReasons(["Other"]);
    } else {
      setSelectedReasons((prev) => {
        const newReasons = prev.includes(reason)
          ? prev.filter((r) => r !== reason)
          : [...prev, reason];

        return newReasons.filter((r) => r !== "Other");
      });
    }
  };

  const getHoldLabel = () => {
    return holdCount >= 2 ? "Rehold" : "Hold";
  };

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-4 mt-4">
      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2">
        Move to
      </div>
      <div className="flex gap-4">
        {[getHoldLabel(), "Under QA", "Submission"].map((option) => (
          <button
            key={option}
            className={`flex-1 py-2 rounded-[10px] font-medium text-sm transition-colors duration-150 focus:outline-none
              ${
                selected === option
                  ? "bg-brand-primary text-white shadow"
                  : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-600"
              }
            `}
            onClick={() => {
              onSelect(option);
              if (option === "Hold" || option === "Rehold")
                setShowReasonModal(true);
              else setShowReasonModal(false);
            }}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>

      {/* Reason Selection Modal */}
      <Modal
        isOpen={showReasonModal}
        onClose={() => setShowReasonModal(false)}
        className="max-w-[500px]"
      >
        <div className="p-6">
          <h1 className="text-[24px] font-semibold leading-[30px] text-gray-900 dark:text-white mb-4 text-center">
            Select your reasons for hold
          </h1>

          <div className="flex flex-wrap gap-3 justify-center max-h-[350px] overflow-auto custom-scrollbar">
            {holdReasons.map((reason) => (
              <button
                key={reason}
                onClick={() => handleReasonClick(reason)}
                className={`px-[16px] py-[8px] rounded-[6px] border flex items-center gap-2
                  transform transition-all duration-300 ease-in-out
                  ${
                    selectedReasons.includes(reason)
                      ? "bg-brand-primary text-white border-brand-primary scale-105"
                      : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-600 hover:scale-105"
                  }`}
              >
                {reason}
                {selectedReasons.includes(reason) && (
                  <span className="ml-1">✕</span>
                )}
              </button>
            ))}
          </div>

          {selectedReasons.includes("Other") && (
            <TextArea
              className="w-full mt-4 p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={3}
              placeholder="Please specify your reason..."
              value={otherText}
              onChange={(value) => setOtherText(value)}
            />
          )}

          <button
            className={`w-full px-[16px] py-[10px] rounded-[10px] text-white mt-6 transition-colors duration-150
              ${
                selectedReasons.length === 0
                  ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                  : "bg-brand-primary hover:bg-brand-primary/90"
              }`}
            onClick={() => {
              if (selectedReasons.length === 0) return;
              setShowReasonModal(false);
              setShowConfirmModal(true);
            }}
            disabled={selectedReasons.length === 0}
          >
            Move to {getHoldLabel()}
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        showCloseButton={false}
        className="max-w-[400px]"
      >
        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-[86px] h-[86px] flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/20 text-brand-primary mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Are you sure you want to move to {getHoldLabel()}?
          </h2>
          <div className="flex gap-4 w-full">
            <button
              className="flex-1 py-2 rounded-[10px] border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              onClick={() => setShowConfirmModal(false)}
            >
              No
            </button>
            <button
              className="flex-1 py-2 rounded-[10px] bg-brand-primary text-white hover:bg-brand-primary/90"
              onClick={() => {
                console.log("Final Confirmed Reasons:", selectedReasons);
                if (selectedReasons.includes("Other")) {
                  console.log("Other Text:", otherText);
                }
                setHoldCount((prev) => prev + 1);
                setShowConfirmModal(false);
              }}
            >
              Yes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default React.memo(TaskMoveToSection);

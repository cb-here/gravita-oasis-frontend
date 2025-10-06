import { Modal } from "@/components/ui/modal";
import { Clock1, InfoIcon, User, CheckCircle } from "lucide-react";
import { useTimer } from "@/lib/contexts/TimerContext";
import { useState } from "react";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";

interface CheckOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckOut?: (notes: string) => void;
}

export default function CheckOutModal({
  isOpen,
  onClose,
  onCheckOut,
}: CheckOutModalProps) {
  const { stopTimer, taskInfo, getElapsedTime } = useTimer();
  const [notes, setNotes] = useState("");

  const formatElapsedTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  const handleCheckOut = () => {
    stopTimer();
    onCheckOut?.(notes);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="p-5 max-w-[464px]"
      showCloseButton={false}
    >
      <div className="flex items-center justify-center flex-col mb-[14px]">
        <div className="flex items-center justify-center p-[16px] rounded-full w-[68px] h-[68px] bg-brand-100 mb-[12px]">
          <CheckCircle className="w-9 h-9 text-brand-600" />
        </div>
        <h1 className="text-gray-dark text-[20px] font-semibold">
          Check Out from Task
        </h1>
        <p className="text-gray-light text-[16px]">
          Time tracking will stop and session will be saved
        </p>
      </div>

      <div className="bg-new-gray-500 p-[14px] rounded-[10px]">
        <h3 className="text-gray-dark text-[16px] flex items-center gap-[8px]">
          <Clock1 className="w-[18px] h-[21px] text-brand-600" />
          <span className="text-gray-dark text-[16px]">
            {taskInfo?.taskName || "Task"}
          </span>
        </h3>
        <div className="flex items-center justify-between mt-[16px] px-[14px]">
          <div className="flex items-center gap-[8px]">
            <User className="w-6 h-6" />
            <div>
              <p className="text-gray-light">Patient</p>
              <p className="text-gray-dark">{taskInfo?.patientName || "N/A"}</p>
            </div>
          </div>
          <div>
            <p className="text-gray-light">MRN</p>
            <p className="text-gray-dark">{taskInfo?.mrn || "N/A"}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-[16px] px-[14px]">
          <div className="flex items-start gap-[8px] ml-[8px] flex-col">
            <p className="text-gray-light">Time Spent</p>
            <p className="text-gray-dark text-left font-semibold text-lg">
              {formatElapsedTime(getElapsedTime())}
            </p>
          </div>
          <div>
            <p className="text-gray-light">Priority</p>
            <span
              className={`px-[10px] py-[3px] rounded-[6px] text-[12px] leading-[18px] font-medium ${
                taskInfo?.priority === "High"
                  ? "bg-red-100 text-red-700"
                  : taskInfo?.priority === "Medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-new-green text-green-700"
              }`}
            >
              <span className="font-semibold">
                {taskInfo?.priority || "Low"}
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="bg-brand-50 flex items-center gap-2 justify-center mt-[14px] p-[14px] rounded-[10px]">
        <InfoIcon className="w-5 h-5 !text-brand-600 flex-shrink-0" />
        <p className="text-brand-600 text-[14px] leading-[20px]">
          Your session time of {formatElapsedTime(getElapsedTime())} will be
          saved and can be reviewed in the task history.
        </p>
      </div>

      <div className="flex items-center justify-between w-full mt-[20px] gap-[8px]">
        <Button
          variant="outline"
          className="px-4 py-2 rounded-[10px] bg-[#EAECF0] text-gray-700 dark:bg-gray-700 dark:text-gray-200 w-1/2"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="error"
          className="px-4 py-2 rounded-[10px] text-white w-1/2"
          onClick={handleCheckOut}
        >
          Check-out
        </Button>
      </div>
    </Modal>
  );
}

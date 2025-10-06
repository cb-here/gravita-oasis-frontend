import { Modal } from "@/components/ui/modal";
import { Clock1, InfoIcon, User } from "lucide-react";
import { useTimer } from "@/lib/contexts/TimerContext";

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckIn?: () => void;
  taskData?: {
    taskId: string;
    taskName: string;
    patientName?: string;
    mrn?: string;
    priority?: string;
    age?: string;
  };
}

export default function CheckInModal({
  isOpen,
  onClose,
  onCheckIn,
  taskData,
}: CheckInModalProps) {
  const { startTimer } = useTimer();

  const handleCheckIn = () => {
    if (taskData) {
      startTimer({
        taskId: taskData.taskId,
        taskName: taskData.taskName,
        patientName: taskData.patientName,
        mrn: taskData.mrn,
        priority: taskData.priority,
        age: taskData.age,
      });
      onCheckIn?.();
    }
    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="p-5 max-w-[464px]" showCloseButton={false}>
      <div className="flex items-center justify-center flex-col mb-[14px]">
        <div className="flex items-center justify-center p-[16px] rounded-full w-[68px] h-[68px] bg-brand-primary-100 mb-[12px]">
          <Clock1 className="w-9 h-9 text-brand-primary" />
        </div>
        <h1 className="text-gray-dark text-[20px] font-semibold">
          Check In to Task
        </h1>
        <p className="text-gray-light text-[16px]">
          Time tracking will begin automatically
        </p>
      </div>
      <div className="bg-new-gray-500 p-[14px] rounded-[10px]">
        <h3 className="text-gray-dark text-[16px] flex items-center gap-[8px]">
          <Clock1 className="w-[18px] h-[21px] text-brand-primary" />
          <span className="text-gray-dark text-[16px]">
            {taskData?.taskName || "Patient Assessment"}
          </span>
        </h3>
        <div className="flex items-center justify-between mt-[16px] px-[14px]">
          <div className="flex items-center gap-[8px]">
            <User className="w-6 h-6" />
            <div>
              <p className="text-gray-light">Patient</p>
              <p className="text-gray-dark">
                {taskData?.patientName || "Robert Johnson"}
              </p>
            </div>
          </div>
          <div>
            <p className="text-gray-light">MRN</p>
            <p className="text-gray-dark">{taskData?.mrn || "112222"}</p>
          </div>
        </div>
        <div className="flex items- justify-between mt-[16px] px-[14px]">
          <div className="flex items-start gap-[8px] ml-[8px] flex-col">
            <p className="text-gray-light">Age</p>
            <p className="text-gray-dark text-left">{taskData?.age || "18"}</p>
          </div>
          <div>
            <p className="text-gray-light">Priority</p>
            <span
              className={`px-[10px] py-[3px] rounded-[6px] text-[12px] leading-[18px] font-medium ${
                taskData?.priority === "High"
                  ? "bg-red-100 text-red-700"
                  : taskData?.priority === "Medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-new-green text-green-700"
              }`}
            >
              <span className="font-semibold">
                {taskData?.priority || "Low"}
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="bg-new-brand-50 flex items-center gap-2 justify-center mt-[14px] p-[14px] rounded-[10px]">
        <InfoIcon className="w-5 h-5 !text-brand-primary flex-shrink-0" />
        <p className="text-brand-primary text-[14px] leading-[20px]">
          Your session will be timed until you check out. Notes and
          documentation can be added when you want to check-in
        </p>
      </div>

      <div className="flex items-center justify-between w-full mt-[20px] gap-[8px]">
        <button
          className="px-4 py-2 rounded-[10px] bg-[#EAECF0] text-gray-700 dark:bg-gray-700 dark:text-gray-200 w-1/2"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 rounded-[10px] bg-brand-primary text-white w-1/2"
          onClick={handleCheckIn}
        >
          Check-in
        </button>
      </div>
    </Modal>
  );
}

import { Modal } from "@/components/ui/modal";
import { Clock1, InfoIcon, User } from "lucide-react";
import { useTimer } from "@/lib/contexts/TimerContext";
import Badge from "@/components/ui/badge/Badge";
import { getPriorityColor } from "@/components/task/assigned-task/MainComponent";
import Button from "@/components/ui/button/Button";

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="p-5 max-w-[464px]"
      showCloseButton={false}
    >
      <div className="flex items-center justify-center flex-col mb-[14px]">
        <div className="flex items-center justify-center p-[16px] rounded-full w-[68px] h-[68px] bg-brand-primary-100 dark:bg-brand-primary-900/20 mb-[12px]">
          <Clock1 className="w-9 h-9 text-brand-primary dark:text-brand-primary-300" />
        </div>
        <h1 className="text-gray-900 dark:text-white text-[20px] font-semibold">
          Check In to Task
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-[16px]">
          Time tracking will begin automatically
        </p>
      </div>
      <div className="bg-gray-50 dark:bg-gray-800 p-[14px] rounded-[10px]">
        <h3 className="text-gray-900 dark:text-white text-[16px] flex items-center gap-[8px]">
          <Clock1 className="w-[18px] h-[21px] text-brand-primary dark:text-brand-primary-300" />
          <span className="text-gray-900 dark:text-white text-[16px]">
            {taskData?.taskName || "Patient Assessment"}
          </span>
        </h3>
        <div className="flex items-center justify-between mt-[16px] px-[14px]">
          <div className="flex items-center gap-[8px]">
            <User className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            <div>
              <p className="text-gray-500 dark:text-gray-400">Patient</p>
              <p className="text-gray-900 dark:text-white">
                {taskData?.patientName || "Robert Johnson"}
              </p>
            </div>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">MRN</p>
            <p className="text-gray-900 dark:text-white">
              {taskData?.mrn || "112222"}
            </p>
          </div>
        </div>
        <div className="flex items-start justify-between mt-[16px] px-[14px]">
          <div className="flex items-start gap-[8px] ml-[8px] flex-col">
            <p className="text-gray-500 dark:text-gray-400">Age</p>
            <p className="text-gray-900 dark:text-white text-left">
              {taskData?.age || "18"}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Priority</p>

            <Badge
              color={getPriorityColor(taskData?.priority as string)}
              className="font-semibold"
            >
              {taskData?.priority || "Low"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="bg-brand-50 dark:bg-brand-900/10 flex items-center gap-2 justify-center mt-[14px] p-[14px] rounded-[10px]">
        <InfoIcon className="w-5 h-5 !text-brand-primary dark:!text-brand-primary-300 flex-shrink-0" />
        <p className="text-brand-primary dark:text-brand-primary-300 text-[14px] leading-[20px]">
          Your session will be timed until you check out. Notes and
          documentation can be added when you want to check-in
        </p>
      </div>

      <div className="flex items-center justify-between w-full mt-[20px] gap-[8px]">
        <Button
          variant="outline"
          className="px-4 py-2 rounded-[10px] bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 w-1/2"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          className="px-4 py-2 rounded-[10px]  w-1/2"
          onClick={handleCheckIn}
        >
          Check-in
        </Button>
      </div>
    </Modal>
  );
}

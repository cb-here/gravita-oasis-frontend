import { Task } from "./types/types";
import TaskItem from "./TaskItem";

interface ColumnProps {
  title: string;
  tasks: Task[];
  status: string;
  moveTask: (dragIndex: number, hoverIndex: number) => void;
  changeTaskStatus: (taskId: string, newStatus: string) => void;
}

const Column: React.FC<ColumnProps> = ({
  title,
  tasks,
  status,
  moveTask,
  changeTaskStatus,
}) => {
  const getColumnHeaderColor = () => {
    switch (status) {
      case "workflow":
        return "border-t-brand-primary dark:border-t-brand-primary";
      case "onHold":
        return "border-t-[#F79009] dark:border-t-[#F79009]/80";
      case "rehold":
        return "border-t-[#F97316] dark:border-t-[#F97316]/80";
      case "underQA":
        return "border-t-[#475467] dark:border-t-[#475467]/80";
      case "completed":
        return "border-t-[#039855] dark:border-t-[#039855]/80";
      default:
        return "border-t-gray-400 dark:border-t-gray-600";
    }
  };

  return (
    <div className="flex flex-col dark:bg-gray-800 rounded-lg">
      <div
        className={`border-t-4 ${getColumnHeaderColor()} rounded-t-lg bg-white dark:bg-gray-800 flex-none`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="flex items-center gap-2 text-[18px] leading-[28px] font-semibold text-gray-900 dark:text-white ">
            {title}
            <span
              className={`inline-flex items-center justify-center w-6 h-6 text-[12px]  tracking-[0%] font-medium rounded-full bg-brand-primary-100 dark:bg-brand-primary-900/20 text-brand-primary dark:text-brand-primary-300`}
            >
              {tasks.length}
            </span>
          </h3>
        </div>
      </div>
      <div className="flex-1 p-4 space-y-3 overflow-y-auto min-h-0 max-h-[calc(100vh-200px)] bg-white dark:bg-gray-800 custom1-scrollbar rounded-b-lg">
        {tasks.map((task, index) => (
          <TaskItem
            key={task.id}
            task={task}
            index={index}
            moveTask={moveTask}
            showToggleButton={status === "workflow"}
            changeTaskStatus={changeTaskStatus}
          />
        ))}
      </div>
    </div>
  );
};

export default Column;
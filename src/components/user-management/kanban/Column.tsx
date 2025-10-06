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
        return "border-t-brand-primary";
      case "onHold":
        return "border-t-[#F79009]";
      case "rehold":
        return "border-t-[#F97316]";
      case "underQA":
        return "border-t-[#475467]";
      case "completed":
        return "border-t-[#039855]";
      default:
        return "border-t-gray-400";
    }
  };

  return (
    <div className="flex flex-col dark:bg-gray-800 rounded-lg">
      <div
        className={`border-t-4 ${getColumnHeaderColor()} rounded-t-lg bg-white dark:bg-gray-800 flex-none`}
      >
        <div className="flex items-center justify-between p-4 border-b-2 border-[#EAECF0]">
          <h3 className="flex items-center gap-2 text-[18px] leading-[28px] font-semibold text-gray-dark ">
            {title}
            <span
              className={`inline-flex items-center justify-center w-6 h-6 text-[12px]  tracking-[0%] font-medium rounded-full bg-brand-primary-100 text-brand-primary`}
            >
              {tasks.length}
            </span>
          </h3>
        </div>
      </div>
      <div className="flex-1 p-4 space-y-3 overflow-y-auto min-h-0 max-h-[calc(100vh-200px)] bg-white custom1-scrollbar rounded-b-lg">
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
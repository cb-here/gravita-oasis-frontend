"use client";
import { Task } from "@/components/task/task-list/types/Task";
import TaskLane from "@/components/task/task-list/TaskLane";
import React, { useState, useMemo, useCallback } from "react";
import Button from "@/components/ui/button/Button";
import FilterButton from "@/components/common/filter/FilterButton";
import { Layout, List, PlusIcon } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import Tabs from "@/components/common/tabs/Tabs";
import AddTaskModal from "./modals/AddTaskModal";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Column from "../kanban/Column";

const mapToKanbanTask = (task: any) => ({
  id: task.id,
  title: task.title,
  dueDate: task.dueDate,
  comments: task.commentCount,
  assignee: task.userAvatar,
  status: task.status === "in-progress" ? "inProgress" : task.status,
  category: { name: task.category, color: "default" },
});

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Finish user onboarding",
    isChecked: false,
    dueDate: "Tomorrow",
    commentCount: 1,
    category: "Marketing",
    userAvatar: "/images/user/user-01.jpg",
    status: "todo",
    toggleChecked: () => {}, // This will be replaced
  },
  {
    id: "2",
    title: "Solve the Dribble prioritization issue with the team",
    isChecked: false,
    dueDate: "Tomorrow",
    commentCount: 2,
    category: "Marketing",
    userAvatar: "/images/user/user-02.jpg",
    status: "todo",
    toggleChecked: () => {}, // This will be replaced
  },
  {
    id: "3",
    title: "Finish user onboarding",
    isChecked: true,
    dueDate: "Feb 12, 2024",
    commentCount: 1,
    category: "Marketing",
    userAvatar: "/images/user/user-03.jpg",
    status: "todo",
    toggleChecked: () => {}, // This will be replaced
  },
  {
    id: "4",
    title: "Work in Progress (WIP) Dashboard",
    isChecked: false,
    dueDate: "Jan 8, 2027",
    commentCount: 2,
    category: "Template",
    userAvatar: "/images/user/user-04.jpg",
    status: "in-progress",
    toggleChecked: () => {}, // This will be replaced
  },
  {
    id: "5",
    title: "Product Update - Q4 2024",
    isChecked: false,
    dueDate: "Jan 8, 2027",
    commentCount: 2,
    userAvatar: "/images/user/user-05.jpg",
    status: "in-progress",
    toggleChecked: () => {}, // This will be replaced
  },
  {
    id: "6",
    title: "Kanban Flow Manager",
    isChecked: true,
    dueDate: "Jan 8, 2027",
    commentCount: 2,
    userAvatar: "/images/user/user-06.jpg",
    status: "in-progress",
    toggleChecked: () => {}, // This will be replaced
  },
  {
    id: "7",
    title: "Make internal feedback",
    isChecked: false,
    dueDate: "Jan 8, 2027",
    commentCount: 2,
    userAvatar: "/images/user/user-07.jpg",
    status: "in-progress",
    toggleChecked: () => {}, // This will be replaced
  },
  {
    id: "8",
    title: "Do some projects on React Native with Flutter",
    isChecked: false,
    dueDate: "Feb 12, 2027",
    commentCount: 1,
    category: "Marketing",
    userAvatar: "/images/user/user-08.jpg",
    status: "completed",
    toggleChecked: () => {}, // This will be replaced
  },
  {
    id: "9",
    title: "Design marketing assets",
    isChecked: false,
    dueDate: "Feb 12, 2027",
    commentCount: 1,
    category: "Marketing",
    userAvatar: "/images/user/user-09.jpg",
    status: "completed",
    toggleChecked: () => {}, // This will be replaced
  },
  {
    id: "10",
    title: "Kanban Flow Manager",
    isChecked: false,
    dueDate: "Feb 12, 2027",
    commentCount: 1,
    category: "Marketing",
    userAvatar: "/images/user/user-10.jpg",
    status: "completed",
    toggleChecked: () => {}, // This will be replaced
  },
  {
    id: "11",
    title: "Change license and remove products",
    isChecked: false,
    dueDate: "Feb 12, 2027",
    commentCount: 1,
    category: "Marketing",
    userAvatar: "/images/user/user-11.jpg",
    status: "completed",
    toggleChecked: () => {}, // This will be replaced
  },
];

const lanes = ["todo", "in-progress", "completed"];

export default function TaskList() {
  const { isOpen, openModal, closeModal } = useModal();
  const [modelType, setModelType] = useState<any>();
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>(
    initialTasks.map((task) => ({
      ...task,
      toggleChecked: () => toggleChecked(task.id),
    }))
  );
  const [dragging, setDragging] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("All");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");

  const todoCount = useMemo(
    () => tasks.filter((task) => task.status === "todo").length,
    [tasks]
  );
  const inProgressCount = useMemo(
    () => tasks.filter((task) => task.status === "in-progress").length,
    [tasks]
  );
  const completedCount = useMemo(
    () => tasks.filter((task) => task.status === "completed").length,
    [tasks]
  );

  const taskGroups = useMemo(
    () => [
      { name: "All Tasks", key: "All", count: tasks.length },
      { name: "To do", key: "Todo", count: todoCount },
      { name: "In Progress", key: "InProgress", count: inProgressCount },
      { name: "Completed", key: "Completed", count: completedCount },
    ],
    [tasks, todoCount, inProgressCount, completedCount]
  );

  const getVisibleLanes = () => {
    switch (activeTab) {
      case "All":
        return lanes;
      case "Todo":
        return ["todo"];
      case "InProgress":
        return ["in-progress"];
      case "Completed":
        return ["completed"];
      default:
        return lanes;
    }
  };

  const visibleLanes = getVisibleLanes();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleViewToggle = () => {
    setViewMode((prev) => (prev === "list" ? "kanban" : "list"));
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    taskId: string
  ) => {
    setDragging(taskId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: string) => {
    e.preventDefault();
    if (dragging === null) return;

    const updatedTasks = tasks.map((task) =>
      task.id === dragging ? { ...task, status } : task
    );

    const statusTasks = updatedTasks.filter((task) => task.status === status);
    const otherTasks = updatedTasks.filter((task) => task.status !== status);

    const dropY = e.clientY;
    const droppedIndex = statusTasks.findIndex((task) => {
      const taskElement = document.getElementById(`task-${task.id}`);
      if (!taskElement) return false;
      const rect = taskElement.getBoundingClientRect();
      const taskMiddleY = rect.top + rect.height / 2;
      return dropY < taskMiddleY;
    });

    if (droppedIndex !== -1) {
      const draggedTask = statusTasks.find((task) => task.id === dragging);
      if (draggedTask) {
        statusTasks.splice(statusTasks.indexOf(draggedTask), 1);
        statusTasks.splice(droppedIndex, 0, draggedTask);
      }
    }

    setTasks([...otherTasks, ...statusTasks]);
    setDragging(null);
  };

  const toggleChecked = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, isChecked: !task.isChecked } : task
      )
    );
  };

  const moveTaskInKanban = useCallback(
    (dragIndex: number, hoverIndex: number, status: string) => {
      setTasks((prevTasks) => {
        const normalizedStatus =
          status === "inProgress" ? "in-progress" : status;
        const statusTasks = prevTasks.filter(
          (task) => task.status === normalizedStatus
        );
        const otherTasks = prevTasks.filter(
          (task) => task.status !== normalizedStatus
        );

        const draggedTask = statusTasks[dragIndex];
        if (draggedTask) {
          statusTasks.splice(dragIndex, 1);
          statusTasks.splice(hoverIndex, 0, draggedTask);
        }

        return [...otherTasks, ...statusTasks];
      });
    },
    []
  );

  const changeTaskStatusInKanban = useCallback(
    (taskId: string, newStatus: string) => {
      const normalizedStatus =
        newStatus === "inProgress" ? "in-progress" : newStatus;
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: normalizedStatus } : task
        )
      );
    },
    []
  );

  const kanbanTasks = useMemo(() => tasks.map(mapToKanbanTask), [tasks]);

  const getGridClasses = (numLanes: number) => {
    const baseClasses =
      "border-t border-gray-200 mt-7 dark:border-white/[0.05] sm:mt-0";
    if (numLanes === 1) {
      return `grid grid-cols-1 ${baseClasses}`;
    }
    if (numLanes === 2) {
      return `grid grid-cols-1 divide-x divide-gray-200 dark:divide-white/[0.05] ${baseClasses} sm:grid-cols-2`;
    }
    return `grid grid-cols-1 divide-x divide-gray-200 dark:divide-white/[0.05] ${baseClasses} sm:grid-cols-2 xl:grid-cols-3`;
  };

  const renderListView = () => (
    <>
      <div className="p-4 space-y-8 border-t border-gray-200 mt-7 dark:border-gray-800 sm:mt-0 xl:p-6">
        {visibleLanes.map((lane) => (
          <TaskLane
            key={lane}
            lane={lane}
            tasks={tasks.filter((task) => task.status === lane)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, lane)}
            onDragStart={handleDragStart}
          />
        ))}
      </div>
    </>
  );

  const renderKanbanView = () => (
    <DndProvider backend={HTML5Backend}>
      <div className={getGridClasses(visibleLanes.length)}>
        {visibleLanes.map((lane) => {
          const kanbanStatus = lane === "in-progress" ? "inProgress" : lane;
          const title =
            lane === "todo"
              ? "To Do"
              : lane === "in-progress"
              ? "In Progress"
              : "Completed";
          return (
            <Column
              key={lane}
              title={title}
              tasks={kanbanTasks.filter((task) => task.status === kanbanStatus)}
              status={kanbanStatus}
              moveTask={moveTaskInKanban}
              changeTaskStatus={changeTaskStatusInKanban}
            />
          );
        })}
      </div>
    </DndProvider>
  );

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between px-4 py-5 xl:px-6 xl:py-6">
          <Tabs
            tabGroups={taskGroups}
            setSelectedTabGroup={handleTabChange}
            selectedTabGroup={activeTab}
          />
          <div className="flex items-center gap-2">
            <FilterButton onClick={() => {}} />
            <Button size="sm" onClick={handleViewToggle} variant="primary">
              {viewMode === "list" ? (
                <Layout className="h-5 w-5" />
              ) : (
                <List className="h-5 w-5" />
              )}
              {viewMode === "list" ? "Kanban View" : "List View"}
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setModelType("add");
                openModal();
              }}
            >
              <PlusIcon className="h-5 w-5" />
              Add New Task
            </Button>
          </div>
        </div>

        {viewMode === "list" ? renderListView() : renderKanbanView()}
      </div>

      <AddTaskModal
        isOpen={isOpen}
        closeModal={closeModal}
        modelType={modelType}
        setModelType={setModelType}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
      />
    </div>
  );
}

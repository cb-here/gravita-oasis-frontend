"use client";

import { useState, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Column from "./Column";
import SearchableSelect from "@/components/form/SearchableSelect";
import Search from "@/components/common/Search";
import Switch from "@/components/form/switch/Switch";
import Label from "@/components/form/Label";

export const initialTasks: any[] = [
  {
    id: "1",
    mrn: "123456",
    title: "SN Assessment E",
    patient: "Jane Smith",
    dueDate: "05-01-2023",
    comments: 1,
    assignee: "/images/user/user-01.jpg",
    status: "workflow",
    statusTags: [
      { label: "Low", color: "green" },
      { label: "Fresh", color: "blue" },
    ],
    category: { name: "Assessment", color: "orange" },
  },
  {
    id: "2",
    mrn: "123456",
    title: "SN Assessment E",
    patient: "Jane Smith",
    dueDate: "05-01-2023",
    assignee: "/images/user/user-01.jpg",
    status: "workflow",
    statusTags: [
      { label: "Low", color: "green" },
      { label: "RTC", color: "red" }, // Changed RTC to RTC to match the image
    ],
    category: { name: "Assessment", color: "orange" },
  },
  {
    id: "3",
    mrn: "123456",
    title: "SN Assessment E",
    patient: "Jane Smith",
    dueDate: "05-01-2023",
    assignee: "/images/user/user-01.jpg",
    status: "workflow",
    statusTags: [
      { label: "Low", color: "green" },
      { label: "RTC", color: "red" }, // Changed RTC to RTC to match the image
    ],
    category: { name: "Assessment", color: "orange" },
  },
  {
    id: "4",
    mrn: "123456",
    title: "SN Assessment E",
    patient: "Jane Smith",
    dueDate: "05-01-2023",
    assignee: "/images/user/user-01.jpg",
    status: "workflow",
    statusTags: [
      { label: "Low", color: "green" },
      { label: "Pending for Audit", color: "yellow" },
    ],
    category: { name: "Assessment", color: "orange" },
  },
  {
    id: "5",
    mrn: "123456",
    title: "Patient Assessment",
    patient: "Robert Johnson",
    dueDate: "05-01-2023",
    assignee: "/images/user/user-02.jpg",
    status: "onHold",
    statusTags: [{ label: "High", color: "red" }],
    category: { name: "Assessment", color: "orange" },
  },
  {
    id: "6",
    mrn: "123456",
    title: "Nutrition Evaluation",
    patient: "Mary Williams",
    dueDate: "05-01-2023",
    assignee: "/images/user/user-03.jpg",
    status: "rehold",
    statusTags: [{ label: "Medium", color: "purple" }],
    category: { name: "Evaluation", color: "purple" },
  },
  {
    id: "7",
    mrn: "123456", // Changed from T123456 to match the image
    title: "Pediatric Evaluation",
    patient: "Wendy Testabugr", // Empty patient name as in the mockup
    dueDate: "05-01-2023",
    assignee: "/images/user/user-04.jpg",
    status: "underQA",
    statusTags: [
      { label: "High", color: "red" }, // Added high priority based on the image
    ],
    category: { name: "Evaluation", color: "blue" },
  },
  {
    id: "10",
    mrn: "123456",
    title: "Pediatric Evaluation",
    patient: "Stan Marsh", // Empty patient name as in the mockup
    dueDate: "05-01-2023",
    assignee: "/images/user/user-04.jpg",
    status: "completed",
    statusTags: [
      { label: "High", color: "red" }, // Added high priority based on the image
    ],
    category: { name: "Evaluation", color: "blue" },
  },
  {
    id: "8",
    mrn: "123456",
    title: "Pediatric Evaluation",
    patient: "Eric Cartman", // Empty patient name as in the mockup
    dueDate: "05-01-2023",
    assignee: "/images/user/user-04.jpg",
    status: "completed",
    statusTags: [
      { label: "High", color: "red" }, // Added high priority based on the image
    ],
    category: { name: "Evaluation", color: "blue" },
  },
  {
    id: "9", // Changed from "7"
    mrn: "123456",
    title: "Pediatric Evaluation",
    patient: "Stan Marsh",
    dueDate: "05-01-2023",
    assignee: "/images/user/user-04.jpg",
    status: "completed",
    statusTags: [{ label: "High", color: "red" }],
    category: { name: "Evaluation", color: "blue" },
  },
];

const times = [
  { value: "Today", label: "Today" },
  { value: "Yesterday", label: "Yesterday" },
  { value: "This Week", label: "This Week" },
  { value: "Last Week", label: "Last Week" },
  { value: "This Month", label: "This Month" },
  { value: "Last Month", label: "Last Month" },
  { value: "All Time", label: "All Time" },
];

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>(initialTasks);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const moveTask = useCallback((dragIndex: number, hoverIndex: number) => {
    setTasks((prevTasks) => {
      const newTasks = [...prevTasks];
      const draggedTask = newTasks[dragIndex];
      newTasks.splice(dragIndex, 1);
      newTasks.splice(hoverIndex, 0, draggedTask);
      return newTasks;
    });
  }, []);

  const changeTaskStatus = useCallback((taskId: string, newStatus: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  }, []);

  const handleTimeChange = (selectedOption: any) => {
    setSelectedTime(selectedOption?.value || null);
  };

  const [activeTab, setActiveTab] = useState("workflow");
  const [selectedRole, setSelectedRole] = useState<string | null>("coderqa");

  const tabGroups = [
    { key: "workflow", name: "Workflow", count: 4 },
    { key: "onHold", name: "On Hold", count: 1 },
    { key: "rehold", name: "Rehold", count: 1 },
    { key: "underQA", name: "Under QA", count: 1 },
    { key: "completed", name: "Completed", count: 2 },
  ];

  return (
    <div className="flex flex-col  text-gray-800 dark:text-white rounded-2xl border border-gray-200 bg-gray-100 p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="flex-none p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="w-fit ">
            <div className="grid grid-cols-2 sm:grid-cols-5 items-center gap-x-1 gap-y-2 rounded-lg bg-gray-200 p-0.5 dark:bg-gray-900">
              {tabGroups.map((group) => (
                <button
                  key={group.key}
                  onClick={() => setActiveTab(group.key)}
                  className={`inline-flex items-center xl:justify-start justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md group hover:text-gray-900 dark:hover:text-white ${
                    activeTab === group.key
                      ? "text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                      : "text-gray-500 dark:text-gray-400"
                  }`}>
                  {group.name}
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium leading-normal group-hover:bg-brand-50 group-hover:text-brand-500 dark:group-hover:bg-brand-500/15 dark:group-hover:text-brand-400 ${
                      activeTab === group.key
                        ? "text-brand-500 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/15"
                        : "bg-white dark:bg-white/[0.03]"
                    }`}>
                    {group.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Search
              placeholder="Search..."
              className="w-[500px] bg-white dark:bg-white/[0.03] rounded-lg"
            />
            <div className="relative min-w-[200px]">
              <SearchableSelect
                dataProps={{
                  optionData: times.map((opt) => ({
                    _id: opt.value,
                    name: opt.label,
                  })),
                }}
                selectionProps={{
                  selectedValue: selectedTime ? { value: selectedTime } : null,
                }}
                displayProps={{
                  placeholder: "Select Time Range",
                  id: "time-filter",
                }}
                eventHandlers={{
                  onChange: handleTimeChange,
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 mt-3 w-fit">
          <div className="flex items-center gap-2">
            <Switch
              checked={selectedRole === "coderqa"}
              onChange={() =>
                setSelectedRole(selectedRole === "coderqa" ? null : "coderqa")
              }
            />
            <Label htmlFor="coderqa-switch">Coder/QA</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={selectedRole === "coder"}
              onChange={() =>
                setSelectedRole(selectedRole === "coder" ? null : "coder")
              }
            />
            <Label htmlFor="coder-switch">Coder</Label>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={selectedRole === "qa"}
              onChange={() =>
                setSelectedRole(selectedRole === "qa" ? null : "qa")
              }
            />
            <Label htmlFor="qa-switch">QA</Label>
          </div>
        </div>
      </div>

      <DndProvider backend={HTML5Backend}>
        <div>
          <div className="flex gap-4 px-4 pb-4  mt-4 overflow-x-auto">
            <div className="w-[350px] flex-shrink-0">
              <Column
                title="Workflow"
                tasks={tasks.filter((task) => task.status === "workflow")}
                status="workflow"
                moveTask={moveTask}
                changeTaskStatus={changeTaskStatus}
                selectedRole={selectedRole}
              />
            </div>
            <div className="w-[350px] flex-shrink-0">
              <Column
                title="On Hold"
                tasks={tasks.filter((task) => task.status === "onHold")}
                status="onHold"
                moveTask={moveTask}
                changeTaskStatus={changeTaskStatus}
                selectedRole={selectedRole}
              />
            </div>
            <div className="w-[350px] flex-shrink-0">
              <Column
                title="Rehold"
                tasks={tasks.filter((task) => task.status === "rehold")}
                status="rehold"
                moveTask={moveTask}
                changeTaskStatus={changeTaskStatus}
                selectedRole={selectedRole}
              />
            </div>
            <div className="w-[350px] flex-shrink-0">
              <Column
                title="Under QA"
                tasks={tasks.filter((task) => task.status === "underQA")}
                status="underQA"
                moveTask={moveTask}
                changeTaskStatus={changeTaskStatus}
                selectedRole={selectedRole}
              />
            </div>
            <div className="w-[350px] flex-shrink-0">
              <Column
                title="Completed"
                tasks={tasks.filter((task) => task.status === "completed")}
                status="completed"
                moveTask={moveTask}
                changeTaskStatus={changeTaskStatus}
                selectedRole={selectedRole}
              />
            </div>
          </div>
        </div>
      </DndProvider>
    </div>
  );
};

export default KanbanBoard;

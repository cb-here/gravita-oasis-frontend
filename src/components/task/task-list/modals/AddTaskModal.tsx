import Attachments from "@/components/form/input/Attachments";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import Loading from "@/components/Loading";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import React, { useState } from "react";
import * as yup from "yup";

interface AddTaskFormData {
  title: string;
  dueDate?: string;
  status: "todo" | "in-progress" | "completed";
  category: "Marketing" | "Template" | "Development";
  assignee: string;
  description?: string;
  attachments?: File[];
}

interface AddTaskModalProps {
  isOpen: boolean;
  closeModal: () => void;
  onAddTask?: (data: AddTaskFormData) => void;
  modelType: string;
  setModelType: any;
  selectedTask: any;
  setSelectedTask: any;
}

const schema = yup.object().shape({
  title: yup.string().required("Task title is required"),
  dueDate: yup.string().optional(),
  status: yup
    .string()
    .oneOf(["todo", "in-progress", "completed"])
    .required("Status is required"),
  category: yup
    .string()
    .oneOf(["Marketing", "Template", "Development"])
    .required("Category is required"),
  assignee: yup.string().required("Assignee is required"),
  description: yup.string().optional(),
  attachments: yup.mixed<File[]>().optional(),
});

export default function AddTaskModal({
  isOpen,
  closeModal,
  onAddTask,
  modelType,
  setModelType,
  selectedTask,
  setSelectedTask,
}: AddTaskModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AddTaskFormData>({
    title: "",
    dueDate: "",
    status: "todo",
    category: "Marketing",
    assignee: "Mayad Ahmed",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = async (data: AddTaskFormData): Promise<boolean> => {
    try {
      await schema.validate(data, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const newErrors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            newErrors[error.path as string] = error.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof AddTaskFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileUpload = (files: FileList) => {
    const newFiles = Array.from(files);
    setFormData((prev: any) => ({
      ...prev,
      attachments: [...(prev.attachments || []), ...newFiles],
    }));
  };

  // Handle removal of attachments
  const handleFileRemove = (fileName: string) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments?.filter((f) => f.name !== fileName),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valid = await validateForm(formData);
    if (valid) {
      if (onAddTask) {
        onAddTask(formData);
      } else {
        console.log("New Task Data:", formData);
      }
      closeModal();
      setFormData({
        title: "",
        dueDate: "",
        status: "todo",
        category: "Marketing",
        assignee: "Mayad Ahmed",
        description: "",
      });
    }
  };

  const handleClose = () => {
    if (!loading) {
      setModelType("");
      setSelectedTask(null);
      setLoading(false);
      closeModal();
    }
  };

  const getModalTitle = () => {
    switch (modelType) {
      case "add":
        return "Add New Task";
      case "edit":
        return "Update Task";
      case "delete":
        return "Delete Task";
      default:
        return "";
    }
  };

  const getModalDescription = () => {
    switch (modelType) {
      case "add":
        return "Create a new task";
      case "edit":
        return "Edit and manage task information with ease.";
      case "delete":
        return `This action cannot be undone. It will permanently remove this task and all associated data.`;
      default:
        return "";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="max-w-[700px] p-5 lg:p-10 m-4"
    >
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="px-2">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {getModalTitle()}
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            {getModalDescription()}
          </p>
        </div>

        {modelType !== "delete" ? (
          <div className="custom-scrollbar h-[350px] sm:h-[450px] overflow-y-auto px-2">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label>Task Title</Label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  error={!!errors.title}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              <div>
                <Label>Due Date</Label>
                <div className="relative">
                  <Input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate || ""}
                    onChange={handleChange}
                    error={!!errors.dueDate}
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    <svg
                      className="fill-gray-700 dark:fill-gray-400"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M4.33317 0.0830078C4.74738 0.0830078 5.08317 0.418794 5.08317 0.833008V1.24967H8.9165V0.833008C8.9165 0.418794 9.25229 0.0830078 9.6665 0.0830078C10.0807 0.0830078 10.4165 0.418794 10.4165 0.833008V1.24967L11.3332 1.24967C12.2997 1.24967 13.0832 2.03318 13.0832 2.99967V4.99967V11.6663C13.0832 12.6328 12.2997 13.4163 11.3332 13.4163H2.6665C1.70001 13.4163 0.916504 12.6328 0.916504 11.6663V4.99967V2.99967C0.916504 2.03318 1.70001 1.24967 2.6665 1.24967L3.58317 1.24967V0.833008C3.58317 0.418794 3.91896 0.0830078 4.33317 0.0830078ZM4.33317 2.74967H2.6665C2.52843 2.74967 2.4165 2.8616 2.4165 2.99967V4.24967H11.5832V2.99967C11.5832 2.8616 11.4712 2.74967 11.3332 2.74967H9.6665H4.33317ZM11.5832 5.74967H2.4165V11.6663C2.4165 11.8044 2.52843 11.9163 2.6665 11.9163H11.3332C11.4712 11.9163 11.5832 11.8044 11.5832 11.6663V5.74967Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                </div>
                {errors.dueDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
                )}
              </div>

              <div>
                <Label>Status</Label>
                <div className="relative z-20 bg-transparent dark:bg-form-input">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={`dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border ${
                      errors.status ? "border-red-500" : "border-gray-300"
                    } bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <span className="absolute z-30 text-gray-500 -translate-y-1/2 right-4 top-1/2 dark:text-gray-400">
                    <svg
                      className="stroke-current"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Tags
                </Label>
                <div className="relative z-20 bg-transparent dark:bg-form-input">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border ${
                      errors.category ? "border-red-500" : "border-gray-300"
                    } bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                  >
                    <option value="Marketing">Marketing</option>
                    <option value="Template">Template</option>
                    <option value="Development">Development</option>
                  </select>
                  <span className="absolute z-30 text-gray-500 -translate-y-1/2 right-4 top-1/2 dark:text-gray-400">
                    <svg
                      className="stroke-current"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <Label>Description</Label>
                <TextArea
                  placeholder="Type your message here..."
                  rows={6}
                  value={formData.description || ""}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      description: value,
                    })
                  }
                  error={!!errors.description}
                />

                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <Attachments
                title="Attachments"
                allowedTypes="custom"
                customAccept="image/*,application/pdf"
                attachments={
                  (formData.attachments || []).map((file) => ({
                    id: file.name,
                    name: file.name,
                    type: file.type.includes("pdf")
                      ? "PDF"
                      : file.type.startsWith("image")
                      ? "Image"
                      : "File",
                    icon: file.type.includes("pdf")
                      ? "/images/task/pdf.svg"
                      : "/images/task/file.svg",
                  })) || []
                }
                onUpload={handleFileUpload}
                onRemove={(id) => handleFileRemove(id as string)}
              />
            </div>
          </div>
        ) : (
          <div>
            {selectedTask && (
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-300">
                      {selectedTask?.name || "Task Name"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div className="flex justify-between gap-3 pt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            type="button"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-6 py-2 min-w-[175px]"
            disabled={loading}
          >
            {loading ? (
              <Loading size={1} style={2} />
            ) : (
              `${
                modelType === "delete"
                  ? "Delete"
                  : modelType === "edit"
                  ? "Update"
                  : "Create"
              } Task`
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

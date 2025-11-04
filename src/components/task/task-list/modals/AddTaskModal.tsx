import Attachments from "@/components/form/input/Attachments";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import Loading from "@/components/Loading";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import SearchableSelect from "@/components/form/SearchableSelect";
import DateTimePicker from "@/components/common/DateTimePicker";
import React, { useState } from "react";
import * as yup from "yup";

interface AddTaskFormData {
  title: string;
  dueDate?: Date | null;
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
    dueDate: null,
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
        dueDate: null,
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
                  placeholder="Enter task title"
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
                <DateTimePicker
                  value={formData.dueDate}
                  onChange={(date) => {
                    setFormData((prev) => ({ ...prev, dueDate: date }));
                    if (errors.dueDate) {
                      setErrors((prev) => ({ ...prev, dueDate: "" }));
                    }
                  }}
                  mode="single"
                  allowTime={false}
                  error={!!errors.dueDate}
                />
                {errors.dueDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
                )}
              </div>

              <div>
                <Label>Status</Label>
                <SearchableSelect
                  dataProps={{
                    optionData: [
                      { _id: "todo", name: "To Do" },
                      { _id: "in-progress", name: "In Progress" },
                      { _id: "completed", name: "Completed" },
                    ],
                  }}
                  selectionProps={{
                    selectedValue: formData.status,
                  }}
                  displayProps={{
                    placeholder: "Select status",
                    isClearable: false,
                  }}
                  eventHandlers={{
                    onChange: (option: any) => {
                      setFormData((prev) => ({
                        ...prev,
                        status: option?.value || "todo",
                      }));
                      if (errors.status) {
                        setErrors((prev) => ({ ...prev, status: "" }));
                      }
                    },
                  }}
                />
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Tags
                </Label>
                <SearchableSelect
                  dataProps={{
                    optionData: [
                      { _id: "Marketing", name: "Marketing" },
                      { _id: "Template", name: "Template" },
                      { _id: "Development", name: "Development" },
                    ],
                  }}
                  selectionProps={{
                    selectedValue: formData.category,
                  }}
                  displayProps={{
                    placeholder: "Select tag",
                    isClearable: false,
                  }}
                  eventHandlers={{
                    onChange: (option: any) => {
                      setFormData((prev) => ({
                        ...prev,
                        category: option?.value || "Marketing",
                      }));
                      if (errors.category) {
                        setErrors((prev) => ({ ...prev, category: "" }));
                      }
                    },
                  }}
                />
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

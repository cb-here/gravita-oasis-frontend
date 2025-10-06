import React, { useState, useEffect, useCallback } from "react";
import Button from "@/components/ui/button/Button";
import { AxiosError } from "axios";
import * as yup from "yup";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Loading from "@/components/Loading";
import SearchableSelect from "@/components/form/SearchableSelect";
import Tabs from "@/components/common/tabs/Tabs";
import { FileTextIcon, UploadCloud, Download, X, FileUp } from "lucide-react";
import DateTimePicker from "@/components/common/DateTimePicker";

const priorityOptions = [
  { value: "low", label: "Low", color: "text-green-600" },
  { value: "medium", label: "Medium", color: "text-yellow-600" },
  { value: "high", label: "High", color: "text-red-600" },
];

const users = [
  { value: "User 1", label: "User 1" },
  { value: "User 2", label: "User 2" },
];

const insuranceOptions = [
  { value: "medicare", label: "Medicare" },
  { value: "medicaid", label: "Medicaid" },
  { value: "private", label: "Private Insurance" },
  { value: "self_pay", label: "Self Pay" },
  { value: "workers_comp", label: "Workers Compensation" },
  { value: "other", label: "Other" },
];

const taskTypeOptions = [
  { value: "fresh", label: "Fresh" },
  { value: "rtc", label: "RTC" },
];

const taskNameOptions = [
  { value: "SOC", label: "SOC" },
  { value: "SOC_PT", label: "SOC(PT)" },
  { value: "SOC_OT", label: "SOC(OT)" },
  { value: "SOC_ST", label: "SOC(ST)" },
  { value: "ROC", label: "ROC" },
  { value: "ROC_PT", label: "ROC(PT)" },
  { value: "ROC_OT", label: "ROC(OT)" },
  { value: "ROC_ST", label: "ROC(ST)" },
  { value: "RECERT", label: "Recert" },
  { value: "RECERT_PT", label: "Recert(PT)" },
  { value: "RECERT_OT", label: "Recert(OT)" },
  { value: "RECERT_ST", label: "Recert(ST)" },
  { value: "SN_ASSESSMENT_E", label: "SN Assessment E" },
];

const projectOptions = [
  { value: "project_a", label: "Project Alpha" },
  { value: "project_b", label: "Project Beta" },
  { value: "project_c", label: "Project Gamma" },
  { value: "project_d", label: "Project Delta" },
];

interface TaskFormData {
  mrn: string;
  taskName: string;
  priority: string;
  patientName: string;
  providerName: string;
  age: string;
  targetDate: string;
  taskType: string;
  insurance: string;
  notes?: string;
  project?: string;
  user?: string;
}

interface TaskModalProps {
  isOpen: boolean;
  closeModal: () => void;
  setSelectedTask: (task: any) => void;
  selectedTask: any;
  modelType: string;
  setModelType: (type: string) => void;
  onSubmit?: (data: TaskFormData) => Promise<void>;
  onDelete?: (task: any) => Promise<void>;
  onBulkUpload?: (file: File, project: string) => Promise<void>;
}

interface UploadedFile {
  file: File;
  preview: string;
  size: string;
}

export default function TaskModal({
  isOpen,
  closeModal,
  setSelectedTask,
  selectedTask,
  modelType,
  setModelType,
  onSubmit,
  onDelete,
  onBulkUpload,
}: TaskModalProps) {
  const [errors, setErrors] = useState<any>({});
  const [bulkErrors, setBulkErrors] = useState<any>({});

  const validationSchema = yup.object().shape({
    mrn: yup
      .string()
      .required("MRN is required")
      .matches(
        /^[A-Z0-9-]+$/i,
        "MRN must contain only letters, numbers, and hyphens"
      )
      .min(3, "MRN must be at least 3 characters")
      .max(20, "MRN cannot exceed 20 characters"),
    taskName: yup
      .string()
      .required("Task name is required")
      .min(3, "Task name must be at least 3 characters")
      .max(100, "Task name cannot exceed 100 characters"),
    patientName: yup
      .string()
      .required("Patient name is required")
      .min(2, "Patient name must be at least 2 characters")
      .max(50, "Patient name cannot exceed 50 characters")
      .matches(
        /^[a-zA-Z\s'-]+$/,
        "Patient name can only contain letters, spaces, hyphens, and apostrophes"
      ),
    providerName: yup
      .string()
      .required("Provider name is required")
      .min(2, "Provider name must be at least 2 characters")
      .max(50, "Provider name cannot exceed 50 characters"),
    targetDate: yup
      .string()
      .required("Target date is required")
      .test(
        "future-date",
        "Target date must be today or in the future",
        function (value) {
          if (!value) return false;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const targetDate = new Date(value);
          return targetDate >= today;
        }
      ),
    age: yup
      .number()
      .required("Age is required")
      .min(0, "Age must be 0 or greater")
      .max(150, "Age must be 150 or less")
      .integer("Age must be a whole number"),
    taskType: yup.string().required("Task type is required"),
    priority: yup
      .string()
      .required("Priority is required")
      .oneOf(
        ["low", "medium", "high"],
        "Priority must be low, medium, or high"
      ),
    notes: yup
      .string()
      .max(500, "Notes cannot exceed 500 characters")
      .optional(),
  });

  const bulkValidationSchema = yup.object().shape({
    project: yup.string().required("Project is required for bulk upload"),
  });

  const initForm: TaskFormData = {
    mrn: "",
    taskName: "",
    priority: "",
    patientName: "",
    providerName: "",
    age: "",
    targetDate: "",
    taskType: "",
    insurance: "",
    notes: "",
    project: "",
  };

  const [formData, setFormData] = useState<TaskFormData>(initForm);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<any>("single");
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    if (selectedTask && (modelType === "edit" || modelType === "read")) {
      setFormData({
        mrn: selectedTask.mrn || "",
        taskName: selectedTask.taskName || "",
        priority: selectedTask.priority || "",
        patientName: selectedTask.patientName || "",
        providerName: selectedTask.providerName || "",
        age: selectedTask.age?.toString() || "",
        targetDate: selectedTask.targetDate || "",
        taskType: selectedTask.taskType || "",
        insurance: selectedTask.insurance || "",
        notes: selectedTask.notes || "",
        project: selectedTask.project || "",
      });
    } else {
      setFormData(initForm);
    }
  }, [selectedTask, modelType]);

  const validateForm = async (): Promise<boolean> => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const newErrors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            newErrors[error.path] = error.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const validateBulkUpload = async (): Promise<boolean> => {
    try {
      await bulkValidationSchema.validate(formData, { abortEarly: false });
      setBulkErrors({});

      if (!uploadedFile) {
        setBulkErrors((prev: any) => ({
          ...prev,
          file: "Please select a file to upload",
        }));
        return false;
      }

      return true;
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const newErrors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            newErrors[error.path] = error.message;
          }
        });
        setBulkErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (modelType === "delete") {
      if (onDelete && selectedTask) {
        setLoading(true);
        try {
          await onDelete(selectedTask);
          handleClose();
        } catch (error) {
          console.error("Delete error:", error);
        } finally {
          setLoading(false);
        }
      }
      return;
    }

    // Handle bulk upload
    if (activeTab === "bulk") {
      const isValid = await validateBulkUpload();
      if (!isValid) return;

      setLoading(true);
      try {
        if (onBulkUpload && uploadedFile && formData.project) {
          await onBulkUpload(uploadedFile.file, formData.project);
          handleClose();
        }
      } catch (error: unknown) {
        const axiosError = error as AxiosError<any>;
        const errData = axiosError?.response?.data;
        console.log("🚀 ~ handleSubmit ~ errData:", errData);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Handle single form submission
    const isValid = await validateForm();
    if (!isValid) {
      return;
    }

    setLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(formData);
        handleClose();
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any>;
      const errData = axiosError?.response?.data;
      console.log("🚀 ~ handleSubmit ~ errData:", errData);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSelectedTask(null);
      setErrors({});
      setBulkErrors({});
      setFormData(initForm);
      setUploadedFile(null);
      setIsDragOver(false);
      setModelType("");
      setLoading(false);
      closeModal();
    }
  };

  const handleInputChange = (field: keyof TaskFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: "" }));
    }
    if (bulkErrors[field]) {
      setBulkErrors((prev: any) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowedTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
      "application/csv",
    ];

    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const isAllowedType =
      allowedTypes.includes(file.type) ||
      ["xls", "xlsx", "csv"].includes(fileExtension || "");

    if (!isAllowedType) {
      setBulkErrors((prev: any) => ({
        ...prev,
        file: "Please select a valid Excel or CSV file",
      }));
      return;
    }

    // Validate file size (10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      setBulkErrors((prev: any) => ({
        ...prev,
        file: "File size must be less than 10MB",
      }));
      return;
    }

    // Clear any previous file errors
    setBulkErrors((prev: any) => ({ ...prev, file: "" }));

    const fileSize = (file.size / (1024 * 1024)).toFixed(2) + " MB";

    setUploadedFile({
      file,
      preview: file.name,
      size: fileSize,
    });
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setBulkErrors((prev: any) => ({ ...prev, file: "" }));
  };

  const downloadTemplate = () => {
    const templateUrl = "/templates/task-upload-template.xlsx";
    const link = document.createElement("a");
    link.href = templateUrl;
    link.download = "task-bulk-upload-template.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getModalTitle = () => {
    switch (modelType) {
      case "add":
        return "Create Task";
      case "edit":
        return "Edit Task";
      case "delete":
        return "Delete Task";
      case "read":
        return "Task Details";
      default:
        return "";
    }
  };

  const getModalDescription = () => {
    switch (modelType) {
      case "add":
        return "Add a new task to the system";
      case "edit":
        return "Update the task information";
      case "delete":
        return `This action cannot be undone. It will permanently remove this task.`;
      case "read":
        return "View task details";
      default:
        return "";
    }
  };

  const getSubmitButtonText = () => {
    if (loading) return "";
    if (activeTab === "bulk") return "Upload Tasks";

    switch (modelType) {
      case "add":
        return "Create Task";
      case "edit":
        return "Update Task";
      case "delete":
        return "Delete Task";
      default:
        return "Submit";
    }
  };

  const isReadOnly = modelType === "read";

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className={`${
        modelType === "delete" ? "max-w-[600px]" : "max-w-[700px]"
      } p-5 lg:p-10 m-4`}
    >
      <div className="lg:px-4 px-2">
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          {getModalTitle()}
        </h4>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
          {getModalDescription()}
        </p>
      </div>
      <form className="flex flex-col gap-6 w-full p-2" onSubmit={handleSubmit}>
        {modelType === "delete" ? (
          <div>
            {selectedTask && (
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-300">
                  {selectedTask.taskName || "Task Name"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  MRN: {selectedTask.mrn} | Patient: {selectedTask.patientName}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {modelType === "add" && (
              <Tabs
                tabGroups={[
                  {
                    key: "single",
                    name: "Single Form",
                    icon: FileTextIcon,
                  },
                  {
                    key: "bulk",
                    name: "Bulk Upload",
                    icon: UploadCloud,
                  },
                ]}
                setSelectedTabGroup={setActiveTab}
                selectedTabGroup={activeTab}
                fullWidth={true}
              />
            )}

            {activeTab === "single" ? (
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
                {/* Single form fields - same as before */}
                <div>
                  <Label required>MRN</Label>
                  <Input
                    type="text"
                    placeholder="Enter MRN"
                    value={formData.mrn}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleInputChange("mrn", e.target.value);
                    }}
                    className="w-full"
                    error={!!errors.mrn}
                    errorMessage={errors.mrn}
                    readOnly={isReadOnly}
                  />
                </div>

                <div>
                  <Label required>Priority</Label>
                  <SearchableSelect
                    dataProps={{
                      optionData: priorityOptions.map((opt) => ({
                        _id: opt.value,
                        name: opt.label,
                      })),
                    }}
                    selectionProps={{
                      selectedValue: formData.priority
                        ? {
                            _id: formData.priority,
                            value: formData.priority,
                            label:
                              priorityOptions.find(
                                (opt) => opt.value === formData.priority
                              )?.label || formData.priority,
                          }
                        : null,
                    }}
                    displayProps={{
                      placeholder: "Select priority...",
                      id: "priority",
                      isClearable: true,
                      layoutProps: {
                        className: `w-full ${
                          errors.priority
                            ? "border-red-500 border rounded-lg"
                            : ""
                        }`,
                      },
                    }}
                    eventHandlers={{
                      onChange: (option: any) => {
                        handleInputChange("priority", option?._id || "");
                      },
                    }}
                  />
                  {errors.priority && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.priority}
                    </p>
                  )}
                </div>

                <div>
                  <Label required>Task Name</Label>
                  <SearchableSelect
                    dataProps={{
                      optionData: taskNameOptions.map((opt) => ({
                        _id: opt.value,
                        name: opt.label,
                      })),
                    }}
                    selectionProps={{
                      selectedValue: formData.taskName
                        ? {
                            _id: formData.taskName,
                            value: formData.taskName,
                            label:
                              taskNameOptions.find(
                                (opt) => opt.value === formData.taskName
                              )?.label || formData.taskName,
                          }
                        : null,
                    }}
                    displayProps={{
                      placeholder: "Select task name...",
                      id: "taskName",
                      isClearable: true,
                      layoutProps: {
                        className: `w-full ${
                          errors.taskName
                            ? "border-red-500 border rounded-lg"
                            : ""
                        }`,
                      },
                    }}
                    eventHandlers={{
                      onChange: (option: any) => {
                        handleInputChange("taskName", option?._id || "");
                      },
                    }}
                  />
                  {errors.taskName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.taskName}
                    </p>
                  )}
                </div>

                <div>
                  <Label required>Patient Name</Label>
                  <Input
                    type="text"
                    placeholder="Enter patient name"
                    value={formData.patientName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleInputChange("patientName", e.target.value);
                    }}
                    className="w-full"
                    error={!!errors.patientName}
                    errorMessage={errors.patientName}
                    readOnly={isReadOnly}
                  />
                </div>

                <div>
                  <Label required>Target Date</Label>
                  <DateTimePicker
                    value={formData.targetDate}
                    onChange={(dates) => {
                      handleInputChange("targetDate", dates);
                    }}
                    mode="single"
                    onlyFuture
                    error={!!errors.targetDate}
                  />
                  {errors.targetDate && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.targetDate}
                    </p>
                  )}
                </div>

                <div>
                  <Label required>Provider Name</Label>
                  <Input
                    type="text"
                    placeholder="Enter provider name"
                    value={formData.providerName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleInputChange("providerName", e.target.value);
                    }}
                    className="w-full"
                    error={!!errors.providerName}
                    errorMessage={errors.providerName}
                    readOnly={isReadOnly}
                  />
                </div>

                <div>
                  <Label required>Task Type</Label>
                  <SearchableSelect
                    dataProps={{
                      optionData: taskTypeOptions.map((opt) => ({
                        _id: opt.value,
                        name: opt.label,
                      })),
                    }}
                    selectionProps={{
                      selectedValue: formData.taskType
                        ? {
                            _id: formData.taskType,
                            value: formData.taskType,
                            label:
                              taskTypeOptions.find(
                                (opt) => opt.value === formData.taskType
                              )?.label || formData.taskType,
                          }
                        : null,
                    }}
                    displayProps={{
                      placeholder: "Select task type...",
                      id: "taskType",
                      isClearable: true,
                      layoutProps: {
                        className: `w-full ${
                          errors.taskType
                            ? "border-red-500 border rounded-lg"
                            : ""
                        }`,
                      },
                    }}
                    eventHandlers={{
                      onChange: (option: any) => {
                        handleInputChange("taskType", option?._id || "");
                      },
                    }}
                  />
                  {errors.taskType && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.taskType}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Project</Label>
                  <SearchableSelect
                    dataProps={{
                      optionData: projectOptions.map((opt) => ({
                        _id: opt.value,
                        name: opt.label,
                      })),
                    }}
                    selectionProps={{
                      selectedValue: formData.project
                        ? {
                            _id: formData.project,
                            value: formData.project,
                            label:
                              projectOptions.find(
                                (opt) => opt.value === formData.project
                              )?.label || formData.project,
                          }
                        : null,
                    }}
                    displayProps={{
                      placeholder: "Select project...",
                      id: "project",
                      isClearable: true,
                      layoutProps: {
                        className: `w-full ${
                          errors.project
                            ? "border-red-500 border rounded-lg"
                            : ""
                        }`,
                      },
                    }}
                    eventHandlers={{
                      onChange: (option: any) => {
                        handleInputChange("project", option?._id || "");
                      },
                    }}
                  />
                  {errors.project && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.project}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Insurance</Label>
                  <SearchableSelect
                    dataProps={{
                      optionData: insuranceOptions.map((opt) => ({
                        _id: opt.value,
                        name: opt.label,
                      })),
                    }}
                    selectionProps={{
                      selectedValue: formData.insurance
                        ? {
                            _id: formData.insurance,
                            value: formData.insurance,
                            label:
                              insuranceOptions.find(
                                (opt) => opt.value === formData.insurance
                              )?.label || formData.insurance,
                          }
                        : null,
                    }}
                    displayProps={{
                      placeholder: "Select insurance...",
                      id: "insurance",
                      isClearable: true,
                      layoutProps: {
                        className: `w-full ${
                          errors.insurance
                            ? "border-red-500 border rounded-lg"
                            : ""
                        }`,
                      },
                    }}
                    eventHandlers={{
                      onChange: (option: any) => {
                        handleInputChange("insurance", option?._id || "");
                      },
                    }}
                  />
                  {errors.insurance && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.insurance}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Assign To</Label>
                  <SearchableSelect
                    dataProps={{
                      optionData: users.map((opt) => ({
                        _id: opt.value,
                        name: opt.label,
                      })),
                    }}
                    selectionProps={{
                      selectedValue: formData.user
                        ? {
                            _id: formData.user,
                            value: formData.user,
                            label:
                              users.find((opt) => opt.value === formData.user)
                                ?.label || formData.user,
                          }
                        : null,
                    }}
                    displayProps={{
                      placeholder: "Select to assign...",
                      id: "user",
                      isClearable: true,
                    }}
                    eventHandlers={{
                      onChange: (option: any) => {
                        handleInputChange("user", option?._id || "");
                      },
                    }}
                  />
                  {errors.assign && (
                    <p className="text-red-500 text-sm mt-1">{errors.assign}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {/* Project Selection */}
                <div>
                  <Label required>Project</Label>
                  <SearchableSelect
                    dataProps={{
                      optionData: projectOptions.map((opt) => ({
                        _id: opt.value,
                        name: opt.label,
                      })),
                    }}
                    selectionProps={{
                      selectedValue: formData.project
                        ? {
                            _id: formData.project,
                            value: formData.project,
                            label:
                              projectOptions.find(
                                (opt) => opt.value === formData.project
                              )?.label || formData.project,
                          }
                        : null,
                    }}
                    displayProps={{
                      placeholder: "Select project...",
                      id: "project",
                      isClearable: true,
                      layoutProps: {
                        className: `w-full ${
                          bulkErrors.project
                            ? "border-red-500 border rounded-lg"
                            : ""
                        }`,
                      },
                    }}
                    eventHandlers={{
                      onChange: (option: any) => {
                        handleInputChange("project", option?._id || "");
                      },
                    }}
                  />
                  {bulkErrors.project && (
                    <p className="text-red-500 text-sm mt-1">
                      {bulkErrors.project}
                    </p>
                  )}
                </div>

                {/* Dropzone */}
                <div>
                  <Label required>Upload File</Label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      isDragOver
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                    } ${
                      bulkErrors.file
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                        : ""
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() =>
                      document.getElementById("file-upload")?.click()
                    }
                  >
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".xls,.xlsx,.csv"
                      onChange={handleFileInputChange}
                    />

                    {uploadedFile ? (
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileUp className="h-8 w-8 text-blue-500" />
                          <div className="text-left">
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {uploadedFile.preview}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {uploadedFile.size}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile();
                          }}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Drop your file here or click to browse
                          </p>
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Supports .xls, .xlsx, .csv files up to 10MB
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  {bulkErrors.file && (
                    <p className="text-red-500 text-sm mt-1">
                      {bulkErrors.file}
                    </p>
                  )}
                </div>

                {/* Template Download */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-100">
                        Download Template
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        Use our template to ensure your file format is correct
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={downloadTemplate}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download Template
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between gap-3 pt-4">
          {modelType === "read" ? (
            <Button
              variant="outline"
              onClick={handleClose}
              type="button"
              className="px-6 py-2 min-w-[120px]"
            >
              Close
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleClose}
                type="button"
                disabled={loading}
                className="px-6 py-2 min-w-[120px]"
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
                  getSubmitButtonText()
                )}
              </Button>
            </>
          )}
        </div>
      </form>
    </Modal>
  );
}

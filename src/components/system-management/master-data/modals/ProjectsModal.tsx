import React, { useState, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import Loading from "@/components/Loading";
import { showToast } from "@/lib/toast";
import { AxiosError } from "axios";
import * as yup from "yup";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import SearchableSelect from "@/components/form/SearchableSelect";
import Checkbox from "@/components/form/input/Checkbox";

interface ProjectsModalProps {
  isOpen: boolean;
  closeModal: () => void;
  modelType: string;
  setModelType: any;
  selectedProject: any;
  setSelectedProject: any;
}

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const CHART_TYPES = {
  SOC: "SOC",
  SOC_PT: "SOC(PT)",
  SOC_OT: "SOC(OT)",
  SOC_ST: "SOC(ST)",
  ROC: "ROC",
  ROC_PT: "ROC(PT)",
  ROC_OT: "ROC(OT)",
  ROC_ST: "ROC(ST)",
  RECERT: "Recert",
  RECERT_PT: "Recert(PT)",
  RECERT_OT: "Recert(OT)",
  RECERT_ST: "Recert(ST)",
  SN_ASSESSMENT_E: "SN Assessment E",
};

type ProjectStepKey = keyof typeof CHART_TYPES;

export default function ProjectsModal({
  isOpen,
  closeModal,
  modelType,
  setModelType,
  selectedProject,
  setSelectedProject,
}: ProjectsModalProps) {
  const [errors, setErrors] = useState<any>({});
  const [billType, setBillType] = useState<"TASKWISE" | "PROJECTWISE">(
    "PROJECTWISE"
  );
  const [amounts, setAmounts] = useState<any[]>([]);

  const validationSchema = yup.object().shape({
    name: yup.string().required("Project name is required"),
    description: yup.string().required("Project description is required"),
    price: yup.string().required("Project price is required"),
    status: yup.string().required("Project status is required"),
  });

  const validateForm = async (formData: any): Promise<boolean> => {
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

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (modelType === "edit" && selectedProject) {
      setFormData({
        name: selectedProject.name || "",
        description: selectedProject.description || "",
        price: selectedProject.price || "",
        status: selectedProject.status || "",
      });
      // Set bill type and amounts if available in selectedProject
      setBillType(selectedProject.billType || "PROJECTWISE");
      setAmounts(selectedProject.amounts || []);
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        status: "",
      });
      setBillType("PROJECTWISE");
      setAmounts([]);
    }
  }, [selectedProject, modelType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev: any) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, description: value }));
    if (errors.description) {
      setErrors((prev: any) => {
        const newErrors = { ...prev };
        delete newErrors.description;
        return newErrors;
      });
    }
  };

  const handleStatusChange = (option: any) => {
    const statusValue = option?.value || "";
    setFormData((prev) => ({ ...prev, status: statusValue }));
    if (errors.status) {
      setErrors((prev: any) => {
        const newErrors = { ...prev };
        delete newErrors.status;
        return newErrors;
      });
    }
  };

  const handleBillTypeChange = (checked: boolean) => {
    const newBillType = checked ? "TASKWISE" : "PROJECTWISE";
    setBillType(newBillType);
  };

  const handleTaskPriceChange = (chartType: ProjectStepKey, price: string) => {
    setAmounts((prev) => {
      const existingTask = prev.find((task) => task.title === chartType);
      if (existingTask) {
        return prev.map((task) =>
          task.title === chartType ? { ...task, price } : task
        );
      } else {
        return [...prev, { title: chartType, price }];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = await validateForm(formData);
    if (!isValid) {
      return;
    }
    setLoading(true);
    try {
      // TODO: Implement actual submit logic here
      // Include billType and amounts in the submission data
      const submissionData = {
        ...formData,
        billType,
        amounts: billType === "TASKWISE" ? amounts : [],
      };
      console.log("Submission Data:", submissionData);

      handleClose();
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any>;
      const errData = axiosError?.response?.data;
      showToast(
        "error",
        errData?.title || "Error",
        errData?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: "",
        description: "",
        price: "",
        status: "",
      });
      setErrors({});
      setBillType("PROJECTWISE");
      setAmounts([]);
      setModelType("");
      setSelectedProject(null);
      setLoading(false);
      closeModal();
    }
  };

  const getModalTitle = () => {
    switch (modelType) {
      case "add":
        return "Add New Project";
      case "edit":
        return "Update Project";
      case "delete":
        return "Delete Project";
      case "read":
        return "View Project";
      default:
        return "";
    }
  };

  const getModalDescription = () => {
    switch (modelType) {
      case "add":
        return "Add a new project to the system";
      case "edit":
        return "Edit and manage project information with ease.";
      case "delete":
        return `This action cannot be undone. It will permanently remove this project.`;
      case "read":
        return "Review the project's profile and details without making changes.";
      default:
        return "";
    }
  };

  const getSelectedStatusOption = () => {
    const selected = statusOptions.find((opt) => opt.value === formData.status);
    return selected
      ? { _id: selected.value, value: selected.value, label: selected.label }
      : null;
  };

  const getTaskPrice = (chartType: ProjectStepKey) => {
    const task = amounts.find((t) => t.title === chartType);
    return task?.price || "";
  };

  const hasTaskPrice = (chartType: ProjectStepKey) => {
    const task = amounts.find((t) => t.title === chartType);
    return task?.price && task.price !== "";
  };

  // Helper function for conditional classes
  const classNames = (...classes: (string | boolean)[]) => {
    return classes.filter(Boolean).join(" ");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className={`${
        modelType !== "delete" ? "max-w-[800px]" : "max-w-[600px]"
      } p-5 lg:p-10 m-4`}
    >
      <div className="space-y-6">
        <div className="px-2">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {getModalTitle()}
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            {getModalDescription()}
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {modelType !== "delete" ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label required>Name</Label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Project Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full"
                  error={!!errors.name}
                  errorMessage={errors.name}
                />
              </div>
              <div>
                <Label required>Price</Label>
                <Input
                  type="text"
                  name="price"
                  placeholder="Project Price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full"
                  error={!!errors.price}
                  errorMessage={errors.price}
                />
              </div>
              <div className="lg:col-span-2">
                <Label required>Description</Label>
                <TextArea
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  error={!!errors.description}
                  errorMessage={errors.description}
                />
              </div>
              <div className="lg:col-span-2">
                <Label required>Status</Label>
                <SearchableSelect
                  dataProps={{
                    optionData: statusOptions?.map((opt) => ({
                      _id: opt.value,
                      name: opt.label,
                    })),
                  }}
                  selectionProps={{
                    selectedValue: getSelectedStatusOption(),
                  }}
                  displayProps={{
                    placeholder: "Select status...",
                    id: "status",
                    isClearable: true,
                    layoutProps: {
                      className: `w-full ${
                        errors.status ? "border-red-500 border rounded-lg" : ""
                      }`,
                    },
                  }}
                  eventHandlers={{
                    onChange: handleStatusChange,
                  }}
                />
                {errors.status && (
                  <p className="text-sm text-red-500 mt-1">{errors.status}</p>
                )}
              </div>

              {/* Task Wise Billing Checkbox */}
              <div className="lg:col-span-2">
                <Checkbox
                  label="Task Wise Billing in $USD"
                  checked={billType === "TASKWISE"}
                  onChange={handleBillTypeChange}
                />
              </div>

              {/* Task-wise Pricing Configuration - Only show when checkbox is checked */}
              {billType === "TASKWISE" && (
                <div className="lg:col-span-2">
                  <div className="max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                      {/* Header */}
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                        <h3 className="text-lg font-semibold text-white">
                          Task-wise Pricing Configuration
                        </h3>
                        <p className="text-blue-100 text-sm mt-1">
                          Set pricing for different chart types and assessments
                        </p>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {Object.entries(CHART_TYPES).map(([key, label]) => {
                            const chartKey = key as ProjectStepKey;
                            const hasValue = hasTaskPrice(chartKey);

                            return (
                              <div key={key} className="group">
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 hover:shadow-md h-full flex flex-col">
                                  {/* Chart Type Label */}
                                  <div className="mb-3 min-h-[32px]">
                                    <div className="flex items-center justify-between mb-1">
                                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2 flex-1 min-w-0">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                        <span className="truncate">
                                          {label}
                                        </span>
                                      </label>
                                    </div>
                                    {hasValue && (
                                      <div className="flex items-center justify-start">
                                        <div className="flex items-center gap-1 text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                                          <svg
                                            className="w-3 h-3 flex-shrink-0"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                          >
                                            <path
                                              fillRule="evenodd"
                                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                              clipRule="evenodd"
                                            />
                                          </svg>
                                          <span className="text-xs font-medium">
                                            Configured
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Price Input Section - Using Custom Input Component */}
                                  <div className="flex flex-col justify-center flex-1 min-h-[80px]">
                                    <div className="relative mb-2">
                                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                                          $
                                        </span>
                                      </div>
                                      <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={getTaskPrice(chartKey)}
                                        onChange={(e) =>
                                          handleTaskPriceChange(
                                            chartKey,
                                            e.target.value
                                          )
                                        }
                                        className={classNames(
                                          "w-full pl-8 pr-4 py-3 border rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                          hasValue
                                            ? "border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-100"
                                            : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        )}
                                      />
                                    </div>

                                    {/* Helper Text */}
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        Enter price per task
                                      </span>
                                      {hasValue && (
                                        <span className="text-xs font-medium text-green-600 dark:text-green-400">
                                          ${getTaskPrice(chartKey)}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Summary Section */}
                        <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-4 h-4 text-blue-600 dark:text-blue-400"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                  Pricing Summary
                                </h4>
                                <p className="text-xs text-gray-600 dark:text-gray-300">
                                  {Object.keys(CHART_TYPES).length} chart types
                                  available for configuration
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                {
                                  amounts.filter(
                                    (task) => task?.price && task.price !== ""
                                  ).length
                                }{" "}
                                / {Object.keys(CHART_TYPES).length}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-300">
                                Configured
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              {selectedProject && (
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-300">
                        {selectedProject?.name || "Project 56"}
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
                } Project`
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

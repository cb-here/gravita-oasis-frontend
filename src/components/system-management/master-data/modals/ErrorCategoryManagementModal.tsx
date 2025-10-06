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

interface ErrorCategoryManagementModalProps {
  isOpen: boolean;
  closeModal: () => void;
  modelType: string;
  setModelType: any;
  selectedError: any;
  setSelectedError: any;
}

const sectionOptions = [
  { name: "Coding", value: "coding" },
  { name: "Oasis", value: "oasis" },
  { name: "POC", value: "poc" },
];

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

export default function ErrorCategoryManagementModal({
  isOpen,
  closeModal,
  modelType,
  setModelType,
  selectedError,
  setSelectedError,
}: ErrorCategoryManagementModalProps) {
  const [errors, setErrors] = useState<any>({});

  const validationSchema = yup.object().shape({
    name: yup.string().required("Error name is required"),
    section: yup.string().required("Section is required"),
    displayName: yup.string().required("Display name is required"),
    pointValue: yup
      .number()
      .typeError("Point value must be a number")
      .required("Point value is required")
      .min(0, "Point value cannot be negative"),
    category: yup.string().required("Category is required"),
    description: yup.string().required("Error description is required"),
    status: yup.string().required("Status is required"),
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
    section: "",
    displayName: "",
    pointValue: "",
    category: "",
    description: "",
    status: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (modelType === "edit" && selectedError) {
      setFormData({
        name: selectedError.name || "",
        section: selectedError.section || "",
        displayName: selectedError.displayName || "",
        pointValue: selectedError.pointValue?.toString() || "",
        category: selectedError.category || "",
        description: selectedError.description || "",
        status: selectedError.status || "",
      });
    } else {
      setFormData({
        name: "",
        section: "",
        displayName: "",
        pointValue: "",
        category: "",
        description: "",
        status: "",
      });
    }
  }, [selectedError, modelType]);

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

  const handleSectionChange = (option: any) => {
    const sectionValue = option?.value || "";
    setFormData((prev) => ({ ...prev, section: sectionValue }));
    if (errors.section) {
      setErrors((prev: any) => {
        const newErrors = { ...prev };
        delete newErrors.section;
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

  const getSelectedSectionOption = () => {
    const selected = sectionOptions.find(
      (opt) => opt.value === formData.section
    );
    return selected
      ? { _id: selected.value, value: selected.value, label: selected.name }
      : null;
  };

  const getSelectedStatusOption = () => {
    const selected = statusOptions.find((opt) => opt.value === formData.status);
    return selected
      ? { _id: selected.value, value: selected.value, label: selected.label }
      : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = await validateForm(formData);
    if (!isValid) {
      return;
    }
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showToast(
        "success",
        "Success",
        `Error Category ${
          modelType === "edit" ? "updated" : "created"
        } successfully!`
      );
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
        section: "",
        displayName: "",
        pointValue: "",
        category: "",
        description: "",
        status: "",
      });
      setErrors({});
      setModelType("");
      setSelectedError(null);
      setLoading(false);
      closeModal();
    }
  };

  const getModalTitle = () => {
    switch (modelType) {
      case "add":
        return "Add New Error Category";
      case "edit":
        return "Update Error Category";
      case "delete":
        return "Delete Error Category";
      default:
        return "";
    }
  };

  const getModalDescription = () => {
    switch (modelType) {
      case "add":
        return "Create a new error category with all required details";
      case "edit":
        return "Edit and manage error category information with ease.";
      case "delete":
        return `This action cannot be undone. It will permanently remove this error category and all associated data.`;
      default:
        return "";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className={`${
        modelType !== "delete" ? "max-w-[700px]" : "max-w-[500px]"
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
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label required>Error Name</Label>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Enter error name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full"
                    error={!!errors.name}
                    errorMessage={errors.name}
                  />
                </div>

                <div>
                  <Label required>Display Name</Label>
                  <Input
                    type="text"
                    name="displayName"
                    placeholder="Enter display name"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="w-full"
                    error={!!errors.displayName}
                    errorMessage={errors.displayName}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label required>Section</Label>
                  <SearchableSelect
                    dataProps={{
                      optionData: sectionOptions?.map((opt) => ({
                        _id: opt.value,
                        name: opt.name,
                      })),
                    }}
                    selectionProps={{
                      selectedValue: getSelectedSectionOption(),
                    }}
                    displayProps={{
                      placeholder: "Select section...",
                      id: "section",
                      isClearable: true,
                      layoutProps: {
                        className: `w-full ${
                          errors.section ? "border-red-500 border rounded-lg" : ""
                        }`,
                      },
                    }}
                    eventHandlers={{
                      onChange: handleSectionChange,
                    }}
                  />
                  {errors.section && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.section}
                    </p>
                  )}
                </div>

                <div>
                  <Label required>Point Value</Label>
                  <Input
                    type="number"
                    name="pointValue"
                    placeholder="Enter point value"
                    value={formData.pointValue}
                    onChange={handleInputChange}
                    className="w-full"
                    min="0"
                    error={!!errors.pointValue}
                    errorMessage={errors.pointValue}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label required>Category</Label>
                  <Input
                    type="text"
                    name="category"
                    placeholder="Enter category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full"
                    error={!!errors.category}
                    errorMessage={errors.category}
                  />
                </div>

                <div>
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
              </div>

              <div>
                <Label required>Description</Label>
                <TextArea
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  placeholder="Enter error description, details, or notes..."
                  error={!!errors.description}
                  errorMessage={errors.description}
                  rows={4}
                />
              </div>
            </div>
          ) : (
            <div>
              {selectedError && (
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-300">
                        {selectedError?.name || "Error Name"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Display Name: {selectedError?.displayName || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Section: {selectedError?.section || "N/A"} | Points:{" "}
                        {selectedError?.pointValue || "0"} | Category:{" "}
                        {selectedError?.category || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {selectedError?.description ||
                          "No description available"}
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
                } Error Category`
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

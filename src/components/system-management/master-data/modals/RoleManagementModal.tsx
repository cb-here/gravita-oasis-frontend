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
import Switch from "@/components/form/switch/Switch";

interface RoleManagementModalProps {
  isOpen: boolean;
  closeModal: () => void;
  modelType: string;
  setModelType: any;
  selectedRole: any;
  setSelectedRole: any;
}

export default function RoleManagementModal({
  isOpen,
  closeModal,
  modelType,
  setModelType,
  selectedRole,
  setSelectedRole,
}: RoleManagementModalProps) {
  const [errors, setErrors] = useState<any>({});

  const validationSchema = yup.object().shape({
    name: yup.string().required("Role name is required"),
    description: yup.string().required("Role description is required"),
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
    isActive: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (modelType === "edit" && selectedRole) {
      setFormData({
        name: selectedRole.name || "",
        description: selectedRole.description || "",
        isActive: selectedRole.isActive || false,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        isActive: false,
      });
    }
  }, [selectedRole, modelType]);

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
        `Role ${modelType === "edit" ? "updated" : "created"} successfully!`
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
        description: "",
        isActive: false,
      });
      setErrors({});
      setModelType("");
      setSelectedRole(null);
      setLoading(false);
      closeModal();
    }
  };

  const getModalTitle = () => {
    switch (modelType) {
      case "add":
        return "Add New Role";
      case "edit":
        return "Update Role";
      case "delete":
        return "Delete Role";
      default:
        return "";
    }
  };

  const getModalDescription = () => {
    switch (modelType) {
      case "add":
        return "Create a new role with name and description";
      case "edit":
        return "Edit and manage role information with ease.";
      case "delete":
        return `This action cannot be undone. It will permanently remove this role and all associated data.`;
      default:
        return "";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className={`${
        modelType !== "delete" ? "max-w-[600px]" : "max-w-[500px]"
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
              <div>
                <Label required>Role Name</Label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Enter role name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full"
                  error={!!errors.name}
                  errorMessage={errors.name}
                />
              </div>

              <div>
                <Label required>Description</Label>
                <TextArea
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  placeholder="Enter role description, responsibilities, or permissions..."
                  error={!!errors.description}
                  errorMessage={errors.description}
                  rows={4}
                />
              </div>
              <div>
                <Switch
                  label="Status"
                  defaultChecked={formData.isActive}
                  onChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isActive: checked }))
                  }
                />
              </div>
            </div>
          ) : (
            <div>
              {selectedRole && (
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-300">
                        {selectedRole?.name || "Role Name"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {selectedRole?.description ||
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
                } Role`
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

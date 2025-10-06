import React, { useState } from "react";
import Button from "@/components/ui/button/Button";
import { AxiosError } from "axios";
import * as yup from "yup";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Loading from "@/components/Loading";

export default function AccessGroupModel({
  isOpen,
  closeModal,
  setSelectedAccessGroup,
  selectedAccessGroup,
  modelType,
  setModelType,
}: {
  isOpen: boolean;
  closeModal: () => void;
  setSelectedAccessGroup: any;
  selectedAccessGroup: any;
  modelType: string;
  setModelType: any;
}) {
  const [errors, setErrors] = useState<any>({});

  const validationSchema = yup.object().shape({
    name: yup.string().required("Access group name is required"),
    description: yup.string().required("Description is required"),
  });

  const initForm = {
    name: "",
    description: "",
    permissions: [],
    status: true,
  };
  const [formData, setFormData] = useState(initForm);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await validateForm();
    if (!isValid) {
      return;
    }
    setLoading(true);
    try {
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any>;
      const errData = axiosError?.response?.data;
      console.log("🚀 ~ handleSubmit ~ errData:", errData);
      //   showToast(
      //     "error",
      //     errData?.title || "Error",
      //     errData?.message || "An error occurred. Please try again."
      //   );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSelectedAccessGroup(null);
      setErrors({});
      setFormData(initForm);
      setModelType("");
      setLoading(false);
      closeModal();
    }
  };

  const getModalTitle = () => {
    switch (modelType) {
      case "add":
        return "Add New Access Group";
      case "edit":
        return "Update Access Group";
      case "delete":
        return "Delete Access Group";
      case "read":
        return "View Access Group";
      default:
        return "";
    }
  };

  const getModalDescription = () => {
    switch (modelType) {
      case "add":
        return "Add a new access group to the system";
      case "edit":
        return "Edit and manage access group information with ease.";
      case "delete":
        return `This action cannot be undone. It will permanently remove this access group.`;
      case "read":
        return `View and manage access group infomation with ease`;
      default:
        return "";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className={`${
        modelType === "delete" ? "max-w-[600px]" : "max-w-[900px]"
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
      <form className="flex flex-col gap-6 w-full  p-2" onSubmit={handleSubmit}>
        {modelType === "delete" ? (
          <div>
            {selectedAccessGroup && (
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-300">
                  {selectedAccessGroup.name || "Access Group"}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-5 w-full">
              <div className="w-full">
                <Label required={modelType !== "read"}>Name</Label>
                <Input
                  type="text"
                  placeholder="Access Group"
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }));
                    setErrors((prev: any) => ({ ...prev, name: "" }));
                  }}
                  readOnly={modelType === "read"}
                  className="w-full"
                  error={!!errors.name}
                  errorMessage={errors.name}
                />
              </div>
              <div className="w-full">
                <Label required={modelType !== "read"}>Description</Label>
                <TextArea
                  placeholder="Type description here..."
                  value={formData.description}
                  onChange={(value: string) => {
                    setFormData((prev) => ({
                      ...prev,
                      description: value,
                    }));
                    setErrors((prev: any) => ({ ...prev, description: "" }));
                  }}
                  readOnly={modelType === "read"}
                  className="w-full"
                  error={!!errors.description}
                  errorMessage={errors.description}
                />
              </div>
            </div>
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
                      : "Add"
                  } Access Group`
                )}
              </Button>
            </>
          )}
        </div>
      </form>
    </Modal>
  );
}

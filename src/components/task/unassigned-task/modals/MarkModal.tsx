import React, { useState, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import Loading from "@/components/Loading";
import { showToast } from "@/lib/toast";
import { AxiosError } from "axios";
import * as yup from "yup";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import Radio from "@/components/form/input/Radio";
import Badge from "@/components/ui/badge/Badge";

interface MarkModalProps {
  isOpen: boolean;
  closeModal: () => void;
  selectedTask: any;
  setSelectedTask: any;
}

export default function MarkModal({
  isOpen,
  closeModal,
  selectedTask,
  setSelectedTask,
}: MarkModalProps) {
  const [errors, setErrors] = useState<any>({});
  const [markType, setMarkType] = useState<
    "authorization" | "priority" | "rejection" | ""
  >("");

  const validationSchema = yup.object().shape({
    markType: yup
      .string()
      .oneOf(["authorization", "priority", "rejection"])
      .required("Please select a mark type"),
    reason: yup.string().when("markType", {
      is: "rejection",
      then: (schema) => schema.required("Rejection reason is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
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
    reason: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedTask) {
      // Reset form when modal opens with a new task
      setMarkType("");
      setFormData({ reason: "" });
      setErrors({});
    }
  }, [selectedTask]);

  const handleMarkTypeChange = (
    type: "authorization" | "priority" | "rejection"
  ) => {
    setMarkType(type);
    if (type !== "rejection") {
      setFormData({ ...formData, reason: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      markType,
      reason: formData.reason,
    };

    const isValid = await validateForm(submitData);
    if (!isValid) {
      return;
    }
    setLoading(true);
    try {
      // TODO: Implement API call here, e.g., await markTaskAPI(selectedTask.id, submitData);
      showToast("success", "Success", "Task marked successfully.");
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
      setErrors({});
      setSelectedTask(null);
      setMarkType("");
      setFormData({ reason: "" });
      setLoading(false);
      closeModal();
    }
  };

  if (!selectedTask) {
    return null;
  }

  const markOptions = [
    {
      id: "mark-authorization",
      value: "authorization",
      label: "Mark as Authorization",
    },
    {
      id: "mark-priority",
      value: "priority",
      label: "Mark as Priority",
    },
    {
      id: "mark-rejection",
      value: "rejection",
      label: "Mark as Rejection",
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className={`
         max-w-[700px]
       p-5 lg:p-10 m-4`}>
      <div className="space-y-6">
        <div className="px-2">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Mark Task
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Select the appropriate mark type for the selected task to update its
            status. Only one mark type can be applied at a time. If marking as
            rejected, provide a reason.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 rounded-lg">
          <h5 className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Task Details
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <strong className="text-gray-800 dark:text-gray-200 min-w-max">
                Task Name:
              </strong>
              <span className="ml-0 sm:ml-2 mt-1 sm:mt-0 text-gray-900 dark:text-gray-100">
                {selectedTask.name || "SOC"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center">
              <strong className="text-gray-800 dark:text-gray-200 min-w-max">
                MRN:
              </strong>
              <span className="ml-0 sm:ml-2 mt-1 sm:mt-0 text-gray-900 dark:text-gray-100">
                {selectedTask.mrn || "345678"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center">
              <strong className="text-gray-800 dark:text-gray-200 min-w-max">
                Target Date:
              </strong>
              <span className="ml-0 sm:ml-2 mt-1 sm:mt-0 text-gray-900 dark:text-gray-100">
                {selectedTask.targetDate
                  ? new Date(selectedTask.targetDate).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center">
              <strong className="text-gray-800 dark:text-gray-200 min-w-max">
                Project Name:
              </strong>
              <Badge color="success" className="ml-0 sm:ml-2 mt-1 sm:mt-0 text-gray-900 dark:text-gray-100">
                {selectedTask.projectName || "Project J"}
              </Badge>
            </div>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex items-center gap-6">
            {markOptions.map((option) => (
              <Radio
                key={option.id}
                id={option.id}
                name="markType"
                value={option.value}
                checked={markType === option.value}
                label={option.label}
                onChange={(value: string) =>
                  handleMarkTypeChange(
                    value as "authorization" | "priority" | "rejection"
                  )
                }
              />
            ))}
          </div>

          {markType === "rejection" && (
            <div>
              <Label required>Rejection Reason</Label>
              <TextArea
                placeholder="Enter the rejection reason"
                value={formData.reason}
                onChange={(value) => {
                  setFormData({
                    ...formData,
                    reason: value,
                  });
                }}
                error={errors.reason}
                errorMessage={errors.reason}
              />
            </div>
          )}

          <div className="flex justify-between gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              type="button"
              disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-6 py-2 min-w-[175px]"
              disabled={loading || !markType}>
              {loading ? <Loading size={1} style={2} /> : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

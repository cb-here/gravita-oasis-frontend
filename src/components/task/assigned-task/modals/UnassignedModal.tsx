import React, { useState, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import Loading from "@/components/Loading";
import { showToast } from "@/lib/toast";
import { AxiosError } from "axios";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import Badge from "@/components/ui/badge/Badge";
import { getPriorityColor } from "../MainComponent";
import Checkbox from "@/components/form/input/Checkbox";
import SearchableSelect from "@/components/form/SearchableSelect";
import { teams } from "@/components/user-management/user-list/modals/UserListModal";

interface BulkTaskModalProps {
  isOpen: boolean;
  closeModal: () => void;
  modelType: string;
  setModelType: any;
  selectedTask: any;
  setSelectedTask: any;
}

interface FormData {
  markValid: boolean;
  markInvalid: boolean;
  resolution: string;
  team: string;
}

export default function UnassignedModal({
  isOpen,
  closeModal,
  modelType,
  setModelType,
  selectedTask,
  setSelectedTask,
}: BulkTaskModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    markValid: false,
    markInvalid: false,
    resolution: "",
    team: "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        markValid: false,
        markInvalid: false,
        resolution: "",
        team: "",
      });
    }
  }, [isOpen, modelType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (modelType !== "unassign" && modelType !== "assign") {
      if (!formData.markValid && !formData.markInvalid) {
        showToast(
          "error",
          "Validation Error",
          "Please select either 'Mark hold as valid' or 'Mark hold as invalid'"
        );
        return;
      }

      if (!formData.resolution.trim()) {
        showToast(
          "error",
          "Validation Error",
          "Resolution comment is required"
        );
        return;
      }
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const submissionData =
        modelType === "unassign"
          ? {
              taskId: selectedTask?._id,
              action: "unassign",
            }
          : modelType === "assign"
          ? {
              taskId: selectedTask?._id,
              action: "assign",
            }
          : {
              taskId: selectedTask?._id,
              action: modelType,
              markValid: formData.markValid,
              markInvalid: formData.markInvalid,
              resolution: formData.resolution.trim(),
            };

      console.log("Submitting data:", submissionData);

      showToast("success", "Success");
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

  const handleCheckboxChange = (field: keyof FormData) => {
    setFormData((prev) => {
      if (field === "markValid") {
        return {
          ...prev,
          markValid: !prev.markValid,
          markInvalid: prev.markValid ? prev.markInvalid : false,
        };
      } else if (field === "markInvalid") {
        return {
          ...prev,
          markInvalid: !prev.markInvalid,
          markValid: prev.markInvalid ? prev.markValid : false,
        };
      }
      return prev;
    });
  };

  const handleResolutionChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      resolution: value,
    }));
  };

  const handleClose = () => {
    if (!loading) {
      setModelType("");
      setSelectedTask(null);
      setFormData({
        markValid: false,
        markInvalid: false,
        resolution: "",
        team: "",
      });
      setLoading(false);
      closeModal();
    }
  };

  const getModalTitle = () => {
    switch (modelType) {
      case "unassign":
        return "Unassign Task";
      case "assign":
        return "Assign Task";
      case "hold":
        return "Hold Task";
      case "rehold":
        return "Rehold Task";
      default:
        return "";
    }
  };

  const getModalDescription = () => {
    switch (modelType) {
      case "unassign":
        return "Remove the selected task from the currently assigned user(s).";
      case "assign":
        return "Assign the selected task to a team.";
      case "hold":
        return "Place the selected tasks on hold to pause progress temporarily.";
      case "rehold":
        return "Reapply hold on the selected tasks that were previously resumed.";
      default:
        return "";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className={`max-w-[600px] p-5 lg:p-10 m-4`}
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
          {modelType === "unassign" ? (
            <div className="border rounded-xl bg-gray-50 dark:bg-white/5 p-4 shadow-sm">
              <h5 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
                Task Details
              </h5>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                <p>
                  <span className="font-medium text-gray-600 dark:text-gray-400">
                    Name:
                  </span>{" "}
                  {selectedTask?.task_name || "N/A"}
                </p>
                <p>
                  <span className="font-medium text-gray-600 dark:text-gray-400">
                    Insurance:
                  </span>{" "}
                  {selectedTask?.insurance || "N/A"}
                </p>
                <p>
                  <span className="font-medium text-gray-600 dark:text-gray-400">
                    Patient Name:
                  </span>{" "}
                  {selectedTask?.patient_name || "Patient Name"}
                </p>
                <p>
                  <span className="font-medium text-gray-600 dark:text-gray-400">
                    Project Name:
                  </span>{" "}
                  {selectedTask?.project_name || "N/A"}
                </p>
                <p>
                  <span className="font-medium text-gray-600 dark:text-gray-400">
                    Priority:
                  </span>{" "}
                  <Badge
                    className="text-xs"
                    color={getPriorityColor(selectedTask?.priority)}
                  >
                    {selectedTask?.priority || "Low"}
                  </Badge>
                </p>
                <p>
                  <span className="font-medium text-gray-600 dark:text-gray-400">
                    Assigned To:
                  </span>{" "}
                  {selectedTask?.assigned_to || "N/A"}
                </p>
              </div>
            </div>
          ) : modelType === "assign" ? (
            <div className="p-4 bg-gray-50  rounded-md border border-gray-50">
              <Label>Select Team</Label>
              <SearchableSelect
                dataProps={{
                  optionData: teams?.map((opt) => ({
                    _id: opt.value,
                    name: opt.label,
                  })),
                }}
                selectionProps={{
                  selectedValue: {
                    _id: formData?.team,
                    value: formData?.team,
                    label: formData?.team,
                  },
                }}
                displayProps={{
                  placeholder: "Select team...",
                  id: "team",
                  isClearable: true,
                }}
                eventHandlers={{
                  onChange: (option: any) => {
                    setFormData((prev: FormData) => ({
                      ...prev,
                      team: option?._id || "",
                    }));
                  },
                }}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="border rounded-xl bg-gray-50 dark:bg-white/5 p-4 shadow-sm">
                <div className="space-y-2 text-base text-gray-700 dark:text-gray-300">
                  <p className="font-medium text-gray-600 dark:text-gray-400">
                    You&apos;re about to resolve the hold for task{" "}
                    <span className="text-brand-500">
                      #{selectedTask?._id || "68c85011ae16cd41b5bd4975"}
                    </span>
                    . The task will be returned to the coder&apos;s workflow
                    with an &quot;RTC&quot; (Ready to Complete) tag.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Checkbox
                  label="Mark hold as valid"
                  checked={formData.markValid}
                  onChange={() => handleCheckboxChange("markValid")}
                />
                <Checkbox
                  label="Mark hold as invalid"
                  checked={formData.markInvalid}
                  onChange={() => handleCheckboxChange("markInvalid")}
                />
              </div>
              <div>
                <Label>Resolution Comment</Label>
                <TextArea
                  value={formData.resolution}
                  onChange={handleResolutionChange}
                  placeholder="Enter resolution comments..."
                />
              </div>
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
                  modelType === "unassign"
                    ? "Unassign Task"
                    : modelType === "assign"
                    ? "Assign Task"
                    : "Resolve Hold"
                } `
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

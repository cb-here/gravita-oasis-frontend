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

interface TeamManagementModalProps {
  isOpen: boolean;
  closeModal: () => void;
  modelType: string;
  setModelType: any;
  selectedTeam: any;
  setSelectedTeam: any;
}

// Mock data for team leaders (replace with actual API data)
const teamLeaderOptions = [
  { value: "1", label: "John Doe" },
  { value: "2", label: "Jane Smith" },
  { value: "3", label: "Mike Johnson" },
  { value: "4", label: "Sarah Wilson" },
  { value: "5", label: "David Brown" },
];

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
  { value: "Archived", label: "Archived" },
];

export default function TeamManagementModal({
  isOpen,
  closeModal,
  modelType,
  setModelType,
  selectedTeam,
  setSelectedTeam,
}: TeamManagementModalProps) {
  const [errors, setErrors] = useState<any>({});

  const validationSchema = yup.object().shape({
    name: yup.string().required("Team name is required"),
    teamLeader: yup.string().required("Team leader is required"),
    memberCount: yup
      .number()
      .typeError("Member count must be a number")
      .required("Member count is required")
      .min(1, "Member count must be at least 1")
      .max(100, "Member count cannot exceed 100"),
    status: yup.string().required("Team status is required"),
    description: yup.string().required("Team description is required"),
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
    teamLeader: "",
    memberCount: "",
    status: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (modelType === "edit" && selectedTeam) {
      setFormData({
        name: selectedTeam.name || "",
        teamLeader: selectedTeam.teamLeader || "",
        memberCount: selectedTeam.memberCount?.toString() || "",
        status: selectedTeam.status || "",
        description: selectedTeam.description || "",
      });
    } else {
      setFormData({
        name: "",
        teamLeader: "",
        memberCount: "",
        status: "",
        description: "",
      });
    }
  }, [selectedTeam, modelType]);

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

  const handleTeamLeaderChange = (option: any) => {
    const teamLeaderValue = option?.value || "";
    setFormData((prev) => ({ ...prev, teamLeader: teamLeaderValue }));
    if (errors.teamLeader) {
      setErrors((prev: any) => {
        const newErrors = { ...prev };
        delete newErrors.teamLeader;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = await validateForm(formData);
    if (!isValid) {
      return;
    }
    setLoading(true);
    try {
      // Here you would typically make an API call to save the team
      console.log("Form data to submit:", {
        ...formData,
        memberCount: parseInt(formData.memberCount),
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showToast(
        "success", 
        "Success", 
        `Team ${modelType === "edit" ? "updated" : "created"} successfully!`
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
        teamLeader: "",
        memberCount: "",
        status: "",
        description: "",
      });
      setErrors({});
      setModelType("");
      setSelectedTeam(null);
      setLoading(false);
      closeModal();
    }
  };

  const getModalTitle = () => {
    switch (modelType) {
      case "add":
        return "Add New Team";
      case "edit":
        return "Update Team";
      case "delete":
        return "Delete Team";
      default:
        return "";
    }
  };

  const getModalDescription = () => {
    switch (modelType) {
      case "add":
        return "Create a new team with team leader and member details";
      case "edit":
        return "Edit and manage team information with ease.";
      case "delete":
        return `This action cannot be undone. It will permanently remove this team and all associated data.`;
      default:
        return "";
    }
  };

  const getSelectedTeamLeaderOption = () => {
    const selected = teamLeaderOptions.find((opt) => opt.value === formData.teamLeader);
    return selected
      ? { _id: selected.value, value: selected.value, label: selected.label }
      : null;
  };

  const getSelectedStatusOption = () => {
    const selected = statusOptions.find((opt) => opt.value === formData.status);
    return selected
      ? { _id: selected.value, value: selected.value, label: selected.label }
      : null;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className={`${
        modelType !== "delete" ? "max-w-[700px]" : "max-w-[600px]"
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
                  <Label required>Team Name</Label>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Enter team name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full"
                    error={!!errors.name}
                    errorMessage={errors.name}
                  />
                </div>

                <div>
                  <Label required>Member Count</Label>
                  <Input
                    type="number"
                    name="memberCount"
                    placeholder="Enter member count"
                    value={formData.memberCount}
                    onChange={handleInputChange}
                    className="w-full"
                    min="1"
                    max="100"
                    error={!!errors.memberCount}
                    errorMessage={errors.memberCount}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label required>Team Leader</Label>
                  <SearchableSelect
                    dataProps={{
                      optionData: teamLeaderOptions?.map((opt) => ({
                        _id: opt.value,
                        name: opt.label,
                      })),
                    }}
                    selectionProps={{
                      selectedValue: getSelectedTeamLeaderOption(),
                    }}
                    displayProps={{
                      placeholder: "Select team leader...",
                      id: "teamLeader",
                      isClearable: true,
                      layoutProps: {
                        className: `w-full ${
                          errors.teamLeader ? "border-red-500 border rounded-lg" : ""
                        }`,
                      },
                    }}
                    eventHandlers={{
                      onChange: handleTeamLeaderChange,
                    }}
                  />
                  {errors.teamLeader && (
                    <p className="text-sm text-red-500 mt-1">{errors.teamLeader}</p>
                  )}
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
                  placeholder="Enter team description, goals, or responsibilities..."
                  error={!!errors.description}
                  errorMessage={errors.description}
                  rows={4}
                />
              </div>
            </div>
          ) : (
            <div>
              {selectedTeam && (
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-300">
                        {selectedTeam?.name || "Team Name"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Team Leader: {selectedTeam?.teamLeaderName || "N/A"} | 
                        Members: {selectedTeam?.memberCount || "0"} | 
                        Status: {selectedTeam?.status || "N/A"}
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
                } Team`
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
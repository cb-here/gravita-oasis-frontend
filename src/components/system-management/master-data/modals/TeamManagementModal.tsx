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
import { Users, Mail, Briefcase, Shield, FileText } from "lucide-react";

// Mock data
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

const userOptions = [
  { value: "u1", label: "Alice Cooper" },
  { value: "u2", label: "Bob Marley" },
  { value: "u3", label: "Charlie Puth" },
  { value: "u4", label: "Diana Ross" },
  { value: "u5", label: "Elton John" },
];

const projectOptions = [
  { value: "p1", label: "Project Alpha" },
  { value: "p2", label: "Project Beta" },
  { value: "p3", label: "Project Gamma" },
];

// Mock members data for view mode
const mockTeamMembers = [
  { id: "m1", name: "Alice Cooper", email: "alice.cooper@example.com" },
  { id: "m2", name: "Bob Marley", email: "bob.marley@example.com" },
  { id: "m3", name: "Charlie Puth", email: "charlie.puth@example.com" },
  { id: "m4", name: "Diana Ross", email: "diana.ross@example.com" },
  { id: "m5", name: "Elton John", email: "elton.john@example.com" },
];

type ModelType = "add" | "edit" | "view" | "add-member" | "delete";

interface TeamManagementModalProps {
  isOpen: boolean;
  closeModal: () => void;
  modelType: ModelType;
  setModelType: (type: ModelType | "") => void;
  selectedTeam: any;
  setSelectedTeam: (team: any) => void;
}

export default function TeamManagementModal({
  isOpen,
  closeModal,
  modelType,
  setModelType,
  selectedTeam,
  setSelectedTeam,
}: TeamManagementModalProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Dynamic validation schema
  const getValidationSchema = () => {
    const base = {
      name: yup.string(),
      teamLeader: yup.string(),
      memberCount: yup.number(),
      status: yup.string(),
      description: yup.string(),
      project: yup.string().optional(),
      user: yup.string().optional(),
    };

    if (modelType === "add" || modelType === "edit") {
      return yup.object().shape({
        ...base,
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
    }

    if (modelType === "add-member") {
      return yup.object().shape({
        // Validation handled manually for selectedUsers
      });
    }

    return yup.object().shape(base); // delete/view: no validation
  };

  const validationSchema = getValidationSchema();

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
    project: "",
    user: "",
    description: "",
  });

  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

  useEffect(() => {
    if (
      (modelType === "edit" || modelType === "add-member" || modelType === "view") &&
      selectedTeam
    ) {
      setFormData({
        name: selectedTeam.name || "",
        teamLeader: selectedTeam.teamLeader || "",
        memberCount: selectedTeam.memberCount?.toString() || "",
        status: selectedTeam.status || "",
        project: selectedTeam.project || "",
        user: "",
        description: selectedTeam.description || "",
      });
      setSelectedUsers([]);
    } else {
      setFormData({
        name: "",
        teamLeader: "",
        memberCount: "",
        status: "",
        project: "",
        user: "",
        description: "",
      });
      setSelectedUsers([]);
    }
  }, [selectedTeam, modelType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, description: value }));
    if (errors.description) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.description;
        return newErrors;
      });
    }
  };

  const handleSelectChange = (field: string) => (option: any) => {
    const value = option?.value || "";
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const getSelected = (
    options: { value: string; label: string }[],
    value: string
  ) => {
    const found = options.find((opt) => opt.value === value);
    return found
      ? { _id: found.value, value: found.value, label: found.label }
      : null;
  };

  const handleUserCheckbox = (
    allOptions: any[],
    isSelectAll: boolean,
    currentSelected: any[],
    option: any,
    checked: boolean
  ) => {
    let newSelected = [...currentSelected];
    if (isSelectAll) {
      newSelected = checked ? allOptions : [];
    } else {
      if (checked) {
        if (!newSelected.find((s) => s.value === option.value)) {
          newSelected.push(option.data);
        }
      } else {
        newSelected = newSelected.filter((s) => s.value !== option.value);
      }
    }
    setSelectedUsers(newSelected);

    if (errors.user && newSelected.length > 0) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.user;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (modelType === "add-member" && selectedUsers.length === 0) {
      setErrors({ user: "Please select at least one member to add" });
      return;
    }

    const isValid = await validateForm(formData);
    if (!isValid) return;

    setLoading(true);
    try {
      console.log("Form data to submit:", {
        ...formData,
        memberCount: formData.memberCount ? parseInt(formData.memberCount) : undefined,
        selectedUsers,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const actionText =
        modelType === "add"
          ? "created"
          : modelType === "edit"
          ? "updated"
          : modelType === "add-member"
          ? "added to team"
          : "deleted";

      showToast(
        "success",
        "Success",
        `Team member ${actionText} successfully!`
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
        project: "",
        user: "",
        description: "",
      });
      setErrors({});
      setSelectedUsers([]);
      setModelType("");
      setSelectedTeam(null);
      setLoading(false);
      closeModal();
    }
  };

  const getModalTitle = () => {
    switch (modelType) {
      case "add": return "Add New Team";
      case "view": return "View Team";
      case "edit": return "Update Team";
      case "add-member": return "Add Member to Team";
      case "delete": return "Delete Team";
      default: return "";
    }
  };

  const getModalDescription = () => {
    switch (modelType) {
      case "add": return "Create a new team with team leader and member details";
      case "edit": return "Edit and manage team information with ease.";
      case "add-member": return `Add a new member to "${selectedTeam?.name || "this team"}".`;
      case "view": return "Viewing team information";
      case "delete": return `This action cannot be undone. It will permanently remove this team and all associated data.`;
      default: return "";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className={`${
        modelType === "add-member" || modelType === "delete"
          ? "max-w-[600px]"
          : "max-w-[900px]"
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
          {/* Conditional Rendering */}
          {modelType === "add-member" ? (
            // ADD-MEMBER MODE
            <div className="grid grid-cols-1 gap-6">
              <div>
                <Label required>Select Members</Label>
                <SearchableSelect
                  dataProps={{
                    optionData: userOptions.map((opt) => ({
                      _id: opt.value,
                      name: opt.label,
                    })),
                  }}
                  selectionProps={{
                    showCheckboxes: true,
                    selectedOptions: selectedUsers,
                  }}
                  displayProps={{
                    placeholder: "Search and select users...",
                    id: "user",
                    isClearable: true,
                    showPill: true,
                    layoutProps: {
                      className: `w-full ${errors.user ? "border-red-500 border rounded-lg" : ""}`,
                    },
                  }}
                  eventHandlers={{
                    handleCheckbox: handleUserCheckbox,
                  }}
                />
                {errors.user && <p className="text-sm text-red-500 mt-1">{errors.user}</p>}
              </div>
            </div>
          ) : modelType === "view" ? (
            // VIEW MODE
            <div className="space-y-6">
              {/* Team Overview Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800/50 rounded-lg p-6 border border-blue-100 dark:border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {formData.name || "Team Name"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {formData.description || "No description available"}
                    </p>
                  </div>
                  <div className="ml-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        formData.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : formData.status === "Inactive"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {formData.status || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Team Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Team Leader</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">
                        {teamLeaderOptions.find((opt) => opt.value === formData.teamLeader)?.label || "Not assigned"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Members</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">
                        {formData.memberCount || "0"} Members
                      </p>
                    </div>
                  </div>
                </div>

                {formData.project && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <Briefcase className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Assigned Project</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">
                          {projectOptions.find((opt) => opt.value === formData.project)?.label || "No project"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Team Members */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Team Members</h4>
                  <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                    {mockTeamMembers.length} members
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {mockTeamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {member.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{member.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-gray-400 flex-shrink-0" />
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{member.email}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {formData.description && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                      <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2">Team Description</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{formData.description}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : modelType === "delete" ? (
            // DELETE MODE
            <div>
              {selectedTeam && (
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <p className="font-semibold text-gray-800 dark:text-gray-300">
                    {selectedTeam?.name || "Team Name"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Team Leader: {selectedTeam?.teamLeaderName || "N/A"} | Members: {selectedTeam?.memberCount || "0"} | Status: {selectedTeam?.status || "N/A"}
                  </p>
                </div>
              )}
            </div>
          ) : (
            // ADD / EDIT MODE (default form)
            <div className="grid grid-cols-1 gap-6">
              {/* Row 1 */}
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

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label required>Team Leader</Label>
                  <SearchableSelect
                    dataProps={{
                      optionData: teamLeaderOptions.map((opt) => ({
                        _id: opt.value,
                        name: opt.label,
                      })),
                    }}
                    selectionProps={{
                      selectedValue: getSelected(teamLeaderOptions, formData.teamLeader),
                    }}
                    displayProps={{
                      placeholder: "Select team leader...",
                      id: "teamLeader",
                      isClearable: true,
                      layoutProps: {
                        className: `w-full ${errors.teamLeader ? "border-red-500 border rounded-lg" : ""}`,
                      },
                    }}
                    eventHandlers={{
                      onChange: handleSelectChange("teamLeader"),
                    }}
                  />
                  {errors.teamLeader && <p className="text-sm text-red-500 mt-1">{errors.teamLeader}</p>}
                </div>

                <div>
                  <Label required>Status</Label>
                  <SearchableSelect
                    dataProps={{
                      optionData: statusOptions.map((opt) => ({
                        _id: opt.value,
                        name: opt.label,
                      })),
                    }}
                    selectionProps={{
                      selectedValue: getSelected(statusOptions, formData.status),
                    }}
                    displayProps={{
                      placeholder: "Select status...",
                      id: "status",
                      isClearable: true,
                      layoutProps: {
                        className: `w-full ${errors.status ? "border-red-500 border rounded-lg" : ""}`,
                      },
                    }}
                    eventHandlers={{
                      onChange: handleSelectChange("status"),
                    }}
                  />
                  {errors.status && <p className="text-sm text-red-500 mt-1">{errors.status}</p>}
                </div>

                <div>
                  <Label>Available Users</Label>
                  <SearchableSelect
                    dataProps={{
                      optionData: userOptions.map((opt) => ({
                        _id: opt.value,
                        name: opt.label,
                      })),
                    }}
                    selectionProps={{
                      showCheckboxes: true,
                      selectedOptions: selectedUsers,
                    }}
                    displayProps={{
                      placeholder: "Select users...",
                      id: "user",
                      isClearable: true,
                      showPill: true,
                      layoutProps: {
                        className: `w-full ${errors.user ? "border-red-500 border rounded-lg" : ""}`,
                      },
                    }}
                    eventHandlers={{
                      handleCheckbox: handleUserCheckbox,
                    }}
                  />
                  {errors.user && <p className="text-sm text-red-500 mt-1">{errors.user}</p>}
                </div>

                <div>
                  <Label>Available Project</Label>
                  <SearchableSelect
                    dataProps={{
                      optionData: projectOptions.map((opt) => ({
                        _id: opt.value,
                        name: opt.label,
                      })),
                    }}
                    selectionProps={{
                      selectedValue: getSelected(projectOptions, formData.project),
                    }}
                    displayProps={{
                      placeholder: "Select project...",
                      id: "project",
                      isClearable: true,
                      layoutProps: {
                        className: `w-full ${errors.project ? "border-red-500 border rounded-lg" : ""}`,
                      },
                    }}
                    eventHandlers={{
                      onChange: handleSelectChange("project"),
                    }}
                  />
                  {errors.project && <p className="text-sm text-red-500 mt-1">{errors.project}</p>}
                </div>
              </div>

              {/* Description */}
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
          )}

          {/* Action Buttons */}
          <div className={`flex gap-3 pt-4 ${modelType === "view" ? "justify-end" : "justify-between"}`}>
            {modelType !== "view" && (
              <Button variant="outline" onClick={handleClose} type="button" disabled={loading}>
                Cancel
              </Button>
            )}
            {modelType === "view" ? (
              <Button variant="outline" onClick={handleClose} type="button" className="px-6 py-2 min-w-[120px]">
                Close
              </Button>
            ) : (
              <Button type="submit" className="px-6 py-2 min-w-[175px]" disabled={loading}>
                {loading ? (
                  <Loading size={1} style={2} />
                ) : (
                  `${
                    modelType === "delete"
                      ? "Delete"
                      : modelType === "edit"
                      ? "Update"
                      : modelType === "add-member"
                      ? "Add Member"
                      : "Create"
                  }${modelType === "add-member" ? "" : " Team"}`
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
}
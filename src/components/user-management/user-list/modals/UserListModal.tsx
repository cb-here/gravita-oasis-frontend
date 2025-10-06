"use client";
import React, { useState } from "react";
import Button from "@/components/ui/button/Button";
import mammoth from "mammoth";
import SearchableSelect from "@/components/form/SearchableSelect";
import TextArea from "@/components/form/input/TextArea";
import FileUploader from "@/components/form/input/FileUploader";
import { Modal } from "@/components/ui/modal";
import Loading from "@/components/Loading";
import Label from "@/components/form/Label";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import MyPhoneInput from "@/components/form/input/PhoneInput";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip/Tooltip";
import { TrashBinIcon } from "@/icons";
import { showToast } from "@/lib/toast";
import Tabs from "@/components/common/tabs/Tabs";
import Badge from "@/components/ui/badge/Badge";
import { StatusColor } from "@/type/commonUseType";

interface User {
  email: string;
  role: string;
  projects: string[];
  accessGroups: string[];
  team: string;
}

interface FormData {
  role: string;
  projects: string[];
  status: string;
  accessGroups: string[];
  experience?: string;
  team?: string;
  abilityTags: string[];
  email?: string;
  phone?: string;
}

interface UserListModalProps {
  isOpen: boolean;
  closeModal: () => void;
  modalType?: string;
  setModalType?: (type: string) => void;
  selectedUserList: any;
  setSelectedUserList: (user: User | null) => void;
}

interface Option {
  value: string;
  label: string;
}

interface AbilityTag {
  value: string;
  label: string;
}

export const teams: Option[] = [
  { value: "Alpha", label: "Team Alpha" },
  { value: "Beta", label: "Team Beta" },
  { value: "Gamma", label: "Team Gamma" },
];

export default function UserListModal({
  isOpen,
  closeModal,
  modalType,
  setModalType,
  selectedUserList,
  setSelectedUserList,
}: UserListModalProps) {
  const [formData, setFormData] = useState<FormData>({
    role: "",
    projects: [],
    status: "",
    accessGroups: [],
    team: "",
    abilityTags: [],
    email: "",
    phone: "",
  });

  const [activeTab, setActiveTab] = useState<any>("Overview");

  const tabGroups = [
    { name: "Overview", key: "Overview" },
    { name: "Personal Details", key: "Personal Details" },
  ];

  const [users, setUsers] = useState<User[]>([
    { email: "", role: "User", accessGroups: [], team: "", projects: [] },
  ]);

  const roles: Option[] = [
    { value: "Agent", label: "Agent" },
    { value: "Manager", label: "Manager" },
  ];

  const experienceLevels: Option[] = [
    { value: "Junior", label: "Junior" },
    { value: "Senior", label: "Senior" },
  ];

  const statusOptions: Option[] = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  const abilityTags: AbilityTag[] = [
    { value: "fresh", label: "Fresh" },
    { value: "rtc", label: "RTC" },
  ];

  const accessGroups = [
    { _id: "ag1", name: "Administrators" },
    { _id: "ag2", name: "Managers" },
    { _id: "ag3", name: "Team Leads" },
    { _id: "ag4", name: "Developers" },
    { _id: "ag5", name: "Designers" },
    { _id: "ag6", name: "QA Testers" },
    { _id: "ag7", name: "Support Staff" },
    { _id: "ag8", name: "Content Writers" },
    { _id: "ag9", name: "Marketing Team" },
    { _id: "ag10", name: "Sales Team" },
  ];

  const projects = [
    { _id: "proj1", name: "Website Redesign" },
    { _id: "proj2", name: "Mobile App Development" },
    { _id: "proj3", name: "E-commerce Platform" },
    { _id: "proj4", name: "CRM System" },
    { _id: "proj5", name: "Analytics Dashboard" },
    { _id: "proj6", name: "API Integration" },
    { _id: "proj7", name: "Security Audit" },
    { _id: "proj8", name: "Cloud Migration" },
    { _id: "proj9", name: "UI/UX Overhaul" },
    { _id: "proj10", name: "Database Optimization" },
  ];

  const accessGroupTotalRecords = accessGroups.length;
  const projectTotalRecords = projects.length;

  const getAccessgroups = () => {
    console.log("Loading more access groups...");
  };

  const getProjects = () => {
    console.log("Loading more projects...");
  };

  const tagsColors: StatusColor[] = [
    "primary",
    "success",
    "info",
    "warning",
    "midnight",
    "dark",
    "neutral",
    "cyan",
    "storm",
    "purple",
    "teal",
    "lime",
    "jade",
    "yellow",
    "slate",
    "lavender",
  ];

  const hashStringToIndex = (str: string, max: number): number => {
    let hash = 0;
    for (let i = 0; i < str?.length; i++) {
      hash = str?.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % max;
  };

  const getTagsColor = (tag: string | { value: string }): StatusColor => {
    const value = typeof tag === "string" ? tag : tag?.value;
    const index = hashStringToIndex(value?.toLowerCase(), tagsColors.length);
    return tagsColors[index];
  };

  const [bulkText, setBulkText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }[]>([]);
  const [loading, setLoading] = useState(false);

  // Add a new user row
  const addUser = () => {
    setUsers([
      ...users,
      { email: "", role: "User", projects: [], accessGroups: [], team: "" },
    ]);
    setErrors([...errors, {}]);
  };

  // Remove a user row
  const removeUser = (index: number) => {
    const newUsers = [...users];
    const newErrors = [...errors];
    newUsers.splice(index, 1);
    newErrors.splice(index, 1);
    setUsers(newUsers);
    setErrors(newErrors);
  };

  // Handle checkbox changes for ability tags
  const handleAbilityTagChange = (tagValue: string, isChecked: boolean) => {
    setFormData((prev: FormData) => {
      if (isChecked) {
        // Add tag if checked and not already present
        return {
          ...prev,
          abilityTags: prev.abilityTags.includes(tagValue)
            ? prev.abilityTags
            : [...prev.abilityTags, tagValue],
        };
      } else {
        // Remove tag if unchecked
        return {
          ...prev,
          abilityTags: prev.abilityTags.filter((tag) => tag !== tagValue),
        };
      }
    });
  };

  // Check if a specific ability tag is selected
  const isAbilityTagSelected = (tagValue: string): boolean => {
    return formData.abilityTags.includes(tagValue);
  };

  const handleCheckbox = (
    options: any[],
    selectAll: boolean,
    selected: any[],
    props: any,
    isChecked: boolean,
    field: keyof FormData
  ) => {
    let selectedValues: string[];

    if (selectAll) {
      selectedValues = isChecked ? options.map((opt) => opt.value) : [];
    } else {
      const alreadySelected = selected.some((sel) => sel.value === props.value);

      if (field === "projects" && !alreadySelected && selected.length >= 2) {
        // Show error toast when trying to select more than 2 projects
        showToast("error", "", "Maximum 2 projects can be selected");
        return; // Don't update the state
      }

      selectedValues = alreadySelected
        ? selected.filter((s) => s.value !== props.value).map((s) => s.value)
        : [...selected.map((s) => s.value), props.value];
    }

    setFormData((prev: FormData) => ({
      ...prev,
      [field]: selectedValues,
    }));
  };

  // Updated handleCheckbox for individual user rows
  const handleUserCheckbox = (
    options: any[],
    selectAll: boolean,
    selected: any[],
    props: any,
    isChecked: boolean,
    field: keyof User,
    userIndex: number
  ) => {
    let selectedValues: string[];

    if (selectAll) {
      selectedValues = isChecked ? options.map((opt) => opt.value) : [];
    } else {
      const alreadySelected = selected.some((sel) => sel.value === props.value);

      if (field === "projects" && !alreadySelected && selected.length >= 2) {
        // Show error toast when trying to select more than 2 projects
        showToast("error", "", "Maximum 2 projects can be selected");
        return; // Don't update the state
      }

      selectedValues = alreadySelected
        ? selected.filter((s) => s.value !== props.value).map((s) => s.value)
        : [...selected.map((s) => s.value), props.value];
    }

    updateUser(userIndex, field, selectedValues);
  };

  const updateUser = (index: number, field: keyof User, value: any) => {
    const newUsers = [...users];
    newUsers[index][field] = value;

    const emailValue = newUsers[index].email?.trim().toLowerCase();

    const newErrors = [...errors];

    if (emailValue) {
      const isDuplicate = newUsers.some(
        (u, i) => i !== index && u.email?.trim().toLowerCase() === emailValue
      );

      newErrors[index] = {
        ...newErrors[index],
        email: isDuplicate
          ? "This email is already added. Please use a different email."
          : undefined,
      };
    } else {
      newErrors[index] = {
        ...newErrors[index],
        email: undefined,
      };
    }

    setUsers(newUsers);
    setErrors(newErrors);
  };

  // Process bulk input
  const processBulkEmails = () => {
    const emails = bulkText
      .split(/[\n,;]/)
      .map((email) => email.trim().toLowerCase())
      .filter((email) => email !== "" && email.includes("@"));

    // Remove duplicates within the new bulk list
    const uniqueNewEmails = Array.from(new Set(emails));

    setUsers((prev: any) => {
      const existingEmails = new Set(
        prev.map((user: any) => user.email.toLowerCase())
      );

      // Filter out emails that already exist in current users
      const filteredNewUsers = uniqueNewEmails
        .filter((email) => !existingEmails.has(email))
        .map((email) => ({
          email,
          role: "User",
          departments: [],
          accessGroups: [],
          projects: [],
        }));

      if (prev.length === 1 && prev[0].email.length === 0) {
        return filteredNewUsers;
      }
      return [...prev, ...filteredNewUsers];
    });

    setBulkText("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Validate emails
    const newErrors = users.map((user) => ({
      email:
        !user.email || !user.email.includes("@")
          ? "Please enter a valid email address"
          : undefined,
    }));

    setErrors(newErrors);

    const hasErrors = newErrors.some((error) => error.email);
    if (hasErrors) {
      setSubmitting(false);
      return;
    }

    // Validate projects limit for each user
    const projectErrors = users
      .map((user, index) => {
        if (user.projects && user.projects.length > 2) {
          return `User ${index + 1} has more than 2 projects selected`;
        }
        return null;
      })
      .filter((error) => error !== null);

    if (projectErrors.length > 0) {
      showToast("error", "", projectErrors[0]);
      setSubmitting(false);
      return;
    }

    // Submit logic here
    try {
      setLoading(true);
      // Your API call would go here
      console.log("Submitting:", { formData, users });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      handleClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileType = file.name.split(".").pop()?.toLowerCase();

    let textContent = "";

    try {
      if (fileType === "txt") {
        textContent = await file.text();
      } else if (fileType === "docx") {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        textContent = result.value;
      } else {
        showToast(
          "error",
          "",
          "Unsupported file type. Only .txt and .docx files are allowed."
        );
        return;
      }

      const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
      const emails = textContent.match(emailRegex);

      if (emails && emails.length > 0) {
        const uniqueEmails = Array.from(
          new Set(emails.map((e) => e.toLowerCase()))
        );

        setUsers((prev: User[]) => {
          const existing = new Set(prev.map((u) => u.email.toLowerCase()));
          const newUsers = uniqueEmails
            .filter((e) => !existing.has(e))
            .map((email) => ({
              email,
              role: "User",
              projects: [],
              team: "",
              accessGroups: [],
            }));

          if (prev.length === 1 && !prev[0].email) {
            return newUsers;
          }
          return [...prev, ...newUsers];
        });
        showToast(
          "success",
          "",
          `${uniqueEmails.length} email(s) added from file.`
        );
      } else {
        showToast("error", "", "No valid email addresses found in the file.");
      }
    } catch (error) {
      console.error("Error processing file:", error);
      showToast("error", "", "Error processing file.");
    }
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleClose = () => {
    if (!submitting) {
      setModalType?.("");
      setSelectedUserList(null);
      setFormData({
        role: "",
        projects: [],
        status: "",
        accessGroups: [],
        abilityTags: [],
        team: "",
        email: "",
        phone: "",
      });
      setUsers([
        {
          email: "",
          role: "User",
          projects: [],
          accessGroups: [],
          team: "",
        },
      ]);
      setActiveTab("Overview");
      setBulkText("");
      setSubmitting(false);
      setErrors([]);
      closeModal();
    }
  };

  const getModalTitle = () => {
    switch (modalType) {
      case "add":
        return "Add New User";
      case "edit":
        return "Update User";
      case "delete":
        return "Delete User";
      case "read":
        return "View User";
      default:
        return "";
    }
  };

  const getModalDescription = () => {
    switch (modalType) {
      case "add":
        return "Add a new user to the system";
      case "edit":
        return "Edit and manage user information with ease.";
      case "delete":
        return `This action cannot be undone. It will permanently remove this user.`;
      case "view":
        return "Review the user's profile and details without making changes.";
      default:
        return "";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      openFromRight={modalType === "read"}
      className={`
    ${
      modalType === "delete"
        ? "max-w-[600px]"
        : modalType === "add"
        ? "max-w-[1300px]"
        : modalType === "read"
        ? "max-w-[900px] h-full m-0"
        : "max-w-[900px]"
    }
    lg:p-4 p-3 py-4
  `}
    >
      <div className="lg:px-4 px-2">
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          {getModalTitle()}
        </h4>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
          {getModalDescription()}
        </p>
      </div>

      {modalType === "read" && (
        <div className="w-full space-y-6">
          <div className="w-fit">
            <Tabs
              tabGroups={tabGroups}
              selectedTabGroup={activeTab}
              onClick={handleTabClick}
            />
          </div>
          {activeTab === "Overview" ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                <div>
                  <Label>Name</Label>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p>
                      {selectedUserList?.firstName || "John"}{" "}
                      {selectedUserList?.lastName || "Doe"}
                    </p>
                  </div>
                </div>
                <div>
                  <Label>Email</Label>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p>{selectedUserList?.email || "john.doe@example.com"}</p>
                  </div>
                </div>
                <div>
                  <Label>Team</Label>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p>
                      {typeof selectedUserList?.team === "string"
                        ? selectedUserList?.team
                        : selectedUserList?.team?.name || "Team Alpha"}
                    </p>
                  </div>
                </div>
                <div>
                  <Label>Team Role</Label>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p>{"Agent"}</p>
                  </div>
                </div>
                <div>
                  <Label>Access Groups</Label>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(selectedUserList?.accessGroups)
                        ? selectedUserList?.accessGroups
                        : ["Administrators", "Developers"]
                      ).map((group: any, index: number) => {
                        const groupName =
                          typeof group === "string"
                            ? group
                            : group?.name || group?.label || group?.value || "";
                        return (
                          <Badge
                            key={index}
                            variant="light"
                            color={getTagsColor(groupName)}
                            className="text-xs"
                          >
                            {groupName}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <Badge
                      className="text-xs"
                      color={
                        selectedUserList?.status === "Active"
                          ? "success"
                          : selectedUserList?.status === "Inactive"
                          ? "error"
                          : selectedUserList?.status === "Pending"
                          ? "warning"
                          : "info"
                      }
                      variant="light"
                    >
                      {selectedUserList?.status || "Active"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label>Ability Tags</Label>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(selectedUserList?.abilityTags)
                        ? selectedUserList?.abilityTags
                        : ["Fresh", "RTC"]
                      ).map((tag: any, index: number) => {
                        const tagName =
                          typeof tag === "string"
                            ? tag
                            : tag?.name || tag?.label || tag?.value || "";
                        return (
                          <Badge
                            key={index}
                            variant="light"
                            color={getTagsColor(tagName)}
                            className="text-xs"
                          >
                            {tagName}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Projects</Label>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(selectedUserList?.projects)
                        ? selectedUserList?.projects
                        : ["Website Redesign", "CRM System"]
                      ).map((project: any, index: number) => {
                        const projectName =
                          typeof project === "string"
                            ? project
                            : project?.name ||
                              project?.label ||
                              project?.value ||
                              "";
                        return (
                          <Badge
                            key={index}
                            variant="light"
                            color={getTagsColor(projectName)}
                            className="text-xs"
                          >
                            {projectName}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
              <div>
                <Label>Phone Number</Label>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <p>{selectedUserList?.phone || "+1 (555) 123-4567"}</p>
                </div>
              </div>
              <div>
                <Label>Date of Birth</Label>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <p>{selectedUserList?.dob || "January 15, 1990"}</p>
                </div>
              </div>
              <div>
                <Label>Address</Label>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <p>
                    {selectedUserList?.address ||
                      "123 Main Street, New York, NY 10001"}
                  </p>
                </div>
              </div>
              <div>
                <Label>Bank Name</Label>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <p>{selectedUserList?.bankName || "Chase Bank"}</p>
                </div>
              </div>
              <div>
                <Label>Account Number</Label>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <p>
                    {selectedUserList?.accountNumber || "**** **** **** 1234"}
                  </p>
                </div>
              </div>
              <div>
                <Label>IFSC Code</Label>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <p>{selectedUserList?.ifscCode || "CHAS0001234"}</p>
                </div>
              </div>
              <div>
                <Label>Emergency Contact</Label>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <p>
                    {selectedUserList?.emergencyContact || "+1 (555) 987-6543"}
                  </p>
                </div>
              </div>
              <div>
                <Label>Blood Group</Label>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <p>{selectedUserList?.bloodGroup || "O+"}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {modalType !== "read" && (
        <>
          <form className="flex flex-col p-2" onSubmit={handleSubmit}>
            {modalType === "delete" ? (
              <div>
                {selectedUserList && (
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-300">
                      {selectedUserList?.name ||
                        selectedUserList.email ||
                        "User"}
                    </p>
                  </div>
                )}
              </div>
            ) : modalType !== "add" ? (
              <>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5">
                  <div className="">
                    <p className="mb-2 font-s text-sm text-gray-800 dark:text-white/90 font-medium">
                      Selected Users:
                    </p>

                    <div className="border rounded-lg overflow-hidden dark:border-gray-700">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableCell
                              isHeader
                              className="w-1/2 text-left px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                            >
                              <span className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                                User Name
                              </span>
                            </TableCell>

                            <TableCell
                              isHeader
                              className="w-1/2 text-left px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                            >
                              <span className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                                Email
                              </span>
                            </TableCell>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="px-4 py-3 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap">
                              {selectedUserList?.firstName || "John"}{" "}
                              {selectedUserList?.lastName || "Doe"}
                            </TableCell>

                            <TableCell className="px-4 py-3 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap">
                              {selectedUserList?.email || "johndoe@example.com"}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-6 gap-y-5">
                    <div>
                      <MyPhoneInput
                        label="Phone"
                        value={formData.phone as string}
                        onChange={(value: string) =>
                          setFormData((prev) => ({ ...prev, phone: value }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Experience Level</Label>
                      <SearchableSelect
                        dataProps={{
                          optionData: experienceLevels?.map((opt) => ({
                            _id: opt.value,
                            name: opt.label,
                          })),
                        }}
                        selectionProps={{
                          selectedValue: {
                            _id: formData?.experience,
                            value: formData?.experience,
                            label: formData?.experience,
                          },
                        }}
                        displayProps={{
                          placeholder: "Select experience...",
                          id: "experience",
                          isClearable: true,
                        }}
                        eventHandlers={{
                          onChange: (option: any) => {
                            setFormData((prev: FormData) => ({
                              ...prev,
                              experience: option?._id || "",
                            }));
                          },
                        }}
                      />
                    </div>
                    <div>
                      <Label>Status</Label>
                      <SearchableSelect
                        dataProps={{
                          optionData: statusOptions?.map((opt) => ({
                            _id: opt.value,
                            name: opt.label,
                          })),
                        }}
                        selectionProps={{
                          selectedValue: {
                            _id: formData?.status,
                            value: formData?.status,
                            label: formData?.status,
                          },
                        }}
                        displayProps={{
                          placeholder: "Select status...",
                          id: "status",
                          isClearable: true,
                        }}
                        eventHandlers={{
                          onChange: (option: any) => {
                            setFormData((prev: FormData) => ({
                              ...prev,
                              status: option?._id || "",
                            }));
                          },
                        }}
                      />
                    </div>
                    <div>
                      <Label>Role</Label>
                      <SearchableSelect
                        dataProps={{
                          optionData: roles?.map((opt) => ({
                            _id: opt.value,
                            name: opt.label,
                          })),
                        }}
                        selectionProps={{
                          selectedValue: {
                            _id: formData?.role,
                            value: formData?.role,
                            label: formData?.role,
                          },
                        }}
                        displayProps={{
                          placeholder: "Select role...",
                          id: "role",
                          isClearable: true,
                        }}
                        eventHandlers={{
                          onChange: (option: any) => {
                            setFormData((prev: FormData) => ({
                              ...prev,
                              role: option?._id || "",
                            }));
                          },
                        }}
                      />
                    </div>
                    <div>
                      <Label>Team</Label>
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
                    <div>
                      <Label>Access Groups</Label>
                      <SearchableSelect
                        dataProps={{
                          optionData: accessGroups?.map((opt) => ({
                            _id: opt._id,
                            name: opt?.name,
                          })),
                          total: accessGroupTotalRecords,
                          loadMoreData: getAccessgroups,
                        }}
                        selectionProps={{
                          showCheckboxes: true,
                          selectedOptions: Array.isArray(formData?.accessGroups)
                            ? formData.accessGroups.map((val: any) => ({
                                value: val,
                                label:
                                  accessGroups.find((opt) => opt._id === val)
                                    ?.name || val,
                              }))
                            : [],
                        }}
                        displayProps={{
                          placeholder: "Search access groups...",
                          id: "accessGroups",
                          layoutProps: {
                            className: `w-full`,
                          },
                          inputProps: {
                            className: "w-full px-3 py-2 text-sm",
                          },
                        }}
                        eventHandlers={{
                          handleCheckbox: (
                            options: any,
                            selectAll: boolean,
                            selected: any[],
                            props: any,
                            isChecked: boolean
                          ) =>
                            handleCheckbox(
                              options,
                              selectAll,
                              selected,
                              props,
                              isChecked,
                              "accessGroups"
                            ),
                        }}
                      />
                    </div>
                    <div className="lg:col-span-2">
                      <Label>Projects</Label>
                      <SearchableSelect
                        dataProps={{
                          optionData: projects?.map((opt) => ({
                            _id: opt._id,
                            name: opt?.name,
                          })),
                          total: projectTotalRecords,
                          loadMoreData: getProjects,
                        }}
                        selectionProps={{
                          showCheckboxes: true,
                          selectedOptions: Array.isArray(formData?.projects)
                            ? formData.projects.map((val: any) => ({
                                value: val,
                                label:
                                  projects.find((opt) => opt._id === val)
                                    ?.name || val,
                              }))
                            : [],
                        }}
                        displayProps={{
                          placeholder: "Search projects...",
                          id: "projects",
                          layoutProps: {
                            className: `w-full`,
                          },
                          inputProps: {
                            className: "w-full px-3 py-2 text-sm",
                          },
                        }}
                        eventHandlers={{
                          handleCheckbox: (
                            options: any,
                            selectAll: boolean,
                            selected: any[],
                            props: any,
                            isChecked: boolean
                          ) =>
                            handleCheckbox(
                              options,
                              selectAll,
                              selected,
                              props,
                              isChecked,
                              "projects"
                            ),
                        }}
                      />
                    </div>
                    <div className="lg:col-span-2">
                      <Label>Ability Tags</Label>
                      <div className="flex flex-wrap gap-4 mt-2">
                        {abilityTags.map((tag) => (
                          <Checkbox
                            key={tag.value}
                            label={tag.label}
                            checked={isAbilityTagSelected(tag.value)}
                            onChange={(checked: boolean) =>
                              handleAbilityTagChange(tag.value, checked)
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 gap-x-0 md:gap-x-6 gap-y-5">
                <div className="p-1 md:p-6 border-b border-gray-200 dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-2">
                    Add Multiple by uploading .txt or docx file
                  </h3>
                  <div>
                    <FileUploader onChange={handleFileChange} />
                  </div>
                </div>
                <div className="p-1 md:p-6 border-b border-gray-200 dark:border-gray-600">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                      Add Multiple Email Addresses
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-40 mb-2">
                    Enter email addresses separated by commas, semicolons, or
                    line breaks
                  </p>
                  <TextArea
                    value={bulkText}
                    onChange={(value: string) => setBulkText(value)}
                    placeholder="john@example.com, sarah@example.com, michael@example.com"
                  />
                  <div className="flex justify-end mt-1">
                    <Button
                      onClick={processBulkEmails}
                      className="flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
                      disabled={!bulkText.trim() || submitting}
                    >
                      Add Emails
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={addUser}
                  disabled={submitting}
                  className="w-max ml-auto flex justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 mb-4"
                >
                  <Plus className="h-4 w-4 inline" />
                  Add Row
                </Button>

                {users.length > 0 && (
                  <div className="border rounded-lg overflow-hidden dark:border-gray-700">
                    <div className="overflow-auto max-h-96 custom-scrollbar">
                      <Table>
                        <TableHeader>
                          <TableRow className="sticky -top-0.5 bg-gray-50 dark:bg-gray-700 z-[50]">
                            <TableCell
                              isHeader
                              className="text-left px-4 py-3 border-gray-100 dark:border-white/[0.05] border"
                            >
                              <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-300">
                                Email Address
                              </p>
                            </TableCell>
                            <TableCell
                              isHeader
                              className="px-4 py-3 border w-[30%] border-gray-100 dark:border-white/[0.05]"
                            >
                              <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-300">
                                Access Group
                              </p>
                            </TableCell>
                            <TableCell
                              isHeader
                              className="px-4 py-3 border w-[30%] border-gray-100 dark:border-white/[0.05]"
                            >
                              <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-300">
                                Project
                              </p>
                            </TableCell>
                            <TableCell
                              isHeader
                              className="px-4 py-3 border w-[30%] border-gray-100 dark:border-white/[0.05]"
                            >
                              <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-300">
                                Team
                              </p>
                            </TableCell>
                            <TableCell
                              isHeader
                              className="px-4 py-3 border w-[30%] border-gray-100 dark:border-white/[0.05]"
                            >
                              <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-300">
                                Team Role
                              </p>
                            </TableCell>

                            <TableCell
                              isHeader
                              className="text-center px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                            >
                              <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-300">
                                Actions
                              </p>
                            </TableCell>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.map((user, index) => (
                            <TableRow key={index}>
                              <TableCell className="px-4 py-4 font-normal border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap min-w-[200px]">
                                <Input
                                  type="email"
                                  value={user.email}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) =>
                                    updateUser(index, "email", e.target.value)
                                  }
                                  placeholder="email@example.com"
                                  error={errors[index]?.email ? true : false}
                                  hint={errors[index]?.email}
                                  className="w-full bg-transparent border-gray-300 dark:border-gray-600 focus:border-brand-500 dark:focus:border-brand-500"
                                />
                              </TableCell>

                              <TableCell className="px-4 py-4 font-normal border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap min-w-[200px]">
                                <SearchableSelect
                                  dataProps={{
                                    optionData: accessGroups?.map((opt) => ({
                                      _id: opt._id,
                                      name: opt?.name,
                                    })),
                                    total: accessGroupTotalRecords,
                                    loadMoreData: getAccessgroups,
                                  }}
                                  selectionProps={{
                                    showCheckboxes: true,
                                    selectedOptions: Array.isArray(
                                      user?.accessGroups
                                    )
                                      ? user.accessGroups.map((val: any) => ({
                                          value: val,
                                          label:
                                            accessGroups.find(
                                              (opt) => opt._id === val
                                            )?.name || val,
                                        }))
                                      : [],
                                  }}
                                  displayProps={{
                                    placeholder: "Search access groups...",
                                    id: "accessGroups",
                                    layoutProps: {
                                      className: `w-full`,
                                    },
                                    inputProps: {
                                      className: "w-full px-3 py-2 text-sm",
                                    },
                                  }}
                                  eventHandlers={{
                                    handleCheckbox: (
                                      options: any,
                                      selectAll: boolean,
                                      selected: any[],
                                      props: any,
                                      isChecked: boolean
                                    ) =>
                                      handleUserCheckbox(
                                        options,
                                        selectAll,
                                        selected,
                                        props,
                                        isChecked,
                                        "accessGroups",
                                        index
                                      ),
                                  }}
                                />
                              </TableCell>
                              <TableCell className="px-4 py-4 font-normal border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap min-w-[200px]">
                                <SearchableSelect
                                  dataProps={{
                                    optionData: projects?.map((opt) => ({
                                      _id: opt._id,
                                      name: opt?.name,
                                    })),
                                    total: projectTotalRecords,
                                    loadMoreData: getProjects,
                                  }}
                                  selectionProps={{
                                    showCheckboxes: true,
                                    selectedOptions: Array.isArray(
                                      user?.projects
                                    )
                                      ? user.projects.map((val: any) => ({
                                          value: val,
                                          label:
                                            projects.find(
                                              (opt) => opt._id === val
                                            )?.name || val,
                                        }))
                                      : [],
                                  }}
                                  displayProps={{
                                    placeholder: "Search projects...",
                                    id: "projects",
                                    layoutProps: {
                                      className: `w-full`,
                                    },
                                    inputProps: {
                                      className: "w-full px-3 py-2 text-sm",
                                    },
                                  }}
                                  eventHandlers={{
                                    handleCheckbox: (
                                      options: any,
                                      selectAll: boolean,
                                      selected: any[],
                                      props: any,
                                      isChecked: boolean
                                    ) =>
                                      handleUserCheckbox(
                                        options,
                                        selectAll,
                                        selected,
                                        props,
                                        isChecked,
                                        "projects",
                                        index
                                      ),
                                  }}
                                />
                              </TableCell>
                              <TableCell className="px-4 py-4 font-normal border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap min-w-[200px]">
                                <SearchableSelect
                                  dataProps={{
                                    optionData: teams?.map((opt) => ({
                                      _id: opt.value,
                                      name: opt.label,
                                    })),
                                  }}
                                  selectionProps={{
                                    selectedValue: user?.team,
                                  }}
                                  displayProps={{
                                    placeholder: "Select team...",
                                    id: "team",
                                    isClearable: true,
                                  }}
                                  eventHandlers={{
                                    onChange: (option: any) => {
                                      updateUser(index, "team", option?._id);
                                    },
                                  }}
                                />
                              </TableCell>
                              <TableCell className="px-4 py-4 font-normal border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap min-w-[200px]">
                                <SearchableSelect
                                  dataProps={{
                                    optionData: roles?.map((opt) => ({
                                      _id: opt.value,
                                      name: opt.label,
                                    })),
                                  }}
                                  selectionProps={{
                                    selectedValue: user?.role,
                                  }}
                                  displayProps={{
                                    placeholder: "Select role...",
                                    id: "role",
                                    isClearable: true,
                                  }}
                                  eventHandlers={{
                                    onChange: (option: any) => {
                                      updateUser(index, "role", option?._id);
                                    },
                                  }}
                                />
                              </TableCell>
                              <TableCell className="text-center px-4 py-4 font-normal border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap">
                                <Tooltip content="Delete" position="left">
                                  <button
                                    type="button"
                                    onClick={() => removeUser(index)}
                                    className={`p-2 text-gray-500 hover:text-error-500`}
                                  >
                                    <TrashBinIcon />
                                  </button>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {users.length === 0 && (
                  <div className="text-center py-10 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    {`No users added. Click "Add Row" or "Bulk Add" to invite team
                members.`}
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
                    modalType === "delete"
                      ? "Delete"
                      : modalType === "edit"
                      ? "Update"
                      : "Add"
                  } User`
                )}
              </Button>
            </div>
          </form>
        </>
      )}
    </Modal>
  );
}

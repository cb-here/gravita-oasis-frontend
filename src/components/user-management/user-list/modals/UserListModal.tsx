"use client";
import React, { useState } from "react";
import Button from "@/components/ui/button/Button";
import mammoth from "mammoth";
import SearchableSelect from "@/components/form/SearchableSelect";
import TextArea from "@/components/form/input/TextArea";
import FileUploader from "@/components/form/input/FileUploader";
import { Modal } from "@/components/ui/modal";
import Loading from "@/components/Loading";
import Input from "@/components/form/input/InputField";
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

interface User {
  email: string;
  userRole: string;
  project: string;
  team: string;
  subRole: string;
  accessGroup: string;
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
  const [users, setUsers] = useState<User[]>([
    {
      email: "",
      userRole: "user",
      accessGroup: "",
      team: "",
      project: "",
      subRole: "",
    },
  ]);

  const userRoles: Option[] = [
    { value: "user", label: "User" },
    { value: "admin", label: "Admin" },
  ];

  const subRoles: Option[] = [
    { value: "Agent", label: "Agent" },
    { value: "Manager", label: "Manager" },
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

  const [bulkText, setBulkText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }[]>([]);
  const [loading, setLoading] = useState(false);

  // Add a new user row
  const addUser = () => {
    setUsers([
      ...users,
      {
        email: "",
        userRole: "user",
        project: "",
        accessGroup: "",
        team: "",
        subRole: "",
      },
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

  const processBulkEmails = () => {
    const emails = bulkText
      .split(/[\n,;]/)
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e.includes("@"));

    const uniqueEmails = Array.from(new Set(emails));

    setUsers((prev) => {
      const existing = new Set(prev.map((u) => u.email.toLowerCase()));
      const newUsers = uniqueEmails
        .filter((e) => !existing.has(e))
        .map((email) => ({
          email,
          userRole: "user",
          project: "",
          team: "",
          subRole: "",
          accessGroup: "",
        }));

      if (prev.length === 1 && !prev[0].email) return newUsers;
      return [...prev, ...newUsers];
    });

    setBulkText("");
    showToast(
      "success",
      "",
      `${uniqueEmails.length} email(s) added from input.`
    );
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

    try {
      setLoading(true);

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
      // Read file as text
      if (fileType === "txt") {
        textContent = await file.text();
      } else if (fileType === "docx") {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        textContent = result.value;
      } else {
        showToast("error", "", "Only .txt and .docx files are allowed.");
        return;
      }

      // Extract emails using regex
      const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
      const foundEmails = textContent.match(emailRegex) || [];

      // Normalize & deduplicate
      const uniqueEmails = Array.from(
        new Set(foundEmails.map((e) => e.trim().toLowerCase()))
      ).filter((e) => e.includes("@"));

      if (uniqueEmails.length === 0) {
        showToast("error", "", "No valid email addresses found in the file.");
        return;
      }

      setUsers((prev) => {
        const existingEmails = new Set(prev.map((u) => u.email.toLowerCase()));
        const newUsers = uniqueEmails
          .filter((email) => !existingEmails.has(email))
          .map((email) => ({
            email,
            userRole: "user",
            project: "",
            team: "",
            subRole: "",
            accessGroup: "",
          }));

        if (prev.length === 1 && !prev[0].email) {
          return newUsers;
        }

        return [...prev, ...newUsers];
      });

      showToast(
        "success",
        "",
        `${
          uniqueEmails.length
        } email(s) added from ${fileType.toUpperCase()} file.`
      );
    } catch (error) {
      console.error("Error reading file:", error);
      showToast("error", "", "Failed to read file. Please try again.");
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setModalType?.("");
      setSelectedUserList(null);
      setUsers([
        {
          email: "",
          userRole: "User",
          project: "",
          accessGroup: "",
          team: "",
          subRole: "",
        },
      ]);
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
        ? "max-w-[1400px]"
        : modalType === "read"
        ? "max-w-[900px] h-full m-0"
        : "max-w-[900px]"
    }
    lg:p-4 p-3 py-4 m-4
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

      <>
        <form className="flex flex-col p-2" onSubmit={handleSubmit}>
          {modalType === "delete" ? (
            <div>
              {selectedUserList && (
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-300">
                    {selectedUserList?.name || selectedUserList.email || "User"}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-0 md:gap-x-6 gap-y-5">
              <div className="p-1 md:p-6 border-b border-gray-200 dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-2">
                  Add Multiple by uploading .txt or .docx
                </h3>
                <div>
                  <FileUploader
                    onChange={handleFileChange}
                    accept=".txt,.docx"
                  />
                </div>
              </div>
              <div className="p-1 md:p-6 border-b border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                    Add Multiple Email Addresses
                  </h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-40 mb-2">
                  Enter email addresses separated by commas, semicolons, or line
                  breaks
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
                              Role
                            </p>
                          </TableCell>
                          {users.some((u) => u.userRole === "admin") && (
                            <TableCell
                              isHeader
                              className="px-4 py-3 border w-[30%] border-gray-100 dark:border-white/[0.05]"
                            >
                              <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-300">
                                Access Group
                              </p>
                            </TableCell>
                          )}
                          {/* Conditionally show Project, Team, SubRole if ANY user is 'user' */}
                          {users.some((u) => u.userRole === "user") && (
                            <>
                              <TableCell
                                isHeader
                                className="px-4 py-3 border w-[30%] border-gray-100 dark:border-white/[0.05]"
                              >
                                <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-300">
                                  Sub Role
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
                                  Project
                                </p>
                              </TableCell>
                            </>
                          )}
                          {/* Action - Always visible */}
                          <TableCell
                            isHeader
                            className="text-center px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                          >
                            <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-300">
                              Action
                            </p>
                          </TableCell>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {users.map((user, index) => {
                          const isAdmin = user.userRole === "admin";
                          const isUser = user.userRole === "user";

                          return (
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
                                    optionData: userRoles.map((opt) => ({
                                      _id: opt.value,
                                      name: opt.label,
                                    })),
                                  }}
                                  selectionProps={{
                                    selectedValue: user?.userRole,
                                  }}
                                  displayProps={{
                                    placeholder: "Select role...",
                                    id: "userRole",
                                  }}
                                  eventHandlers={{
                                    onChange: (option: any) => {
                                      updateUser(
                                        index,
                                        "userRole",
                                        option?._id
                                      );
                                    },
                                  }}
                                />
                              </TableCell>

                              {users.some((u) => u.userRole === "admin") && (
                                <TableCell className="px-4 py-4 font-normal border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap min-w-[200px]">
                                  {isAdmin ? (
                                    <SearchableSelect
                                      dataProps={{
                                        optionData: accessGroups.map((opt) => ({
                                          _id: opt._id,
                                          name: opt.name,
                                        })),
                                      }}
                                      selectionProps={{
                                        selectedValue: user?.accessGroup,
                                      }}
                                      displayProps={{
                                        placeholder: "Select accessGroup...",
                                        id: "accessGroup",
                                        isClearable: true,
                                      }}
                                      eventHandlers={{
                                        onChange: (option: any) => {
                                          updateUser(
                                            index,
                                            "accessGroup",
                                            option?._id
                                          );
                                        },
                                      }}
                                    />
                                  ) : (
                                    <span className="text-gray-400 text-center flex justify-center items-center">
                                      —
                                    </span>
                                  )}
                                </TableCell>
                              )}

                              {/* Project, Team, SubRole - Show only for 'user' */}
                              {users.some((u) => u.userRole === "user") && (
                                <>
                                 <TableCell className="px-4 py-4 font-normal border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap min-w-[200px]">
                                    {isUser ? (
                                      <SearchableSelect
                                        dataProps={{
                                          optionData: subRoles.map((opt) => ({
                                            _id: opt.value,
                                            name: opt.label,
                                          })),
                                        }}
                                        selectionProps={{
                                          selectedValue: user?.subRole,
                                        }}
                                        displayProps={{
                                          placeholder: "Select sub role...",
                                          id: "subRole",
                                          isClearable: true,
                                        }}
                                        eventHandlers={{
                                          onChange: (option: any) => {
                                            updateUser(
                                              index,
                                              "subRole",
                                              option?._id
                                            );
                                          },
                                        }}
                                      />
                                    ) : (
                                      <span className="text-gray-400 flex justify-center items-center">
                                        —
                                      </span>
                                    )}
                                  </TableCell>

                                  <TableCell className="px-4 py-4 font-normal border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap min-w-[200px]">
                                    {isUser ? (
                                      <SearchableSelect
                                        dataProps={{
                                          optionData: teams.map((opt) => ({
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
                                            updateUser(
                                              index,
                                              "team",
                                              option?._id
                                            );
                                          },
                                        }}
                                      />
                                    ) : (
                                      <span className="text-gray-400 flex justify-center items-center">
                                        —
                                      </span>
                                    )}
                                  </TableCell>

                                  
                                   <TableCell className="px-4 py-4 font-normal border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap min-w-[200px]">
                                    {isUser ? (
                                      <SearchableSelect
                                        dataProps={{
                                          optionData: projects.map((opt) => ({
                                            _id: opt._id,
                                            name: opt.name,
                                          })),
                                        }}
                                        selectionProps={{
                                          selectedValue: user?.project,
                                        }}
                                        displayProps={{
                                          placeholder: "Select project...",
                                          id: "project",
                                          isClearable: true,
                                        }}
                                        eventHandlers={{
                                          onChange: (option: any) => {
                                            updateUser(
                                              index,
                                              "project",
                                              option?._id
                                            );
                                          },
                                        }}
                                      />
                                    ) : (
                                      <span className="text-gray-400 flex justify-center items-center">
                                        —
                                      </span>
                                    )}
                                  </TableCell>
                                </>
                              )}

                              {/* Action - Always visible */}
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
                          );
                        })}
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
    </Modal>
  );
}

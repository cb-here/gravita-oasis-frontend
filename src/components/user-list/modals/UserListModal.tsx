"use client";
import React, { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/button/Button";
import mammoth from "mammoth";
import SearchableSelect from "@/components/form/SearchableSelect";
import TextArea from "@/components/form/input/TextArea";
import FileUploader from "@/components/form/input/FileUploader";
import { Modal } from "@/components/ui/modal";
import Loading from "@/components/Loading";

// Define proper TypeScript interfaces
interface User {
  email: string;
  role: string;
  departments: string[];
  accessGroups: string[];
}

interface FormData {
  role: string;
  department: string[];
  status: string;
  accessGroups: string[];
  experience?: string;
}

interface UserListModalProps {
  isOpen: boolean;
  closeModal: () => void;
  modalType?: string;
  setModalType?: (type: string) => void;
  selectedUserList: User | null;
  setSelectedUserList: (user: User | null) => void;
}

interface Option {
  value: string;
  label: string;
}

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
    department: [],
    status: "",
    accessGroups: [],
  });

  const [users, setUsers] = useState<User[]>([
    { email: "", role: "User", departments: [], accessGroups: [] },
  ]);

  const roles: Option[] = [
    { value: "Agent", label: "Agent" },
    { value: "Manager", label: "Manager" },
  ];

  const experienceLevels: Option[] = [
    { value: "Junior", label: "Junior" },
    { value: "Mid", label: "Mid" },
    { value: "Senior", label: "Senior" },
  ];

  const statusOptions: Option[] = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
    { value: "Suspended", label: "Suspended" },
  ];

  const [bulkText, setBulkText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }[]>([]);
  const [loading, setLoading] = useState(false);

  // Add a new user row
  const addUser = () => {
    setUsers([
      ...users,
      { email: "", role: "User", departments: [], accessGroups: [] },
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
      selectedValues = alreadySelected
        ? selected.filter((s) => s.value !== props.value).map((s) => s.value)
        : [...selected.map((s) => s.value), props.value];
    }

    setFormData((prev: FormData) => ({
      ...prev,
      [field]: selectedValues,
    }));
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

    setUsers((prev) => {
      const existingEmails = new Set(
        prev.map((user) => user.email.toLowerCase())
      );

      // Filter out emails that already exist in current users
      const filteredNewUsers = uniqueNewEmails
        .filter((email) => !existingEmails.has(email))
        .map((email) => ({
          email,
          role: "User",
          departments: [],
          accessGroups: [],
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
        // showToast("error", "", "Unsupported file type. Only .txt and .docx files are allowed.");
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
              departments: [],
              accessGroups: [],
            }));

          if (prev.length === 1 && !prev[0].email) {
            return newUsers;
          }
          return [...prev, ...newUsers];
        });
        // showToast("success", "", `${uniqueEmails.length} email(s) added from file.`);
      } else {
        // showToast("error", "", "No valid email addresses found in the file.");
      }
    } catch (error) {
      console.error("Error processing file:", error);
      // showToast("error", "", "Error processing file.");
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setModalType?.("");
      setSelectedUserList(null);
      setFormData({
        role: "",
        department: [],
        status: "",
        accessGroups: [],
      });
      setUsers([
        { email: "", role: "User", departments: [], accessGroups: [] },
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
      default:
        return "";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className={`${
        modalType === "delete"
          ? "max-w-[600px]"
          : modalType === "add"
          ? "max-w-[600px]"
          : "max-w-[1000px]"
      } lg:p-4 p-3 py-4 m-4`}
    >
      <div className="lg:px-4 px-2">
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          {getModalTitle()}
        </h4>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
          {getModalDescription()}
        </p>
      </div>
      <form className="flex flex-col p-2" onSubmit={handleSubmit}>
        {modalType === "delete" ? (
          <div>
            {selectedUserList && (
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-300">
                  {selectedUserList.email || "User"}
                </p>
              </div>
            )}
          </div>
        ) : modalType === "add" ? (
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
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
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
                  type="button"
                >
                  Add Emails
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Edit mode
          <div className="grid grid-cols-1 gap-x-6 gap-y-5">
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
    </Modal>
  );
}

"use client";

import Tabs from "@/components/common/tabs/Tabs";
import Label from "@/components/form/Label";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import MyPhoneInput from "@/components/form/input/PhoneInput";
import Checkbox from "@/components/form/input/Checkbox";
import DatePicker from "@/components/form/date-picker";
import SearchableSelect from "@/components/form/SearchableSelect";
import React, { useState } from "react";
import { getTagsColor } from "../MainComponent";
import Documents from "./tabs/Documents";
import { PencilIcon } from "@/icons";
import { showToast } from "@/lib/toast";

const userData = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  team: "Team Alpha",
  teamRole: "Agent",
  accessGroups: ["Administrators", "Developers"],
  status: "Active",
  abilityTags: ["fresh", "rtc"],
  projects: ["Website Redesign", "CRM System"],
  phone: "+1 (555) 123-4567",
  dob: "January 15, 1990",
  address: "123 Main Street, New York, NY 10001",
  bankName: "Chase Bank",
  accountNumber: "**** **** **** 1234",
  ifscCode: "CHAS0001234",
  emergencyContact: "+1 (555) 987-6543",
  bloodGroup: "O+"
};

const abilityTagOptions = [
  { value: "fresh", label: "Fresh" },
  { value: "rtc", label: "RTC" },
];

const teamOptions = [
  { value: "Alpha", label: "Team Alpha" },
  { value: "Beta", label: "Team Beta" },
  { value: "Gamma", label: "Team Gamma" },
];

const roleOptions = [
  { value: "Agent", label: "Agent" },
  { value: "Manager", label: "Manager" },
];

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
  { value: "Pending", label: "Pending" },
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

export default function MainComponent() {
  const [activeTab, setActiveTab] = useState<string>("Overview");
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [formData, setFormData] = useState(userData);

  const tabGroups = [
    { name: "Overview", key: "Overview" },
    { name: "Documents", key: "Documents" },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAbilityTagChange = (tagValue: string, isChecked: boolean) => {
    setFormData((prev) => {
      if (isChecked) {
        return {
          ...prev,
          abilityTags: prev.abilityTags.includes(tagValue)
            ? prev.abilityTags
            : [...prev.abilityTags, tagValue],
        };
      } else {
        return {
          ...prev,
          abilityTags: prev.abilityTags.filter((tag) => tag !== tagValue),
        };
      }
    });
  };

  const isAbilityTagSelected = (tagValue: string): boolean => {
    return formData.abilityTags.includes(tagValue);
  };

  const handleCheckbox = (
    options: any[],
    selectAll: boolean,
    selected: any[],
    props: any,
    isChecked: boolean,
    field: "accessGroups" | "projects"
  ) => {
    let selectedValues: string[];

    if (selectAll) {
      selectedValues = isChecked ? options.map((opt) => opt._id || opt.value) : [];
    } else {
      const alreadySelected = selected.some((sel) => sel.value === props._id);

      if (field === "projects" && !alreadySelected && selected.length >= 2) {
        showToast("error", "", "Maximum 2 projects can be selected");
        return;
      }

      selectedValues = alreadySelected
        ? selected.filter((s) => s.value !== props._id).map((s) => s.value)
        : [...selected.map((s) => s.value), props._id];
    }

    setFormData((prev) => ({
      ...prev,
      [field]: selectedValues,
    }));
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleSave = () => {
    // Here you would make an API call to save the data
    console.log("Saving data:", formData);
    showToast("success", "Success", "User details updated successfully");
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setFormData(userData); // Reset to original data
    setIsEditMode(false);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="w-full">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {formData.firstName} {formData.lastName}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {formData.email}
            </p>
          </div>
          {!isEditMode ? (
            <Button
              size="sm"
              variant="outline"
              onClick={handleEdit}
              className="flex items-center gap-2"
            >
              <PencilIcon />
              Edit Details
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>

        {/* Tabs Section */}
        <div className="w-fit">
          <Tabs
            tabGroups={tabGroups}
            selectedTabGroup={activeTab}
            onClick={setActiveTab}
          />
        </div>
        
        {activeTab === "Overview" ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
              <div>
                <Label>First Name</Label>
                {isEditMode ? (
                  <Input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p>{formData?.firstName || "John"}</p>
                  </div>
                )}
              </div>
              <div>
                <Label>Last Name</Label>
                {isEditMode ? (
                  <Input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p>{formData?.lastName || "Doe"}</p>
                  </div>
                )}
              </div>
              <div>
                <Label>Email</Label>
                {isEditMode ? (
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p>{formData?.email || "john.doe@example.com"}</p>
                  </div>
                )}
              </div>
              <div>
                <Label>Team</Label>
                {isEditMode ? (
                  <SearchableSelect
                    dataProps={{
                      optionData: teamOptions?.map((opt) => ({
                        _id: opt.value,
                        name: opt.label,
                      })),
                    }}
                    selectionProps={{
                      selectedValue: formData?.team
                        ? {
                            _id: formData.team,
                            name: teamOptions.find((t) => t.value === formData.team)?.label || formData.team,
                          }
                        : null,
                    }}
                    displayProps={{
                      placeholder: "Select team...",
                      id: "team",
                      isClearable: true,
                      layoutProps: {
                        className: "w-full",
                      },
                    }}
                    eventHandlers={{
                      onChange: (option: any) => {
                        handleInputChange("team", option?._id || "");
                      },
                    }}
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p>
                      {typeof formData?.team === "string"
                        ? formData?.team
                        : formData?.team || "Team Pramod"}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <Label>Team Role</Label>
                {isEditMode ? (
                  <SearchableSelect
                    dataProps={{
                      optionData: roleOptions?.map((opt) => ({
                        _id: opt.value,
                        name: opt.label,
                      })),
                    }}
                    selectionProps={{
                      selectedValue: formData?.teamRole
                        ? {
                            _id: formData.teamRole,
                            name: roleOptions.find((r) => r.value === formData.teamRole)?.label || formData.teamRole,
                          }
                        : null,
                    }}
                    displayProps={{
                      placeholder: "Select role...",
                      id: "teamRole",
                      isClearable: true,
                      layoutProps: {
                        className: "w-full",
                      },
                    }}
                    eventHandlers={{
                      onChange: (option: any) => {
                        handleInputChange("teamRole", option?._id || "");
                      },
                    }}
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p>{formData.teamRole}</p>
                  </div>
                )}
              </div>
              <div>
                <Label>Access Groups</Label>
                {isEditMode ? (
                  <SearchableSelect
                    dataProps={{
                      optionData: accessGroups?.map((opt) => ({
                        _id: opt._id,
                        name: opt.name,
                      })),
                    }}
                    selectionProps={{
                      showCheckboxes: true,
                      selectedOptions: Array.isArray(formData?.accessGroups)
                        ? formData.accessGroups.map((val: any) => ({
                            value: val,
                            label:
                              accessGroups.find((opt) => opt._id === val)?.name ||
                              accessGroups.find((opt) => opt.name === val)?.name ||
                              val,
                          }))
                        : [],
                    }}
                    displayProps={{
                      placeholder: "Search access groups...",
                      id: "accessGroups",
                      layoutProps: {
                        className: "w-full",
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
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(formData?.accessGroups)
                        ? formData?.accessGroups
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
                )}
              </div>
              <div>
                <Label>Status</Label>
                {isEditMode ? (
                  <SearchableSelect
                    dataProps={{
                      optionData: statusOptions?.map((opt) => ({
                        _id: opt.value,
                        name: opt.label,
                      })),
                    }}
                    selectionProps={{
                      selectedValue: formData?.status
                        ? {
                            _id: formData.status,
                            name: statusOptions.find((s) => s.value === formData.status)?.label || formData.status,
                          }
                        : null,
                    }}
                    displayProps={{
                      placeholder: "Select status...",
                      id: "status",
                      isClearable: true,
                      layoutProps: {
                        className: "w-full",
                      },
                    }}
                    eventHandlers={{
                      onChange: (option: any) => {
                        handleInputChange("status", option?._id || "");
                      },
                    }}
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <Badge
                      className="text-xs"
                      color={
                        formData?.status === "Active"
                          ? "success"
                          : formData?.status === "Inactive"
                          ? "error"
                          : formData?.status === "Pending"
                          ? "warning"
                          : "info"
                      }
                      variant="light"
                    >
                      {formData?.status || "Active"}
                    </Badge>
                  </div>
                )}
              </div>
              <div>
                <Label>Ability Tags</Label>
                {isEditMode ? (
                  <div className="flex flex-wrap gap-4 mt-2">
                    {abilityTagOptions.map((tag) => (
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
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(formData?.abilityTags)
                        ? formData?.abilityTags
                        : ["fresh", "rtc"]
                      ).map((tag: any, index: number) => {
                        const tagName =
                          typeof tag === "string"
                            ? tag
                            : tag?.name || tag?.label || tag?.value || "";
                        const tagLabel = abilityTagOptions.find(t => t.value === tagName)?.label || tagName;
                        return (
                          <Badge
                            key={index}
                            variant="light"
                            color={getTagsColor(tagName)}
                            className="text-xs"
                          >
                            {tagLabel}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <Label>Projects</Label>
                {isEditMode ? (
                  <SearchableSelect
                    dataProps={{
                      optionData: projects?.map((opt) => ({
                        _id: opt._id,
                        name: opt.name,
                      })),
                    }}
                    selectionProps={{
                      showCheckboxes: true,
                      selectedOptions: Array.isArray(formData?.projects)
                        ? formData.projects.map((val: any) => ({
                            value: val,
                            label:
                              projects.find((opt) => opt._id === val)?.name ||
                              projects.find((opt) => opt.name === val)?.name ||
                              val,
                          }))
                        : [],
                    }}
                    displayProps={{
                      placeholder: "Search projects...",
                      id: "projects",
                      layoutProps: {
                        className: "w-full",
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
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(formData?.projects)
                        ? formData?.projects
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
                )}
              </div>
              <div>
                <Label>Blood Group</Label>
                {isEditMode ? (
                  <Input
                    type="text"
                    value={formData.bloodGroup}
                    onChange={(e) => handleInputChange("bloodGroup", e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p>{formData?.bloodGroup || "O+"}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
              <div>
                <Label>Phone Number</Label>
                {isEditMode ? (
                  <MyPhoneInput
                    value={formData.phone}
                    onChange={(value: string) => handleInputChange("phone", value)}
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p>{formData?.phone || "+1 (555) 123-4567"}</p>
                  </div>
                )}
              </div>
              <div>
                <Label>Date of Birth</Label>
                {isEditMode ? (
                  <DatePicker
                    id="dob"
                    placeholder="Select date of birth..."
                    onChange={(selectedDates: Date[]) => {
                      if (selectedDates.length > 0) {
                        const formattedDate = selectedDates[0].toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        });
                        handleInputChange("dob", formattedDate);
                      }
                    }}
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p>{formData?.dob || "January 15, 1990"}</p>
                  </div>
                )}
              </div>
              <div>
                <Label>Address</Label>
                {isEditMode ? (
                  <Input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p>
                      {formData?.address ||
                        "123 Main Street, New York, NY 10001"}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <Label>Bank Name</Label>
                {isEditMode ? (
                  <Input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => handleInputChange("bankName", e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p>{formData?.bankName || "Chase Bank"}</p>
                  </div>
                )}
              </div>
              <div>
                <Label>Account Number</Label>
                {isEditMode ? (
                  <Input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p>
                      {formData?.accountNumber || "**** **** **** 1234"}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <Label>IFSC Code</Label>
                {isEditMode ? (
                  <Input
                    type="text"
                    value={formData.ifscCode}
                    onChange={(e) => handleInputChange("ifscCode", e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p>{formData?.ifscCode || "CHAS0001234"}</p>
                  </div>
                )}
              </div>
              <div>
                <Label>Emergency Contact</Label>
                {isEditMode ? (
                  <MyPhoneInput
                    value={formData.emergencyContact}
                    onChange={(value: string) => handleInputChange("emergencyContact", value)}
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p>
                      {formData?.emergencyContact || "+1 (555) 987-6543"}
                    </p>
                  </div>
                )}
              </div>
              
            </div>
          </>
        ) : (
          <Documents />
        )}
      </div>
    </div>
  );
}
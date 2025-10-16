"use client";

import { useRef, useState } from "react";
import Button from "@/components/ui/button/Button";
import AvatarText from "@/components/ui/avatar/AvatarText";
import { InfoIcon, TrashBinIcon } from "@/icons";
import { PlusIcon } from "lucide-react";
import { StatusColor } from "@/type/commonUseType";
import UserListModal from "./modals/UserListModal";
import Badge from "@/components/ui/badge/Badge";
import FilterModal from "@/components/common/filter/FilterModal";
import Search from "@/components/common/Search";
import ExportButton from "@/components/ui/button/ExportButton";
import FilterButton from "@/components/common/filter/FilterButton";
import CommonTable from "@/components/common/CommonTable";
import { Tooltip } from "@/components/ui/tooltip/Tooltip";
import TableFooter from "@/components/common/TableFooter";
import { useModal } from "@/hooks/useModal";
import FilterAndSortPills from "@/components/common/filter/FilterAndSortPills";
import Link from "next/link";

export const tagsColors: StatusColor[] = [
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

export const hashStringToIndex = (str: string, max: number): number => {
  let hash = 0;
  for (let i = 0; i < str?.length; i++) {
    hash = str?.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % max;
};

export const getTagsColor = (tag: string | { value: string }): StatusColor => {
  const value = typeof tag === "string" ? tag : tag?.value;
  const index = hashStringToIndex(value?.toLowerCase(), tagsColors.length);
  return tagsColors[index];
};

export const projectOptions = [
  { label: "Project J", value: "Project J" },
  { label: "Origin", value: "Origin" },
  { label: "Metropolitan", value: "Metropolitan" },
  { label: "Jacksonville", value: "Jacksonville" },
  { label: "Making Memories", value: "Making Memories" },
];

export default function MainComponent() {
  const mainModel = useModal();

  const [userLists, setUserLists] = useState<any>({
    totalRecords: 8,
    UserLists: [
      {
        _id: "u101",
        fullName: "Alice Johnson",
        role: { name: "Frontend Developer" },
        accessGroups: "UI Access",
        project: "Website Redesign",
        team: { name: "UI Team" },
        status: "Active",
        experience: "2 Years",
        tags: ["Fresh", "UI"],
      },
      {
        _id: "u102",
        fullName: "Bob Smith",
        role: { name: "Backend Developer" },
        accessGroups: "API Access",
        project: "Payment Gateway",
        team: { name: "API Team" },
        status: "Inactive",
        experience: "5 Years",
        tags: ["RTC", "NodeJS"],
      },
      {
        _id: "u103",
        fullName: "Charlie Davis",
        role: { name: "Project Manager" },
        accessGroups: "Manager Access",
        project: "ERP Migration",
        team: { name: "Management" },
        status: "Active",
        experience: "8 Years",
        tags: ["Leadership"],
      },
      {
        _id: "u104",
        fullName: "Diana Prince",
        role: { name: "QA Engineer" },
        accessGroups: "Testing Access",
        project: "Mobile App",
        team: { name: "Testing" },
        status: "Pending",
        experience: "3 Years",
        tags: ["Automation", "RTC"],
      },
      {
        _id: "u105",
        fullName: "Ethan Hunt",
        role: { name: "DevOps Engineer" },
        accessGroups: "Infra Access",
        project: "Cloud Migration",
        team: { name: "Infra" },
        status: "Active",
        experience: "6 Years",
        tags: ["Cloud", "RTC"],
      },
      {
        _id: "u106",
        fullName: "Fiona Clark",
        role: { name: "UI/UX Designer" },
        accessGroups: "Design Access",
        project: "Brand Revamp",
        team: { name: "Design" },
        status: "Inactive",
        experience: "4 Years",
        tags: ["Creative", "Fresh"],
      },
      {
        _id: "u107",
        fullName: "George Miller",
        role: { name: "Data Analyst" },
        accessGroups: "Data Access",
        project: "Analytics Dashboard",
        team: { name: "Data Science" },
        status: "Active",
        experience: "1 Year",
        tags: ["Fresh", "SQL"],
      },
      {
        _id: "u108",
        fullName: "Hannah Brown",
        role: { name: "HR Manager" },
        accessGroups: "HR Access",
        project: "Employee Portal",
        team: { name: "Human Resources" },
        status: "Inactive",
        experience: "10 Years",
        tags: ["People", "RTC"],
      },
    ],
  });

  const initParams = {
    search: "",
    page: 1,
    limit: 10,
  };

  const [userListParams, setUserListParams] = useState<any>(initParams);

  const [loading, setLoading] = useState(false);

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const totalPages = Math.ceil(userLists?.totalRecords / userListParams?.limit);
  const startIndex = (userListParams?.page - 1) * userListParams?.limit;
  const endIndex = Math.min(
    startIndex + userListParams?.limit,
    userLists?.totalRecords
  );

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedUserList, setSelectedUserList] = useState<any>(null);
  const [modalType, setModalType] = useState<any>("");
  const [exportLoading, setExportLoading] = useState(false);

  const getUserLists = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sort?: string;
    source?: string;
    stageId?: string;
    companyId?: string;
    opportunityOwnerId?: string;
  }) => {
    setLoading(true);
    try {
      const res = await {
        page: params?.page ?? userListParams?.page,
        limit: params?.limit ?? userListParams?.limit,
        search: params?.search ?? userListParams?.search,
        sortBy: params?.sortBy ?? userListParams.sortBy,
        sort: params?.sort ?? userListParams.sort,
      };
      setUserLists(res);
    } catch (err) {
      console.error("Failed to fetch deals:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    setUserListParams((prev: any) => ({ ...prev, page: page }));
    await getUserLists({ page });
  };

  const handleRowsPerPageChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newRowsPerPage = parseInt(e.target.value, 10);
    setUserListParams((prev: any) => ({
      ...prev,
      page: 1,
      limit: newRowsPerPage,
    }));
    await getUserLists({ page: 1, limit: newRowsPerPage });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserListParams((prev: any) => ({ ...prev, search: value }));
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    setLoading(true);
    searchTimeout.current = setTimeout(async () => {
      await getUserLists({ page: 1, search: value });
      setUserListParams((prev: any) => ({ ...prev, page: 1 }));
      setLoading(false);
    }, 1000);
  };

  const handleFilterChange = async (key: string, value: string) => {
    setUserListParams((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = async (filters: any) => {
    await getUserLists(filters);
    setIsFilterModalOpen(false);
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
    } catch (error: unknown) {
      console.log("🚀 ~ handleExport ~ error:", error);
    } finally {
      setExportLoading(false);
    }
  };

  const headers = [
    {
      label: "Employee ID",
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <span>{row?._id ?? 1}</span>
        </div>
      ),
    },
    {
      label: "Name",
      sortable: true,
      render: (row: any) => {
        const safeFullName =
          typeof row.fullName === "string" ? row.fullName : "Unknown User";
        return (
          <div className="flex items-center gap-2">
            <AvatarText name={safeFullName} />
            <Link
              href={`user-list/${1}`}
              target="_blank"
              className="hover:text-brand-500 hover:underline"
            >
              {safeFullName}
            </Link>
          </div>
        );
      },
    },
    {
      label: "Role",
      sortable: true,
      render: (row: any) => <span>{row.role?.name ?? "No Role"}</span>,
    },
    {
      label: "Access Groups",
      sortable: true,
      render: (row: any) => (
        <span>{row.accessGroups ?? "No AccessGroups"}</span>
      ),
    },
    {
      label: "Project",
      sortable: true,
      render: (row: any) => <span>{row.project ?? "No Project"}</span>,
    },
    {
      key: "team",
      label: "Team",
      sortable: true,
      render: (row: any) => <span>{row.team?.name ?? "No Team"}</span>,
    },
    {
      label: "Status",
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center justify-center">
          <Badge
            className="text-xs"
            color={
              row?.status === "Active"
                ? "success"
                : row?.status === "Inactive"
                ? "error"
                : row?.status === "Pending"
                ? "warning"
                : "info"
            }
            variant="light"
          >
            {row?.status ?? "Unknown"}
          </Badge>
        </div>
      ),
    },
    {
      label: "Tags",
      className: "w-[550px]",
      render: (item: any) => {
        const tags = item?.tags;

        return (
          <div className="flex items-start gap-x-2 max-w-[550px] overflow-x-auto no-scrollbar">
            {tags?.map((item: any) => (
              <Badge
                variant="light"
                color={`${getTagsColor(item?.name || item || "")}`}
                className="text-xs"
                key={item?._id || item?.name || item}
              >
                {item?.name || item || ""}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      label: "Experience",
      sortable: true,
      render: (row: any) => (
        <span>
          {typeof row.experience === "string"
            ? row.experience
            : "No Experience"}
        </span>
      ),
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] lg:p-4 p-2">
      <div className="flex items-center justify-between md:flex-row flex-col gap-2 mb-3">
        <h2 className="text-heading">User Management</h2>
        <Button
          variant="gradient"
          onClick={() => {
            setSelectedUserList(null);
            setModalType("add");
            mainModel.openModal();
          }}
          className="sm:w-auto w-full"
        >
          <PlusIcon className="h-4 w-4" />
          Add New User
        </Button>
      </div>
      <div className="flex flex-col items-center justify-between gap-2 mb-3 md:flex-row w-full">
        <Search
          className="w-full md:w-auto xl:w-[400px]"
          placeholder="Search User List"
          value={userListParams?.search}
          onChange={handleSearch}
        />
        <div className="flex flex-col items-center gap-3 md:flex-row w-full justify-end">
          <FilterModal
            isOpen={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
            title="Filter User Lists"
            description="Filter user lists based on your criteria"
            filters={[
              {
                key: "consentStatus",
                label: "Consent Status",
                options: [
                  { label: "Active", value: "Active" },
                  { label: "Inactive", value: "Inactive" },
                  { label: "Pending", value: "Pending" },
                  { label: "Suspended", value: "Suspended" },
                ],
              },
              {
                key: "gender",
                label: "Gender",
                options: [
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                  { label: "Other", value: "Other" },
                ],
              },
              {
                key: "project",
                label: "Project",
                options: projectOptions,
              },
              {
                key: "team",
                label: "Team",
                options: [
                  { label: "Team 1", value: "Team 1" },
                  { label: "Team 2", value: "Team 2" },
                ],
              },
              {
                key: "tags",
                label: "Tags",
                options: [
                  { label: "Tag 1", value: "Tag 1 " },
                  { label: "Tag 2", value: "Tag 2" },
                ],
                showCheckboxes: true,
              },
            ]}
            filterValues={userListParams}
            onFilterChange={handleFilterChange}
            onApply={handleApplyFilters}
            className="max-w-[700px]"
          />
          <FilterButton
            onClick={() => setIsFilterModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2"
          />
          <ExportButton loading={exportLoading} onClick={handleExport} />
        </div>
      </div>
      <FilterAndSortPills filters={userListParams} onRemoveFilter={() => {}} />
      <CommonTable
        headers={headers}
        data={userLists?.UserLists}
        actions={(item: any) => (
          <div className="flex items-center gap-1">
            <Tooltip content="View" position="left">
              <Link
                href={`user-list/${1}`}
                target="_blank"
                className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
              >
                <InfoIcon />
              </Link>
            </Tooltip>

            <Tooltip content="Delete" position="left">
              <button
                className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500 mt-1"
                onClick={() => {
                  setModalType("delete");
                  setSelectedUserList(item);
                  mainModel.openModal();
                }}
              >
                <TrashBinIcon />
              </button>
            </Tooltip>
          </div>
        )}
        loading={loading}
      />
      <TableFooter
        rowsPerPage={userListParams?.limit}
        handleRowsPerPageChange={handleRowsPerPageChange}
        currentPage={userListParams?.page}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        totalEntries={userLists?.totalRecords}
        startIndex={startIndex}
        endIndex={endIndex}
      />
      <UserListModal
        isOpen={mainModel.isOpen}
        closeModal={mainModel.closeModal}
        modalType={modalType}
        setModalType={setModalType}
        selectedUserList={selectedUserList}
        setSelectedUserList={setSelectedUserList}
      />
    </div>
  );
}

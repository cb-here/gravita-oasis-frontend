"use client";
import CommonTable from "@/components/common/CommonTable";
import FilterButton from "@/components/common/filter/FilterButton";
import FilterModal from "@/components/common/filter/FilterModal";
import Search from "@/components/common/Search";
import TableFooter from "@/components/common/TableFooter";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { Tooltip } from "@/components/ui/tooltip/Tooltip";
import { useModal } from "@/hooks/useModal";
import { PencilIcon, TrashBinIcon } from "@/icons";
import React, { useState, useRef } from "react";
import FilterAndSortPills from "@/components/common/filter/FilterAndSortPills";
import DocumentModal from "../modals/DocumentModal";

export default function Documents() {
  const mainModal = useModal();

  const [documents, setDocuments] = useState<any>({
    totalRecords: 15,
    Documents: [
      {
        _id: "1",
        fileName: "Aadhar Card Front",
        description: "Front side of Aadhar card",
        visible: true,
        updatedBy: "John Doe",
        updatedAt: "2024-01-15T10:30:00Z",
      },
      {
        _id: "2",
        fileName: "Aadhar Card Back",
        description: "Back side of Aadhar card",
        visible: true,
        updatedBy: "John Doe",
        updatedAt: "2024-01-15T10:30:00Z",
      },
      {
        _id: "3",
        fileName: "Voter ID",
        description: "Voter identification card",
        visible: true,
        updatedBy: "Jane Smith",
        updatedAt: "2024-01-14T14:20:00Z",
      },
      {
        _id: "4",
        fileName: "Driving License",
        description: "Driver's license document",
        visible: false,
        updatedBy: "Mike Johnson",
        updatedAt: "2024-01-13T09:15:00Z",
      },
      {
        _id: "5",
        fileName: "Passport",
        description: "International passport",
        visible: true,
        updatedBy: "Sarah Wilson",
        updatedAt: "2024-01-12T16:45:00Z",
      },
      // … (the rest of the 15 items – same pattern)
      {
        _id: "6",
        fileName: "Health Insurance Card",
        description: "Health insurance details",
        visible: true,
        updatedBy: "David Brown",
        updatedAt: "2024-01-11T11:20:00Z",
      },
      {
        _id: "7",
        fileName: "Medical History Form",
        description: "Patient medical history",
        visible: false,
        updatedBy: "Emily Davis",
        updatedAt: "2024-01-10T13:45:00Z",
      },
      {
        _id: "8",
        fileName: "Consent Form",
        description: "Patient consent",
        visible: true,
        updatedBy: "Robert Wilson",
        updatedAt: "2024-01-09T15:30:00Z",
      },
      {
        _id: "9",
        fileName: "HIPAA Authorization Form",
        description: "HIPAA release",
        visible: true,
        updatedBy: "Lisa Anderson",
        updatedAt: "2024-01-08T12:10:00Z",
      },
      {
        _id: "10",
        fileName: "Patient Registration Form",
        description: "New patient registration",
        visible: false,
        updatedBy: "Michael Clark",
        updatedAt: "2024-01-07T14:25:00Z",
      },
      {
        _id: "11",
        fileName: "Lab Test Results",
        description: "Recent lab results",
        visible: true,
        updatedBy: "Jennifer Lee",
        updatedAt: "2024-01-06T16:40:00Z",
      },
      {
        _id: "12",
        fileName: "Prescription Document",
        description: "Doctor's prescription",
        visible: true,
        updatedBy: "Kevin Martin",
        updatedAt: "2024-01-05T09:55:00Z",
      },
      {
        _id: "13",
        fileName: "Insurance Claim Form",
        description: "Claim submitted to insurer",
        visible: false,
        updatedBy: "Amanda White",
        updatedAt: "2024-01-04T11:30:00Z",
      },
      {
        _id: "14",
        fileName: "Emergency Contact Form",
        description: "Emergency contacts",
        visible: true,
        updatedBy: "Daniel Harris",
        updatedAt: "2024-01-03T13:15:00Z",
      },
      {
        _id: "15",
        fileName: "Medical Power of Attorney",
        description: "Legal power of attorney",
        visible: true,
        updatedBy: "Michelle Taylor",
        updatedAt: "2024-01-02T15:50:00Z",
      },
    ],
  });

  const initParams = {
    search: "",
    page: 1,
    limit: 10,
  };
  const [documentParams, setDocumentParams] = useState<any>(initParams);
  const [loading, setLoading] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const totalPages = Math.ceil(documents?.totalRecords / documentParams?.limit);
  const startIndex = (documentParams?.page - 1) * documentParams?.limit;
  const endIndex = Math.min(
    startIndex + documentParams?.limit,
    documents?.totalRecords
  );

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [modalType, setModalType] = useState<any>("");

  const getDocuments = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => {
    setLoading(true);
    try {
      const res = await {
        page: params?.page ?? documentParams?.page,
        limit: params?.limit ?? documentParams?.limit,
        search: params?.search ?? documentParams?.search,
        status: params?.status ?? documentParams?.status,
      };
      setDocuments(res);
    } catch (err) {
      console.error("Failed to fetch master data:", err);
    } finally {
      setLoading(false);
    }
  };
  const handlePageChange = async (page: number) => {
    setDocumentParams((prev: any) => ({ ...prev, page }));
    await getDocuments({ page });
  };

  const handleRowsPerPageChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLimit = parseInt(e.target.value, 10);
    setDocumentParams((prev: any) => ({ ...prev, page: 1, limit: newLimit }));
    await getDocuments({ page: 1, limit: newLimit });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDocumentParams((prev: any) => ({ ...prev, search: value }));

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    setLoading(true);
    searchTimeout.current = setTimeout(() => {
      getDocuments({ page: 1, search: value });
    }, 600);
  };

  const headers = [
    {
      label: "Name",
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{row.fileName}</span>
        </div>
      ),
    },
    {
      label: "Description",
      render: (row: any) => (
        <span className="text-gray-700 dark:text-gray-300">
          {row.description ?? "No description available"}
        </span>
      ),
    },
    {
      label: "Visible",
      render: (row: any) => (
        <div className="flex items-center justify-center">
          <Badge
            className="text-xs"
            color={row.visible ? "success" : "error"}
            variant="light"
          >
            {row.visible ? "Visible" : "Not Visible"}
          </Badge>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex flex-col items-center justify-between gap-3 mb-4 md:flex-row">
        <Search
          className="w-full md:w-80"
          placeholder="Search Documents..."
          value={documentParams?.search}
          onChange={handleSearch}
        />

        <div className="flex gap-2">
          <Button
            onClick={() => {
              setSelectedDocument(null);
              setModalType("upload");
              mainModal.openModal();
            }}
          >
            Add New Document
          </Button>

          <FilterModal
            isOpen={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
            title="Filter Documents"
            description="Narrow down the list"
            filters={[
              {
                key: "visible",
                label: "Visibility",
                options: [
                  { label: "Visible", value: "true" },
                  { label: "Not Visible", value: "false" },
                ],
              },
            ]}
            filterValues={documentParams}
            onFilterChange={(key, value) => {
              setDocumentParams((prev: any) => ({ ...prev, [key]: value }));
            }}
            onApply={() => {
              getDocuments({ page: 1 });
              setIsFilterModalOpen(false);
            }}
            className="max-w-[500px]"
          />
          <FilterButton
            onClick={() => setIsFilterModalOpen(true)}
            className="px-4 py-2"
          />
        </div>
      </div>

      <FilterAndSortPills filters={documentParams} onRemoveFilter={() => {}} />

      <CommonTable
        headers={headers}
        data={documents?.Documents || []}
        actions={(item: any) => (
          <>
            <Tooltip content="Edit" position="left">
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={() => {
                  setModalType("edit");
                  setSelectedDocument(item);
                  mainModal.openModal();
                }}
              >
                <PencilIcon />
              </button>
            </Tooltip>

            <Tooltip content="Delete" position="left">
              <button
                className="text-gray-500 hover:text-error-500"
                onClick={() => {
                  setModalType("delete");
                  setSelectedDocument(item);
                  mainModal.openModal();
                }}
              >
                <TrashBinIcon />
              </button>
            </Tooltip>
          </>
        )}
        loading={loading}
      />
      <TableFooter
        rowsPerPage={documentParams?.limit}
        handleRowsPerPageChange={handleRowsPerPageChange}
        currentPage={documentParams?.page}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        totalEntries={documents?.totalRecords}
        startIndex={startIndex}
        endIndex={endIndex}
      />

      <DocumentModal
        isOpen={mainModal.isOpen}
        closeModal={mainModal.closeModal}
        modelType={modalType}
        setModelType={setModalType}
        selectedDocument={selectedDocument}
        setSelectedDocument={setSelectedDocument}
      />
    </div>
  );
}

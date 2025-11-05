"use client";
import CommonTable from "@/components/common/CommonTable";
// import FilterButton from "@/components/common/filter/FilterButton";
// import FilterModal from "@/components/common/filter/FilterModal";
import Search from "@/components/common/Search";
import TableFooter from "@/components/common/TableFooter";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { Tooltip } from "@/components/ui/tooltip/Tooltip";
import { useModal } from "@/hooks/useModal";
import { PencilIcon, TrashBinIcon } from "@/icons";
import React, { useState, useRef, useEffect } from "react";
import FilterAndSortPills from "@/components/common/filter/FilterAndSortPills";
import DocumentModal from "../modals/DocumentModal";
import { fetchDocuments } from "@/utils/fetchApis";

export default function Documents() {
  const mainModal = useModal();

  const [documentsData, setDocumentsData] = useState<any>({
    totalRecords: 0,
    documents: [],
  });

  const initParams = {
    page: 1,
    limit: 10,
    search: "",
  };

  const [documentParams, setDocumentParams] = useState<any>(initParams);
  const [loading, setLoading] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const hasFetchedInitialData = useRef(false);

  const totalPages = Math.ceil(
    documentsData?.totalRecords / documentParams?.limit
  );
  const startIndex = (documentParams?.page - 1) * documentParams?.limit;
  const endIndex = Math.min(
    startIndex + documentParams?.limit,
    documentsData?.totalRecords
  );

  // const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [modalType, setModalType] = useState<any>("");

  const getDocuments = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    setLoading(true);
    try {
      const res = await fetchDocuments({
        page: params?.page ?? documentParams?.page,
        limit: params?.limit ?? documentParams?.limit,
        search: params?.search ?? documentParams?.search,
      });
      setDocumentsData(res);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetchedInitialData.current) {
      hasFetchedInitialData.current = true;
      getDocuments();
    }
  }, []);

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
          <span className="font-medium">{row?.name}</span>
        </div>
      ),
    },
    {
      label: "Description",
      render: (row: any) => (
        <span className="text-gray-700 dark:text-gray-300 flex justify-center">
          {row?.description ? row.description : "-"}
        </span>
      ),
    },
    {
      label: "Visible",
      render: (row: any) => (
        <div className="flex items-center justify-center">
          <Badge
            className="text-xs"
            color={row?.visible ? "success" : "error"}
            variant="light"
          >
            {row?.visible ? "Visible" : "Not Visible"}
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

          {/* <FilterModal
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
          /> */}
        </div>
      </div>

      <FilterAndSortPills filters={documentParams} onRemoveFilter={() => {}} />

      <CommonTable
        headers={headers}
        data={documentsData?.documents || []}
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
        totalEntries={documentsData?.totalRecords}
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
        rowsPerPage={documentsData?.limit}
        setDocuments={setDocumentsData}
      />
    </div>
  );
}

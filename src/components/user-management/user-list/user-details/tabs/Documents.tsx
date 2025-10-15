import CommonTable from "@/components/common/CommonTable";
import Button from "@/components/ui/button/Button";
import { Check, Plus, X } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip/Tooltip";
import { useState } from "react";
import { useModal } from "@/hooks/useModal";
import { formatDate } from "@/utils/formateDate";
import { EyeIcon, PencilIcon, TrashBinIcon } from "@/icons";
import Loading from "@/components/Loading";
import { showToast } from "@/lib/toast";
import DocumentModal from "../modals/DocumentModal";
import { getStatusBadge } from "@/components/capacity-planning/tabs/AdminApprovalTab";

export default function Documents({
  isUserProfile,
}: {
  isUserProfile?: boolean;
}) {
  const mainModal = useModal();
  const [selectedDocument, setSelectedDocument] = useState<any>();
  const [modalType, setModalType] = useState<any>();
  const [loadingAcceptId, setLoadingAcceptId] = useState<string | null>(null);
  const [loadingRejectId, setLoadingRejectId] = useState<string | null>(null);

  const [documents, setDocuments] = useState<any>({
    Docs: [
      {
        _id: "1",
        fileName: "Aadhar Card Front",
        docUrl: "/images/documents/fake-adhar.jfif",
        fileUrl: "/images/documents/fake-adhar.jfif",
        updatedBy: "John Doe",
        updatedAt: "2024-01-15T10:30:00Z",
        status: "pending",
      },
      {
        _id: "2",
        fileName: "Aadhar Card Back",
        docUrl: "/images/documents/fake-adhar.jfif",
        fileUrl: "/images/documents/fake-adhar.jfif",
        updatedBy: "John Doe",
        updatedAt: "2024-01-15T10:30:00Z",
        status: "pending",
      },
      {
        _id: "3",
        fileName: "Voter ID",
        fileUrl: "/images/documents/fake-adhar.jfif",
        updatedBy: "Jane Smith",
        updatedAt: "2024-01-14T14:20:00Z",
        status: "approved",
      },
      {
        _id: "4",
        fileName: "Driving License",
        docUrl: "/images/documents/fake-adhar.jfif",
        fileUrl: "/images/documents/fake-adhar.jfif",
        updatedBy: "Mike Johnson",
        updatedAt: "2024-01-13T09:15:00Z",
        status: "pending",
      },
      {
        _id: "5",
        fileName: "Passport",
        docUrl: "/images/documents/fake-adhar.jfif",
        fileUrl: "/images/documents/fake-adhar.jfif",
        updatedBy: "Sarah Wilson",
        updatedAt: "2024-01-12T16:45:00Z",
        status: "rejected",
      },
      {
        _id: "6",
        fileName: "Health Insurance Card",
        docUrl: "/images/documents/fake-adhar.jfif",
        fileUrl: "/images/documents/fake-adhar.jfif",
        updatedBy: "David Brown",
        updatedAt: "2024-01-11T11:20:00Z",
        status: "pending",
      },
      {
        _id: "7",
        fileName: "Medical History Form",
        docUrl: "/images/documents/fake-adhar.jfif",
        fileUrl: "/images/documents/fake-adhar.jfif",
        updatedBy: "Emily Davis",
        updatedAt: "2024-01-10T13:45:00Z",
        status: "approved",
      },
      {
        _id: "8",
        fileName: "Consent Form",
        docUrl: "/images/documents/fake-adhar.jfif",
        fileUrl: "/images/documents/fake-adhar.jfif",
        updatedBy: "Robert Wilson",
        updatedAt: "2024-01-09T15:30:00Z",
        status: "pending",
      },
      {
        _id: "9",
        fileName: "HIPAA Authorization Form",
        docUrl: "/images/documents/fake-adhar.jfif",
        fileUrl: "/images/documents/fake-adhar.jfif",
        updatedBy: "Lisa Anderson",
        updatedAt: "2024-01-08T12:10:00Z",
        status: "approved",
      },
      {
        _id: "10",
        fileName: "Patient Registration Form",
        docUrl: "/images/documents/fake-adhar.jfif",
        fileUrl: "/images/documents/fake-adhar.jfif",
        updatedBy: "Michael Clark",
        updatedAt: "2024-01-07T14:25:00Z",
        status: "pending",
      },
      {
        _id: "11",
        fileName: "Lab Test Results",
        docUrl: "/images/documents/fake-adhar.jfif",
        fileUrl: "/images/documents/fake-adhar.jfif",
        updatedBy: "Jennifer Lee",
        updatedAt: "2024-01-06T16:40:00Z",
        status: "approved",
      },
      {
        _id: "12",
        fileName: "Prescription Document",
        docUrl: "/images/documents/fake-adhar.jfif",
        fileUrl: "/images/documents/fake-adhar.jfif",
        updatedBy: "Kevin Martin",
        updatedAt: "2024-01-05T09:55:00Z",
        status: "pending",
      },
      {
        _id: "13",
        fileName: "Insurance Claim Form",
        docUrl: "/images/documents/fake-adhar.jfif",
        fileUrl: "/images/documents/fake-adhar.jfif",
        updatedBy: "Amanda White",
        updatedAt: "2024-01-04T11:30:00Z",
        status: "rejected",
      },
      {
        _id: "14",
        fileName: "Emergency Contact Form",
        docUrl: "/images/documents/fake-adhar.jfif",
        fileUrl: "/images/documents/fake-adhar.jfif",
        updatedBy: "Daniel Harris",
        updatedAt: "2024-01-03T13:15:00Z",
        status: "approved",
      },
      {
        _id: "15",
        fileName: "Medical Power of Attorney",
        docUrl: "/images/documents/fake-adhar.jfif",
        fileUrl: "/images/documents/fake-adhar.jfif",
        updatedBy: "Michelle Taylor",
        updatedAt: "2024-01-02T15:50:00Z",
        status: "pending",
      },
    ],
  });

  const headers = [
    {
      label: "FileName",
      render: (item: any) => {
        return <p className="cut-text-long">{item?.fileName}</p>;
      },
    },
    {
      label: "Updated By",
      render: (item: any) => <p>{item?.updatedBy}</p>,
    },
    isUserProfile
      ? {
          label: "Status",
          render: (item: any) => <>{getStatusBadge(item.status)}</>,
        }
      : {
          label: "Accept / Reject",
          width: 150,
          render: (item: any) => (
            <div className="flex items-center gap-2 justify-center">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAccept(item._id)}
                  disabled={
                    loadingAcceptId !== null || loadingRejectId !== null
                  }
                  className="!text-green-600 !border-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingAcceptId === item?._id ? (
                    <Loading size={1} />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReject(item._id)}
                  disabled={
                    loadingAcceptId !== null || loadingRejectId !== null
                  }
                  className="!text-red-600 !border-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingRejectId === item?._id ? (
                    <Loading size={1} />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          ),
        },
    {
      label: "Updated At",
      render: (item: any) => <p>{formatDate(item?.updatedAt, true)}</p>,
    },
  ];

  const handleAccept = async (documentId: string) => {
    setLoadingAcceptId(documentId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showToast("success", "Success", "Document accepted successfully");

      setDocuments((prev: any) => ({
        Docs: prev.Docs.map((doc: any) =>
          doc._id === documentId ? { ...doc, status: "approved" } : doc
        ),
      }));
    } catch (error) {
      console.error("Error accepting document:", error);
      showToast("error", "Error", "Failed to accept document");
    } finally {
      setLoadingAcceptId(null);
    }
  };

  const handleReject = async (documentId: string) => {
    setLoadingRejectId(documentId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showToast("success", "Success", "Document rejected successfully");

      setDocuments((prev: any) => ({
        Docs: prev.Docs.map((doc: any) =>
          doc._id === documentId ? { ...doc, status: "rejected" } : doc
        ),
      }));
    } catch (error) {
      console.error("Error rejecting document:", error);
      showToast("error", "Error", "Failed to reject document");
    } finally {
      setLoadingRejectId(null);
    }
  };

  const handleView = (item: any) => {
    setSelectedDocument(item);
    setModalType("read");
    mainModal.openModal();
  };

  const handleEdit = (item: any) => {
    setSelectedDocument(item);
    setModalType("edit");
    mainModal.openModal();
  };

  const handleDelete = (item: any) => {
    setSelectedDocument(item);
    setModalType("delete");
    mainModal.openModal();
  };

  return (
    <>
      <div className="mt-4">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-y-2">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Documents
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isUserProfile
                ? "Manage your uploaded documents here."
                : "View and manage documents related to this user."}
            </p>
          </div>
          <Button
            className="w-full sm:w-auto"
            size="sm"
            onClick={() => {
              setModalType("upload");
              setSelectedDocument(null);
              mainModal.openModal();
            }}
          >
            <Plus className="h-4 w-4" />
            Upload Document
          </Button>
        </div>
        <div>
          <CommonTable
            headers={headers}
            data={documents?.Docs}
            actions={(item: any) => (
              <div className="gap-1 flex">
                <button
                  className="flex rounded-lg p-1 items-center gap-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90"
                  onClick={() => handleView(item)}
                >
                  <Tooltip content="View" position="left">
                    <EyeIcon />
                  </Tooltip>
                </button>
                <button
                  className="flex rounded-lg p-1 items-center gap-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90"
                  onClick={() => handleEdit(item)}
                >
                  <Tooltip content="Edit" position="left">
                    <PencilIcon />
                  </Tooltip>
                </button>
                <button
                  className="flex rounded-lg p-1 items-center gap-1 text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-600"
                  onClick={() => handleDelete(item)}
                >
                  <Tooltip content="Delete" position="left">
                    <TrashBinIcon />
                  </Tooltip>
                </button>
              </div>
            )}
          />
        </div>
      </div>
      <DocumentModal
        isOpen={mainModal.isOpen}
        closeModal={mainModal.closeModal}
        modelType={modalType}
        setModelType={setModalType}
        setSelectedDocument={setSelectedDocument}
        selectedDocument={selectedDocument}
      />
    </>
  );
}

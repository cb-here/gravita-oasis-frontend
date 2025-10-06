import { useState } from "react";
import {
  DownloadIcon,
  ClockIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ExternalLinkIcon,
  AlertTriangleIcon,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { showToast } from "@/lib/toast";
import BulkLogErrorDetails from "../components/BulkLogErrorDetails";
import Tabs from "@/components/common/tabs/Tabs";
import BulkLogStatistics from "../components/BulkLogStatistics";
import Loading from "@/components/Loading";
import Button from "@/components/ui/button/Button";

const mockBulkData = {
  id: "bulk-12345",
  file_name: "patient_data_import.csv",
  total_tasks: 150,
  success_tasks: 145,
  failed_tasks: 5,
  processing_status: "completed",
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T10:32:15Z",
  failed_tasks_details: [
    {
      row: 1,
      column: "date_of_birth",
      reason: "Invalid date format. Expected YYYY-MM-DD",
      data: {
        mrn_no: "MRN001",
        patient_name: "John Smith",
        date_of_birth: "15/01/1990",
      },
    },
    {
      row: 2,
      column: "email",
      reason: "Email address is required",
      data: {
        mrn_no: "MRN002",
        patient_name: "Sarah Johnson",
        email: "",
      },
    },
    {
      row: 3,
      column: "phone_number",
      reason: "Phone number must be 10 digits",
      data: {
        mrn_no: "MRN003",
        patient_name: "Michael Brown",
        phone_number: "123456",
      },
    },
    {
      row: 4,
      column: "insurance_id",
      reason: "Insurance ID not found in system",
      data: {
        mrn_no: "MRN004",
        patient_name: "Emily Davis",
        insurance_id: "INV98765",
      },
    },
    {
      row: 5,
      column: "date_of_birth",
      reason: "Patient must be at least 18 years old",
      data: {
        mrn_no: "MRN005",
        patient_name: "Robert Wilson",
        date_of_birth: "2020-05-15",
      },
    },
  ],
  created_tasks: Array.from({ length: 145 }, (_, i) => ({
    id: `task-${i + 1}`,
    mrn_no: `MRN${(i + 6).toString().padStart(3, "0")}`,
    patient_name: `Patient ${i + 1}`,
  })),
};

interface ViewModalProps {
  isOpen: boolean;
  closeModal: () => void;
  selectedItem: any;
  setSelectedItem: any;
}

export default function ViewBulkModal({
  isOpen,
  closeModal,
  selectedItem,
  setSelectedItem,
}: ViewModalProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isDownloading, setIsDownloading] = useState(false);
  const [showRawData, setShowRawData] = useState(false);

  // Use mock data if no selectedItem is provided
  const data = selectedItem || mockBulkData;

  const handleDownload = async () => {
    if (!data?.id) return;

    setIsDownloading(true);
    try {
      // Simulate download delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      showToast("success", "", "File downloaded successfully");
    } catch (error) {
      console.error("Download failed:", error);
      showToast("error", "", "Failed to download file");
    } finally {
      setIsDownloading(false);
    }
  };

  const getErrorData = () => {
    // Use the mock error data
    return data.failed_tasks_details || [];
  };

  const errorData = getErrorData();
  const errorCount = errorData.length || data.failed_tasks || 0;

  const handleExportErrors = async () => {
    if (!errorData?.length) return;

    try {
      const headers = [
        "Row",
        "MRN",
        "Patient Name",
        "Failed Field",
        "Error Reason",
      ];
      const csvContent = [
        headers.join(","),
        ...errorData.map((error: any) =>
          [
            error.row || "",
            error.data?.mrn_no || "",
            error.data?.patient_name || "",
            error.column || "",
            `"${(error.reason || "").replace(/"/g, '""')}"`,
          ].join(",")
        ),
      ].join("\n");

      // Download CSV
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `bulk-creation-errors-${data.id}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast("success", "", "Error details exported successfully");
    } catch (error) {
      console.error("Export failed:", error);
      showToast("error", "", "Failed to export error details");
    }
  };

  const tabGroups = [
    { key: "overview", name: "Overview" },
    { key: "errors", name: "Errors" },
    { key: "details", name: "Raw Data" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={closeModal} openFromRight>
      <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        {/* Header */}
        <div className="flex-shrink-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm mb-3">
                <span className="text-gray-500 dark:text-gray-400">
                  Bulk Creation Log
                </span>
                <span className="text-gray-400 dark:text-gray-500">/</span>
                <span className="text-gray-900 dark:text-white font-semibold px-3 py-1 bg-blue-50 dark:bg-blue-950 rounded-full border border-blue-100 dark:border-blue-900">
                  {data?.file_name || "Unknown File"}
                </span>
              </div>

              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Upload Analysis & Results
              </h1>
            </div>

            <div className="flex items-center gap-3 ml-6">
              <Button variant="outline">
                <ExternalLinkIcon className="w-4 h-4" />
                View Original
              </Button>

              <Button onClick={handleDownload} disabled={isDownloading}>
                {isDownloading ? (
                  <>
                    <Loading size={1} style={3} />
                    Preparing...
                  </>
                ) : (
                  <>
                    <DownloadIcon className="w-4 h-4" />
                    Download File
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="w-fit bg-white/50 dark:bg-gray-900/50 mb-6">
            <Tabs
              tabGroups={tabGroups}
              selectedTabGroup={activeTab}
              setSelectedTabGroup={setActiveTab}
            />
          </div>
          {activeTab === "overview" && (
            <div className="space-y-6">
              <BulkLogStatistics data={data} showDetails />

              {data.failed_tasks > 0 && (
                <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border border-amber-200 dark:border-amber-800 rounded-xl p-5 shadow-md">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200 dark:bg-amber-800 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
                  <div className="relative flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900 rounded-xl flex items-center justify-center shadow-sm">
                        <AlertTriangleIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                        Action Required
                      </h3>
                      <p className="text-sm text-amber-700 dark:text-amber-300 mt-1.5 leading-relaxed">
                        {data.failed_tasks} task
                        {data.failed_tasks !== 1 ? "s" : ""} failed to process.
                        Review the errors in the "Errors" tab to understand what
                        needs to be corrected.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("errors")}
                      className="text-sm font-semibold text-amber-700 hover:text-amber-800 dark:text-amber-300 dark:hover:text-amber-200 px-4 py-2 bg-white/50 dark:bg-gray-900/50 rounded-lg hover:bg-white/80 dark:hover:bg-gray-900/80 transition-colors"
                    >
                      View Errors →
                    </button>
                  </div>
                </div>
              )}

              {data.processing_status === "processing" && (
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-200 dark:border-blue-800 rounded-xl p-5 shadow-md">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
                  <div className="relative flex items-center gap-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-200 dark:border-blue-700 border-t-blue-600 dark:border-t-blue-400"></div>
                    <div>
                      <h3 className="text-sm font-bold text-blue-900 dark:text-blue-200">
                        Processing in Progress
                      </h3>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-0.5">
                        Your bulk upload is still being processed. Results may
                        be incomplete.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "errors" && (
            <div className="space-y-4">
              {data.failed_tasks > 0 && errorData.length === 0 && (
                <div className="relative overflow-hidden bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950 rounded-xl border border-yellow-200 dark:border-yellow-800 p-5 shadow-md">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-200 dark:bg-yellow-800 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
                  <div className="relative flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900 dark:to-amber-900 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <AlertTriangleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-yellow-900 dark:text-yellow-200">
                        Error Details Missing
                      </h3>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1.5 leading-relaxed">
                        The system indicates {data.failed_tasks} failed task
                        {data.failed_tasks !== 1 ? "s" : ""}, but detailed error
                        information is not available.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <BulkLogErrorDetails
                errors={errorData.map((error: any) => ({
                  row: error.row,
                  column: error.column,
                  reason: error.reason,
                  failed_field: error.column,
                  failed_reason: error.reason,
                  mrn_no: error.data?.mrn_no || "",
                  patient_name: error.data?.patient_name || "",
                  row_number: error.row,
                  data: error.data,
                }))}
                onExportErrors={
                  errorData.length > 0 ? handleExportErrors : undefined
                }
              />
            </div>
          )}

          {activeTab === "details" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Raw Upload Data
                </h3>
                <button
                  onClick={() => setShowRawData(!showRawData)}
                  className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold px-3 py-1.5 bg-blue-50 dark:bg-blue-950 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                >
                  {showRawData ? (
                    <>
                      <ChevronUpIcon className="w-3.5 h-3.5" />
                      Hide JSON
                    </>
                  ) : (
                    <>
                      <ChevronDownIcon className="w-3.5 h-3.5" />
                      Show JSON
                    </>
                  )}
                </button>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <dt className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      Upload ID
                    </dt>
                    <dd className="text-xs text-gray-900 dark:text-white font-mono bg-white dark:bg-gray-950 px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700">
                      {data.id}
                    </dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      File Size
                    </dt>
                    <dd className="text-xs text-gray-900 dark:text-white font-semibold bg-white dark:bg-gray-950 px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700">
                      {data.total_tasks
                        ? `${data.total_tasks} rows`
                        : "Unknown"}
                    </dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      Created Tasks
                    </dt>
                    <dd className="text-xs text-gray-900 dark:text-white font-semibold bg-white dark:bg-gray-950 px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700">
                      {data.created_tasks?.length || data.success_tasks || 0}{" "}
                      tasks
                    </dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      Processing Time
                    </dt>
                    <dd className="text-xs text-gray-900 dark:text-white font-semibold bg-white dark:bg-gray-950 px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700">
                      {data.createdAt && data.updatedAt
                        ? `${Math.round(
                            (new Date(data.updatedAt).getTime() -
                              new Date(data.createdAt).getTime()) /
                              1000
                          )}s`
                        : "Unknown"}
                    </dd>
                  </div>
                </dl>
              </div>

              {showRawData && (
                <div className="bg-gradient-to-br from-gray-900 to-gray-950 dark:from-gray-950 dark:to-black rounded-lg p-4 border border-gray-700 dark:border-gray-800">
                  <h4 className="text-xs font-bold text-gray-300 dark:text-gray-400 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    Complete Data Object
                  </h4>
                  <pre className="text-xs text-gray-300 dark:text-gray-400 overflow-auto max-h-96 whitespace-pre-wrap font-mono bg-black/30 p-3 rounded">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

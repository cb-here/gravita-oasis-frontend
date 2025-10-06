import React, { useState, useMemo } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Target,
  TrendingUp,
  Calendar,
  Code,
  TestTube,
} from "lucide-react";
import { format } from "date-fns";
import { SubmissionRecord } from "../types/planning";
import Badge from "@/components/ui/badge/Badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card1/card";
import CommonTable, { HeaderType } from "@/components/common/CommonTable";
import TableFooter from "@/components/common/TableFooter";
import { Tooltip } from "@/components/ui/tooltip/Tooltip";
import { EyeIcon } from "@/icons";
import { useModal } from "@/hooks/useModal";
import ReviewModal from "../modals/ReviewModal";

export const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <Badge variant="light" className="text-xs" color="warning">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    case "approved":
      return (
        <Badge variant="light" className="text-xs" color="success">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="light" className="text-xs" color="error">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      );
    default:
      return null;
  }
};

interface AdminApprovalTabProps {
  submissions: SubmissionRecord[];
  onApprovalAction: (
    submissionId: string,
    action: "approve" | "reject",
    comments?: string
  ) => void;
}

export const AdminApprovalTab: React.FC<AdminApprovalTabProps> = ({
  submissions,
}) => {
  const [selectedSubmission, setSelectedSubmission] =
    useState<SubmissionRecord | null>(null);
  const [currentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [processedCurrentPage, setProcessedCurrentPage] = useState(1);
  const [processedRowsPerPage, setProcessedRowsPerPage] = useState(10);
  const reviewModal = useModal();

  const pendingSubmissions = submissions.filter((s) => s.status === "pending");
  const processedSubmissions = submissions.filter(
    (s) => s.status !== "pending"
  );

  // Calculate today's capacity from approved submissions
  const todaysCapacity = useMemo(() => {
    const approvedSubmissions = submissions.filter(
      (sub) => sub.status === "approved"
    );
    const totalCoding = approvedSubmissions.reduce(
      (sum, sub) => sum + sub.metrics.totalCodingTasks,
      0
    );
    const totalQA = approvedSubmissions.reduce(
      (sum, sub) => sum + sub.metrics.totalQACapacity,
      0
    );
    const totalSampling = approvedSubmissions.reduce(
      (sum, sub) => sum + sub.metrics.samplingBalance,
      0
    );
    const activeTeams = approvedSubmissions.length;

    return { totalCoding, totalQA, totalSampling, activeTeams };
  }, [submissions]);

  // Pagination for pending submissions
  const pendingStartIndex = (currentPage - 1) * rowsPerPage;
  const pendingEndIndex = Math.min(
    pendingStartIndex + rowsPerPage,
    pendingSubmissions.length
  );
  const paginatedPending = pendingSubmissions.slice(
    pendingStartIndex,
    pendingEndIndex
  );
  // const pendingTotalPages = Math.ceil(pendingSubmissions.length / rowsPerPage);

  // Pagination for processed submissions
  const processedStartIndex = (processedCurrentPage - 1) * processedRowsPerPage;
  const processedEndIndex = Math.min(
    processedStartIndex + processedRowsPerPage,
    processedSubmissions.length
  );
  const paginatedProcessed = processedSubmissions.slice(
    processedStartIndex,
    processedEndIndex
  );
  const processedTotalPages = Math.ceil(
    processedSubmissions.length / processedRowsPerPage
  );

  // Headers for pending submissions table
  const pendingHeaders: HeaderType<SubmissionRecord>[] = [
    {
      label: "Team Name",
      render: (item) => <span className="font-medium">{item.teamName}</span>,
      width: 200,
    },
    {
      label: "Raised By",
      render: (item) => item.raisedBy,
      width: 180,
    },
    {
      label: "Submitted",
      render: (item) => format(new Date(item.timestamp), "MMM dd, yyyy"),
      width: 150,
    },
    {
      label: "Planned Capacity",
      render: (item) => (
        <div className="text-sm flex gap-4 justify-center">
          <span className="text-blue-600 font-medium">
            {item.metrics.totalCodingTasks} Coding
          </span>
          <span className="text-green-600 font-medium">
            {item.metrics.totalQACapacity} QA
          </span>
          <span className="text-purple-600 font-medium">
            {item.metrics.samplingBalance} Sampling
          </span>
        </div>
      ),
      width: 350,
    },
    {
      label: "Team Size",
      render: (item) => `${item.teamMembers.length} members`,
      width: 150,
    },
    {
      label: "Status",
      render: (item) => getStatusBadge(item.status),
      width: 150,
    },
    {
      label: "Actions",
      render: () => <></>,
      width: 100,
    },
  ];

  // Headers for processed submissions table
  const processedHeaders: HeaderType<SubmissionRecord>[] = [
    {
      label: "Team Name",
      render: (item) => <span className="font-medium">{item.teamName}</span>,
      width: 200,
    },
    {
      label: "Raised By",
      render: (item) => item.raisedBy,
      width: 180,
    },
    {
      label: "Decision Date",
      render: (item) =>
        item.adminApproval
          ? format(new Date(item.adminApproval.approvedAt), "MMM dd, HH:mm")
          : "-",
      width: 180,
    },
    {
      label: "Status",
      render: (item) => getStatusBadge(item.status),
      width: 150,
    },
    {
      label: "Approved By",
      render: (item) => item.adminApproval?.approvedBy || "-",
      width: 180,
    },
    {
      label: "Comments",
      render: (item) => (
        <span className="max-w-xs truncate block">
          {item.adminApproval?.comments || "-"}
        </span>
      ),
      width: 250,
    },
  ];

  return (
    <div className="space-y-6 mt-6">
      {/* Today's Capacity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-2">
              <Code className="h-5 w-5 text-blue-500 " />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Today&apos;s Coding Tasks
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {todaysCapacity.totalCoding}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-2">
              <TestTube className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Today&apos;s QA Capacity
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {todaysCapacity.totalQA}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-2">
              <Target className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Today&apos;s Sampling
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {todaysCapacity.totalSampling}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-2">
              <Users className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Teams
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {todaysCapacity.activeTeams}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Pending Submissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-600" />
            Pending Approvals ({pendingSubmissions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingSubmissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
              No pending submissions to review
            </div>
          ) : (
            <>
              <CommonTable
                headers={pendingHeaders}
                data={paginatedPending}
                rowIdAccessor="id"
                emptyState={
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
                    No pending submissions to review
                  </div>
                }
                actions={(item: any) => (
                  <>
                    <Tooltip content="Review" position="left">
                      <button
                        className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90"
                        onClick={() => {
                          setSelectedSubmission(item);
                          reviewModal.openModal();
                        }}
                      >
                        <EyeIcon />
                      </button>
                    </Tooltip>
                  </>
                )}
              />
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Recent Decisions
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {processedSubmissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              No decisions made yet
            </div>
          ) : (
            <>
              <CommonTable
                headers={processedHeaders}
                data={paginatedProcessed}
                rowIdAccessor="id"
                emptyState={
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    No decisions made yet
                  </div>
                }
              />
              <TableFooter
                rowsPerPage={processedRowsPerPage}
                handleRowsPerPageChange={(e) => {
                  setProcessedRowsPerPage(Number(e.target.value));
                  setProcessedCurrentPage(1);
                }}
                currentPage={processedCurrentPage}
                totalPages={processedTotalPages}
                handlePageChange={setProcessedCurrentPage}
                totalEntries={processedSubmissions.length}
                startIndex={processedStartIndex}
                endIndex={processedEndIndex}
              />
            </>
          )}
        </CardContent>
      </Card>
      <ReviewModal
        isOpen={reviewModal.isOpen}
        closeModal={reviewModal.closeModal}
        selectedSubmission={selectedSubmission}
        setSelectedSubmission={setSelectedSubmission}
      />
    </div>
  );
};

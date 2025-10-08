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
import { SubmissionRecord, TeamMember } from "../types/planning";
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
import { formatDate } from "@/utils/formateDate";
import AvatarText from "@/components/ui/avatar/AvatarText";

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
  onApprovalAction: (
    submissionId: string,
    action: "approve" | "reject",
    comments?: string
  ) => void;
}

const mockTeamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Member 1",
    role: "Coder",
    coding: 5,
    qa: 0,
    sampling: 2,
    target: 5,
    completed: 3,
  },
  {
    id: 2,
    name: "Member 2",
    role: "QA",
    coding: 0,
    qa: 3,
    sampling: 0,
    target: 3,
    completed: 2,
  },
  {
    id: 3,
    name: "Member 3",
    role: "Coder/QA",
    coding: 4,
    qa: 2,
    sampling: 1,
    target: 6,
    completed: 5,
  },
];

export const AdminApprovalTab: React.FC<AdminApprovalTabProps> = (
  {
    // onApprovalAction,
  }
) => {
  const [selectedSubmission, setSelectedSubmission] =
    useState<SubmissionRecord | null>(null);
  const [currentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [processedCurrentPage, setProcessedCurrentPage] = useState(1);
  const [processedRowsPerPage, setProcessedRowsPerPage] = useState(10);
  const reviewModal = useModal();

  const submissions: SubmissionRecord[] = useMemo(
    () => [
      // Pending submissions
      {
        id: "1",
        timestamp: new Date("2025-10-06T10:00:00"),
        teamName: "Team Alpha",
        raisedBy: "John Doe",
        teamMembers: [
          {
            id: 1,
            name: "Alice",
            role: "Coder",
            coding: 10,
            qa: 0,
            sampling: 3,
            target: 10,
            completed: 7,
          },
        ],
        metrics: {
          totalCodingTasks: 10,
          totalQACapacity: 0,
          totalTargets: 10,
          totalCompleted: 7,
          overallPerformance: 70,
          samplingBalance: -3,
          isBalanced: false,
        },
        status: "pending",
      },
      {
        id: "2",
        timestamp: new Date("2025-10-07T09:30:00"),
        teamName: "Team Beta",
        raisedBy: "Jane Smith",
        teamMembers: [
          {
            id: 1,
            name: "Bob",
            role: "QA",
            coding: 0,
            qa: 5,
            sampling: 0,
            target: 5,
            completed: 4,
          },
          {
            id: 2,
            name: "Carol",
            role: "Coder/QA",
            coding: 2,
            qa: 3,
            sampling: 1,
            target: 5,
            completed: 3,
          },
        ],
        metrics: {
          totalCodingTasks: 2,
          totalQACapacity: 8,
          totalTargets: 10,
          totalCompleted: 7,
          overallPerformance: 70,
          samplingBalance: 7,
          isBalanced: true,
        },
        status: "pending",
      },
      {
        id: "3",
        timestamp: new Date("2025-10-07T14:00:00"),
        teamName: "Team Gamma",
        raisedBy: "Mike Johnson",
        teamMembers: mockTeamMembers,
        metrics: {
          totalCodingTasks: 19,
          totalQACapacity: 5,
          totalTargets: 16,
          totalCompleted: 10,
          overallPerformance: 62,
          samplingBalance: -14,
          isBalanced: false,
        },
        status: "pending",
      },
      // Processed submissions
      {
        id: "4",
        timestamp: new Date("2025-10-05T11:00:00"),
        teamName: "Team Delta",
        raisedBy: "Sarah Wilson",
        teamMembers: mockTeamMembers,
        metrics: {
          totalCodingTasks: 15,
          totalQACapacity: 6,
          totalTargets: 21,
          totalCompleted: 18,
          overallPerformance: 85,
          samplingBalance: -9,
          isBalanced: false,
        },
        status: "approved",
        adminApproval: {
          approvedBy: "Admin User 1",
          approvedAt: new Date("2025-10-06T15:00:00"),
          comments: "Approved after capacity review. Proceed with adjustments.",
        },
      },
      {
        id: "5",
        timestamp: new Date("2025-10-04T13:20:00"),
        teamName: "Team Epsilon",
        raisedBy: "Tom Brown",
        teamMembers: [
          {
            id: 1,
            name: "David",
            role: "Coder",
            coding: 8,
            qa: 0,
            sampling: 4,
            target: 8,
            completed: 5,
          },
        ],
        metrics: {
          totalCodingTasks: 8,
          totalQACapacity: 0,
          totalTargets: 8,
          totalCompleted: 5,
          overallPerformance: 62,
          samplingBalance: -4,
          isBalanced: false,
        },
        status: "rejected",
        adminApproval: {
          approvedBy: "Admin User 2",
          approvedAt: new Date("2025-10-05T09:00:00"),
          comments: "Rejected due to imbalanced sampling and QA capacity.",
        },
      },
      {
        id: "6",
        timestamp: new Date("2025-10-06T16:45:00"),
        teamName: "Team Zeta",
        raisedBy: "Lisa Davis",
        teamMembers: mockTeamMembers,
        metrics: {
          totalCodingTasks: 12,
          totalQACapacity: 7,
          totalTargets: 19,
          totalCompleted: 19,
          overallPerformance: 100,
          samplingBalance: -5,
          isBalanced: false,
        },
        status: "approved",
        adminApproval: {
          approvedBy: "Admin User 1",
          approvedAt: new Date("2025-10-07T10:30:00"),
          comments: "Fully approved. Excellent performance metrics.",
        },
      },
    ],
    []
  );

  const pendingSubmissions = submissions.filter((s) => s.status === "pending");
  const processedSubmissions = submissions.filter(
    (s) => s.status !== "pending"
  );

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

  const pendingHeaders: HeaderType<SubmissionRecord>[] = [
    {
      label: "Team Name",
      render: (item) => <span className="font-medium">{item.teamName}</span>,
      width: 200,
    },
    {
      label: "Raised By",
      render: (item) => (
        <div className="flex gap-2 items-center">
          <AvatarText name={item.raisedBy} />
          <span>{item.raisedBy}</span>
        </div>
      ),
    },
    {
      label: "Submitted",
      render: (item) => formatDate(new Date(item.timestamp), true),
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
  ];

  const processedHeaders: HeaderType<SubmissionRecord>[] = [
    {
      label: "Team Name",
      render: (item) => <span className="font-medium">{item.teamName}</span>,
      width: 200,
    },
    {
      label: "Raised By",
      render: (item) => (
        <div className="flex gap-2 items-center">
          <AvatarText name={item.raisedBy} />
          <span>{item.raisedBy}</span>
        </div>
      ),
    },
    {
      label: "Decision Date Time",
      render: (item) =>
        item.adminApproval
          ? formatDate(new Date(item.adminApproval.approvedAt), true)
          : "-",
      width: 180,
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
    {
      label: "Status",
      render: (item) => getStatusBadge(item.status),
      width: 150,
    },
  ];

  return (
    <div className="space-y-6 mt-6">
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
                        }}>
                        <EyeIcon className="h-5 w-5" />
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

import { Modal } from "@/components/ui/modal";
import {
  CheckCircle,
  TargetIcon,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card1/card";
import Button from "@/components/ui/button/Button";
import CommonTable, { HeaderType } from "@/components/common/CommonTable";
import Badge from "@/components/ui/badge/Badge";
import { getRoleColor } from "../tabs/PlanningTab";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";

interface ReviewModalProps {
  isOpen: boolean;
  closeModal: () => void;
  selectedSubmission: any;
  setSelectedSubmission: any;
}

export default function ReviewModal({
  isOpen,
  closeModal,
  selectedSubmission,
  setSelectedSubmission,
}: ReviewModalProps) {
  const [loading, setLoading] = useState(false);
  const [currentPage, ] = useState(1);
  const [rowsPerPage, ] = useState(10);
  const [actionModal, setActionModal] = useState<null | "approve" | "reject">(
    null
  );
  const [comment, setComment] = useState("");

  const handleClose = () => {
    if (!loading) {
      setSelectedSubmission(null);
      setLoading(false);
      closeModal();
    }
  };

  const teamMembers = selectedSubmission?.teamMembers || [];
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, teamMembers.length);
  const paginatedMembers = teamMembers.slice(startIndex, endIndex);

  const teamMemberHeaders: HeaderType<any>[] = [
    {
      label: "Name",
      render: (m) => <span className="font-medium">{m.name}</span>,
      width: 180,
    },
    {
      label: "Role",
      render: (m) => (
        <Badge className="text-xs" color={getRoleColor(m.role)}>
          {m.role}
        </Badge>
      ),
      width: 150,
    },
    { label: "Coding Tasks", render: (m) => m.coding, width: 150 },
    { label: "QA Tasks", render: (m) => m.qa, width: 150 },
    { label: "Sampling", render: (m) => m.sampling, width: 150 },
    { label: "Target", render: (m) => m.target, width: 150 },
    {
      label: "Planned Load",
      render: (m) => (
        <div className="font-medium text-blue-600">
          {m.coding + m.qa + m.sampling} tasks
        </div>
      ),
      width: 150,
    },
  ];

  const handleConfirmAction = () => {
    console.log("Action:", actionModal);
    console.log("Comment:", comment);
    setActionModal(null);
    setComment("");
    // You can trigger API here based on actionModal === 'approve' or 'reject'
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        className="max-w-[1100px] m-4 p-10"
      >
        <div className="max-h-[80vh] overflow-y-auto">
          <div className="px-2 mb-6">
            <h1 className="flex items-center gap-2 text-heading">
              <Users className="h-5 w-5" />
              {selectedSubmission?.teamName} - Capacity Review
            </h1>
          </div>

          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <TargetIcon className="h-4 w-4 mt-2 text-blue-600" />
                    <div>
                      <div className="text-2xl font-bold">
                        {selectedSubmission?.metrics?.totalCodingTasks}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Coding Tasks
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-2 text-green-600" />
                    <div>
                      <div className="text-2xl font-bold">
                        {selectedSubmission?.metrics?.totalQACapacity}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        QA Capacity
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 mt-2 text-purple-600" />
                    <div>
                      <div className="text-2xl font-bold">
                        {selectedSubmission?.metrics?.samplingBalance}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Sampling Tasks
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <Users className="h-4 w-4 mt-2 text-orange-600" />
                    <div>
                      <div className="text-2xl font-bold">
                        {selectedSubmission?.teamMembers?.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Team Size
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <CommonTable
                  headers={teamMemberHeaders}
                  data={paginatedMembers}
                  rowIdAccessor="id"
                  emptyState="No team members found"
                />
              </CardContent>
            </Card>

            <div className="flex gap-4 pt-4 justify-between">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => setActionModal("approve")}
              >
                <CheckCircle className="h-4 w-4" />
                Approve
              </Button>
              <Button
                variant="error"
                className="flex-1"
                onClick={() => setActionModal("reject")}
              >
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!actionModal}
        onClose={() => setActionModal(null)}
        className="max-w-[500px] p-6"
        showCloseButton={false}
      >
        <h2 className="text-xl font-semibold mb-2">
          {actionModal === "approve"
            ? "Approve Submission"
            : "Reject Submission"}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {actionModal === "approve"
            ? "Are you sure you want to approve this capacity review? You can add an optional comment below."
            : "Please confirm the rejection and provide a reason in the comment section below."}
        </p>

        <div className="flex flex-col gap-2 mb-6">
          <Label className="text-sm font-medium">Comment</Label>
          <TextArea
            value={comment}
            onChange={(value) => setComment(value)}
            placeholder="Enter your comments..."
            className=""
          />
        </div>

        <div className="flex gap-3 justify-between">
          <Button variant="outline" onClick={() => setActionModal(null)}>
            Cancel
          </Button>
          <Button
            className={
              actionModal === "approve"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }
            onClick={handleConfirmAction}
          >
            {actionModal === "approve"
              ? "Confirm Approval"
              : "Confirm Rejection"}
          </Button>
        </div>
      </Modal>
    </>
  );
}

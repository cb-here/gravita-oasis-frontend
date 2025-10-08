import React, { useState } from "react";
import {
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  Edit,
  X,
  FileText,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SubmissionRecord, TeamMember } from "../types/planning";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card1/card";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Badge from "@/components/ui/badge/Badge";
import SearchableSelect from "@/components/form/SearchableSelect";
import { showToast } from "@/lib/toast";
import DateTimePicker from "@/components/common/DateTimePicker";
import { useModal } from "@/hooks/useModal";
import SubmitModal from "@/components/common/common-modals/SubmitModal";

interface PlanningTabProps {
  teamMembers: TeamMember[];
  setTeamMembers: (members: TeamMember[]) => void;
  onSubmit: (record: SubmissionRecord) => void;
}

const roles = [
  { value: "Coder", label: "Coder" },
  { value: "QA", label: "QA" },
  { value: "Coder/QA", label: "Coder/QA" },
];

export const getRoleColor = (role: string) => {
  switch (role) {
    case "Coder":
      return "primary";
    case "QA":
      return "success";
    case "Coder/QA":
      return "purple";
    default:
      return "info";
  }
};

export const PlanningTab: React.FC<PlanningTabProps> = ({
  teamMembers,
  setTeamMembers,
  onSubmit,
}) => {
  const submitModal = useModal();
  const [planningDate, setPlanningDate] = useState<Date | null>(new Date());
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState<Record<number, Partial<TeamMember>>>(
    {}
  );
  const [validationErrors, setValidationErrors] = useState<
    Record<number, Record<string, string>>
  >({});

  const metrics = React.useMemo(() => {
    const totalSamplingTasks = teamMembers.reduce(
      (sum, member) => sum + (member.sampling || 0),
      0
    );
    const totalQACapacity = teamMembers.reduce(
      (sum, member) =>
        member.role === "QA" || member.role === "Coder/QA"
          ? sum + member.qa
          : sum,
      0
    );

    const totalCodingTasks = teamMembers.reduce(
      (sum, member) => sum + (member.coding || 0),
      0
    );
    const totalCompleted = teamMembers.reduce(
      (sum, member) => sum + member.completed,
      0
    );
    const totalTargets = teamMembers.reduce(
      (sum, member) => sum + member.target,
      0
    );
    const overallPerformance =
      totalTargets > 0 ? Math.round((totalCompleted / totalTargets) * 100) : 0;

    const coderProductivityScore = totalCodingTasks * 2;
    const qaProductivityScore = totalQACapacity;
    const totalProductivityScore = coderProductivityScore + qaProductivityScore;

    return {
      totalSamplingTasks,
      totalQACapacity,
      samplingBalance: totalQACapacity - totalSamplingTasks,
      isBalanced: totalQACapacity >= totalSamplingTasks,
      totalCodingTasks,
      coderProductivityScore,
      qaProductivityScore,
      totalProductivityScore,
      totalCompleted,
      totalTargets,
      overallPerformance,
    };
  }, [teamMembers]);

  const validateMember = (
    memberData: Partial<TeamMember>,
    memberId: number
  ) => {
    const errors: Record<string, string> = {};
    const member = teamMembers.find((m) => m.id === memberId);
    if (!member) return errors;

    const maxTarget = (memberData.coding || 0) + (memberData.qa || 0);
    if ((memberData.target || 0) > maxTarget) {
      errors.target = `Target cannot exceed ${maxTarget} (coding + qa)`;
    }

    if (
      member.role === "Coder" &&
      (memberData.sampling || 0) > (memberData.coding || 0)
    ) {
      errors.sampling = `Sampling cannot exceed ${
        memberData.coding || 0
      } coding tasks`;
    }

    return errors;
  };

  const handleEditMode = () => {
    if (isEditMode) {
      setIsEditMode(false);
      setEditData({});
      setValidationErrors({});
    } else {
      setIsEditMode(true);
      const initialData: Record<number, TeamMember> = {};
      teamMembers.forEach((member) => {
        initialData[member.id] = { ...member };
      });
      setEditData(initialData);
    }
  };

  const handleSaveDraft = () => {
    showToast("success", "", "Draft saved successfully!");
    const allErrors: Record<number, Record<string, string>> = {};
    let hasErrors = false;

    Object.keys(editData).forEach((memberId) => {
      const errors = validateMember(
        editData[parseInt(memberId)],
        parseInt(memberId)
      );
      if (Object.keys(errors).length > 0) {
        allErrors[parseInt(memberId)] = errors;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setValidationErrors(allErrors);
      return;
    }

    const updatedMembers = teamMembers.map((member) => ({
      ...member,
      ...editData[member.id],
    }));
    setTeamMembers(updatedMembers);
    setIsEditMode(false);
    setEditData({});
    setValidationErrors({});
  };

  const handleSubmit = () => {
    const allErrors: Record<number, Record<string, string>> = {};
    let hasErrors = false;

    Object.keys(editData).forEach((memberId) => {
      const errors = validateMember(
        editData[parseInt(memberId)],
        parseInt(memberId)
      );
      if (Object.keys(errors).length > 0) {
        allErrors[parseInt(memberId)] = errors;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setValidationErrors(allErrors);
      return;
    }

    const updatedMembers = teamMembers.map((member) => ({
      ...member,
      ...editData[member.id],
    }));

    const submissionRecord: SubmissionRecord = {
      id: Date.now().toString(),
      timestamp: planningDate || new Date(),
      teamName: "Main Team",
      raisedBy: "Team Lead",
      teamMembers: updatedMembers,
      metrics: {
        totalCodingTasks: metrics.totalCodingTasks,
        totalQACapacity: metrics.totalQACapacity,
        totalTargets: metrics.totalTargets,
        totalCompleted: metrics.totalCompleted,
        overallPerformance: metrics.overallPerformance,
        samplingBalance: metrics.samplingBalance,
        isBalanced: metrics.isBalanced,
      },
      status: "pending",
    };

    setTeamMembers(updatedMembers);
    onSubmit(submissionRecord);
    setIsEditMode(false);
    setEditData({});
    setValidationErrors({});
  };

  const updateEditData = (
    id: number,
    field: keyof TeamMember,
    value: string | number
  ) => {
    const numValue = typeof value === "string" ? parseInt(value) || 0 : value;
    const updatedData = {
      ...editData,
      [id]: {
        ...editData[id],
        [field]: numValue,
      },
    };
    setEditData(updatedData);

    const errors = validateMember(updatedData[id], id);
    setValidationErrors((prev) => ({
      ...prev,
      [id]: errors,
    }));
  };

  const updateRole = (id: number, selectedOption: any) => {
    const newRole = selectedOption?.value || "Coder";
    const updatedData = {
      ...editData,
      [id]: {
        ...editData[id],
        role: newRole,
      },
    };
    setEditData(updatedData);

    // Reset dependent fields when role changes
    if (newRole === "QA") {
      updatedData[id].coding = 0;
      updatedData[id].sampling = 0;
    } else if (newRole === "Coder") {
      updatedData[id].qa = 0;
    }

    const errors = validateMember(updatedData[id], id);
    setValidationErrors((prev) => ({
      ...prev,
      [id]: errors,
    }));
  };

  const updateCompleted = (id: number, completed: number) => {
    const updatedMembers = teamMembers.map((member) =>
      member.id === id
        ? { ...member, completed: Math.max(0, completed) }
        : member
    );
    setTeamMembers(updatedMembers);
  };

  const getProductivityPercentage = (member: TeamMember) => {
    if (member.target === 0) return 0;
    return Math.round((member.completed / member.target) * 100);
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 100) return "success";
    if (percentage >= 80) return "warning";
    return "error";
  };

  const getSamplingPercentage = (member: TeamMember) => {
    if (member.coding === 0) return 0;
    return Math.round((member.sampling / member.coding) * 100);
  };

  const hasFieldError = (memberId: number, field: string) => {
    return validationErrors[memberId] && validationErrors[memberId][field];
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Team Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <span className="text-lg text-primary">
              Team Capacity & Performance
            </span>
          </CardTitle>
          <div className="flex gap-2">
            <DateTimePicker
              value={planningDate}
              onChange={setPlanningDate}
              mode="single"
              allowTime={false}
              onlyFuture={true}
              onlyPast={false}
              maxRangeDays={null}
              className="!w-[140px]"
            />
            {isEditMode ? (
              <>
                <Button
                  onClick={handleSaveDraft}
                  variant="outline"
                  size="sm"
                  className="whitespace-nowrap">
                  <FileText className="h-4 w-4" />
                  Save Draft
                </Button>
                <Button
                  onClick={() => {
                    submitModal.openModal();
                  }}
                  variant="gradient"
                  size="sm"
                  className="whitespace-nowrap">
                  <Send className="h-4 w-4" />
                  Submit
                </Button>
                <Button
                  onClick={handleEditMode}
                  variant="error"
                  size="sm"
                  className="whitespace-nowrap">
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleEditMode}
                  variant="outline"
                  size="sm"
                  className="whitespace-nowrap">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit All
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Member
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Role
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                    Coding
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                    QA Cap.
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                    Sampling
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                    Target
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                    Completed
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {teamMembers.map((member) => {
                  const productivity = getProductivityPercentage(member);
                  const samplingPercentage = getSamplingPercentage(member);
                  const currentData =
                    (editData[member.id] as TeamMember) || member;

                  return (
                    <tr
                      key={member.id}
                      className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="px-4 py-3 font-medium text-foreground">
                        {member.name}
                      </td>
                      <td className="px-4 py-3 text-center flex items-start justify-start">
                        {isEditMode ? (
                          <div className="min-w-[165px] max-w-[170px]">
                            <SearchableSelect
                              dataProps={{
                                optionData: roles.map((role: any) => ({
                                  _id: role.value,
                                  name: role.label,
                                })),
                              }}
                              selectionProps={{
                                selectedValue: {
                                  value: currentData.role,
                                  label: currentData.role,
                                },
                              }}
                              displayProps={{
                                placeholder: "Select Role",
                                id: `role-select-${member.id}`,
                                layoutProps: "w-[165px]",
                              }}
                              eventHandlers={{
                                onChange: (selectedOption: any) =>
                                  updateRole(member.id, selectedOption),
                              }}
                            />
                          </div>
                        ) : (
                          <Badge color={getRoleColor(member.role)}>
                            {member.role}
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isEditMode && currentData.role !== "QA" ? (
                          <Input
                            type="number"
                            value={currentData.coding || 0}
                            onChange={(e) =>
                              updateEditData(
                                member.id,
                                "coding",
                                e.target.value
                              )
                            }
                            className="!w-16 p-2 text-center text-sm"
                            min="0"
                          />
                        ) : (
                          <span
                            className={cn(
                              "font-medium",
                              member.coding > 0
                                ? "text-coder"
                                : "text-muted-foreground"
                            )}>
                            {member.coding || "-"}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isEditMode && currentData.role !== "Coder" ? (
                          <Input
                            type="number"
                            value={currentData.qa || 0}
                            onChange={(e) =>
                              updateEditData(member.id, "qa", e.target.value)
                            }
                            className="!w-16 p-2 text-center text-sm"
                            min="0"
                          />
                        ) : (
                          <span
                            className={cn(
                              "font-medium",
                              member.qa > 0
                                ? "text-qa"
                                : "text-muted-foreground"
                            )}>
                            {member.qa || "-"}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isEditMode && currentData.role === "Coder" ? (
                          <div className="space-y-1">
                            <Input
                              type="number"
                              value={currentData.sampling || 0}
                              onChange={(e) =>
                                updateEditData(
                                  member.id,
                                  "sampling",
                                  e.target.value
                                )
                              }
                              className={cn(
                                "!w-16 p-2 text-center text-sm",
                                hasFieldError(member.id, "sampling")
                                  ? "border-danger"
                                  : ""
                              )}
                              min="0"
                              // max={currentData.coding}
                            />
                            {hasFieldError(member.id, "sampling") && (
                              <div className="text-xs text-danger">
                                Max: {currentData.coding}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div
                            className={cn(
                              "font-medium",
                              member.sampling > 0
                                ? "text-expert"
                                : "text-muted-foreground"
                            )}>
                            {member.sampling > 0 ? (
                              <div className="space-y-1">
                                <div>{member.sampling}</div>
                                <div className="text-xs text-muted-foreground">
                                  ({samplingPercentage}%)
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div>-</div>
                                {member.role === "Coder/QA" && (
                                  <div className="text-xs text-muted-foreground">
                                    Expert
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isEditMode ? (
                          <div className="space-y-1">
                            <Input
                              type="number"
                              value={currentData.target || 0}
                              onChange={(e) =>
                                updateEditData(
                                  member.id,
                                  "target",
                                  e.target.value
                                )
                              }
                              className={cn(
                                "!w-16 p-2 text-center text-sm",
                                hasFieldError(member.id, "target")
                                  ? "border-danger"
                                  : ""
                              )}
                              min="0"
                            />
                            {hasFieldError(member.id, "target") && (
                              <div className="text-xs text-danger">
                                Max:{" "}
                                {(currentData.coding || 0) +
                                  (currentData.qa || 0)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="font-medium text-foreground">
                            {member.target}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Input
                          type="number"
                          value={member.completed}
                          onChange={(e) =>
                            updateCompleted(
                              member.id,
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="!w-16 p-2 text-center text-sm"
                          min="0"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge
                          className="text-xs"
                          color={getStatusColor(productivity)}>
                          {productivity}%
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Rest of the component remains the same */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <TrendingUp className="h-5 w-5 text-primary mr-2" />
            <CardTitle className="text-lg">Team Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Overall Performance
              </span>
              <Badge
                className="text-2xl font-bold px-3 py-1 rounded-lg"
                color={getStatusColor(metrics.overallPerformance)}>
                {metrics.overallPerformance}%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Completed/Target
              </span>
              <span className="text-lg font-bold text-foreground">
                {metrics.totalCompleted}/{metrics.totalTargets}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Team Size</span>
              <span className="text-lg font-bold text-foreground">
                {teamMembers.length} members
              </span>
            </div>
          </CardContent>
        </Card>

        <Card
          className={cn(
            metrics.isBalanced
              ? "bg-success-50 border-success-100"
              : "bg-error-100 border-error-100"
          )}>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            {metrics.isBalanced ? (
              <CheckCircle className="h-5 w-5 text-success-500 mr-2" />
            ) : (
              <XCircle className="h-5 w-5 text-danger mr-2" />
            )}
            <CardTitle className="text-lg">Sampling Balance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Sampling Tasks
              </span>
              <span className="text-lg font-bold">
                {metrics.totalSamplingTasks}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">QA Capacity</span>
              <span className="text-lg font-bold">
                {metrics.totalQACapacity}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700">
              <span className="font-medium">Balance</span>
              <span
                className={cn(
                  "font-bold text-lg",
                  metrics.isBalanced ? "text-success-500" : "text-error-500"
                )}>
                {metrics.samplingBalance >= 0 ? "+" : ""}
                {metrics.samplingBalance}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Productivity Analysis */}
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <Users className="h-5 w-5 text-purple-400 mr-2" />
            <CardTitle className="text-lg">Productivity Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-brand-500">Coder Score</span>
              <span className="text-lg font-bold text-brand-600">
                {metrics.coderProductivityScore}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-success-500">QA Score</span>
              <span className="text-lg font-bold text-success-500">
                {metrics.qaProductivityScore}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700">
              <span className="text-sm text-purple-500 font-medium">
                Total Score
              </span>
              <span className="text-2xl font-bold text-purple-500">
                {metrics.totalProductivityScore}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Workflow Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CheckCircle className="h-5 w-5 text-success-500 mr-2" />
            <CardTitle className="text-lg">Workflow Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Coding Tasks
              </span>
              <span className="text-brand-500 font-bold">
                {metrics.totalCodingTasks}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                For Sampling
              </span>
              <span className="text-purple-500 font-bold">
                {metrics.totalSamplingTasks}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">QA Capacity</span>
              <span className="text-success-500 font-bold">
                {metrics.totalQACapacity}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
              <div
                className={cn(
                  "text-sm font-medium",
                  metrics.isBalanced ? "text-success-500" : "text-error-500"
                )}>
                {metrics.isBalanced
                  ? "✓ Workflow Balanced"
                  : "⚠ Capacity Issue"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <SubmitModal
        isOpen={submitModal.isOpen}
        closeModal={submitModal.closeModal}
        title="Submit Capacity Plan"
        description="Are you sure you want to submit this capacity planning record? Once submitted, it will be sent for review."
        btnText="Confirm & Submit"
        onSubmit={async () => {
          await handleSubmit();
          submitModal.closeModal();
          showToast("success", "", "Capacity plan submitted successfully!");
        }}
      />
    </div>
  );
};

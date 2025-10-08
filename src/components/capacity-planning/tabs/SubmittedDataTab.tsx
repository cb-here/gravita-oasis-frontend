import React, { useState } from "react";
import { Database, Calendar, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SubmissionRecord } from "../types/planning";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card1/card";
import Badge from "@/components/ui/badge/Badge";
import { getRoleColor } from "./PlanningTab";

interface SubmittedDataTabProps {
  submissions: SubmissionRecord[];
}

export const SubmittedDataTab: React.FC<SubmittedDataTabProps> = ({
  submissions,
}) => {
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(
    null
  );

  const getStatusColor = (percentage: number) => {
    if (percentage >= 100) return "success";
    if (percentage >= 80) return "warning";
    return "error";
  };

  const toggleExpansion = (submissionId: string) => {
    setExpandedSubmission(
      expandedSubmission === submissionId ? null : submissionId
    );
  };

  if (submissions.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Submitted Data History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                No Submissions Yet
              </h3>
              <p className="text-sm text-muted-foreground">
                Submit your planning data from the Planning tab to see it appear
                here.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <span className="text-primary"> Submission History Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                    Coding Tasks
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                    QA Capacity
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                    Targets
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                    Completed
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                    Performance
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {submissions.map((submission) => {
                  const isExpanded = expandedSubmission === submission.id;
                  return (
                    <React.Fragment key={submission.id}>
                      <tr
                        className={cn(
                          "hover:bg-gray-100 dark:hover:bg-gray-800",
                          isExpanded &&
                            "bg-blue-50 dark:bg-blue-950/20 border-l-4 border-l-blue-500 dark:border-l-blue-400"
                        )}>
                        <td className="px-4 py-3 border-l-0">
                          <div className="flex items-start gap-2">
                            <Calendar className="h-4 w-4 text-gray-400 mt-1" />
                            <div>
                              <div className="font-medium text-foreground">
                                {format(
                                  new Date(submission.timestamp),
                                  "MMM dd, yyyy"
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {format(
                                  new Date(submission.timestamp),
                                  "HH:mm"
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center border-l-0">
                          <span className="font-bold text-coder">
                            {submission.metrics.totalCodingTasks}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center border-l-0">
                          <span className="font-bold text-qa">
                            {submission.metrics.totalQACapacity}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center border-l-0">
                          <span className="font-bold text-foreground">
                            {submission.metrics.totalTargets}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center border-l-0">
                          <span className="font-bold text-foreground">
                            {submission.metrics.totalCompleted}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center border-l-0">
                          <Badge
                            className="text-xs font-medium"
                            color={getStatusColor(
                              submission.metrics.overallPerformance
                            )}>
                            {submission.metrics.overallPerformance}%
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-center border-l-0">
                          <Badge
                            className="text-xs font-medium"
                            color="success">
                            Submitted
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-center border-l-0">
                          <button
                            onClick={() => toggleExpansion(submission.id)}
                            className="h-8 w-8 p-0">
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={8} className="p-0">
                            <div className="bg-gray-50 dark:bg-gray-900/50 border-y border-gray-200 dark:border-gray-700">
                              <div className="overflow-x-auto">
                                <table className="w-full">
                                  <thead className="bg-gray-100 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                                    <tr>
                                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Member
                                      </th>
                                      <th className="px-4 py-3 text-center font-medium text-muted-foreground">
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
                                    {submission.teamMembers.map((member) => {
                                      const productivity =
                                        member.target > 0
                                          ? Math.round(
                                              (member.completed /
                                                member.target) *
                                                100
                                            )
                                          : 0;
                                      const samplingPercentage =
                                        member.coding > 0
                                          ? Math.round(
                                              (member.sampling /
                                                member.coding) *
                                                100
                                            )
                                          : 0;

                                      return (
                                        <tr
                                          key={member.id}
                                          className="hover:bg-muted/30">
                                          <td className="px-4 py-3 font-medium text-foreground">
                                            {member.name}
                                          </td>
                                          <td className="px-4 py-3 text-center">
                                            <Badge
                                              className="text-xs font-medium border"
                                              color={getRoleColor(member.role)}>
                                              {member.role}
                                            </Badge>
                                          </td>
                                          <td className="px-4 py-3 text-center">
                                            <span
                                              className={cn(
                                                "font-medium",
                                                member.coding > 0
                                                  ? "text-coder"
                                                  : "text-muted-foreground"
                                              )}>
                                              {member.coding || "-"}
                                            </span>
                                          </td>
                                          <td className="px-4 py-3 text-center">
                                            <span
                                              className={cn(
                                                "font-medium",
                                                member.qa > 0
                                                  ? "text-qa"
                                                  : "text-muted-foreground"
                                              )}>
                                              {member.qa || "-"}
                                            </span>
                                          </td>
                                          <td className="px-4 py-3 text-center">
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
                                                  {member.role ===
                                                    "Coder/QA" && (
                                                    <div className="text-xs text-muted-foreground">
                                                      Expert
                                                    </div>
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          </td>
                                          <td className="px-4 py-3 text-center">
                                            <span className="font-medium text-foreground">
                                              {member.target}
                                            </span>
                                          </td>
                                          <td className="px-4 py-3 text-center">
                                            <span className="font-medium text-foreground">
                                              {member.completed}
                                            </span>
                                          </td>
                                          <td className="px-4 py-3 text-center">
                                            <Badge
                                              className=" text-xs font-medium"
                                              color={getStatusColor(
                                                productivity
                                              )}>
                                              {productivity}%
                                            </Badge>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

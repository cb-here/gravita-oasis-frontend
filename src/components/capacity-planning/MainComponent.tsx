"use client";

import { Database, FileClock, FileEdit, ListChecks } from "lucide-react";
import React, { useState, useEffect } from "react";
import Tabs from "../common/tabs/Tabs";
import { PlanningTab } from "./tabs/PlanningTab";
import { TeamMember, SubmissionRecord } from "./types/planning";
import { SubmittedDataTab } from "./tabs/SubmittedDataTab";
import { AdminApprovalTab } from "./tabs/AdminApprovalTab";
import { AdminHistoryTab } from "./tabs/AdminHistoryTab";

// Define types for our data structures
interface Team {
  _id: string;
  name: string;
}

interface MockTeamMember {
  id: number;
  name: string;
}

interface MockTeamMembers {
  [key: string]: MockTeamMember[];
}

const tabGroups = [
  // for manager
  { key: "create", name: "Create & Edit Plan", icon: FileEdit },
  { key: "submittedData", name: "Submitted Data", icon: Database },
  // for admin
  { key: "approvalQueue", name: "Approval Queue", icon: ListChecks },
  { key: "approvalHistory", name: "Approval History", icon: FileClock },
];

const teams: Team[] = [
  { _id: "1", name: "Development Team" },
  { _id: "2", name: "Design Team" },
  { _id: "3", name: "Marketing Team" },
  { _id: "4", name: "QA Team" },
];

const mockTeamMembers: MockTeamMembers = {
  "1": [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Mike Johnson" },
  ],
  "2": [
    { id: 4, name: "Alice Designer" },
    { id: 5, name: "Bob Artist" },
  ],
  "3": [
    { id: 6, name: "Carol Marketer" },
    { id: 7, name: "David Promoter" },
    { id: 8, name: "Eve Analyst" },
    { id: 9, name: "Frank Strategist" },
  ],
  "4": [
    { id: 10, name: "Grace Tester" },
    { id: 11, name: "Henry Reviewer" },
  ],
};

export default function MainComponent() {
  const [activeTab, setActiveTab] = useState("create");
  const [selectedTeam] = useState<Team>(teams[0]);
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([
    {
      id: "sub-001",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 * 7), // 7 weeks ago
      teamName: "Main Team",
      raisedBy: "Team Lead",
      teamMembers: [
        {
          id: 1,
          name: "John",
          role: "Coder",
          coding: 8,
          qa: 0,
          sampling: 6,
          target: 8,
          completed: 6,
        },
        {
          id: 2,
          name: "Mary",
          role: "Coder",
          coding: 10,
          qa: 0,
          sampling: 8,
          target: 10,
          completed: 9,
        },
        {
          id: 3,
          name: "Yadulla",
          role: "QA",
          coding: 0,
          qa: 15,
          sampling: 0,
          target: 15,
          completed: 12,
        },
        {
          id: 4,
          name: "Sufiyan",
          role: "QA",
          coding: 0,
          qa: 12,
          sampling: 0,
          target: 12,
          completed: 10,
        },
        {
          id: 5,
          name: "Anil",
          role: "Coder/QA",
          coding: 6,
          qa: 8,
          sampling: 0,
          target: 14,
          completed: 12,
        },
      ],
      metrics: {
        totalCodingTasks: 18,
        totalQACapacity: 35,
        totalTargets: 59,
        totalCompleted: 49,
        overallPerformance: 83.1,
        samplingBalance: 14,
        isBalanced: true,
      },
      status: "approved",
    },
    {
      id: "sub-002",
      timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 * 7), // 6 weeks ago
      teamName: "Main Team",
      raisedBy: "Team Lead",
      teamMembers: [
        {
          id: 1,
          name: "John",
          role: "Coder",
          coding: 8,
          qa: 0,
          sampling: 6,
          target: 8,
          completed: 7,
        },
        {
          id: 2,
          name: "Mary",
          role: "Coder",
          coding: 10,
          qa: 0,
          sampling: 8,
          target: 10,
          completed: 11,
        },
        {
          id: 3,
          name: "Yadulla",
          role: "QA",
          coding: 0,
          qa: 15,
          sampling: 0,
          target: 15,
          completed: 14,
        },
        {
          id: 4,
          name: "Sufiyan",
          role: "QA",
          coding: 0,
          qa: 12,
          sampling: 0,
          target: 12,
          completed: 11,
        },
        {
          id: 5,
          name: "Anil",
          role: "Coder/QA",
          coding: 6,
          qa: 8,
          sampling: 0,
          target: 14,
          completed: 13,
        },
      ],
      metrics: {
        totalCodingTasks: 18,
        totalQACapacity: 35,
        totalTargets: 59,
        totalCompleted: 56,
        overallPerformance: 94.9,
        samplingBalance: 14,
        isBalanced: true,
      },
      status: "approved",
    },
    {
      id: "sub-003",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 * 7), // 5 weeks ago
      teamName: "Main Team",
      raisedBy: "Team Lead",
      teamMembers: [
        {
          id: 1,
          name: "John",
          role: "Coder",
          coding: 8,
          qa: 0,
          sampling: 6,
          target: 8,
          completed: 8,
        },
        {
          id: 2,
          name: "Mary",
          role: "Coder",
          coding: 10,
          qa: 0,
          sampling: 8,
          target: 10,
          completed: 12,
        },
        {
          id: 3,
          name: "Yadulla",
          role: "QA",
          coding: 0,
          qa: 15,
          sampling: 0,
          target: 15,
          completed: 16,
        },
        {
          id: 4,
          name: "Sufiyan",
          role: "QA",
          coding: 0,
          qa: 12,
          sampling: 0,
          target: 12,
          completed: 9,
        },
        {
          id: 5,
          name: "Anil",
          role: "Coder/QA",
          coding: 6,
          qa: 8,
          sampling: 0,
          target: 14,
          completed: 15,
        },
      ],
      metrics: {
        totalCodingTasks: 18,
        totalQACapacity: 35,
        totalTargets: 59,
        totalCompleted: 60,
        overallPerformance: 101.7,
        samplingBalance: 14,
        isBalanced: true,
      },
      status: "approved",
    },
    {
      id: "sub-004",
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 * 7), // 4 weeks ago
      teamName: "Main Team",
      raisedBy: "Team Lead",
      teamMembers: [
        {
          id: 1,
          name: "John",
          role: "Coder",
          coding: 8,
          qa: 0,
          sampling: 6,
          target: 8,
          completed: 5,
        },
        {
          id: 2,
          name: "Mary",
          role: "Coder",
          coding: 10,
          qa: 0,
          sampling: 8,
          target: 10,
          completed: 8,
        },
        {
          id: 3,
          name: "Yadulla",
          role: "QA",
          coding: 0,
          qa: 15,
          sampling: 0,
          target: 15,
          completed: 13,
        },
        {
          id: 4,
          name: "Sufiyan",
          role: "QA",
          coding: 0,
          qa: 12,
          sampling: 0,
          target: 12,
          completed: 12,
        },
        {
          id: 5,
          name: "Anil",
          role: "Coder/QA",
          coding: 6,
          qa: 8,
          sampling: 0,
          target: 14,
          completed: 14,
        },
      ],
      metrics: {
        totalCodingTasks: 18,
        totalQACapacity: 35,
        totalTargets: 59,
        totalCompleted: 52,
        overallPerformance: 88.1,
        samplingBalance: 14,
        isBalanced: true,
      },
      status: "approved",
    },
    {
      id: "sub-005",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 * 7), // 3 weeks ago
      teamName: "Main Team",
      raisedBy: "Team Lead",
      teamMembers: [
        {
          id: 1,
          name: "John",
          role: "Coder",
          coding: 8,
          qa: 0,
          sampling: 6,
          target: 8,
          completed: 9,
        },
        {
          id: 2,
          name: "Mary",
          role: "Coder",
          coding: 10,
          qa: 0,
          sampling: 8,
          target: 10,
          completed: 13,
        },
        {
          id: 3,
          name: "Yadulla",
          role: "QA",
          coding: 0,
          qa: 15,
          sampling: 0,
          target: 15,
          completed: 17,
        },
        {
          id: 4,
          name: "Sufiyan",
          role: "QA",
          coding: 0,
          qa: 12,
          sampling: 0,
          target: 12,
          completed: 14,
        },
        {
          id: 5,
          name: "Anil",
          role: "Coder/QA",
          coding: 6,
          qa: 8,
          sampling: 0,
          target: 14,
          completed: 16,
        },
      ],
      metrics: {
        totalCodingTasks: 18,
        totalQACapacity: 35,
        totalTargets: 59,
        totalCompleted: 69,
        overallPerformance: 116.9,
        samplingBalance: 14,
        isBalanced: true,
      },
      status: "approved",
    },
    {
      id: "sub-006",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 * 7), // 2 weeks ago
      teamName: "Main Team",
      raisedBy: "Team Lead",
      teamMembers: [
        {
          id: 1,
          name: "John",
          role: "Coder",
          coding: 8,
          qa: 0,
          sampling: 6,
          target: 8,
          completed: 7,
        },
        {
          id: 2,
          name: "Mary",
          role: "Coder",
          coding: 10,
          qa: 0,
          sampling: 8,
          target: 10,
          completed: 10,
        },
        {
          id: 3,
          name: "Yadulla",
          role: "QA",
          coding: 0,
          qa: 15,
          sampling: 0,
          target: 15,
          completed: 15,
        },
        {
          id: 4,
          name: "Sufiyan",
          role: "QA",
          coding: 0,
          qa: 12,
          sampling: 0,
          target: 12,
          completed: 13,
        },
        {
          id: 5,
          name: "Anil",
          role: "Coder/QA",
          coding: 6,
          qa: 8,
          sampling: 0,
          target: 14,
          completed: 17,
        },
      ],
      metrics: {
        totalCodingTasks: 18,
        totalQACapacity: 35,
        totalTargets: 59,
        totalCompleted: 62,
        overallPerformance: 105.1,
        samplingBalance: 14,
        isBalanced: true,
      },
      status: "approved",
    },
    {
      id: "sub-007",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 * 7), // 1 week ago
      teamName: "Main Team",
      raisedBy: "Team Lead",
      teamMembers: [
        {
          id: 1,
          name: "John",
          role: "Coder",
          coding: 8,
          qa: 0,
          sampling: 6,
          target: 8,
          completed: 8,
        },
        {
          id: 2,
          name: "Mary",
          role: "Coder",
          coding: 10,
          qa: 0,
          sampling: 8,
          target: 10,
          completed: 11,
        },
        {
          id: 3,
          name: "Yadulla",
          role: "QA",
          coding: 0,
          qa: 15,
          sampling: 0,
          target: 15,
          completed: 14,
        },
        {
          id: 4,
          name: "Sufiyan",
          role: "QA",
          coding: 0,
          qa: 12,
          sampling: 0,
          target: 12,
          completed: 11,
        },
        {
          id: 5,
          name: "Anil",
          role: "Coder/QA",
          coding: 6,
          qa: 8,
          sampling: 0,
          target: 14,
          completed: 15,
        },
      ],
      metrics: {
        totalCodingTasks: 18,
        totalQACapacity: 35,
        totalTargets: 59,
        totalCompleted: 59,
        overallPerformance: 100.0,
        samplingBalance: 14,
        isBalanced: true,
      },
      status: "approved",
    },
    {
      id: "sub-008",
      timestamp: new Date(Date.now() - 0 * 24 * 60 * 60 * 1000 * 7), // Current week
      teamName: "Main Team",
      raisedBy: "Team Lead",
      teamMembers: [
        {
          id: 1,
          name: "John",
          role: "Coder",
          coding: 8,
          qa: 0,
          sampling: 6,
          target: 8,
          completed: 9,
        },
        {
          id: 2,
          name: "Mary",
          role: "Coder",
          coding: 10,
          qa: 0,
          sampling: 8,
          target: 10,
          completed: 14,
        },
        {
          id: 3,
          name: "Yadulla",
          role: "QA",
          coding: 0,
          qa: 15,
          sampling: 0,
          target: 15,
          completed: 18,
        },
        {
          id: 4,
          name: "Sufiyan",
          role: "QA",
          coding: 0,
          qa: 12,
          sampling: 0,
          target: 12,
          completed: 10,
        },
        {
          id: 5,
          name: "Anil",
          role: "Coder/QA",
          coding: 6,
          qa: 8,
          sampling: 0,
          target: 14,
          completed: 16,
        },
      ],
      metrics: {
        totalCodingTasks: 18,
        totalQACapacity: 35,
        totalTargets: 59,
        totalCompleted: 67,
        overallPerformance: 113.6,
        samplingBalance: 14,
        isBalanced: true,
      },
      status: "pending",
    },
  ]);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: 1,
      name: "John",
      role: "Coder",
      coding: 8,
      qa: 0,
      sampling: 6,
      target: 8,
      completed: 5,
    },
    {
      id: 2,
      name: "Mary",
      role: "Coder",
      coding: 10,
      qa: 0,
      sampling: 8,
      target: 10,
      completed: 12,
    },
    {
      id: 3,
      name: "Yadulla",
      role: "QA",
      coding: 0,
      qa: 15,
      sampling: 0,
      target: 15,
      completed: 14,
    },
    {
      id: 4,
      name: "Sufiyan",
      role: "QA",
      coding: 0,
      qa: 12,
      sampling: 0,
      target: 12,
      completed: 8,
    },
    {
      id: 5,
      name: "Anil",
      role: "Coder/QA",
      coding: 6,
      qa: 8,
      sampling: 0,
      target: 14,
      completed: 16,
    },
  ]);

  useEffect(() => {
    if (selectedTeam && selectedTeam._id) {
      const teamMembersData = mockTeamMembers[selectedTeam._id] || [];
      // Reset team members when team changes - you can customize this logic
      // based on whether you want to preserve existing data or load new data
      if (teamMembersData.length > 0 && teamMembers.length === 0) {
        setTeamMembers(
          teamMembersData.map((m) => ({
            id: m.id,
            name: m.name,
            role: "Coder", // Default role
            coding: 0,
            qa: 0,
            sampling: 0,
            target: 0,
            completed: 0,
          }))
        );
      }
    }
  }, [selectedTeam, teamMembers.length]);

  const handleSubmission = (record: SubmissionRecord) => {
    setSubmissions((prev) => [...prev, record]);
  };

  const handleApprovalAction = (
    submissionId: string,
    action: "approve" | "reject",
    comments?: string
  ) => {
    setSubmissions((prev) =>
      prev.map((submission) => {
        if (submission.id === submissionId) {
          return {
            ...submission,
            status: action === "approve" ? "approved" : "rejected",
            adminApproval: {
              approvedBy: "Admin User",
              approvedAt: new Date(),
              comments: comments || "",
            },
          };
        }
        return submission;
      })
    );
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="w-fit">
        <Tabs
          tabGroups={tabGroups}
          selectedTabGroup={activeTab}
          setSelectedTabGroup={setActiveTab}
        />
      </div>

      {activeTab === "create" ? (
        <PlanningTab
          teamMembers={teamMembers}
          setTeamMembers={setTeamMembers}
          onSubmit={handleSubmission}
        />
      ) : activeTab === "submittedData" ? (
        <SubmittedDataTab submissions={submissions} />
      ) : activeTab === "approvalQueue" ? (
        <AdminApprovalTab
          submissions={submissions}
          onApprovalAction={handleApprovalAction}
        />
      ) : (
        <AdminHistoryTab submissions={submissions} />
      )}
    </div>
  );
}

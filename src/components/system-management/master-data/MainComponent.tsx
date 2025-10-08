"use client";

import { useState } from "react";
import { StatusColor } from "@/type/commonUseType";
import Tabs from "@/components/common/tabs/Tabs";
import Projects from "./tabs/Projects";
import InsuranceType from "./tabs/InsuranceType";
import TeamManagement from "./tabs/TeamManagement";
import RoleManagement from "./tabs/RoleManagement";
import ErrorManagement from "./tabs/ErrorManagement";
import HoldReasons from "./tabs/HoldReasons";

export const tagsColors: StatusColor[] = [
  "primary",
  "success",
  "info",
  "warning",
  "midnight",
  "dark",
  "neutral",
  "cyan",
  "storm",
  "purple",
  "teal",
  "lime",
  "jade",
  "yellow",
  "slate",
  "lavender",
];

export const hashStringToIndex = (str: string, max: number): number => {
  let hash = 0;
  for (let i = 0; i < str?.length; i++) {
    hash = str?.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % max;
};

export const getTagsColor = (tag: string | { value: string }): StatusColor => {
  const value = typeof tag === "string" ? tag : tag?.value;
  const index = hashStringToIndex(value?.toLowerCase(), tagsColors.length);
  return tagsColors[index];
};

export default function MainComponent() {
  const [activeTab, setActiveTab] = useState("Project");

  const tabGroups = [
    { name: "Project", key: "Project" },
    { name: "Insurance Type", key: "Insurance" },
    { name: "Team Management", key: "Team" },
    { name: "Role Management", key: "Role" },
    { name: "Error Category Management", key: "Error" },
    { name: "Hold Reasons", key: "Hold" },
  ];

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] lg:p-4 p-2">
      <div className="mb-6">
        <h2 className="text-heading">Master Data Management</h2>
        <p className="text-subtitle">Own Your Day with Effortless Planning</p>
      </div>
      <div className="w-fit mb-6">
        <Tabs
          tabGroups={tabGroups}
          selectedTabGroup={activeTab}
          onClick={handleTabClick}
        />
      </div>
      {activeTab === "Project" ? (
        <Projects />
      ) : activeTab === "Insurance" ? (
        <InsuranceType />
      ) : activeTab === "Team" ? (
        <TeamManagement />
      ) : activeTab === "Role" ? (
        <RoleManagement />
      ) : activeTab === "Error" ? (
        <ErrorManagement />
      ) : activeTab === "Hold" ? (
        <HoldReasons />
      ) : null}
    </div>
  );
}

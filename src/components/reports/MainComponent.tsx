"use client";

import { useState } from "react";
import Tabs from "../common/tabs/Tabs";
import HoldReports from "./hold-reports/HoldReports";
import RevenueReports from "./revenue-reports/RevenueReports";
import TaskReports from "./task-reports/TaskReports";
import CoderPersona from "./coder-persona/MainComponent";
import ErrorReports from "./error-reports/ErrorReports";

export default function MainComponent() {
  const [activeTab, setActiveTab] = useState("Hold");

  const tabGroups = [
    { name: "Hold Reports", key: "Hold" },
    { name: "Coder Persona", key: "coderPersona" },
    { name: "Error Reports", key: "Error" },
    { name: "Revenue Reports", key: "Revenue" },
    { name: "Task Reports", key: "Task" },
  ];

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
  };
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="w-fit mb-6">
        <Tabs
          tabGroups={tabGroups}
          selectedTabGroup={activeTab}
          onClick={handleTabClick}
        />
      </div>
      {activeTab === "Hold" ? (
        <HoldReports />
      ) : activeTab === "coderPersona" ? (
        <CoderPersona />
      ) : activeTab === "Error" ? (
        <ErrorReports />
      ) : activeTab === "Revenue" ? (
        <RevenueReports />
      ) : activeTab === "Task" ? (
        <TaskReports />
      ) : null}
    </div>
  );
}

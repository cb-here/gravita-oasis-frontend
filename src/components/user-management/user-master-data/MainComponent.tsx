"use client";

import { useState } from "react";
import Tabs from "@/components/common/tabs/Tabs";
import Documents from "./tabs/Documents";

export default function MainComponent() {
  const [activeTab, setActiveTab] = useState("Documents");

  const tabGroups = [{ name: "Documents", key: "Documents" }];

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] lg:p-4 p-2">
      <div className="mb-6">
        <h2 className="text-heading">User Master Data</h2>
        <p className="text-subtitle">Manage system-wide document templates and master data configurations</p>
      </div>
      <div className="w-fit mb-6">
        <Tabs
          tabGroups={tabGroups}
          selectedTabGroup={activeTab}
          onClick={handleTabClick}
        />
      </div>
      {activeTab === "Documents" ? <Documents /> : null}
    </div>
  );
}

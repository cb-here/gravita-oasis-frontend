"use client";

import React, { useState } from "react";
import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import Tabs from "../common/tabs/Tabs";
import Documents from "../user-management/user-list/user-details/tabs/Documents";

export default function MainComponent() {
  const [activeTab, setActiveTab] = useState<string>("Overview");

  const tabGroups = [
    { name: "Overview", key: "Overview" },
    { name: "Your Documents", key: "Documents" },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <UserMetaCard />
        <div className="w-fit">
          <Tabs
            tabGroups={tabGroups}
            selectedTabGroup={activeTab}
            onClick={setActiveTab}
          />
        </div>
        {activeTab === "Overview" ? (
          <>
            <UserInfoCard />
            <UserAddressCard />
          </>
        ) : (
          <Documents isUserProfile={true} />
        )}
      </div>
    </div>
  );
}

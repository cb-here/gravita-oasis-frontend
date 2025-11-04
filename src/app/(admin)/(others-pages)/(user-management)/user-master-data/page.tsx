import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MainComponent from "@/components/user-management/user-master-data/MainComponent";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "User Master Data",
  description: "This is User Master Data page for Gravita",
};

export default function UserMasterData() {
  return (
    <div>
      <PageBreadcrumb pageTitle="User Master Data" />
      <MainComponent />
    </div>
  );
}

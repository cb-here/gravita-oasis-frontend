import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MainComponent from "@/components/task/bulk-creation-log/MainComponent";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Bulk Creation Log",
  description: "This is Bulk Creation Log page for Gravita",
};

export default function AccessGroupsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Bulk Creation Log" />
      <MainComponent />
    </div>
  );
}

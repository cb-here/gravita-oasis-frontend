import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MainComponent from "@/components/task/unassigned-task/MainComponent";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Unassigned Task",
  description: "This is unassigned task page for Gravita",
};

export default function AccessGroupsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Unassigned Task" />
      <MainComponent />
    </div>
  );
}

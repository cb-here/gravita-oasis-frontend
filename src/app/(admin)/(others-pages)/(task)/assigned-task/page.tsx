import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MainComponent from "@/components/task/assigned-task/MainComponent";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Assigned Task",
  description: "This is unassigned task page for Gravita",
};

export default function AccessGroupsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Assigned Task" />
      <MainComponent />
    </div>
  );
}

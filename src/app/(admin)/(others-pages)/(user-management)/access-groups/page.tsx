import MainComponent from "@/components/user-management/access-groups/MainComponent";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Access Groups",
  description: "This is accessGroups page for Gravita",
};

export default function AccessGroupsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Access Groups" />
      <MainComponent />
    </div>
  );
}

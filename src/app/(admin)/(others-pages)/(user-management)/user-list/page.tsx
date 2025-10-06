import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MainComponent from "@/components//user-management/user-list/MainComponent";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "User List",
  description: "This is user page for Gravita",
};

export default function AccessGroupsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="User List" />
      <MainComponent />
    </div>
  );
}

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MainComponent from "@/components/system-management/master-data/MainComponent";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Master Data",
  description: "This is master page for Gravita",
};

export default function AccessGroupsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Master Data" />
      <MainComponent />
    </div>
  );
}

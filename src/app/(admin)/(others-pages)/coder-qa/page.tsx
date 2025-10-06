import MainComponent from "@/components/coder-qa/MainComponent";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Coder/QA",
  description: "This is coder/qa page for Gravita",
};

export default function AccessGroupsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Coder/QA" />
      <MainComponent />
    </div>
  );
}

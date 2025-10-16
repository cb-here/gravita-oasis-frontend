import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import { Metadata } from "next";
import MainComponent from "@/components/organization-structure/MainComponent";

export const metadata: Metadata = {
  title: "Organization | Gravita Oasis ",
  description: "This is Organization page for Gravita Oasis",
};

export default function ReportPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Organization" />
      <MainComponent />
    </div>
  );
}

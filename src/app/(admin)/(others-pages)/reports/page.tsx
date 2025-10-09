import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import { Metadata } from "next";
import MainComponent from "@/components/reports/MainComponent";

export const metadata: Metadata = {
  title: "Reports | Gravita Oasis ",
  description: "This is Reports page for Gravita Oasis",
};

export default function ReportPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Reports" />
      <MainComponent />
    </div>
  );
}

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AngleDividerBreadCrumb from "@/components/ui/breadcrumb/AngleDividerBreadCrumb";
import BreadCrumbWithIcon from "@/components/ui/breadcrumb/BreadCrumbWithIcon";
import DefaultBreadCrumbExample from "@/components/ui/breadcrumb/DefaultBreadCrumbExample";
import DottedDividerBreadcrumb from "@/components/ui/breadcrumb/DottedDividerBreadcrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Gravity Oasis Breadcrumbs | TailAdmin - Gravity Oasis Dashboard Template",
  description:
    "This is Gravity Oasis Breadcrumbs page for TailAdmin - Gravity Oasis Tailwind CSS Admin Dashboard Template",
  // other metadata
};

export default function Breadcrumb() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Breadcrumb" />
      <div className="space-y-5 sm:space-y-6">
        <DefaultBreadCrumbExample />
        <BreadCrumbWithIcon />
        <AngleDividerBreadCrumb />
        <DottedDividerBreadcrumb />
      </div>
    </div>
  );
}

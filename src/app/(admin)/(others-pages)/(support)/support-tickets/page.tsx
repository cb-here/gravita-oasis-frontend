import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SupportTicketsList from "@/components/support/SupportList";
import SupportMetrics from "@/components/support/SupportMetrics";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Gravity Oasis Support List | TailAdmin - Gravity Oasis Admin Dashboard Template",
  description:
    "This is Gravity Oasis Support List for TailAdmin - Gravity Oasis Tailwind CSS Admin Dashboard Template",
};

export default function SupportListPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Support List" />
      <SupportMetrics />
      <SupportTicketsList />
    </div>
  );
}

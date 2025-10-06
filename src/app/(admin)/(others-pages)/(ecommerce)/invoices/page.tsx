import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import InvoiceListTable from "@/components/invoice/InvoiceList";
import InvoiceMetrics from "@/components/invoice/InvoiceMetrics";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title:
    "Gravity Oasis E-commerce  Invoices | TailAdmin - Gravity Oasis Dashboard Template",
  description:
    "This is Gravity Oasis E-commerce  Invoices TailAdmin Dashboard Template",
};

export default function InvoicesPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Invoices" />
      <InvoiceMetrics />
      <InvoiceListTable />
    </div>
  );
}

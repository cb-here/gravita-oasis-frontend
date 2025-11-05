import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import { Metadata } from "next";
import MainComponent from "@/components/sales/invoice/MainComponent";

export const metadata: Metadata = {
  title: "Invoice | Gravita Oasis ",
  description: "This is Invoice page for Gravita Oasis",
};

export default function InvoicePage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Invoice" />
      <MainComponent />
    </div>
  );
}

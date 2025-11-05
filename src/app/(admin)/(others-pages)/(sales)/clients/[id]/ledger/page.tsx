import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import { Metadata } from "next";
import MainComponent from "@/components/sales/clients/ledger-statement/MainComponent";

export const metadata: Metadata = {
  title: "Ledger Statement | Gravita Oasis ",
  description: "This is Ledger Statement page for Gravita Oasis",
};

export default function LedgerStatement() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Ledger Statement" />
      <MainComponent />
    </div>
  );
}

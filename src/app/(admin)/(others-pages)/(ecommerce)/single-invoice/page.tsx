import InvoiceMain from "@/components/invoice/InvoiceMain";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title:
    "Gravity Oasis E-commerce Single Invoice | TailAdmin - Gravity Oasis Dashboard Template",
  description:
    "This is Gravity Oasis E-commerce  Single Invoice TailAdmin Dashboard Template",
};

export default function SingleInvoicePage() {
  return (
    <div>
      <InvoiceMain />
    </div>
  );
}

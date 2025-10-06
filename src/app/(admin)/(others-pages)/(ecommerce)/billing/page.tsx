import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BillingInfo from "@/components/ecommerce/billing/BillingInfo";
import BillingPlan from "@/components/ecommerce/billing/BillingPlan";
import InvoiceTable from "@/components/ecommerce/billing/InvoiceTable";
import PaymentMethod from "@/components/ecommerce/billing/PaymentMethod";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Gravity Oasis E-commerce  Billing | TailAdmin - Gravity Oasis Dashboard Template",
  description:
    "This is Gravity Oasis E-commerce  Billing TailAdmin Dashboard Template",
};

export default function BillingPages() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Billing" />
      <div className="mb-6 flex flex-col gap-6 xl:flex-row">
        <BillingPlan />
        <BillingInfo />
      </div>
      <PaymentMethod />
      <InvoiceTable />
    </div>
  );
}

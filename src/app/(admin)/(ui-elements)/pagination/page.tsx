import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PaginationExample from "@/components/ui/pagination/PaginationExample";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Gravity Oasis Pagination | TailAdmin - Gravity Oasis Dashboard Template",
  description:
    "This is Gravity Oasis Pagination page for TailAdmin - Gravity Oasis Tailwind CSS Admin Dashboard Template",
};

export default function Pagination() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Pagination" />
      <PaginationExample />
    </div>
  );
}

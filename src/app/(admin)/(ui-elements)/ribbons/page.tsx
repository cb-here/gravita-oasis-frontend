import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import RibbonExample from "@/components/ui/ribbons";

import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Gravity Oasis Ribbons | TailAdmin - Gravity Oasis Dashboard Template",
  description:
    "This is Gravity Oasis Spinners page for TailAdmin - Gravity Oasis Tailwind CSS Admin Dashboard Template",
};

export default function Ribbons() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Ribbons" />
      <RibbonExample />
    </div>
  );
}

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DefaultTooltip from "@/components/ui/tooltip/DefaultTooltip";
import TooltipPlacement from "@/components/ui/tooltip/TooltipPlacement";
import WhiteAndDarkTooltip from "@/components/ui/tooltip/WhiteAndDarkTooltip";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Gravity Oasis Tooltips | TailAdmin - Gravity Oasis Dashboard Template",
  description:
    "This is Gravity Oasis Tooltips page for TailAdmin - Gravity Oasis Tailwind CSS Admin Dashboard Template",
};

export default function Tooltips() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Tooltip" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Default Tooltip">
          <DefaultTooltip />
        </ComponentCard>
        <ComponentCard title="White and Dark Tooltip">
          <WhiteAndDarkTooltip />
        </ComponentCard>
        <ComponentCard title="Tooltip Placement">
          <TooltipPlacement />
        </ComponentCard>
      </div>
    </div>
  );
}

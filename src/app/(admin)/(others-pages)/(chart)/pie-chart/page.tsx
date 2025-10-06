import PieChartOne from "@/components/charts/pie/PieChartOne";
import PieChartTwo from "@/components/charts/pie/PieChartTwo";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Gravity Oasis Pie Chart | TailAdmin - Gravity Oasis Dashboard Template",
  description:
    "This is Gravity Oasis Pie Chart page for TailAdmin - Gravity Oasis Tailwind CSS Admin Dashboard Template",
};

export default function PieChart() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Pie Chart" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ComponentCard title="Pie Chart 1">
          <PieChartOne />
        </ComponentCard>
        <ComponentCard title="Pie Chart 2">
          <PieChartTwo />
        </ComponentCard>
      </div>
    </div>
  );
}

import LineChartOne from "@/components/charts/line/LineChartOne";
import LineChartThree from "@/components/charts/line/LineChartThree";
import LineChartTwo from "@/components/charts/line/LineChartTwo";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Gravity Oasis Line Chart | TailAdmin - Gravity Oasis Dashboard Template",
  description:
    "This is Gravity Oasis Line Chart page for TailAdmin - Gravity Oasis Tailwind CSS Admin Dashboard Template",
};
export default function LineChart() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Line Chart" />
      <div className="space-y-6 overflow-x-hidden">
        <ComponentCard title="Line Chart 1">
          <LineChartOne />
        </ComponentCard>
        <ComponentCard title="Line Chart 2">
          <LineChartTwo />
        </ComponentCard>
        <ComponentCard title="Line Chart 3">
          <LineChartThree />
        </ComponentCard>
      </div>
    </div>
  );
}

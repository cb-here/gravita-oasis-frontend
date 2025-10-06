
import MainComponent from "@/components/capacity-planning/MainComponent";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Capacity Planning",
  description: "This is Capacity Planning page for Gravita",
};

export default function CapacityPlanning() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Capacity Planning" />
      <MainComponent />
    </div>
  );
}

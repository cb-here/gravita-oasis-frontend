import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import { Metadata } from "next";
import MainComponent from "@/components/sales/clients/modals/MainComponent";

export const metadata: Metadata = {
  title: "Clients | Gravita Oasis ",
  description: "This is Clients page for Gravita Oasis",
};

export default function Clients() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Clients" />
      <MainComponent />
    </div>
  );
}

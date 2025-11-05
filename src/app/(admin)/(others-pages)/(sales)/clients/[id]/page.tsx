import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import { Metadata } from "next";
import MainComponent from "@/components/sales/clients/clients-details/MainComponent";

export const metadata: Metadata = {
  title: "Client Details | Gravita Oasis ",
  description: "This is Client Details page for Gravita Oasis",
};

export default function ClientsDetails() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Client Details" />
      <MainComponent />
    </div>
  );
}

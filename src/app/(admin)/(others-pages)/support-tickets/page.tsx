import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { TicketList } from "@/components/support-tickets/MainComponent";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Support Tickets",
  description: "This is Support Tickets page for Gravita",
};

export default function AccessGroupsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Support Tickets" />
      <TicketList  />
    </div>
  );
}

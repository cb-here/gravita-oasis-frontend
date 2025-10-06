import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import KanbanBoard from "@/components/user-management/kanban/KanbanBoard";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Kanban",
  description: "This is kanban page for Gravita",
};

export default function AccessGroupsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Kanban" />
      <KanbanBoard />
    </div>
  );
}

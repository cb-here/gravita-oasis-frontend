import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import { Metadata } from "next";
import TaskList from "@/components/task/task-list/TaskList";

export const metadata: Metadata = {
  title: "Gravity Oasis Task List | TailAdmin - Gravity Oasis Dashboard Template",
  description:
    "This is Gravity Oasis Task List page for TailAdmin - Gravity Oasis Tailwind CSS Admin Dashboard Template",
  // other metadata
};

export default function TaskListPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Task List" />
      <TaskList />
    </div>
  );
}

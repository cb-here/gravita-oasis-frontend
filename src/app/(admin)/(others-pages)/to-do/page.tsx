import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import { Metadata } from "next";
import TaskList from "@/components/task/task-list/TaskList";

export const metadata: Metadata = {
  title: "To Do | Gravita Oasis ",
  description: "This is to do page for Gravita Oasis",
};

export default function TaskListPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="To Do" />
      <TaskList />
    </div>
  );
}

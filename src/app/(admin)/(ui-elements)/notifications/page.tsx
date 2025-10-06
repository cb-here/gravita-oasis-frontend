import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import NotificationExample from "@/components/ui/notification/NotificationExample";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Gravity Oasis Notifications | TailAdmin - Gravity Oasis Dashboard Template",
  description:
    "This is Gravity Oasis Notifications page for TailAdmin - Gravity Oasis Tailwind CSS Admin Dashboard Template",
};

export default function Notifications() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Notifications" />
      <NotificationExample />
    </div>
  );
}

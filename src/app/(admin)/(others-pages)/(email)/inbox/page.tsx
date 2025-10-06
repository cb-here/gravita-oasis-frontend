import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EmailContent from "@/components/email/EmailInbox/EmailContent";
import EmailSidebar from "@/components/email/EmailSidebar/EmailSidebar";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Gravity Oasis Inbox | TailAdmin - Gravity Oasis Dashboard Template",
  description:
    "This is Gravity Oasis Inbox page for TailAdmin - Gravity Oasis Tailwind CSS Admin Dashboard Template",
};

export default function Inbox() {
  return (
    <div className="">
      <PageBreadcrumb pageTitle="Inbox" />
      <div className="sm:h-[calc(100vh-174px)] h-screen xl:h-[calc(100vh-186px)">
        <div className="xl:grid xl:grid-cols-12 flex flex-col gap-5 sm:gap-5">
          <div className="xl:col-span-3 col-span-full">
            <EmailSidebar />
          </div>
          <EmailContent />
        </div>
      </div>
    </div>
  );
}

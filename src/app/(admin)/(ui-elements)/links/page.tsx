import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ColoredLinkWithUnderline from "@/components/ui/links/ColoredLinkWithUnderline";
import DefaultLinkExample from "@/components/ui/links/DefaultLinkExample";
import LinkOpacityExample from "@/components/ui/links/LinkOpacityExample";
import LinkOpacityHover from "@/components/ui/links/LinkOpacityHover";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Gravity Oasis Link | TailAdmin - Gravity Oasis Dashboard Template",
  description:
    "This is Gravity Oasis Link page for TailAdmin - Gravity Oasis Tailwind CSS Admin Dashboard Template",
};

export default function Links() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Links" />
      <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2">
        <DefaultLinkExample />
        <ColoredLinkWithUnderline />
        <LinkOpacityExample />
        <LinkOpacityHover />
      </div>
    </div>
  );
}

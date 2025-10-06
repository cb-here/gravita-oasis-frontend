import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TicketDetails from "@/components/support/TicketDetails";
import TicketReplyContent from "@/components/support/TicketReplyContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gravity Oasis Support Reply | TailAdmin - Gravity Oasis Admin Dashboard Template",
  description:
    "This is Gravity Oasis Support Reply for TailAdmin - Gravity Oasis Tailwind CSS Admin Dashboard Template",
};

export default function SupportReply() {
  return (
    <div className="overflow-hidden xl:h-[calc(100vh-180px)]">
      <PageBreadcrumb pageTitle="Support Reply" />
      <div className="grid h-full grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="xl:col-span-8 2xl:col-span-9">
          <TicketReplyContent />
        </div>
        <div className="xl:col-span-4 2xl:col-span-3">
          <TicketDetails />
        </div>
      </div>
    </div>
  );
}

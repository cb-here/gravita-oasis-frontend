import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { ConversationView } from "@/components/support-tickets/details/MainComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support Ticket Details | Gravita",
  description: "This is support ticket details page for Gravita",
};

export default async function SupportDetailPage() {
  
  return (
    <div className="space-y-4">
      <PageBreadcrumb
        pageTitle={`Support Ticket Details`}
        links={[{ link: "/support", title: "Support Tickets" }]}
      />
      <ConversationView  />
    </div>
  );
}

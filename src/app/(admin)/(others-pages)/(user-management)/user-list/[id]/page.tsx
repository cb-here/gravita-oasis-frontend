import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MainComponent from "@/components/user-management/user-list/user-details/MainComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Details | Gravita",
  description: "This is User details page for Gravita",
};

export default async function UserDetails() {
  return (
    <div className="space-y-4">
      <PageBreadcrumb
        pageTitle={`User Details `}
        links={[{ link: "/user-list", title: "User Details" }]}
      />
      <MainComponent />
    </div>
  );
}

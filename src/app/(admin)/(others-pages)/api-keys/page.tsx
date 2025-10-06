import ApiKeyTable from "@/components/api-keys/ApiKeyTable";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gravity Oasis API Keys Page | TailAdmin - Gravity Oasis Dashboard Template",
  description: "This is Gravity Oasis API Keys Page TailAdmin Dashboard Template",
};

export default function ApiKeysPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="API Keys" />
      <ApiKeyTable />
    </div>
  );
}

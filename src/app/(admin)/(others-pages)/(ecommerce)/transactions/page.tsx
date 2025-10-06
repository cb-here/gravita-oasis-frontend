import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TransactionList from "@/components/ecommerce/TransactionList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Gravity Oasis E-commerce Transaction | TailAdmin - Gravity Oasis Dashboard Template",
  description:
    "This is E-commerce  Gravity Oasis Transaction TailAdmin Dashboard Template",
};

export default function TransactionsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Transactions" />
      <TransactionList />
    </div>
  );
}

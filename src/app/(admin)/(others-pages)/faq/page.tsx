import ComponentCard from "@/components/common/ComponentCard";
import FaqsOneExample from "@/components/faqs/FaqOneExample";
import FaqsThree from "@/components/faqs/FaqsThree";
import FaqsTwo from "@/components/faqs/FaqsTwo";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Gravity Oasis FAQ Page | TailAdmin - Gravity Oasis Dashboard Template",
  description:
    "This is Gravity Oasis FAQ page for TailAdmin - Gravity Oasis Tailwind CSS Admin Dashboard Template",
};

export default function Faq() {
  return (
    <div>
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Faq’s 1">
          <FaqsOneExample />
        </ComponentCard>
        <ComponentCard title="Faq’s 2">
          <FaqsTwo />
        </ComponentCard>
        <ComponentCard title="Faq’s 3">
          <FaqsThree />
        </ComponentCard>
      </div>
    </div>
  );
}

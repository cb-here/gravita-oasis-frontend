import AiLayout from "@/components/ai/AiLayout";
import AiPageBreadcrumb from "@/components/ai/AiPageBreadcrumb";
import TextGeneratorContent from "@/components/ai/TextGeneratorContent";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title:
    "Gravity Oasis AI Text Generator | TailAdmin - Gravity Oasis Admin Dashboard Template",
  description:
    "This is AI Gravity Oasis Text Generator page for TailAdmin - Gravity Oasis Tailwind CSS Admin Dashboard Template",
};

export default function TextGeneratorPage() {
  return (
    <div>
      <AiPageBreadcrumb pageTitle="Text Generator" />
      <AiLayout>
        <TextGeneratorContent />
      </AiLayout>
    </div>
  );
}

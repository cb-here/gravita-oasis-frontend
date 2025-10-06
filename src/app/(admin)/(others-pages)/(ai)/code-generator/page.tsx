import AiLayout from "@/components/ai/AiLayout";
import AiPageBreadcrumb from "@/components/ai/AiPageBreadcrumb";
import CodeGeneratorContent from "@/components/ai/CodeGeneratorContent";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title:
    "Gravity Oasis AI Code Generator | TailAdmin - Gravity Oasis Admin Dashboard Template",
  description:
    "This is Gravity Oasis AI Code Generator page for TailAdmin - Gravity Oasis Tailwind CSS Admin Dashboard Template",
};

export default function CodeGeneratorPage() {
  return (
    <div>
      <AiPageBreadcrumb pageTitle="Code Generator" />
      <AiLayout>
        <CodeGeneratorContent />
      </AiLayout>
    </div>
  );
}

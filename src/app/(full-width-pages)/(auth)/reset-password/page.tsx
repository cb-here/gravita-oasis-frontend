import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { Metadata } from "next";

import React from "react";

export const metadata: Metadata = {
  title: "Gravity Oasis Reset Password | TailAdmin - Gravity Oasis Dashboard Template",
  description:
    "This is Gravity Oasis Password Reset page for TailAdmin Dashboard Template",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}

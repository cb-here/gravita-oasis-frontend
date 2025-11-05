import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { Metadata } from "next";

import React from "react";

export const metadata: Metadata = {
  title: "Reset Password | Gravita Oasis ",
  description: "This is  Reset Password page for Gravita Oasis ",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}

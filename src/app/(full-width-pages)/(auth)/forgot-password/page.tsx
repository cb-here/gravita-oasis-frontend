import ForgetPasswordForm from "@/components/auth/ForgotPasswordForm";
import { Metadata } from "next";

import React from "react";

export const metadata: Metadata = {
  title: "Forgot Password | Gravita Oasis",
  description: "This is forget password page for Gravita Oasis",
};

export default function ForgotPasswordPage() {
  return <ForgetPasswordForm />;
}

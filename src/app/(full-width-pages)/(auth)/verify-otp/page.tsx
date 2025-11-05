import OTPform from "@/components/auth/OtpForm";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Verify OTP | Gravita Oasis",
  description: "This is Verify OTP page for Gravita Oasis",
};

export default function VerifyOTP() {
  return <OTPform />;
}

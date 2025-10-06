import OtpForm from "@/components/auth/OtpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Gravity Oasis Two Step Verification Page | TailAdmin - Gravity Oasis Dashboard Template",
  description: "This is Gravity Oasis SignUp Page TailAdmin Dashboard Template",
  // other metadata
};

export default function OtpVerification() {
  return <OtpForm />;
}

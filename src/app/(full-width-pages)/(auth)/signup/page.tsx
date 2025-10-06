import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gravity Oasis SignUp Page | TailAdmin - Gravity Oasis Dashboard Template",
  description: "This is Gravity Oasis SignUp Page TailAdmin Dashboard Template",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}

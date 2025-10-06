import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gravity Oasis SignIn Page | TailAdmin - Gravity Oasis Dashboard Template",
  description: "This is Gravity Oasis Signin Page TailAdmin Dashboard Template",
};

export default function SignIn() {
  return <SignInForm />;
}

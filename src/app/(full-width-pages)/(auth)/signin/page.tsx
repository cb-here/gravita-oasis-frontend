import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SignIn |  Gravita Oasis",
  description: "This is SignIn page for Gravita Oasis.",
};

export default function SignIn() {
  return <SignInForm />;
}

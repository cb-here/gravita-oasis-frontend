import ComingSoon from "@/components/coming-soon/MainComponent";
import Timer from "@/components/common/Timer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DC Audit | Gravita Oasis",
  description: "This is DC Audit page for Gravita Oasis",
};

export default function Accounts() {
  return <Timer />;
}

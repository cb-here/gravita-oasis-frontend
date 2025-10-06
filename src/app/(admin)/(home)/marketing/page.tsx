import FeaturedCampaign from "@/components/marketing/FeaturedCampaign";
import ImpressionChart from "@/components/marketing/ImpressionChart";
import MarketingMetricsCards from "@/components/marketing/MarketingMetricsCards";
import TrafficSource from "@/components/marketing/TrafficSource";
import TrafficStats from "@/components/marketing/TrafficStats";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title:
    "Gravity Oasis Marketing Dashboard | TailAdmin - Gravity Oasis Admin Dashboard Template",
  description:
    "This is Gravity Oasis Marketing Dashboard page for TailAdmin - Gravity Oasis Tailwind CSS Admin Dashboard Template",
};

export default function Marketing() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <MarketingMetricsCards />
      </div>
      <div className="col-span-12 space-y-6 xl:col-span-8">
        <ImpressionChart />
        <FeaturedCampaign />
      </div>
      <div className="col-span-12 space-y-6 xl:col-span-4">
        <TrafficStats />
        <TrafficSource />
      </div>
    </div>
  );
}

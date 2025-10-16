"use client";

import React from "react";
import OrgChartDemo from "./component/OrgChart";

export default function MainComponent() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-5 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Organization Structure
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          View the complete organizational hierarchy and team structure. Click
          on any team member to see their details and position in the
          organization.
        </p>
      </div>

      <OrgChartDemo />
    </div>
  );
}

"use client"
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React, { useState } from "react";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import RevenueDashboard from "@/components/revenue/RevenueDashboard";

export default function Ecommerce() {
  const [totalOrders, setTotalOrders] = useState(0);
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 p-4 md:p-6 relative">
      {/* Left Column */}
      <div className="col-span-12 xl:col-span-7 flex flex-col gap-4 md:gap-6">
        <EcommerceMetrics totalOrders={totalOrders} />
        <div className="relative flex-1 min-h-[400px]">
          <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
              Revenue Overview
            </h2>
            <RevenueDashboard />
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="col-span-12 xl:col-span-5">
        <RecentOrders onCountChange={setTotalOrders} countOrder={9} />
      </div>
    </div>
  );
}
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import React from "react";

export default function BlankPage() {
  return (
    <div>
        <PageBreadcrumb pageTitle="Đặt hàng" />
        <RecentOrders></RecentOrders>
    </div>
  );
}

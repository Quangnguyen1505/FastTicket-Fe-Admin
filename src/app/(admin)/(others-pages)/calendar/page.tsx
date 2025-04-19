// import Calendar from "@/components/calendar/Calendar";
import CalendarV2 from "@/components/calendar/Calendar-v2";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Calender | FastTickets - Next.js Dashboard Template",
  description:
    "This is Next.js Calender page for FastTickets  Tailwind CSS Admin Dashboard Template",
  // other metadata
};
export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Lịch chiếu" />
      <CalendarV2 />
    </div>
  );
}

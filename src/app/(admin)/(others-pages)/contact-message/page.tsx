"use client";
import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableContactMess from "@/components/tables/BasicTableContactMess";
import { useRouter } from "next/navigation";
import { updateContactMessage } from "@/services/contact-message.service";
import { useAppSelector } from "@/redux/hooks";
import toast from "react-hot-toast";
export default function BasicTables() {
  const [refreshTrigger] = useState(0);
  const { shopId, accessToken } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const handleGoToDetails = (id: string) => {
    router.push(`/contact-message/${id}`);
  };

  const handleStatusUpdate = async (contactMessId: string, currentStatus: number) => {
      console.log("đã gọi status");
      
      if(!shopId || !accessToken) return;
      try {
        const newStatus = currentStatus === 0 ? 1 : currentStatus; 
        const res = await updateContactMessage(shopId, accessToken, contactMessId, newStatus);
        console.log("Status updated: ", res.data);
  
        // setContactMess((prev) =>
        //   prev.map((contact) =>
        //     contact.ID === contactMessId ? { ...contact, Status: newStatus } : contact
        //   )
        // );
      } catch (error) {
        console.error("Error updating status:", error);
        toast.error("Cập nhật trạng thái thất bại.");
      }
    };

  return (
    <div>
      <PageBreadcrumb pageTitle="Câu hỏi & đánh giá" />
      <div className="space-y-6">
        <ComponentCard
          title={
            <div className="flex items-center gap-10">
              <span className="text-base font-semibold">Thông Tin Câu Hỏi & Đánh Giá</span>
            </div>
          }
        >
          <BasicTableContactMess refreshTrigger={refreshTrigger} 
             onEditContactMess={(contactMessageId, status) => {
                handleGoToDetails(contactMessageId);
                handleStatusUpdate(contactMessageId, status);
            }
          } />
        </ComponentCard>
      </div>
    </div>
  );
}

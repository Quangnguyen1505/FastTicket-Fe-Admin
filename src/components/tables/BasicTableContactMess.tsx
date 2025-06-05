"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import { FaTrashAlt } from "react-icons/fa";
import { useAppSelector } from "@/redux/hooks";
import { ContactMessage } from "@/types/contact-message";
import { deleteContactMessage, getAllContactMessage, updateContactMessage } from "@/services/contact-message.service";
import Badge from "../ui/badge/Badge";
import toast from "react-hot-toast";

export default function BasicTableContactMess({
  refreshTrigger,
  onEditContactMess,
}: {
  refreshTrigger: number;
  onEditContactMess: (contactMessage: string, status: number) => void;
}) {
  const [contactMess, setContactMess] = useState<ContactMessage[]>([]);
  const { shopId, accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if(!shopId || !accessToken) return;
    const fetchAllContactMess = async () => {
      const res = await getAllContactMessage({limit: 100, page: 1}, shopId, accessToken);
      console.log("res ", res.data);
      
      setContactMess(res.data || []);
    };

    fetchAllContactMess();
  }, [shopId, accessToken, refreshTrigger]);

  const getStatusBadgeColor = (status: number) => {
    const statusColors = {
      0: "warning",
      1: "primary",
      2: "success",
      expired: "error",
    } as const;
  
    return statusColors[status as keyof typeof statusColors] || "error";
  };

  const handleDelete = async (contactMessId: string) => {
    try {
        if (!shopId || !accessToken) {
            toast.error("Vui lòng đăng nhập lại!");
            return;
        }

        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa thể loại này?");
        if (!confirmDelete) return;

        const res = await deleteContactMessage(shopId, accessToken, contactMessId);
        console.log("res ", res.data);
        
        toast.success("Đã xóa thể loại thành công!");
        setContactMess((prev) =>
            prev.filter((contactMess) => contactMess.ID !== contactMessId)
        );
    } catch (error) {
        console.log("error ", error);
        toast.error("Xóa thể loại thất bại. Vui lòng thử lại.");
    }
  };

  const handleStatusUpdate = async (contactMessId: string, currentStatus: number) => {
    console.log("đã gọi status");
    
    if(!shopId || !accessToken) return;
    try {
      const newStatus = currentStatus === 0 ? 1 : currentStatus; 
      const res = await updateContactMessage(shopId, accessToken, contactMessId, newStatus);
      console.log("Status updated: ", res.data);

      setContactMess((prev) =>
        prev.map((contact) =>
          contact.ID === contactMessId ? { ...contact, Status: newStatus } : contact
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Cập nhật trạng thái thất bại.");
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Tên
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Email
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Số điện thoại
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Câu hỏi/đánh giá
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Trạng thái
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Ngày tạo
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Hoạt động
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {contactMess && contactMess.map((contact) => (
                <TableRow 
                  key={contact.ID} 
                  onClick={() => onEditContactMess(contact.ID, contact.Status)}
                  className={`cursor-pointer ${contact.Status === 0 ? "hover:bg-gray-50 bg-gray-50 dark:bg-white/[0.05] dark:hover:bg-white/[0.05]" : "hover:bg-gray-50 dark:hover:bg-white/[0.05]"}`}
                  onDoubleClick={() => handleStatusUpdate(contact.ID, contact.Status)}  // Double-click to update status
                >
                  <TableCell className="px-4 py-3 text-start text-gray-800 text-theme-sm dark:text-white/90">
                    {contact.Name || "-"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-gray-800 text-theme-sm dark:text-white/90">
                    {contact.Email || "-"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-gray-800 text-theme-sm dark:text-white/90">
                    {contact.Phone || "-"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-gray-800 text-theme-sm dark:text-white/90">
                    <p className="line-clamp-3 max-w-xs">{contact.Message || "-"}</p>
                  </TableCell>
                  <TableCell className="px-8 py-3 text-start text-theme-sm">
                    <Badge size="sm" color={getStatusBadgeColor(contact.Status)}>
                      {contact.Status === 0 ? "Chờ phản hồi" :
                        contact.Status === 1 ? "Đã đọc" :
                        contact.Status === 2 ? "Đã phản hồi" : "Không xác định"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {new Date(contact.CreatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-8 py-3 text-start">
                    <button
                      onClick={(e) => {
                          e.stopPropagation();    
                          handleDelete(contact.ID);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                        <FaTrashAlt />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

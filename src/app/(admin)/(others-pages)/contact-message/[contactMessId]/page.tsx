"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ContactMessage, ResponseCustomer } from "@/types/contact-message";
import { getDetailContactMessage, responseEmailToCustomer } from "@/services/contact-message.service";
import { useAppSelector } from "@/redux/hooks";

export default function ContactMessageDetailPage() {
  const { contactMessId } = useParams();
  const [contact, setContact] = useState<ContactMessage | null>(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { shopId, accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchContactMessage = async () => {
      if (!contactMessId) return;
      try {
        const res = await await getDetailContactMessage(contactMessId as string);
        setContact(res.data);
      } catch (err) {
        console.error("Failed to fetch contact message", err);
      }
    };

    fetchContactMessage();
  }, [contactMessId]);

  const handleReply = async () => {
    if (!reply.trim()) {
      alert("Vui lòng nhập nội dung phản hồi.");
      return;
    }

    if (!shopId || !accessToken || !contact) {
      alert("Vui lòng đăng nhập lại!");
      return;
    }

    try {
        setLoading(true);
  
        const payload: ResponseCustomer = {
          name: contact.Name,
          email: contact.Email,
          message: contact.Message,
          response: reply,
          contact_id: contact.ID,
        };

        console.log("payload ", payload)
  
        await responseEmailToCustomer(shopId, accessToken, payload);
  
        alert("Gửi phản hồi thành công!");
        setReply("");
        // Optionally reload contact detail
        // const res = await getDetailContactMessage(contactMessId as string);
        // setContact(res.data);
      } catch (err) {
        console.error("Error replying", err);
        alert("Gửi phản hồi thất bại.");
      } finally {
        setLoading(false);
      }
    };

  const handleBack = () => {
    router.back(); 
  };

  if (!contact) return <div>Đang tải dữ liệu...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Chi tiết liên hệ</h1>

      <div className="space-y-2">
        <p><span className="font-medium">Tên:</span> {contact.Name}</p>
        <p><span className="font-medium">Email:</span> {contact.Email}</p>
        <p><span className="font-medium">SĐT:</span> {contact.Phone || "-"}</p>
        <p><span className="font-medium">Nội dung:</span> {contact.Message}</p>
        <p><span className="font-medium">Trạng thái:</span> {
          contact.Status === 0 ? "Chờ phản hồi" :
          contact.Status === 1 ? "Đã đọc" :
          contact.Status === 2 ? "Đã phản hồi" : "Không xác định"
        }</p>
        <p><span className="font-medium">Ngày tạo:</span> {new Date(contact.CreatedAt).toLocaleDateString()}</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="reply" className="block font-medium">Phản hồi:</label>
        <textarea
          id="reply"
          className="w-full border rounded-md p-2 min-h-[100px] focus:outline-none focus:ring focus:border-blue-300"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Nhập nội dung phản hồi..."
        />
        <div className="flex space-x-4 mt-4">
          <button
            onClick={handleReply}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Đang gửi..." : "Gửi phản hồi"}
          </button>

          {/* Nút Quay lại */}
          <button
            onClick={handleBack}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}
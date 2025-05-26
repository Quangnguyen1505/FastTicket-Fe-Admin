"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useAppSelector } from "@/redux/hooks";
import { getAllMessages } from "@/services/chat-employee.service";
import { Session } from "@/types/chat";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function ChatSupport() {
  const { shopId, accessToken } = useAppSelector((state) => state.auth);
  const [sessions, setSessions] = useState<Session[]>([]); 
  const router = useRouter();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        if (!shopId || !accessToken) {
          console.error("Thiếu shopId hoặc accessToken.");
          return;
        }
        const response = await getAllMessages(shopId, accessToken);
        console.log("response", response);
        
        setSessions(response.data || []);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();
  }, []);

  // 👉 Dữ liệu tĩnh mẫu
  // const sessions: Session[] = [
  //   {
  //     session_id: "abc123",
  //     customer_id: "khachhang01",
  //     created_at: "2025-05-22T10:15:00Z",
  //     last_message: "Xin chào, tôi cần hỗ trợ!",
  //   },
  //   {
  //     session_id: "def456",
  //     customer_id: "khachhang02",
  //     created_at: "2025-05-22T11:00:00Z",
  //     last_message: "Tôi không thanh toán được",
  //   },
  // ];

  return (
    <div className="flex flex-col space-y-6 px-6 py-4">
      <PageBreadcrumb pageTitle="Quản lý chat hỗ trợ" />

      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Phiên chờ phản hồi</h2>
        {sessions.length === 0 ? (
          <p className="text-gray-500">Không có phiên nào đang chờ phản hồi.</p>
        ) : (
          <ul className="space-y-3">
            {sessions.map((s) => (
              <li
                key={s.session_id}
                className="border p-4 rounded hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push(`/chat-support/${s.session_id}`)}
              >
                <div className="font-medium">Khách hàng: {s.customer_id.slice(0, 8)}</div>
                <div className="flex flex-row">
                  <div className="text-sm text-gray-600">Mã phiên: {s.session_id.slice(0, 8)}</div>
                  <div className="text-sm text-gray-600 ml-4">
                    Trạng thái: {s.status === 'in_progress' ? 'bạn đang xử lý' : 'chờ vào'}
                  </div>
                </div>
                {s.last_message && (
                  <div className="text-sm text-gray-700 mt-1 italic">
                    &quot;{s.last_message}&quot;
                  </div>
                )}
                <div className="text-xs text-gray-400 mt-1">
                  Bắt đầu: {new Date(s.created_at).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

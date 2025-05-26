"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";
import { closeSession, getHistoryChat, joinChat, sendMessage } from "@/services/chat-employee.service";
import { useAppSelector } from "@/redux/hooks";
import { JoinChatSessionParams, SendMessagePayload } from "@/types/chat";
import toast from "react-hot-toast";
import { connectWebSocket, disconnectWebSocket } from "@/helpers/connectWebsocket";

interface Message {
  sender: "customer" | "staff";
  content: string;
  timestamp: string;
}

export default function ChatSessionDetail() {
  const { sessionId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const hasConnectedRef = useRef(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const { shopId, accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!sessionId || !shopId || !accessToken || hasConnectedRef.current) return;
  
    const joinMessagesGroup = async () => {
      if (typeof sessionId !== "string") {
        toast.error("Session ID không hợp lệ!");
        return;
      }
      const payload: JoinChatSessionParams = { sessionId, staffId: shopId };
      const res = await joinChat(shopId, accessToken, payload);
      console.log("res join", res);
      if (res.code === 200) {
        toast.success("Tham gia phiên chat thành công!");
  
        connectWebSocket(sessionId, (message) => {
          if(message.event === "session_closed") return;
          if (message.sender_id != shopId) {
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                sender: message.sender_id === shopId ? "staff" : "customer",
                content: message.message,
                timestamp: message.sent_at,
              },
            ]);
          }
        });
  
        hasConnectedRef.current = true;
  
        const resHistory = await getHistoryChat(shopId, accessToken, sessionId);
        console.log("resHistory", resHistory);
  
        if (resHistory.data) {
          setMessages(resHistory.data.map((item) => ({
            sender: item.sender_id === shopId ? "staff" : "customer",
            content: item.message,
            timestamp: item.sent_at,
          })));
        } else {
          console.warn("Không có lịch sử chat.");
        }
      }
    };
  
    joinMessagesGroup();
  
    return () => {
      disconnectWebSocket();
      hasConnectedRef.current = false;
    };
  }, [sessionId, shopId, accessToken]);
  

  const handleSend = async () => {
    if (!shopId || !accessToken || !sessionId) return;
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        sender: "staff",
        content: input,
        timestamp: new Date().toISOString(),
      },
    ]);
    try {
      const payload: SendMessagePayload = {
        sender: shopId,
        message: input,
        sessionId: sessionId as string
      }
      const res = await sendMessage(shopId, accessToken, payload);
      console.log("res send", res);
      setInput("");
    } catch (error) {
      console.error("error", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "staff",
          content: "Lỗi khi gửi tin nhắn!",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };

  const handleEndSession = async () => {
    try {
      if (!shopId || !accessToken || !sessionId) return;
      const confirmed = window.confirm("Bạn có chắc muốn kết thúc phiên chat này?");
      if (!confirmed) return;

      const res = await closeSession(shopId, accessToken, sessionId as string);
      console.log("res close", res);
      toast.success("Kết thúc phiên chat thành công!");
      router.back();
    } catch (error) {
      console.error("error", error);
      toast.error("Lỗi khi kết thúc phiên chat!");
    }

  }

  return (
    <div className="flex flex-col h-full px-6 py-4 space-y-4">
      <PageBreadcrumb
        pageTitle={`Phiên chat #${sessionId?.slice(0, 8)}`}
      />

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="text-sm"
          onClick={() => router.back()}
        >
          ← Quay lại
        </Button>

        <Button
          variant="outline"
          className="text-sm"
          onClick={handleEndSession}
        >
          Hoàn tất phiên chat
        </Button>
      </div>

      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto bg-white rounded-lg p-4 space-y-3 border"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[70%] p-3 rounded-lg text-sm shadow-sm
              ${msg.sender === "staff" ? "bg-blue-100 ml-auto text-right" : "bg-gray-100 mr-auto text-left"}
            `}
          >
            <div className="whitespace-pre-wrap">{msg.content}</div>
            <div className="text-xs text-gray-400 mt-1">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Nhập nội dung trả lời..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
            className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700"
          />
        </div>
        <Button onClick={handleSend}>Gửi</Button>
      </div>
    </div>
  );
}

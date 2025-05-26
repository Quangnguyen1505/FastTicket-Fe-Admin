import axiosClientFe from "@/helpers/call-fe";
import { ChatResponse, ChatResponseHistory, JoinChatSessionParams, SendMessagePayload } from "@/types/chat";

export const sendMessage = async (user_id: string, accessToken: string, payload: SendMessagePayload): Promise<ChatResponse> => {
    try {
      const response = await axiosClientFe.post<ChatResponse>(`/api/chat`, payload, {
        headers: {
            'x-client-id': user_id,
            'authorization': accessToken
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
};

export const getAllMessages = async (user_id: string, accessToken: string): Promise<ChatResponse> => {
    try {
      const response = await axiosClientFe.get<ChatResponse>(`/api/chat`, {
        headers: {
            'x-client-id': user_id,
            'authorization': accessToken
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching all messages:", error);
      throw error;
    }
};

export const joinChat = async (user_id: string, accessToken: string, payload: JoinChatSessionParams): Promise<ChatResponse> => {
    try {
      const response = await axiosClientFe.post<ChatResponse>(`/api/chat/join/session`, payload, {
        headers: {
            'x-client-id': user_id,
            'authorization': accessToken
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error joining chat:", error);
      throw error;
    }
}

export const closeSession = async (user_id: string, accessToken: string, sessionId: string): Promise<ChatResponse> => {
    try {
      const response = await axiosClientFe.get<ChatResponse>(`/api/chat/close/session/${sessionId}`, {
        headers: {
            'x-client-id': user_id,
            'authorization': accessToken
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error closing session:", error);
      throw error;
    }
}

export const getHistoryChat = async (user_id: string, accessToken: string, sessionId: string): Promise<ChatResponseHistory> => {
    try {
      const response = await axiosClientFe.get<ChatResponseHistory>(`/api/chat/history/${sessionId}`, {
        headers: {
            'x-client-id': user_id,
            'authorization': accessToken
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching chat history:", error);
      throw error;
    }
}
export interface SendMessagePayload {
    sender: string;
    message: string;
    sessionId: string;
}

export interface ChatResponse {
    message: string;
    code: number;
    data: Session[];
}

export interface ChatResponseHistory {
  message: string;
  code: number;
  data: History[];
}

export interface JoinChatSessionParams {
	sessionId: string;
	staffId: string;
}


export interface Session {
  session_id: string;
  customer_id: string;
  created_at: string;
  last_message: string | null;
  status: string; // "open" | "in_progress" | "closed"
}

export interface History {
  message: string;
  sender_id: string;
  sent_at: string;
}
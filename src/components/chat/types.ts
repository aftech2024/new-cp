export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** Epoch milliseconds. */
  at: number;
  links?: string[];
  /** Follow-up questions the assistant suggests after this answer. */
  followups?: string[];
  /** In-memory JPEG data URL of a photo the visitor attached. Never persisted. */
  image?: string;
  /** The message carried a photo — kept after the photo itself is dropped. */
  hadImage?: boolean;
  rating?: "up" | "down";
}

export interface Conversation {
  id: string;
  title: string;
  updatedAt: number;
  messages: ChatMessage[];
}

export const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

import type { ChatMessage, Conversation } from "./types";

/**
 * Past conversations, kept in this browser only. Storage can be blocked or
 * full (private windows, quotas), so every access is guarded and the chat
 * works the same without it.
 */
const KEY = "aftech-chat-history";
const MAX_CONVERSATIONS = 20;

export function loadHistory(): Conversation[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (c): c is Conversation => !!c && typeof c.id === "string" && typeof c.title === "string" && Array.isArray(c.messages),
    );
  } catch {
    return [];
  }
}

function write(list: Conversation[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* storage full or blocked — history is a convenience, not a requirement */
  }
}

export function saveConversation(id: string, messages: ChatMessage[], photoTitle: string): void {
  const firstUser = messages.find((m) => m.role === "user");
  if (!firstUser) return;
  // Photos are far too large for localStorage; remember only that one was sent.
  const stored = messages.map((m) => {
    if (!m.image) return m;
    const copy: ChatMessage = { ...m, hadImage: true };
    delete copy.image;
    return copy;
  });
  const conversation: Conversation = {
    id,
    title: (firstUser.content || photoTitle).slice(0, 80),
    updatedAt: Date.now(),
    messages: stored,
  };
  write([conversation, ...loadHistory().filter((c) => c.id !== id)].slice(0, MAX_CONVERSATIONS));
}

export function deleteConversation(id: string): Conversation[] {
  const next = loadHistory().filter((c) => c.id !== id);
  write(next);
  return next;
}

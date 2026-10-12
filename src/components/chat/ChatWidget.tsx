import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, MessageCircle, RotateCcw, Send, X } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { company } from "@/data/company";
import { useLanguage } from "@/i18n/LanguageContext";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Mirror the limits in public/api/chat.php so the UI stops before the server refuses.
const MAX_CHARS = 500;
const MAX_TURNS = 10;
const ENDPOINT = import.meta.env.VITE_CHAT_ENDPOINT || "/api/chat.php";

const WHATSAPP_URL = `https://wa.me/${company.whatsapp.replace(/\D/g, "").replace(/^0/, "62")}`;

const SUGGESTIONS = ["chat.suggest.services", "chat.suggest.projects", "chat.suggest.start"];

// Absolute URLs, plus the site's own page paths the assistant is told to cite.
const LINK_RE = /https?:\/\/[^\s)]+|\/(?:about|services|projects|insights|contact)(?:\/[a-z0-9-]+)*/g;

function renderReply(text: string): ReactNode[] {
  const clean = text.replace(/\*\*(.+?)\*\*/g, "$1");
  const out: ReactNode[] = [];
  let last = 0;
  for (const match of clean.matchAll(LINK_RE)) {
    const start = match.index ?? 0;
    // A path glued to a word or domain ("aftech.co.id/contact") is not a site link on its own.
    if (match[0].startsWith("/") && /[\w.]/.test(clean[start - 1] ?? "")) continue;
    const token = match[0].replace(/[.,;:!?]+$/, "");
    out.push(clean.slice(last, start));
    out.push(
      token.startsWith("/") ? (
        <Link key={start} to={token} className="font-medium text-aftech underline underline-offset-2">
          {token}
        </Link>
      ) : (
        <a key={start} href={token} target="_blank" rel="noopener noreferrer" className="font-medium text-aftech underline underline-offset-2 break-all">
          {token}
        </a>
      ),
    );
    last = start + token.length;
  }
  out.push(clean.slice(last));
  return out;
}

export default function ChatWidget() {
  const { t, lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [ended, setEnded] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const userTurns = messages.filter((m) => m.role === "user").length;
  const atLimit = ended || userTurns >= MAX_TURNS;

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending, error]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text: string) {
    const content = text.trim().slice(0, MAX_CHARS);
    if (!content || sending || atLimit) return;

    const history: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(history);
    setInput("");
    setError("");
    setSending(true);

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, lang }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        const code: string = data?.error ?? "generic";
        if (code === "conversation_limit") setEnded(true);
        // Drop the unanswered question so the history still alternates for the next try.
        setMessages(messages);
        setInput(content);
        setError(t(`chat.err.${code}`, t("chat.err.generic")));
        return;
      }

      setMessages([...history, { role: "assistant", content: data.reply }]);
      if (data.remaining === 0) setEnded(true);
    } catch {
      setMessages(messages);
      setInput(content);
      setError(t("chat.err.generic"));
    } finally {
      setSending(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void send(input);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  }

  function reset() {
    setMessages([]);
    setInput("");
    setError("");
    setEnded(false);
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={t("chat.title")}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-3 bottom-24 z-30 flex max-h-[min(600px,calc(100dvh-8rem))] flex-col overflow-hidden rounded-lg bg-white shadow-card sm:inset-x-auto sm:right-6 sm:w-[380px]"
          >
            <div className="flex items-start justify-between gap-3 bg-deep-navy px-5 py-4 text-white">
              <div className="flex flex-col">
                <span className="font-display text-xl leading-tight">{t("chat.title")}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">{t("chat.subtitle")}</span>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={reset}
                    aria-label={t("chat.reset")}
                    title={t("chat.reset")}
                    className="rounded-pro p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t("chat.close")}
                  className="rounded-pro p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div ref={listRef} className="flex flex-1 flex-col gap-3 overflow-y-auto bg-off-white px-4 py-4" aria-live="polite">
              <div className="max-w-[85%] self-start rounded-lg rounded-tl-sm bg-white px-3.5 py-2.5 text-sm leading-relaxed text-ink shadow-pro">
                {t("chat.greeting")}
              </div>

              {messages.length === 0 && (
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => void send(t(key))}
                      className="rounded-full border border-aftech/30 bg-white px-3 py-1.5 text-xs text-aftech transition hover:border-aftech hover:bg-aftech-ice"
                    >
                      {t(key)}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={
                    m.role === "user"
                      ? "max-w-[85%] self-end whitespace-pre-line break-words rounded-lg rounded-tr-sm bg-aftech px-3.5 py-2.5 text-sm leading-relaxed text-white"
                      : "max-w-[85%] self-start whitespace-pre-line break-words rounded-lg rounded-tl-sm bg-white px-3.5 py-2.5 text-sm leading-relaxed text-ink shadow-pro"
                  }
                >
                  {m.role === "assistant" ? renderReply(m.content) : m.content}
                </div>
              ))}

              {sending && (
                <div className="flex items-center gap-2 self-start rounded-lg bg-white px-3.5 py-2.5 text-sm text-muted shadow-pro">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("chat.typing")}
                </div>
              )}

              {error && <p className="self-start text-xs text-red-600">{error}</p>}

              {atLimit && (
                <div className="flex flex-col gap-2 rounded-lg border border-line bg-white p-3 text-sm text-ink">
                  <p>{t("chat.limitReached")}</p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-pro bg-aftech px-3 py-1.5 text-xs font-medium text-white hover:bg-[#0F6BBE]"
                    >
                      <WhatsAppIcon className="h-3.5 w-3.5" /> WhatsApp
                    </a>
                    <button
                      type="button"
                      onClick={reset}
                      className="inline-flex items-center gap-1.5 rounded-pro border border-line px-3 py-1.5 text-xs text-ink hover:border-aftech hover:text-aftech"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> {t("chat.reset")}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="border-t border-line bg-white px-3 pb-2 pt-3">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  maxLength={MAX_CHARS}
                  disabled={atLimit}
                  placeholder={t("chat.placeholder")}
                  aria-label={t("chat.placeholder")}
                  className="max-h-28 min-h-[40px] flex-1 resize-none rounded-pro border border-line px-3 py-2 text-sm text-ink outline-none transition focus:border-aftech disabled:bg-off-white"
                />
                <button
                  type="submit"
                  disabled={sending || atLimit || !input.trim()}
                  aria-label={t("chat.send")}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pro bg-aftech text-white transition hover:bg-[#0F6BBE] disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-[11px] leading-snug text-muted">
                {t("chat.disclaimer")}{" "}
                <Link to="/contact" onClick={() => setOpen(false)} className="text-aftech underline underline-offset-2">
                  {t("chat.contactLink")}
                </Link>
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? t("chat.close") : t("chat.open")}
        className="fixed bottom-6 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-aftech text-white shadow-[0_8px_24px_-8px_rgba(20,121,209,0.7)] transition hover:bg-[#0F6BBE] sm:right-6"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </>
  );
}

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  ArrowUp,
  Check,
  ChevronRight,
  Copy,
  ImageIcon,
  List,
  Maximize2,
  Mic,
  Minimize2,
  Plus,
  RotateCcw,
  Square,
  SquarePen,
  ThumbsDown,
  ThumbsUp,
  Volume2,
  X,
} from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import logo from "@/assets/images/logo-aftech.png";
import { WHATSAPP_URL } from "@/data/company";
import { useLanguage } from "@/i18n/LanguageContext";
import DestinationCard from "./DestinationCard";
import HistoryPanel from "./HistoryPanel";
import Markdown from "./Markdown";
import { buildDestinations, liftInlineLinks, normalizeHref, toPlainText, type Destination } from "./destinations";
import { deleteConversation, loadHistory, saveConversation } from "./history";
import { ImageError, prepareImage, useDictation, useSpeaker } from "./media";
import { newId, type ChatMessage, type Conversation } from "./types";

// Mirror the limits in public/api/chat.php so the UI stops before the server refuses.
const MAX_CHARS = 500;
const MAX_TURNS = 10;
const MAX_CARDS = 3;
const ENDPOINT = import.meta.env.VITE_CHAT_ENDPOINT || "/api/chat.php";
const FEEDBACK_ENDPOINT = "/api/chat-feedback.php";

const SUGGESTIONS = ["chat.suggest.services", "chat.suggest.projects", "chat.suggest.start", "chat.suggest.offices"];

const isSmallScreen = () => typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches;

function Avatar() {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white p-1.5 ring-1 ring-white/20">
      <img src={logo} alt="" className="h-full w-full object-contain" />
    </span>
  );
}

function IconButton({ label, onClick, children, active = false }: { label: string; onClick: () => void; children: ReactNode; active?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aftech-bright ${
        active ? "bg-white/10 text-white" : "text-white/70"
      }`}
    >
      {children}
    </button>
  );
}

function ActionButton({
  label,
  onClick,
  children,
  pressed,
  disabled = false,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
  pressed?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      disabled={disabled}
      className={`flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aftech-bright disabled:pointer-events-none disabled:opacity-30 ${
        pressed ? "text-aftech-bright" : ""
      }`}
    >
      {children}
    </button>
  );
}

function QuickActions({ title, items, onPick }: { title: string; items: string[]; onPick: (text: string) => void }) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-3 text-[13px] font-medium text-white/60">
        {title}
        <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
      </div>
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onPick(item)}
          className="group flex items-center justify-between gap-3 rounded-xl bg-navy-800 px-4 py-3 text-left text-[13.5px] leading-snug text-white/90 ring-1 ring-white/[0.08] transition hover:bg-navy-700 hover:ring-aftech-bright/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aftech-bright"
        >
          {item}
          <ChevronRight className="h-4 w-4 shrink-0 text-white/40 transition group-hover:translate-x-0.5 group-hover:text-aftech-bright" />
        </button>
      ))}
    </div>
  );
}

export default function ChatWidget() {
  const { t, lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const locale = lang === "id" ? "id-ID" : "en-GB";

  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<Conversation[]>([]);
  const [convId, setConvId] = useState(newId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [attachment, setAttachment] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [ended, setEnded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const dictationBase = useRef("");

  const destinations = useMemo(() => buildDestinations(t), [t]);
  const speaker = useSpeaker(lang);
  const dictation = useDictation(
    lang,
    useCallback((text: string) => setInput((dictationBase.current ? `${dictationBase.current} ${text}` : text).slice(0, MAX_CHARS)), []),
    useCallback(() => setError(t("chat.err.mic")), [t]),
  );

  const userTurns = messages.filter((m) => m.role === "user").length;
  const atLimit = ended || userTurns >= MAX_TURNS;
  const lastAssistantId = [...messages].reverse().find((m) => m.role === "assistant")?.id;

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: reduceMotion ? "auto" : "smooth" });
  }, [messages, sending, error, reduceMotion]);

  useEffect(() => {
    if (!open) return;
    // On phones, focusing would throw the keyboard over the welcome screen before it is read.
    if (!isSmallScreen()) inputRef.current?.focus();
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (historyOpen) setHistoryOpen(false);
      else setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, historyOpen]);

  const stopSpeaking = speaker.stop;
  useEffect(() => {
    if (!open) stopSpeaking();
  }, [open, stopSpeaking]);

  // Grow the textarea with its content, up to about five lines.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 132)}px`;
  }, [input, open, expanded]);

  useEffect(() => {
    if (messages.some((m) => m.role === "user")) saveConversation(convId, messages, t("chat.imageAttached"));
  }, [convId, messages, t]);

  async function send(text: string) {
    const content = text.trim().slice(0, MAX_CHARS);
    const image = attachment;
    if ((!content && !image) || sending || atLimit) return;
    if (dictation.listening) dictation.stop();

    const userMessage: ChatMessage = { id: newId(), role: "user", content, at: Date.now(), ...(image ? { image } : {}) };
    const previous = messages;
    const next = [...messages, userMessage];
    setMessages(next);
    setInput("");
    setAttachment(null);
    setError("");
    setSending(true);

    const restore = (message: string) => {
      // Drop the unanswered question so the history still alternates for the next try.
      setMessages(previous);
      setInput(content);
      setAttachment(image);
      setError(message);
    };

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lang,
          messages: next.map((m, i) => {
            const isLast = i === next.length - 1;
            return {
              role: m.role,
              content: m.content,
              ...(isLast && m.image ? { image: { media_type: "image/jpeg", data: m.image.split(",")[1] ?? "" } } : {}),
              ...(!isLast && (m.image || m.hadImage) ? { hadImage: true } : {}),
            };
          }),
        }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        const code: string = data?.error ?? "generic";
        if (code === "conversation_limit") setEnded(true);
        restore(t(`chat.err.${code}`, t("chat.err.generic")));
        return;
      }

      const strings = (value: unknown) => (Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : []);
      setMessages([
        ...next,
        { id: newId(), role: "assistant", content: data.reply, at: Date.now(), links: strings(data.links), followups: strings(data.followups) },
      ]);
      if (data.remaining === 0) setEnded(true);
    } catch {
      restore(t("chat.err.generic"));
    } finally {
      setSending(false);
    }
  }

  function startNew() {
    speaker.stop();
    setConvId(newId());
    setMessages([]);
    setInput("");
    setAttachment(null);
    setError("");
    setEnded(false);
    setHistoryOpen(false);
  }

  function openHistory() {
    setHistory(loadHistory());
    setHistoryOpen(true);
  }

  function openConversation(c: Conversation) {
    speaker.stop();
    setConvId(c.id);
    setMessages(c.messages);
    setInput("");
    setAttachment(null);
    setError("");
    setEnded(false);
    setHistoryOpen(false);
  }

  function removeConversation(id: string) {
    setHistory(deleteConversation(id));
    if (id === convId) {
      setConvId(newId());
      setMessages([]);
    }
  }

  async function attachFile(file: File) {
    try {
      setAttachment(await prepareImage(file));
      setError("");
    } catch (err) {
      setError(t(`chat.err.${err instanceof ImageError ? err.code : "image_type"}`));
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // let the same photo be picked again after removing it
    if (file) void attachFile(file);
  }

  function handlePaste(e: ClipboardEvent<HTMLTextAreaElement>) {
    const file = Array.from(e.clipboardData.files).find((f) => f.type.startsWith("image/"));
    if (file) {
      e.preventDefault();
      void attachFile(file);
    }
  }

  function toggleMic() {
    if (dictation.listening) {
      dictation.stop();
      return;
    }
    dictationBase.current = input.trim();
    setError("");
    dictation.start();
  }

  async function copy(m: ChatMessage) {
    try {
      await navigator.clipboard.writeText(toPlainText(m.content));
      setCopiedId(m.id);
      window.setTimeout(() => setCopiedId((current) => (current === m.id ? null : current)), 1600);
    } catch {
      /* clipboard blocked — nothing useful to tell the visitor */
    }
  }

  function rate(m: ChatMessage, rating: "up" | "down") {
    if (m.rating) return;
    setMessages((list) => list.map((x) => (x.id === m.id ? { ...x, rating } : x)));
    const index = messages.findIndex((x) => x.id === m.id);
    const question = [...messages.slice(0, index)].reverse().find((x) => x.role === "user")?.content ?? "";
    void fetch(FEEDBACK_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, lang, question, answer: m.content }),
    }).catch(() => {});
  }

  // A page opened from the chat would sit hidden behind the sheet on a phone.
  function handleNavigate() {
    if (isSmallScreen() || expanded) {
      setOpen(false);
      setExpanded(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void send(input);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void send(input);
    }
  }

  const formatTime = (at: number) => new Date(at).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
  const nearLimit = input.length > MAX_CHARS - 100;
  const showMic = dictation.supported && (dictation.listening || (!input.trim() && !attachment));
  const column = expanded ? "mx-auto w-full max-w-2xl" : "w-full";

  function renderAssistant(m: ChatMessage) {
    const lifted = liftInlineLinks(m.content, destinations);
    const seen = new Set<string>();
    const cards: Destination[] = [];
    for (const href of [...(m.links ?? []), ...lifted.hrefs]) {
      const dest = destinations.get(normalizeHref(href));
      if (!dest || seen.has(dest.href)) continue;
      seen.add(dest.href);
      cards.push(dest);
    }
    const speaking = speaker.speakingId === m.id;
    const isLatest = m.id === lastAssistantId;

    return (
      <div key={m.id} className="flex gap-3">
        <Avatar />
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="break-words pt-1 text-[14.5px] leading-relaxed text-white/85">
            <Markdown text={lifted.text} />
          </div>

          {cards.length > 0 && (
            <div className="flex flex-col gap-2">
              {cards.slice(0, MAX_CARDS).map((dest) => (
                <DestinationCard key={dest.href} dest={dest} onNavigate={handleNavigate} />
              ))}
            </div>
          )}

          <div className="-ml-1.5 flex items-center gap-0.5 text-white/45">
            <ActionButton label={copiedId === m.id ? t("chat.copied") : t("chat.copy")} onClick={() => void copy(m)}>
              {copiedId === m.id ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </ActionButton>
            {speaker.supported && (
              <ActionButton
                label={speaking ? t("chat.speakStop") : t("chat.speak")}
                pressed={speaking}
                onClick={() => (speaking ? speaker.stop() : speaker.speak(m.id, toPlainText(lifted.text)))}
              >
                {speaking ? <Square className="h-3.5 w-3.5" fill="currentColor" /> : <Volume2 className="h-4 w-4" />}
              </ActionButton>
            )}
            <ActionButton
              label={t("chat.good")}
              pressed={m.rating === "up"}
              disabled={m.rating === "down"}
              onClick={() => rate(m, "up")}
            >
              <ThumbsUp className="h-4 w-4" fill={m.rating === "up" ? "currentColor" : "none"} />
            </ActionButton>
            <ActionButton
              label={t("chat.bad")}
              pressed={m.rating === "down"}
              disabled={m.rating === "up"}
              onClick={() => rate(m, "down")}
            >
              <ThumbsDown className="h-4 w-4" fill={m.rating === "down" ? "currentColor" : "none"} />
            </ActionButton>
            <span className="ml-2 text-[11px] tabular-nums text-white/35">{formatTime(m.at)}</span>
          </div>

          {isLatest && !sending && !atLimit && m.followups && m.followups.length > 0 && (
            <QuickActions title={t("chat.quickActions")} items={m.followups} onPick={(q) => void send(q)} />
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={t("chat.title")}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "bottom right" }}
            className={`fixed flex flex-col overflow-hidden bg-primary-navy shadow-[0_40px_100px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/10 ${
              expanded
                ? "inset-0 z-[60] h-[100dvh] sm:inset-auto sm:bottom-[5.5rem] sm:right-6 sm:h-[calc(100dvh-7.5rem)] sm:w-[min(860px,calc(100vw-3rem))] sm:rounded-2xl"
                : "inset-x-3 bottom-[5.5rem] z-30 h-[min(700px,calc(100dvh-7.5rem))] rounded-2xl sm:inset-x-auto sm:right-6 sm:w-[420px]"
            }`}
          >
            {/* Header — a faint drafting grid ties it to the engineering side of the brand. */}
            <div className="relative shrink-0 overflow-hidden border-b border-white/[0.06] bg-deep-navy px-2.5 py-2.5">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(46,168,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(46,168,255,0.09)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:linear-gradient(to_left,black,transparent_70%)]"
              />
              <div className="relative flex items-center gap-1">
                <IconButton label={t("chat.history")} onClick={() => (historyOpen ? setHistoryOpen(false) : openHistory())} active={historyOpen}>
                  <List className="h-5 w-5" />
                </IconButton>
                <span className="ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white p-1.5">
                  <img src={logo} alt="" className="h-full w-full object-contain" />
                </span>
                <div className="ml-2 flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate font-display text-[20px] leading-none text-white">{t("chat.title")}</span>
                  <span className="flex items-center gap-1.5 truncate text-[11px] text-white/55">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" aria-hidden="true" />
                    {t("chat.subtitle")}
                  </span>
                </div>
                <IconButton label={t("chat.newChat")} onClick={startNew}>
                  <SquarePen className="h-[18px] w-[18px]" />
                </IconButton>
                <IconButton label={expanded ? t("chat.collapse") : t("chat.expand")} onClick={() => setExpanded((v) => !v)}>
                  {expanded ? <Minimize2 className="h-[18px] w-[18px]" /> : <Maximize2 className="h-[18px] w-[18px]" />}
                </IconButton>
                <IconButton label={t("chat.close")} onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                </IconButton>
              </div>
            </div>

            <div className="relative flex min-h-0 flex-1 flex-col">
              <div
                ref={listRef}
                className="flex-1 overflow-y-auto px-4 py-5 [scrollbar-color:rgba(255,255,255,0.15)_transparent] [scrollbar-width:thin]"
                aria-live="polite"
              >
                <div className={`flex flex-col gap-6 ${column}`}>
                  {messages.length === 0 ? (
                    <div className="flex flex-col gap-7 pt-2">
                      <div className="flex flex-col items-start gap-4">
                        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-2.5 shadow-[0_10px_30px_-10px_rgba(46,168,255,0.6)]">
                          <img src={logo} alt="" className="h-full w-full object-contain" />
                        </span>
                        <div>
                          <h2 className="font-display text-[28px] leading-tight text-white">{t("chat.welcomeTitle")}</h2>
                          <p className="mt-1.5 text-sm leading-relaxed text-white/60">{t("chat.welcomeBody")}</p>
                        </div>
                      </div>
                      <QuickActions title={t("chat.quickActions")} items={SUGGESTIONS.map((key) => t(key))} onPick={(q) => void send(q)} />
                    </div>
                  ) : (
                    messages.map((m) =>
                      m.role === "user" ? (
                        <div key={m.id} className="ml-auto flex max-w-[85%] flex-col items-end gap-1.5">
                          {m.image && (
                            <img src={m.image} alt={t("chat.imageAlt")} className="max-h-56 rounded-2xl object-cover ring-1 ring-white/10" />
                          )}
                          {!m.image && m.hadImage && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1 text-[11px] text-white/60">
                              <ImageIcon className="h-3.5 w-3.5" />
                              {t("chat.imageAttached")}
                            </span>
                          )}
                          {m.content && (
                            <div className="whitespace-pre-line break-words rounded-2xl rounded-br-md bg-navy-700 px-4 py-2.5 text-[14.5px] leading-relaxed text-white ring-1 ring-aftech/30">
                              {m.content}
                            </div>
                          )}
                        </div>
                      ) : (
                        renderAssistant(m)
                      ),
                    )
                  )}

                  {sending && (
                    <div className="flex gap-3" role="status" aria-label={t("chat.typing")}>
                      <Avatar />
                      <div className="flex items-center gap-1.5 pt-1">
                        {[0, 160, 320].map((delay) => (
                          <span
                            key={delay}
                            className="h-2 w-2 rounded-full bg-aftech-bright/70 motion-safe:animate-bounce"
                            style={{ animationDelay: `${delay}ms` }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="flex items-center gap-2.5 rounded-xl bg-red-500/10 px-3.5 py-2.5 text-[13px] leading-snug text-red-200 ring-1 ring-red-400/20">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span className="flex-1">{error}</span>
                      {(input.trim() || attachment) && !atLimit && (
                        <button
                          type="button"
                          onClick={() => void send(input)}
                          className="shrink-0 rounded-md px-2 py-1 font-medium text-white transition hover:bg-white/10"
                        >
                          {t("chat.retry")}
                        </button>
                      )}
                    </div>
                  )}

                  {atLimit && (
                    <div className="flex flex-col gap-3 rounded-xl bg-navy-800 p-4 text-[13px] leading-relaxed text-white/85 ring-1 ring-white/[0.08]">
                      <p>{t("chat.limitReached")}</p>
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={WHATSAPP_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg bg-aftech px-3.5 py-2 text-xs font-medium text-white transition hover:bg-[#0F6BBE]"
                        >
                          <WhatsAppIcon className="h-3.5 w-3.5" /> {t("chat.whatsappCta")}
                        </a>
                        <button
                          type="button"
                          onClick={startNew}
                          className="inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium text-white/85 ring-1 ring-white/15 transition hover:bg-white/[0.06]"
                        >
                          <RotateCcw className="h-3.5 w-3.5" /> {t("chat.newChat")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="shrink-0 px-3 pb-3 pt-1">
                <div className={column}>
                  <div
                    className={`rounded-2xl p-px transition focus-within:bg-gradient-to-r focus-within:from-aftech focus-within:via-aftech-bright focus-within:to-aftech focus-within:shadow-[0_0_32px_-10px_rgba(46,168,255,0.6)] ${
                      dictation.listening
                        ? "bg-gradient-to-r from-aftech via-aftech-bright to-aftech shadow-[0_0_32px_-10px_rgba(46,168,255,0.6)]"
                        : "bg-white/10"
                    }`}
                  >
                    <div className="rounded-[15px] bg-navy-800 px-3 pb-2 pt-3">
                      {attachment && (
                        <div className="relative mb-2.5 ml-1 inline-block">
                          <img src={attachment} alt={t("chat.imageAlt")} className="h-16 w-16 rounded-lg object-cover ring-1 ring-white/10" />
                          <button
                            type="button"
                            onClick={() => setAttachment(null)}
                            aria-label={t("chat.removeImage")}
                            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-deep-navy text-white ring-1 ring-white/20 transition hover:bg-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                      <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        rows={1}
                        maxLength={MAX_CHARS}
                        disabled={atLimit}
                        placeholder={dictation.listening ? t("chat.listening") : t("chat.placeholder")}
                        aria-label={t("chat.placeholder")}
                        className="block max-h-[132px] w-full resize-none bg-transparent px-1 text-[14.5px] leading-relaxed text-white outline-none placeholder:text-white/40 focus-visible:outline-none disabled:cursor-not-allowed"
                      />
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => fileRef.current?.click()}
                          disabled={atLimit || sending}
                          aria-label={t("chat.attach")}
                          title={t("chat.attach")}
                          className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aftech-bright disabled:opacity-30"
                        >
                          <Plus className="h-5 w-5" />
                        </button>
                        <input
                          ref={fileRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleFileChange}
                          className="hidden"
                          tabIndex={-1}
                        />
                        <div className="flex items-center gap-2">
                          {nearLimit && (
                            <span className="text-[11px] tabular-nums text-white/40">
                              {input.length}/{MAX_CHARS}
                            </span>
                          )}
                          {showMic ? (
                            <button
                              type="button"
                              onClick={toggleMic}
                              disabled={atLimit}
                              aria-label={dictation.listening ? t("chat.micStop") : t("chat.mic")}
                              aria-pressed={dictation.listening}
                              title={dictation.listening ? t("chat.micStop") : t("chat.mic")}
                              className={`rounded-full bg-gradient-to-br from-aftech-bright to-aftech p-[1.5px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aftech-bright focus-visible:ring-offset-2 focus-visible:ring-offset-navy-800 disabled:opacity-30 ${
                                dictation.listening ? "motion-safe:animate-pulse" : ""
                              }`}
                            >
                              <span
                                className={`flex h-10 w-10 items-center justify-center rounded-full text-white ${
                                  dictation.listening ? "bg-red-500" : "bg-navy-800 hover:bg-navy-700"
                                }`}
                              >
                                {dictation.listening ? <Square className="h-3.5 w-3.5" fill="currentColor" /> : <Mic className="h-[18px] w-[18px]" />}
                              </span>
                            </button>
                          ) : (
                            <button
                              type="submit"
                              disabled={sending || atLimit || (!input.trim() && !attachment)}
                              aria-label={t("chat.send")}
                              className="flex h-10 w-10 items-center justify-center rounded-full bg-aftech text-white transition hover:bg-aftech-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aftech-bright focus-visible:ring-offset-2 focus-visible:ring-offset-navy-800 disabled:bg-white/10 disabled:text-white/30"
                            >
                              <ArrowUp className="h-[18px] w-[18px]" strokeWidth={2.25} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-center text-[11px] leading-snug text-white/40">
                    {t("chat.disclaimer")}{" "}
                    <Link to="/contact" onClick={handleNavigate} className="text-aftech-bright underline-offset-2 hover:underline">
                      {t("chat.contactLink")}
                    </Link>
                    .
                  </p>
                </div>
              </form>

              <AnimatePresence>
                {historyOpen && (
                  <HistoryPanel
                    conversations={history}
                    activeId={convId}
                    locale={locale}
                    t={t}
                    onOpen={openConversation}
                    onDelete={removeConversation}
                    onNew={startNew}
                    onClose={() => setHistoryOpen(false)}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? t("chat.close") : t("chat.open")}
        className={`fixed bottom-5 right-4 z-30 flex h-14 items-center rounded-full bg-deep-navy text-white shadow-[0_12px_32px_-12px_rgba(4,17,29,0.7)] ring-1 ring-white/20 transition hover:bg-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aftech-bright focus-visible:ring-offset-2 sm:right-6 ${
          open ? "w-14 justify-center" : "gap-3 pl-2 pr-2 sm:pr-5"
        }`}
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white p-1.5">
              <img src={logo} alt="" className="h-full w-full object-contain" />
              <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-deep-navy" aria-hidden="true" />
            </span>
            <span className="hidden text-sm font-medium sm:inline">{t("chat.launcher")}</span>
          </>
        )}
      </button>
    </>
  );
}
